from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Use SQLite file instead of memory for persistence
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///./app.db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False}
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()