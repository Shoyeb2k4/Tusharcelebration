import type { Metadata } from 'next';
import { GitBranch } from 'lucide-react';
import { requireUser } from '@/lib/auth/session';
import { assertCan } from '@/lib/rbac';
import { PageHeader } from '@/components/common/page-header';
import { EmptyState } from '@/components/common/empty-state';
import { SearchInput } from '@/components/common/search-input';
import { enquiryFilterSchema } from '@/features/enquiries/schema';
import { getPipelineBoard, listEnquiries } from '@/features/enquiries/queries';
import { PipelineBoard } from '@/features/enquiries/pipeline-board';
import { EnquiryListTable } from '@/features/enquiries/enquiry-list-table';
import { EnquiryDialog } from '@/features/enquiries/enquiry-dialog';
import { ViewToggle, SourceFilter } from '@/features/enquiries/enquiry-filters';

export const metadata: Metadata = { title: 'Enquiries' };

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: { q?: string; source?: string; view?: string };
}) {
  const user = await requireUser();
  assertCan(user, 'read', 'enquiry');

  const filter = enquiryFilterSchema.parse({
    q: searchParams.q,
    source: searchParams.source,
  });
  const view = searchParams.view === 'list' ? 'list' : 'board';
  const canCreate = user.permissions.enquiry?.includes('create');

  const [board, list] =
    view === 'list'
      ? [null, await listEnquiries(user.orgId, filter)]
      : [await getPipelineBoard(user.orgId, filter), null];

  const isEmpty =
    view === 'list'
      ? (list?.length ?? 0) === 0
      : board?.board.every((c) => c.items.length === 0) && board.lost.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        description="Your lead pipeline — from first enquiry to confirmed booking."
        actions={canCreate ? <EnquiryDialog /> : undefined}
      />

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search enquiries, customers…" />
        <SourceFilter />
        <div className="ml-auto">
          <ViewToggle />
        </div>
      </div>

      {isEmpty ? (
        <EmptyState
          icon={GitBranch}
          title={filter.q ? 'No matching enquiries' : 'No enquiries yet'}
          description={
            filter.q
              ? 'Try a different search or filter.'
              : 'Capture your first lead to start the pipeline.'
          }
          action={canCreate && !filter.q ? <EnquiryDialog /> : undefined}
        />
      ) : view === 'list' ? (
        <EnquiryListTable enquiries={list!} />
      ) : (
        <PipelineBoard data={board!} />
      )}
    </div>
  );
}
