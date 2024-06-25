# Dynamic Secured Form Submission

A full-stack application for creating dynamic forms with secure URLs and public submission capabilities. Built with Next.js, Express.js, Prisma, and PostgreSQL.

## Features

- **Admin Dashboard**: Create dynamic forms with custom sections and fields
- **Secure URLs**: Generate cryptographically secure, tokenized URLs for forms
- **Public Submissions**: Allow anyone to submit forms without authentication
- **Step-by-step Forms**: Multi-section forms with validation and progress tracking
- **Responsive Design**: Clean, modern UI built with Tailwind CSS
- **Docker Support**: Complete containerized development environment

## Tech Stack

### Backend

- **Express.js** - REST API server
- **Prisma** - Database ORM and migrations
- **PostgreSQL** - Primary database
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Joi** - Input validation
- **Jest** - Unit testing

### Frontend

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Playwright** - E2E testing
- **TypeScript** - Type safety

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Option 1: Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dynamic-secured-form-submission
   ```

2. **Start all services**

   ```bash
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: PostgreSQL on port 5432

### Option 2: Local Development

1. **Setup Backend**

   ```bash
   cd backend
   npm install

   # Setup environment variables
   cp .env.example .env
   # Edit .env with your database credentials

   # Run database migrations
   npx prisma migrate dev

   # Start development server
   npm run dev
   ```

2. **Setup Frontend**

   ```bash
   cd frontend
   npm install

   # Start development server
   npm run dev
   ```

## Admin Access

Use these credentials to access the admin dashboard:

- **Username**: `admin`
- **Password**: `password123`

Navigate to `/admin` to log in and create forms.

## API Documentation

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/verify` - Verify JWT token

### Forms

- `POST /api/forms` - Create new form (requires auth)
- `GET /api/forms` - List all forms (requires auth)
- `GET /api/forms/token/:token` - Get form by token (public)

### Submissions

- `POST /api/submissions/:token` - Submit form data (public)
- `GET /api/submissions/form/:formId` - Get form submissions (requires auth)

## Testing

### Unit Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### E2E Tests

```bash
cd frontend
npm run test:e2e
```

The E2E tests cover:

- Admin login flow
- Form creation and URL generation
- Public form access and submission
- Form validation and error handling
- Confirmation message display

## Security Features

- **Secure Tokens**: Uses `crypto.randomBytes(32)` for unguessable form URLs
- **Token Validation**: Server-side verification of all form tokens
- **Input Validation**: Comprehensive validation using Joi schemas
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Helmet.js**: Security headers for Express.js

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Authentication & validation
│   │   ├── utils/          # Crypto & validation utilities
│   │   └── __tests__/      # Unit tests
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── migrations/     # Database migrations
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app routes
│   │   ├── components/     # React components
│   │   └── lib/           # API client & utilities
│   ├── tests/e2e/         # Playwright E2E tests
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Database Schema

The application uses a relational database with the following models:

- **Form**: Container for dynamic forms with secure tokens
- **Section**: Logical groupings within forms (e.g., "Personal Info")
- **Field**: Individual form fields (text/number types only)
- **Submission**: Form submission records
- **SubmissionValue**: Individual field values for each submission

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/dynamic_forms
JWT_SECRET=your-jwt-secret-here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development Notes

- The admin password is hardcoded as `password123` (bcrypt hash in code)
- Forms support only text and number field types as specified
- All form URLs use cryptographically secure 64-character hex tokens
- The application uses conventional commits for version control
- Code follows clean architecture principles with clear separation of concerns

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use environment-specific database credentials
6. Configure proper logging and monitoring
