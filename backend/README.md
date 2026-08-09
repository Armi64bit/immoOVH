# ImmoConnect Admin Backend (Django + DRF)

Admin-only REST API for managing the real-estate listings shown on
[immoconnect.tn](https://www.immoconnect.tn). Ships with the Django admin
dashboard, JWT auth, and Swagger docs. Optimized for the Railway free tier.

## Tech stack

- Django 5.1 + Django REST Framework
- PostgreSQL (via `DATABASE_URL`, auto-set by Railway's Postgres plugin)
- JWT auth (`djangorestframework-simplejwt`) — API is admin-only
- Swagger / OpenAPI (`drf-spectacular`)
- Whitenoise (serves admin static files, no external storage needed)
- Gunicorn (1 worker × 4 threads to fit 512 MB RAM)

## Local development

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows
pip install -r requirements.txt

# no Postgres installed? use SQLite for local dev only:
set DATABASE_URL=sqlite:///db.sqlite3
set DJANGO_DEBUG=true

python manage.py migrate
python manage.py seed_properties  # load the 12 frontend seed listings
python manage.py createsuperuser  # creates the admin login
python manage.py runserver
```

Then open:

| URL | What |
| --- | --- |
| `http://127.0.0.1:8000/admin/` | Django admin dashboard |
| `http://127.0.0.1:8000/api/docs/` | Swagger UI (admin only) |
| `http://127.0.0.1:8000/api/redoc/` | ReDoc |
| `http://127.0.0.1:8000/api/properties/` | Properties API (JWT required) |

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/token/` | Get JWT access+refresh (`{"username","password"}`) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/POST | `/api/properties/` | List / create properties |
| GET/PUT/PATCH/DELETE | `/api/properties/{id}/` | Retrieve / update / delete |
| GET | `/api/health/` | Liveness probe (public) |
| GET | `/api/schema/` | OpenAPI schema |
| GET | `/api/docs/` | Swagger UI |

List filters: `?type=`, `?status=`, `?location=`, `?search=` (title/ref/location/price),
`?ordering=` (price, area, created_at, location).

## Image uploads

- Each property has an `image` **file field** (uploaded via multipart/form-data,
  stored under `MEDIA_ROOT/properties/`) and an `image_url` **external URL** field.
- `image_display_url` in the API returns the uploaded file's absolute URL, falling
  back to `image_url` when no file is uploaded.
- Upload in the Django admin (file input) or via the API:
  `PATCH /api/properties/{id}/` with `-F "image=@photo.jpg"`.
- Files are served at `/media/...` (WhiteNoise in production, Django in dev).

## Deploying to Railway (free tier)

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo** and select it.
3. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically.
4. Add variables (Dashboard → Variables):
   - `DJANGO_SECRET_KEY` — long random string (e.g. `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
   - `DJANGO_DEBUG=false`
   - `DJANGO_ALLOWED_HOSTS=your-app-name.up.railway.app`
   - `CORS_ALLOWED_ORIGINS=https://www.immoconnect.tn,https://immoconnect.tn`
5. Set the deploy root to the `backend/` directory (Railway: Settings → Root Directory).
6. **Attach a volume** (needed for uploaded images):
   Railway → your service → **Volumes** → **New Volume** → mount at `/data`,
   then set variable `MEDIA_ROOT=/data/media`. Without this, uploads are lost
   on every redeploy.
7. Railway auto-detects `railway.json` in `backend/`:
   - builds with Nixpacks,
   - start command runs `migrate` + `collectstatic`, then serves with Gunicorn,
   - health check pings `/api/health/`.
8. After deploy, create the admin user via the Railway shell:
   `python manage.py createsuperuser`
   (or `python manage.py shell` to script it). Do **not** run this in
   `startCommand` — the DB has no users on first boot and the command prompts for input.
9. Optional: in Railway Variables set `DJANGO_SUPERUSER_USERNAME/PASSWORD/EMAIL`
   and run `python manage.py createsuperuser --noinput` once from the shell.

Your app URL is `https://<app>.up.railway.app` — the admin dashboard is at
`/admin/` and Swagger at `/api/docs/`.

## Notes for Railway free tier

- **1 Gunicorn worker** keeps memory under the 512 MB limit.
- `conn_max_age=600` + `conn_health_checks` reuse the Postgres connection.
- The API, Swagger UI, and admin panel are all **admin-only**; the only public
  endpoint is `/api/health/`.
- Image uploads persist because `MEDIA_ROOT` points at the mounted volume.
  The Postgres plugin already persists data independently.
