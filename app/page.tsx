import HomeLanding from "@/components/HomeLanding";

const packagePaymentUrl = process.env.NEXT_PUBLIC_WEBSITE_COMPLETION_PACKAGE_PAYMENT_URL || "";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MindReply",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.mind-reply.com/",
  inLanguage: ["en", "es", "fr", "de", "it", "pt", "nl", "pl", "uk", "bg"],
  description:
    "MindReply is premium reply intelligence for overloaded operators: AI decision support, confident email replies, Website Completion Package delivery, and buyer-ready website communication.",
  featureList: [
    "MRagent pressure read",
    "AI decision support",
    "AI email reply assistant",
    "Website Completion Package",
    "Ranked action queue",
    "Send-ready copy",
    "Privacy-safe receipt",
    "Country and browser language detection",
  ],
  offers: {
    "@type": "Offer",
    name: "Website Completion Package",
    price: "600",
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
    url: "https://www.mind-reply.com/website-completion-package",
  },
  brand: {
    "@type": "Brand",
    name: "MindReply",
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomeLanding packagePaymentUrl={packagePaymentUrl} />
    </>
  );
}
