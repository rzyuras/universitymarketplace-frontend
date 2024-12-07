from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.models import Rating as RatingModel
from app.schemas.rating import RatingCreate, Rating as RatingSchema
from typing import List

router = APIRouter()

@router.post("/", response_model=RatingSchema)
async def create_rating(rating: RatingCreate, db: AsyncSession = Depends(get_db)):
    db_rating = RatingModel(**rating.dict())
    db.add(db_rating)
    await db.commit()
    await db.refresh(db_rating)
    return db_rating

@router.get("/", response_model=List[RatingSchema])
async def read_ratings(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RatingModel).offset(skip).limit(limit))
    ratings = result.scalars().all()
    return ratings

@router.get("/{rating_id}", response_model=RatingSchema)
async def read_rating(rating_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RatingModel).filter(RatingModel.id == rating_id))
    rating = result.scalars().first()
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating

@router.put("/{rating_id}", response_model=RatingSchema)
async def update_rating(rating_id: int, rating: RatingCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RatingModel).filter(RatingModel.id == rating_id))
    db_rating = result.scalars().first()
    if db_rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")
    
    for key, value in rating.dict().items():
        setattr(db_rating, key, value)
    
    await db.commit()
    await db.refresh(db_rating)
    return db_rating

@router.delete("/{rating_id}", response_model=RatingSchema)
async def delete_rating(rating_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RatingModel).filter(RatingModel.id == rating_id))
    rating = result.scalars().first()
    if rating is None:
        raise HTTPException(status_code=404, detail="Rating not found")
    await db.delete(rating)
    await db.commit()
    return rating