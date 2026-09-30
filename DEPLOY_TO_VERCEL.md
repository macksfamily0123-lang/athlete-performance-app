# Elite Performance RC67 · Vercel deployment

Use the existing Vercel project and existing Supabase project. Subscriptions and tracker connectivity remain disabled. No new Supabase migration is needed.

## Preview through GitHub

1. Follow `GIT_PUSH.md` to push `release/rc67-direct-build`.
2. Open your existing project in Vercel and look for the deployment for that branch.
3. Confirm that Preview has the same two public Supabase variables as your existing deployment:

```text
NEXT_PUBLIC_SUPABASE_URL
```

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

4. Open the Preview URL, then verify login, athlete selection, each role, and the check-in/review links. Configure the preview's auth redirect URL in Supabase if you use an email callback. See `SUPABASE_SETUP.md`.

## Production through GitHub

After you approve the preview, merge the review pull request into the branch configured for Production in your existing Vercel project. If that branch is `main`, the merge starts its deployment. Verify the finished deployment and the RC67 ribbon. Installed app clients may need to close and reopen the app to load the new service worker cache.

## CLI alternative

Use only if you want to deploy manually. Run each command separately from the app folder. Choose your existing project when prompted.

```bash
npx vercel login
```

```bash
npx vercel link
```

Preview:

```bash
npx vercel
```

Production, after you approve the preview:

```bash
npx vercel --prod
```

Framework: Next.js. Root directory: the folder containing `package.json`. Build command: `npm run build`. Leave the Next.js output directory at the framework default. Never set the root directory to the uploaded ZIP or `node_modules`.
