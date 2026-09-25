# Elite Performance · Phase 72.3.115 RC65 — Codespaces Installation

This full combined release repairs the distorted **Review Athlete** focus icon and standardizes every Home shortcut icon across all roles. It preserves the Elite Performance brand, multi-sport, multi-team, shared-family access, and all prior functionality. Tracker connectivity remains disabled.

## 1. Upload the ZIP

Upload `elite-performance-app-phase-72-3-115-RC65-home-icon-system.zip` into the root of your existing Codespace. You do not need a second Codespace.

## 2. Open the terminal and enter the app folder

```bash
cd /workspaces/athlete-performance-app
```

## 3. Bring your GitHub branch up to date

```bash
git pull --rebase origin main
```

## 4. Extract RC65 over the existing app

```bash
unzip -o elite-performance-app-phase-72-3-115-RC65-home-icon-system.zip
```

## 5. Remove only the uploaded ZIP

```bash
rm elite-performance-app-phase-72-3-115-RC65-home-icon-system.zip
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

Open the forwarded port `3001` when Codespaces offers it. The release ribbon must say `CLOSED BETA · RC65 · v72.3.115`.

## 10. Confirm the database status

RC65 adds no new migration. Migration 015 from RC61 must already be installed:

```text
supabase/migrations/015_multi_sport_team_family_profiles.sql
```

You already installed migration 015 successfully. Do not rerun migrations 001–015 for this icon update.
