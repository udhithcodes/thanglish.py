import uuid
import httpx
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.core.config import settings
from app.models.user import User, AuthIdentity
from app.services.auth_service import generate_next_user_id

# Google OAuth Constants
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"

# GitHub OAuth Constants
GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"

def get_google_auth_url(state: str) -> str:
    """Returns Google OAuth authorization URL."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend .env."
        )
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "state": state,
        "prompt": "select_account"
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{GOOGLE_AUTH_URL}?{query}"

def get_github_auth_url(state: str) -> str:
    """Returns GitHub OAuth authorization URL."""
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub OAuth is not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in backend .env."
        )
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "scope": "read:user user:email",
        "state": state,
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{GITHUB_AUTH_URL}?{query}"

async def handle_google_callback(db: Session, code: str) -> User:
    """Exchanges Google authorization code for token and retrieves profile."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Google OAuth credentials are not configured on the backend."
        )

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
        if token_resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to exchange Google OAuth code: {token_resp.text}"
            )
        tokens = token_resp.json()
        access_token = tokens.get("access_token")

        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if userinfo_resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve Google user profile."
            )
        user_info = userinfo_resp.json()

    google_sub = user_info.get("sub")
    email = user_info.get("email")
    email_verified = user_info.get("email_verified", False)
    name = user_info.get("name") or "Google User"
    picture = user_info.get("picture")

    if not email or not email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account must have a verified email address."
        )

    return get_or_create_oauth_user(
        db=db,
        provider="google",
        provider_user_id=google_sub,
        email=email.lower().strip(),
        full_name=name,
        profile_picture=picture
    )

async def handle_github_callback(db: Session, code: str) -> User:
    """Exchanges GitHub authorization code for token and retrieves profile."""
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="GitHub OAuth credentials are not configured on the backend."
        )

    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            GITHUB_TOKEN_URL,
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
        if token_resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to exchange GitHub OAuth code: {token_resp.text}"
            )
        tokens = token_resp.json()
        access_token = tokens.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No access token received from GitHub."
            )

        user_resp = await client.get(
            GITHUB_USER_URL,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        if user_resp.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to retrieve GitHub user profile."
            )
        gh_user = user_resp.json()

        # Fetch verified primary email
        email = gh_user.get("email")
        if not email:
            emails_resp = await client.get(
                GITHUB_EMAILS_URL,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )
            if emails_resp.status_code == 200:
                for em in emails_resp.json():
                    if em.get("primary") and em.get("verified"):
                        email = em.get("email")
                        break

    github_id = str(gh_user.get("id"))
    name = gh_user.get("name") or gh_user.get("login") or "GitHub User"
    avatar = gh_user.get("avatar_url")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not retrieve a verified primary email from your GitHub account."
        )

    return get_or_create_oauth_user(
        db=db,
        provider="github",
        provider_user_id=github_id,
        email=email.lower().strip(),
        full_name=name,
        profile_picture=avatar
    )

def get_or_create_oauth_user(
    db: Session,
    provider: str,
    provider_user_id: str,
    email: str,
    full_name: str,
    profile_picture: Optional[str] = None
) -> User:
    """
    Finds existing identity, or links identity to verified user, or registers new user.
    Guarantees permanent User ID consistency.
    """
    # 1. Check if identity already exists
    identity = db.query(AuthIdentity).filter(
        AuthIdentity.provider == provider,
        AuthIdentity.provider_user_id == provider_user_id
    ).first()

    if identity:
        user = db.query(User).filter(User.id == identity.user_id).first()
        if user and not user.profile_picture and profile_picture:
            user.profile_picture = profile_picture
            db.commit()
        return user

    # 2. Check if user with same verified email exists (Account Linking)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        new_identity = AuthIdentity(
            user_id=existing_user.id,
            provider=provider,
            provider_user_id=provider_user_id,
            provider_email=email
        )
        if not existing_user.profile_picture and profile_picture:
            existing_user.profile_picture = profile_picture
        db.add(new_identity)
        db.commit()
        db.refresh(existing_user)
        return existing_user

    # 3. New User Registration via OAuth
    public_user_id = generate_next_user_id(db)
    new_user = User(
        id=str(uuid.uuid4()),
        user_id=public_user_id,
        full_name=full_name,
        email=email,
        password_hash=None,  # OAuth only
        profile_picture=profile_picture,
        role="student",
        is_active=True
    )
    db.add(new_user)
    db.flush()

    new_identity = AuthIdentity(
        user_id=new_user.id,
        provider=provider,
        provider_user_id=provider_user_id,
        provider_email=email
    )
    db.add(new_identity)
    db.commit()
    db.refresh(new_user)
    return new_user
