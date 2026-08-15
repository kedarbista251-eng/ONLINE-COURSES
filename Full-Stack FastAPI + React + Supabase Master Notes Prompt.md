# MASTER PROMPT — Full-Stack Development with FastAPI + React + Supabase

Act as my **senior Full-Stack engineer, mentor, teacher, and technical notes writer**.

I am a beginner-to-intermediate Computer Engineering student who wants to become genuinely strong at modern Full-Stack development.

My target stack is:

- **Python**
- **FastAPI**
- **REST APIs**
- **React**
- **JavaScript / TypeScript**
- **HTML + CSS**
- **Supabase**
- **PostgreSQL**
- **Authentication & Authorization**
- **Git & GitHub**
- **Deployment**
- **Docker**
- **AI-powered applications**

My goal is NOT just to memorize syntax. I want to understand **how real production applications are designed and built**.

Create a complete, structured set of **Full-Stack Development Notes** following the curriculum below.

---

# PART 0 — Prerequisites

Before teaching FastAPI, briefly cover only the Python concepts required for backend development:

1. Python syntax
2. Variables and data types
3. Lists, tuples, sets, dictionaries
4. Functions
5. `*args` and `**kwargs`
6. Modules and packages
7. Virtual environments
8. pip
9. Exceptions
10. File handling
11. OOP basics
12. Type hints
13. `async` / `await`
14. Environment variables
15. JSON

For every topic provide:

- Simple explanation
- Real-world analogy
- Small code example
- Common mistakes
- Mini exercise

Do NOT spend excessive time on basic Python.

---

# PART 1 — Web Development Fundamentals

Teach the fundamentals required to understand Full-Stack development.

Cover:

1. How the Internet works
2. Client vs Server
3. Browser
4. HTTP
5. HTTPS
6. Request and Response
7. HTTP methods:
   - GET
   - POST
   - PUT
   - PATCH
   - DELETE
8. HTTP status codes
9. Headers
10. Cookies
11. Sessions
12. JSON
13. REST APIs
14. API endpoints
15. URL parameters
16. Query parameters
17. Request body
18. Authentication vs Authorization
19. CORS
20. Frontend ↔ Backend communication

Explain the complete flow:

Browser → React → API → FastAPI → Database → FastAPI → React → Browser

Use diagrams whenever useful.

---

# PART 2 — FastAPI

Teach FastAPI from beginner level to production-level understanding.

## 2.1 Introduction

Explain:

- What FastAPI is
- Why FastAPI exists
- ASGI
- Uvicorn
- FastAPI vs Flask
- FastAPI vs Django
- When to use FastAPI
- Project structure

Show how to create a FastAPI project.

---

## 2.2 Basic API

Teach:

- Creating an application
- Routes
- GET
- POST
- PUT
- PATCH
- DELETE
- Path parameters
- Query parameters
- Request bodies
- Response models
- Status codes
- Headers

For every concept provide:

1. Concept
2. Syntax
3. Example
4. Explanation of every important line
5. Real-world use case
6. Common mistakes
7. Exercise

---

## 2.3 Pydantic

Teach:

- Pydantic
- BaseModel
- Validation
- Optional fields
- Nested models
- Field constraints
- Response models
- Serialization
- Validation errors

Explain why Pydantic is important in production APIs.

---

## 2.4 Dependency Injection

Teach:

- What dependency injection means
- FastAPI dependencies
- `Depends`
- Database dependencies
- Authentication dependencies
- Reusable dependencies

Give practical examples.

---

## 2.5 Async Programming

Teach:

- synchronous vs asynchronous
- `async`
- `await`
- event loop
- I/O-bound operations
- when async helps
- common async mistakes

Explain this practically rather than mathematically.

---

## 2.6 Database Integration

Teach FastAPI database integration.

Cover:

- PostgreSQL
- SQL
- SQLAlchemy
- ORM
- Models
- CRUD
- Transactions
- Relationships
- Migrations
- Alembic

Explain:

React → FastAPI → SQLAlchemy → PostgreSQL

---

## 2.7 Authentication

Teach production authentication concepts:

- Password hashing
- JWT
- Access tokens
- Refresh tokens
- OAuth2
- Authentication middleware
- Authorization
- Role-based access control
- Protected routes

Explain security best practices.

---

