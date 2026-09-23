# Phase 72.3.111 RC61 — GitHub and Vercel Deployment

Run these commands after RC61 passes `npm run release:check` in Codespaces and migration 015 has been run in Supabase.

## 1. Review the changed files

```bash
git status
```

## 2. Stage the release

```bash
git add .
```

## 3. Commit RC61

```bash
git commit -m "Release Phase 72.3.111 RC61 multi-sport team family profiles"
```

## 4. Integrate any newer GitHub commit

```bash
git pull --rebase origin main
```

## 5. Push to GitHub

```bash
git push origin main
```

If the Vercel project is connected to this GitHub repository and watches `main`, the push starts deployment automatically.

## 6. Manual Vercel deployment only if GitHub is not connected

```bash
npx vercel --prod
```

Use the same Supabase environment variables already configured. No tracker-provider credentials are needed because tracker connectivity remains disabled.
