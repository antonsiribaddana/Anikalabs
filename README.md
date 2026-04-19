# Anika Labs

Next.js site for Anika Labs — deployed on Cloudflare Pages.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Outputs a static export to `./out`.

## Deploy

Deploys to Cloudflare Pages (project: `anikalabs`):

```bash
npm run build
npx wrangler pages deploy out --project-name=anikalabs --branch=main
```

Production: https://anikalabs.com
