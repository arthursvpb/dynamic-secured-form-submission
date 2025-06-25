<h1 align="center">🔐 Dynamic Secured Form Submission</h1>

<p align="center">
  <a href="#-running">Running</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-testing">Testing</a>
</p>

<p align="center">
  <a href="#-license">
    <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=3b82f6&labelColor=000000">
  </a>
</p>

<p align="center">
A full-stack application for creating dynamic forms with cryptographically secure URLs and public submission capabilities. Built with Next.js, Express.js, Prisma, and PostgreSQL for enterprise environments.
</p>

## 🚀 Features

- ✅ **Admin Dashboard** - Create dynamic forms with custom sections and fields  
- ✅ **Secure Token Generation** - Cryptographically strong URLs
- ✅ **Public Form Access** - Anonymous submissions without user authentication  
- ✅ **Step-by-step Navigation** - Multi-section forms with validation and progress tracking  
- ✅ **Responsive Design** - Modern UI built with Tailwind CSS  
- ✅ **Docker Support** - Complete containerized development environment  
- ✅ **Comprehensive Testing** - Unit tests and E2E tests with Playwright  
- ✅ **Security-First** - SQL injection protection, CORS, Helmet.js, input validation

## 💻 Running

### **Requirements**

- `docker` and `docker-compose`
- `node >= 18` (for local development)

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/arthursvpb/dynamic-secured-form-submission.git
cd dynamic-secured-form-submission
```

#### 2️⃣ Start the Application (Docker - Recommended)

```bash
# Start all services (backend, frontend, database)
docker-compose up
```

**Application URLs:**

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:3001`
- **Database:** PostgreSQL on port `5432`

#### 3️⃣ Alternative: Local Development

**Backend Setup:**

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

**Frontend Setup:**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🧪 Testing

### **Unit Tests**

Our unit tests cover critical backend functionality including token generation, validation, and security measures.

#### **Backend Unit Tests**

```bash
cd backend
npm test
```

#### **Frontend Unit Tests**

```bash
cd frontend
npm test
```

**Available Test Scripts:**

- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

### **End-to-End (E2E) Tests**

Our E2E tests use **Playwright** to simulate real user interactions across the entire application flow.

#### **Run E2E Tests**

```bash
cd frontend

# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI (visual)
npm run test:e2e:ui
```

## 📜 Package.json Scripts

### **Backend Scripts**

```json
{
  "dev": "tsx watch src/server.ts", // Development with hot reload
  "build": "tsc", // TypeScript compilation
  "start": "node dist/server.js", // Production server
  "migrate": "prisma migrate deploy", // Production migrations
  "db:push": "prisma db push", // Development schema push
  "db:studio": "prisma studio", // Visual database editor
  "generate": "prisma generate", // Generate Prisma client
  "test": "jest", // Run unit tests
  "test:watch": "jest --watch" // Unit tests in watch mode
}
```

### **Frontend Scripts**

```json
{
  "dev": "next dev", // Next.js development server
  "build": "next build", // Production build
  "start": "next start", // Production server
  "lint": "next lint", // ESLint checking
  "test": "jest", // Run unit tests
  "test:watch": "jest --watch", // Unit tests in watch mode
  "test:e2e": "playwright test", // E2E tests (headless)
  "test:e2e:ui": "playwright test --ui" // E2E tests with UI
}
```

## 🔐 Admin Access

Access the admin dashboard to create forms:

**Credentials:**

- **Username:** `admin`
- **Password:** `password123`

**Access URL:** `http://localhost:3000/admin`

## ⚙️ Environment Variables

### **Backend (.env)**

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/forms_db"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### **Docker Environment**

All environment variables are configured in `docker-compose.yml` for seamless container orchestration.

## 📋 Development Workflow

1. **Setup**: `docker-compose up` (starts all services)
2. **Development**: Edit code with hot reload enabled
3. **Testing**: `npm test` (unit) → `npm run test:e2e` (E2E)
4. **Database**: `npm run db:studio` (visual editor)
5. **Deployment**: `npm run build` → `npm start`

---

<p align="center">Made with ☕️ by Arthur Vasconcellos</p>
