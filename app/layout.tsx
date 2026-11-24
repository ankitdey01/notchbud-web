import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { LenisProvider } from "@/components/ui/lenis-provider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "notchbud — Windows AI desktop assistant",
  metadataBase: new URL("https://notchbud.vercel.app"),
  keywords: ["notchbud", "Windows AI desktop assistant", "dynamic island"],
  description:
    "Hover the notch. Ask. Answers stream inside the island — billed to your own Groq API key. No server, key sealed on your device.",
  icons: {
    icon: "/logorounded.webp",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "notchbud — Windows AI desktop assistant",
    description:
      "Hover the notch. Ask. Answers stream inside the island — billed to your own Groq API key.",
    images: [{ url: "/og.png", width: 1897, height: 1079, alt: "notchbud hero" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "notchbud — Windows AI desktop assistant",
    description:
      "Hover the notch. Ask. Answers stream inside the island — billed to your own Groq API key.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#007AFF",
          colorBackground: "#ffffff",
          colorForeground: "#001F40",
          colorMutedForeground: "#64748b",
          colorInput: "#EBF4FF",
          colorInputForeground: "#001F40",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        },
        elements: {
          // Match the site: 16px layer-card with hairline ring, semibold
          // ink headings, slate body text, full-pill buttons.
          modalContent: "rounded-2xl",
          card: "rounded-2xl shadow-[0_8px_30px_-12px_rgba(0,20,60,0.35)] ring-1 ring-kumo-line",
          headerTitle: "font-semibold text-brand-950",
          headerSubtitle: "text-sm font-normal text-slate-600",
          socialButtonsBlockButton: "h-11 rounded-full text-sm font-medium",
          socialButtonsProviderIcon: "size-4",
          // Clerk's backdrop top-docks the card; center it instead.
          modalBackdrop: "items-center",
          // SSO-only modal: the "Don't have an account? Sign up" switch is
          // redundant (Google auto-provisions). Free-plan Clerk branding
          // stays — removing it requires a paid Clerk plan.
          footerAction: "hidden",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <LenisProvider>{children}</LenisProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
