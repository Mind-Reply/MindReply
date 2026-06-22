import { NextRequest, NextResponse } from 'next/server';
import { callClaudeWithAllConnectors } from '@/lib/admin/connectors';
import { verifyAdminAuth } from './auth/route';

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req as any)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { message } = await req.json();

  try {
    const result = await callClaudeWithAllConnectors(message);
    
    return NextResponse.json({
      message: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result.response,
        timestamp: Date.now(),
        sources: result.connectors_used,
        data_accessed: Object.keys(result.data_sources),
      },
    });
  } catch (error) {
    console.error('Claude API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
