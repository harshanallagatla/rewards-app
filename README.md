# Stardust Rewards

A rewards app where points can be earned and redeemed for experiences — chocolates, Chick-fil-A, movies, dinners, date nights, and surprise gifts. An admin can allocate points to users, and a confirmation email is sent on every redemption.

**Live:** [www.stardust-rewards.com](https://www.stardust-rewards.com)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Backend | Python 3.11, FastAPI, SQLAlchemy |
| Database | PostgreSQL (Supabase) |
| Email | Resend API |
| Frontend hosting | Vercel |
| Backend hosting | Render |

---

## Features

- **Login / Sign up** with username and password; email captured at registration
- **Rewards catalogue** — tile-based UI with shimmer animations and photo backgrounds
- **Point redemption** with quantity selection and confirmation modal
- **Email confirmation** sent to the user on every successful redemption
- **Redemption history** panel
- **Admin panel** — users with admin privileges can allocate points to any user in increments of 10
- **Stardust branding** — animated starry title with shimmer and glow effects

---

## Project Structure

```
rewards-app/
├── frontend/                  # React + TypeScript (Vite)
│   └── src/
│       ├── api/client.ts      # All API calls
│       ├── components/
│       │   ├── LoginScreen.tsx
│       │   ├── SignupScreen.tsx
│       │   ├── RewardsApp.tsx
│       │   ├── BrandTitle.tsx
│       │   ├── TileCard.tsx
│       │   ├── HistoryPanel.tsx
│       │   └── AddPointsModal.tsx
│       ├── types/index.ts
│       └── index.css
│
├── backend/                   # FastAPI (Python)
│   └── app/
│       ├── main.py            # App entry point, CORS, startup seed
│       ├── models.py          # SQLAlchemy models
│       ├── schemas.py         # Pydantic request/response schemas
│       ├── database.py        # DB engine (reads DATABASE_URL from env)
│       ├── deps.py            # Auth dependency
│       ├── security.py        # JWT + password hashing
│       ├── email_utils.py     # Resend email helper
│       ├── seed.py            # Reward data seeder
│       └── routes/
│           ├── auth.py        # /auth/login, /auth/register
│           ├── users.py       # /users/me, admin list + add-points
│           └── rewards.py     # /rewards, /rewards/{id}/redeem, /rewards/history
│
└── start.sh                   # One-command local dev startup
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 16 (via Homebrew)

### Quickstart

```bash
git clone https://github.com/harshanallagatla/rewards-app
cd rewards-app
./start.sh
```

This starts both servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

### Manual setup

**Backend**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your values
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend (Render)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (use Supabase session pooler URL) |
| `SECRET_KEY` | Random secret for JWT signing |
| `RESEND_API_KEY` | API key from resend.com |
| `RESEND_FROM_EMAIL` | Verified sender address e.g. `noreply@stardust-rewards.com` |

### Frontend (Vercel)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Full URL of the Render backend e.g. `https://your-app.onrender.com` |

---

## Deployment

### Backend → Render
| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Python Version | `3.11.9` (set via `backend/.python-version`) |

### Frontend → Vercel
| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Database Migrations

SQLAlchemy creates tables automatically on startup. For manual column additions run in Supabase SQL Editor:

```sql
-- Add email column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add is_admin column and grant admin to harsha
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
UPDATE users SET is_admin = TRUE WHERE LOWER(username) = 'harsha';
```

---

## Default Users

These usernames receive preset points on first registration:

| Username | Points | Special |
|---|---|---|
| `amulya` | 2,500 | `is_amulya` flag (sees all rewards) |
| `alekhya` | 500 | — |
| `vineeth` | 500 | — |
| `chutki` | 600 | — |
| `harsha` | 0 | Admin |

All other new users start with **0 points**.
