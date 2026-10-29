import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { quizService } from '../services/quizService';
import { questionService } from '../services/questionService';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Sparkles, AlertCircle, ChevronRight, ChevronLeft, BookOpen
} from 'lucide-react';

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const initialLevel = searchParams.get('level') || 'Beginner';
  const initialTopicId = searchParams.get('topicId') ? parseInt(searchParams.get('topicId')) : null;

  const { language, setLanguage, compareMode, toggleCompareMode, languages } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Quiz state
  const [level, setLevel] = useState(initialLevel);
  const [topicId, setTopicId] = useState(initialTopicId);
  const [questionCount, setQuestionCount] = useState(5);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [question_id]: selected_option }
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (quizStarted && !result) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, result]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleStartQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        level,
        topic_id: topicId || null,
        question_count: parseInt(questionCount) || 5,
        mode: 'test'
      };
      const qs = await quizService.startQuiz(payload);
      if (!qs || qs.length === 0) {
        setError('No questions available for this level/topic combination. Please select another.');
        setLoading(false);
        return;
      }
      setQuestions(qs);
      setCurrentIndex(0);
      setUserAnswers({});
      setTimerSeconds(0);
      setResult(null);
      setQuizStarted(true);
    } catch (err) {
      setError(err.message || 'Failed to start quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (key) => {
    const qId = questions[currentIndex].id;
    setUserAnswers(prev => ({ ...prev, [qId]: key }));
  };

  const handleSubmitQuiz = async () => {
    if (!isAuthenticated) {
      alert('Please log in or sign up to record your quiz attempt and earn points!');
      navigate('/login');
      return;
    }

    setSubmitting(true);
    try {
      const answersArray = questions.map(q => ({
        question_id: q.id,
        selected_option: userAnswers[q.id] || null,
        code_answer: null,
        time_spent_seconds: Math.floor(timerSeconds / questions.length)
      }));

      const payload = {
        level,
        topic_id: topicId || null,
        mode: 'test',
        answers: answersArray,
        time_taken_seconds: timerSeconds
      };

      const res = await quizService.submitQuiz(payload);
      setResult(res);

      if (res.accuracy >= 60) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#CB764A', '#F5E7A1', '#34A853', '#ffffff']
        });
      }
    } catch (err) {
      alert('Quiz submission failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];

  const getTranslatedText = (q) => {
    if (language === 'english') return q.english_question;
    const tr = q.translations?.[language];
    return tr?.translated_question || q.english_question;
  };

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="app-container" style={{ maxWidth: '860px' }}>
        {/* Setup Screen if Quiz Not Started */}
        {!quizStarted ? (
          <div className="card" style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: 'var(--copper-subtle)',
                color: 'var(--copper-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.6rem'
              }}>
                ⏱️
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Python Speed Quiz
              </h1>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Test your Python knowledge with instant scoring and multi-language explanations.
              </p>
            </div>

            {error && (
              <div style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--error-subtle)',
                color: 'var(--error)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Level Selection */}
              <div>
                <label className="form-label">Difficulty Track</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevel(lvl)}
                      className={`btn ${level === lvl ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of questions */}
              <div>
                <label className="form-label">Number of Questions</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[3, 5, 10].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setQuestionCount(cnt)}
                      className={`btn ${questionCount === cnt ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ justifyContent: 'flex-start' }}
                    >
                      {cnt} Questions (~{cnt * 2} mins)
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
            >
              <span>{loading ? 'Preparing Quiz...' : 'Start Quiz Now'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : result ? (
          /* Result Summary Screen */
          <div className="card animate-fade-in" style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: result.accuracy >= 60 ? 'var(--success-subtle)' : 'var(--error-subtle)',
              color: result.accuracy >= 60 ? 'var(--success)' : 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              {result.accuracy >= 60 ? <Award size={32} /> : <RotateCcw size={32} />}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {result.accuracy >= 80 ? 'Outstanding Performance! 🎉' :
               result.accuracy >= 50 ? 'Good Effort! Keep Practicing! 🐍' :
               'Needs Improvement — Review Your Mistakes! 💡'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              You scored <strong>{result.score}</strong> / {result.total_questions * 10} points in {formatTime(timerSeconds)}.
            </p>

            {/* Metrics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
              maxWidth: '600px',
              margin: '0 auto 2.5rem'
            }}>
              <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--copper-base)' }}>
                  {Math.round(result.accuracy)}%
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correct Answers</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>
                  {result.correct_count} / {result.total_questions}
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-muted)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Taken</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {formatTime(timerSeconds)}
                </div>
              </div>
            </div>

            {/* Questions breakdown */}
            <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Detailed Question Review
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {result.questions_breakdown?.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${item.is_correct ? 'var(--success)' : 'var(--error)'}`,
                    backgroundColor: item.is_correct ? 'var(--success-subtle)' : 'var(--error-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        Q{idx + 1}: {item.title || `Question ${item.question_id}`}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Your answer: <strong>{item.selected_option || '(None)'}</strong> • Correct: <strong>{item.correct_answer}</strong>
                      </div>
                    </div>
                    {item.is_correct ? (
                      <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    ) : (
                      <XCircle size={20} style={{ color: 'var(--error)', flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  setQuizStarted(false);
                  setResult(null);
                }}
                className="btn btn-primary"
              >
                <RotateCcw size={16} />
                <span>Take Another Quiz</span>
              </button>
              <Link to="/practice" className="btn btn-secondary">
                <span>Go to Practice Arena</span>
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Quiz Question Screen */
          <div>
            {/* Top Bar with Timer & Language Controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--bg-elevated)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={18} style={{ color: 'var(--copper-base)' }} />
                <span className="font-mono" style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                  {formatTime(timerSeconds)}
                </span>
                <span className="badge badge-copper" style={{ marginLeft: '0.5rem' }}>
                  {level}
                </span>
              </div>

              {/* Language Switcher */}
              <div className="lang-switcher">
                {languages.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    className={`lang-btn ${language === l.id ? 'active' : ''}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              height: '6px',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                backgroundColor: 'var(--copper-base)',
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                transition: 'width 0.25s ease'
              }} />
            </div>

            {/* Question Card in Test Mode */}
            {currentQ && (
              <div className="card" style={{
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{currentQ.points || 10} Points</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {currentQ.title}
                </h3>

                <div style={{
                  padding: '1.2rem',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: '4px solid var(--copper-base)',
                  marginBottom: '1.5rem',
                  fontSize: '1.05rem',
                  lineHeight: 1.6
                }} className={language === 'ta' ? 'font-tamil' : ''}>
                  {getTranslatedText(currentQ)}
                </div>

                {currentQ.code_snippet && (
                  <div className="code-block" style={{ marginBottom: '1.5rem' }}>
                    <pre><code>{currentQ.code_snippet}</code></pre>
                  </div>
                )}

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                  {currentQ.options?.map(opt => {
                    const isSelected = userAnswers[currentQ.id] === opt.option_key;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectOption(opt.option_key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.9rem',
                          padding: '0.9rem 1.2rem',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${isSelected ? 'var(--copper-base)' : 'var(--border-color)'}`,
                          backgroundColor: isSelected ? 'var(--copper-subtle)' : 'var(--bg-surface)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        <div style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'var(--copper-base)' : 'var(--bg-muted)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem'
                        }}>
                          {opt.option_key}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {opt.option_text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="btn btn-outline btn-sm"
                    style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  {currentIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIndex(prev => prev + 1)}
                      className="btn btn-primary"
                    >
                      <span>Next Question</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="btn btn-primary"
                      style={{ backgroundColor: 'var(--success)' }}
                    >
                      <span>{submitting ? 'Submitting Quiz...' : 'Finish & Submit Quiz'}</span>
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
