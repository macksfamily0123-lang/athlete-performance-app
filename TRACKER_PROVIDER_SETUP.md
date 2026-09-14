# RC40 Connected Tracker Provider Setup

## Privacy model
Tracker data is private to the linked **Player** and authorized **Parent** accounts. Coach and Admin roles are denied by migration 010 Row Level Security and by the server API authorization checks.

## Required Supabase migrations
- Migration 010 creates the private tracker tables and Player/Parent-only RLS rules.
- Migration 011 adds `google-health` as the new Google Health / Fitbit provider ID while preserving legacy `fitbit` values for migration safety.
- Migration 009 remains unchanged.

## Server-only Vercel variables
Never expose these values with a `NEXT_PUBLIC_` prefix:

- `SUPABASE_SERVICE_ROLE_KEY`
- `TRACKER_TOKEN_ENCRYPTION_KEY`
- `GOOGLE_HEALTH_CLIENT_ID`, `GOOGLE_HEALTH_CLIENT_SECRET`
- `OURA_CLIENT_ID`, `OURA_CLIENT_SECRET`
- `WHOOP_CLIENT_ID`, `WHOOP_CLIENT_SECRET`
- `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`
- `TRACKER_APP_URL` — your deployed beta origin, e.g. `https://athlete-development-app.vercel.app`

A strong random value can be used for `TRACKER_TOKEN_ENCRYPTION_KEY`. OAuth access and refresh tokens are AES-256-GCM encrypted before database storage.

## OAuth redirect URLs
Register the matching redirect URL in each provider developer console, replacing the domain if your Vercel domain differs:

- Google Health: `https://YOUR-DOMAIN/api/trackers/oauth/callback/google-health`
- Oura: `https://YOUR-DOMAIN/api/trackers/oauth/callback/oura`
- WHOOP: `https://YOUR-DOMAIN/api/trackers/oauth/callback/whoop`
- Strava: `https://YOUR-DOMAIN/api/trackers/oauth/callback/strava`

## Google Health / Fitbit
Google Health replaces the legacy Fitbit Web API connector for new connections. It uses standard Google OAuth 2.0 and imports recent:
- Exercise/workout sessions
- Sleep duration and calculated sleep efficiency
- Daily resting heart rate
- Daily HRV when available

The configured Google Health scopes are read-only:
- `googlehealth.activity_and_fitness.readonly`
- `googlehealth.sleep.readonly`
- `googlehealth.health_metrics_and_measurements.readonly`
- `googlehealth.profile.readonly`

The Vercel production callback must exactly match the authorized redirect URI in Google Cloud:
`https://athlete-development-app.vercel.app/api/trackers/oauth/callback/google-health`

## Oura
Sleep/readiness + workout summaries, with heart-rate scope requested.

## WHOOP
Sleep, recovery, cycles/strain, and workout summaries.

## Strava
Workout/activity data. Sleep is not imported from Strava.

## Architecture-ready but not live in this web release
- Garmin: shown as provider-approval ready; activate after approved Garmin API access is available.
- Apple Health: needs a future native iOS bridge.
- Android Health Connect: needs a future native Android bridge.

## First sync
After a provider connects, return to **Settings → Connected trackers** and tap **Sync now**. Recent normalized sleep/recovery/workout records will appear on the Player/Parent Home tracker strip and can contribute to Performance Intelligence.
