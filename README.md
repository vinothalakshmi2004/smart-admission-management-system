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
- Make the **fee payment** (UPI / card / net banking flow)
- Download PDF receipts (jsPDF)

### Admin portal
- Dashboard with admission statistics
- Review, approve or reject **applications** and add comments
- Manage **courses and seats**
- Manage **staff, admins and students**
- View and manage **enquiries** and **contact messages**

### Staff portal
- Staff dashboard to view and process admissions

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

| Variable     | Description                          |
|--------------|--------------------------------------|
| `NODE_ENV`   | `development` or `production`        |
| `PORT`       | API port (default `5000`)            |
| `MONGO_URI`  | MongoDB connection string            |
| `JWT_SECRET` | Secret key used to sign JWT tokens   |

### 3. Set up the frontend
Open a new terminal:
```bash
cd client
npm install
npm run dev               # starts the app on http://localhost:5173
```

### 4. Log in
On first start, the server creates a default admin account:

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | `rvs@admin.com` | `rvs@123` |

> Change this password after the first login before using the system with real data.

Students can create an account from the **Register** page.

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
