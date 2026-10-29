import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { questionService } from '../services/questionService';
import QuestionCard from '../components/QuestionCard';
import {
  Sparkles, Terminal, Play, RotateCcw, Filter, CheckCircle,
  HelpCircle, ChevronLeft, ChevronRight, BookOpen, AlertCircle
} from 'lucide-react';

import { useCodePlayground } from '../context/CodePlaygroundContext';

export default function PracticePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';
  const { openPlayground } = useCodePlayground();

  const [selectedTopicId, setSelectedTopicId] = useState(initialTopic);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');

  // Load Topics
  useEffect(() => {
    async function loadTopics() {
      try {
        const data = await questionService.getTopics();
        setTopics(data);
      } catch (err) {
        console.error('Failed to load topics', err);
      }
    }
    loadTopics();
  }, []);

  // Load Questions
  useEffect(() => {
    async function loadQuestions() {
      setLoading(true);
      setError('');
      setFeedback(null);
      try {
        const params = { limit: 100 };
        if (selectedTopicId) params.topicId = selectedTopicId;
        const data = await questionService.getQuestions(params);
        setQuestions(data);
        setCurrentIndex(0);
      } catch (err) {
        setError('Failed to load questions. Please check your network.');
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [selectedTopicId]);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSubmit = async (payload) => {
    try {
      const res = await questionService.evaluateAnswer(payload);
      setFeedback(res);
      if (res.is_correct) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#CB764A', '#F5E7A1', '#34A853', '#ffffff']
        });
      }
    } catch (err) {
      alert('Error evaluating answer: ' + err.message);
    }
  };

  const handleBookmarkToggle = async (questionId) => {
    try {
      await questionService.toggleBookmark(questionId);
    } catch (err) {
      console.error('Bookmark error', err);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFeedback(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setFeedback(null);
    }
  };

  const handleRunSandbox = async () => {
    setSandboxRunning(true);
    setSandboxOutput('Executing code in secure sandbox...');
    try {
      const res = await questionService.runCode(sandboxCode, sandboxInput);
      if (res.stderr) {
        setSandboxOutput(`ERROR:\n${res.stderr}`);
      } else {
        setSandboxOutput(res.stdout || '(No output returned)');
      }
    } catch (err) {
      setSandboxOutput(`Sandbox Error: ${err.message}`);
    } finally {
      setSandboxRunning(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 5rem' }}>
      <div className="app-container">
        {/* Page Title & Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <Sparkles size={26} style={{ color: 'var(--text-olive)' }} />
              <span>Python Practice Arena</span>
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Solve questions with instant Tanglish & Tamil support, hints, and explanations.
            </p>
          </div>

          {/* Code Playground CTA */}
          <button
            onClick={() => openPlayground({
              code: currentQuestion?.code_snippet || '# Practice Python here\n',
              title: currentQuestion?.title || 'Practice Arena Sandbox',
              context: currentQuestion?.topic_name || 'Practice Arena'
            })}
            className="btn btn-secondary"
            style={{ borderRadius: 'var(--radius-full)', border: '1px solid var(--border-olive)', gap: '0.45rem' }}
          >
            <Terminal size={16} />
            <span>🐍 Open Python Code Editor</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="card" style={{
          backgroundColor: 'var(--surface-white)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-olive)', fontSize: '0.88rem' }}>
            <Filter size={16} />
            <strong>Topic Filter:</strong>
          </div>

          {/* Topic Dropdown */}
          <div style={{ flex: 1, minWidth: '220px' }}>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="form-input"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
            >
              <option value="">All Topics ({topics.length})</option>
              {topics.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.level})
                </option>
              ))}
            </select>
          </div>

          {/* Questions Count Indicator */}
          {questions.length > 0 && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Question {currentIndex + 1} of {questions.length}
            </div>
          )}
        </div>

        {/* Optional Code Sandbox Panel */}
        {sandboxOpen && (
          <div className="animate-fade-in card" style={{
            backgroundColor: 'var(--code-bg)',
            color: 'var(--code-text)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid var(--border-strong)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Terminal size={18} style={{ color: 'var(--bg-sage)' }} />
                <span>Interactive Python Sandbox (Runs on Server)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleRunSandbox}
                  disabled={sandboxRunning}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'var(--text-forest)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <Play size={14} />
                  <span>{sandboxRunning ? 'Executing...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '0.4rem' }}>
                  Write or paste Python code:
                </label>
                <textarea
                  value={sandboxCode}
                  onChange={(e) => setSandboxCode(e.target.value)}
                  className="font-mono"
                  rows={8}
                  style={{
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: '#f8f8f2',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.9rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#aaa', display: 'block', marginBottom: '0.4rem' }}>
                  Sandbox Output / Results:
                </label>
                <pre
                  className="font-mono"
                  style={{
                    minHeight: '160px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: sandboxOutput.startsWith('ERROR:') ? '#ff6b6b' : '#a8ff78',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {sandboxOutput || 'Click "Run Code" above to see output.'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Question Area */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 1rem',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--bg-sage)',
              borderTopColor: 'var(--text-forest)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading interactive questions...</p>
          </div>
        ) : error ? (
          <div className="card" style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <AlertCircle size={36} style={{ color: 'var(--error)', margin: '0 auto 1rem' }} />
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Failed to Load</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="card" style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)'
          }}>
            <BookOpen size={40} style={{ color: 'var(--text-olive)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              No Questions Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              No questions matched the selected filters. Try choosing a different topic or resetting filters.
            </p>
            <button
              onClick={() => {
                setLevel('');
                setSelectedTopicId('');
              }}
              className="btn btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : currentQuestion ? (
          <div>
            {/* Stepper Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              padding: '0 0.5rem'
            }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="btn btn-outline btn-sm"
                style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              {/* Progress bar */}
              <div style={{ flex: 1, maxWidth: '280px', margin: '0 1rem' }}>
                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: 'var(--text-forest)',
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <button
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
                className="btn btn-outline btn-sm"
                style={{ opacity: currentIndex === questions.length - 1 ? 0.4 : 1 }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Active Question Card */}
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              onBookmarkToggle={handleBookmarkToggle}
              onNext={handleNext}
              showNextButton={currentIndex < questions.length - 1}
              feedback={feedback}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
