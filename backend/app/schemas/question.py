from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class TopicResponse(BaseModel):
    id: int
    name: str
    slug: str
    level: str
    description: Optional[str] = None
    icon: str
    order: int
    question_count: int = 0

    class Config:
        from_attributes = True

class OptionResponse(BaseModel):
    id: int
    option_key: str
    option_text: str

    class Config:
        from_attributes = True

class TranslationResponse(BaseModel):
    language: str
    translated_question: str
    translated_explanation: Optional[str] = None
    status: str
    reviewed: bool

    class Config:
        from_attributes = True

class QuestionDetailResponse(BaseModel):
    id: int
    topic_id: int
    topic_name: Optional[str] = None
    level: str
    question_type: str
    title: str
    english_question: str
    code_snippet: Optional[str] = None
    expected_output: Optional[str] = None
    points: int
    options: List[OptionResponse] = []
    translations: Dict[str, TranslationResponse] = {}
    hints: Optional[str] = None
    is_bookmarked: bool = False

    class Config:
        from_attributes = True

class AnswerSubmitRequest(BaseModel):
    question_id: int
    selected_option: Optional[str] = None  # e.g., 'A', 'B'
    code_answer: Optional[str] = None      # for code execution or blanks
    mode: str = "learning"                 # 'learning' or 'test'

class AnswerFeedbackResponse(BaseModel):
    question_id: int
    is_correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    points_earned: int
    execution_result: Optional[Dict[str, Any]] = None

class QuestionCreateAdmin(BaseModel):
    topic_id: int
    level: str
    question_type: str
    title: str
    english_question: str
    code_snippet: Optional[str] = None
    expected_output: Optional[str] = None
    explanation: Optional[str] = None
    hints: Optional[str] = None
    points: int = 10
    options: Optional[List[Dict[str, Any]]] = None
    tanglish_question: Optional[str] = None
    tanglish_explanation: Optional[str] = None
    tamil_question: Optional[str] = None
    tamil_explanation: Optional[str] = None

class CodeRunRequest(BaseModel):
    code: str
    input_data: Optional[str] = None
