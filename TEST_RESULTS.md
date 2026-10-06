# RC68 validation · 2 October 2026

Version 72.3.119, built from the completed RC67 combined source.

| Check | Result |
| --- | --- |
| npm install | Passed |
| npm run test:typecheck | Passed |
| npm test | Full registered regression suite passed |
| Privacy runtime tests | 25/25 passed |
| PostgreSQL privacy tests | 52/52 passed |
| Existing redesign tests | 35/35 passed |
| Original migrations | 001–016 preserved byte-for-byte; 16/16 checksum checks passed |
| npm run build | Passed; existing CSS compatibility warnings documented in build log |

## Privacy validation

The database tests apply migrations 001–017 to embedded PostgreSQL using PGlite 0.5.8. The fixture supplies Supabase-style Auth identities, JWT claims and grants. Tests exercise actual SQL policies, triggers and RPCs: unrelated access rejection, under-18 guardian gates, MFA-required Admin decisions, Coach revocation, pause/write rejection, export, erased-photo reinsertion rejection, shared-parent conflicts, reviewed erasure, linked child-login erasure and preservation of other parents' accounts. The fixture omits the pgcrypto extension statement; PostgreSQL's built-in UUID generation is available.

Runtime tests cover age boundaries, local cache removal, photo validation and the deletion Edge Function with mocked Auth HTTP responses. Invalid origins, tokens, passwords and account mismatches cannot reach deletion. A valid request uses the server-verified owner ID, ignoring a client-supplied ID.

Privacy controls passed 32 local browser findings across parent, unverified, paused, shared-parent, adult and Admin fixtures at 320px, 390px, 768px and 1440px. There was no document overflow, clipped heading/action text or browser runtime error. Confirmation and disabled controls were checked. The temporary fixture route was removed before the production build and is excluded from the archive.

These checks use disposable local fixtures, not live Supabase Auth, MFA, email delivery or production accounts. Hosted acceptance tests described in SUPABASE_SETUP.md remain necessary after installation. No production database, account, repository or deployment was changed.

## Preserved RC67 evidence

The RC67 baseline previously passed 88 role/layout checks and 22 large-text layout checks across Player, Parent, Coach and Admin. Those dated results are included under validation/rc67-baseline; they are historical evidence, not a new RC68 run of authenticated role workflows.

## Operational limits

App deletion removes active records covered by the implemented SQL. Provider backups, restored data, downloaded exports and screenshots require the published retention and restoration process. Verification evidence and audit-reference expiration require operator configuration. PRIVACY_OPERATIONS.md records these responsibilities. Terms and guardian-consent drafts require jurisdiction-specific legal review; this test report does not certify legal compliance or a complete production security audit.

Build warnings concern inherited CSS start/end alignment compatibility. The package manager also reports an environment-level http-proxy configuration warning. See the included logs for exact output.
