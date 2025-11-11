# Somnia Pulse — Real-Time On-Chain Activity Dashboard

A small monorepo containing a Next.js front-end that visualizes real-time on-chain activity using the Somnia Streams SDK. The web app demonstrates a "Realm War" map (animated canvas), activity feed, and leaderboards driven by on-chain published events.

This README collects project structure, setup and local run instructions, environment variables, and common troubleshooting tips gathered while developing the project.

---

## Repo layout

- apps/
	- web/ — Next.js 16 TypeScript app (UI, canvas, activity feed)
	- emitter/ — small publisher/emitter helper (not documented here)
- packages/
	- sdk/ — shared SDK helpers (if present)
- package.json — workspace root


## Requirements

- Node.js 18+ (recommended) with pnpm installed
- Git (for cloning)

Note: this project uses pnpm workspaces from the root.

## Install

From the repository root:

```bash
pnpm install
```

This will install workspace dependencies for the monorepo and `apps/web`.

## Environment variables

The web app expects the following environment variables (add them to `apps/web/.env.local`):

- NEXT_PUBLIC_SCHEMA_ID — Schema id used by Somnia Streams (example: `0xabc...`)
- NEXT_PUBLIC_PUBLISHER — Publisher address used for reading streams

If you don't have a publisher/schema yet, the UI will gracefully handle "no data" scenarios, but features that decode live data will be inactive.

## Run (development)

From `apps/web`:

```bash
cd apps/web
pnpm dev
```

The dev server starts with `next dev`. Open http://localhost:3000

## Build (production)

From `apps/web`:

```bash
pnpm build
pnpm start
```

Build uses `next build --webpack` and `next start` to serve the optimized site.

## Important files (quick reference)

- `apps/web/app/layout.tsx` — main RootLayout and global font usage
- `apps/web/app/page.tsx` — main page that composes components
- `apps/web/src/components/RealmHeatmap.tsx` — responsive canvas heatmap (constellation)
- `apps/web/src/components/CyberWarMap.tsx` — interactive/canvas-based realm war map with animations
- `apps/web/src/components/ActivityFeed.tsx` — live activity feed component
- `apps/web/src/components/LeaderBoard.tsx` — simple leaderboard
- `apps/web/src/hooks/useLiveActivity.ts` — hook that polls Somnia Streams SDK and maps decoded rows to Activity objects
- `apps/web/tsconfig.json` — path alias `@/*` -> `src/*` (if configured)

## Troubleshooting & common issues

Here are a few issues encountered during development and their fixes/workarounds.

1) Module not found for `@/components/*`

- Ensure `apps/web/tsconfig.json` contains:

```json
{"compilerOptions": { "baseUrl": "src", "paths": { "@/*": ["*"] } } }
```

- This lets imports like `@/components/ActivityFeed` resolve to `apps/web/src/components/ActivityFeed.tsx`.

2) `Failed to fetch 'Geist Mono' from Google Fonts` (Next.js warning)

- Next's new font loader attempts to download fonts during build. If download fails (network or blocked), Next will fall back to a local font and log a warning.
- Options:
	- Leave as-is (Next falls back automatically).
	- Replace Google Fonts usage with a local `next/font/local` bundle to avoid runtime fetch.
	- Switch to a system font stack in `globals.css`.

3) `UnknownSignatureError` or decoding errors in `useLiveActivity`

- Symptoms: SDK `deserialiseRawData` or `getBetweenRange` throws UnknownSignatureError. This usually means the ABI/schema used to decode doesn't match the published data.
- Workarounds:
	- Verify `NEXT_PUBLIC_SCHEMA_ID` matches the schema used by the publisher.
	- If schema was updated upstream, update your SchemaEncoder or SDK calls to use the correct parent schema id.
	- Add defensive code in `useLiveActivity`:
		- Try `getBetweenRange` first; if it fails, try `getAllPublisherDataForSchema` (which may return decoded rows).
		- Catch deserialisation exceptions and skip mapping that poll iteration instead of crashing the UI.

4) `onPowerUpdate is not defined` in `CyberWarMap`

- Cause: The `CyberWarMap` component referenced `onPowerUpdate` but it wasn't included in props.
- Fix: Add `onPowerUpdate?: (realm:number, delta:number) => void` to the component `Props` and destructure it from the function parameters. Use it defensively (check `typeof onPowerUpdate === 'function'` before calling).

5) Styling/layout tweaks for the constellation/boxes

- The canvas and adjacent boxes should use a consistent card style.
- Use a shared Tailwind/card class (rounded, backdrop-blur, border with subtle color, consistent padding and height) for visual consistency.

## Recommended next improvements

- Add a `README` for the `emitter` app explaining how to publish sample data (schema + publisher address) so the web UI can show live data.
- Add defensive tests or mocks for `useLiveActivity` so front-end behavior is covered when the SDK returns unexpected shapes.
- Consider bundling fonts locally to avoid Google Fonts fetch warnings in restricted networks.
- Add TypeScript types/tests around the `SchemaEncoder` decoding so mapping is safe.

## Contact / developer notes

If you run into runtime issues or you want me to:
- Add a local-font fallback and remove the Google Fonts warning
- Harden `useLiveActivity` with fallback strategies and retries
- Add a settings UI to manually set schema id / publisher for testing

Tell me which of the above you'd like next and I can implement it.
good