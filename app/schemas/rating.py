from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional


class RatingBase(BaseModel):
    score: float

class RatingCreate(RatingBase):
    note_id: Optional[int] = None
    tutoring_session_id: Optional[int] = None

class Rating(RatingBase):
    id: int
    user_id: int
    note_id: Optional[int] = None
    tutoring_session_id: Optional[int] = None

    class Config:
        from_attributes = True