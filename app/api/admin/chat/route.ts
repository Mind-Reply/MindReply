import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function verifyAdminToken(token: string | null): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  try {
    const payload = Buffer.from(parts[0], 'base64').toString();
    const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedSig))) return false;

    const parsed = JSON.parse(payload);
    if (!parsed.admin || (parsed.exp && parsed.exp < Date.now())) return false;
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { message: { id: '1', role: 'assistant', content: 'Claude API key not configured', timestamp: Date.now() } },
        { status: 200 }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = (await response.json()) as any;
    const content = data.content?.[0]?.text || 'No response';

    return NextResponse.json({
      message: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    return NextResponse.json({
      message: {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Error processing message',
        timestamp: Date.now(),
      },
    });
  }
}
