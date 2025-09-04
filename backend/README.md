# Peepo Backend — Developer Guide

This backend is an Azure Functions v4 app using the .NET 9 isolated worker. It exposes minimal HTTP endpoints for contact messages and newsletter subscriptions, integrates Cloudflare Turnstile for bot protection, enforces IP-based rate limits using Azure Table Storage, and sends email via MailHog in development and SendGrid in production.

## Quick Start

1) Prereqs
- .NET SDK 9.0
- Azure Functions Core Tools v4
- Docker (for Azurite + MailHog)

2) Start local infra
- From `backend/src`: `docker compose up -d azurite mailhog`
  - Azurite: Tables/Queues/Blobs at `127.0.0.1:10002/10001/10000`
  - MailHog UI: http://localhost:8025 (SMTP on 1025)

3) Configure settings
- Edit `backend/src/local.settings.json` (see “Configuration” below). Defaults are provided for local dev.

4) Run the Functions host
- From `backend/src`: `func start`
- API base URL: `http://localhost:7071` (Functions Core Tools default)

5) Try requests
- Use `backend/debug.http` with VS Code REST Client, or curl examples in “Endpoints”.

## Project Layout

- `backend/src/Program.cs`: DI, options binding, services registration
- `backend/src/Endpoints.cs`: HTTP functions (`/api/contact`, `/api/subscribe`, `/api/subscribe/confirm`)
- `backend/src/Services/*`: Turnstile, Email (SendGrid/MailHog), RateLimit, Token, Secrets (KeyVault/local)
- `backend/src/Utils/TextSanitiser.cs`: defensive plain‑text sanitiser
- `backend/src/Dockerfile`, `backend/src/docker-compose.yml`: containerization and local infra
- `backend/src/local.settings.json`, `backend/src/host.json`: local runtime config
- `backend/debug.http`: sample requests for local testing

## Configuration

Configuration is bound to `AppOptions` from standard config providers. For local dev, set values under `Values` in `backend/src/local.settings.json`.

Important keys (local defaults are included in the repo):
- `AllowedOrigins`: array of allowed origins (must exactly match scheme+host+port). Example: `"http://localhost:5173"`
- `PublicBaseUrl`: public base URL of this API (used in confirmation links). Example: `"http://localhost:7071"`
- `ContactTo`, `ContactFrom`, `ContactFromName`: email routing and branding
- `MailHog:Host`, `MailHog:Port`: dev SMTP (used by `DevEmailService`)
- `TurnstileSiteKey`: Cloudflare Turnstile site key
- `TurnstileSecret`: Turnstile secret (local) and `TurnstileSecretName`: the config key or Key Vault secret name
- `ConfirmTokenKey`: base64 key for HMAC email confirmation tokens (32+ bytes recommended), and `ConfirmKeySecretName`: the config key or Key Vault secret name
- `SendGridApiKey` (production): stored in Key Vault; referenced by `SendGridKeySecretName`
- `AzureWebJobsStorage`: Storage connection string (Azurite for local)

How secrets are read:
- Development: `LocalSecretReader` fetches the raw value from configuration using the configured “secret name” keys (e.g., `TurnstileSecretName = "TurnstileSecret"`).
- Production: `KeyVaultSecretReader` reads Azure Key Vault using `KeyVaultUrl` and secret names from options (e.g., `TurnstileSecretName`, `SendGridKeySecretName`, `ConfirmKeySecretName`).

## Running Locally

- Ensure Docker is running, then start infra: `docker compose up -d azurite mailhog` from `backend/src`.
- Start Functions: `func start` from `backend/src`.
- Watch logs for successful start; endpoints will be under `http://localhost:7071/api/...`.
- MailHog UI at http://localhost:8025 shows delivered messages.

VS Code debugging
- Launch the host manually: `func start`
- Use the “Attach to Functions” debug configuration and pick the Functions host process.

## Endpoints

All endpoints require strict origin/referrer validation and Cloudflare Turnstile verification.

Headers required
- `Origin`: must exactly match one of `AllowedOrigins`
- `Referer`: authority part must match one of `AllowedOrigins`
- `X-Turnstile-Token`: front-end Turnstile token (for local dev with CF test keys, `test` works)

