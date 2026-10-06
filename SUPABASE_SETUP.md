# RC68 Supabase setup

Use the same project and existing credentials. Migrations 001–016 are preserved byte-for-byte. RC68 adds one new SQL migration and one server-only Edge Function. No tracker or subscription setup is needed.

## Existing database

Open `supabase/migrations/017_parent_privacy_controls.sql` in Codespaces, copy the complete file, and run it once in your existing Supabase SQL Editor. It is one transaction. Do not rerun migrations 001–016 on an existing project. Keep a provider backup before deployment; do not copy real youth data into public test fixtures.

Migration 017 creates guardian verification and Player privacy controls, closes inherited workspace write ambiguity, and adds protected privacy RPCs. Existing under-18 and unknown-age records remain blocked until guardian approval and current authorization. Adult age transitions require a reviewed Admin decision. Admin Test fixtures are exempt from guardian gating; never use them for real minors.

For a fresh database only, apply all included migrations in filename order 001 through 017.

## Server-only deletion function

Run each command separately in the Codespace app directory. Replace `YOUR_PROJECT_REF` with the identifier from your existing Supabase project URL. These commands deploy only the deletion function; the SQL step above is separate.

```bash
npx supabase login
```

Configure the exact app origins that may invoke deletion. Replace the URL with your actual existing app URL. For multiple origins, use a comma-separated list. No wildcard origins.

```bash
npx supabase secrets set PRIVACY_ALLOWED_ORIGINS="https://YOUR_APP.vercel.app" --project-ref YOUR_PROJECT_REF
```

Deploy:

```bash
npx supabase functions deploy privacy-account-delete --project-ref YOUR_PROJECT_REF
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-side built-in function credentials. Never put a service-role key in a `NEXT_PUBLIC_*` variable or source file. The function validates the caller with Supabase Auth, verifies their current password, and calls a service-only deletion RPC using that caller's identity. It ignores any client-provided account ID. Its function configuration disables gateway JWT checking because the handler performs server-side Auth validation itself, including compatibility with current key formats.

Set the public operator name, privacy contact and actual retention text as described in DEPLOY_TO_VERCEL.md, then restart Codespaces/redeploy Vercel so public build-time variables refresh.

## Operator workflow

1. Sign in as an Admin. Accept the current terms.
2. Open Admin Review and enroll/verify an authenticator. Guardian approval and reviewed privacy decisions require `aal2` at the database.
3. Complete a legally reviewed guardian-verification process outside the app. Review authority for the named Players; record an opaque reference in Admin → Accounts → Guardian verification review. Do not put identity documents or children’s information in feedback or references.
4. The verified Parent signs in, accepts the current policy, opens Privacy Center, selects each existing Player, and explicitly authorizes collection. New Parent-managed creation requires prior verification.
5. Test Coach opt-in and revoke. For a minor, a verified guardian must authorize new Coach sharing.
6. Shared-guardian deletion/withdrawal conflicts go through Admin → Family → Reviewed guardian requests after authority review. Changing a privacy-request status does not perform erasure.

Run hosted tests with dedicated disposable accounts: unrelated Player/Parent/Coach requests must fail; paused records must reject direct API writes; revoked Coaches must lose data access; account deletion must remove Auth and application rows while preserving another guardian's account.

## Retention and restoration

Publish a provider-verified retention schedule. Active erasure does not instantly erase provider backups or copies previously downloaded by other users. Maintain a restricted deletion journal outside the database backup boundary and reconcile erasures before restoring a backup into service. Configure periodic expiration of obsolete verification evidence and minimal review references. Removed-photo hashes prevent stale clients from restoring photos; determine their retention with counsel as part of the written schedule. The app does not claim these provider operations happen automatically.
