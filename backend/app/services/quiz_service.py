import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from fastapi import HTTPException
from app.models.question import Question, QuestionOption, Topic
from app.models.quiz import QuizAttempt, UserAnswer
from app.models.user import User
from app.schemas.quiz import QuizStartRequest, QuizSubmitRequest, QuizResultResponse
from app.schemas.question import QuestionDetailResponse
from app.services.question_service import format_question_detail, update_user_topic_progress

def create_quiz_session(db: Session, req: QuizStartRequest, user_id: Optional[str] = None) -> List[QuestionDetailResponse]:
    """Builds a quiz session with randomized or filtered questions."""
    query = db.query(Question).filter(Question.is_active == True)
    if req.level and req.level.lower() != "all":
        query = query.filter(Question.level.ilike(req.level))
    if req.topic_id:
        query = query.filter(Question.topic_id == req.topic_id)

    # Pick randomized questions
    questions = query.order_by(func.random()).limit(req.question_count).all()
    if not questions:
        # Fallback to any active questions if specific filter yielded none
        questions = db.query(Question).filter(Question.is_active == True).limit(req.question_count).all()

    return [format_question_detail(db, q) for q in questions]

def submit_quiz_attempt(db: Session, req: QuizSubmitRequest, user: User) -> QuizResultResponse:
    """Evaluates all answers in a test mode quiz submission and persists records."""
    total_q = len(req.answers)
    if total_q == 0:
        raise HTTPException(status_code=400, detail="Cannot submit empty quiz")

    attempt_id = req.quiz_attempt_id or str(uuid.uuid4())
    score = 0
    total_possible = 0
    results_detail = []

    quiz_attempt = QuizAttempt(
        id=attempt_id,
        user_id=user.id,
        level=req.level,
        topic_id=req.topic_id,
        mode=req.mode,
        total_questions=total_q,
        score=0,
        accuracy=0.0,
        time_taken_seconds=req.time_taken_seconds
    )
    db.add(quiz_attempt)
    db.flush()

    for ans_item in req.answers:
        q = db.query(Question).filter(Question.id == ans_item.question_id).first()
        if not q:
            continue

        total_possible += q.points
        is_correct = False
        correct_answer_str = ""

        # Grade MCQ
        if q.question_type in ["mcq", "predict_output", "find_error", "fill_blanks"]:
            correct_opt = db.query(QuestionOption).filter(
                QuestionOption.question_id == q.id,
                QuestionOption.is_correct == True
            ).first()
            if correct_opt:
                correct_answer_str = f"{correct_opt.option_key}: {correct_opt.option_text}"
                if ans_item.selected_option and ans_item.selected_option.strip().upper() == correct_opt.option_key.upper():
                    is_correct = True
        else:
            # Simple text / output match for code exercises in quiz mode
            expected = (q.expected_output or "").strip().lower()
            submitted = (ans_item.code_answer or "").strip().lower()
            is_correct = (expected in submitted) if expected else bool(submitted)
            correct_answer_str = q.expected_output or "Valid Python solution"

        points_earned = q.points if is_correct else 0
        score += points_earned

        user_ans = UserAnswer(
            user_id=user.id,
            quiz_attempt_id=attempt_id,
            question_id=q.id,
            user_answer=ans_item.selected_option or ans_item.code_answer or "",
            is_correct=is_correct,
            points_earned=points_earned
        )
        db.add(user_ans)
        update_user_topic_progress(db, user.id, q.topic_id, q.level, is_correct)

        results_detail.append({
            "question_id": q.id,
            "title": q.title,
            "is_correct": is_correct,
            "user_answer": ans_item.selected_option or ans_item.code_answer or "No answer",
            "correct_answer": correct_answer_str,
            "explanation": q.explanation,
            "points_earned": points_earned
        })

    accuracy = round((sum(1 for r in results_detail if r["is_correct"]) / total_q) * 100.0, 1) if total_q > 0 else 0.0
    quiz_attempt.score = score
    quiz_attempt.accuracy = accuracy
    db.commit()
    db.refresh(quiz_attempt)

    return QuizResultResponse(
        quiz_attempt_id=attempt_id,
        total_questions=total_q,
        score=score,
        total_possible=total_possible,
        accuracy=accuracy,
        time_taken_seconds=req.time_taken_seconds,
        results=results_detail,
        created_at=quiz_attempt.created_at
    )
