from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from app.db.database import get_db
from app.models import models
from app.schemas import user
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

@router.post("/", response_model=user.User)
async def create_user(user_create: user.UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if user already exists
    result = await db.execute(
        select(models.User).filter(models.User.email == user_create.email)
    )
    db_user = result.scalar_one_or_none()
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user with hashed password
    db_user = models.User(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=get_password_hash(user_create.password),
        is_active=True,
        is_tutor=user_create.is_tutor
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    print("Created user:", {
        "id": db_user.id,
        "email": db_user.email,
        "full_name": db_user.full_name,
        "is_tutor": db_user.is_tutor,
        "is_active": db_user.is_active
    })

    return db_user

@router.get("/", response_model=list[user.User])
async def read_users(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    query = select(models.User).offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Explicitly create a list of dictionaries
    users_list = [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "is_tutor": user.is_tutor,
            "is_active": user.is_active
        } 
        for user in users
    ]
    print("Users:", users)
    return users_list


@router.get("/{user_id}", response_model=user.User)
async def read_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.User).filter(models.User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", response_model=user.User)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # First, check if the user exists
    result = await db.execute(
        select(models.User).filter(models.User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Store user data before deletion for return value
    user_data = {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "is_tutor": user.is_tutor,
        "is_active": user.is_active
    }
    
    # Delete the user
    await db.execute(
        delete(models.User).where(models.User.id == user_id)
    )
    await db.commit()
    
    print(f"Deleted user: {user_data}")
    return user_data

@router.put("/{user_id}", response_model=user.User)
async def update_user(
    user_id: int,
    user_update: user.UserUpdate,
    db: AsyncSession = Depends(get_db)
):
    # First, check if the user exists
    result = await db.execute(
        select(models.User).filter(models.User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Prepare update data
    update_data = user_update.dict(exclude_unset=True)
    
    # If password is being updated, hash it
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    if update_data:
        # Update the user
        await db.execute(
            update(models.User)
            .where(models.User.id == user_id)
            .values(**update_data)
        )
        await db.commit()
        
        # Fetch updated user
        result = await db.execute(
            select(models.User).filter(models.User.id == user_id)
        )
        updated_user = result.scalar_one()
        
        print(f"Updated user: {user_id}")
        return updated_user
    
    return user