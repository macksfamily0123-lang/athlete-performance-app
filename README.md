# Elite Performance · RC67

Full combined Next.js app, built from RC66. Graphite, forest green, metallic silver, and off-white across Player, Parent, Coach, and Admin.

## Start here

- `INSTALL_IN_CODESPACES.md` — upload the ZIP, install, test, and preview.
- `GIT_PUSH.md` — publish the direct build on its own review branch.
- `DEPLOY_TO_VERCEL.md` — preview and production deployment.
- `SUPABASE_SETUP.md` — keep your existing project; no new migration.
- `RELEASE_NOTES.md` — what changed.
- `TEST_RESULTS.md` — validation and limits.

## Retained capabilities

| Area | Included |
|---|---|
| Accounts | Supabase authentication, roles, permissions, invitations, account connections |
| Athletes | Junior mode, multi-sport profiles, sport-specific positions, photos, testing |
| Relationships | Teams, coach rosters, multiple players, multiple parents per athlete |
| Daily work | Check-ins, weekly reviews, goals, development, workouts, competition |
| Review | Readiness, progress, testing history, roster review, schedules, recovery |
| Reliability | Cloud retry, local recovery copies, backups, support notes, diagnostics |
| Database | Original migrations 001–016, with checksum verification |

Tracker connectivity and subscriptions remain disabled. No live deployment or database update was performed as part of this release.

This ZIP is the direct build from this conversation, separate from the earlier Codex Cloud RC67 task. Install one source version at a time.

## Commands

Install:

```bash
npm install
```

Type check:

```bash
npm run test:typecheck
```

All automated checks:

```bash
npm test
```

Production build:

```bash
npm run build
```

Development server:

```bash
npm run dev
```
