'use server';

import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { authorize } from '@/lib/auth/guard';
import { audit } from '@/lib/audit';
import { nextEnquiryCode } from '@/lib/codes';
import {
  type ActionResult,
  ok,
  fail,
  parseInput,
  toActionError,
} from '@/lib/action';
import {
  createEnquirySchema,
  changeStageSchema,
  createFollowUpSchema,
  completeFollowUpSchema,
  noteSchema,
  attachmentSchema,
} from './schema';
import { canTransition } from './config';

const clean = (v?: string) => (v && v.trim() ? v.trim() : null);

export async function createEnquiry(
  input: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await authorize('create', 'enquiry');
    const parsed = parseInput(createEnquirySchema, input);
    if (!parsed.success) return parsed.result;
    const d = parsed.data;

    const customer = await prisma.customer.findFirst({
      where: { id: d.customerId, orgId: user.orgId },
      select: { id: true },
    });
    if (!customer) return fail('Selected customer was not found.');

    // Retry once on the (rare) code-collision from concurrent creates.
    let id: string | null = null;
    for (let attempt = 0; attempt < 2 && !id; attempt++) {
      const code = await nextEnquiryCode(user.orgId);
      try {
        const created = await prisma.$transaction(async (tx) => {
          const enquiry = await tx.enquiry.create({
            data: {
              orgId: user.orgId,
              code,
              customerId: d.customerId,
              eventType: d.eventType.trim(),
              eventDate: d.eventDate ?? null,
              expectedGuests: d.expectedGuests ?? null,
              budget:
                d.budget != null ? new Prisma.Decimal(d.budget) : null,
              source: d.source,
              requirements: clean(d.requirements),
              stage: 'NEW',
              ownerId: user.userId,
            },
            select: { id: true },
          });
          await tx.pipelineEvent.create({
            data: {
              enquiryId: enquiry.id,
              fromStage: null,
              toStage: 'NEW',
              actorId: user.userId,
            },
          });
          return enquiry;
        });
        id = created.id;
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002' &&
          attempt === 0
        ) {
          continue; // regenerate code and retry
        }
        throw e;
      }
    }

    if (!id) return fail('Could not create the enquiry. Please try again.');

    await audit({
      orgId: user.orgId,
      actorId: user.userId,
      action: 'create',
      resource: 'Enquiry',
      resourceId: id,
      after: d,
    });

    revalidatePath('/enquiries');
    return ok({ id });
  } catch (err) {
    return toActionError(err);
  }
}

export async function changeStage(input: unknown): Promise<ActionResult> {
  try {
    const user = await authorize('update', 'enquiry');
    const parsed = parseInput(changeStageSchema, input);
    if (!parsed.success) return parsed.result;
    const { enquiryId, toStage, note, lostReason } = parsed.data;

    const enquiry = await prisma.enquiry.findFirst({
      where: { id: enquiryId, orgId: user.orgId },
      select: { id: true, stage: true, firstResponseAt: true },
    });
    if (!enquiry) return fail('Enquiry not found.');

    if (!canTransition(enquiry.stage, toStage)) {
      return fail(
        `Cannot move an enquiry from ${enquiry.stage} to ${toStage}.`,
      );
    }
    if (toStage === 'LOST' && !clean(lostReason)) {
      return fail('A reason is required to mark an enquiry as lost.', {
        lostReason: ['Please provide a reason.'],
      });
    }

    await prisma.$transaction([
      prisma.enquiry.update({
        where: { id: enquiryId },
        data: {
          stage: toStage,
          lostReason: toStage === 'LOST' ? clean(lostReason) : null,
          firstResponseAt: enquiry.firstResponseAt ?? new Date(),
        },
      }),
      prisma.pipelineEvent.create({
        data: {
          enquiryId,
          fromStage: enquiry.stage,
          toStage,
          actorId: user.userId,
          note: clean(note) ?? clean(lostReason),
        },
      }),
    ]);

    await audit({
      orgId: user.orgId,
      actorId: user.userId,
      action: 'update',
      resource: 'Enquiry',
      resourceId: enquiryId,
      before: { stage: enquiry.stage },
      after: { stage: toStage },
    });

    revalidatePath('/enquiries');
    revalidatePath(`/enquiries/${enquiryId}`);
    return ok(undefined);
  } catch (err) {
    return toActionError(err);
  }
}

