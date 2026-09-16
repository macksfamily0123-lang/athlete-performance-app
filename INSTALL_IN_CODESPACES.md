# Phase 72.3.98 RC48 — Parent Player Form Fix

This is one full release. It includes the RC48 readable Create Player form plus all RC46/RC47 privacy and closed-beta functionality. Tracker connectivity remains disabled.

## Codespaces

1. Upload `athlete-performance-app-phase-72-3-98-RC48-parent-player-form.zip` to the root of your Codespace.

2. Open the terminal and go to the repository folder.

```bash
cd /workspaces/athlete-performance-app
```

3. Extract the release over the existing app.

```bash
unzip -o athlete-performance-app-phase-72-3-98-RC48-parent-player-form.zip
```

4. Remove the old Next.js build cache.

```bash
rm -rf .next
```

5. Install the locked dependencies.

```bash
npm install
```

6. Run every automated check and the production build.

```bash
npm run release:check
```

7. If migration 013 already ran for RC47, do not run it again. RC48 has no new database migration. For a fresh database only, print migration 013 and run it after migrations 001–012.

```bash
cat supabase/migrations/013_youth_privacy_closed_beta.sql
```

8. Start the Codespaces preview.

```bash
npm run dev -- -H 0.0.0.0 -p 3001
```

## GitHub and Vercel

9. Check the changed files.

```bash
git status
```

10. Stage the release.

```bash
git add .
```

11. Commit the combined release.

```bash
git commit -m "Release Phase 72.3.98 RC48 parent player form"
```

12. Push to GitHub. If your Vercel project tracks `main`, this push starts the deployment.

```bash
git push origin main
```

13. If Vercel is not connected to GitHub, deploy from Codespaces with the Vercel CLI.

```bash
npx vercel --prod
```

No Google Health/Fitbit, Oura, WHOOP, Strava, or KINEXON credentials are required. Keep historical migrations 010–012 in place; do not roll them back.
