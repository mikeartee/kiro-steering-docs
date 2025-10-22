---
title: "FastAPI Patterns"
description: "Guides Kiro to write FastAPI applications following best practices and modern async patterns"
category: "frameworks"
tags: ["fastapi", "python", "api", "async", "pydantic"]
version: "1.0.0"
---

## Core Principle

**Kiro writes clean, maintainable FastAPI applications using async patterns, Pydantic models, and dependency injection.** This steering document ensures APIs are well-structured, type-safe, and follow FastAPI conventions.

## How Kiro Will Write FastAPI Applications

### Project Structure

**Organized application layout**: Modular structure with clear separation

```python
# Kiro will write:
# app/
#   __init__.py
#   main.py
#   config.py
#   dependencies.py
#   models/
#     __init__.py
#     user.py
#     post.py
#   schemas/
#     __init__.py
#     user.py
#     post.py
#   routers/
#     __init__.py
#     users.py
#     posts.py
#   services/
#     __init__.py
#     user_service.py
#     post_service.py
#   database.py

# Not:
# app.py
# models.py
# everything_in_one_file.py
```

### Pydantic Models (Schemas)

**Type-safe data validation**: Clear schema definitions

```python
# Kiro will write:
# schemas/user.py
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """Base user schema with common fields."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: Optional[str] = Field(None, max_length=100)
    is_active: bool = True

    @validator('username')
    def username_alphanumeric(cls, v):
        """Validate username is alphanumeric."""
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v


class UserCreate(UserBase):
    """Schema for creating a user."""
    password: str = Field(..., min_length=8, max_length=100)

    @validator('password')
    def password_strength(cls, v):
        """Validate password strength."""
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserUpdate(BaseModel):
    """Schema for updating a user."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, max_length=100)
    is_active: Optional[bool] = None


class UserInDB(UserBase):
    """Schema for user in database."""
    id: int
    hashed_password: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserResponse(UserBase):
    """Schema for user response (without sensitive data)."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


# Not:
class User(BaseModel):
    email: str
    username: str
    password: str
    # No validation, no separation of concerns
```

### Router Organization

**Modular routes**: Separate routers by resource

```python
# Kiro will write:
# routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from sqlalchemy.orm import Session

from ..schemas.user import UserCreate, UserUpdate, UserResponse
from ..services.user_service import UserService
from ..dependencies import get_db, get_current_user
from ..models.user import User

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[UserResponse])
async def get_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of users with pagination."""
    user_service = UserService(db)
    users = await user_service.get_users(skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user by ID."""
    user_service = UserService(db)
    user = await user_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    return user


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Create new user."""
    user_service = UserService(db)
    
    # Check if user already exists
    existing_user = await user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    user = await user_service.create_user(user_data)
    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user"
        )
    
    user_service = UserService(db)
    user = await user_service.update_user(user_id, user_data)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete user."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user"
        )
    
    user_service = UserService(db)
    success = await user_service.delete_user(user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )

# Not:
@app.get("/users")
def get_users():
    users = db.query(User).all()
    return users
```

### Dependency Injection

**Reusable dependencies**: Database sessions, authentication, etc.

```python
# Kiro will write:
# dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import Optional

from .database import SessionLocal
from .config import settings
from .models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_db():
    """Database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


def require_admin(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """Require admin role."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# Not:
@app.get("/users")
def get_users(token: str):
    user = verify_token(token)
    if not user:
        return {"error": "Unauthorized"}
    # Repeated auth logic in every endpoint
```

### Service Layer

**Business logic separation**: Services handle data operations

```python
# Kiro will write:
# services/user_service.py
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional, List
from passlib.context import CryptContext

from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    """Service for user operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_users(self, skip: int = 0, limit: int = 10) -> List[User]:
        """Get list of users."""
        return self.db.query(User).offset(skip).limit(limit).all()
    
    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    async def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return self.db.query(User).filter(User.username == username).first()
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create new user."""
        hashed_password = pwd_context.hash(user_data.password)
        
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            is_active=user_data.is_active
        )
        
        try:
            self.db.add(db_user)
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("User with this email or username already exists")
    
    async def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user."""
        db_user = await self.get_user_by_id(user_id)
        if not db_user:
            return None
        
        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        try:
            self.db.commit()
            self.db.refresh(db_user)
            return db_user
        except IntegrityError:
            self.db.rollback()
            raise ValueError("Update failed due to constraint violation")
    
    async def delete_user(self, user_id: int) -> bool:
        """Delete user."""
        db_user = await self.get_user_by_id(user_id)
        if not db_user:
            return False
        
        self.db.delete(db_user)
        self.db.commit()
        return True
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password."""
        return pwd_context.verify(plain_password, hashed_password)

# Not:
@app.post("/users")
def create_user(user: UserCreate):
    hashed = hash_password(user.password)
    db_user = User(email=user.email, password=hashed)
    db.add(db_user)
    db.commit()
    return db_user
```

