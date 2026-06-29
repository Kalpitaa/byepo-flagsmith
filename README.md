# Byepo Flagsmith — Multi-Tenant Feature Flag Management System

A SaaS-like feature flag management system built as an assignment for **Byepo Technologies**. The system supports three roles across three separate frontend applications backed by a single Node.js API.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Authentication | Custom JWT + bcrypt (no third-party auth) |
| Frontend | React 18, Vite, Tailwind CSS v4 |
| HTTP Client | Axios |

---

## Project Structure

```
byepo-flagsmith/
├── backend/               → Node.js + Express REST API
├── frontend-superadmin/   → Super Admin portal (port 5173)
├── frontend-admin/        → Organisation Admin portal (port 5174)
└── frontend-user/         → End User feature check portal (port 5176)
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally or a MongoDB Atlas connection string

---

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flagsmith
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d
SUPER_ADMIN_EMAIL=superadmin@flagsmith.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
```

Start the server:

```bash
npm run dev
```

API runs at `http://localhost:5000`

---

### 2. Super Admin Frontend

```bash
cd frontend-superadmin
npm install
npm run dev
```

Opens at `http://localhost:5173`

**Login credentials** (from backend `.env`):
- Email: `superadmin@flagsmith.com`
- Password: `SuperAdmin@123`

---

### 3. Organisation Admin Frontend

```bash
cd frontend-admin
npm install
npm run dev
```

Opens at `http://localhost:5174`

> No hardcoded credentials — sign up at `/signup` after the Super Admin has created an organisation.

---

### 4. End User Frontend

```bash
cd frontend-user
npm install
npm run dev
```

Opens at `http://localhost:5176`

> No login required. Select an organisation, enter a feature key, and check its status.

---

## System Roles

### Super Admin
- Static credentials from environment variables
- Can create organisations
- Can view all organisations

### Organisation Admin
- Signs up and belongs to one organisation
- Can create, update, enable/disable, and delete feature flags
- Flags are scoped to their organisation only

### End User
- No authentication required
- Selects an organisation from a dropdown
- Enters a feature key to check if it is enabled or disabled

---

## API Endpoints

### Super Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/super-admin/login` | None | Super admin login |
| POST | `/api/super-admin/organisations` | Super Admin | Create organisation |
| GET | `/api/super-admin/organisations` | Super Admin | List all organisations |

### Org Admin Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | None | Register as org admin |
| POST | `/api/auth/login` | None | Org admin login |
| GET | `/api/auth/me` | Org Admin | Get current user |

### Feature Flags
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/flags/check?feature_key=x&organisationId=y` | None | Check flag status |
| GET | `/api/flags` | Org Admin | List org's flags |
| POST | `/api/flags` | Org Admin | Create flag |
| PUT | `/api/flags/:id` | Org Admin | Update flag |
| DELETE | `/api/flags/:id` | Org Admin | Delete flag |

### Public
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/organisations` | None | List orgs (for signup/user dropdown) |
| GET | `/api/health` | None | Health check |

---

## End-to-End Test Flow

1. Start the backend
2. Open **Super Admin** → login → create an organisation (e.g. `Acme Corp`)
3. Open **Org Admin** → signup with that organisation → login
4. Create a feature flag (e.g. `dark_mode`) and enable it
5. Open **End User** → select `Acme Corp` → type `dark_mode` → click Check
6. See ✅ **Feature is Enabled**

---

## Security Notes

- All passwords are hashed using `bcrypt` with salt rounds of 12
- JWT tokens expire in 7 days
- Feature flags are strictly scoped per organisation — an org admin cannot access another org's flags
- The `/api/flags/check` endpoint is intentionally public for end user access
- `.env` files are excluded from version control via `.gitignore`
