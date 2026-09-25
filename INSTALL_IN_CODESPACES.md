# Phase 72.3.112 RC62 — Codespaces Installation

This is one full combined release. It adds Combat Sports, Tennis, and Volleyball while preserving RC61 multi-sport/team/family workspaces and all earlier functionality. Tracker connectivity remains disabled.

## 1. Upload the ZIP

Upload `athlete-performance-app-phase-72-3-112-RC62-combat-tennis-volleyball.zip` into the root of your existing Codespace. You do not need a second Codespace.

## 2. Open the terminal and enter the app folder

```bash
cd /workspaces/athlete-performance-app
```

## 3. Bring your GitHub branch up to date

```bash
git pull --rebase origin main
```

## 4. Extract RC62 over the existing app

```bash
unzip -o athlete-performance-app-phase-72-3-112-RC62-combat-tennis-volleyball.zip
```

## 5. Remove only the uploaded ZIP

```bash
rm athlete-performance-app-phase-72-3-112-RC62-combat-tennis-volleyball.zip
```

## 6. Clear the old Next.js cache

```bash
rm -rf .next
```

## 7. Install the locked dependencies

```bash
npm install
```

## 8. Run all checks and the production build

```bash
npm run release:check
```

## 9. Start the Codespaces preview

```bash
npm run dev -- -H 0.0.0.0 -p 3001
```

Open the forwarded port `3001` when Codespaces offers it. The release ribbon must say `CLOSED BETA · RC62 · v72.3.112`.

## 10. Install the new Supabase migration

Open the Supabase SQL Editor, copy the complete contents of the following file, paste it into a new query, and select **Run**:

```text
supabase/migrations/016_combat_tennis_volleyball_sports.sql
```

Run migration 016 once, after migration 015. Do not remove or rerun the older migrations. Migration 016 only expands the supported sport list and preserves existing Players, Parent links, team memberships, and saved workspace data.
