from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.models import Comment as CommentModel
from app.schemas.comment import CommentCreate, Comment as CommentSchema
from typing import List

router = APIRouter()

@router.post("/", response_model=CommentSchema)
async def create_comment(comment: CommentCreate, db: AsyncSession = Depends(get_db)):
    db_comment = CommentModel(**comment.dict())
    db.add(db_comment)
    await db.commit()
    await db.refresh(db_comment)
    return db_comment

@router.get("/", response_model=List[CommentSchema])
async def read_comments(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CommentModel).offset(skip).limit(limit))
    comments = result.scalars().all()
    return comments

@router.get("/{comment_id}", response_model=CommentSchema)
async def read_comment(comment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CommentModel).filter(CommentModel.id == comment_id))
    comment = result.scalars().first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    return comment

@router.delete("/{comment_id}", response_model=CommentSchema)
async def delete_comment(comment_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CommentModel).filter(CommentModel.id == comment_id))
    comment = result.scalars().first()
    if comment is None:
        raise HTTPException(status_code=404, detail="Comment not found")
    await db.delete(comment)
    await db.commit()
    return comment