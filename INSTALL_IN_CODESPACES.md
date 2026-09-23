# Phase 72.3.110 RC60 — Codespaces Installation

This is one full combined release. It adds exact-section navigation and top-of-Home incomplete Daily Check-In and Weekly Review banners while preserving RC59 phone-header visibility, RC58 global gutters, RC57 Player Home gutters, RC56 Admin Home icons, RC55 account connections, RC54 premium UX, Supabase, migrations 010–014, and all existing features. Tracker connectivity remains disabled.

## 1. Upload the ZIP

Upload `athlete-performance-app-phase-72-3-110-RC60-routine-priority-navigation.zip` into the root of your existing Codespace. You do not need a second Codespace.

## 2. Open the terminal and enter the app folder

```bash
cd /workspaces/athlete-performance-app
```

## 3. Bring your GitHub branch up to date

```bash
git pull --rebase origin main
```

## 4. Extract RC60 over the existing app

```bash
unzip -o athlete-performance-app-phase-72-3-110-RC60-routine-priority-navigation.zip
```

## 5. Remove only the uploaded ZIP

```bash
rm athlete-performance-app-phase-72-3-110-RC60-routine-priority-navigation.zip
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

Open the forwarded port `3001` when Codespaces offers it. The release ribbon must say `CLOSED BETA · RC60 · v72.3.110`. RC60 adds no new database migration. Keep migrations 010–014 in place and do not roll them back.
