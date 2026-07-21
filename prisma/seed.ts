/**
 * Seed script — provisions a demo org, all system roles, a demo admin user,
 * and sample CRM data for local development and QA.
 *
 * Run: npm run db:seed
 *
 * Note: the demo user's `authUserId` must match a Supabase Auth user you
 * create (email below). Create it in the Supabase dashboard, then set
 * SEED_AUTH_USER_ID to its UUID (or update the row afterward).
 */
import { PrismaClient, Prisma } from '@prisma/client';
import { SYSTEM_ROLES } from '../src/lib/rbac/roles';

const prisma = new PrismaClient();

const DEMO_ORG_SLUG = 'tushar-celebrations';
const DEMO_EMAIL = 'admin@tusharcelebrations.com';

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: DEMO_ORG_SLUG },
    update: {},
    create: {
      name: 'Tushar Celebrations',
      slug: DEMO_ORG_SLUG,
      currency: 'INR',
      gstNumber: '27ABCDE1234F1Z5',
    },
  });

  // System roles for this org.
  for (const role of SYSTEM_ROLES) {
    await prisma.role.upsert({
      where: { orgId_key: { orgId: org.id, key: role.key } },
      update: { permissions: role.permissions as Prisma.InputJsonValue },
      create: {
        orgId: org.id,
        key: role.key,
        name: role.name,
        description: role.description,
        permissions: role.permissions as Prisma.InputJsonValue,
        isSystem: true,
      },
    });
  }

  const ownerRole = await prisma.role.findUniqueOrThrow({
    where: { orgId_key: { orgId: org.id, key: 'SUPER_ADMIN' } },
  });

  const authUserId = process.env.SEED_AUTH_USER_ID ?? 'seed-auth-user-id';
  await prisma.user.upsert({
    where: { authUserId },
    update: { orgId: org.id, roleId: ownerRole.id },
    create: {
      orgId: org.id,
      authUserId,
      email: DEMO_EMAIL,
      fullName: 'Demo Admin',
      roleId: ownerRole.id,
    },
  });

  // Sample customers + enquiries (only when empty).
  const existing = await prisma.customer.count({ where: { orgId: org.id } });
  if (existing === 0) {
    const samples = [
      { name: 'Sharma Family', phone: '+91 98200 11111', eventType: 'Wedding', stage: 'FOLLOW_UP' as const, budget: 500000, guests: 250 },
      { name: 'Iyer Corp', phone: '+91 98200 22222', eventType: 'Corporate Offsite', stage: 'NEGOTIATION' as const, budget: 900000, guests: 150 },
      { name: 'Reddy Family', phone: '+91 98200 33333', eventType: 'Reception', stage: 'NEW' as const, budget: 250000, guests: 180 },
      { name: 'Mehta Family', phone: '+91 98200 44444', eventType: 'Wedding', stage: 'QUOTATION_SENT' as const, budget: 600000, guests: 300 },
    ];

    let seq = 1;
    for (const s of samples) {
      const customer = await prisma.customer.create({
        data: { orgId: org.id, name: s.name, phone: s.phone },
      });
      const enquiry = await prisma.enquiry.create({
        data: {
          orgId: org.id,
          code: `ENQ-${new Date().getFullYear()}-${String(seq++).padStart(6, '0')}`,
          customerId: customer.id,
          eventType: s.eventType,
          expectedGuests: s.guests,
          budget: new Prisma.Decimal(s.budget),
          source: 'REFERRAL',
          stage: s.stage,
        },
      });
      await prisma.pipelineEvent.create({
        data: { enquiryId: enquiry.id, fromStage: null, toStage: 'NEW' },
      });
    }
    console.log(`Seeded ${samples.length} demo customers + enquiries.`);
  }

  console.log('Seed complete. Org:', org.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
