from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Course, Enrollment, User, Instructor
from backend.schemas import AdminStatsResponse, InstructorCreate, InstructorResponse
from backend.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    total_courses = db.query(Course).count()
    total_students = db.query(User).filter(User.role == "student").count()
    total_enrollments = db.query(Enrollment).count()
    total_instructors = db.query(Instructor).count()
    
    # Calculate revenue sum from courses of enrolled students
    enrollments = db.query(Enrollment).all()
    total_revenue = sum(e.course.price for e in enrollments if e.course and e.course.price)

    return AdminStatsResponse(
        total_courses=total_courses,
        total_students=total_students,
        total_enrollments=total_enrollments,
        total_revenue=round(total_revenue, 2),
        total_instructors=total_instructors
    )

@router.get("/instructors", response_model=List[InstructorResponse])
def get_instructors(db: Session = Depends(get_db)):
    return db.query(Instructor).all()

@router.post("/instructors", response_model=InstructorResponse, status_code=status.HTTP_201_CREATED)
def create_instructor(data: InstructorCreate, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    instructor = Instructor(
        name=data.name,
        title=data.title,
        avatar=data.avatar,
        bio=data.bio
    )
    db.add(instructor)
    db.commit()
    db.refresh(instructor)
    return instructor
