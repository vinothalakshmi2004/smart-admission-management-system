# Smart Admission Management System — Server

Express + MongoDB REST API for the Smart Admission Management System.

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev            # http://localhost:5000
```

## Environment variables

| Variable     | Description                        |
|--------------|------------------------------------|
| `NODE_ENV`   | `development` or `production`      |
| `PORT`       | API port (default `5000`)          |
| `MONGO_URI`  | MongoDB connection string          |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account (required in production) |
| `CLIENT_URL` | Allowed browser origin(s) if the website is on another domain |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay keys for online fee payment (`rzp_test_...` in test mode) |

## Folder structure

| Folder         | Purpose |
|----------------|---------|
| `config/`      | MongoDB connection (`db.js`) |
| `controllers/` | Business logic for each module |
| `middleware/`  | `protect` / `admin` JWT guards, Multer upload config |
| `models/`      | Mongoose schemas: Admission, Course, Student, Staff, Enquiry, ContactMessage |
| `routes/`      | Express routers mounted under `/api` |
| `uploads/`     | Uploaded student documents (private; served only through the documents route) |
| `utils/`       | JWT generation, default admin creation |

## API routes

| Prefix              | Routes |
|---------------------|--------|
| `/api/auth`         | `POST /register`, `POST /login`, `PUT /password` (logged in) |
| `/api/students`     | `POST /apply` (student, multipart with documents; also creates the admission), `POST /login`, `GET /:id/documents/:type` (staff/admin) |
| `/api/applications` | `GET /stats/count`, `GET /my`, `PUT /:id/status` (staff/admin), `PUT /:id/pay` |
| `/api/courses`      | `GET /`, `POST /` (admin) |
| `/api/users`        | Admin-only management of staff, admins and students, plus `GET /stats` |
| `/api/enquiries`    | `POST /`, `GET /` and `PUT /:id` (staff/admin), `DELETE /:id` (admin) |
| `/api/payments`     | `GET /config` (public), `POST /order` and `POST /verify` (student) — Razorpay |
| `/api/contact`      | Submit messages, admin updates status |

The first admin is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` when no admin exists (development falls back to `rvs@admin.com` / `rvs@123`).

Socket.io runs on the same port and pushes real-time admission updates to connected clients.
