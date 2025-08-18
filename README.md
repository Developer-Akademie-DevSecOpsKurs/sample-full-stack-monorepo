# Ticket System Demo

## Description

Demo implementation of a simple support ticket system:
- Backend: Django REST Framework (tickets CRUD API)
- Frontend: Next.js (App Router, TypeScript) consuming the API
- Goal: Educational reference for a minimal full‑stack stack (Python + React)

## Prerequisites

- Python 3.12+
- Node.js 20.16 (use nvm / nvm-windows)
- pip / virtualenv
- (Optional) Docker & Docker Compose
- Git

## Quickstart

### Backend (Django API)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# API at http://127.0.0.1:8000/api/tickets/
```

### Frontend (Next.js)

```bash
cd tickets-web
npm install
npm run dev
# Open http://localhost:3000
```

### Verify

- List tickets: http://localhost:3000/tickets
- Create ticket: http://localhost:3000/tickets/new

## Usage & Configuration (TBD)

- Environment variables
- Pagination, filtering, auth extensions
- Settings for deployment hardening

## Deployment

### Containerized Deployment (Basic Outline)

1. Build backend image (contains Django + gunicorn/uvicorn or waitress)
2. Build frontend (Next.js) as static export or production server
3. Serve via reverse proxy (nginx / Traefik)
4. Configure environment (DB, secrets, ALLOWED_HOSTS, CORS)

Example (placeholder):
```bash
docker build -t ticket-backend ./backend
docker build -t ticket-frontend ./tickets-web
docker compose up -d
```
(Compose file and production hardening not yet included.)

## Contributing

No external code contributions accepted at this time.

## License

This project is released under the MIT License. See [LICENSE](LICENSE) for details.