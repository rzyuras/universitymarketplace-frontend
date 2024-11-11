from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class TutoringSessionBase(BaseModel):
    course: str
    start_time: datetime
    end_time: datetime

class TutoringSessionCreate(TutoringSessionBase):
    pass

class TutoringSession(TutoringSessionBase):
    id: int
    tutor_id: int
    student_id: Optional[int] = None
    is_booked: bool

    class Config:
        from_attributes = True
