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
