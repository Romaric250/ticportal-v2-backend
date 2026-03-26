# Deploy the backend on Contabo (Docker)

Use this checklist after your **DNS** points your API hostname (e.g. `api.ticsummit.org`) to the VPS **public IP** and the code is on **GitHub**.

**Two ways to get HTTPS:**

| Setup | What to use |
|--------|-------------|
| **This server already runs Nginx Proxy Manager** (or anything on **80/443**) | Start **only the `api` service** and add a **Proxy Host** in NPM — **do not** start Caddy (see [Nginx Proxy Manager on this server](#nginx-proxy-manager-on-this-server-ports-80443-already-in-use)). |
| **Clean VPS** — nothing on 80/443 | Use **Caddy** from this repo: `docker compose --profile caddy up -d` (see [Clean VPS: Caddy](#clean-vps-docker--caddy-only)). |

Default `docker compose up -d` starts the **API** and publishes **5005** on the host so NPM can proxy to it. Caddy is **opt-in** via the **`caddy` profile** so it does not fight with Nginx Proxy Manager.

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

`TRUST_PROXY=true` is set in `docker-compose.yml` for the `api` service (works behind Caddy **or** Nginx Proxy Manager).

---

## Nginx Proxy Manager on this server (ports 80/443 already in use)

If **Nginx Proxy Manager** (`jc21/nginx-proxy-manager` or similar) already maps **80** and **443**, you **cannot** run Caddy on the same host — use NPM for TLS and routing to the API.

### 1. Start only the API (no Caddy)

From the repo root:

```bash
docker compose up -d --build
```

Do **not** pass `--profile caddy`. This builds/starts `ticportal-api` and publishes **5005** on the host.

Remove a failed/old Caddy container from an earlier attempt:

```bash
docker rm -f ticportal-caddy 2>/dev/null || true
```

### 2. Let NPM reach the API by container name

Connect `ticportal-api` to the **same Docker network** as Nginx Proxy Manager (adjust the network name to match your server):

```bash
docker inspect nginx-proxy-manager -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{"\n"}}{{end}}'
```

Then:

```bash
docker network connect <NETWORK_FROM_ABOVE> ticportal-api
```

If it says the container is already connected, that is fine.

### 3. Configure Proxy Host in NPM

Open the NPM admin UI (often **`http://YOUR_VPS_IP:81`**).

**Hosts → Proxy Hosts → Add Proxy Host**

| Field | Value |
|--------|--------|
| Domain names | Your API host, e.g. `api.ticsummit.org` |
| Scheme | `http` |
| Forward hostname / IP | `ticportal-api` |
| Forward port | `5005` |
| Block Common Exploits | On (recommended) |
| Websockets Support | **On** (needed for Socket.io) |

**SSL** tab: request a Let’s Encrypt certificate for that domain, then enable **Force SSL** if you want.

### 4. Verify

```bash
curl -sS https://api.ticsummit.org/health
```

Swagger: `https://api.ticsummit.org/api/docs`

### Fallback without `docker network connect`

If you cannot attach networks, in NPM set **Forward hostname** to **`172.17.0.1`** (Docker bridge gateway on many Linux hosts) and port **5005**, with scheme **http**. If that fails, use your VPS’s private LAN IP. The API must stay published as **`5005:5005`** in Compose (default in this repo).

---

## 6. Confirm `deploy/Caddyfile` (Caddy path only)

Skip this section if you use **Nginx Proxy Manager** only.

The first line must be **exactly** the hostname that resolves to this VPS (no `https://`, no path), for example:

```text
api.ticsummit.org {
	encode gzip zstd
	reverse_proxy api:5005
}
```

Edit on the server:

```bash
nano deploy/Caddyfile
```

---

## 7. Clean VPS: Docker + Caddy only

Use when **nothing else** binds **80/443** on the machine.

```bash
docker compose --profile caddy up -d --build
```

First start may take several minutes (image build + Let’s Encrypt via Caddy).

---

## 8. Build and start (quick reference)

| Goal | Command |
|------|--------|
| API + **NPM** for HTTPS | `docker compose up -d --build` then configure NPM (above) |
| API + **Caddy** on a clean VPS | `docker compose --profile caddy up -d --build` |

---

## 9. Check that it is live

**API logs**

```bash
docker compose logs -f api
```

**Caddy logs** (only if you use `--profile caddy`)

```bash
docker compose logs -f caddy
```

**HTTPS**

```bash
curl -sS https://api.ticsummit.org/health
```

**Swagger (browser)**

```text
https://api.ticsummit.org/api/docs
```

If you use **Caddy** and HTTPS fails, confirm DNS, ports **80/443**, and that nothing else binds them. If you use **NPM**, fix the Proxy Host and SSL in the NPM UI.

---

## 10. Prisma schema vs database

If the production database is empty or the schema changed, apply the Prisma schema to MongoDB (from project root on the VPS, with `.env` loaded):

```bash
docker compose run --rm api npx prisma db push
```

Use your team’s preferred workflow for production (some teams run pushes from CI only).

---

## 11. Later: deploy updates from GitHub

```bash
cd /opt/ticportal-v2-backend   # or your path
git pull
docker compose up -d --build
```

---

## Troubleshooting: “Bind for 0.0.0.0:80 failed: port is already allocated”

**Most common on a busy server:** **Nginx Proxy Manager** (or another container) already uses **80** and **443**. Do **not** start Caddy — use **`docker compose up -d --build`** without `--profile caddy`, then add a **Proxy Host** in NPM (see [Nginx Proxy Manager on this server](#nginx-proxy-manager-on-this-server-ports-80443-already-in-use)). Remove any old `ticportal-caddy` container: `docker rm -f ticportal-caddy`.

**On a minimal VPS:** something else may hold the ports — check what is listening:

```bash
sudo ss -tlnp | grep -E ':80 |:443 '
```

| Cause | What to do |
|--------|------------|
| **Nginx Proxy Manager** | Use NPM for HTTPS; do not use the `caddy` profile (see above). |
| **systemd nginx / apache2** | `sudo systemctl stop nginx` / `apache2` and disable if you only want Docker+Caddy. |
| **Another container** | `docker ps` — free 80/443 or use NPM / host nginx instead of Caddy. |

To run **Caddy** on this machine, **80** and **443** must be free, then:

```bash
docker compose --profile caddy up -d --build
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
