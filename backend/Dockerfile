# Stage 1: Build stage
FROM node:20-bookworm-slim AS builder

# Install system dependencies needed for building
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY docs ./docs

# Generate Prisma Client inside the builder stage
RUN npx prisma generate

# Build TypeScript app
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-bookworm-slim

# Install runtime system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    netcat-openbsd \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
# Install production dependencies only
RUN npm ci --omit=dev

# Copy compiled files, prisma configurations, generated Prisma client, and API documentation from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/docs ./docs
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 5000

# Container Startup: Wait for database connection, deploy migrations, and boot the server
CMD ["sh", "-c", "export DATABASE_URL=$(echo $DATABASE_URL | sed 's/localhost/postgres/g') && until nc -z postgres 5432; do echo 'Waiting for PostgreSQL...'; sleep 1; done && npx prisma migrate deploy && node dist/server.js"]
