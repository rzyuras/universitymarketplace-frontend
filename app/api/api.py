from fastapi import APIRouter
from app.api.endpoints import users, notes, tutoring_sessions, comments, ratings

api_router = APIRouter()

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(notes.router, prefix="/notes", tags=["notes"])
api_router.include_router(tutoring_sessions.router, prefix="/tutoring-sessions", tags=["tutoring sessions"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(ratings.router, prefix="/ratings", tags=["ratings"])