# Push your RC69 review branch

Complete local checks and Supabase setup first. These commands push a separate branch for review. They do not merge or publish production.

```bash
cd /workspaces/athlete-performance-app
```

```bash
git status
```

Check that .env.local and provider secret files are ignored. Do not commit the downloaded ZIP or logs.

```bash
git add app components lib public scripts supabase package.json package-lock.json .env.example *.md
```

```bash
git diff --cached --stat
```

```bash
git commit -m "Add inactivity warnings and protected retention automation"
```

```bash
git push -u origin release/rc69-inactivity-privacy
```

Open the repository on GitHub and create a pull request into main. Review the changes and preview before merging. If Vercel auto-deploys main, merging triggers production deployment.
