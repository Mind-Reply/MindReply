import { NextResponse } from 'next/server';

// Analytics endpoint for tracking 60K visitor campaign

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, source, userId, data } = body;

    // Log event
    console.log(`[ANALYTICS] ${event} from ${source}`, {
      timestamp: new Date().toISOString(),
      userId,
      data
    });

    // Track to database
    const trackingData = {
      event,
      source,
      userId,
      timestamp: new Date(),
      data,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      ipCountry: request.headers.get('cf-ipcountry'),
    };

    // Send to analytics (Google Analytics, Mixpanel, etc)
    await sendToAnalytics(trackingData);

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('[ANALYTICS ERROR]', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}

async function sendToAnalytics(data: any) {
  // Best-effort: fire calls in parallel, log failures but don't block the caller

  // Send to Google Analytics
  if (process.env.GA_MEASUREMENT_ID) {
    fetch('https://www.google-analytics.com/mp/collect', {
      method: 'POST',
      body: JSON.stringify({
        measurement_id: process.env.GA_MEASUREMENT_ID,
        api_secret: process.env.GA_API_SECRET,
        events: [{
          name: data.event,
          params: {
            source: data.source,
            user_id: data.userId,
            session_id: data.data?.sessionId,
            ...data.data
          }
        }]
      })
    }).then(res => {
      if (!res.ok) console.error('GA request failed:', res.status, res.statusText);
    }).catch(err => console.error('GA error:', err));
  }

  // Send to Slack for real-time monitoring
  if (process.env.SLACK_WEBHOOK) {
    fetch(process.env.SLACK_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify({
        text: `📊 ${data.event}: ${data.source} (${data.data?.value || '1'})`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${data.event}*\n📍 ${data.source}\n⏰ ${data.timestamp.toLocaleString()}`
            }
          }
        ]
      })
    }).then(res => {
      if (!res.ok) console.error('Slack request failed:', res.status, res.statusText);
    }).catch(err => console.error('Slack error:', err));
  }
}
