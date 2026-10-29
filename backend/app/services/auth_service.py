import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.user import User, AuthIdentity
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserRegister, UserLogin, UserUpdate, UserResponse

def generate_next_user_id(db: Session) -> str:
    """
    Generates a guaranteed unique permanent public user ID (e.g. USR-000001).
    Uses the count of existing users or max numeric suffix, guaranteed by unique constraint.
    """
    count = db.query(func.count(User.id)).scalar() or 0
    candidate_num = count + 1
    while True:
        candidate_id = f"USR-{candidate_num:06d}"
        exists = db.query(User).filter(User.user_id == candidate_id).first()
        if not exists:
            return candidate_id
        candidate_num += 1

def register_user(db: Session, reg_data: UserRegister) -> User:
    """Registers a new user with email and password."""
    # Check if email already registered
    existing_user = db.query(User).filter(User.email == reg_data.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please log in."
        )

    public_user_id = generate_next_user_id(db)
    pwd_hash = hash_password(reg_data.password)

    new_user = User(
        id=str(uuid.uuid4()),
        user_id=public_user_id,
        full_name=reg_data.full_name.strip(),
        email=reg_data.email.lower().strip(),
        password_hash=pwd_hash,
        role="student",
        is_active=True,
    )
    db.add(new_user)
    db.flush()

    # Create primary auth identity
    identity = AuthIdentity(
        user_id=new_user.id,
        provider="email",
        provider_user_id=new_user.email,
        provider_email=new_user.email,
    )
    db.add(identity)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, login_data: UserLogin) -> User:
    """Validates email/password credentials."""
    user = db.query(User).filter(User.email == login_data.email.lower().strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    if not user.password_hash or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated."
        )
    return user

def build_user_response(db: Session, user: User) -> UserResponse:
    """Constructs UserResponse with active auth providers list."""
    identities = db.query(AuthIdentity.provider).filter(AuthIdentity.user_id == user.id).all()
    providers = list(set([i[0] for i in identities]))
    
    return UserResponse(
        id=user.id,
        user_id=user.user_id,
        full_name=user.full_name,
        email=user.email,
        profile_picture=user.profile_picture,
        preferred_language=user.preferred_language,
        current_level=user.current_level,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        auth_providers=providers
    )

def update_user_profile(db: Session, user: User, update_data: UserUpdate) -> User:
    """Updates permitted user profile fields (preserves permanent user_id and email)."""
    if update_data.full_name is not None:
        user.full_name = update_data.full_name.strip()
    if update_data.preferred_language is not None:
        user.preferred_language = update_data.preferred_language
    if update_data.current_level is not None:
        user.current_level = update_data.current_level
    if update_data.profile_picture is not None:
        user.profile_picture = update_data.profile_picture

    db.commit()
    db.refresh(user)
    return user
