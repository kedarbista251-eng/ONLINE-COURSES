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
