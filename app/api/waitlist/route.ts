import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Placeholder implementation for now:
    // this keeps the homepage form functional until persistence is wired.
    return NextResponse.json({
      ok: true,
      message: 'Waitlist submission received',
      email,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: true, message: 'Use POST to submit a waitlist email' },
    { status: 200 }
  );
}
