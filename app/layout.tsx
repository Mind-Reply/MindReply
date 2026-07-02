import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'MindReply Studio',
  description: 'Campaign production for briefs, copy, launch checklists, and visual direction.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
