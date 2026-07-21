import { getPipelineBoard } from './queries';
import { EnquiryCard } from './enquiry-card';
import { STAGE_META } from './config';

type BoardData = Awaited<ReturnType<typeof getPipelineBoard>>;

export function PipelineBoard({ data }: { data: BoardData }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-flow-col auto-cols-[minmax(240px,1fr)] gap-3 overflow-x-auto pb-2">
        {data.board.map((column) => {
          const meta = STAGE_META[column.stage];
          return (
            <section
              key={column.stage}
              className="flex min-w-0 flex-col rounded-lg bg-muted/40"
              aria-label={meta.label}
            >
              <header className="flex items-center justify-between px-3 py-2.5">
                <span className="text-sm font-medium">{meta.label}</span>
                <span className="rounded-full bg-background px-2 text-xs tabular-nums text-muted-foreground">
                  {column.items.length}
                </span>
              </header>
              <div className="flex flex-col gap-2 px-2 pb-3">
                {column.items.length === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                    Nothing here
                  </p>
                ) : (
                  column.items.map((enquiry) => (
                    <EnquiryCard key={enquiry.id} enquiry={enquiry} />
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>

      {data.lost.length > 0 && (
        <details className="rounded-lg border bg-card p-3">
          <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
            Lost ({data.lost.length})
          </summary>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {data.lost.map((enquiry) => (
              <EnquiryCard key={enquiry.id} enquiry={enquiry} showStage />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
