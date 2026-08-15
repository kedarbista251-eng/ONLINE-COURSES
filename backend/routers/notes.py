from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import LessonNote, User
from backend.schemas import NoteSaveRequest, NoteResponse
from backend.auth import get_current_user

router = APIRouter(prefix="/notes", tags=["Notes"])

@router.get("/{course_id}/{lesson_id}", response_model=Optional[NoteResponse])
def get_lesson_note(course_id: str, lesson_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(LessonNote).filter(
        LessonNote.user_id == current_user.id,
        LessonNote.course_id == course_id,
        LessonNote.lesson_id == lesson_id
    ).first()
    return note


@router.get("/user/all", response_model=List[NoteResponse])
def get_user_notes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(LessonNote).filter(LessonNote.user_id == current_user.id).order_by(LessonNote.updated_at.desc()).all()


@router.post("/save", response_model=NoteResponse)
def save_lesson_note(data: NoteSaveRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(LessonNote).filter(
        LessonNote.user_id == current_user.id,
        LessonNote.course_id == data.course_id,
        LessonNote.lesson_id == data.lesson_id
    ).first()

    if note:
        note.note_text = data.note_text
    else:
        note = LessonNote(
            user_id=current_user.id,
            course_id=data.course_id,
            lesson_id=data.lesson_id,
            note_text=data.note_text
        )
        db.add(note)

    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lesson_note(note_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(LessonNote).filter(
        LessonNote.id == note_id,
        LessonNote.user_id == current_user.id
    ).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return None
