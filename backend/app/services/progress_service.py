from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.question import Question, Topic
from app.models.quiz import QuizAttempt, UserAnswer, Bookmark, UserProgress
from app.models.user import User
from app.schemas.quiz import ProgressSummaryResponse

def get_user_dashboard_progress(db: Session, user: User) -> ProgressSummaryResponse:
    """Calculates comprehensive dashboard statistics and dynamic recommendations for the user."""
    # 1. Total available questions in bank
    total_bank = db.query(func.count(Question.id)).filter(Question.is_active == True).scalar() or 0

    # 2. Total attempts and correctness
    answers = db.query(UserAnswer).filter(UserAnswer.user_id == user.id).all()
    total_attempted = len(answers)
    total_correct = sum(1 for a in answers if a.is_correct)
    total_incorrect = total_attempted - total_correct
    overall_accuracy = round((total_correct / total_attempted * 100.0), 1) if total_attempted > 0 else 0.0
    total_points = sum(a.points_earned for a in answers)

    # 3. Bookmarks count
    bookmarked_count = db.query(func.count(Bookmark.id)).filter(Bookmark.user_id == user.id).scalar() or 0

    # 4. Topic progress
    topics = db.query(Topic).order_by(Topic.order).all()
    topics_progress = []
    weak_topics = []

    for top in topics:
        q_count = db.query(func.count(Question.id)).filter(Question.topic_id == top.id, Question.is_active == True).scalar() or 0
        prog = db.query(UserProgress).filter(UserProgress.user_id == user.id, UserProgress.topic_id == top.id).first()
        
        attempted = prog.questions_attempted if prog else 0
        correct = prog.questions_correct if prog else 0
        acc = prog.accuracy if prog else 0.0

        if attempted > 0 and acc < 70.0:
            weak_topics.append(top.name)

        topics_progress.append({
            "topic_id": top.id,
            "topic_name": top.name,
            "level": top.level,
            "icon": top.icon,
            "total_questions": q_count,
            "attempted": attempted,
            "correct": correct,
            "accuracy": acc
        })

    # 5. Recent attempts
    recent_records = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user.id
    ).order_by(QuizAttempt.created_at.desc()).limit(5).all()

    recent_attempts = [
        {
            "id": r.id,
            "level": r.level,
            "score": r.score,
            "accuracy": r.accuracy,
            "total_questions": r.total_questions,
            "time_taken_seconds": r.time_taken_seconds,
            "created_at": r.created_at.isoformat()
        }
        for r in recent_records
    ]

    # 6. Personalized smart recommendations
    recommendations = []
    if total_attempted == 0:
        recommendations.append("Welcome! Start with Beginner Level → Variables & Data Types to build a solid base.")
        recommendations.append("Use the Tanglish & Tamil switchers anytime to understand tricky questions.")
    else:
        if weak_topics:
            recommendations.append(f"Focus on '{weak_topics[0]}' to improve your overall accuracy.")
        if total_correct >= 20 and user.current_level == "Beginner":
            recommendations.append("You have completed over 20 questions! You are ready to tackle Intermediate questions.")
        if total_incorrect > 3:
            recommendations.append("Review your Incorrect Answers section to reinforce your learning from mistakes.")
        if not recommendations:
            recommendations.append("Keep up the great momentum! Try a timed quiz to test your speed and accuracy.")

    return ProgressSummaryResponse(
        total_bank_questions=total_bank,
        total_attempted=total_attempted,
        total_correct=total_correct,
        total_incorrect=total_incorrect,
        overall_accuracy=overall_accuracy,
        current_level=user.current_level,
        total_points=total_points,
        bookmarked_count=bookmarked_count,
        topics_progress=topics_progress,
        recent_attempts=recent_attempts,
        recommendations=recommendations
    )
