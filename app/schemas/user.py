from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    email: str
    full_name: str
    is_tutor: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserInDBBase(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

class UserInDB(UserInDBBase):
    hashed_password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    is_tutor: Optional[bool] = None
    
    class Config:
        from_attributes = True

# class UserWithNotes(User):
#     notes: List["Note"] = []

# class UserWithTutoringSessions(User):
#     tutoring_sessions: List["TutoringSession"] = []

# # To avoid circular imports, use:
# from app.schemas.note import Note
# from app.schemas.tutoring_session import TutoringSession
# UserWithNotes.update_forward_refs()
# UserWithTutoringSessions.update_forward_refs()