This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Agent discovery and verification

The homepage supports `Accept: text/markdown` (and normal HTML), with quality
values and `Vary: Accept`. Unknown page paths return Markdown 404s when requested.
Keep the page/resource inventory in `proxy.ts` aligned when adding routes.
Public machine resources bypass Clerk; sign-in and Clerk's own proxy retain their
existing middleware.

- `/llms.txt`: when-to-use guidance and resource links.
- `/index.md`: readable product overview.
- `/api/product`: read-only product, requirements and download information.
- `/api/download`: existing installer redirect, with releases-page fallback.
- `/openapi.json`: OpenAPI 3.1.1 contract. Unsupported API methods and unknown
  API paths return JSON errors with a code, message and resolution hint.
- `/sitemap.xml`, `/robots.txt`: public page discovery. Update sitemap lastmod
  when page content changes; do not regenerate it using the current request time.

Run with Node 22.18+ (native TypeScript stripping) or Node 24:

```sh
npm run build
npm test
npm start -- --hostname 127.0.0.1
# In another terminal:
BASE_URL=http://127.0.0.1:3000 npm run test:endpoints
```

Full endpoint checks require the deployment's Clerk environment. Without it,
`MACHINE_ONLY=1` checks every public machine endpoint; production HTML is still
checked from build artifacts by `npm test`. Run the full suite against the Vercel
preview before merging, including a real Google sign-in smoke test. No credentials
are committed or needed for the public discovery API.

The public API cannot operate the desktop app or perform inference. Such an API
would need a separate authentication/privacy/product design. Search indexing and
rankings require deployment and search-engine recrawling; submit the sitemap in
Search Console and rerun the readiness audit after deployment.