1) POST `/api/contact`
- Body: `{ "email": "user@example.com", "message": "..." }`
- Rate limit: 10 per 10 minutes per IP
- Sends an email to `ContactTo`. Message is aggressively sanitised to plain text.

Curl example:
```
curl -X POST http://localhost:7071/api/contact \
  -H "Origin: http://localhost:5173" \
  -H "Referer: http://localhost:5173/" \
  -H "X-Turnstile-Token: test" \
  -H "Content-Type: application/json" \
  --data '{"email":"alice@example.com","message":"hello <b>world</b>"}'
```

2) POST `/api/subscribe`
- Body: `{ "email": "user@example.com" }`
- Rate limit: 5 per minute per IP
- Upserts `Subscriptions` table row with `Status=Pending` and emails a confirmation link.

3) GET `/api/subscribe/confirm?token=...`
- Token is an HMAC-protected base64url string issued during subscription
- On success, sets `Status=Active` for the email and redirects to `/subscribed`

Sample requests are in `backend/debug.http`.

## Data Storage

- Azure Table Storage via `AzureWebJobsStorage`
  - `RateLimit`: reverse-timestamp rows for allowance checks by IP and action
  - `Subscriptions`: partition `sub`, row key of lowercased email; fields include `Status`, `CreatedUtc`, `ConfirmedUtc`
- Local: Azurite container (via docker compose) supports tables/queues/blobs; connection string `UseDevelopmentStorage=true`

## Email Delivery

- Development: `DevEmailService` uses MailHog (no TLS or auth)
  - Configure with `MailHog:Host` and `MailHog:Port` (defaults: localhost/1025)
  - View emails at http://localhost:8025
- Production: `EmailService` uses SendGrid
  - Provide `SendGridApiKey` via Key Vault (secret name from `SendGridKeySecretName`)
  - From address/name come from config (`ContactFrom`, `ContactFromName`)

## Bot Protection

- Cloudflare Turnstile verification via `TurnstileService`
  - Local dev is configured with Cloudflare’s test keys in `local.settings.json`
  - The token in `X-Turnstile-Token` is verified through Cloudflare (requires outbound network access)

## Rate Limiting

- Implemented in `RateLimitService` using Azure Table Storage timestamps
- Windows
  - Contact: 10 requests / 10 minutes per IP
  - Subscribe: 5 requests / 1 minute per IP
- Notes: no TTL cleanup is enforced by the code; consider a periodic compaction job if needed.

## Security Notes

- Strict origin/referrer checks: both must be present and match configured `AllowedOrigins`
- IP detection: prefers `X-Azure-ClientIP`, then first IP in `X-Forwarded-For`, then `X-Client-IP`
- Email content is sanitised to plain text and header-injection lines are dropped
- Confirmation tokens are HMAC-SHA256 using a base64 key; max token TTL is 2 days

## Docker

Local infra only (default)
- Start Azurite + MailHog: `docker compose up -d azurite mailhog` in `backend/src`

Run the function in a container (optional)
- The `functionapp` service is scaffolded but commented out in `backend/src/docker-compose.yml`
- To use it, uncomment the service and environment, then `docker compose up --build functionapp`

## Deploying (Production)

- Host: Azure Functions (dotnet-isolated), .NET 9
- App settings (environment variables)
  - `AllowedOrigins`: include your site origin(s)
  - `PublicBaseUrl`: your API base URL (https)
  - `AzureWebJobsStorage`: Storage account connection string
  - `KeyVaultUrl`: your Key Vault DNS name (e.g., `https://<name>.vault.azure.net/`)
  - `TurnstileSiteKey` and `TurnstileSecretName`
  - `ConfirmKeySecretName` (Key Vault secret contains a base64 key)
  - `SendGridKeySecretName`
  - `ContactTo`, `ContactFrom`, `ContactFromName`
- Secrets: create Key Vault secrets with names matching the `*SecretName` values
- Networking: functions must reach Cloudflare Turnstile verify endpoint and SendGrid (outbound)

## Troubleshooting

- 403 Forbidden: `Origin`/`Referer` missing or not in `AllowedOrigins`, or Turnstile verification failed
- 429 Too Many Requests: rate limit exceeded for IP/action window
- 400 Bad Request: invalid input or confirmation token
- 500 Internal Server Error: email/send failures or missing secrets
- Azurite not found: ensure `docker compose up -d azurite` and `AzureWebJobsStorage=UseDevelopmentStorage=true`
- No emails in dev: check MailHog UI (8025) and that `DevEmailService` is active (Development env)

