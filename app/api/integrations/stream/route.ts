export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const sendUpdate = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send initial data
      sendUpdate({ type: 'stripe', message: 'Connected' });

      // Simulate updates every 5 seconds
      let count = 0;
      const interval = setInterval(() => {
        try {
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
        } catch (error) {
          console.error('Stream error:', error);
          clearInterval(interval);
        }
      }, 5000);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
