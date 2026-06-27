# Lead Management CRM

Lead Management CRM is a full-stack Customer Relationship Management (CRM) application built as a technical assessment for managing business leads. It features robust user authentication, dashboard analytics, search and filtering capabilities, comprehensive CRUD operations, and multi-container Docker support.

---

## Features

- **User Registration**: Create new user profiles with sanitized inputs.
- **User Login**: Traditional credential-based login.
- **JWT Authentication**: Stateless authentication using secure JSON Web Tokens.
- **Protected Routes**: Restrict page and API access to authenticated users.
- **Lead CRUD Operations**: Complete Create, Read, Update, and soft-delete capabilities for leads.
- **Dashboard Analytics**: Summarized pipeline metrics grouped by lead status.
- **Search Leads**: Perform instant search query operations over lead fields.
- **Filter by Status**: Categorize lead listings dynamically by progress status.
- **Filter by Source**: Categorize lead listings dynamically by acquisition channel.
- **Input Validation**: Secure request parsing powered by Zod schemas.
- **Global Error Handling**: Standardized controller-level error response formatting.
- **Swagger API Documentation**: Interactive OpenAPI Spec playground for direct endpoint testing.
- **Docker Support**: Single-command container deployment for database, API, and frontend.
- **Health Check Endpoint**: Built-in system diagnostic monitoring page.

---

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT & Bcrypt
- **Validation**: Zod

### Documentation
- **API Spec**: Swagger (OpenAPI 3.0)

### Containerization
- **Orchestration**: Docker & Docker Compose

---

## Project Structure

```text
CRM/
├── backend/
│   ├── docs/                  # API Specifications (openapi.yaml)
│   ├── prisma/                # Database schema (schema.prisma) & migrations
│   └── src/                   # Source code (controllers, repositories, services, routes)
├── frontend/
│   └── src/                   # Source code (app pages, components, contexts, hooks)
├── docker-compose.yml         # Container orchestration manifest
└── README.md                  # Project documentation
```

---

## Database Schema

Prisma ORM is utilized for database modeling, migrations, and type-safe query generation.

### Main Models

#### 1. User
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `isActive` (Boolean)
- `tokenVersion` (Integer)
- `lastLogin` (DateTime)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

#### 2. Lead
- `id` (UUID, Primary Key)
- `name` (String)
- `company` (String)
- `email` (String)
- `phone` (String)
- `source` (Enum: WEBSITE, LINKEDIN, REFERRAL, EMAIL, PHONE, OTHER)
- `status` (Enum: NEW, CONTACTED, QUALIFIED, WON, LOST)
- `notes` (String, Text)
- `createdBy` (UUID, Foreign Key referencing User)
- `deletedAt` (DateTime, Nullable for soft-delete support)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

