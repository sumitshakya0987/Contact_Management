# Contact Management System

A full-stack application to manage professional contacts, built with React, Node.js, and PostgreSQL.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod
- **Backend:** Node.js, Express, Drizzle ORM, PostgreSQL
- **Language:** TypeScript (Both Frontend & Backend)

## 🛠️ Prerequisites

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (running locally or via a cloud provider like Neon/Supabase)

## ⚙️ Setup Instructions

### 1. Database Setup
Ensure you have a PostgreSQL database created (e.g., `contact_db`).

### 2. Backend Setup
Navigate to the `server` directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file (if not exists) and configure your database:
```env
DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/contact_db
PORT=5000
```

Run migrations to set up the database schema:
```bash
npm run generate
npm run migrate
```

Start the backend server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal and navigate to the `client` directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will run at `http://localhost:5173`.

## 📝 Assumptions Made

1.  **Local Database:** It is assumed the user has a local instance of PostgreSQL running on the default port `5432`.
2.  **Environment:** The application is developed for a standard Node.js environment. Windows/Linux/Mac differences are handled by cross-platform libraries, but standard shell commands are assumed.
3.  **Ports:** The backend listens on port `5000` and frontend on `5173`. If these ports are busy, the user needs to configure valid ports in `.env` and `vite.config.ts`.
4.  **Network:** The frontend assumes the backend is running at `http://localhost:5000/api`. If deployed effectively, the `baseUrl` in `client/src/lib/api.ts` would need to be updated.
