from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.question import Topic, Question, QuestionOption, QuestionTranslation, CodingTestCase
from app.models.quiz import Bookmark, UserAnswer, UserProgress
from app.models.user import User
from app.schemas.question import (
    TopicResponse, QuestionDetailResponse, OptionResponse,
    TranslationResponse, AnswerSubmitRequest, AnswerFeedbackResponse
)
from app.core.sandbox import execute_user_code

def get_all_topics(db: Session, level: Optional[str] = None) -> List[TopicResponse]:
    """Retrieves all topics, optionally filtered by difficulty level, with question counts."""
    query = db.query(Topic)
    if level and level.lower() != "all":
        query = query.filter(Topic.level.ilike(level))
    topics = query.order_by(Topic.order, Topic.name).all()

    result = []
    for topic in topics:
        q_count = db.query(func.count(Question.id)).filter(
            Question.topic_id == topic.id,
            Question.is_active == True
        ).scalar() or 0
        
        result.append(TopicResponse(
            id=topic.id,
            name=topic.name,
            slug=topic.slug,
            level=topic.level,
            description=topic.description,
            icon=topic.icon,
            order=topic.order,
            question_count=q_count
        ))
    return result

def get_questions_list(
    db: Session,
    level: Optional[str] = None,
    topic_id: Optional[int] = None,
    user_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> List[QuestionDetailResponse]:
    """Lists questions with options and translations."""
    query = db.query(Question).filter(Question.is_active == True)
    if level and level.lower() != "all":
        query = query.filter(Question.level.ilike(level))
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)

    questions = query.offset(offset).limit(limit).all()
    
    # Get user bookmarks if user logged in
    bookmarked_ids = set()
    if user_id:
        bms = db.query(Bookmark.question_id).filter(Bookmark.user_id == user_id).all()
        bookmarked_ids = set([b[0] for b in bms])

    return [format_question_detail(db, q, is_bookmarked=(q.id in bookmarked_ids)) for q in questions]

def get_question_by_id(db: Session, question_id: int, user_id: Optional[str] = None) -> QuestionDetailResponse:
    """Retrieves a single question by ID with translations and bookmark state."""
    question = db.query(Question).filter(Question.id == question_id, Question.is_active == True).first()
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    is_bookmarked = False
    if user_id:
        bm = db.query(Bookmark).filter(Bookmark.user_id == user_id, Bookmark.question_id == question_id).first()
        is_bookmarked = bm is not None

    return format_question_detail(db, question, is_bookmarked)

def format_question_detail(db: Session, question: Question, is_bookmarked: bool = False) -> QuestionDetailResponse:
    """Helper to convert SQLAlchemy Question to QuestionDetailResponse schema."""
    options = [
        OptionResponse(id=opt.id, option_key=opt.option_key, option_text=opt.option_text)
        for opt in sorted(question.options, key=lambda o: o.order)
    ]
    
    translations_dict = {}
    for tr in question.translations:
        translations_dict[tr.language] = TranslationResponse(
            language=tr.language,
            translated_question=tr.translated_question,
            translated_explanation=tr.translated_explanation,
            status=tr.status,
            reviewed=tr.reviewed
        )

    return QuestionDetailResponse(
        id=question.id,
        topic_id=question.topic_id,
        topic_name=question.topic.name if question.topic else "",
        level=question.level,
        question_type=question.question_type,
        title=question.title,
        english_question=question.english_question,
        code_snippet=question.code_snippet,
        expected_output=question.expected_output,
        points=question.points,
        options=options,
        translations=translations_dict,
        hints=question.hints,
        is_bookmarked=is_bookmarked
    )

