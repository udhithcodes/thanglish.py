from typing import List
from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.question import QuestionDetailResponse
from app.services.question_service import (
    toggle_bookmark, get_user_bookmarks, get_user_incorrect_questions
)

router = APIRouter(tags=["Bookmarks & Mistakes"])

@router.get("/bookmarks", response_model=List[QuestionDetailResponse])
def list_bookmarks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all questions saved/bookmarked by the student."""
    return get_user_bookmarks(db, current_user.id)

@router.post("/bookmarks/{question_id}")
def toggle_question_bookmark(
    question_id: int = Path(..., ge=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Toggles bookmark status on a question for the student."""
    bookmarked = toggle_bookmark(db, current_user.id, question_id)
    return {"question_id": question_id, "is_bookmarked": bookmarked}

@router.delete("/bookmarks/{question_id}")
def remove_question_bookmark(
    question_id: int = Path(..., ge=1),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Removes a bookmark for the student."""
    toggle_bookmark(db, current_user.id, question_id)
    return {"question_id": question_id, "is_bookmarked": False}
