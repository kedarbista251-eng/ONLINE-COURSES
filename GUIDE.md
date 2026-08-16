# Learni LMS Project Guide

This guide explains how to manage the project after setup, including content creation, video integration, notes, database management, authentication, and the operational responsibilities of an administrator.

## 1. Project Overview

This project is a full-stack learning platform built with:

- Frontend: React + Vite
- Backend: FastAPI
- Database: SQLite by default, with support for PostgreSQL/Supabase-style URLs
- Authentication: JWT
- Payments: Stripe-ready checkout flow
- Course delivery: video lessons, notes, enrollment tracking, certificates

The app is designed for a modern learning marketplace with:

- Student learning dashboard
- Instructor/admin course management
- API-driven course catalog
- Progress tracking
- Lesson notes and certificate generation

## 2. Running the Project

### Frontend

From the project root:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open:

```text
http://localhost:5173
```

### Backend

From the project root:

```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

API health check:

```text
http://localhost:8000/api/health
```

## 3. Environment Configuration

The project uses environment variables from `.env` (local development) or platform configuration panels (production).

### Local Development (`.env`)

Create a `.env` file in the project root:

```env
# App mode
APP_ENV=development

# Database Connection (SQLite fallback for local)
DATABASE_URL=sqlite:///./learni.db

# JWT Configuration
JWT_SECRET=your_secure_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_MockStripeKeyForTestingCourseApp2026

# Backend-to-Frontend URLs
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173

# Frontend-to-Backend URL
VITE_API_URL=http://localhost:8000/api
```

### Production Deployment

#### A. Render (Backend Deployment)
Configure the following in the Render environment variables tab:
1. **`APP_ENV`**: Set to `production` (disables SQLite fallback to prevent data loss).
2. **`DATABASE_URL`**: Your Supabase/PostgreSQL connection string. (If it starts with `postgres://`, the app automatically normalizes it to `postgresql://`).
3. **`JWT_SECRET`**: A strong secret key generated for production.
4. **`FRONTEND_URL`**: Set to your Vercel frontend URL (e.g., `https://your-app.vercel.app`).
5. **`CORS_ORIGINS`**: Set to your Vercel frontend URL (e.g., `https://your-app.vercel.app`) to authorize requests.
6. **`STRIPE_SECRET_KEY`**: Your live/test Stripe API key.

#### B. Vercel (Frontend Deployment)
Configure the following in the Vercel project environment variables settings:
1. **`VITE_API_URL`**: Set to your Render backend API URL with `/api` appended (e.g., `https://your-backend.onrender.com/api`).
   *Note: Vite requires the `VITE_` prefix to bundle environment variables into the client-side code.*

## 4. Managing the Database

### Default database

The app uses SQLite by default:

```text
learni.db
```

### Why this matters

The database stores:

- users
- courses
- lessons
- enrollments
- progress
- notes
- certificates
- admin/instructor metadata

### Database operations

You can inspect the DB using SQLite browser tools or a terminal client:

```bash
sqlite3 learni.db
```

Useful checks:

```sql
SELECT * FROM users;
SELECT * FROM courses;
SELECT * FROM lessons;
SELECT * FROM enrollments;
```

### Production migration

For deployment, switch to PostgreSQL by updating:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

Then ensure the app runs with a proper migration workflow if the project is scaled.

## 5. Adding Courses

Course content is usually managed through the admin panel or backend APIs.

### Admin responsibilities

- Create course titles and metadata
- Add categories, levels, and pricing
- Add video lessons
- Add descriptions and learning objectives
- Set instructor information
- Publish or hide courses

### Recommended structure per course

Each course should include:

- course title
- short subtitle
- category
- level
- price
- instructor
- thumbnail
- tags
- learning outcomes
- sections
- lessons

### Best practice

Use stable IDs and consistent lesson naming so progress tracking and notes work correctly.

## 6. Adding Video Content

### Recommended workflow

1. Host the video on a provider such as:
   - Cloudinary
   - Vimeo
   - YouTube (if allowed by licensing)
   - custom media CDN
2. Copy the public video URL or stream URL.
3. Save it in the lesson metadata.
4. Ensure the video file is accessible from the frontend.

### Important checks

- Confirm CORS and cross-domain access
- Prefer HTTPS URLs
- Use MP4 or browser-friendly formats for broad compatibility
- Keep file size manageable for playback performance

## 7. Managing Notes

Notes are tied to each user and each lesson.

### Typical note workflow

- User watches a lesson
- User writes summary or key takeaways
- System stores the note under that lesson
- Student can review notes later from the dashboard or lesson player

### Admin concerns

- Ensure notes are associated with the correct user and lesson
- Keep note storage well-defined and backed by the database
- Support deletion or updates when a course changes

## 8. Authentication and Roles

The project includes JWT-based auth.

### Roles to manage

- Student
- Instructor
- Admin

### Admin responsibilities

- Manage user roles
- Create instructor profiles
- Review course publishing status
- Monitor enrollments and platform metrics
- Approve or update course content

### Security checklist

- Use a strong JWT secret in production
- Rotate secrets regularly
- Do not hardcode credentials into frontend code
- Use HTTPS in production

## 9. Payments and Enrollment

This project has a Stripe-ready flow. An administrator should understand:

- creating course prices
- checking checkout flow
- confirming payment state
- verifying enrollment status

### Production notes

- Replace mock API keys with real Stripe keys
- Confirm webhook handling and secure verification
- Test both successful and failed checkout flows

## 10. Progress Tracking

Progress is monitored through lesson completion and student activity.

### What needs to be managed

- completed lessons
- course progress percentages
- certificate eligibility
- retention metrics

### Best practice

Keep lesson IDs consistent across the course data model and frontend state.

## 11. Certificate Generation

Certificates are generated when the user completes the course.

### Admin tasks

- Ensure completion logic is correct
- Verify certificate validity codes
- Confirm that course completion rules are consistent

## 12. Production Readiness Checklist

Before launching this app publicly, the administrator should verify:

- environment variables are correct
- database is production-grade
- JWT secrets are secure
- Stripe keys are live and tested
- backend is served via a proper deployment host
- frontend is compiled for production
- HTTPS is enabled
- monitoring and logging are configured
- backups for the database are scheduled

## 13. Recommended Operational Workflow

A typical admin workflow:

1. Create or update instructor profiles
2. Add or edit course content
3. Add lessons and media assets
4. Verify pricing and enrollment setup
5. Test login and role permissions
6. Review student dashboards and progress
7. Confirm certificate eligibility
8. Monitor the database for issues
9. Publish the course only after testing

## 14. Typical Files You Will Edit

- `src/App.jsx` — app routing and main application state
- `src/components/*` — UI modules
- `src/services/api.js` — frontend API calls
- `backend/main.py` — FastAPI bootstrap
- `backend/config.py` — app settings
- `backend/database.py` — DB session and models setup
- `backend/routers/*` — API endpoints
- `.env` — runtime environment variables

## 15. Production Guidance

This project is close to production-ready, but administrators should still check:

- secure hosting
- DB backups
- code quality review
- API rate limiting
- traffic monitoring
- proper user permission enforcement
- compliance for course media and student data

## 16. Quick Start Summary

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open:

```text
http://localhost:5173
```

## 17. Final Advice

Treat the admin panel as the control center for the platform. The most important skills for an administrator are:

- course management
- content quality control
- student and role management
- media and database oversight
- security hygiene
- analytics and enrollment review

That combination will keep the learning platform reliable, maintainable, and production-ready.
