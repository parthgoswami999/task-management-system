# Task Management System

A production-ready full-stack MERN task board with JWT authentication, role-based access, task CRUD, status tracking, drag-and-drop workflow, and a modern Tailwind UI.

## Tech Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT-based authentication

## Project Structure

```text
task-management-system/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── features/
│   │   └── shared/
├── server/
│   ├── src/
│   │   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   └── shared/
└── package.json
```

## Features

- JWT register/login flow
- Role-based access with `admin` and `user`
- Task CRUD with backend and frontend validation
- Task statuses: `todo`, `in-progress`, `done`
- Drag-and-drop task movement across board columns
- Loading states and centralized error handling
- Modular backend and frontend architecture

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the client environment file and update values. Create `server/.env` manually using the server variables shown below:

```bash
cp client/.env.example client/.env
```

3. Start MongoDB locally, then run the app:

```bash
npm run dev
```

4. Production builds:

```bash
npm run build
npm run start
```

## Environment Variables

### Server

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task-management-system
JWT_SECRET=replace-with-a-secure-random-secret
CLIENT_URL=http://localhost:5173
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/reorder`
- `DELETE /api/tasks/:id`
