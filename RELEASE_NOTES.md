# Athlete Performance App — Beta Release Candidate 1

Version: **72.3.50 RC1**

This release candidate freezes the current major feature set for beta testing.

## Core product direction
The app is an athlete development record and development-support system.
It is not a practice-plan builder.

## Role ownership
- Player owns Player Profile, Player goals, Daily Check-In, Player Weekly Review, and Player reflections.
- Coach supports Player-owned goals with suggestions/comments, owns Coach Weekly Review, manages the Athlete Development Plan, and records Practice Observations.
- Parent is support/read focused with Shared Notes as the primary write pathway.
- Admin has full administrative override access.

## Coach experience
- Coach Workspace Setup returns on each login while incomplete.
- Coach Home uses Development Command Center 2.0.
- Who Should I Review Next? prioritizes athletes from development-support signals.
- 7-step athlete development review:
  1. Readiness
  2. Player Goals
  3. Testing Trends
  4. Development Plan
  5. Practice Observations
  6. Coach Weekly Review
  7. Next Development Action

## Player experience
- Today-first Home
- simplified My Progress
- simplified My Development
- Player-owned Goals
- Athlete Development Plan visibility
- Daily Check-In and Weekly Review

## Parent experience
- support-focused Overview
- Schedule
- Recovery
- Progress
- Development Support
- Shared Notes

## Admin
- full athlete-data access
- cloud athlete selection
- full profile/data correction controls
- Coach Weekly Review override
- visible Role Ownership Matrix
- diagnostics / Beta Admin

## Database
No new migration is introduced in 72.3.50.
`004_admin_full_access.sql` remains required if not already applied.

## Release validation
Use:

`npm run release:check`

This runs:
- role permission audit
- regression suite
- full TypeScript typecheck
- Next.js production build


# Beta Release Candidate 2 — v72.3.51

Focus: reliability and beta testing.

Added:
- runtime error recovery boundary
- reload/report-error recovery actions
- online/offline banner
- diagnostic context on beta feedback
- transparent diagnostic disclosure
- Settings cloud reliability status
- automated reliability test suite

No new migration.


# Beta Release Candidate 3 — v72.3.52

Focus: Coach roster discoverability and Player invitation workflow.

Added:
- Invite Player directly in Coach Roster
- Manage Teams directly in Coach Roster
- invite-first Coach modal
- copy full invite message
- copy invite code only
- Player/Parent Join Team instructions
- already-joined team roster
- Coach Help + setup guidance for invitations

No new migration.


# Beta Release Candidate 4 — v72.3.53

Focus: Family account linking + Junior Player usability.

Added:
- Parent-managed Player accounts
- age captured when Parent adds a Player
- Junior Player Mode for age 10 and under
- simplified Junior Home and navigation
- simplified Junior goals
- easy-choice / emoji Daily Check-In
- Parent → managed Player session
- Return to Parent View
- Player Access Codes
- Player signup claim-code support
- existing fresh Player account claim flow
- one-athlete Player/Parent/Coach relationship model
- restricted Parent-managed Player cloud-save RPC
- duplicate-athlete protections
- migration 005

Preserved:
- Player-owned goals/check-ins/reviews
- Coach-owned formal Development Plan/Objectives
- Coach Practice Observations
- Coach Weekly Review security
- Parent support role
- Admin full-access override
- Coach Roster team invite workflow
- no practice-plan generation


# Beta Release Candidate 5 — v72.3.54

Focus: Junior Player usability and support-role scheduling/results.

Fixed:
- Junior Home `How am I doing?` button is green, clickable, and opens Progress.

Added:
- Parent workout scheduling
- Parent competition score/result entry
- Coach Home shortcuts for scheduling and competition results
- narrow `scheduleWorkout` permission
- narrow `enterCompetitionResult` permission
- Parent support cloud RPC
- migration 006
- score-only competition analytics protection

Preserved:
- Parent cannot broadly write training programs
- Parent cannot write Player reflections
- Parent cannot manage formal Coach Development Plan/Objectives
- Parent cannot create Practice Observations
- Player-owned goals/check-ins/reviews remain protected
- Coach-owned development workflow remains protected
- Coach can schedule workouts and log full competition records
- no practice-plan generation


# Beta Release Candidate 6 — v72.3.55

Focus: Junior Player goal-entry usability.

Fixed:
- Junior Player Goal page now always exposes the Player-owned goal form.
- The goal form is positioned at the top of the page instead of being easy to miss.
- Goal input fields are explicitly visible and touch-enabled on mobile.
- Save My Goal is a large forest-green primary action.
- Parent-managed Junior Player sessions can help type and save the Player's goal through the existing restricted managed-Player flow.

Preserved:
- Goals remain Player-owned.
- Coach cannot create or change Player goals.
- Parent normal view cannot create or change Player goals.
- Admin override remains available.
- No new database migration.


# Beta Release Candidate 7 — v72.3.56

Build hotfix for Junior Goal Entry.

