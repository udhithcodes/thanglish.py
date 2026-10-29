from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.quiz import ProgressSummaryResponse
from app.services.progress_service import get_user_dashboard_progress

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.get("", response_model=ProgressSummaryResponse)
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves real learning metrics, accuracy, topics progress, and tailored recommendations."""
    return get_user_dashboard_progress(db, current_user)
