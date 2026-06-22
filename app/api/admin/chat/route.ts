import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
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
