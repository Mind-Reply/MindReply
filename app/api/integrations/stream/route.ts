import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.stream(
    async (controller) => {
      const sendUpdate = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      try {
        // Send initial data
        sendUpdate({ type: 'stripe', message: 'Connected' });
        
        // Simulate updates every 30 seconds
        let count = 0;
        const interval = setInterval(() => {
          if (count < 100) {
            const updates = [
              { type: 'stripe', revenue: Math.random() * 10000 },
              { type: 'gmail', unread: Math.floor(Math.random() * 100) },
              { type: 'youtube', views: Math.floor(Math.random() * 1000000) },
            ];
            sendUpdate(updates[Math.floor(Math.random() * updates.length)]);
            count++;
          } else {
            clearInterval(interval);
            controller.close();
          }
        }, 5000);
      } catch (error) {
        console.error('Stream error:', error);
        controller.close();
      }
    },
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  );
}
