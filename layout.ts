export const metadata = {
  title: "MindReply Clean",
  description: "Clean Next.js base"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
