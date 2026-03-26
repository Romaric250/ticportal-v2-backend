# TIC Portal v2 — backend documentation

The TIC Portal is a web platform that connects students, teams, and mentors. This repository is the **backend API** (Express, Prisma, MongoDB).

## Setup and local testing

**Full guide:** [DEVELOPMENT.md](./DEVELOPMENT.md) — install Node, `.env`, `prisma db push`, `npm run dev`, Docker local compose, troubleshooting.

Quick start:

```bash
cp .env.example .env   # then edit .env
npm install
npx prisma db push
npm run dev
```

- API base URL: `http://localhost:5000` (default)
- Health: `GET /health`
- Swagger UI: `http://localhost:5000/api/docs`

## OpenAPI / Swagger files

- `swagger/user-profile.yaml` — OpenAPI spec (see also `swagger/README.md`)
- Interactive docs: `/api/docs` when the server is running

## Deployment

See **`deploy/README.md`** (Docker Compose + Caddy on a VPS).
