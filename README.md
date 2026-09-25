# Elite Performance App — Phase 72.3.116 RC66

## RC66 — Elite Performance Brand + Expanded Sports

RC66 is the corrected combined release. It merges the Elite Performance Speed E identity and consistent Home icon system with the RC62 expansion for Combat Sports, Tennis, and Volleyball. The live header, sign-in screen, installation metadata, app icons, exports, and mobile branding use **Elite Performance** while the new sports retain their positions, tests, development priorities, training plans, and analytics.

Migration `016_combat_tennis_volleyball_sports.sql` is included and tracker connectivity remains disabled.

### Home icon system

RC66 replaces the distorted one-off **Beta Focus · Review Athlete** graphic with the same crisp, outlined Progress icon used throughout Elite Performance. The old clipped icon shape has been removed.

Player, Junior, Coach, Parent, and Admin Home shortcuts now use one shared square icon badge: consistent SVG bounds, stroke weight, artwork scale, alignment, and mobile sizing. Restrained emerald, mint, forest-green, and metallic-silver accents add visibility while staying inside the approved Elite Performance palette.

Parent Home places Schedule, Recovery, Progress, and Support icons in the left diamond timeline position. Parent Progress is locked to the phone viewport with responsive analytics grids and filter controls, and the Recovery Reminder note is centered at every screen size.

The service-worker cache advances to `v116` so deployed phones receive the repaired icons. Supabase, migrations 001–016, all roles and permissions, multi-sport/team/family support, workout creation, Junior mode, the Elite Performance brand, and disabled tracker connectivity remain preserved.

## RC63 — Speed E Logo Refinement

The enclosed EP crest has been replaced with a cleaner **Speed E** mark. Three forward-cut metallic-silver bars form the E, while a forest-green spine and short motion bars give it a high-performance identity without a shield or badge.

The approved Elite Performance wordmark, High Performance Athlete Development line, forest-green/silver/graphite styling, header sizing, mobile formatting, and all application functionality remain unchanged. The replacement mark is used in the top-left header, loading state, authentication, password recovery, workspace chooser, PWA icons, and Apple touch icon.

RC63 requires no database migration. Supabase, migration 015, prior migrations 001–014, all roles and permissions, multi-sport/team/family support, workout creation, Junior mode, and disabled tracker connectivity remain preserved.

## RC62 — Elite Performance Brand System

The app is now branded **Elite Performance** everywhere users encounter the product: the primary header, loading state, sign-in and password-recovery screens, workspace chooser, installation prompts, privacy copy, invitation copy, browser metadata, and installed app name.

The new **EP performance crest** combines an angular high-performance shield, metallic-silver structure, forest-green identity, graphite depth, and an upward performance mark. The crest is supplied as a scalable SVG, a full horizontal brand lockup, Android/PWA icons, and an Apple touch icon. The phone header keeps the logo large and visible without clipping the name or header actions.

RC61 multi-sport, multi-team, and shared-family access remains intact. Supabase, migration 015, prior migrations 001–014, all roles and permissions, workout creation, Junior mode, exact navigation, mobile alignment, and all existing functionality are preserved. Tracker connectivity remains disabled. RC62 requires no new database migration.

## RC61 — Multi-Sport, Multi-Team + Shared Family Access

One Player can now keep multiple sport workspaces inside the same athlete account. Each sport has its own position, primary team, goals, workouts, testing, schedule, readiness, reviews, and development data. The Player can switch sports from the top of the app, review combined totals on Home, and manage sports and teams from Connections.

One Player can belong to multiple Coach teams, including multiple teams in the same sport. Team membership no longer replaces a team from another sport. The Player chooses a primary team per sport and can remove a team connection, which removes that team's Coach access.

Multiple Parents continue to use separate logins connected to the same Player record. The Connections screen now clearly labels **Invite Another Parent** and explains that each Parent receives a fresh one-time code. Migration `015_multi_sport_team_family_profiles.sql` upgrades existing Players into a primary sport profile without duplicating Players or changing existing Parent links.

RC60 exact navigation, RC59 phone headers, RC58 global alignment, RC55 account connections, the RC54 premium design, Supabase, migrations 001–014, every role and permission, and all existing functionality remain preserved. Tracker connectivity remains disabled.

## RC60 — Exact Navigation + Routine Priority

Every Player Home action that names a specific destination now opens that exact section instead of stopping at the top of its page. Daily Check-In actions focus the Player-owned check-in form, Weekly Review actions focus the current weekly-review form, and training actions focus the workout list or scheduling form as appropriate.

If today's Daily Check-In is incomplete, **Start Daily Check-In** is the first banner on Player Home. If the current Weekly Review is incomplete, **Complete Weekly Review** appears directly beneath it. Each banner disappears as soon as its task is complete. The existing Daily Check-In popup and end-of-week Weekly Review popup remain active and now use the same reliable exact-section navigation.

RC59 phone-header visibility, RC58 global alignment, RC57 Player Home gutters, RC56 Admin shortcut repairs, RC55 account connections, the RC54 dashboard and premium design, Supabase, migrations 010–014, every role and permission, and all existing functionality remain preserved. Tracker connectivity remains disabled. RC60 requires no new database migration.

