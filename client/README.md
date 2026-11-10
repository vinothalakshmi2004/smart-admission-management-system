# Smart Admission Management System — Client

React frontend for the Smart Admission Management System, built with Vite and Tailwind CSS.

## Setup

```bash
npm install
npm run dev     # http://localhost:5173
```

The app calls the backend at `http://localhost:5000`, so start the server first (see `../server`).

## Scripts

| Command           | Description |
|-------------------|-------------|
| `npm run dev`     | Start the development server |
| `npm run build`   | Build for production into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint |

## Main pages

| Area     | Pages |
|----------|-------|
| Public   | Home, About, Courses, Campus, Training & Placement, Examination, UGC Projects, Brochure, Enquiry, Contact |
| Auth     | Login, Student / Staff / Admin / Admission login, Register |
| Student  | Dashboard, Application Form, Application Status, Seat Availability, Payment |
| Staff    | Staff Dashboard |
| Admin    | Dashboard, Applications, Course & Seat Management, Staff Management, Users, Enquiries |

## Libraries

React 19, React Router, Axios, Tailwind CSS, React Toastify, React Icons, jsPDF, Socket.io client.
