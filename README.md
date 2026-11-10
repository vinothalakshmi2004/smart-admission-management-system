# Smart Admission Management System

A full-stack web application that digitises the college admission process — from course enquiry and online application to document upload, fee payment, and admin approval — with role-based portals for **students**, **staff**, and **administrators**.

Built with the **MERN** stack (MongoDB, Express, React, Node.js) and **Socket.io** for real-time updates.

---

## Features

### Public website
- Home page with hero carousel, campus, courses, training & placement, examination and research pages
- Online **enquiry** and **contact** forms
- Downloadable **brochure**
- Live admission counter

### Student portal
- Register / log in
- Fill the **online application form** with document upload (JPG, PNG, PDF)
- Track **application status**
- Check **seat availability** and **scholarship eligibility**
- Pay the **admission fees online through Razorpay** (card / UPI / net banking)
- Download PDF receipts (jsPDF)

### Admin portal
- Dashboard with admission statistics
- Review, approve or reject **applications**, add remarks and open the uploaded **documents**
- Manage **courses and seats**
- Manage **staff, admins and students**
- View and manage **enquiries** and **contact messages**

### Staff portal
- Review admissions (approve / reject, remarks, view documents)
- Follow up enquiries and contact messages

### Platform
- JWT authentication with role-based access control (student / staff / admin)
- Password hashing with bcrypt
- Real-time notifications via Socket.io
- Security headers with Helmet, request logging with Morgan

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, Vite, React Router, Tailwind CSS, Axios, React Toastify, React Icons, jsPDF |
| Backend   | Node.js, Express 5, Mongoose, JWT, bcryptjs, Multer, Socket.io, Helmet, Morgan |
| Database  | MongoDB |

---

## Project Structure

```
smart-admission-management-system/
├── client/                 # React frontend (Vite)
│   ├── public/             # Static images
│   └── src/
│       ├── components/     # Navbar, Footer, sidebars, widgets
│       ├── context/        # AuthContext (login state)
│       └── pages/          # Public, student, staff and admin pages
│
└── server/                 # Express backend
    ├── config/             # MongoDB connection
    ├── controllers/        # Route handlers
    ├── middleware/         # Auth (JWT) and file upload (Multer)
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── uploads/            # Uploaded documents (not committed)
    ├── utils/              # Token generation, default admin
    └── index.js            # Server entry point
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or later
- [MongoDB](https://www.mongodb.com/) (local install or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/vinothalakshmi2004/smart-admission-management-system.git
cd smart-admission-management-system
```

### 2. Set up the backend
```bash
cd server
npm install
cp .env.example .env      # then edit .env with your own values
npm run dev               # starts the API on http://localhost:5000
```

`.env` variables:

| Variable         | Required | Description |
|------------------|----------|-------------|
| `NODE_ENV`       | Yes      | `development` or `production` |
| `PORT`           | No       | API port (default `5000`) |
| `MONGO_URI`      | Yes      | MongoDB connection string |
| `JWT_SECRET`     | Yes      | Long random secret used to sign login tokens |
| `ADMIN_EMAIL`    | Production | Email of the first admin account |
| `ADMIN_PASSWORD` | Production | Password of the first admin account (min 6 characters) |
| `ADMIN_NAME`     | No       | Display name of the first admin |
| `CLIENT_URL`     | No       | Allowed browser origin(s), only if the React app is hosted on another domain |
| `RAZORPAY_KEY_ID` | For payments | Razorpay key id (`rzp_test_...` for test mode) |
| `RAZORPAY_KEY_SECRET` | For payments | Razorpay key secret (keep private, server only) |

### 3. Set up the frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev               # starts the app on http://localhost:5173
```

### 4. Log in
When no admin exists, the server creates one on start:

- **Production:** from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (nothing is created if they are missing).
- **Development only:** if those are not set, `rvs@admin.com` / `rvs@123`.

Admins and staff can change their password from the dashboard (**Change Password**).

### 5. Set up courses and seats
Log in as admin → **Seat Matrix** → **Add Standard Courses** (adds every course on the application form with 60 seats), or run `npm run seed` in `server`. Adjust seats and the semester fee per course as needed.

Students create their own account from the **Register** page.

---

## Deployment (going live)

The Express server can serve the built React app, so the whole system runs as **one Node.js service** plus a MongoDB database (for example MongoDB Atlas).

1. Create a MongoDB Atlas cluster and copy its connection string.
2. On your host (Render, Railway, a VPS, etc.) set the environment variables: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. Build command: `npm run build` (from the repository root).
4. Start command: `npm start`.
5. Open the site, log in as admin, change the password, and add courses in **Seat Matrix**.

Notes:
- Uploaded documents are stored in `server/uploads/`. Use a host with a persistent disk (or mount a volume there), otherwise files are lost on redeploy.
- If you host the React app separately, set `VITE_API_URL` in `client/.env` before building and `CLIENT_URL` on the server.
- Fees are paid online through **Razorpay** (see below). Without Razorpay keys, a demo payment works only in development; in production the Pay button is disabled.

## Online payment (Razorpay)

1. Sign up at [razorpay.com](https://razorpay.com), switch the dashboard to **Test Mode**, then **Account & Settings → API Keys → Generate Key**.
2. Put the keys in `server/.env` (never in the client):
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
3. Restart the server. On the payment page the student clicks **Pay securely**; Razorpay Checkout opens with card, UPI and net banking.
4. In test mode no real money moves. Use Razorpay's test details, for example UPI ID `success@razorpay` (see Razorpay docs → *Test Card Details* for cards).

How it is secured: the server creates the Razorpay order from the fees stored on the application, then verifies the payment signature and re-checks the payment (order, amount, captured) with Razorpay before marking the fees **Paid** and filling the seat.

To go live with real money: complete Razorpay KYC/activation, generate **Live** keys (`rzp_live_...`) and replace the test keys on the server.

---

## API Overview

Base URL: `http://localhost:5000/api`

| Module        | Endpoint prefix      | Description |
|---------------|----------------------|-------------|
| Auth          | `/auth`              | Register and log in |
| Students      | `/students`          | Student login and application submission with documents |
| Applications  | `/applications`      | My applications, status updates, payment, admission count |
| Courses       | `/courses`           | List and create courses |
| Users         | `/users`             | Admin management of staff, admins, students and dashboard stats |
| Enquiries     | `/enquiries`         | Submit and manage enquiries |
| Contact       | `/contact`           | Submit and manage contact messages |

Protected routes require the header `Authorization: Bearer <token>`.

---

## Scripts

| Location | Command          | Description |
|----------|------------------|-------------|
| `server` | `npm run dev`    | Start the API with nodemon |
| `server` | `npm start`      | Start the API with node |
| `client` | `npm run dev`    | Start the Vite dev server |
| `client` | `npm run build`  | Build the frontend for production |
| `client` | `npm run lint`   | Run ESLint |

---

## Author

**Vinothalakshmi** — MCA Project

## License

This project was built for academic purposes.
