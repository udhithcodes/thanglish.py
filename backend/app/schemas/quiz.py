from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuizStartRequest(BaseModel):
    level: Optional[str] = None
    topic_id: Optional[int] = None
    mode: str = "test"  # 'learning' or 'test'
    question_count: int = 10

class QuizAnswerItem(BaseModel):
    question_id: int
    selected_option: Optional[str] = None
    code_answer: Optional[str] = None

class QuizSubmitRequest(BaseModel):
    quiz_attempt_id: Optional[str] = None
    level: str
    topic_id: Optional[int] = None
    mode: str = "test"
    time_taken_seconds: int = 0
    answers: List[QuizAnswerItem]

class QuizResultResponse(BaseModel):
    quiz_attempt_id: str
    total_questions: int
    score: int
    total_possible: int
    accuracy: float
    time_taken_seconds: int
    results: List[Dict[str, Any]]
    created_at: datetime

class ProgressSummaryResponse(BaseModel):
    total_bank_questions: int
    total_attempted: int
    total_correct: int
    total_incorrect: int
    overall_accuracy: float
    current_level: str
    total_points: int
    bookmarked_count: int
    topics_progress: List[Dict[str, Any]]
    recent_attempts: List[Dict[str, Any]]
    recommendations: List[str]
