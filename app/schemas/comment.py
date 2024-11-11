from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    note_id: int

class Comment(CommentBase):
    id: int
    user_id: int
    note_id: int

    class Config:
        from_attributes = True