import sys
import os
from sqlalchemy.orm import Session

# Ensure backend package is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import settings
from backend.database import Base, engine, SessionLocal
from backend.models import User, Instructor, Course, Section, Lesson, Review, Enrollment, Progress, LessonNote, Certificate
from backend.auth import hash_password

INITIAL_COURSES = [
  {
    "id": "fullstack-mastery",
    "title": "Fullstack Web Development Bootcamp 2026",
    "subtitle": "Master React 19, Next.js 15, Node.js, TypeScript & PostgreSQL with production microservices.",
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
      "title": "Senior Principal Engineer & Ex-Google Staff",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      "bio": "12+ years building enterprise applications. Trained over 100,000 developers worldwide."
    },
    "duration": "42 Hours",
    "lessonsCount": 86,
    "updatedDate": "August 2026",
    "tags": ["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
    "whatYouWillLearn": [
      "Build scalable fullstack web applications from scratch",
      "Master modern state management, Zustand & Server Actions",
      "Deploy apps with Docker, Kubernetes & AWS CI/CD pipelines",
      "Implement Secure Authentication, OAuth2 & Payment Gateway (Stripe)",
      "Database schema design with Prisma ORM & PostgreSQL performance tuning"
    ],
    "curriculum": [
      {
        "sectionTitle": "Section 1: Modern JavaScript & TypeScript Foundations",
        "duration": "6 lessons • 3h 15m",
        "lessons": [
          { "id": "l1", "title": "Course Introduction & Setup", "duration": "12:45", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "preview": True },
          { "id": "l2", "title": "Deep Dive into Modern ES2026 Async/Await", "duration": "24:10", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "preview": True },
          { "id": "l3", "title": "TypeScript Generics & Utility Types", "duration": "38:50", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "preview": False }
        ]
      },
      {
        "sectionTitle": "Section 2: React 19 Core & Server Components",
        "duration": "10 lessons • 8h 40m",
        "lessons": [
          { "id": "l4", "title": "Understanding React Server Components Architecture", "duration": "45:20", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", "preview": True },
          { "id": "l5", "title": "Building Responsive UI with CSS Modules & Tailwind", "duration": "30:15", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", "preview": False },
          { "id": "l6", "title": "Form Management & Server Actions with Zod", "duration": "42:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4", "preview": False }
        ]
      },
      {
        "sectionTitle": "Section 3: Backend API & Microservices with Node.js",
        "duration": "14 lessons • 12h 10m",
        "lessons": [
          { "id": "l7", "title": "Designing RESTful & GraphQL Microservices", "duration": "55:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4", "preview": False },
          { "id": "l8", "title": "PostgreSQL Database Schema & Prisma Migrations", "duration": "40:30", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", "preview": False }
        ]
      }
    ],
    "reviews": [
      { "id": "r1", "name": "David K.", "rating": 5, "comment": "Hands down the best fullstack course I have ever taken. Got a software engineer job 2 months after completing!", "date": "3 days ago" },
      { "id": "r2", "name": "Sarah M.", "rating": 5, "comment": "The TypeScript and Prisma sections alone are worth 10x the price. Very clear explanation of complex topics.", "date": "1 week ago" }
    ]
  },
  {
    "id": "ai-engineering-mastery",
    "title": "AI Engineer & LLM Application Development",
    "subtitle": "Build Agentic AI workflows with LangChain, LlamaIndex, OpenAI, Anthropic Claude & Vector DBs.",
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
      "title": "AI Researcher & Founder of NeuralMind AI",
      "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      "bio": "Ex-OpenAI contributor specializing in autonomous AI agents and Retrieval-Augmented Generation."
    },
    "duration": "34 Hours",
    "lessonsCount": 64,
    "updatedDate": "July 2026",
    "tags": ["Python", "LangChain", "RAG", "Pinecone", "Claude 3.5"],
    "whatYouWillLearn": [
      "Design and deploy production-ready Retrieval-Augmented Generation (RAG) systems",
      "Build multi-agent AI assistants using LangGraph and CrewAI",
      "Fine-tune Open Source Models (Llama 3, Mistral) on custom datasets",
      "Implement vector databases (Pinecone, Qdrant, ChromaDB)",
      "Optimize token costs, latency, and streaming UI responses"
    ],
    "curriculum": [
      {
        "sectionTitle": "Section 1: RAG & Vector Search Essentials",
        "duration": "8 lessons • 6h 30m",
        "lessons": [
          { "id": "ai-l1", "title": "Introduction to Embeddings & Vector Stores", "duration": "25:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackBranding.mp4", "preview": True },
          { "id": "ai-l2", "title": "Building RAG Pipelines with LlamaIndex & Hybrid Search", "duration": "42:15", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", "preview": True }
        ]
      },
      {
        "sectionTitle": "Section 2: Autonomous AI Agents & Function Calling",
        "duration": "12 lessons • 10h 15m",
        "lessons": [
          { "id": "ai-l3", "title": "LangGraph Stateful Agent Architecture", "duration": "58:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", "preview": False },
          { "id": "ai-l4", "title": "Multi-Agent System Collaboration & Tool Execution", "duration": "48:30", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4", "preview": False }
        ]
      }
    ],
    "reviews": [
      { "id": "ai-r1", "name": "Marcus V.", "rating": 5, "comment": "This is the most practical AI engineering course available. Built our company's RAG system right after section 1!", "date": "5 days ago" }
    ]
  },
  {
    "id": "ui-ux-design-system",
    "title": "UI/UX & Design Systems Masterclass",
    "subtitle": "Create high-converting Figma component libraries, auto-layout 5.0, tokens & micro-interactions.",
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
      "title": "Lead Product Designer at Stripe",
      "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      "bio": "Award-winning UI/UX designer. Creator of open-source design systems used by over 50k designers."
    },
    "duration": "28 Hours",
    "lessonsCount": 52,
    "updatedDate": "August 2026",
    "tags": ["Figma", "UI/UX", "Design Systems", "Prototyping", "Variables"],
    "whatYouWillLearn": [
      "Master Figma Auto-Layout 5.0, Variables & Design Tokens",
      "Build scalable UI component libraries with variant properties",
      "Conduct user research, journey mapping & usability testing",
      "Create interactive high-fidelity prototypes with smart animation",
      "Seamless design-to-code handoff for frontend developers"
    ],
    "curriculum": [
      {
        "sectionTitle": "Section 1: Modern Figma Mastery & Tokens",
        "duration": "5 lessons • 4h 00m",
        "lessons": [
          { "id": "ui-l1", "title": "Design System Architecture & Token Strategy", "duration": "32:00", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "preview": True },
          { "id": "ui-l2", "title": "Component Variables, Modes & Color Palettes", "duration": "45:10", "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "preview": True }
        ]
      }
    ],
    "reviews": [
      { "id": "ui-r1", "name": "Chloe T.", "rating": 5, "comment": "Transformed how our entire team builds Figma components. Clean, efficient, and super thorough.", "date": "2 weeks ago" }
    ]
  }
]

def seed_database(force_reseed: bool = False):
    if not settings.ALLOW_SEED:
        print("Seeding disabled. Set ALLOW_SEED=true in development only.")
        return

    print("Creating database tables (if not exists)...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # Optionally force a clean reseed by deleting all rows first
        if force_reseed:
            print("Force reseed: clearing existing data...")
            db.query(LessonNote).delete()
            db.query(Progress).delete()
            db.query(Enrollment).delete()
            db.query(Certificate).delete()
            db.query(Review).delete()
            db.query(Lesson).delete()
            db.query(Section).delete()
            db.query(Course).delete()
            db.query(Instructor).delete()
            db.query(User).delete()
            db.commit()

        # Check if already seeded
        existing_user = db.query(User).filter(User.email == settings.SEED_ADMIN_EMAIL).first()
        if existing_user and not force_reseed:
            print("Database already seeded — skipping.")
            return

        print("Creating default users...")
        admin_user = User(
            email=settings.SEED_ADMIN_EMAIL,
            password_hash=hash_password(settings.SEED_ADMIN_PASSWORD),
            full_name="Platform Administrator",
            role="admin"
        )
        student_user = User(
            email=settings.SEED_STUDENT_EMAIL,
            password_hash=hash_password(settings.SEED_STUDENT_PASSWORD),
            full_name="Alex Student",
            role="student"
        )
        db.add(admin_user)
        db.add(student_user)
        db.flush()

        print("Seeding courses, instructors, sections, lessons, and reviews...")
        for c_data in INITIAL_COURSES:
            # Skip if course already exists
            if db.query(Course).filter(Course.id == c_data["id"]).first():
                print(f"  Course '{c_data['id']}' already exists — skipping.")
                continue

            # Create instructor
            inst_data = c_data["instructor"]
            inst = Instructor(
                name=inst_data["name"],
                title=inst_data["title"],
                avatar=inst_data["avatar"],
                bio=inst_data["bio"]
            )
            db.add(inst)
            db.flush()

            # Create course
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
                instructor_id=inst.id,
                duration=c_data["duration"],
                lessons_count=c_data["lessonsCount"],
                updated_date=c_data["updatedDate"],
                tags=c_data["tags"],
                what_you_will_learn=c_data["whatYouWillLearn"]
            )
            db.add(course)
            db.flush()

            # Create sections & lessons
            total_l = 0
            for sec_idx, sec_data in enumerate(c_data.get("curriculum", [])):
                section = Section(
                    course_id=course.id,
                    section_title=sec_data["sectionTitle"],
                    duration=sec_data["duration"],
                    order_index=sec_idx
                )
                db.add(section)
                db.flush()

                for l_idx, l_data in enumerate(sec_data.get("lessons", [])):
                    lesson = Lesson(
                        id=l_data["id"],
                        section_id=section.id,
                        title=l_data["title"],
                        duration=l_data["duration"],
                        video_url=l_data["videoUrl"],
                        is_preview=l_data["preview"],
                        order_index=l_idx
                    )
                    db.add(lesson)
                    total_l += 1
            
            course.lessons_count = total_l

            # Create reviews
            for r_data in c_data.get("reviews", []):
                review = Review(
                    course_id=course.id,
                    user_name=r_data["name"],
                    rating=r_data["rating"],
                    comment=r_data["comment"],
                    date=r_data["date"]
                )
                db.add(review)

        # Seed sample enrollment, progress, and lesson notes for student_user
        if student_user and not db.query(Enrollment).filter(
            Enrollment.user_id == student_user.id,
            Enrollment.course_id == "fullstack-mastery"
        ).first():
            print("Seeding initial student enrollment & progress...")
            enrollment = Enrollment(
                user_id=student_user.id,
                course_id="fullstack-mastery",
                stripe_payment_id="tx_seed_initial",
                status="active"
            )
            db.add(enrollment)

            progress1 = Progress(
                user_id=student_user.id,
                course_id="fullstack-mastery",
                lesson_id="l1",
                completed=True
            )
            progress2 = Progress(
                user_id=student_user.id,
                course_id="fullstack-mastery",
                lesson_id="l2",
                completed=True
            )
            db.add(progress1)
            db.add(progress2)

            note = LessonNote(
                user_id=student_user.id,
                course_id="fullstack-mastery",
                lesson_id="l1",
                note_text="Remember to check modern ES2026 async/await pattern for backend promises."
            )
            db.add(note)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    import os
    force = os.environ.get("FORCE_RESEED", "").lower() in ("1", "true", "yes")
    seed_database(force_reseed=force)
