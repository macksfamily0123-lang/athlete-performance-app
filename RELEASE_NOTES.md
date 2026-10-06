# Elite Performance · Phase 72.3.119 RC68

Complete combined source release built from RC67. Shared graphite, forest-green, metallic-silver and off-white redesign, readiness, recovery, progress charts and navigation retained.

- Separate under-18 privacy authorization; existing Junior age rules and role layouts unchanged.
- Versioned Terms of Use and Privacy Notice, explicit agreement, decline/sign-out and cloud acceptance records.
- Guardian verification recorded only by an Admin with authenticator assurance. A signed form, documented verification call or approved-provider evidence reference must be reviewed first. A checkbox does not mark a guardian verified.
- Privacy Center for each linked Player: export, photo removal, Coach revocation, consent withdrawal, collection pause/resumption and confirmed deletion.
- Database rules enforce active accounts, workspace isolation, guardian authorization and paused collection. Qualified workspace write policies close ambiguous inherited correlation. Definer writes are checked at the database boundary.
- Photo uploads remain optional. Remote profile image URLs are blocked; removed photo hashes prevent stale clients restoring deleted photos. Primary, sport and embedded matching photo copies are removed.
- Single-guardian or adult Player erasure removes the active workspace, photos, linked Player login and cascaded app records. Shared guardian records need reviewed authority. A different guardian cannot silently override withdrawal.
- Password-verified server-only account deletion; other guardians and shared Players retained. Solely managed Players must be erased or transferred first. The last Admin cannot erase the only operational administrator.
- Logout/account-change cache clearing, cloud privacy rechecks and no personal workspace access while offline authorization cannot be verified. Pending save callbacks no longer repopulate caches after unmount.
- Supabase migrations 001–016 unchanged. Apply the new migration 017 and deploy the account deletion Edge Function. No trackers or subscriptions enabled.

The manual guardian process, operator contact and actual retention schedule must be configured before accepting real minor records. Terms are an implementation draft for counsel review, not a legal certification. Live Supabase settings, hosted Auth/MFA, real email delivery, Edge deployment and backup erasure must be validated in your project. See TEST_RESULTS.md and PRIVACY_OPERATIONS.md.

Migrations 001–016 unchanged; migration 017 adds the parent privacy controls.
