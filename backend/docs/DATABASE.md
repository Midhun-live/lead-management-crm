# Database Architecture Documentation

This document describes the database design, object models, constraints, and migration strategies for the Full Stack Lead Management CRM application.

## Database & ORM Stack

- **Database Engine**: PostgreSQL
- **Object-Relational Mapping (ORM)**: Prisma ORM

### Why Prisma ORM?
1. **Type-Safe Client**: Automatically generates TypeScript interfaces matching the database schema, minimizing syntax runtime mismatches.
2. **Declarative Schema Modeling**: All models, indexes, constraints, and relations are mapped in a single file: [schema.prisma](file:///Users/midhun/Tech/CRM/backend/prisma/schema.prisma).
3. **Automated Migration Handling**: Standardizes database modifications via SQL scripting checkpoints.

---

## Entity Relationship (ER) Model

The database is built around two primary entities: **User** and **Lead**.

```text
+-------------------+             +-------------------+
|       User        |             |       Lead        |
+-------------------+             +-------------------+
| id (PK)           |             | id (PK)           |
| name              |             | name              |
| email (Unique)    | <---------+ | email             |
| password          |             | phone             |
| isActive          |             | company           |
| tokenVersion      |             | source (Enum)     |
| createdAt         |             | status (Enum)     |
| updatedAt         |             | notes (Nullable)  |
+-------------------+             | createdBy (FK)    |
                                  | deletedAt (Null)  |
                                  | createdAt         |
                                  | updatedAt         |
                                  +-------------------+
```

### Relationship Cardinality
- **One-to-Many**: One `User` can create and manage many `Leads`.
- **Many-to-One**: Each `Lead` is owned by exactly one `User` (referenced by the `createdBy` foreign key).

---

## Table Descriptions

### 1. `User` Table
Holds registration credentials, profile information, active flags, and auth validation versioning keys.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default UUID | Unique identifier for the user account. |
| `name` | `VARCHAR` | Not Null | User's full name. |
| `email` | `VARCHAR` | Not Null, Unique | User's email address used for login. |
| `password` | `VARCHAR` | Not Null | Bcrypt hashed password. |
| `isActive` | `BOOLEAN` | Default: `true` | Status flag. If false, token auth will be blocked. |
| `tokenVersion`| `INT` | Default: `1` | Incrementing version token. Used to invalidate active sessions. |
| `lastLogin` | `TIMESTAMP` | Nullable | Records the timestamp of the last login event. |
| `createdAt` | `TIMESTAMP` | Default: `now()` | Account registration date. |
| `updatedAt` | `TIMESTAMP` | Auto Update | Last modification date. |

### 2. `Lead` Table
Stores contact information, pipeline stages, and notes for business prospects.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | Primary Key, Default UUID | Unique identifier for the lead. |
| `name` | `VARCHAR` | Not Null | Prospect contact name. |
| `company` | `VARCHAR` | Not Null | Employer / Business name. |
| `email` | `VARCHAR` | Not Null | Prospect email address. |
| `phone` | `VARCHAR` | Not Null | Prospect phone number. |
| `source` | `ENUM` | Not Null (WEBSITE, LINKEDIN, etc.) | Source channels of the business prospect. |
| `status` | `ENUM` | Not Null (NEW, CONTACTED, etc.) | Lead lifecycle stage in sales pipeline. |
| `notes` | `TEXT` | Nullable | Text comments and custom notes. |
| `createdBy` | `UUID` | Foreign Key -> `User.id` | Identifier of the user who owns the lead. |
| `deletedAt` | `TIMESTAMP` | Nullable | Soft-delete timestamp. Non-null indicates deleted status. |
| `createdAt` | `TIMESTAMP` | Default: `now()` | Date the lead was added. |
| `updatedAt` | `TIMESTAMP` | Auto Update | Last lead details modification date. |

---

## Constraints & Business Rules

1. **Unique Email Constraint**:
   - `User(email)`: Enforces database uniqueness. No duplicate accounts can be created with the same email.
2. **Foreign Key Integrity Constraint**:
   - `Lead(createdBy) REFERENCES User(id)`: Prevents orphaned records. Active user deletions automatically cascade or block depending on system dependencies.
3. **Compound Unique Leads Constraint**:
   - Leads cannot have duplicate contact information for the same active user. This prevents duplicate leads under a single account.

---

## Indexes & Query Optimization

To maintain fast response times, the database utilizes custom indexes for critical querying paths:

1. **`User` Table**:
   - **Unique Index on `email`**: Handled automatically by Prisma to optimize login lookups.
2. **`Lead` Table**:
   - **Index on `createdBy`**: Accelerates listing operations filtering leads owned by the authenticated user.
   - **Compound Index on `createdBy`, `status`, `source`**: Speeds up filtered query lookups on the Leads dashboard page.
   - **Text Indexes**: Built on searchable text fields (`name`, `company`, `email`, `phone`) to enable instant keyword lookups.

---

## Migration Strategy

Database changes are managed sequentially through Prisma Migrate:

1. **Local Migration Checkpoints**:
   - Run `npx prisma migrate dev --name <migration_name>` during development.
   - Generates sequential SQL scripts stored under `backend/prisma/migrations/`.
2. **Production Database Deployments**:
   - Run `npx prisma migrate deploy` in CI/CD release pipelines to execute pending migrations without dev prompts.
