# Elite Performance · Phase 72.3.116 RC66 — Codespaces Installation

This full combined release corrects the live Hockey Dev/HD regression by installing the Elite Performance Speed E identity while preserving the expanded sports, Home icon system, multi-sport, multi-team, shared-family access, and all prior functionality. Tracker connectivity remains disabled.

## 1. Upload the ZIP

Upload `elite-performance-app-phase-72-3-116-RC66-brand-sports-combined.zip` into the root of your existing Codespace. You do not need a second Codespace.

## 2. Open the terminal and enter the app folder

```bash
cd /workspaces/athlete-performance-app
```

## 3. Bring your GitHub branch up to date

```bash
git pull --rebase origin main
```

## 4. Extract RC66 over the existing app

```bash
unzip -o elite-performance-app-phase-72-3-116-RC66-brand-sports-combined.zip
```

## 5. Remove only the uploaded ZIP

```bash
rm elite-performance-app-phase-72-3-116-RC66-brand-sports-combined.zip
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

Open the forwarded port `3001` when Codespaces offers it. The release ribbon must say `CLOSED BETA · RC66 · v72.3.116`.

## 10. Confirm the database status

RC66 includes migration 016 for Combat Sports, Tennis, and Volleyball:

```text
supabase/migrations/016_combat_tennis_volleyball_sports.sql
```

You already installed migration 016 successfully, so do not rerun it. Migrations 001–015 remain preserved.
