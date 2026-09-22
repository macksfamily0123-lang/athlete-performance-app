# Phase 72.3.108 RC58 — Global Alignment + Consistent Gutters

- Establishes one centered 1280px reading rail for every role and page.
- Aligns the Admin preview bar, active-athlete context, reliability notices, page body, profile sport, page guide, and section navigation to the same horizontal gutter.
- Uses a responsive 18–28px desktop page gutter and 18–24px bordered-panel inset.
- Uses a consistent 12px page gutter and 14px panel inset on phones.
- Aligns hero, card, stat, report, goal, readiness, and development copy across page types.
- Removes the extra hidden left indent from section headings so titles align with their panel content.
- Corrects the Goals hero copy that previously touched its left border.
- Preserves RC57 Player Home safe gutters and RC56 larger Admin Home icons with inset **Open →** actions.
- Preserves RC55 account connections, Supabase, migrations 010–014, and all existing features.
- Keeps tracker connectivity disabled. No new database migration is required.

# Phase 72.3.106 RC56 — Larger Admin Home Shortcut Icons

- Enlarges the Admin Home shortcut icon panels to 64px with 36px icon artwork.
- Uses forest-green, metallic-silver, and graphite styling for stronger visibility.
- Moves **Open →** underneath each shortcut description instead of against the right border.
- Adds a phone layout with 58px icon panels and inset action labels.
- Preserves RC55 Home account connections and walkthroughs.
- Preserves Supabase, migrations 010–014, roles, permissions, and all existing features.
- Keeps tracker connectivity disabled. No new database migration is required.

# Phase 72.3.105 RC55 — Home Account Connections

- Adds a prominent **Connect Accounts** action at the top of Home for Player, Parent, Coach, and Admin accounts.
- Routes each role into its existing permission-safe workflow rather than adding a second connection system.
- Adds a clickable **Need help connecting accounts?** bar with a role-specific step-by-step walkthrough.
- Explains Parent Connection Codes, Team Invite Codes, and Player Access Codes in plain language.
- Reinforces one Player record, explicit Coach consent, and the rule that Coaches never create Player accounts.
- Adds responsive phone formatting for the Home connection panel and help walkthrough.
- Preserves the RC54 dashboard correction and premium visual upgrade, RC50–RC53 fixes, Supabase, migrations 010–014, and all existing functionality.
- Keeps tracker connectivity disabled. No new database migration is required.

# Phase 72.3.104 RC54 — Premium UX + RC53 Dashboard Correction

- Makes Readiness, Goal Execution, Progress, and Training visually identical dashboard tiles.
- Replaces the empty Progress wording with **NO DATA** and **Add first test result**.
- Uses **Improving**, **Steady**, or **Needs Attention** when tile data exists.
- Removes blue and one-off Progress styling.
- Applies forest green, metallic silver, and graphite across every role.
- Strengthens panel geometry, information hierarchy, spacing, action priority, empty states, navigation, and small-screen behavior.
- Replaces AI-sounding interface wording with direct, plain-language guidance.
- Preserves RC50–RC52, Supabase, migrations 010–014, permissions, Junior mode, Player More, cloud test athletes, and all app features.
- Keeps tracker connectivity disabled and tracker server routes absent.

# Phase 72.3.102 RC52 — Premium Performance Product System

- Removes orange, violet, and blue UI accents from rendered components by neutralizing legacy role and feature tokens.
- Restricts the visual system to dark forest green, metallic silver, and dark graphite.
- Replaces rounded bubble cards with square or restrained 1–2 px architectural panels.
- Replaces floating rounded navigation with a full-width technical navigation rail.
- Flattens decorative gradients and glow while preserving measured depth and clear interaction states.
- Standardizes primary actions as forest green and secondary actions as graphite with silver structure.
- Preserves RC51, RC50, migrations 010–014, Supabase, every role and permission, all existing functionality, and disabled tracker connectivity.

# Phase 72.3.101 RC51 — Forest + Metallic Silver Visual Upgrade

- Introduces a deep forest-green background and layered surface palette across the entire app.
- Adds restrained metallic-silver borders, highlights, navigation indicators, progress finishes, and key-number treatments.
- Strengthens headings, labels, buttons, inputs, and important values for easier reading without making every line visually loud.
- Restyles shared cards, forms, settings, modals, privacy screens, dashboards, bottom navigation, and role-specific Home experiences.
- Preserves the RC50 compact Junior banner and reliable Edit Player action.
- Preserves migrations 010–014, Supabase, roles and permissions, all existing functionality, and disabled tracker connectivity.

# Phase 72.3.100 RC50 — Compact Junior Banner + Edit Player Repair

