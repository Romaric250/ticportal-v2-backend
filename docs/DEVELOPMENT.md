# TIC Portal v2 Backend — local development and testing

This guide covers running the API on your machine **without Docker** (recommended for day-to-day work) and **with Docker** (to mirror production before deploying to a VPS).

**Requirements**

- **Node.js** 22.x (LTS) — [nodejs.org](https://nodejs.org/)
- **npm** (comes with Node)
- **MongoDB** — a connection string the app can use. The easiest path for local work is a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster; use its connection string as `DATABASE_URL`.

---

## 1. Clone and install

From the repository root (`ticportal-v2-backend`):

```bash
npm install
```

`postinstall` runs `prisma generate` so the Prisma Client is ready.

---

## 2. Environment variables

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set at least:

   | Variable | Purpose |
   |----------|---------|
   | `DATABASE_URL` | MongoDB URI (required). |
   | `JWT_ACCESS_SECRET` | Secret for access tokens (use a long random string). |
   | `JWT_REFRESH_SECRET` | Secret for refresh tokens (different from access). |
   | `CLIENT_URL` | Your frontend origin for CORS (e.g. `http://localhost:3000`). |

3. Optional: copy payment-related keys from `.env.fapshi.example` if you test Fapshi.

4. For **local dev without a reverse proxy**, keep `TRUST_PROXY=false` (default in `.env.example`).

Full list of variables is defined in `src/config/env.ts`.

---

## 3. Database schema (Prisma + MongoDB)

This project uses **Prisma** with **MongoDB**. There is no traditional SQL migration folder; apply the schema to your database with:

```bash
npx prisma db push
```

Seed sample data (if your project defines a seed):

```bash
npm run db:seed
```

Open Prisma Studio (optional):

```bash
npm run prisma:studio
```

---

## 4. Run the API (recommended: hot reload)

```bash
npm run dev
```

The server listens on **`http://localhost:5000`** by default (or the port in `PORT`).

**Production-style run** (after a build):

```bash
npm run build
npm start
```

---

## 5. Verify it works

**Health**

```bash
curl http://localhost:5000/health
```

You should get a JSON response indicating the service is up.

**Swagger UI**

Open in a browser:

```text
http://localhost:5000/api/docs
```

**Example authenticated request** (after you obtain a JWT from `POST /api/auth/login`):

```bash
curl -s http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Base path for REST routes is under `/api/...` (see route modules in `src/modules/`).

---

## 6. Run with Docker locally (production-like image)

Use this to test the same **Dockerfile** you will deploy, without Caddy.

**Prerequisites:** Docker Desktop (Windows/macOS) or Docker Engine + Compose on Linux.

1. Ensure `.env` exists and is valid (same as section 2).

2. Build and start **only the API** on port **5005** (see `docker-compose.local.yml`):

   ```bash
   docker compose -f docker-compose.local.yml up --build
   ```

3. Test as in section 5, but use **`http://localhost:5005`** instead of 5000 for curl/browser.

4. Stop:

   ```bash
   docker compose -f docker-compose.local.yml down
   ```

Notes:

- This compose file does **not** start MongoDB. `DATABASE_URL` must still point to a reachable MongoDB (e.g. Atlas from your host/network).
- Image runs with `NODE_ENV=production` and `TRUST_PROXY=false`, which matches “API exposed directly on localhost:5000”.

---

## 7. Full stack with Caddy (optional, closer to VPS)

The default `docker-compose.yml` runs **API + Caddy** on ports **80/443** and expects you to edit `deploy/Caddyfile` with a real hostname and DNS. That is mainly for **server** deployment.

To experiment on your machine with Caddy, you would need a hostname pointing to `127.0.0.1` or to use a placeholder and adjust ports; for first-time local testing, **sections 4–6** are enough.

See **`deploy/README.md`** for VPS deployment steps.

---

## 8. Troubleshooting

| Symptom | What to check |
|--------|----------------|
| `PrismaClientInitializationError` / DB errors | `DATABASE_URL` correct, Atlas IP allowlist (use `0.0.0.0/0` for dev or your IP), cluster running. |
| CORS errors from the browser | `CLIENT_URL` matches the exact frontend origin (scheme + host + port). |
| Port already in use | Change `PORT` in `.env` (or the host mapping in `docker-compose.local.yml`) or stop the process using that port. |
| `JWT` / auth failures | Secrets set, token not expired, using `Authorization: Bearer ...`. |

---

## 9. Related files

| File | Role |
|------|------|
| `src/config/env.ts` | Environment variable definitions |
| `prisma/schema.prisma` | Data model |
| `Dockerfile` | Production image build |
| `docker-compose.yml` | API + Caddy (VPS / HTTPS) |
| `docker-compose.local.yml` | API only on port 5005 (local Docker test) |
| `deploy/README.md` | Contabo / VPS deployment |

OpenAPI YAML under `docs/swagger/` complements the in-app Swagger at `/api/docs`.