## 2.8 FastAPI Project Architecture

Show professional structures such as:

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── repositories/
│   ├── dependencies/
│   ├── core/
│   └── database/
├── tests/
├── .env
├── requirements.txt
└── README.md
```

Explain the purpose of every folder.

---

# PART 3 — React

Teach React from beginner to advanced practical level.

## 3.1 JavaScript Required for React

Briefly teach:

- let / const
- functions
- arrow functions
- arrays
- objects
- destructuring
- spread operator
- map
- filter
- promises
- async/await
- modules
- ES6+
- fetch
- JSON

---

# PART 3.2 — React Fundamentals

Teach:

1. What React is
2. Components
3. JSX
4. Props
5. State
6. Events
7. Conditional rendering
8. Lists
9. Keys
10. Forms

For each:

- Explanation
- Code
- Line-by-line explanation
- Real-world example
- Exercise

---

# PART 3.3 — React Hooks

Teach deeply:

- useState
- useEffect
- useContext
- useRef
- useMemo
- useCallback
- Custom Hooks

Explain:

- When to use
- When NOT to use
- Common mistakes
- Real production examples

---

# PART 3.4 — React Architecture

Teach:

- Component architecture
- Reusable components
- Container vs presentation concepts
- State management
- Context API
- Custom hooks
- API services
- Error handling
- Loading states

Show a professional React project structure.

---

# PART 3.5 — React Router

Teach:

- Routing
- Nested routes
- Dynamic routes
- Protected routes
- Navigation
- 404 pages
- Authentication-based routing

---

# PART 4 — Supabase

Teach Supabase deeply.

Cover:

1. What Supabase is
2. Supabase architecture
3. PostgreSQL
4. Tables
5. Rows
6. Columns
7. Primary keys
8. Foreign keys
9. Relationships
10. SQL basics
11. CRUD
12. Database functions
13. Views
14. Indexes
15. Row Level Security
16. Authentication
17. Storage
18. Realtime
19. Supabase client
20. Environment variables

Explain when Supabase can replace parts of a traditional backend.

---

# PART 5 — PostgreSQL

Teach practical PostgreSQL.

Cover:

- CREATE DATABASE
- CREATE TABLE
- INSERT
- SELECT
- UPDATE
- DELETE
- WHERE
- ORDER BY
- GROUP BY
- JOIN
- INNER JOIN
- LEFT JOIN
- Foreign keys
- Constraints
- Indexes
- Transactions
- Normalization

Then explain how PostgreSQL connects to FastAPI and Supabase.

---

# PART 6 — FastAPI + React Integration

This is extremely important.

Build the mental model:

```text
React Frontend
      ↓
HTTP Request
      ↓
FastAPI REST API
      ↓
Business Logic
      ↓
Database Layer
      ↓
PostgreSQL / Supabase
      ↓
FastAPI Response
      ↓
React State
      ↓
UI
```

Teach:

- fetch()
- Axios
- API service layers
- CORS
- Request handling
- Response handling
- Error handling
- Loading states
- Authentication
- Protected API endpoints

Create a complete small CRUD application.

---

# PART 7 — Authentication System

Build a complete authentication architecture.

Example:

```text
User
 ↓
React Login
 ↓
FastAPI
 ↓
Authentication
 ↓
JWT / Supabase Auth
 ↓
Database
 ↓
Protected Dashboard
```

Explain:

- Registration
- Login
- Logout
- Password hashing
- Tokens
- Sessions
- Protected routes
- Refresh tokens
- User roles
- Admin routes

---

# PART 8 — Production-Level Concepts

Teach:

- Environment variables
- `.env`
- Secrets
- Logging
- Error handling
- API versioning
- Rate limiting
- Validation
- Security
- CORS configuration
- SQL injection
- XSS
- CSRF
- Authentication security
- Password security
- Database security
- Input sanitization

Explain what should NEVER be exposed to the frontend.

---

# PART 9 — Git & GitHub

Teach:

- git init
- git clone
- git add
- git commit
- git push
- git pull
- branches
- merge
- rebase
- pull requests
- .gitignore
- GitHub workflow

Explain how professional developers use Git.

---

# PART 10 — Docker

Teach:

- What Docker is
- Images
- Containers
- Dockerfile
- Docker Compose
- Environment variables
- Container networking
- Running FastAPI with Docker
- Running React with Docker
- Running PostgreSQL with Docker

Show a realistic Full-Stack Docker setup.

---

# PART 11 — Testing

Teach:

### Backend

- pytest
- FastAPI TestClient
- Unit testing
- Integration testing

### Frontend

- Component testing
- API mocking
- Basic React testing concepts

Explain what should be tested in a real project.

---

# PART 12 — Deployment

Teach the deployment process conceptually and practically.

Cover:

- Frontend deployment
- Backend deployment
- Database deployment
- Environment variables
- Production configuration
- HTTPS
- Domain
- CORS
- CI/CD

Explain a typical architecture:

```text
User
 ↓
