export const SITE_URL = "https://notchbud.vercel.app";
export const PRODUCT = {
  name: "notchbud",
  description: "An opensourced rust native dynamic island with an assistant inside. Hover the notch to ask anything and read streaming answers without leaving your window. Free and open source, billed by your own groq key or custom openai-compatible endpoint.",
  operatingSystem: "Windows x64",

};
export const HOME_MARKDOWN = `# notchbud — Windows AI desktop assistant

> The notch with an assistant. Hover, ask, and read streaming answers inside a dynamic island on your Windows desktop.

## How it works

Download the Windows x64 installer, install the app for your user, and connect your own provider: a Groq API key, or a custom OpenAI-compatible endpoint with its API root, optional key, and exact model ID. Hover the notch to open it, type a question, and read the answer without switching windows. Screenshot questions let you ask about something on your screen. Move away to collapse the island.

## Requirements and privacy

notchbud uses Windows x64 and WebView2. Mac and Linux versions are not available. The desktop app does not require a notchbud account. You need a Groq account for a Groq API key, or any OpenAI-compatible endpoint — including a keyless local server. Chat history stays on your computer; Windows DPAPI protects credentials locally and saved keys never reach the island's JavaScript. Prompts and attached screenshots are sent to Groq or your custom endpoint to generate answers. Custom endpoints must support streamed OpenAI Chat Completions; remote URLs need HTTPS and HTTP works only on localhost.

## Pricing

The app is free with no trial timer. Provider usage limits and pricing apply separately to your own key or endpoint. See the pricing page for current support options.

## Links

- [Download](https://notchbud.vercel.app/download)
- [Setup documentation](https://notchbud.vercel.app/docs)
- [Releases](https://notchbud.vercel.app/releases)
- [Pricing](https://notchbud.vercel.app/pricing)
- [Support](https://notchbud.vercel.app/support)
- [Privacy](https://notchbud.vercel.app/privacy)
- [Terms](https://notchbud.vercel.app/tos)
- [Source code](https://github.com/ankitdey01/notchbud)
- [Agent instructions](https://notchbud.vercel.app/llms.txt)
`;
export const LLMS = `# notchbud

> A Windows AI desktop assistant that streams answers in a dynamic island using your own Groq key or custom OpenAI-compatible endpoint.

## When to use this

Use notchbud's website to check Windows compatibility, explain installation and provider setup, find the installer, or answer questions about local storage and provider usage. Request the homepage with Accept: text/markdown for a readable overview.

Installing software and entering a provider key are actions for the user on their own device. The website demo uses sample responses.

## Machine-readable resources

- [Product overview](https://notchbud.vercel.app/index.md): Markdown overview, setup, requirements and privacy.
- [Sitemap](https://notchbud.vercel.app/sitemap.xml): Indexable pages.

## Documentation

- [Setup](https://notchbud.vercel.app/docs): Install and connect Groq or a custom endpoint.
- [Download](https://notchbud.vercel.app/download): Installer instructions; GET /api/download redirects to the installer or releases page.
- [Releases](https://notchbud.vercel.app/releases): Every release, fetched fresh from GitHub.
- [Pricing](https://notchbud.vercel.app/pricing): App and separate provider usage costs.
- [Support](https://notchbud.vercel.app/support): Troubleshooting and contact.
- [Privacy](https://notchbud.vercel.app/privacy): Local credential storage and privacy policy.
- [Terms](https://notchbud.vercel.app/tos): Terms of service.
`;
export function markdown(body: string | null, status = 200) {
  return new Response(body, { status, headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept", "Cache-Control": "no-store" } });
}