- Replaces the large green Junior Player Mode banner with a compact translucent strip below the navigation tabs.
- Lifts the portaled Junior navigation above the banner so the two surfaces never overlap.
- Rebuilds **Edit Player** as a reliable action that works from every Junior tab, opens the profile editor, and scrolls to it.
- Preserves RC49 Report Problem and Coach Connection fixes.
- Preserves migration 014, migrations 010–013, the RC48 Create Player form, RC47 privacy controls, all existing features, and disabled tracker connectivity.

# Phase 72.3.97 RC47 — Combined RC46 + RC47

- Adds email-approved closed-beta registration for every role.
- Adds versioned privacy acceptance at signup and first use.
- Requires a Parent/legal-guardian attestation before a junior Player is created.
- Makes Team Invite acceptance the explicit, auditable opt-in for Coach access.
- Adds a Privacy & Account Center with access visibility, JSON export, and reviewed deletion/access-removal requests.
- Adds an Admin Closed Beta Readiness dashboard and privacy request workflow.
- Adds role-specific launch checklists, install guidance, accessibility feedback, and feedback impact levels.
- Adds migration 013. Migrations 010–012 remain preserved and unchanged.
- Keeps all tracker/wearable connectivity disabled and does not require provider credentials.

# Phase 72.3.95 RC45 — Tracker Connectivity Removed

- Removes all tracker connection, setup, sync, imported-data display, and Coach tracker-sharing entry points from the live UI.
- Removes every `/api/trackers/*` endpoint and the provider connection/sync modules so direct requests cannot connect providers, import data, or expose stored tracker data.
- Removes Google Health/Fitbit, Oura, WHOOP, Strava, and KINEXON secrets from the environment-variable template.
- Preserves migrations 010, 011, and 012 and any existing database rows without querying or displaying them.
- Preserves Supabase, roles and permissions, Junior mode, Player More, cloud test athletes, manual workouts/readiness/testing, goals, analytics, photos, and all unrelated RC44 functionality.

# Phase 72.3.94 RC44 — KINEXON + Opt-in Coach Sharing

- Adds KINEXON as a server-side partner REST API connection for Player and linked Parent accounts.
- Normalizes KINEXON session duration, distance, heart rate, strain/training load, high-speed distance, sprint distance, maximum speed, accelerations, decelerations, and player load when supplied by the tenant API.
- Adds a KINEXON athlete-ID linking control. Organization credentials and endpoint details remain server-only.
- Adds explicit sharing controls for every current Coach connected through a Team.
- Player or linked Parent can independently select Sleep, Recovery, Workouts, Heart rate, and Movement & load.
- Sharing is off by default, revocable at any time, and read-only for Coaches.
- Coach responses are filtered by category on the server. Provider credentials, external athlete IDs, and unselected columns are never returned.
- Admin remains blocked from tracker data.
- Adds migration 012. Migrations 010 and 011 are preserved unchanged.
- Preserves Google Health/Fitbit, Oura, WHOOP, Strava, Garmin-ready architecture, Apple Health/Health Connect future bridges, Supabase, roles, Junior mode, and all RC43 functionality.

# Phase 72.3.93 RC43 — Dedicated Tracker Setup Flow

- Moves tracker authorization into a dedicated full-screen setup flow with clear connection actions.
- Preserves the RC42 discovery points on Home, Recovery, and Settings.
- No database change; migrations 010 and 011 remain the required tracker migrations for RC43.

# Phase 72.3.92 RC42 — Clear Tracker Connection Center

- Adds a large primary **Connect Google Health** action at the top of Connected Trackers.
- Keeps provider choices visible even before tracker status finishes loading.
- Makes every OAuth provider action explicit (`Connect Google Health`, `Connect Oura`, etc.).
- Explains that Google Health covers Fitbit and Pixel Watch workout/sleep metrics.
- Gives Parents a direct **Choose Player** action if no managed Player is selected.
- Makes Admin/Coach preview behavior explicit: preview can show where trackers live but cannot authorize or read private tracker data.
- Preserves RC41 Home/Recovery tracker discovery, RC40 Google Health integration, and RC39 Player/Parent-only privacy.
- No new Supabase migration. Migrations 010 and 011 are unchanged.

# Phase 72.3.91 RC41 — Tracker Discovery & Recovery Access

- Connected Trackers is now easy to find from Player Home and Parent Home, even before a tracker is connected.
- Recovery & Readiness now includes a prominent Connect / Manage workout & sleep trackers action.
- Settings always shows the Connected Trackers section when viewing Player or Parent experiences.
- Admin/Coach previews show a privacy lock explanation instead of exposing private tracker data.
- Real Player/Parent accounts without a canonical selected Player now get a clear setup message instead of a missing section.
- No new Supabase migration is required; migrations 010 and 011 are preserved unchanged.
- Google Health, Oura, WHOOP, and Strava support from RC40 is preserved.

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
