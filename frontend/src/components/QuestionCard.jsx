import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Bookmark, CheckCircle2, XCircle, Lightbulb, SplitSquareVertical,
  ArrowRight, RotateCcw, Play, Check, AlertCircle, Award
} from 'lucide-react';

export default function QuestionCard({
  question,
  onAnswerSubmit,
  onBookmarkToggle,
  onNext,
  showNextButton = true,
  mode = 'learning', // 'learning' or 'test'
  submittedAnswer = null,
  isCorrect = null,
  feedback = null,
}) {
  const { language, setLanguage, compareMode, toggleCompareMode, languages } = useLanguage();
  const [selectedOption, setSelectedOption] = useState(submittedAnswer?.selectedOption || '');
  const [codeAnswer, setCodeAnswer] = useState(submittedAnswer?.codeAnswer || '');
  const [showHint, setShowHint] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(question?.is_bookmarked || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to get translated question based on current language
  const getQuestionText = (lang) => {
    if (lang === 'english') {
      return question.english_question;
    }
    const tr = question.translations?.[lang];
    if (tr && tr.translated_question) {
      return tr.translated_question;
    }
    // Fallback message with original english text as specified
    return question.english_question;
  };

  const currentQuestionText = getQuestionText(language);
  const englishQuestionText = question.english_question;

  const handleOptionClick = (key) => {
    if (feedback) return; // already answered
    setSelectedOption(key);
  };

  const handleSubmit = async () => {
    if (!selectedOption && !codeAnswer) return;
    setIsSubmitting(true);
    try {
      await onAnswerSubmit({
        question_id: question.id,
        selected_option: selectedOption,
        code_answer: codeAnswer,
        mode,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookmark = async () => {
    const newState = !isBookmarked;
    setIsBookmarked(newState);
    if (onBookmarkToggle) {
      await onBookmarkToggle(question.id);
    }
  };

  return (
    <div className="card" style={{
      position: 'relative',
      backgroundColor: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem',
      boxShadow: 'var(--shadow-md)',
      transition: 'all var(--transition-normal)'
    }}>
      {/* Header: Level Badge, Topic, Points, Bookmark, Compare Toggle, Language Switcher */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span className="badge badge-accent">
            {question.level}
          </span>
          {question.topic_name && (
            <span className="badge" style={{ backgroundColor: 'var(--bg-muted)' }}>
              {question.topic_name}
            </span>
          )}
          <span className="badge">
            <Award size={13} />
            <span>{question.points} Points</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Comparison Mode Toggle */}
          <button
            onClick={toggleCompareMode}
            className={`btn btn-sm ${compareMode ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: 'var(--radius-full)', fontSize: '0.78rem', padding: '0.3rem 0.75rem' }}
            title="Toggle side-by-side English comparison"
          >
            <SplitSquareVertical size={14} />
            <span>{compareMode ? 'Comparing' : 'Compare English'}</span>
          </button>

          {/* Inline Language Segmented Control */}
          <div className="lang-switcher">
            {languages.map(l => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`lang-btn ${language === l.id ? 'active' : ''}`}
                style={{ fontSize: l.id === 'ta' ? '0.85rem' : '0.8rem', padding: '0.25rem 0.65rem' }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="btn btn-secondary btn-sm"
            style={{
              borderRadius: 'var(--radius-full)',
              width: '36px',
              height: '36px',
              padding: 0,
              color: isBookmarked ? 'var(--text-forest)' : 'var(--text-olive)'
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
          >
            <Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Question Title & Translation Info */}
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '1rem',
        lineHeight: 1.4
      }}>
        {question.title}
      </h3>

      {/* Main Question Display: Dual Comparison Mode or Single View */}
      {compareMode && language !== 'english' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* English Panel */}
          <div style={{
            backgroundColor: 'var(--bg-muted)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--text-muted)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              English (Original)
            </div>
            <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              {englishQuestionText}
            </p>
          </div>

          {/* Translated Panel (Tanglish or Tamil) */}
          <div style={{
            backgroundColor: 'var(--bg-sage)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            borderLeft: '4px solid var(--text-forest)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-forest)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {language === 'tanglish' ? 'Tanglish (Spoken Tamil in English)' : 'தமிழ் (Tamil Script)'}
            </div>
            <p className={language === 'ta' ? 'font-tamil' : ''} style={{
              fontSize: '1.05rem',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              fontWeight: 500
            }}>
              {currentQuestionText}
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'var(--bg-muted)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem',
          borderLeft: '4px solid var(--text-olive)'
        }}>
          <p className={language === 'ta' ? 'font-tamil' : ''} style={{
            fontSize: '1.1rem',
            color: 'var(--text-primary)',
            lineHeight: 1.7
          }}>
            {currentQuestionText}
          </p>
        </div>
      )}

      {/* Code Snippet if present */}
      {question.code_snippet && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="code-block">
            <pre><code>{question.code_snippet}</code></pre>
          </div>
        </div>
      )}

      {/* MCQ Options */}
      {question.options && question.options.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.option_key;
            let borderColor = 'var(--border-color)';
            let bgColor = 'var(--bg-surface)';

            if (feedback) {
              if (opt.option_key === feedback.correct_answer.split(':')[0].trim()) {
                borderColor = 'var(--success)';
                bgColor = 'var(--success-subtle)';
              } else if (isSelected && !feedback.is_correct) {
                borderColor = 'var(--error)';
                bgColor = 'var(--error-subtle)';
              }
            } else if (isSelected) {
              borderColor = 'var(--text-forest)';
              bgColor = 'var(--bg-sage)';
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleOptionClick(opt.option_key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${borderColor}`,
                  backgroundColor: bgColor,
                  cursor: feedback ? 'default' : 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  backgroundColor: isSelected ? 'var(--text-forest)' : 'var(--bg-muted)',
                  color: isSelected ? '#ffffff' : 'var(--text-olive)',
                  flexShrink: 0
                }}>
                  {opt.option_key}
                </div>
                <div style={{ fontSize: '0.98rem', color: 'var(--text-primary)', flex: 1, lineHeight: 1.5 }}>
                  {opt.option_text}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hints Section */}
      {question.hints && (
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            onClick={() => setShowHint(prev => !prev)}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Lightbulb size={15} style={{ color: 'var(--text-olive)' }} />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
          </button>
          {showHint && (
            <div className="animate-fade-in" style={{
              marginTop: '0.5rem',
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--bg-sage)',
              border: '1px solid var(--border-olive)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              color: 'var(--text-primary)'
            }}>
              💡 <strong>Hint:</strong> {question.hints}
            </div>
          )}
        </div>
      )}

      {/* Feedback & Explanation Card */}
      {feedback && (
        <div className="animate-fade-in" style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: feedback.is_correct ? 'var(--success-subtle)' : 'var(--error-subtle)',
          border: `1px solid ${feedback.is_correct ? 'rgba(52, 168, 83, 0.4)' : 'rgba(229, 72, 77, 0.4)'}`,
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            {feedback.is_correct ? (
              <>
                <CheckCircle2 size={22} style={{ color: 'var(--success)' }} />
                <span style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.05rem' }}>
                  Correct! +{feedback.points_earned} Points
                </span>
              </>
            ) : (
              <>
                <XCircle size={22} style={{ color: 'var(--error)' }} />
                <span style={{ fontWeight: 800, color: 'var(--error)', fontSize: '1.05rem' }}>
                  Incorrect. Correct Answer: {feedback.correct_answer}
                </span>
              </>
            )}
          </div>

          {feedback.explanation && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
              <strong>Explanation:</strong> {feedback.explanation}
            </div>
          )}
        </div>
      )}

      {/* Action Footer: Submit Answer or Next Question */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1.25rem'
      }}>
        <div>
          {feedback && !feedback.is_correct && (
            <button
              onClick={() => {
                setSelectedOption('');
                setCodeAnswer('');
              }}
              className="btn btn-outline btn-sm"
            >
              <RotateCcw size={15} />
              <span>Retry Question</span>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={(!selectedOption && !codeAnswer) || isSubmitting}
              className="btn btn-primary"
              style={{
                opacity: (!selectedOption && !codeAnswer) || isSubmitting ? 0.6 : 1,
                cursor: (!selectedOption && !codeAnswer) || isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Evaluating...' : 'Check Answer'}
            </button>
          ) : (
            showNextButton && onNext && (
              <button onClick={onNext} className="btn btn-primary">
                <span>Next Question</span>
                <ArrowRight size={16} />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
