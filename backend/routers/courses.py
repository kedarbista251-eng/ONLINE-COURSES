from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.database import get_db
from backend.models import Course, Section, Lesson, Review, Instructor, User
from backend.schemas import (
    CourseListResponse, CourseDetailResponse, CourseCreate, CourseUpdate,
    SectionCreate, LessonCreate, ReviewCreate, ReviewResponse
)
from backend.auth import require_admin, get_optional_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseListResponse])
def get_courses(
    search: Optional[str] = Query(None, description="Search term for title/subtitle/tags"),
    category: Optional[str] = Query(None, description="Filter by category"),
    level: Optional[str] = Query(None, description="Filter by level"),
    min_price: Optional[float] = Query(None, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, description="Maximum price filter"),
    sort_by: Optional[str] = Query("popular", description="popular, rating, newest, price_low, price_high"),
    db: Session = Depends(get_db)
):
    query = db.query(Course)

    if category and category != "All":
        query = query.filter(Course.category == category)
    
    if level and level != "All Levels":
        query = query.filter(Course.level == level)

    if min_price is not None:
        query = query.filter(Course.price >= min_price)

    if max_price is not None:
        query = query.filter(Course.price <= max_price)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Course.title.ilike(search_pattern),
                Course.subtitle.ilike(search_pattern),
                Course.category.ilike(search_pattern)
            )
        )

    if sort_by == "rating":
        query = query.order_by(Course.rating.desc())
    elif sort_by == "newest":
        query = query.order_by(Course.created_at.desc())
    elif sort_by == "price_low":
        query = query.order_by(Course.price.asc())
    elif sort_by == "price_high":
        query = query.order_by(Course.price.desc())
    else: # popular
        query = query.order_by(Course.students_count.desc())

    courses = query.all()
    return courses


@router.get("/{course_id}", response_model=CourseDetailResponse)
def get_course_detail(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Calculate curriculum format
    sections = db.query(Section).filter(Section.course_id == course_id).order_index_asc() if hasattr(Section, 'order_index_asc') else db.query(Section).filter(Section.course_id == course_id).order_by(Section.order_index).all()
    reviews = db.query(Review).filter(Review.course_id == course_id).order_by(Review.created_at.desc()).all()

    # Calculate lessons count
    total_lessons = sum(len(sec.lessons) for sec in sections)
    course.lessons_count = total_lessons

    curriculum_res = []
    for sec in sections:
        lessons = db.query(Lesson).filter(Lesson.section_id == sec.id).order_by(Lesson.order_index).all()
        curriculum_res.append({
            "id": sec.id,
            "section_title": sec.section_title,
            "duration": sec.duration,
            "order_index": sec.order_index,
            "course_id": sec.course_id,
            "lessons": lessons
        })

    return {
        "id": course.id,
        "title": course.title,
        "subtitle": course.subtitle,
        "category": course.category,
        "level": course.level,
        "rating": course.rating,
        "reviews_count": len(reviews),
        "students_count": course.students_count,
        "price": course.price,
        "original_price": course.original_price,
        "is_bestseller": course.is_bestseller,
        "thumbnail": course.thumbnail,
        "instructor": course.instructor,
        "duration": course.duration,
        "lessons_count": total_lessons,
        "updated_date": course.updated_date,
        "tags": course.tags or [],
        "what_you_will_learn": course.what_you_will_learn or [],
        "curriculum": curriculum_res,
        "reviews": reviews
    }


# Admin CRUD Endpoints
@router.post("", response_model=CourseDetailResponse, status_code=status.HTTP_201_CREATED)
def create_course(course_in: CourseCreate, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    existing = db.query(Course).filter(Course.id == course_in.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course with this ID already exists")

    course = Course(
        id=course_in.id,
        title=course_in.title,
        subtitle=course_in.subtitle,
        category=course_in.category,
        level=course_in.level,
        price=course_in.price,
        original_price=course_in.original_price,
        is_bestseller=course_in.is_bestseller,
        thumbnail=course_in.thumbnail,
        duration=course_in.duration,
        tags=course_in.tags,
        what_you_will_learn=course_in.what_you_will_learn,
        instructor_id=course_in.instructor_id
    )
    db.add(course)
    db.flush()

    total_lessons = 0
    for idx, sec_in in enumerate(course_in.sections):
        sec = Section(
            course_id=course.id,
            section_title=sec_in.section_title,
            duration=sec_in.duration,
            order_index=idx
        )
        db.add(sec)
        db.flush()

        for l_idx, l_in in enumerate(sec_in.lessons):
            lesson_id = l_in.id or f"{course.id}-sec{sec.id}-l{l_idx+1}"
            l_obj = Lesson(
                id=lesson_id,
                section_id=sec.id,
                title=l_in.title,
                duration=l_in.duration,
                video_url=l_in.video_url,
                is_preview=l_in.is_preview or False,
                order_index=l_idx
            )
            db.add(l_obj)
            total_lessons += 1

    course.lessons_count = total_lessons
    db.commit()
    db.refresh(course)
    return get_course_detail(course.id, db)


@router.put("/{course_id}", response_model=CourseDetailResponse)
def update_course(course_id: str, course_in: CourseUpdate, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    update_data = course_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(course, key, value)

    db.commit()
    return get_course_detail(course_id, db)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: str, admin_user: User = Depends(require_admin), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    db.delete(course)
    db.commit()
    return None


@router.post("/{course_id}/reviews", response_model=ReviewResponse)
def add_review(course_id: str, review_in: ReviewCreate, current_user: User = Depends(get_optional_current_user), db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    user_name = current_user.full_name if current_user else "Anonymous Student"
    review = Review(
        course_id=course_id,
        user_name=user_name,
        rating=review_in.rating,
        comment=review_in.comment,
        date="Just now"
    )
    db.add(review)
    
    # Recalculate average rating
    all_reviews = db.query(Review).filter(Review.course_id == course_id).all()
    ratings = [r.rating for r in all_reviews] + [review_in.rating]
    course.rating = round(sum(ratings) / len(ratings), 1)
    course.reviews_count = len(ratings)

    db.commit()
    db.refresh(review)
    return review
