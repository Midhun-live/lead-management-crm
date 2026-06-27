# Lead Management CRM

A production-ready Full Stack Lead Management CRM application designed to register users, track sales leads, filter pipelines, and view analytics dashboards. 

Built with Node.js/Express, Next.js (App Router), TypeScript, Tailwind CSS, PostgreSQL, and Prisma ORM.

---

## Project Overview

The Lead Management CRM provides sales teams and administrators with a secure platform to manage sales leads. Authenticated users can create leads, monitor stages, search contacts, and view aggregated pipeline data. The architecture enforces secure multi-tenant ownership, ensuring that users can only view, edit, or delete leads they personally own.

---

## Features

### Backend
- **JWT Authentication**: Secure stateless authentication using Bearer tokens.
- **User Registration**: Enforces space-collapsing and trims names/emails.
- **User Login**: Standard credentials verification.
- **Protected APIs**: Route guarding checks user activation and token version checks.
- **Lead CRUD**: Create, read, update, and soft-delete prospects.
- **Dashboard Statistics**: Dynamic count metrics grouped by status.
- **Search & Filter**: Backend-driven keyword searching, status, and source filters.
- **Pagination**: Optimized paginated list querying.
- **Request Validation**: Schema parsing using Zod before controller access.
- **Global Error Handling**: Uniform API response structures for errors and exceptions.
- **Prisma ORM & PostgreSQL**: Database connectivity and migrations.

### Frontend
- **Authentication Pages**: User register and sign-in modes.
- **Auto-Login**: Instantly logs in the user and redirects to Dashboard after signing up.
- **Protected Routing**: Route guard layouts checking active auth context.
- **Dashboard Stats**: Statistic overview panels matching status counts.
- **Lead Table Grid**: Responsive table with backend sorting, actions, and page shifts.
- **Modal Forms**: Multi-purpose modals for lead creation and modification.
- **Search Debounce**: Limits backend lookups to 500ms after typing halts.
- **State Preservation**: Retains search/filter parameter context on page refreshes using URL states.
- **Loading states**: Non-blocking inline loading skeleton rows.
- **Toast Alerts**: Toast alerts matching backend messages.
- **Accessibility**: Complete label bindings, visible focus states, focus trapping, and ESC modals closing.

---

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Form States**: React Hook Form
- **Schema Validation**: Zod
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma ORM
- **Database**: PostgreSQL
- **Security**: JWT & Bcrypt

---

## Project Structure

```text
CRM/
├── backend/                  # Express.js backend project
│   ├── docs/                 # OpenAPI Spec & Database documentation
│   ├── prisma/               # Schema configuration and migrations
│   └── src/                  # Source code (routes, controllers, models, config)
├── frontend/                 # Next.js App Router frontend project
│   ├── src/
│   │   ├── app/              # Protected & public pages
│   │   ├── components/       # Reusable input & layout components
│   │   ├── contexts/         # React Auth state management
│   │   ├── features/         # Feature specific subcomponents (leads list)
│   │   ├── hooks/            # Search debounce hooks
│   │   └── services/         # Axios API clients
│   └── public/               # Static assets
└── README.md                 # Project README
```

---

## Database Schema

Database management is handled by Prisma ORM.

