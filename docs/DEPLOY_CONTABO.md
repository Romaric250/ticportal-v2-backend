# Deploy the backend on Contabo (Docker + Caddy)

Use this checklist after your **DNS** points your API hostname (e.g. `api.ticsummit.org`) to the VPS **public IP** and the code is on **GitHub**.

**Stack:** `docker-compose.yml` runs the **API** container and **Caddy** on ports **80** and **443** (HTTPS via Let’s Encrypt). The API listens on **5005** inside Docker; Caddy proxies to it — you do **not** open 5005 to the internet for normal use.

---

## Before you SSH (verify once)

1. **DNS** — In Namecheap (or your DNS host), an **A record** for `api` (or your chosen subdomain) targets the **Contabo VPS IPv4**. Propagation can take a few minutes to a few hours. Check from your PC:

   ```bash
   nslookup apiv2.ticsummit.org
   ```

   The answer should be your VPS IP.

2. **MongoDB** — Have a production `DATABASE_URL` (e.g. MongoDB Atlas). Allow the VPS IP in Atlas **Network Access**, or use `0.0.0.0/0` only if you accept that risk.

3. **GitHub** — Know the clone URL, e.g.  
   `https://github.com/YOUR_USER/ticportal-v2-backend.git`  
   (SSH `git@github.com:...` if you use deploy keys).

---

## 1. SSH into the VPS

```bash
ssh root@YOUR_VPS_IP
```

Use your Contabo password or SSH key. If you use a non-root user with `sudo`, prefix admin commands with `sudo`.

---

## 2. Install Docker (one-time per server)

On **Ubuntu/Debian** (common on Contabo), use the [official Docker install](https://docs.docker.com/engine/install/ubuntu/) or:

```bash
apt-get update
apt-get install -y ca-certificates curl
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "${VERSION_CODENAME:-jammy}") stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Verify:

```bash
docker --version
docker compose version
```

---

## 3. Open the firewall (one-time)

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

---

## 4. Clone the repo and enter the project

Pick an install directory (example: `/opt/ticportal-v2-backend`):

```bash
mkdir -p /opt
cd /opt
git clone https://github.com/YOUR_USER/ticportal-v2-backend.git
cd ticportal-v2-backend
```

Replace the URL with your real GitHub repository.

---

## 5. Create production `.env` on the server

Do **not** commit `.env`. Create it only on the VPS:

```bash
nano .env
```

Set at least (adjust values):

- `DATABASE_URL` — MongoDB connection string  
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — long random strings  
- `CLIENT_URL` / `FRONTEND_URL` — your live frontend URL(s) for CORS and emails  
- `NODE_ENV=production` (optional; compose also sets runtime env)  
- `PORT=5005` — optional; `docker-compose.yml` already sets `PORT` for the container — if both exist, compose overrides for the container  

You can start from `.env.example` in the repo:

```bash
cp .env.example .env
nano .env
```

`TRUST_PROXY=true` is set in `docker-compose.yml` for the `api` service when using Caddy.

---

## 6. Confirm `deploy/Caddyfile`

The first line must be **exactly** the hostname that resolves to this VPS (no `https://`, no path), for example:

```text
api.ticsummit.org {
	encode gzip zstd
	reverse_proxy api:5005
}
```

After editing:

```bash
nano deploy/Caddyfile
```

---

## 7. Build and start

From the **repository root** (where `docker-compose.yml` is):

```bash
docker compose up -d --build
```

First start may take several minutes (image build + certificate issuance).

---

## 8. Check that it is live

**Logs**

```bash
docker compose logs -f api
docker compose logs -f caddy
```

Look for Caddy obtaining a certificate and the API listening.

**HTTPS**

```bash
curl -sS https://api.ticsummit.org/health
```

**Swagger (browser)**

```text
https://api.ticsummit.org/api/docs
```

If HTTPS fails, confirm DNS, ports **80/443** (Let’s Encrypt needs **80** for the HTTP-01 challenge), and that nothing else on the host binds **80/443**.

---

## 9. Prisma schema vs database

If the production database is empty or the schema changed, apply the Prisma schema to MongoDB (from project root on the VPS, with `.env` loaded):

```bash
docker compose run --rm api npx prisma db push
```

Use your team’s preferred workflow for production (some teams run pushes from CI only).

---

## 10. Later: deploy updates from GitHub

```bash
cd /opt/ticportal-v2-backend   # or your path
git pull
docker compose up -d --build
```

---

## Quick reference

| Item | Value |
|------|--------|
| Public URL | `https://<your-subdomain>/` (e.g. `https://api.ticsummit.org`) |
| Health | `GET /health` |
| API docs | `/api/docs` |
| Compose file | `docker-compose.yml` |
| Caddy config | `deploy/Caddyfile` |

More detail on local testing: [DEVELOPMENT.md](./DEVELOPMENT.md).  
Shorter technical notes: [`deploy/README.md`](../deploy/README.md).
