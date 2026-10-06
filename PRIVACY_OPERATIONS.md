# RC68 privacy and security operating plan

This is a concrete implementation and operator checklist for review, not a legal opinion or certification. Obtain children's-privacy counsel review of applicable federal/state rules, the under-18 policy, guardian authority process, consent method and retention schedule before accepting real minor records. COPPA's under-13 threshold is separate from this app's under-18 policy. A checkbox, email verification or manually typed evidence reference does not independently prove verifiable parental consent.

## Data-use commitment

Only information needed for accounts and athlete development. No advertising, data sales, marketing-email sharing or AI training with Player records. Photos are optional. Use initials/display names when possible. Supabase, Vercel and the configured transactional email provider are operational processors and must be disclosed/reviewed. External exercise links are optional; automatic remote profile photos and the external video thumbnail were removed.

## Verification and access

Maintain reviewed consent forms or approved-provider evidence in restricted storage outside feedback. Verify legal guardian authority for the specific Players, including multiple-parent disputes. An active Admin at authenticator assurance level 2 records the method and opaque reference only after review. Each verified Parent must authorize each Player under the current policy. Unknown age is protected. Adult transitions require review; Junior Mode and sport functionality do not change.

The Privacy Center is accessible when a Player workspace is blocked. Guardians can withdraw consent, pause collection, revoke Coaches and export data. A different guardian cannot silently reverse another guardian's withdrawal. Admin resolution needs recorded authority review. Private state is not opened when online authorization cannot be checked; this intentionally tightens offline access. Backend records are protected even if a screen is bypassed.

## Erasure

Single-guardian/adult Player erasure removes its active workspace and cascading sport profiles, links, trackers, reviews and feedback, as well as the linked Player login. Photo erasure redacts matching embedded copies and prevents stale restoration. Shared guardian records require authority review while collection can be stopped immediately. Parent account erasure removes that account and its personal workspace; another guardian's account and shared Player remain. Solely managed Players require prior erasure or a reviewed transfer. The last active Admin cannot delete the sole operational account.

Do not mark a request completed merely by editing its status. Reviewed erasure is an explicit operation in Admin → Family. Confirm affected database/Auth rows and record only a minimal opaque review reference. Parent notes already shared in another Player's history may require reviewed redaction; arbitrary free-text mentions, external screenshots/downloads and copies made outside app control cannot be located or recalled automatically. Explain any legitimately retained information and give parents a monitored escalation path.

## Written security program

Designate an accountable privacy/security owner. Keep production access limited; use MFA for Supabase/Vercel/GitHub administrators and app privacy decisions. Keep server keys out of browsers. Patch dependencies, review logs for sensitive information, use provider transport encryption, and test row-level controls with unrelated accounts after migrations. Review provider contracts and subprocessors. Keep an incident-response and parent-notification process, recovery contacts and a secure Admin MFA recovery process. Removing a staff account must revoke operational access.

## Retention and backups

Inventory live records, browser caches, Auth identities, provider logs, verification evidence, backup copies and downloaded reports. Publish actual expiration periods with the business justification for any retention. Do not invent a backup deletion deadline. Use a restricted deletion journal outside the restorable database snapshot; reconcile deletions before bringing a restored backup online. Dispose of expired verification documents and review references according to the agreed schedule. Avoid collecting identity documents in the app.

Logout and account changes clear app-local snapshots, photos and queued saves; accessibility preferences remain. Open sessions recheck authorization while online. Previously deployed versions, offline devices, exports and screenshots may retain earlier copies. Update clients and clear old devices as part of rollout; do not promise remote device erasure.

## Deployment acceptance

Before families use the release, verify the live project: all migrations present; no public data access; current agreement/guardian gating; MFA approval; unrelated-user API isolation; Coach revocation; paused writes; shared guardian conflict handling; photo removal; fresh-password account erasure; erasure row counts; policy contact; actual backup schedule. Hosted Auth, email, provider contracts, backup operations and legal review were not completed during local build.
