# Phase 72.3.106 RC56 — GitHub and Vercel Deployment

Run these commands after RC56 passes `npm run release:check` in Codespaces.

## 1. Review the changed files

```bash
git status
```

## 2. Stage the release

```bash
git add .
```

## 3. Commit RC56

```bash
git commit -m "Release Phase 72.3.106 RC56 Admin Home icon repair"
```

## 4. Push to GitHub

```bash
git push origin main
```

If the Vercel project is connected to this GitHub repository and watches `main`, the push starts deployment automatically.

## 5. Manual Vercel deployment only if GitHub is not connected

```bash
npx vercel --prod
```

Use the same Supabase environment variables already configured for RC52. No tracker-provider credentials are needed because tracker connectivity remains disabled.
