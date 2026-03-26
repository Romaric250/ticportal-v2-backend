# Deploy on a VPS (Docker + Caddy)

For **running locally first** (Node or Docker), see **`docs/DEVELOPMENT.md`**.

This stack runs the API in Docker and **Caddy** on ports **80/443** for HTTP and automatic HTTPS (Let’s Encrypt).

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

Build and start:

```bash
docker compose up -d --build
```

Check logs:

```bash
docker compose logs -f api
docker compose logs -f caddy
```

HTTPS certificates are requested automatically by Caddy once DNS points to this machine and ports 80/443 are reachable.

## API-only (no Caddy on this host)

If you terminate TLS elsewhere (CDN, another proxy), you can run only the API container:

```bash
docker compose up -d --build api
```

Map a port in `docker-compose.yml` for `api` (e.g. `ports: ["5005:5005"]` to match internal `PORT`) or put Nginx/Caddy on the host yourself.

## Migrations

After schema changes, run Prisma migrate against your production DB from a trusted environment (CI or your machine with `DATABASE_URL`), or run a one-off container on the VPS:

```bash
docker compose run --rm api npx prisma migrate deploy
```

(Ensure `DATABASE_URL` is set in `.env` on the server.)

## Optional: Redis / Kafka

If you enable `IS_REDIS_ACTIVE` or `IS_KAFKA_ACTIVE`, add matching services to `docker-compose.yml` and set `REDIS_URL` / `KAFKA_BROKERS` to those service names.
