from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Instructor Schemas ---
class InstructorBase(BaseModel):
    name: str
    title: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None

class InstructorCreate(InstructorBase):
    pass

class InstructorResponse(InstructorBase):
    id: int

    class Config:
        from_attributes = True

# --- Lesson & Section Schemas ---
class LessonBase(BaseModel):
    id: Optional[str] = None
    title: str
    duration: str
    video_url: str
    is_preview: Optional[bool] = False
    order_index: Optional[int] = 0

class LessonCreate(LessonBase):
    pass

class LessonResponse(LessonBase):
    id: str
    section_id: int

    class Config:
        from_attributes = True

class SectionBase(BaseModel):
    section_title: str
    duration: Optional[str] = "0 min"
    order_index: Optional[int] = 0

class SectionCreate(SectionBase):
    lessons: List[LessonCreate] = []

class SectionResponse(SectionBase):
    id: int
    course_id: str
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True

# --- Review Schemas ---
class ReviewCreate(BaseModel):
    rating: float
    comment: str

class ReviewResponse(BaseModel):
    id: int
    user_name: str
    rating: float
    comment: str
    date: Optional[str] = None

    class Config:
        from_attributes = True

# --- Course Schemas ---
class CourseBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    category: str
    level: Optional[str] = "All Levels"
    price: float
    original_price: Optional[float] = None
    is_bestseller: Optional[bool] = False
    thumbnail: Optional[str] = None
    duration: Optional[str] = "0 Hours"
    tags: List[str] = []
    what_you_will_learn: List[str] = []

class CourseCreate(CourseBase):
    id: str # slug
    instructor_id: Optional[int] = None
    sections: List[SectionCreate] = []

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    is_bestseller: Optional[bool] = None
    thumbnail: Optional[str] = None
    duration: Optional[str] = None
    tags: Optional[List[str]] = None
    what_you_will_learn: Optional[List[str]] = None
    instructor_id: Optional[int] = None

class CourseListResponse(CourseBase):
    id: str
    rating: float
    reviews_count: int
    students_count: int
    lessons_count: int
    updated_date: Optional[str] = None
    instructor: Optional[InstructorResponse] = None

    class Config:
        from_attributes = True

class CourseDetailResponse(CourseListResponse):
    curriculum: List[SectionResponse] = []
    reviews: List[ReviewResponse] = []

    class Config:
        from_attributes = True

# --- Enrollment & Stripe Schemas ---
class CheckoutSessionRequest(BaseModel):
    course_id: str

class CheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str
    is_mock: bool = False

class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    course_id: str
    enrolled_at: datetime
    status: str
    course: Optional[CourseListResponse] = None

    class Config:
        from_attributes = True

# --- Progress Schemas ---
class ProgressToggleRequest(BaseModel):
    course_id: str
    lesson_id: str
    completed: bool

class ProgressStatusResponse(BaseModel):
    course_id: str
    completed_lesson_ids: List[str]
    total_lessons: int
    completed_count: int
    progress_percentage: float

# --- Lesson Note Schemas ---
class NoteSaveRequest(BaseModel):
    course_id: str
    lesson_id: str
    note_text: str

class NoteResponse(BaseModel):
    id: int
    course_id: str
    lesson_id: str
    note_text: str
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Certificate Schemas ---
class CertificateResponse(BaseModel):
    id: int
    certificate_code: str
    student_name: str
    course_title: str
    course_id: str
    issued_at: datetime

    class Config:
        from_attributes = True

# --- Dashboard & Admin Stats ---
class DashboardSummaryResponse(BaseModel):
    enrolled_courses: List[EnrollmentResponse]
    progress_map: dict
    notes: List[NoteResponse]
    certificates: List[CertificateResponse]

class AdminStatsResponse(BaseModel):
    total_courses: int
    total_students: int
    total_enrollments: int
    total_revenue: float
    total_instructors: int
