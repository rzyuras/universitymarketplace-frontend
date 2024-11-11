from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_tutor = Column(Boolean, default=False)

    # Relationships
    notes = relationship("Note", back_populates="owner")
    # Split tutoring sessions into two relationships
    tutoring_sessions_as_tutor = relationship(
        "TutoringSession", 
        back_populates="tutor",
        foreign_keys="TutoringSession.tutor_id"
    )
    tutoring_sessions_as_student = relationship(
        "TutoringSession", 
        back_populates="student",
        foreign_keys="TutoringSession.student_id"
    )
    comments = relationship("Comment", back_populates="user")
    ratings = relationship("Rating", back_populates="user")

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    file_path = Column(String)
    course = Column(String, index=True)
    upload_date = Column(DateTime)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="notes")
    comments = relationship("Comment", back_populates="note")
    ratings = relationship("Rating", back_populates="note")

class TutoringSession(Base):
    __tablename__ = "tutoring_sessions"
    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("users.id"))
    student_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    course = Column(String, index=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    is_booked = Column(Boolean, default=False)
    
    # Updated relationships
    tutor = relationship(
        "User", 
        back_populates="tutoring_sessions_as_tutor",
        foreign_keys=[tutor_id]
    )
    student = relationship(
        "User", 
        back_populates="tutoring_sessions_as_student",
        foreign_keys=[student_id]
    )
    ratings = relationship("Rating", back_populates="tutoring_session")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    note_id = Column(Integer, ForeignKey("notes.id"))
    user = relationship("User", back_populates="comments")
    note = relationship("Note", back_populates="comments")

class Rating(Base):
    __tablename__ = "ratings"
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float)
    user_id = Column(Integer, ForeignKey("users.id"))
    note_id = Column(Integer, ForeignKey("notes.id"), nullable=True)
    tutoring_session_id = Column(Integer, ForeignKey("tutoring_sessions.id"), nullable=True)
    user = relationship("User", back_populates="ratings")
    note = relationship("Note", back_populates="ratings")
    tutoring_session = relationship("TutoringSession", back_populates="ratings")