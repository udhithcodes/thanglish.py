from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.db.session import Base

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    level = Column(String(32), nullable=False, index=True)  # Beginner, Intermediate, Advanced
    description = Column(Text, nullable=True)
    icon = Column(String(64), default="book", nullable=False)
    order = Column(Integer, default=0, nullable=False)

    questions = relationship("Question", back_populates="topic", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    level = Column(String(32), nullable=False, index=True)  # Beginner, Intermediate, Advanced
    question_type = Column(String(32), default="mcq", nullable=False)  # mcq, predict_output, find_error, fill_blanks, code, debugging
    title = Column(String(255), nullable=False)
    english_question = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    hints = Column(Text, nullable=True)
    points = Column(Integer, default=10, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    topic = relationship("Topic", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.order")
    translations = relationship("QuestionTranslation", back_populates="question", cascade="all, delete-orphan")
    test_cases = relationship("CodingTestCase", back_populates="question", cascade="all, delete-orphan")
    answers = relationship("UserAnswer", back_populates="question", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="question", cascade="all, delete-orphan")


class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_key = Column(String(8), nullable=False)  # A, B, C, D
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    order = Column(Integer, default=0, nullable=False)

    question = relationship("Question", back_populates="options")


class QuestionTranslation(Base):
    __tablename__ = "question_translations"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    language = Column(String(16), nullable=False)  # tanglish, ta
    translated_question = Column(Text, nullable=False)
    translated_explanation = Column(Text, nullable=True)
    status = Column(String(32), default="verified", nullable=False)
    reviewed = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    question = relationship("Question", back_populates="translations")

    __table_args__ = (
        Index("idx_question_language", "question_id", "language", unique=True),
    )


class CodingTestCase(Base):
    __tablename__ = "coding_test_cases"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    input_data = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=False)
    is_hidden = Column(Boolean, default=False, nullable=False)

    question = relationship("Question", back_populates="test_cases")
