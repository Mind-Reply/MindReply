import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const gmail = google.gmail({
  version: 'v1',
  auth: new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  ),
});

export async function GET() {
  try {
    const result = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
    });

    const allMessages = await gmail.users.messages.list({
      userId: 'me',
    });

    return NextResponse.json({
      unread: result.data.resultSizeEstimate || 0,
      totalEmails: allMessages.data.resultSizeEstimate || 0,
      status: 'connected',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Gmail error:', error);
    return NextResponse.json(
      { unread: 0, totalEmails: 0, status: 'error' },
      { status: 200 }
    );
  }
}
