
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.models import Note
from app.schemas.note import NoteCreate, Note as NoteSchema
from typing import List
from datetime import datetime
import shutil
import os
from fastapi.responses import FileResponse

router = APIRouter()

UPLOAD_DIRECTORY = "uploads/notes"

@router.post("/", response_model=NoteSchema)
async def create_note(
    title: str,
    course: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    # Ensure upload directory exists
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    
    # Generate a unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{datetime.now().timestamp()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create note in database
    db_note = Note(
        title=title,
        course=course,
        file_path=file_path,
        upload_date=datetime.now()
    )
    db.add(db_note)
    await db.commit()
    await db.refresh(db_note)
    return db_note

@router.get("/", response_model=List[NoteSchema])
async def read_notes(
    skip: int = 0, 
    limit: int = 100, 
    course: str = None, 
    title: str = None, 
    db: AsyncSession = Depends(get_db)
):
    query = select(Note)
    if course:
        query = query.filter(Note.course == course)
    if title:
        query = query.filter(Note.title.ilike(f"%{title}%"))
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    notes = result.scalars().all()
    return notes

@router.get("/{note_id}", response_model=NoteSchema)
async def read_note(note_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.get("/{note_id}/download")
async def download_note(note_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Note).filter(Note.id == note_id))
    note = result.scalars().first()
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    return FileResponse(note.file_path, filename=f"{note.title}.pdf")