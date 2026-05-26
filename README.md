# MeetSphere

MeetSphere is a full-stack event management and ticketing platform. It supports event creation, admin approval, public event browsing, ticket booking, Razorpay payments, attendee tracking, event schedules, role-based access, and user profile management.

## Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Chart.js
- Axios

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- Razorpay payments

## Main Features

- User registration and login with JWT authentication
- Role-based access for `User`, `Admin`, and `SuperAdmin`
- Event creation with draft and approval workflow
- Admin event approval, rejection, update, and delete actions
- Public browsing for approved live events
- Ticket type management with price, capacity, sold count, and description support
- Ticket booking and cancellation
- Razorpay order creation and payment verification
- Attendee management from real booked tickets
- Attendance states: `Booked`, `Attended`, and `Not Arrived`
- Admin dashboard with approvals, user roles, bookings, and revenue data
- Event schedules for live events
- User schedule and profile details pages

## Project Structure

```text
MeetSphere/
  frontend/       React + TypeScript client
  server/         Express + MongoDB API
```

## Frontend Routes

```text
/login                Login
/register             Register
/                     Admin dashboard
/events               Browse approved events
/buyTickets           Buy tickets
/myTickets            User tickets
/my-schedule          User schedule
/user-details         Manage user profile
/create               Create event
/schedule             Manage event schedules
/attendees            Manage attendees
/admin                Admin panel
/analytics            Analytics
/events/:id/edit      Edit event
```

Admin-only routes are protected with role-based routing.

## Backend API Overview

### Auth

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
GET    /api/auth/users
PATCH  /api/auth/users/:id/role
```

### Events

```text
POST   /api/events/create
GET    /api/events
PATCH  /api/events/:id/status
PUT    /api/events/:id
DELETE /api/events/:id
```

### Tickets

```text
POST   /api/tickets/purchase
GET    /api/tickets/admin/all
PATCH  /api/tickets/attendance/:id
GET    /api/tickets/:userId
DELETE /api/tickets/:id
```

### Schedules

```text
GET    /api/schedules
GET    /api/schedules/event/:eventId
POST   /api/schedules
POST   /api/schedules/event/:eventId/sessions
```

### Payments

```text
POST   /api/payments/create-order
POST   /api/payments/verify
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Do not commit real `.env` values.

## Getting Started

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

## Available Scripts

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```bash
npm run dev
npm start
```

## Event Workflow

1. Admin creates an event.
2. Publishing sends the event to `Pending`.
3. SuperAdmin/Admin approves the event.
4. Approved events become `Open` and appear on browse, booking, and schedule pages.
5. Users book tickets.
6. Admin tracks attendance from booked tickets.

## Notes

- Ticket availability is controlled by each ticket type capacity and sold count.
- Paid bookings use Razorpay order creation and verification.
- Free tickets skip Razorpay and are issued directly.
- Admin and SuperAdmin users can manage approvals, roles, attendance, and event lifecycle actions.
