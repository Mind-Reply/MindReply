import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    activeUsers: Math.floor(Math.random() * 10000),
    pageViews: Math.floor(Math.random() * 100000),
    conversionRate: (Math.random() * 10).toFixed(2),
    avgSessionDuration: Math.floor(Math.random() * 600),
    status: 'connected',
    lastUpdated: new Date().toISOString(),
  });
}
