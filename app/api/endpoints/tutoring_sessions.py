from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.models import TutoringSession
from app.schemas.tutoring_session import TutoringSessionCreate, TutoringSession as TutoringSessionSchema
from typing import List

router = APIRouter()

@router.post("/", response_model=TutoringSessionSchema)
async def create_tutoring_session(session: TutoringSessionCreate, db: AsyncSession = Depends(get_db)):
    db_session = TutoringSession(**session.dict())
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return db_session

@router.get("/", response_model=List[TutoringSessionSchema])
async def read_tutoring_sessions(skip: int = 0, limit: int = 100, course: str = None, db: AsyncSession = Depends(get_db)):
    query = select(TutoringSession)
    if course:
        query = query.filter(TutoringSession.course == course)
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    sessions = result.scalars().all()
    return sessions

@router.post("/{session_id}/book", response_model=TutoringSessionSchema)
async def book_tutoring_session(session_id: int, student_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TutoringSession).filter(TutoringSession.id == session_id))
    session = result.scalars().first()
    if session is None:
        raise HTTPException(status_code=404, detail="Tutoring session not found")
    if session.is_booked:
        raise HTTPException(status_code=400, detail="This session is already booked")
    session.student_id = student_id
    session.is_booked = True
    await db.commit()
    await db.refresh(session)
    return session