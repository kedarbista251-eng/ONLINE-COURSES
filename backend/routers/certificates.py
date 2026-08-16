import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Certificate, Course, User, Progress, Section, Lesson
from backend.schemas import CertificateResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/certificates", tags=["Certificates"])

@router.get("", response_model=List[CertificateResponse])
def get_user_certificates(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Certificate).filter(Certificate.user_id == current_user.id).order_by(Certificate.issued_at.desc()).all()


@router.post("/generate/{course_id}", response_model=CertificateResponse)
def generate_certificate(course_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # 1. Enforce that the user is actually enrolled in this course
    from backend.models import Enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
        Enrollment.status == "active"
    ).first()
    if not enrollment and current_user.role not in ["admin", "instructor"]:
        raise HTTPException(status_code=403, detail="You must be enrolled in this course to generate a certificate.")

    # 2. Check course completion progress (must have completed all lessons)
    sections = db.query(Section).filter(Section.course_id == course_id).all()
    section_ids = [s.id for s in sections]
    total_lessons = db.query(Lesson).filter(Lesson.section_id.in_(section_ids)).count() if section_ids else 0

    completed_count = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.course_id == course_id,
        Progress.completed == True
    ).count()

    if total_lessons == 0 or completed_count < total_lessons:
        raise HTTPException(
            status_code=400,
            detail=f"Course incomplete ({completed_count}/{total_lessons} lessons completed). You must complete 100% of the lessons to generate a certificate."
        )

    existing_cert = db.query(Certificate).filter(
        Certificate.user_id == current_user.id,
        Certificate.course_id == course_id
    ).first()
    if existing_cert:
        return existing_cert

    # Generate unique certificate code
    code = f"LEARNI-{course_id.upper()[:6]}-{uuid.uuid4().hex[:8].upper()}"
    cert = Certificate(
        user_id=current_user.id,
        course_id=course_id,
        certificate_code=code,
        student_name=current_user.full_name,
        course_title=course.title
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


@router.get("/verify/{certificate_code}", response_model=CertificateResponse)
def verify_certificate(certificate_code: str, db: Session = Depends(get_db)):
    cert = db.query(Certificate).filter(Certificate.certificate_code == certificate_code).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Invalid certificate verification code")
    return cert
