import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Liveness probe for uptime checks and load balancers. */
export function GET() {
  return NextResponse.json({ status: 'ok', ts: new Date().toISOString() });
}
