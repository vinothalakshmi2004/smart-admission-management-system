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

## Folder structure

| Folder         | Purpose |
|----------------|---------|
| `config/`      | MongoDB connection (`db.js`) |
| `controllers/` | Business logic for each module |
| `middleware/`  | `protect` / `admin` JWT guards, Multer upload config |
| `models/`      | Mongoose schemas: Admission, Course, Student, Staff, Enquiry, ContactMessage |
| `routes/`      | Express routers mounted under `/api` |
| `uploads/`     | Uploaded student documents (served at `/uploads`) |
| `utils/`       | JWT generation, default admin creation |

## API routes

| Prefix              | Routes |
|---------------------|--------|
| `/api/auth`         | `POST /register`, `POST /login` |
| `/api/students`     | `POST /apply` (multipart with documents), `POST /login` |
| `/api/applications` | `GET /stats/count`, `GET /my`, `PUT /:id/status` (admin), `PUT /:id/pay` |
| `/api/courses`      | `GET /`, `POST /` (admin) |
| `/api/users`        | Admin-only management of staff, admins and students, plus `GET /stats` |
| `/api/enquiries`    | `POST /`, `GET /` (admin), `DELETE /:id` (admin) |
| `/api/contact`      | Submit messages, admin updates status |

A default admin (`rvs@admin.com` / `rvs@123`) is created on first start. Change the password before using real data.

Socket.io runs on the same port and pushes real-time admission updates to connected clients.