## RC59 — Mobile Header Visibility

Phone headers now use a readable multi-row action grid instead of a horizontally clipped button strip. Connections, Teams, Beta Admin, Report Problem, Alerts, Settings, Help, and role-return actions remain fully visible with 42px touch targets and wrapping labels.

The HD mark is enlarged to a clear 46px square with 16px lettering. On extra-small phones it remains 44px. The phone header and Admin preview controls no longer compete as overlapping sticky bars.

RC58 global alignment and consistent gutters, RC57 Player Home safe gutters, RC56 larger Admin Home icons, RC55 account connections, the RC54 dashboard and premium design, Supabase, migrations 010–014, every role and permission, and all existing functionality remain preserved. Tracker connectivity remains disabled. RC59 requires no new database migration.

## RC56 — Larger Home Shortcut Icons + Safe Action Placement

The Admin Home shortcut rows now use large 64px forest-and-silver icon panels with 36px icon artwork. The **Open →** action has moved underneath each shortcut description, so it remains clearly visible and can no longer sit against or be clipped by the right border.

The phone layout keeps the icons large at 58px while preserving readable copy and touch spacing. RC55 account connections, the RC54 dashboard and premium design, Supabase, migrations 010–014, every role and permission, and all existing functionality remain preserved. Tracker connectivity remains disabled. RC56 requires no new database migration.

## RC55 — Home Account Connections

Every signed-in role now has a consistent **Connect Accounts** panel at the top of Home. The primary action opens the existing secure workflow for that role: Player Connections, Parent My Players, Coach Team Invites, or Admin Account Tools.

A new **Need help connecting accounts?** bar opens a role-specific walkthrough. It explains who starts the connection, which code to use, where consent is required, and how the app preserves one Player record and one development history. The guide distinguishes Parent Connection Codes, Team Invite Codes, and Player Access Codes.

The RC54 premium forest-green, metallic-silver, and graphite design remains intact. RC50–RC54 fixes, Supabase, migrations 010–014, roles and permissions, Junior mode, Player More, cloud test athletes, and all current features are preserved. Tracker connectivity remains disabled. RC55 requires no new database migration.

## RC54 — Premium UX + RC53 Dashboard Correction

RC54 combines the dashboard correction and full premium UX pass in one release. Readiness, Goal Execution, Progress, and Training now use the same square tile structure, spacing, typography, status placement, detail line, and progress rule. Empty Progress shows **NO DATA** and **Add first test result**. Once data exists, dashboard tiles use only **Improving**, **Steady**, or **Needs Attention**. Progress no longer has blue or special one-off styling.

The visual system is restricted to forest green, metallic silver, and graphite. Player, Parent, Coach, Admin, and Junior views now share clearer hierarchy, larger mobile touch targets, consistent buttons, simpler empty states, improved narrow-screen stacking, more readable navigation, and plain-language labels. AI-sounding interface wording was replaced with direct terms such as **Today's Plan**, **Performance Summary**, and **Development Next Step**.

RC50–RC52 fixes, Supabase, migrations 010–014, roles and permissions, Junior mode, Player More, cloud test athletes, photos, testing, analytics, goals, schedules, and all other app features remain preserved. Tracker connectivity remains disabled; tracker API routes and provider server modules are not included.

## RC52 — Premium Performance Product System

RC52 removes the remaining orange, violet, and blue role styling by remapping every legacy visual token to forest green, metallic silver, or graphite. Primary actions are consistently forest green; secondary controls use dark graphite with silver borders; status and role accents stay inside the same restrained palette.

Rounded “bubble” cards have been replaced with architectural performance panels. Cards, forms, dashboards, settings, privacy screens, overlays, banners, and navigation now use square or restrained 1–2 px corners, flatter surfaces, tighter borders, and less decorative glow. Avatars and true circular performance instruments remain circular because their shape communicates function.

The full-width technical navigation, disciplined typography, uppercase instrumentation labels, flat graphite panels, forest action hierarchy, and metallic-silver structural lines are shared by Player, Parent, Coach, Admin, and Junior views.

RC51 and RC50 functionality remains preserved, including the compact Junior banner and reliable **Edit Player** action. Migrations 010–014, Supabase, all roles and permissions, and all existing features remain intact. Tracker connectivity remains disabled.

## RC51 — Forest + Silver visual system

RC51 applies one calm, premium visual language across Player, Parent, Coach, Admin, and Junior experiences. Deep forest-green backgrounds and layered card surfaces replace the flatter charcoal treatment. Metallic-silver borders, highlights, progress finishes, navigation indicators, and key metrics add definition without making the interface visually busy.

Typography now uses stronger weight and contrast for headings, labels, controls, and important values while secondary explanations remain softer. Forms, settings, privacy screens, overlays, navigation, cards, dashboards, and role-specific Home pages all share the same system.

RC50's compact translucent Junior Player Mode banner and reliable **Edit Player** action remain intact. RC49 Report Problem and Coach Connection fixes, RC48 Create Player improvements, RC47 privacy controls, migrations 010–014, Supabase, every role, and all existing functionality remain preserved. Tracker connectivity stays disabled.

