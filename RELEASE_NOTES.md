# Phase 72.3.88 RC38 — Combined Performance Intelligence + Beta Hardening

Full combined release built on Phase 72.3.86 RC36.

## Performance intelligence
- New Player Home Performance Index and actionable recommendation.
- Uses readiness, goal progress, training consistency and recent testing momentum.
- Keeps Recovery Tips and Progress visually prominent.
- Adds subtle premium motion while respecting reduced-motion accessibility.

## Alerts and reliability
- In-app performance Alerts center.
- Recovery/readiness, training, goal, testing/progress and cloud-sync alerts.
- User-configurable alert categories in Settings.
- Compact reliability rail showing connection state, cloud status and latest local recovery point.
- Downloadable athlete recovery backup.
- Improved offline service worker behavior for app-shell/static assets.
- Supabase Forgot password flow added to beta sign-in.

## Preserved
- 100%–180% text sizing.
- Player / Parent / Coach role-specific hero photography.
- Full-fill Parent/Coach hero behavior.
- Persistent fixed bottom navigation.
- Setup modal behavior.
- Coach/Roster fixes.
- Junior mode.
- Player More and cloud test athletes.
- Roles/permissions and Supabase integration.

## Validation
- 38/38 standalone regression scripts passed in the packaging environment.
- RC37 Performance Intelligence checks: 12/12.
- RC38 Beta Hardening checks: 18/18.
- TSX syntax transpilation passed for AthleteApp.tsx and BetaGate.tsx.
- Dependency-backed `npm install` timed out in the packaging environment; run `npm install`, `npm run test:typecheck`, and optionally `npm run build` in Codespaces.
- Migration 009 SHA-256 remains: `ea088a53e3ffbb4ecfcab6e42fc9358b26a3c53e984299a436b887e8a008f626`.

## Preserved visual milestones
This combined build preserves the earlier **Phase 72.3.83 RC33** lineage, including **Recovery Tips**, the **Elite Performance Visual System**, and the prior **wide 1600×900 asset** work. Migration 009 remains the latest required migration.

Compatibility: migration 009 remains unchanged and is still the latest required migration.

## Phase 72.3.89 RC39 — Connected Trackers
- Adds Player/Parent-only Connected Trackers in Settings.
- Cloud OAuth framework for Fitbit, Oura, WHOOP, and Strava.
- Garmin appears as architecture-ready pending provider approval; Apple Health and Health Connect are marked for future native mobile bridges.
- Normalizes sleep, readiness/recovery, resting HR/HRV, and workout summaries into Supabase.
- Adds Player/Parent Home tracker summary strip.
- Coach and Admin tracker access is denied both in UI and migration 010 RLS rules.
- OAuth access/refresh tokens are encrypted server-side and never exposed to client code.
- Adds migration 010. Migration 009 remains unchanged.

## Phase 72.3.90 RC40 — Google Health / Fitbit Migration
- Replaces the legacy Fitbit OAuth connector for new users with Google Health OAuth 2.0.
- Uses `GOOGLE_HEALTH_CLIENT_ID` and `GOOGLE_HEALTH_CLIENT_SECRET`.
- Uses the production callback `/api/trackers/oauth/callback/google-health`.
- Imports Google Health exercise sessions, sleep duration/efficiency, daily resting heart rate and daily HRV when available.
- Keeps Oura, WHOOP and Strava cloud connectors.
- Keeps Garmin approval-ready and Apple Health / Health Connect as future native bridges.
- Preserves Player/Parent-only tracker privacy and server-side encrypted OAuth tokens.
- Adds migration 011 to allow `google-health` provider values while preserving legacy `fitbit` rows.
- Migration 009 remains unchanged and migration 010 remains the tracker privacy/data foundation.
