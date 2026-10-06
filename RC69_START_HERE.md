# RC69 — inactivity warnings and automatic deletion

This is the complete app source, including the existing design, privacy controls, and migrations 001–018. Migrations 001–017 are unchanged. Open INSTALL_IN_CODESPACES.md first, then SUPABASE_RC69.md, GIT_PUSH_RC69.md and DEPLOY_TO_VERCEL.md.

Automation is disabled on installation. After setup, the daily server job warns after six calendar months; final warnings start 30 days before the 12-month date. It deletes only after both warnings were confirmed delivered to every current recipient and at least 30 days have elapsed since final delivery. A late warning extends the deadline. Delivery to an email server does not prove a human read it.

Player or any linked parent activity resets that Player's clock. Existing records start a fresh clock at migration installation. Admin accounts, paused/disputed records, sole-parent accounts with Players, and Coaches with roster members are held. Missing recipient emails and failed notices also hold deletion. Monitor these exceptions; they are not silently erased. Activity tracking and Auth sign-in time both protect records.

Resend handles generic transactional warnings. Email content has no Player names, photos or training data. A verified sending domain is required; the Gmail contact is a reply-to address, not a verified sender. Resend is an additional processor that must be covered by your published notice and reviewed account settings. No emails were sent or live database changes made while building this ZIP.

The current privacy agreement version is 2026-10-03; existing users must accept it. Guardian verification stays intact. Junior Mode, roles, sports, teams, workouts and relationships remain as before. Subscriptions and trackers remain disabled.

Backup deletion is separate from active-record deletion. Verify Supabase backup/PITR expiration for your actual plan before publishing that period. On restore, reconcile private retention_tombstones from the newest database/export before enabling writes; otherwise restored data can reappear. Tombstones contain opaque IDs, kind and deletion date, no email or profile data. They must be retained for at least the longest verified backup lifetime.

Limits: a maximum of 25 pending notices is processed per daily run. A larger backlog delays deletion safely. Failed notices remain held until reviewed. Provider receipts prevent routine duplicate sends; a send followed by a database outage can cause a duplicate retry after the provider's idempotency window. No premature deletion follows. Live email delivery, cron execution and your production credentials still need deployment verification.
