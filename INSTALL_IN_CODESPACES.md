# Phase 72.3.95 RC45 — Codespaces Install

RC45 is the full Hockey Dev app with all external tracker connectivity disabled.

1. Upload this ZIP into `/workspaces/athlete-performance-app`.

```bash
cd /workspaces/athlete-performance-app
```

```bash
unzip -o athlete-performance-app-phase-72-3-95-trackers-disabled-RC45.zip
```

```bash
rm -rf .next
```

```bash
npm install
```

2. Do not run a new Supabase migration. If migrations 010–012 were previously applied, leave them in place.

3. Run the tracker-disable safety check and TypeScript check.

```bash
npm run test:tracker-disabled
```

```bash
npm run test:typecheck
```

4. Start the app.

```bash
npm run dev -- -H 0.0.0.0 -p 3001
```

No Google Health/Fitbit, Oura, WHOOP, Strava, or KINEXON credentials are needed. Existing tracker rows are left untouched but are not loaded or displayed.
