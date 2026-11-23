import { PRODUCT, SITE_URL } from "@/lib/agent-content";

import { SiteNav, Hero, Footer } from "@/components/landing/sections";
import {
  DemoSection,
  BigStatement,
  JobsSection,
  WhereSection,
  PricingSection,
  NativeSection,
  FaqSection,
} from "@/components/landing/dusk";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "SoftwareApplication",
        name: PRODUCT.name, url: SITE_URL, description: PRODUCT.description,
        operatingSystem: PRODUCT.operatingSystem, applicationCategory: "ProductivityApplication",
        keywords: "Windows AI desktop assistant, dynamic island",
      }).replace(/</g, "\\u003c") }} />
      <SiteNav />
      <Hero />
      <noscript>
        <section className="mx-auto grid max-w-[720px] gap-6 px-6 py-4 text-sm text-slate-600">
          <h2 className="text-base font-semibold text-brand-950">About notchbud</h2>
          <p>notchbud is a Windows AI desktop assistant that sits in a small dynamic island at the top of your screen. Hover the notch to open it, type a question, and read the answer as it streams. You can keep working in your current window without opening a browser tab for each question. The interactive website preview needs JavaScript and shows a sample response; it is not a live AI chat.</p>
          <p>To get real answers, download the Windows x64 installer and run it for your user. The installer does not require administrator rights. The app uses WebView2 and your own Groq API key. Create a key through your Groq account, then enter it directly in the desktop island. You do not need a notchbud account to use the desktop app. Mac and Linux versions are not available yet.</p>
          <p>Chat history stays on your computer. Windows DPAPI protects your API key on your device. Your prompts and any attached screenshots are sent to Groq to generate responses. The app is free with no trial timer; Groq usage limits and pricing apply separately to your key. If an answer does not stream, check your connection and Groq usage limits before trying again.</p>
          <p>Screenshot questions let you ask about something visible on your screen. Hover the notch when you need help, and move away to collapse the island when you are done. For installation instructions, read the docs. For troubleshooting, contact support with your Windows version, app version, what happened, and what you expected. Do not include your API key in a support message.</p>
          <p><a href="/download">Download notchbud</a> · <a href="/docs">Setup documentation</a> · <a href="/support">Support</a> · <a href="/llms.txt">Agent instructions</a></p>
        </section>
      </noscript>
      <DemoSection />
      <BigStatement />
      <JobsSection />
      <WhereSection />
      <PricingSection />
      <NativeSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
