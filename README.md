# RC69 inactivity privacy release

Start with RC69_START_HERE.md.

# Elite Performance RC68 · 72.3.119

Complete source ZIP from RC67, including the 2026 visual redesign and parent privacy controls. Junior functionality, sports, roles, teams, family links, daily/weekly routines, workouts and Supabase integration retained. Tracker connectivity and subscriptions remain disabled.

| Task | Guide |
| --- | --- |
| Install in existing Codespace | INSTALL_IN_CODESPACES.md |
| Push source to GitHub | GIT_PUSH.md |
| Deploy to existing Vercel project | DEPLOY_TO_VERCEL.md |
| Apply migration 017 and deploy deletion function | SUPABASE_SETUP.md |
| Guardian verification, retention and deletion operations | PRIVACY_OPERATIONS.md |
| Validation and limits | TEST_RESULTS.md |

Current terms and notice are available at `/terms` and `/privacy`. Configure the operator contact and actual retention schedule before accounts can accept the new notice. Do not use Admin Test records for real children.

Install:

```bash
npm install
```

Validate:

```bash
npm test
```

Production build:

```bash
npm run build
```

This release adds migration 017. It must be applied after your existing migrations 001–016. Existing SQL files are unchanged and checked against the RC66 hashes. Do not reapply historical migrations to an existing database.