### Application Setup

**Main application configuration**: Proper app initialization

```python
# Kiro will write:
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .routers import users, posts, auth
from .config import settings
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for managing users and posts",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(posts.router, prefix="/api/posts", tags=["posts"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to the API",
        "docs": "/api/docs",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Not:
app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello"}

@app.get("/users")
def get_users():
    return []
```

### Configuration Management

**Environment-based settings**: Pydantic settings

```python
# Kiro will write:
# config.py
from pydantic import BaseSettings, PostgresDsn, validator
from typing import List, Optional

class Settings(BaseSettings):
    """Application settings."""
    
    # Project
    PROJECT_NAME: str = "FastAPI Application"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: PostgresDsn
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        """Parse CORS origins."""
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    # Redis (optional)
    REDIS_URL: Optional[str] = None
    
    # Email (optional)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Not:
import os

SECRET_KEY = os.getenv("SECRET_KEY", "default-secret")
DATABASE_URL = os.getenv("DATABASE_URL")
# Scattered configuration
```

### Error Handling

**Custom exception handlers**: Consistent error responses

```python
# Kiro will write:
# main.py (add to app setup)
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import IntegrityError

class AppException(Exception):
    """Base application exception."""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    """Handle application exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "path": request.url.path
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation error",
            "errors": exc.errors(),
            "path": request.url.path
        }
    )


@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, exc: IntegrityError):
    """Handle database integrity errors."""
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "success": False,
            "message": "Database constraint violation",
            "path": request.url.path
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "Internal server error",
            "path": request.url.path
        }
    )

# Not:
@app.get("/users/{user_id}")
def get_user(user_id: int):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except Exception as e:
        return {"error": str(e)}
```

### Background Tasks

**Async background tasks**: Non-blocking operations

```python
# Kiro will write:
from fastapi import BackgroundTasks
from typing import List

async def send_welcome_email(email: str, username: str):
    """Send welcome email to new user."""
    # Email sending logic here
    print(f"Sending welcome email to {email}")


async def process_batch_data(data: List[dict]):
    """Process batch data in background."""
    for item in data:
        # Processing logic
        print(f"Processing item: {item}")


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create new user with background email."""
    user_service = UserService(db)
    user = await user_service.create_user(user_data)
    
    # Add background task
    background_tasks.add_task(
        send_welcome_email,
        email=user.email,
        username=user.username
    )
    
    return user

# Not:
@app.post("/users")
def create_user(user: UserCreate):
    db_user = create_user_in_db(user)
    send_email(user.email)  # Blocking operation
    return db_user
```

## What This Prevents

- **Type errors** from missing Pydantic validation
- **Security vulnerabilities** from improper authentication
- **Performance issues** from blocking operations
- **Code duplication** from not using dependency injection
- **Inconsistent responses** from poor error handling
- **Difficult testing** from tightly coupled code

## Simple Examples

### Before/After: Complete Endpoint

```python
# Before:
@app.post("/users")
def create_user(email: str, password: str, username: str):
    if not email or not password:
        return {"error": "Missing fields"}
    
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return {"error": "Email exists"}
    
    hashed = hash_password(password)
    user = User(email=email, password=hashed, username=username)
    db.add(user)
    db.commit()
    return {"id": user.id, "email": user.email}

# After:
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create new user."""
    user_service = UserService(db)
    
    existing_user = await user_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    user = await user_service.create_user(user_data)
    
    background_tasks.add_task(
        send_welcome_email,
        email=user.email,
        username=user.username
    )
    
    return user
```

## Customization

This is a starting point for FastAPI patterns. You can customize by:

- Adding different database backends (MongoDB, PostgreSQL)
- Including caching strategies (Redis)
- Adding WebSocket support
- Incorporating background job queues (Celery, RQ)

## Related Documents

- [Python Formatting](../../code-formatting/python-formatting.md) - Python conventions
- [API Development Patterns](../../workflows/api-development-patterns.md) - API conventions

## Optional: Validation with External Tools

Want to enforce these patterns automatically? Consider these tools:

### FastAPI Development Tools (Optional)

```bash
# Testing
pip install pytest pytest-asyncio httpx

# Code quality
pip install pylint mypy

# Database
pip install sqlalchemy alembic

# Authentication
pip install python-jose passlib python-multipart
```

**Note**: These tools help enforce patterns but aren't required for the steering document to work.