The full database schema is located at [backend/prisma/schema.prisma](file:///Users/midhun/Tech/CRM/backend/prisma/schema.prisma).

---

## API Documentation

Interactive API documentation is generated using Swagger UI.
- **Documentation URL**: `http://localhost:5000/api-docs`

Every backend endpoint is documented and can be tested directly from the Swagger UI dashboard while the server is active.

---

## Environment Variables

### Backend (`backend/.env`)
- `PORT`: Port configuration for the Express API server.
- `NODE_ENV`: The runtime environment (development/production).
- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Token signature secret.
- `JWT_EXPIRES_IN`: Session lifespan (e.g., `1d`).

### Frontend (`frontend/.env.local` or `.env`)
- `NEXT_PUBLIC_API_URL`: Root path endpoint pointing to the backend Express API server.

---

## Local Setup

Follow these steps to build and run the application locally outside of container environments.

### 1. Clone the Repository
```bash
git clone <repository_url> crm-project
cd crm-project
```

### 2. Configure Environment Variables
Copy and fill in the environment variable template files:
```bash
# In backend/
cd backend
cp .env.example .env

# In frontend/
cd ../frontend
cp .env.example .env.local
```

### 3. Install Backend & Run Migrations
```bash
cd ../backend
npm install
npm run prisma:generate
npm run prisma:migrate
```

### 4. Install Frontend
```bash
cd ../frontend
npm install
```

### 5. Start Application
```bash
# Start Express Server (In backend/)
npm run dev

# Start Next.js Client (In frontend/ - open in a separate terminal)
npm run dev
```

---

## Docker Setup

Deploy the complete environment (PostgreSQL, Express Backend, Next.js Frontend) using Docker:

### Build Container Images
```bash
docker compose build
```

### Start Orchestrated Services
```bash
docker compose up
```

During startup, Docker automatically:
1. Starts the PostgreSQL container database instance and runs health validation.
2. Applies Prisma migration scripts to the database.
3. Automatically generates the Prisma Client internal types.
4. Boots up the Backend and Frontend servers synchronously once their dependants are healthy.

### Mapped Ports & URLs

- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Swagger Documentation**: `http://localhost:5000/api-docs`
- **Health Check Endpoint**: `http://localhost:5000/health`

---

## API Summary

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Authentication** | `POST` | `/api/auth/register` | Register a new user profile. |
| | `POST` | `/api/auth/login` | Log in and retrieve JWT auth token. |
| | `GET` | `/api/auth/me` | Retrieve authenticated user profile metadata. |
| **Dashboard** | `GET` | `/api/dashboard` | Get lead metrics grouped by status. |
| **Leads** | `GET` | `/api/leads` | List leads (supports query, sort, filtering). |
| | `POST` | `/api/leads` | Create a new lead record. |
| | `GET` | `/api/leads/:id` | Get details for a specific lead. |
| | `PUT` | `/api/leads/:id` | Edit details of an existing lead. |
| | `DELETE`| `/api/leads/:id` | Soft delete a specific lead. |

---

## Architecture

The project employs clean architecture principles to keep services separated, testable, and maintainable:
- **Controller-Service-Repository Pattern**: Separates routing controllers from database execution rules and query components.
- **Prisma ORM Database Access**: Utilizes a central database client for type-safe query handling.
- **JWT Authentication Middleware**: Intercepts protected requests to validate the signature and ensure session status is active.
- **Zod Data Parsing**: Validates request parameters and payload schemas before controller methods execute.
- **Centralized Error Handling**: Intercepts standard application exceptions and serves standardized JSON error payloads.
- **Swagger Documentation**: Houses specs in `docs/openapi.yaml` and hosts them on an interactive Swagger UI dashboard.
- **Dockerized Deployment**: Deploys multi-stage build pipelines to assemble minimized container runtimes.

---

## Edge Cases Handled

- **Duplicate Email Registration**: Catching database uniqueness constraint violations to return user-friendly registration errors.
- **Invalid Login Credentials**: Safely rejecting login requests without revealing details about whether the user exists or not.
- **Missing Required Fields**: Schema validation throws clear feedback prior to running SQL execution blocks.
- **Invalid & Expired JWTs**: Interceptors block invalid request signatures and expire outdated login sessions automatically.
- **Unauthorized Tenant Access**: Queries are contextualized by the authenticated user's ID, preventing users from accessing or modifying leads owned by others.
- **Invalid Lead ID Parameters**: Handling bad format requests (UUID) gracefully without application crashes.
- **Empty Search & Filter Results**: Displaying clear empty-state components instead of infinite loading animations.
- **SQL Injection Prevention**: Using Prisma's built-in parameterization on all query blocks.
- **Secure Password Hashing**: Applying Salted Bcrypt rounds during registration and verification routines.
- **Database Startup Synchronicity**: Implementing Docker wait loops via netcat checks to ensure the backend starts only after PostgreSQL is fully ready.
- **Automatic Docker Migrations**: Applying Prisma schemas automatically when container clusters initialize.

---

## Future Improvements

- **Pagination**: Incorporate offset or cursor-based list controls on the frontend table grid.
- **Role-Based Access Control (RBAC)**: Support separate access privileges (Admin, Manager, Agent).
- **Refresh Token Rotation**: Implement secure cookie-based session refreshment routines.
- **Audit Logs**: Maintain record-level revision history logging.
- **Email Notifications**: Alert sales agents when status levels change or when leads are reassigned.
- **File Attachments**: Upload documents and contracts directly to lead profiles.
- **Advanced Reporting**: Render interactive custom charts and print exportable sales summaries.
