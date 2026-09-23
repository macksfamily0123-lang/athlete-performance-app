# Phase 72.3.111 RC61 — Codespaces Installation

This is one full combined release. It adds multi-sport Player workspaces, multiple teams per sport, primary sport/team selection, an all-sports overview, and clearer multi-parent invitations while preserving all RC54–RC60 functionality. Tracker connectivity remains disabled.

## 1. Upload the ZIP

Upload `athlete-performance-app-phase-72-3-111-RC61-multi-sport-team-family.zip` into the root of your existing Codespace. You do not need a second Codespace.

## 2. Open the terminal and enter the app folder

```bash
cd /workspaces/athlete-performance-app
```

## 3. Bring your GitHub branch up to date

```bash
git pull --rebase origin main
```

## 4. Extract RC61 over the existing app

```bash
unzip -o athlete-performance-app-phase-72-3-111-RC61-multi-sport-team-family.zip
```

## 5. Remove only the uploaded ZIP

```bash
rm athlete-performance-app-phase-72-3-111-RC61-multi-sport-team-family.zip
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

Open the forwarded port `3001` when Codespaces offers it. The release ribbon must say `CLOSED BETA · RC61 · v72.3.111`.

## 10. Install the new Supabase migration

Open the Supabase SQL Editor, copy the complete contents of the following file, paste it into a new query, and select **Run**:

```text
supabase/migrations/015_multi_sport_team_family_profiles.sql
```

Run migration 015 once, after migrations 001–014. Do not remove or rerun the older migrations. Migration 015 preserves existing Players, Parent links, team memberships, and saved workspace data.
