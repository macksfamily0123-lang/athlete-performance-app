# RC68 Git push

Run each box separately after local checks pass.

```bash
cd /workspaces/athlete-performance-app
```

```bash
git branch --show-current
```

Expected review branch: `release/rc68-parent-privacy`.

```bash
git status
```

```bash
git add .
```

Inspect the staged list. No `.env.local`, installed dependencies, build outputs, ZIPs or secret files should be present:

```bash
git --no-pager diff --cached --stat
```

```bash
git commit -m "Release RC68 parent privacy and data controls"
```

```bash
git push -u origin release/rc68-parent-privacy
```

Review the preview and privacy setup before merging into your Vercel production branch.
