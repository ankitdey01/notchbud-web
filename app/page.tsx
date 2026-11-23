"use client";

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
      <SiteNav />
      <Hero />
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
