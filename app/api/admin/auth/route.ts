import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    
    const token = Buffer.from(JSON.stringify({ 
      admin: true, 
      timestamp: Date.now() 
    })).toString('base64');
    
    return NextResponse.json({ token, success: true });
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
