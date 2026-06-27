# Lead Management CRM

A production-quality Lead Management CRM built using Node.js/Express, Next.js, TypeScript, PostgreSQL, Prisma ORM, and Tailwind CSS.

## Project Structure

```text
CRM/
├── backend/      # Express.js backend with Prisma ORM
└── frontend/     # Next.js App Router frontend with Tailwind CSS
```

---

## Setup & Running the Application

### 1. Database Setup
Ensure you have a PostgreSQL server running locally, and create a database named `lead_management`.

---

### 2. Backend Initialization

Navigate to the `backend/` directory:
```bash
cd backend
```

Copy the environment variable example file to `.env`:
```bash
cp .env.example .env
```
*Note: Open `.env` and adjust the `DATABASE_URL` and `JWT_SECRET` variables with your actual PostgreSQL connection credentials and secure JWT secret.*

Install dependencies:
```bash
npm install
```

Generate Prisma Client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

Start the backend in development mode:
```bash
npm run dev
```
The backend server will run on `http://localhost:5000`.

---

### 3. Frontend Initialization

Navigate to the `frontend/` directory:
```bash
cd ../frontend
```

Copy the environment variable example file to `.env.local`:
```bash
cp .env.example .env.local
```
*Note: By default, `NEXT_PUBLIC_API_URL` is set to `http://localhost:5000/api` to connect directly to the local backend.*

Install dependencies:
```bash
npm install
```

Start the frontend in development mode:
```bash
npm run dev
```
The frontend dev server will run on `http://localhost:3000`.
Open `http://localhost:3000` in your web browser to access the CRM.
