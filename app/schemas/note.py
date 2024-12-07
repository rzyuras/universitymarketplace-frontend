from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class NoteBase(BaseModel):
    title: str
    course: str

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    file_path: str
    upload_date: datetime
    owner_id: int

    class Config:
        from_attributes = True