## Useful Files

- `backend/src/local.settings.json`: local configuration
- `backend/debug.http`: ready-to-run local requests
- `backend/src/docker-compose.yml`: Azurite and MailHog containers
- `backend/src/Endpoints.cs`: request/response shapes and validations

<br />
<br />
<br />

# Layman's Guide

This guide explains, in plain language, how the backend protects forms from abuse, sends emails safely, confirms newsletter signups, and keeps messages clean and readable. No prior knowledge of tokens, Cloudflare Turnstile, Azure Key Vault, MailHog, or SendGrid required.

## What This Backend Does

- Keeps forms safe from bots and spam (human check + rate limits).
- Sends emails (contact messages and “confirm your email” links).
- Confirms newsletter signups via time-limited links.
- Cleans up user-submitted text so it’s safe to email.

It aims to be friendly for local development (nothing leaves your machine) and secure in production (secrets stored safely, external providers used for delivery).

---

## Email Service (Sends Email)

The Email Service sends two types of emails:
- Contact email: Forwards a message from your website’s contact form to your inbox.
- Confirmation email: Sends a “Confirm your email” link after someone subscribes to the newsletter.

How it delivers mail:
- Development (on your computer):
  - Uses MailHog (a local testing mailbox).
  - Emails never leave your machine.
  - Open http://localhost:8025 to see received emails.
- Production (live site):
  - Uses SendGrid (a real email service provider).
  - Emails are delivered to real inboxes.

Safety features:
- Message sanitisation: strips risky content (scripts, HTML) before sending.
- Secret keys: passwords/API keys are not hard-coded; they are read from secure configuration (see “Secrets” below).

Example: contact message flow
1) User fills the contact form and submits it.
2) Backend runs checks (human check, rate limit, origin check).
3) Backend sanitises the message and sends it:
   - Dev: to MailHog (check http://localhost:8025).
   - Prod: via SendGrid (delivered to your configured inbox).

---

## Rate Limit Service (Prevents Spamming)

The Rate Limit Service stops a single IP address from hammering your API.

- Why it matters: prevents bots or malicious users from sending too many requests in a short time.
- How it counts: keeps a simple timestamped record per IP and action in a lightweight database.
- Limits used here:
  - Contact form: up to 10 requests per 10 minutes per IP.
  - Subscribe: up to 5 requests per minute per IP.
- When a limit is exceeded: the API returns “429 Too Many Requests”.

Example: hitting the limit
- You run a script that calls “subscribe” 6 times in a minute from the same IP.
- The 6th request returns 429, telling you to slow down.
- Try again after the time window resets.

---

## Human Check (Turnstile by Cloudflare)

Turnstile is a user-friendly “are you a real person?” check (similar idea to CAPTCHAs, but less annoying).

What happens:
- On the website, Turnstile quietly challenges visitors; if they look human, it issues a short-lived token.
- The website sends that token with your form request.
- The backend asks Cloudflare, “Is this token valid?”
  - If yes, the request continues.
  - If no, the request is rejected (treated as likely a bot).

Benefits:
- Blocks automated spam and bot abuse.
- Usually invisible to legitimate users.

Local vs Production:
- Development uses test keys so everything works without external setup.
- Production uses real keys kept safe in secrets storage.

---

## Token Service (Confirmation Links for Newsletter)

When someone subscribes, we don’t immediately activate their email. Instead, we email them a confirmation link. Clicking the link proves they own that address.

How it works:
- Backend creates a token that contains:
  - The subscriber’s email.
  - An expiry time (e.g., within 24 hours).
- Token is “signed” with a secret key (think of it like sealing an envelope).
  - If someone changes the token, the signature won’t match, and the backend rejects it.
- Token lifetime:
  - The system caps tokens at 2 days maximum (even if you ask for longer).
- On click:
  - Backend checks the token (valid and not expired).
  - Marks the email as “Active” and redirects to a success page.

What users see:
- After subscribing, they get a “Please confirm your email” message in their inbox.
- Clicking the link completes the signup.

Common issues:
- “Invalid or expired link”: The token is wrong or too old. Resubscribe to get a fresh link.

---

## Text Sanitisation (Cleans User Messages)

Goal: Make user messages safe to email and easy to read.

What it does:
- Removes HTML and scripts: strips tags like <script>, <a href="...">, etc.
- Decodes HTML entities: turns things like “&amp;” back into “&”.
- Removes invisible trickery: deletes zero-width characters that can hide bad content.
- Blocks email header injections: drops lines like “Subject: …” that could corrupt an email.
- Defangs links: replaces URLs with “[link removed for security]”.
- Tidies spacing and length: collapses extra whitespace, trims, limits total characters and lines.

Before vs After (example)
Input:
Hello! <b>Check this out</b> https://phish.example.com
<script>alert('xss')</script>
Subject: Sneaky header
Output:
Hello! [link removed for security]
(alert and “Subject:” line removed, HTML stripped)

Why it’s important:
- Prevents malicious content in emails.
- Keeps support inboxes safe and readable.
- Avoids accidental formatting or broken layouts in emails.

---

## Where Data and Secrets Live

Data (using a simple table database):
- Subscriptions:
  - A row per email with status: Pending (awaiting confirmation) or Active (confirmed).
  - Tracks when created and when confirmed.
- Rate-limiting entries:
  - Short-lived timestamps by IP and action to count recent requests.

Secrets (keys/passwords):
- Development:
  - Kept in your local configuration (e.g., local.settings.json).
  - Examples: MailHog host and port, Turnstile test keys, token signing key for local.
- Production:
  - Stored in a secure vault (Azure Key Vault) and never in code.
  - Examples: SendGrid API key, Turnstile secret key, token signing key.
  - The backend reads these at runtime.

---

## Examples You Can Try (Locally)

Prereqs:
- Azurite (local storage) and MailHog running (see dev guide).
- Functions host running at http://localhost:7071.

1) Subscribe (sends confirmation email to MailHog)
```bash
curl -X POST http://localhost:7071/api/subscribe \
  -H "Origin: http://localhost:5173" \
  -H "Referer: http://localhost:5173/" \
  -H "X-Turnstile-Token: test" \
  -H "Content-Type: application/json" \
  --data '{"email":"alice@example.com"}'
```
Then open MailHog: http://localhost:8025 and click the confirmation link.

