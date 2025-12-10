# AI Video Ads Generator - Backend

This is the backend for the AI Video Ads Generator, built with NestJS.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Queue**: [BullMQ](https://docs.bullmq.io/) with Redis
- **Authentication**: JWT (Passport)
- **AI Integration**: LangChain (currently mocked)
- **Storage**: AWS S3 (placeholder module)

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+)

## Setup

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your local database credentials and Redis configuration.

3. **Database Setup**
   Initialize the database schema:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Running the Application**

   # Development
   ```bash
   npm run start:dev
   ```

   # Production
   ```bash
   npm run build
   npm run start:prod
   ```

## API Documentation

Swagger UI is available at: `http://localhost:3000/api/docs`

## Features & Flow

1. **Authentication**: 
   - `POST /api/auth/signup`
   - `POST /api/auth/login` (Returns JWT)

2. **Core Flow**:
   - Create a Product: `POST /api/products`
   - Create Ad Request: `POST /api/ads/request`
   - Generate Script (Mock AI): `POST /api/ads/{id}/generate-script`
   - Generate Video (Mock Job): `POST /api/ads/{id}/generate-video`
   - Check Status: `GET /api/ads/{id}/status`

## Architecture

- **Modular**: Feature-based modules (Auth, Ads, Products, etc.)
- **Services**: Business logic decoupled from Controllers.
- **Queues**: Video generation happens asynchronously via BullMQ.
- **AI**: LangChain integration is isolated in `ScriptGeneratorModule`.

## Mocking
Currently, the AI generation and Video rendering are **mocked** to simulate delays and responses without incurring API costs using placeholders.
