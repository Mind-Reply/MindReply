// lib/api-client.ts
export const apiClient = {
  async getStripeData() {
    const res = await fetch('/api/integrations/stripe');
    return res.json();
  },

  async getGmailData() {
    const res = await fetch('/api/integrations/gmail');
    return res.json();
  },

  async getYoutubeData() {
    const res = await fetch('/api/integrations/youtube');
    return res.json();
  },

  async getAnalytics() {
    const res = await fetch('/api/integrations/analytics');
    return res.json();
  },

  async sendChatMessage(message: string) {
    const res = await fetch('/api/admin/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return res.json();
  },

  async subscribeToUpdates(callback: (data: any) => void) {
    const eventSource = new EventSource('/api/integrations/stream');
    eventSource.onmessage = (e) => callback(JSON.parse(e.data));
    return () => eventSource.close();
  },
};
