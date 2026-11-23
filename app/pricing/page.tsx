import { SiteNav, Footer } from "@/components/landing/sections";
import { PricingSection } from "@/components/landing/dusk";

export const metadata = {
  title: "Pricing — notchbud",
  description: "Start free. notchbud runs on your own Groq key.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-brand-950 antialiased">
      <SiteNav />
      <div className="pt-[120px]">
        <PricingSection />
      </div>
      <Footer />
    </main>
  );
}
