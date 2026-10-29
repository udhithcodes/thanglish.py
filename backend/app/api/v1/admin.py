from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Path
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.question import Question, QuestionOption, QuestionTranslation, Topic
from app.models.quiz import QuizAttempt, UserAnswer
from app.schemas.question import QuestionCreateAdmin, QuestionDetailResponse
from app.services.question_service import format_question_detail

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/stats")
def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Aggregate platform analytics for authorized administrators."""
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_questions = db.query(func.count(Question.id)).scalar() or 0
    total_attempts = db.query(func.count(QuizAttempt.id)).scalar() or 0
    total_answers = db.query(func.count(UserAnswer.id)).scalar() or 0
    total_topics = db.query(func.count(Topic.id)).scalar() or 0

    return {
        "total_users": total_users,
        "total_questions": total_questions,
        "total_attempts": total_attempts,
        "total_answers": total_answers,
        "total_topics": total_topics
    }

@router.post("/questions", response_model=QuestionDetailResponse)
def create_question(
    data: QuestionCreateAdmin,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Creates a new Python question with translations and options."""
    topic = db.query(Topic).filter(Topic.id == data.topic_id).first()
    if not topic:
        raise HTTPException(status_code=400, detail="Invalid topic_id")

    q = Question(
        topic_id=data.topic_id,
        level=data.level,
        question_type=data.question_type,
        title=data.title,
        english_question=data.english_question,
        code_snippet=data.code_snippet,
        expected_output=data.expected_output,
        explanation=data.explanation,
        hints=data.hints,
        points=data.points,
        is_active=True
    )
    db.add(q)
    db.flush()

    # Add options if provided
    if data.options:
        for idx, opt in enumerate(data.options):
            op = QuestionOption(
                question_id=q.id,
                option_key=opt.get("option_key", chr(65 + idx)),
                option_text=opt.get("option_text", ""),
                is_correct=opt.get("is_correct", False),
                order=idx
            )
            db.add(op)

    # Add Tanglish translation
    if data.tanglish_question:
        tr_tanglish = QuestionTranslation(
            question_id=q.id,
            language="tanglish",
            translated_question=data.tanglish_question,
            translated_explanation=data.tanglish_explanation,
            status="verified",
            reviewed=True
        )
        db.add(tr_tanglish)

    # Add Tamil translation
    if data.tamil_question:
        tr_tamil = QuestionTranslation(
            question_id=q.id,
            language="ta",
            translated_question=data.tamil_question,
            translated_explanation=data.tamil_explanation,
            status="verified",
            reviewed=True
        )
        db.add(tr_tamil)

    db.commit()
    db.refresh(q)
    return format_question_detail(db, q)

@router.delete("/questions/{question_id}")
def delete_question(
    question_id: int = Path(..., ge=1),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Deletes or archives a question."""
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    db.delete(q)
    db.commit()
    return {"message": f"Question {question_id} deleted successfully."}
