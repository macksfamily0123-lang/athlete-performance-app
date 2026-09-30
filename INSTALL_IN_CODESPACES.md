# Elite Performance RC67 · Codespaces installation

This ZIP is the complete app built directly from RC66 in this conversation. Use this source rather than merging the separate Codex Cloud RC67 task over it. It includes the shared redesign and all migrations 001–016. There is no new database migration.

Use your existing Codespace. Keep your existing `.env.local` and Supabase project. Each command below runs separately. If the terminal is running the old app, stop it with Ctrl+C first.

1. Upload `elite-performance-app-phase-72-3-117-RC67-combined.zip` into your repository folder using the Codespaces Explorer upload command.

2. Open the repository folder in the terminal.

```bash
cd /workspaces/athlete-performance-app
```

3. Check for existing work. If this shows changes you want to keep, commit or back them up before extracting the release.

```bash
git status
```

4. Create a separate branch for this direct build.

```bash
git switch -c release/rc67-direct-build
```

5. Extract the full release into the app folder. This replaces the source files, but the ZIP contains no `.env.local`.

```bash
unzip -o elite-performance-app-phase-72-3-117-RC67-combined.zip
```

6. Clear the old build cache.

```bash
rm -rf .next
```

7. Install dependencies.

```bash
npm install
```

8. Run type checking.

```bash
npm run test:typecheck
```

9. Run automated checks.

```bash
npm test
```

10. Build the production app.

```bash
npm run build
```

11. Start the development preview.

```bash
npm run dev -- --hostname 0.0.0.0 --port 3001
```

Open forwarded port **3001**. The ribbon should read **CLOSED BETA · RC67 · v72.3.117**. Check Player, Parent, Coach, and Admin with your existing accounts. The incomplete check-in and weekly review should be first in Home content. Parent and Coach see status and saved results; completion permissions remain unchanged.

If `.env.local` is absent, follow `SUPABASE_SETUP.md`. After testing, use `GIT_PUSH.md` to publish this branch and `DEPLOY_TO_VERCEL.md` for deployment. No deployment or database changes were performed when this ZIP was built.
