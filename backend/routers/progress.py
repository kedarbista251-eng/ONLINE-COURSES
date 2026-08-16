from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Progress, Lesson, Course, Section, User
from backend.schemas import ProgressToggleRequest, ProgressStatusResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("/{course_id}", response_model=ProgressStatusResponse)
def get_course_progress(course_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Enforce active enrollment check
    from backend.models import Enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id,
        Enrollment.status == "active"
    ).first()
    if not enrollment and current_user.role not in ["admin", "instructor"]:
        raise HTTPException(status_code=403, detail="You must be enrolled in this course to view progress.")

    sections = db.query(Section).filter(Section.course_id == course_id).all()
    section_ids = [s.id for s in sections]
    all_lessons = db.query(Lesson).filter(Lesson.section_id.in_(section_ids)).all() if section_ids else []
    total_lessons = len(all_lessons)

    completed_records = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.course_id == course_id,
        Progress.completed == True
    ).all()

    completed_lesson_ids = [p.lesson_id for p in completed_records]
    completed_count = len(completed_lesson_ids)
    progress_pct = round((completed_count / total_lessons * 100), 1) if total_lessons > 0 else 0.0

    return ProgressStatusResponse(
        course_id=course_id,
        completed_lesson_ids=completed_lesson_ids,
        total_lessons=total_lessons,
        completed_count=completed_count,
        progress_percentage=progress_pct
    )


@router.post("/toggle")
def toggle_lesson_progress(data: ProgressToggleRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Enforce active enrollment check
    from backend.models import Enrollment
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == data.course_id,
        Enrollment.status == "active"
    ).first()
    if not enrollment and current_user.role not in ["admin", "instructor"]:
        raise HTTPException(status_code=403, detail="You must be enrolled in this course to track progress.")

    record = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.course_id == data.course_id,
        Progress.lesson_id == data.lesson_id
    ).first()

    if record:
        record.completed = data.completed
    else:
        record = Progress(
            user_id=current_user.id,
            course_id=data.course_id,
            lesson_id=data.lesson_id,
            completed=data.completed
        )
        db.add(record)

    db.commit()
    return get_course_progress(data.course_id, current_user, db)