def evaluate_answer(
    db: Session,
    submit_req: AnswerSubmitRequest,
    user: Optional[User] = None
) -> AnswerFeedbackResponse:
    """Evaluates question answer, handles MCQ or Python code execution, and records progress."""
    question = db.query(Question).filter(Question.id == submit_req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = False
    correct_answer_str = ""
    exec_result = None

    if question.question_type in ["mcq", "predict_output", "find_error", "fill_blanks"]:
        correct_opt = db.query(QuestionOption).filter(
            QuestionOption.question_id == question.id,
            QuestionOption.is_correct == True
        ).first()

        if correct_opt:
            correct_answer_str = f"{correct_opt.option_key}: {correct_opt.option_text}"
            if submit_req.selected_option and submit_req.selected_option.strip().upper() == correct_opt.option_key.upper():
                is_correct = True
    elif question.question_type in ["code", "debugging"]:
        # Execute in sandbox
        code_to_run = submit_req.code_answer or ""
        test_cases = db.query(CodingTestCase).filter(CodingTestCase.question_id == question.id).all()
        
        all_passed = True
        test_reports = []

        if not test_cases:
            # Simple run to check expected output
            res = execute_user_code(code_to_run)
            exec_result = res
            clean_stdout = res["stdout"].strip()
            expected = (question.expected_output or "").strip()
            is_correct = res["success"] and (clean_stdout == expected if expected else True)
            correct_answer_str = expected or "Code executed without errors."
        else:
            for tc in test_cases:
                inputs = [tc.input_data] if tc.input_data else []
                res = execute_user_code(code_to_run, test_inputs=inputs)
                actual = res["stdout"].strip()
                exp = tc.expected_output.strip()
                passed = (res["success"] and actual == exp)
                test_reports.append({
                    "input": tc.input_data if not tc.is_hidden else "[Hidden]",
                    "expected": exp if not tc.is_hidden else "[Hidden]",
                    "actual": actual if not tc.is_hidden else ("Passed" if passed else "Incorrect"),
                    "passed": passed,
                    "error": res["stderr"] if not passed else None
                })
                if not passed:
                    all_passed = False

            is_correct = all_passed
            exec_result = {"test_cases": test_reports, "all_passed": all_passed}
            correct_answer_str = question.expected_output or "All test cases passed."

    points_earned = question.points if is_correct else 0

    # Record user attempt if user authenticated
    if user:
        user_ans = UserAnswer(
            user_id=user.id,
            question_id=question.id,
            user_answer=submit_req.selected_option or submit_req.code_answer or "",
            is_correct=is_correct,
            points_earned=points_earned
        )
        db.add(user_ans)
        update_user_topic_progress(db, user.id, question.topic_id, question.level, is_correct)
        db.commit()

    return AnswerFeedbackResponse(
        question_id=question.id,
        is_correct=is_correct,
        correct_answer=correct_answer_str,
        explanation=question.explanation,
        points_earned=points_earned,
        execution_result=exec_result
    )

def update_user_topic_progress(db: Session, user_id: str, topic_id: int, level: str, is_correct: bool):
    """Updates user progress statistics for the topic."""
    prog = db.query(UserProgress).filter(
        UserProgress.user_id == user_id,
        UserProgress.topic_id == topic_id
    ).first()

    if not prog:
        prog = UserProgress(
            user_id=user_id,
            topic_id=topic_id,
            level=level,
            questions_attempted=1,
            questions_correct=1 if is_correct else 0,
            accuracy=100.0 if is_correct else 0.0
        )
        db.add(prog)
    else:
        prog.questions_attempted += 1
        if is_correct:
            prog.questions_correct += 1
        prog.accuracy = round((prog.questions_correct / prog.questions_attempted) * 100.0, 1)

def toggle_bookmark(db: Session, user_id: str, question_id: int) -> bool:
    """Toggles bookmark status. Returns True if bookmarked, False if removed."""
    existing = db.query(Bookmark).filter(
        Bookmark.user_id == user_id,
        Bookmark.question_id == question_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return False
    else:
        bm = Bookmark(user_id=user_id, question_id=question_id)
        db.add(bm)
        db.commit()
        return True

def get_user_bookmarks(db: Session, user_id: str) -> List[QuestionDetailResponse]:
    """Retrieves all bookmarked questions for user."""
    bms = db.query(Bookmark).filter(Bookmark.user_id == user_id).order_by(Bookmark.created_at.desc()).all()
    res = []
    for bm in bms:
        q = db.query(Question).filter(Question.id == bm.question_id, Question.is_active == True).first()
        if q:
            res.append(format_question_detail(db, q, is_bookmarked=True))
    return res

def get_user_incorrect_questions(db: Session, user_id: str) -> List[QuestionDetailResponse]:
    """Retrieves questions the user has answered incorrectly for review."""
    # Subquery: latest answer per question
    wrong_answers = db.query(UserAnswer.question_id).filter(
        UserAnswer.user_id == user_id,
        UserAnswer.is_correct == False
    ).distinct().all()
    
    question_ids = [w[0] for w in wrong_answers]
    # Check if user later solved it correctly
    still_incorrect = []
    for qid in question_ids:
        latest = db.query(UserAnswer).filter(
            UserAnswer.user_id == user_id,
            UserAnswer.question_id == qid
        ).order_by(UserAnswer.created_at.desc()).first()
        if latest and not latest.is_correct:
            still_incorrect.append(qid)

    res = []
    for qid in still_incorrect:
        q = db.query(Question).filter(Question.id == qid, Question.is_active == True).first()
        if q:
            is_bm = db.query(Bookmark).filter(Bookmark.user_id == user_id, Bookmark.question_id == qid).first() is not None
            res.append(format_question_detail(db, q, is_bm))
    return res
