# O2H Task Management Portal

A production-ready, enterprise-level Full Stack Task Management Portal built for the o2h Technologies Full Stack Developer Assessment.

## 🚀 Features

- **Modern SaaS UI/UX:** Clean, responsive interface featuring glassmorphism, smooth animations, and a professional blue/cyan color palette.
- **Robust Authentication:** Secure JWT-based authentication with encrypted password storage.
- **Comprehensive Task Management:** Create, Read, Update, and Delete tasks with status, priority, and due date tracking.
- **Advanced Dashboard:** Interactive data visualization with Recharts (Pie & Bar charts) and dynamic metric cards.
- **Smart Filtering & Sorting:** Real-time search, status/priority filtering, and date sorting functionality.
- **Dark Mode:** System-integrated dark and light mode toggle.
- **Toast Notifications:** Elegant user feedback using react-hot-toast.

## 💻 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM, Recharts, Lucide React, Axios.
- **Backend:** Node.js, Express.js, Mongoose (Mocked via JSON persistence for assessment ease), bcryptjs, jsonwebtoken.

## 🛠️ Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*The backend will run on port 5000.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm install recharts react-hot-toast
npm run dev
```
*The frontend will run on port 5173.*

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/profile` - Get logged-in user profile (Requires Auth)

### Tasks
- `GET /api/tasks` - Get all tasks (Supports ?status, ?priority, ?search, ?sort)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## 📂 Folder Structure

```text
o2h Task Management Portal/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```
