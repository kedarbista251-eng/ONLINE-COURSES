# LMS Platform Security and Architecture Audit

This document summarizes the comprehensive security, architectural, and business logic audit conducted for the Learni LMS Platform.

---

## 🚨 Critical Vulnerabilities

### 1. Payment Bypass Vulnerability
- **Endpoint**: `POST /api/enrollments/confirm-payment`
- **Location**: [`backend/routers/enrollments.py:96-118`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/enrollments.py#L96-L118)
- **Description**: 
  Any authenticated user can hit this endpoint directly via a tool like Postman or curl with a valid JWT token and automatically get enrolled in any course for free. The endpoint creates an active enrollment record with a hardcoded prefix (`completed_tx_...`) and does not verify with Stripe that the transaction actually occurred.
- **Impact**: Loss of all revenue. Zero protection for paid course content.

### 2. Direct Video URL Leakage (API Content Exploitation)
- **Endpoint**: `GET /api/courses/{course_id}`
- **Location**: [`backend/routers/courses.py:64-111`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/courses.py#L64-L111)
- **Description**: 
  The syllabus fetch endpoint is fully public and returns `CourseDetailResponse` which includes the complete curriculum hierarchy and the raw `video_url` for every lesson. An unauthenticated user can open browser DevTools, inspect the JSON response of `/api/courses/{course_id}`, and access the private video links of all premium lessons without logging in or paying.
- **Impact**: Theft of intellectual property and video bandwidth.

### 3. Vertical Privilege Escalation
- **Dependency**: `require_admin`
- **Location**: [`backend/auth.py:61-67`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/auth.py#L61-L67)
- **Description**: 
  The permission check `current_user.role not in ["admin", "instructor"]` grants both full system admins and course instructors equal permissions. This means an instructor can view overall platform financial revenue stats via `/admin/stats` and create new instructors via `/admin/instructors`.
- **Impact**: Unauthorized access to financial dashboard and administrative capabilities.

---

## ⚠️ High & Medium Risk Issues

### 4. Unauthenticated Review Spam
- **Endpoint**: `POST /api/courses/{course_id}/reviews`
- **Location**: [`backend/routers/courses.py:195-219`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/courses.py#L195-L219)
- **Description**: 
  Uses `get_optional_current_user`, which resolves to `None` if no token is provided. If `None`, it defaults the name to `"Anonymous Student"` and successfully inserts the review, recalculating the average course rating.
- **Impact**: Competitors or botnets can manipulate course ratings and flood the database with spam reviews.

### 5. Hardcoded JWT Secret Key in Code Base
- **File**: [`backend/config.py:12`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/config.py#L12)
- **Description**: 
  `JWT_SECRET` defaults to a hardcoded string `super_secret_learni_jwt_key_2026_change_in_production`. If a developer deploys without setting `JWT_SECRET` as an environment variable in Render, any attacker who reads the repository can sign their own JWTs and gain full administrator privileges.
- **Impact**: Complete account takeover.

### 6. Missing Progress & Notes Enrollment Validation
- **Endpoints**: `/api/progress/toggle`, `/api/notes/save`
- **Locations**: [`backend/routers/progress.py`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/progress.py) & [`backend/routers/notes.py`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/notes.py)
- **Description**: 
  These endpoints allow users to record lesson notes and update completion checkmarks for courses they have not enrolled in or paid for.
- **Impact**: Database clutter, invalid progress states, and platform exploitation.

---

## ⚡ Performance and Database Problems

### 7. Severe N+1 Query Bottleneck in Admin Dashboard
- **Location**: [`backend/routers/admin.py:18-20`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/admin.py#L18-L20)
- **Description**: 
  To calculate revenue, the endpoint fetches **all** enrollment objects into memory:
  ```python
  enrollments = db.query(Enrollment).all()
  total_revenue = sum(e.course.price for e in enrollments if e.course and e.course.price)
  ```
  This triggers a lazy-loading query to fetch the associated `Course` row for *every single enrollment*. If there are 5,000 enrollments, this endpoint executes 5,001 database queries.
- **Impact**: Server hanging, high database CPU usage, and eventual crashes under load.

### 8. Course Syllabus N+1 queries
- **Location**: [`backend/routers/courses.py:79-88`](file:///c:/Users/Bhupendra%20Bista/Downloads/Desktop/KEDAR_BISTA/learni%20new/COURSE_FULLSTACK/backend/routers/courses.py#L79-L88)
- **Description**: 
  In `get_course_detail`, the backend loops over sections and queries the database separately to retrieve lessons for each section.
- **Impact**: Slower response times on course landing pages.

---

## 🧪 Testing Coverage
- **Current Coverage**: **0%**
- **Findings**: The project has absolutely no automated tests (unit tests, API integration tests, or security verification suites).
