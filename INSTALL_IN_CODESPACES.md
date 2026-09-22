# Phase 72.3.107 RC57 — Codespaces Installation

This is one full combined release. It adds safe Player Home content gutters while preserving the RC56 Admin Home icon repair, RC55 connection center, RC54 premium UX upgrade, Supabase, migrations 010–014, and all existing features. Tracker connectivity remains disabled.

## 1. Upload the ZIP

Upload `athlete-performance-app-phase-72-3-107-RC57-player-home-gutter-repair.zip` into the root of your existing Codespace. You do not need a second Codespace.

## 2. Open the terminal and enter the app folder

```bash
cd /workspaces/athlete-performance-app
```

## 3. Extract RC57 over the existing app

```bash
unzip -o athlete-performance-app-phase-72-3-107-RC57-player-home-gutter-repair.zip
```

## 4. Remove only the uploaded ZIP

```bash
rm athlete-performance-app-phase-72-3-107-RC57-player-home-gutter-repair.zip
```

## 5. Clear the old Next.js cache

```bash
rm -rf .next
```

## 6. Install the locked dependencies

```bash
npm install
```

## 7. Run all checks and the production build

```bash
npm run release:check
```

## 8. Start the Codespaces preview

```bash
npm run dev -- -H 0.0.0.0 -p 3001
```

Open the forwarded port `3001` when Codespaces offers it. RC57 adds no new database migration. Keep migrations 010–014 in place and do not roll them back.
