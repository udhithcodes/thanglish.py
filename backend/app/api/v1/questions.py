from typing import List, Optional
from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user_optional, get_current_user
from app.models.user import User
from app.schemas.question import (
    TopicResponse, QuestionDetailResponse, AnswerSubmitRequest,
    AnswerFeedbackResponse, CodeRunRequest
)
from app.services.question_service import (
    get_all_topics, get_questions_list, get_question_by_id, evaluate_answer,
    get_user_incorrect_questions
)
from app.core.sandbox import execute_user_code

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.get("/topics", response_model=List[TopicResponse])
def list_topics(level: Optional[str] = None, db: Session = Depends(get_db)):
    """Retrieves all topics, optionally filtered by level (Beginner, Intermediate, Advanced)."""
    return get_all_topics(db, level=level)

@router.get("/incorrect", response_model=List[QuestionDetailResponse])
def list_incorrect_questions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves questions the student answered incorrectly, for targeted practice."""
    return get_user_incorrect_questions(db, current_user.id)

@router.get("", response_model=List[QuestionDetailResponse])
def list_questions(
    level: Optional[str] = None,
    topic_id: Optional[int] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retrieves questions with translations, options, and bookmark status."""
    user_id = current_user.id if current_user else None
    return get_questions_list(db, level=level, topic_id=topic_id, user_id=user_id, limit=limit, offset=offset)

@router.get("/{question_id}", response_model=QuestionDetailResponse)
def get_question(
    question_id: int = Path(..., ge=1),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Retrieves a single question by ID with translations and options."""
    user_id = current_user.id if current_user else None
    return get_question_by_id(db, question_id, user_id=user_id)

@router.post("/evaluate", response_model=AnswerFeedbackResponse)
def submit_answer(
    submit_req: AnswerSubmitRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    """Submits and evaluates an answer, returning feedback and explanation."""
    return evaluate_answer(db, submit_req, user=current_user)

@router.post("/run-code")
def run_code_sandbox(req: CodeRunRequest):
    """Executes arbitrary student Python code safely in isolated sandbox."""
    test_inputs = [req.input_data] if req.input_data else []
    return execute_user_code(req.code, test_inputs=test_inputs)
