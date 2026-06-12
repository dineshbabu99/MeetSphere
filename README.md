# MeetSphere

MeetSphere is a full-stack event management and ticketing platform that enables organizations and communities to create, manage, approve, and host events while providing users with a seamless ticket booking experience.

The platform includes event approval workflows, ticket inventory management, attendee tracking, schedule management, analytics, role-based access control, and Razorpay payment integration.

---

## Demo Credentials

### Admin Account

Email: [admin@meetsphere.com]
Password: Admin

### User Account

Email: [user@meetsphere.com]
Password: user


## Live Demo

Frontend: https://meetsphereevent.netlify.app/

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* Role-based access control
* User profile management

### Event Management

* Create and edit events
* Save events as drafts
* Event approval workflow
* Event publishing and status management
* Event deletion and updates
* Public browsing of approved events

### Ticket Management

* Multiple ticket types per event
* Ticket pricing and capacity management
* Ticket inventory tracking
* Ticket booking and cancellation
* Sold count tracking
* Free and paid ticket support

### Payment Integration

* Razorpay order creation
* Secure payment verification
* Automatic ticket generation after payment success
* Free-ticket booking without payment gateway

### Attendee Management

* Real attendee tracking from bookings
* Attendance status updates
* Booked attendee management
* Event attendance monitoring

### Schedule Management

* Event schedules
* Session management
* User schedule tracking
* Event timeline organization

### Admin Features

* Event approvals and rejections
* User role management
* Booking management
* Revenue tracking
* Analytics dashboard

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Redux Toolkit
* React Router
* Tailwind CSS
* Chart.js
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Razorpay Payments

---

## Key Highlights

* Full-stack MERN architecture
* JWT authentication and authorization
* Role-based access control
* Razorpay payment integration
* Event approval workflow
* Ticket inventory management
* Real attendee tracking
* Schedule management
* Analytics dashboard
* Responsive user interface

---

## Project Structure

```text
MeetSphere/
│
├── frontend/          React + TypeScript Client
│
└── server/            Node.js + Express API
```

---

## Frontend Routes

```text
/login                 Login
/register              Register
/                       Dashboard
/events                Browse Events
/buyTickets            Buy Tickets
/myTickets             User Tickets
/my-schedule           User Schedule
/user-details          User Profile
/create                Create Event
/schedule              Manage Schedule
/attendees             Manage Attendees
/admin                 Admin Panel
/analytics             Analytics
/events/:id/edit       Edit Event
```

Protected routes are secured using role-based authorization.

---

## Backend API Overview

Authentication

POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me
GET    /api/auth/users
PATCH  /api/auth/users/:id/role
Events
POST   /api/events/create
GET    /api/events
PUT    /api/events/:id
PATCH  /api/events/:id/status
DELETE /api/events/:id
Tickets
POST   /api/tickets/purchase
GET    /api/tickets/admin/all
GET    /api/tickets/:userId
PATCH  /api/tickets/attendance/:id
DELETE /api/tickets/:id
Schedules
GET    /api/schedules
GET    /api/schedules/event/:eventId
POST   /api/schedules
POST   /api/schedules/event/:eventId/sessions
Payments
POST   /api/payments/create-order
POST   /api/payments/verify

----

### Backend Setup

```bash
cd server

npm install

npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm run dev
npm start
```

---

## Security Features

* JWT-based authentication
* Protected API routes
* Role-based authorization
* Payment signature verification
* Secure password storage
* Request validation

---

## Future Improvements

* QR code ticket validation
* Email notifications
* Event reminders
* Refund management
* Advanced analytics
* Multi-organizer support
* Real-time attendee check-in
* Export reports and invoices

---