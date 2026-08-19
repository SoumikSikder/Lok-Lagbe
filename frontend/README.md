# LokLagbe Frontend

## Overview

LokLagbe frontend is a React-based web application developed using React.js and Vite.

It provides user authentication, profile management, and dashboard features. The frontend communicates with the Django REST backend using APIs.

---

## Technology Used

- React.js
- Vite
- Tailwind CSS
- React Router
- Vitest
- React Testing Library

---

## Features

- User login
- JWT authentication
- Protected profile page
- Profile information display
- Update phone number
- Update address
- Change avatar
- Responsive dashboard UI

---

## Project Structure

```
frontend

├── src
│
├── components
│   ├── LoginForm.jsx
│   ├── ProfileForm.jsx
│   ├── ProfileHeader.jsx
│   ├── ProfileStats.jsx
│   └── Navbar.jsx
│
├── pages
│   ├── Login.jsx
│   └── ManageProfile.jsx
│
├── services
│   └── api.js
│
├── utils
│   └── auth.js
│
└── tests
    ├── LoginForm.test.jsx
    └── ProfileForm.test.jsx
```

---

## Installation

Go to frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Run Application

Start development server:

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173/
```

---

## Testing

Run unit tests:

```bash
npm run test
```

Generate coverage report:

```bash
npm run test:coverage
```

Test Result:

```
Test Files: 2 passed
Tests: 7 passed
```

---

## Main Components

### LoginForm

Handles user login and authentication.

### ProfileForm

Handles viewing and updating user profile information.

### ManageProfile

Displays the user profile dashboard.

### ProtectedRoute

Restricts access to authenticated users.

---

## Future Improvements

- Labor search feature
- Worker profile system
- Rating and review system
- Booking system
- Payment integration

---

## Contributors

LokLagbe Development Team