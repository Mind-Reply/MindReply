import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 });
    }

    const inputHash = crypto.createHash('sha256').update(password).digest('hex');
    const storedHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(storedHash))) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const secret = process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD;
    const payload = JSON.stringify({ admin: true, exp: Date.now() + 24 * 60 * 60 * 1000 });
    const signature = crypto.createHmac('sha256', secret!).update(payload).digest('hex');
    const token = Buffer.from(payload).toString('base64') + '.' + signature;

    return NextResponse.json({ token, success: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
