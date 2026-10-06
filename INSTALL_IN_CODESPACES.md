# Install RC69 in your existing Codespace

Download the combined RC69 ZIP. Open your existing athlete-performance-app Codespace. Upload the ZIP into the top-level Explorer folder. On Chromebook, tap the touchpad with two fingers to open the folder menu, then Upload. Keep your existing .env.local; this ZIP contains no secrets.

Paste each block separately into the terminal.

```bash
cd /workspaces/athlete-performance-app
```

```bash
git switch -c release/rc69-inactivity-privacy
```

```bash
unzip -o elite-performance-app-phase-72-3-119-RC69-privacy-combined.zip
```

```bash
npm install
```

```bash
npm run test:typecheck
```

```bash
npm test
```

```bash
npm run build
```

In .env.local, keep your existing Supabase settings and add or replace these public contact settings:

```dotenv
NEXT_PUBLIC_PRIVACY_OPERATOR_NAME="Steve"
NEXT_PUBLIC_PRIVACY_CONTACT_EMAIL="Eliteperformanceath@gmail.com"
```

Set NEXT_PUBLIC_PRIVACY_RETENTION_NOTE only after confirming your actual backup expiration; see SUPABASE_RC69.md. Do not put cron, email-provider or service-role secrets in NEXT_PUBLIC variables.
