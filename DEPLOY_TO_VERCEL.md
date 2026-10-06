# Vercel: preview then production

Complete INSTALL_IN_CODESPACES.md and SUPABASE_RC69.md. Retention remains disabled until the final activation SQL.

In Vercel → your project → Settings → Environment Variables, keep existing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY. Set these for the intended environments:

```dotenv
NEXT_PUBLIC_PRIVACY_OPERATOR_NAME=Steve
NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL=Eliteperformanceath@gmail.com
```

Set NEXT_PUBLIC_PRIVACY_RETENTION_NOTE to the actual inactivity policy and verified backup lifetime. Do not set Resend, cron or Supabase service-role secrets in Vercel public variables. Those belong in Supabase Edge secrets.

From Codespaces, preview:

```bash
npx vercel login
```

```bash
npx vercel
```

Choose your existing athlete-development project. Inspect the preview on phone and desktop. Check privacy notice, agreement, parent controls and ordinary check-ins/workouts. Once reviewed, publish:

```bash
npx vercel --prod
```

If GitHub integration deploys main automatically, use the reviewed PR merge instead of a second CLI production deployment.

Use the stable production domain in RETENTION_APP_URL. Keep PRIVACY_ALLOWED_ORIGINS current for the password-confirmed deletion function; this is a separate Edge secret from the cron secret. Your previously configured URL was:

```text
https://athlete-development-mqj7xsg3j-athlete-development-app.vercel.app
```

A new deployment URL may differ. Add each actual allowed app origin to PRIVACY_ALLOWED_ORIGINS, comma-separated, and check Supabase Auth redirect URLs too. Do not add wildcard origins. Redeploy after public environment changes; Next.js embeds them at build time.
