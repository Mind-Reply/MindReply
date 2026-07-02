import type { Metadata } from 'next';
import { ChatConsole } from './ChatConsole';

export const metadata: Metadata = {
  title: 'Command Chat — MindReply Owner Cockpit',
};

export default function ChatPage() {
  return (
    <div>
      <h1 style={{ fontSize: 18, margin: '4px 0 4px' }}>Private Command Chat</h1>
      <p style={{ color: '#8a91a3', fontSize: 13, margin: '0 0 16px' }}>
        Local command router. Risky actions are gated and marked APPROVAL REQUIRED. Nothing sends, publishes, or deploys from
        here.
      </p>
      <ChatConsole />
    </div>
  );
}
