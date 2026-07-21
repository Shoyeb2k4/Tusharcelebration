import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StageBadge } from './stage-badge';
import { STAGE_META } from './config';

describe('StageBadge', () => {
  it('renders the human label for a stage', () => {
    render(<StageBadge stage="QUOTATION_SENT" />);
    expect(screen.getByText(STAGE_META.QUOTATION_SENT.label)).toBeInTheDocument();
  });

  it('renders the Lost label', () => {
    render(<StageBadge stage="LOST" />);
    expect(screen.getByText('Lost')).toBeInTheDocument();
  });
});
