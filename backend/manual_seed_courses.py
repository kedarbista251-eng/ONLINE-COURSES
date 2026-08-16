import argparse
import os
import sys
from typing import List

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import Base, engine, SessionLocal
from backend.models import User, Instructor, Course, Section, Lesson, Review, Enrollment, Progress, LessonNote
from backend.auth import hash_password

SAMPLE_COURSES = [
    {
        "id": "fullstack-mastery",
        "title": "Fullstack Web Development Bootcamp 2026",
        "subtitle": "Master React, Node.js, TypeScript and PostgreSQL with production-ready patterns.",
        "category": "Development",
        "level": "All Levels",
        "rating": 4.9,
        "reviewsCount": 1420,
        "studentsCount": 18450,
        "price": 89,
        "originalPrice": 199,
        "isBestseller": True,
        "thumbnail": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        "instructor": {
            "name": "Alex Rivera",
            "title": "Senior Principal Engineer",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            "bio": "Engineer focused on scalable platform architecture and developer education."
        },
        "duration": "42 Hours",
        "lessonsCount": 8,
        "updatedDate": "August 2026",
        "tags": ["React", "TypeScript", "Node.js", "PostgreSQL"],
        "whatYouWillLearn": [
            "Build modern frontend and backend apps",
            "Use production patterns for APIs and database design",
            "Deploy and maintain production-ready features"
        ],
        "curriculum": [
            {
                "sectionTitle": "Modern Fullstack Foundations",
                "duration": "3 lessons • 2h 00m",
                "lessons": [
                    {"id": "l1", "title": "Course Introduction", "duration": "12:45", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "preview": True},
                    {"id": "l2", "title": "Frontend Setup", "duration": "24:10", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "preview": True},
                    {"id": "l3", "title": "Backend Setup", "duration": "38:50", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "preview": False}
                ]
            }
        ],
        "reviews": [
            {"id": "r1", "name": "David K.", "rating": 5, "comment": "Excellent teaching and practical structure.", "date": "3 days ago"}
        ]
    },
    {
        "id": "ai-engineering-mastery",
        "title": "AI Engineer & LLM Application Development",
        "subtitle": "Learn RAG, agents, prompt workflows and production AI systems.",
        "category": "Artificial Intelligence",
        "level": "Intermediate",
        "rating": 4.95,
        "reviewsCount": 890,
        "studentsCount": 9420,
        "price": 99,
        "originalPrice": 249,
        "isBestseller": True,
        "thumbnail": "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80",
        "instructor": {
            "name": "Dr. Elena Rostova",
            "title": "AI Researcher",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
            "bio": "Researcher specializing in production LLM and retrieval workflows."
        },
        "duration": "34 Hours",
        "lessonsCount": 6,
        "updatedDate": "July 2026",
        "tags": ["Python", "LLM", "RAG", "Agents"],
        "whatYouWillLearn": [
            "Design retrieval and memory workflows",
            "Build AI apps with real user flows",
            "Deploy and optimize AI products"
        ],
        "curriculum": [
            {
                "sectionTitle": "RAG and LLM Foundations",
                "duration": "3 lessons • 2h 20m",
                "lessons": [
                    {"id": "ai-l1", "title": "Introduction to Embeddings", "duration": "25:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackBranding.mp4", "preview": True},
                    {"id": "ai-l2", "title": "Vector Search", "duration": "42:15", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", "preview": True},
                    {"id": "ai-l3", "title": "Production RAG Pipelines", "duration": "58:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", "preview": False}
                ]
            }
        ],
        "reviews": [
            {"id": "ai-r1", "name": "Marcus V.", "rating": 5, "comment": "Very practical and implementation focused.", "date": "5 days ago"}
        ]
    },
    {
        "id": "ui-ux-design-system",
        "title": "UI/UX & Design Systems Masterclass",
        "subtitle": "Create scalable design systems and high-converting product interfaces.",
        "category": "Design",
        "level": "All Levels",
        "rating": 4.88,
        "reviewsCount": 640,
        "studentsCount": 6120,
        "price": 69,
        "originalPrice": 149,
        "isBestseller": False,
        "thumbnail": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
        "instructor": {
            "name": "Sophia Lin",
            "title": "Lead Product Designer",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
            "bio": "Product designer with expertise in systems, prototyping and design operations."
        },
        "duration": "28 Hours",
        "lessonsCount": 5,
        "updatedDate": "August 2026",
        "tags": ["Figma", "UI/UX", "Design Systems"],
        "whatYouWillLearn": [
            "Design scalable UI patterns",
            "Build design systems with tokens",
            "Prototype and handoff interfaces"
        ],
        "curriculum": [
            {
                "sectionTitle": "Design Systems Essentials",
                "duration": "2 lessons • 1h 40m",
                "lessons": [
                    {"id": "ui-l1", "title": "Design Tokens", "duration": "32:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "preview": True},
                    {"id": "ui-l2", "title": "Component Library Design", "duration": "45:10", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "preview": True}
                ]
            }
        ],
        "reviews": [
            {"id": "ui-r1", "name": "Chloe T.", "rating": 5, "comment": "Very clean and practical for real product teams.", "date": "2 weeks ago"}
        ]
    }
]


def insert_manual_courses(force: bool = False):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if force:
            db.query(Review).delete()
            db.query(Lesson).delete()
            db.query(Section).delete()
            db.query(Course).delete()
            db.query(Instructor).delete()
            db.query(User).delete()
            db.commit()

        for c_data in SAMPLE_COURSES:
            if db.query(Course).filter(Course.id == c_data["id"]).first():
                print(f"Course already exists: {c_data['id']}")
                continue

            instructor_data = c_data["instructor"]
            instructor = Instructor(
                name=instructor_data["name"],
                title=instructor_data["title"],
                avatar=instructor_data["avatar"],
                bio=instructor_data["bio"],
            )
            db.add(instructor)
            db.flush()

            course = Course(
                id=c_data["id"],
                title=c_data["title"],
                subtitle=c_data["subtitle"],
                category=c_data["category"],
                level=c_data["level"],
                rating=c_data["rating"],
                reviews_count=c_data["reviewsCount"],
                students_count=c_data["studentsCount"],
                price=c_data["price"],
                original_price=c_data["originalPrice"],
                is_bestseller=c_data["isBestseller"],
                thumbnail=c_data["thumbnail"],
                instructor_id=instructor.id,
                duration=c_data["duration"],
                lessons_count=c_data["lessonsCount"],
                updated_date=c_data["updatedDate"],
                tags=c_data["tags"],
                what_you_will_learn=c_data["whatYouWillLearn"],
            )
            db.add(course)
            db.flush()

            total_lessons = 0
            for section_index, sec_data in enumerate(c_data.get("curriculum", [])):
                section = Section(
                    course_id=course.id,
                    section_title=sec_data["sectionTitle"],
                    duration=sec_data["duration"],
                    order_index=section_index,
                )
                db.add(section)
                db.flush()

                for lesson_index, lesson_data in enumerate(sec_data.get("lessons", [])):
                    lesson = Lesson(
                        id=lesson_data["id"],
                        section_id=section.id,
                        title=lesson_data["title"],
                        duration=lesson_data["duration"],
                        video_url=lesson_data["videoUrl"],
                        is_preview=lesson_data.get("preview", False),
                        order_index=lesson_index,
                    )
                    db.add(lesson)
                    total_lessons += 1

            course.lessons_count = total_lessons

            for review_data in c_data.get("reviews", []):
                review = Review(
                    course_id=course.id,
                    user_name=review_data["name"],
                    rating=review_data["rating"],
                    comment=review_data["comment"],
                    date=review_data["date"],
                )
                db.add(review)

        db.commit()
        print("Manual course seed complete.")

    except Exception as exc:
        db.rollback()
        raise exc
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Insert sample course data into the configured backend database.")
    parser.add_argument("--force", action="store_true", help="Delete existing course data before inserting sample data.")
    args = parser.parse_args()
    insert_manual_courses(force=args.force)
