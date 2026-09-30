# Elite Performance RC67 · Git push

Run these after installing and testing the ZIP. They publish a review branch, not the production branch. Use this direct build independently of the earlier Codex Cloud RC67 branch.

1. Open your app folder.

```bash
cd /workspaces/athlete-performance-app
```

2. Verify that the current branch is `release/rc67-direct-build`.

```bash
git branch --show-current
```

3. Review changed and new files. `.env.local`, dependencies, build output, and ZIPs are ignored.

```bash
git status
```

4. Stage the source and guides.

```bash
git add .
```

5. Inspect the staged file list before committing. No credentials should appear.

```bash
git diff --cached --stat
```

6. Commit.

```bash
git commit -m "Release RC67 Elite Performance visual and usability redesign"
```

7. Push the review branch.

```bash
git push -u origin release/rc67-direct-build
```

GitHub will offer a pull request link. Open it to review the changes. A connected Vercel project may also generate a Preview deployment. Test that preview before merging. Merging to your configured production branch can trigger a live Vercel deployment.
