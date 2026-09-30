# RC67 validation · 30 September 2026

Built from the complete RC66 combined ZIP, version 72.3.117.

| Check | Result |
| --- | --- |
| npm install | Passed |
| npm run test:typecheck | Passed |
| npm test | Full registered suite passed |
| RC67 redesign tests | 35/35 passed |
| Migration preservation | 16/16 original SQL files match RC66 SHA-256 |
| npm run build | Passed |

## Browser checks

Local Chromium checks exercised Player, Parent, Coach and Admin at 320px, 390px, 768px and 1440px. Across 88 section/layout checks, no horizontal document overflow, clipped headings/actions or runtime errors were detected. Another 22 layout checks exercised 180% text at 320px across all four roles. JSON records are in `validation/`.

Routine checks verified exact destination focus, read-only Parent/Coach controls, and Player/Admin saving daily check-ins and weekly reviews. Pending banners disappeared after save and stayed completed after reload. Testing history was inspected with real numeric fixture results. A lower-is-better percentage calculation defect was corrected and covered by runtime tests.

These were local fixture sessions, not authenticated live Supabase sessions. Live authentication, account connections, team/family sharing and cloud database writes still require checks in your deployment with your existing accounts. No live database, repository or deployment was changed. The temporary fixture route was removed before production build and is excluded from the ZIP.

## Build notes

The production build emits existing Autoprefixer compatibility warnings about `start`/`end` flex alignment and a Supabase Node 20 deprecation notice. They do not prevent compilation. npm reports an environment `http-proxy` configuration warning. Logs are included in `validation/`.

No new migration is required. Tracker connectivity and subscriptions remain disabled. No private environment files, installed dependencies, development server files or generated Next build files are packaged.
