from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=128)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=128)
    preferred_language: Optional[str] = None
    current_level: Optional[str] = None
    profile_picture: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    user_id: str
    full_name: str
    email: EmailStr
    profile_picture: Optional[str] = None
    preferred_language: str
    current_level: str
    role: str
    is_active: bool
    created_at: datetime
    auth_providers: List[str] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6, max_length=128)
