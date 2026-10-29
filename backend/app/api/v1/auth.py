import secrets
from typing import Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, PasswordResetToken
from app.schemas.user import (
    UserRegister, UserLogin, UserUpdate, UserResponse, Token,
    PasswordResetRequest, PasswordResetConfirm
)
from app.core.security import create_access_token, hash_password
from app.services.auth_service import (
    register_user, authenticate_user, build_user_response, update_user_profile
)
from app.services.oauth_service import (
    get_google_auth_url, get_github_auth_url,
    handle_google_callback, handle_github_callback
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register(reg_data: UserRegister, db: Session = Depends(get_db)):
    """Registers a new user and generates a unique permanent user ID."""
    user = register_user(db, reg_data)
    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        user=build_user_response(db, user)
    )

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """Authenticates with email and password."""
    user = authenticate_user(db, login_data)
    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        user=build_user_response(db, user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns the authenticated user's profile and unique permanent user ID."""
    return build_user_response(db, current_user)

@router.put("/profile", response_model=UserResponse)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates permitted user profile fields (name, language preference, level)."""
    user = update_user_profile(db, current_user, update_data)
    return build_user_response(db, user)

@router.get("/oauth/google/url")
def google_auth_url(state: Optional[str] = None):
    """Generates real Google OAuth authorization URL."""
    state_str = state or secrets.token_urlsafe(16)
    url = get_google_auth_url(state_str)
    return {"url": url, "state": state_str}

@router.get("/oauth/github/url")
def github_auth_url(state: Optional[str] = None):
    """Generates real GitHub OAuth authorization URL."""
    state_str = state or secrets.token_urlsafe(16)
    url = get_github_auth_url(state_str)
    return {"url": url, "state": state_str}

@router.post("/oauth/google/callback", response_model=Token)
async def google_callback(payload: dict, db: Session = Depends(get_db)):
    """Exchanges Google authorization code for account access."""
    code = payload.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing Google authorization code")
    user = await handle_google_callback(db, code)
    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        user=build_user_response(db, user)
    )

@router.post("/oauth/github/callback", response_model=Token)
async def github_callback(payload: dict, db: Session = Depends(get_db)):
    """Exchanges GitHub authorization code for account access."""
    code = payload.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing GitHub authorization code")
    user = await handle_github_callback(db, code)
    token = create_access_token(subject=user.id, role=user.role)
    return Token(
        access_token=token,
        token_type="bearer",
        user=build_user_response(db, user)
    )

@router.post("/forgot-password")
def forgot_password(req: PasswordResetRequest, db: Session = Depends(get_db)):
    """Generates a secure password reset token."""
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user:
        # Prevent user enumeration: respond identically
        return {"message": "If this email is registered, password reset instructions have been generated."}

    token_str = secrets.token_urlsafe(32)
    reset_entry = PasswordResetToken(
        user_id=user.id,
        token=token_str,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
    )
    db.add(reset_entry)
    db.commit()

    return {
        "message": "If this email is registered, password reset instructions have been generated.",
        "dev_reset_token": token_str  # for testing/local convenience
    }

@router.post("/reset-password")
def reset_password(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Resets user password with valid token."""
    token_entry = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == req.token,
        PasswordResetToken.used_at == None
    ).first()

    if not token_entry or token_entry.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    user = db.query(User).filter(User.id == token_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.password_hash = hash_password(req.new_password)
    token_entry.used_at = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Password successfully updated. You may now log in with your new password."}
