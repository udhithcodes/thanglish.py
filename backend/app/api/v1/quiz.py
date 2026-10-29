from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.quiz import QuizAttempt
from app.schemas.quiz import QuizStartRequest, QuizSubmitRequest, QuizResultResponse
from app.schemas.question import QuestionDetailResponse
from app.services.quiz_service import create_quiz_session, submit_quiz_attempt

router = APIRouter(prefix="/quiz", tags=["Quizzes"])

@router.post("/start", response_model=List[QuestionDetailResponse])
def start_quiz(
    req: QuizStartRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Generates a randomized quiz set based on selected level, topic, and count."""
    user_id = current_user.id if current_user else None
    return create_quiz_session(db, req, user_id=user_id)

@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz(
    req: QuizSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submits a completed quiz for scoring, records attempt, and returns results."""
    return submit_quiz_attempt(db, req, user=current_user)

@router.get("/history")
def get_quiz_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns past quiz attempts for the authenticated student."""
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == current_user.id
    ).order_by(QuizAttempt.created_at.desc()).limit(20).all()

    return [
        {
            "id": a.id,
            "level": a.level,
            "mode": a.mode,
            "total_questions": a.total_questions,
            "score": a.score,
            "accuracy": a.accuracy,
            "time_taken_seconds": a.time_taken_seconds,
            "created_at": a.created_at.isoformat()
        }
        for a in attempts
    ]