- **Schema Location**: [backend/prisma/schema.prisma](file:///Users/midhun/Tech/CRM/backend/prisma/schema.prisma)

### Entities

1. **User**: Holds authorization profiles, passwords, and status attributes.
2. **Lead**: Stores contact parameters, sources, stages, and soft-delete dates.

### Relationship
- **One-to-Many**: One `User` owns many `Leads`.
- **Many-to-One**: Each `Lead` belongs to a single owner `User`.

```text
  +-------------+                 +-------------+
  |    User     | 1             * |    Lead     |
  |-------------|-----------------|-------------|
  | id (PK)     |                 | id (PK)     |
  | name        |                 | name        |
  | email       |                 | email       |
  | password    |                 | phone       |
  | isActive    |                 | status      |
  | tokenVersion|                 | source      |
  +-------------+                 | createdBy(FK)
                                  +-------------+
```

---

## API Documentation

Interactive endpoint documentation is rendered through Swagger UI.

- **Swagger Documentation URL**: `http://localhost:5000/api-docs` (Available when the backend server is running)
- **OpenAPI 3.0 Specification**: [backend/docs/openapi.yaml](file:///Users/midhun/Tech/CRM/backend/docs/openapi.yaml)

All endpoints mapping user registration, session logins, profile checks, dashboard analytics counters, and Lead CRUD resources are covered.

---

## Environment Variables

### Frontend (`frontend/.env.local`)
```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env`)
```text
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/lead_management"
JWT_SECRET="your_jwt_secret_should_be_long_and_secure"
JWT_EXPIRES_IN="1d"
```

---

## Installation

Follow these steps to configure and initialize the application locally:

### 1. Clone the Repository
```bash
git clone <repository_url> crm-project
cd crm-project
```

### 2. Configure Environment Variables
Copy backend env examples:
```bash
cd backend
cp .env.example .env
```
*(Open `.env` and configure your database PostgreSQL connection parameters)*

Copy frontend env examples:
```bash
cd ../frontend
cp .env.example .env.local
```

### 3. Build & Migrate Backend
Navigate back to the `backend/` folder, install dependencies, run migrations, and spin up the server:
```bash
cd ../backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

### 4. Build Frontend
Navigate to the `frontend/` folder and install dependencies:
```bash
cd ../frontend
npm install
```

---

## Running the Project

### Start Backend
From the `backend/` directory:
```bash
npm run dev
```
Exposed on: `http://localhost:5000`

### Start Frontend
From the `frontend/` directory in a new terminal:
```bash
npm run dev
```
Exposed on: `http://localhost:3000`

---

## API Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/register` | Create user profile account. |
| | `POST` | `/api/auth/login` | Log in and return JWT token. |
| | `GET` | `/api/auth/me` | Fetch active user credentials. |
| **Dashboard** | `GET` | `/api/dashboard` | Get lead status metrics. |
| **Leads** | `POST` | `/api/leads` | Create a lead. |
| | `GET` | `/api/leads` | List leads (filtered/sorted/paginated). |
| | `GET` | `/api/leads/:id` | Fetch single lead parameters. |
| | `PUT` | `/api/leads/:id` | Edit lead contact details. |
| | `DELETE`| `/api/leads/:id` | Soft delete lead record. |

---

## Edge Cases Considered

1. **Instant Session Bootstrapping**: Registering automatically signs the user in via parallel login queries, avoiding double registration-login redirections.
2. **Next.js Router Remount Prevention**: Replaces router events with browser history updates to ensure query parameter searches never unmount inputs or drop typing focuses.
3. **API Request Cancellation Trap**: Uses `AbortController` signals to immediately cancel pending Axios requests during search changes, preventing race conditions.
4. **Tenant Ownership Isolation**: Middleware query scopes database requests to active user ids, blocking cross-tenant viewing or mutations.
5. **Session Revocation**: Auth checks evaluate `tokenVersion` and user `isActive` status flags on every request to instantly terminate revoked or disabled sessions.
6. **Form Validation Retention**: Enforces modal focus locks and retains input values on submission errors.
7. **Empty/Loading Structural Preservation**: Skeletons and pagination are kept active during loading states without creating empty white screens.

---

## Future Improvements

- **Role-Based Access Control (RBAC)**: Custom permissions groups (Admin, Agent, Manager).
- **Refresh Tokens Rotation**: Secure session rotation mechanism.
- **Audit Logging**: Trace profile logins and changes.
- **Activity Timelines**: View lead lifecycle notes chronologically.
- **Lead File Attachments**: Attach custom contracts or documentation to prospects.
- **Dockerization**: Compose scripts for multi-container deployment.
- **CI/CD Integrations**: GitHub Actions pipeline for automated builds.
- **Automated Tests**: Unit and integration test coverage.
