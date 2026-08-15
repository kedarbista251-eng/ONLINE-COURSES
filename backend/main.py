import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure root directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import Base, engine
from backend.routers import auth, courses, enrollments, progress, notes, certificates, admin
from backend.seed import seed_database

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Learni Learning Platform API",
    description="Production-ready FastAPI backend with database models, JWT auth, Stripe checkout, progress tracking, lesson notes, and certificate generation.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(courses.router, prefix="/api")
app.include_router(enrollments.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(notes.router, prefix="/api")
app.include_router(certificates.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.on_event("startup")
def startup_event():
    # Auto-seed database if empty
    from backend.database import SessionLocal
    from backend.models import Course
    db = SessionLocal()
    try:
        count = db.query(Course).count()
        if count == 0:
            print("Database empty on startup. Triggering initial seed...")
            seed_database()
    except Exception as e:
        print(f"Startup check warning: {e}")
    finally:
        db.close()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Learni Platform API"}
