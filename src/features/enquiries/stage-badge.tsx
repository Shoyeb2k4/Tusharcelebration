import type { EnquiryStage } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { STAGE_META } from './config';

export function StageBadge({ stage }: { stage: EnquiryStage }) {
  const meta = STAGE_META[stage];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}
