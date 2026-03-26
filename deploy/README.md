# Deploy on a VPS (Docker)

For **running locally first** (Node or Docker), see **`docs/DEVELOPMENT.md`**.

For a **Contabo VPS walkthrough** (including **Nginx Proxy Manager** vs **Caddy**), see **`docs/DEPLOY_CONTABO.md`**.

- **Default:** `docker compose up -d --build` starts the **API** and publishes **5005**. Use this when **Nginx Proxy Manager** (or another proxy) already owns **80/443** — configure NPM to forward to `ticportal-api:5005` (see main deploy doc).
- **Optional Caddy** (clean VPS, nothing on 80/443): `docker compose --profile caddy up -d --build` — Caddy handles **80/443** and Let’s Encrypt; see `deploy/Caddyfile`.

## Prerequisites

- **MongoDB**: use [MongoDB Atlas](https://www.mongodb.com/atlas) or another reachable `DATABASE_URL` (Prisma uses MongoDB).
- **DNS**: create an **A record** for your API host (e.g. `api.yourdomain.com`) pointing to the VPS **public IP**.
- **Firewall**: allow **22** (SSH), **80**, and **443** (e.g. `ufw allow 80,443/tcp` on Ubuntu).

## One-time server setup

Install Docker Engine and Compose plugin (see [Docker’s docs](https://docs.docker.com/engine/install/ubuntu/) for Debian/Ubuntu).

Clone the repo on the VPS, then from the backend root:

1. Create a production `.env` on the server (secrets only; never commit it).
2. Edit `deploy/Caddyfile` and replace `api.example.com` with the same hostname you set in DNS.
3. In `.env`, set at least:
   - `DATABASE_URL` — Mongo connection string
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
   - `CLIENT_URL` / `FRONTEND_URL` — your real frontend URLs (CORS + emails)
   - `TRUST_PROXY=true` is already set in `docker-compose.yml`; keep it when using Caddy.

**API + NPM (recommended when 80/443 are already in use):**

```bash
docker compose up -d --build
```

**API + Caddy (dedicated VPS):**

```bash
docker compose --profile caddy up -d --build
```

Logs:

```bash
docker compose logs -f api
docker compose logs -f caddy   # only if you used --profile caddy
```

With **Caddy**, HTTPS certificates are issued automatically once DNS points to the server and **80/443** are free. With **NPM**, issue certificates in the NPM UI.

## Migrations

After schema changes, run Prisma migrate against your production DB from a trusted environment (CI or your machine with `DATABASE_URL`), or run a one-off container on the VPS:

```bash
docker compose run --rm api npx prisma migrate deploy
```

(Ensure `DATABASE_URL` is set in `.env` on the server.)

## Optional: Redis / Kafka

If you enable `IS_REDIS_ACTIVE` or `IS_KAFKA_ACTIVE`, add matching services to `docker-compose.yml` and set `REDIS_URL` / `KAFKA_BROKERS` to those service names.