2) Contact (sends sanitized message to MailHog)
```bash
curl -X POST http://localhost:7071/api/contact \
  -H "Origin: http://localhost:5173" \
  -H "Referer: http://localhost:5173/" \
  -H "X-Turnstile-Token: test" \
  -H "Content-Type: application/json" \
  --data '{"email":"alice@example.com","message":"hello! <b>bold</b> <script>alert(1)</script>"}'
```
Open MailHog to see the sanitised message.

3) Hitting the rate limit (example)
- Send the subscribe request 6 times quickly from the same machine/IP.
- The last one should return 429 (Too Many Requests).

4) Invalid/expired confirmation link
- Wait until the token’s expiry (or mess with the URL) and try again: the API returns a “Bad Request” message.
- Re-subscribe to get a new link.

---

## Troubleshooting

- Forbidden (403): The request didn’t pass the origin/referrer or the human check (Turnstile token).
- Too Many Requests (429): You hit the rate limit; wait, then try again.
- Bad Request (400): Input was wrong (e.g., malformed email) or the token was invalid/expired.
- Internal Error (500): Usually a missing/invalid secret or email send failure.
- Not seeing emails (local): Make sure MailHog is running and check http://localhost:8025.
- Not seeing emails (prod): Confirm SendGrid is configured and keys are valid.

---

## Quick Glossary

- MailHog: A local pretend email server for development. Nothing leaves your machine.
- SendGrid: A real email provider used in production to deliver emails to users.
- Turnstile: Cloudflare’s friendly “prove you’re human” check.
- Token (confirmation): A signed, time-limited string included in email links to prove authenticity.
- Secret key: A private value used to sign tokens or authenticate with providers; kept out of code and stored safely.
- Rate limit: A rule that limits how often a single IP can call an action, to reduce spam/abuse.

---

If you want a quick tour (screenshare walkthrough or test checklist), say the word and I’ll draft it.