React Frontend
 ↓
FastAPI Backend
 ↓
Supabase PostgreSQL
```

---

# PART 13 — Real Projects

After teaching the concepts, create projects progressively.

## Project 1 — Todo App

Features:

- CRUD
- React frontend
- FastAPI backend
- PostgreSQL/Supabase database

---

## Project 2 — Authentication Dashboard

Features:

- Registration
- Login
- Logout
- Protected routes
- User profile
- JWT/Supabase authentication

---

## Project 3 — Blog Platform

Features:

- Users
- Authentication
- Posts
- Comments
- CRUD
- Search
- Pagination
- Database relationships

---

## Project 4 — Full-Stack AI Application

Build an AI-powered application using:

React + FastAPI + Supabase + LLM API

Include:

- Authentication
- Chat interface
- Conversation history
- Database
- Streaming responses
- API security
- Production architecture

Make this project suitable for a portfolio/GitHub repository.

---

# PART 14 — Advanced Full-Stack Concepts

After completing the fundamentals, teach:

- WebSockets
- Server-Sent Events
- Background tasks
- Celery concepts
- Redis
- Caching
- Pagination
- Search
- File uploads
- Object storage
- Webhooks
- API rate limiting
- Observability
- Monitoring
- Scaling
- Microservices basics
- Monolith vs microservices
- Reverse proxy
- Nginx
- CI/CD

---

# HOW TO WRITE THE NOTES

The notes must be:

- Beginner-friendly
- Technically accurate
- Practical
- Structured
- Concise but sufficiently detailed
- Focused on understanding rather than memorization

For every important concept use this structure:

## Concept

### 1. What is it?

Explain simply.

### 2. Why does it exist?

Explain the problem it solves.

### 3. Mental Model

Give an intuitive analogy.

### 4. Syntax

Show the basic syntax.

### 5. Example

Give a realistic example.

### 6. Line-by-Line Explanation

Explain important lines.

### 7. Real-World Usage

Explain where professional developers use it.

### 8. Common Mistakes

List mistakes beginners make.

### 9. Interview Questions

Give important interview questions.

### 10. Practice

Give 2–5 exercises.

---

# IMPORTANT RULES

1. Do NOT dump huge amounts of code without explanation.
2. Explain WHY something is done, not only HOW.
3. Prefer modern best practices.
4. Clearly distinguish beginner concepts from advanced concepts.
5. Never encourage insecure practices.
6. Clearly mark deprecated/outdated approaches.
7. When multiple approaches exist, compare them.
8. Use diagrams using Mermaid when useful.
9. Include code comments where helpful.
10. Use realistic project examples.
11. Avoid unnecessary theory.
12. Focus on skills that are useful for real jobs.
13. Explain the relationship between technologies.
14. Don't assume I already know backend development.
15. Don't skip fundamentals just to reach advanced topics.
16. Keep examples consistent across chapters where possible.

---

# MOST IMPORTANT LEARNING METHOD

Do NOT generate the entire course in one response.

Instead:

1. First generate the complete **course roadmap**.
2. Divide it into modules.
3. Tell me the recommended learning order.
4. Estimate the difficulty of each module.
5. Then wait for me to say:

**"START MODULE 1"**

When I say that, teach only Module 1.

At the end of every module provide:

- Key concepts
- Cheat sheet
- Common mistakes
- Interview questions
- Practice exercises
- Mini project
- What I should know before moving forward

Do not move to the next module until I explicitly ask.

My ultimate goal is:

**Become capable of designing, building, debugging, deploying, and explaining production-quality Full-Stack applications using FastAPI + React + Supabase.**