Fixed the Next.js/TypeScript build error on the standard goal creation button by preventing React's click event from being passed into the optional Goal-type argument.

The Junior Player goal-entry card remains intact.

No new database migration.


# Beta Release Candidate 8 — v72.3.57

Combined release. Includes all fixes from v72.3.56.

Added:
- Player-first Parent connection using one-time Parent Connection Codes
- Parent `Connect Existing Player`
- Player `Invite a Parent`
- Admin Family & Account Diagnostics
- conservative Admin family/account repair RPC
- explicit Saved / Saving / Waiting / Failed cloud states
- offline local retry queue with automatic reconnect retry
- Junior `← Today` navigation
- Junior mobile touch/form polish
- shared role-specific Development Focus communication

Preserved:
- Parent-first Player login handoff
- duplicate-protection rules
- Junior Goal Entry and its build hotfix
- Parent/Coach workout scheduling
- Parent/Coach competition results
- Player-owned goals/check-ins/reviews
- Coach-owned Development Plan / Practice Observations / Coach Weekly Review
- Admin override
- no practice-plan generator
- no automatic athlete-record merge

Database:
- new migration 007


# Beta Release Candidate 9 — v72.3.58

Focus: persistent Admin role testing.

Fixed:
- Admin Preview role selector no longer disappears in Player or Junior Player preview.
- Added persistent Admin Test Mode bar.
- Added one-click Return to Admin.
- Athlete selector remains available during preview.
- Beta Admin remains directly available during preview.
- Removed the duplicate role selector from the normal context bar.
- Corrected the migration 007 `display_name` ambiguity in the packaged source.

Preserved:
- v72.3.56 Junior Goal build hotfix
- Junior Goal Entry
- Junior How Am I Doing action
- Junior Back to Today navigation
- Parent/Coach workout scheduling and competition results
- Family diagnostics and safe repairs
- cloud save status/retry
- Parent-first and Player-first family linking
- shared development communication
- all role ownership boundaries
- no practice-plan generator

No new database migration.


# Beta Release Candidate 10 — v72.3.59

Fixed:
- Junior `More → Search All Features` no longer opens a blank blurred screen.
- Replaced it with `See All My Features`.
- Added visible Junior feature palette and search.
- Added child-friendly feature names and descriptions.
- Preserved large touch targets and mobile layout.

No database migration.


# Combined Beta Release Candidate 12 — v72.3.61

Includes both planned updates in one download:

## 72.3.60 — Connections & Account Setup Cleanup
- Parent now chooses Create New Player vs Connect Existing Player.
- Parent Player cards show Player-login, Parent, and Coach connection status.
- Player Connections has a clear relationship summary and next action.
- Coach roster shows account/Parent connection state without exposing Parent identity.
- Admin Accounts explains why Parent-managed Junior Players are not login accounts.
- Admin Family adds connection guidance and View Athlete.
- Frontend blocks obvious same-Parent duplicate Player creation.

## 72.3.61 — Beta Reliability & Connection Hardening
- migration 008 adds safe relationship-summary RPCs.
- database duplicate guard prevents matching same-Parent Player recreation.
- connection actions lock while requests are running to prevent double submits.
- connection error messages are translated into plain language.
- connection status refreshes after successful Player/Parent/Coach changes.
- no automatic athlete merge.
- no practice-plan generator.

New database migration: `008_connection_setup_reliability.sql`.


# Beta Release Candidate 13 — v72.3.62

Fixed:
- Regular Player `More` no longer jumps directly to Competition.
- Player More sheet remains visible even when Competition is the only direct More tab.
- Search All Features remains reachable.
- Admin beta test athletes can now be created as cloud-persistent Supabase athletes.
- Cloud test athletes survive new Codespaces/browsers/devices.
- Family diagnostics treats intentional Admin Test athletes correctly.
- Exact duplicate Admin test athlete creation is blocked.

Important:
- Existing local-only test athletes are not automatically merged into cloud records.
- Real Player/Parent/Coach ownership rules are unchanged.
- No practice-plan generator added.

New migration:
- `009_player_more_cloud_test_athletes.sql`


# Beta Release Candidate 14 — v72.3.63

Combined release:
- Phase 72.3.62 Player More + cloud test athlete fixes
- Phase 72.3.63 visual hierarchy/navigation cleanup

UI improvements:
- stronger contrast between page, card, and nested-card surfaces
- large page titles and clearer heading scale
- readable body, form, and button text
- larger metrics and status values
- compact page guidance
- stronger active navigation
- simplified More/navigation sheets
- shorter role-specific page guidance
- mobile and Junior typography improvements

Preserved:
- Player More gateway fix
- Search All Features
- cloud-persistent Admin test athletes
- Family diagnostics
- Admin Preview
- Junior More/All Features
- Junior Goal Entry
- connection/account setup hardening
- all role ownership permissions
- no practice-plan generator

Database:
- no new migration for 72.3.63
- migration 009 remains included for users who have not installed the 72.3.62 database update yet