export async function addFollowUp(input: unknown): Promise<ActionResult> {
  try {
    const user = await authorize('update', 'enquiry');
    const parsed = parseInput(createFollowUpSchema, input);
    if (!parsed.success) return parsed.result;
    const { enquiryId, dueAt, channel, note } = parsed.data;

    const enquiry = await prisma.enquiry.findFirst({
      where: { id: enquiryId, orgId: user.orgId },
      select: { id: true, firstResponseAt: true },
    });
    if (!enquiry) return fail('Enquiry not found.');

    await prisma.$transaction([
      prisma.followUp.create({
        data: { enquiryId, dueAt, channel, note: clean(note) },
      }),
      prisma.enquiry.update({
        where: { id: enquiryId },
        data: { firstResponseAt: enquiry.firstResponseAt ?? new Date() },
      }),
    ]);

    revalidatePath(`/enquiries/${enquiryId}`);
    return ok(undefined);
  } catch (err) {
    return toActionError(err);
  }
}

export async function completeFollowUp(
  input: unknown,
): Promise<ActionResult> {
  try {
    const user = await authorize('update', 'enquiry');
    const parsed = parseInput(completeFollowUpSchema, input);
    if (!parsed.success) return parsed.result;
    const { followUpId, outcome } = parsed.data;

    const followUp = await prisma.followUp.findFirst({
      where: { id: followUpId, enquiry: { orgId: user.orgId } },
      select: { id: true, enquiryId: true, completedAt: true },
    });
    if (!followUp) return fail('Follow-up not found.');
    if (followUp.completedAt) return fail('Follow-up is already completed.');

    await prisma.followUp.update({
      where: { id: followUpId },
      data: { completedAt: new Date(), outcome: clean(outcome) },
    });

    revalidatePath(`/enquiries/${followUp.enquiryId}`);
    return ok(undefined);
  } catch (err) {
    return toActionError(err);
  }
}

export async function addNote(input: unknown): Promise<ActionResult> {
  try {
    const parsed = parseInput(noteSchema, input);
    if (!parsed.success) return parsed.result;
    const { body, customerId, enquiryId } = parsed.data;
    if (!customerId && !enquiryId) {
      return fail('A note must be attached to a customer or enquiry.');
    }

    // Authorize against the resource being annotated.
    const user = await authorize('update', enquiryId ? 'enquiry' : 'customer');

    // Tenant-scope the parent record.
    if (enquiryId) {
      const found = await prisma.enquiry.findFirst({
        where: { id: enquiryId, orgId: user.orgId },
        select: { id: true },
      });
      if (!found) return fail('Enquiry not found.');
    }
    if (customerId) {
      const found = await prisma.customer.findFirst({
        where: { id: customerId, orgId: user.orgId },
        select: { id: true },
      });
      if (!found) return fail('Customer not found.');
    }

    await prisma.note.create({
      data: {
        orgId: user.orgId,
        customerId: customerId ?? null,
        enquiryId: enquiryId ?? null,
        authorId: user.userId,
        authorName: user.fullName,
        body: body.trim(),
      },
    });

    if (enquiryId) revalidatePath(`/enquiries/${enquiryId}`);
    if (customerId) revalidatePath(`/customers/${customerId}`);
    return ok(undefined);
  } catch (err) {
    return toActionError(err);
  }
}

export async function deleteNote(noteId: string): Promise<ActionResult> {
  try {
    const user = await authorize('update', 'enquiry');
    const note = await prisma.note.findFirst({
      where: { id: noteId, orgId: user.orgId },
      select: { id: true, enquiryId: true, customerId: true },
    });
    if (!note) return fail('Note not found.');

    await prisma.note.delete({ where: { id: noteId } });
    if (note.enquiryId) revalidatePath(`/enquiries/${note.enquiryId}`);
    if (note.customerId) revalidatePath(`/customers/${note.customerId}`);
    return ok(undefined);
  } catch (err) {
    return toActionError(err);
  }
}

export async function addAttachment(input: unknown): Promise<ActionResult> {
  try {
    const user = await authorize('update', 'enquiry');
    const parsed = parseInput(attachmentSchema, input);
    if (!parsed.success) return parsed.result;
    const { enquiryId, fileUrl, caption, kind } = parsed.data;

    const enquiry = await prisma.enquiry.findFirst({
      where: { id: enquiryId, orgId: user.orgId },
      select: { id: true },
    });
    if (!enquiry) return fail('Enquiry not found.');

    await prisma.attachment.create({
      data: { enquiryId, fileUrl, caption: clean(caption), kind },
    });

    revalidatePath(`/enquiries/${enquiryId}`);
    return ok(undefined);
  } catch (err) {
    return toActionError(err);
  }
}
