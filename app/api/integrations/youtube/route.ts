import { NextResponse } from 'next/server';
import { youtube } from '../../../../lib/clients/google';

export async function GET() {
  try {
    const channels = await youtube.channels.list({
      part: ['statistics', 'snippet'],
      mine: true,
    });

    const stats = channels.data.items?.[0]?.statistics;

    return NextResponse.json({
      subscribers: parseInt(stats?.subscriberCount || '0'),
      views: parseInt(stats?.viewCount || '0'),
      videos: parseInt(stats?.videoCount || '0'),
      status: 'connected',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('YouTube error:', error);
    return NextResponse.json(
      { subscribers: 0, views: 0, videos: 0, status: 'error' },
      { status: 200 }
    );
  }
}
