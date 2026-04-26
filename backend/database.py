"""
Database engine configuration.

Supports both SQLite (local dev) and PostgreSQL+asyncpg (production).

The DATABASE_URL is read from env var MULTISOW_DATABASE_URL.
  - If it starts with "postgresql+asyncpg://", an async engine is created.
  - Otherwise falls back to sync SQLite for local development.

Consumers should import `SessionLocal` for sync code (startup seeding,
CRUD endpoints that still use `Session`) and `AsyncSessionLocal` for
new async endpoints.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Optional async support — only imported when asyncpg is available
try:
    from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
    HAS_ASYNC = True
except ImportError:
    HAS_ASYNC = False

DATABASE_URL = os.getenv(
    "MULTISOW_DATABASE_URL",
    "sqlite:///./sql_app.db",
)

# ---------------------------------------------------------------------------
# Sync engine (always available — used for table creation + legacy CRUD)
# ---------------------------------------------------------------------------
_sync_url = DATABASE_URL
# asyncpg URLs can't be used with the sync engine, swap to psycopg2
if _sync_url.startswith("postgresql+asyncpg://"):
    _sync_url = _sync_url.replace("postgresql+asyncpg://", "postgresql://", 1)

_connect_args = {"check_same_thread": False} if _sync_url.startswith("sqlite") else {}

engine = create_engine(_sync_url, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ---------------------------------------------------------------------------
# Async engine (only when asyncpg is installed + DATABASE_URL is postgres)
# ---------------------------------------------------------------------------
AsyncSessionLocal = None
async_engine = None

if HAS_ASYNC and DATABASE_URL.startswith("postgresql+asyncpg://"):
    async_engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal = sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