## RC50 — Compact Junior banner and reliable Edit Player

RC50 turns the Junior Player Mode banner into a compact translucent 30px strip below the navigation tabs. The portaled Junior navigation is lifted above that strip, keeping every tab visible and tappable without a large green block.

The **Edit Player** header action now closes any open navigation/settings overlays, returns to Home, opens the Player Profile editor after Home mounts, scrolls to it, and uses the visible profile button as a fallback. This replaces the one short timer used by RC49.

Migration 014 permanently carries forward the claim-code repair used to create Parent-managed Players without the unavailable random-byte helper. It is safe to run after migration 013 and does not delete or replace athlete data.

RC49's Report Problem and Coach Connection fixes, RC48's readable Create Player form, RC47 privacy controls, migrations 010–014, closed-beta access, all existing functionality, and disabled tracker connectivity are preserved.

## RC47 — Combined RC46 privacy + RC47 closed beta

This single package combines the planned RC46 and RC47 work. New accounts require an Admin-approved email. Signup records a versioned privacy acceptance, Parent-managed Player creation requires a guardian attestation, and joining a Coach team requires an explicit Player or Parent opt-in.

The new Privacy & Account Center shows current Parent/Coach access, downloads an app-data export, and submits account, athlete, or Coach-access requests for Admin review. Admin now has a Closed Beta Readiness view, role-specific start checklists, improved feedback impact/category fields, and install guidance.

Tracker connectivity remains disabled. No tracker API routes or provider server modules are installed. Historical migrations 010–012 remain unchanged for database continuity; migration 013 adds only privacy/closed-beta controls.

## RC45 — Tracker connectivity removed for now

This safety release removes all tracker connection, sync, imported-data display, and Coach tracker-sharing entry points from Player, Parent, Coach, and Admin experiences. The tracker API routes and provider connection/sync modules are removed.

No tracker provider credentials are required. Historical migrations 010, 011, and 012 remain in the package only to preserve databases where they were already applied; do not roll them back or delete existing rows manually. Manual testing, readiness, workouts, goals, analytics, Supabase, roles, Junior mode, photos, cloud test athletes, and all unrelated functionality remain available.


## RC42 — Clear Tracker Connection Center
Player and Parent experiences now expose Connected Trackers in three clear places: Home, Settings, and Recovery & Readiness. Coach/Admin preview modes can see where the feature lives but cannot connect or view private tracker data. No new database migration is required for RC41.

## Combined RC36 + RC37 + RC38 release

This is one full installable app package that includes the RC36 accessibility/role-hero baseline, the RC37 Performance Intelligence and interaction work, and the RC38 reliability/notifications/beta-hardening work.

### RC36 preserved
- Text sizing up to 180%.
- Full-fill Parent and Coach heroes.
- Wide Player game hero.
- Working Settings portal.
- Persistent navigation, setup modal, roles/permissions, Junior mode, Player More, cloud test athletes, player photos and Supabase integration.

### RC37 — Performance Intelligence & Interaction
- Player Home now has a Performance Intelligence recommendation built from readiness, goals, training consistency and recent testing momentum.
- More decisive next-action guidance: recovery-first, train with intent, build on testing momentum, finish a goal step, or build a cleaner data signal.
- Subtle hero/signal/chart motion with full `prefers-reduced-motion` support.
- Additional front-to-back visual consistency rules to keep non-Junior screens flatter and more performance-instrument-like.

### RC38 — Reliability, Alerts & Beta Hardening
- New in-app Alerts center for recovery, training, goal milestones, progress trends and cloud-sync issues.
- Alert preferences are stored locally in Settings.
- New always-visible beta reliability rail for online/offline, cloud status and local recovery-point status.
- Athlete snapshots now timestamp a local recovery point whenever data changes.
- Settings can download a JSON recovery backup of the active athlete.
- Sign-in now includes a Forgot password flow through Supabase.
- Service worker upgraded with versioned app-shell/static-asset caching and navigation fallback.
- Existing cloud retry/local queue behavior remains preserved.

### Database
No new Supabase migration is required. Migration 009 is unchanged byte-for-byte.

### Connected Trackers — RC39
Connected Trackers is intentionally private to Player and authorized Parent accounts. Coach and Admin roles cannot query tracker metrics.

Before enabling live providers, run `supabase/migrations/010_connected_trackers_player_parent_only.sql`, add the server-only Supabase service-role key and tracker encryption key in Vercel, then add OAuth credentials for any providers you want to enable. Provider redirect URLs use `/api/trackers/oauth/callback/<provider>` on the deployed beta domain.

### Google Health / Fitbit — RC40
RC40 migrates new Fitbit/Pixel Watch connections from the legacy Fitbit Web API to Google Health OAuth 2.0. Player and authorized Parent accounts can connect Google Health in Settings, then import recent workouts, sleep duration/efficiency, daily resting heart rate and HRV. Coach and Admin remain denied access to tracker data. Run migration 011 after migration 010 before testing the connection.
