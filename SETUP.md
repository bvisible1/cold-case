# Cold Case — Sales Training Game · Setup

A browser-based sales-training simulation (Dynatrace selling into Meridian Capital), served by a small Java/Spring Boot backend that proxies the Anthropic API for the AI scoring and persona conversations.

## What you need
- **Java 17+** (a JDK — `java -version` should show 17 or higher)
- **Maven** (`mvn -version`)
- An **Anthropic API key** with billing credit — get one at https://console.anthropic.com → API Keys

## First-time setup
1. In the project root, create a file named **`.env`** containing your key:
   ```
   ANTHROPIC_API_KEY=sk-ant-...your-key...
   ANTHROPIC_MODEL=claude-sonnet-4-6
   ```
   (This file is intentionally **not** included in the zip — it's a secret. Create your own.)

## Run it locally
```
./run.sh
```
This loads your key from `.env`, frees the port, builds, and starts the server. Then open **http://localhost:8081**.

(If `./run.sh` won't execute: `chmod +x run.sh` first. To use a different port: `./run.sh 8082`.)

## Deploy it (optional)
Push the project to a GitHub repo, then create a Railway project from that repo. In Railway → your service → **Variables**, add `ANTHROPIC_API_KEY` with your key. Railway builds and serves it automatically and gives you a public URL.

## Optional — password-protect the site
The game ships with an optional Basic Auth gate (`BasicAuthFilter.java`). It is **off by default** — local runs and this zip stay open. To turn it on, set env vars:
```
APP_PASSWORD=your-shared-password
APP_USERNAME=team        # optional, defaults to "team"
```
On Railway: service → **Variables** → add `APP_PASSWORD` (and optionally `APP_USERNAME`), then redeploy. Visitors get a browser login prompt and enter the username + password once. Leave `APP_PASSWORD` unset to keep the site open.

## Optional — data capture (Supabase)
The game can log transcripts and scores to Supabase (off by default). To enable: create a Supabase project, run `docs/supabase-schema.sql` in its SQL editor, and paste your project URL + anon key into the top of `src/main/resources/static/supabase-client.js`.

## Re-skinning to another company
See `Re-templating-Cold-Case.pptx` and `docs/persona-breakdown.md`. In short: the scenario lives in `src/main/resources/static/data.js` (account, seller, personas, scoring) plus the artifacts in `assets/`. The engine, backend, and scoring framework stay as-is.

---
*Never commit or share your `.env` / API key. The key is read from the environment, never stored in code.*
