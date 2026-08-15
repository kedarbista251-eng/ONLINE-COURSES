import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student") # student, instructor, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    enrollments = relationship("Enrollment", back_populates="user")
    progress = relationship("Progress", back_populates="user")
    notes = relationship("LessonNote", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")


class Instructor(Base):
    __tablename__ = "instructors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    courses = relationship("Course", back_populates="instructor")


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True) # e.g. "fullstack-mastery"
    title = Column(String, nullable=False)
    subtitle = Column(Text, nullable=True)
    category = Column(String, index=True, nullable=False)
    level = Column(String, default="All Levels")
    rating = Column(Float, default=4.8)
    reviews_count = Column(Integer, default=0)
    students_count = Column(Integer, default=0)
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    is_bestseller = Column(Boolean, default=False)
    thumbnail = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    lessons_count = Column(Integer, default=0)
    updated_date = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    what_you_will_learn = Column(JSON, default=list)
    instructor_id = Column(Integer, ForeignKey("instructors.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    instructor = relationship("Instructor", back_populates="courses")
    sections = relationship("Section", back_populates="course", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    section_title = Column(String, nullable=False)
    duration = Column(String, nullable=True)
    order_index = Column(Integer, default=0)

    course = relationship("Course", back_populates="sections")
    lessons = relationship("Lesson", back_populates="section", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(String, primary_key=True, index=True) # e.g. "l1"
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    title = Column(String, nullable=False)
    duration = Column(String, nullable=True)
    video_url = Column(String, nullable=False)
    is_preview = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    section = relationship("Section", back_populates="lessons")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    user_name = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    comment = Column(Text, nullable=False)
    date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    course = relationship("Course", back_populates="reviews")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    stripe_payment_id = Column(String, nullable=True)
    status = Column(String, default="active")

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    lesson_id = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="progress")


class LessonNote(Base):
    __tablename__ = "lesson_notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    lesson_id = Column(String, nullable=False)
    note_text = Column(Text, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notes")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False)
    certificate_code = Column(String, unique=True, index=True, nullable=False)
    student_name = Column(String, nullable=False)
    course_title = Column(String, nullable=False)
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="certificates")
