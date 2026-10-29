import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCodePlayground } from '../context/CodePlaygroundContext';
import { progressService } from '../services/quizService';
import {
  LayoutDashboard, CheckCircle2, Bookmark, Target,
  TrendingUp, Sparkles, BookOpen, AlertCircle, ArrowRight,
  Terminal, Briefcase, Award, Check
} from 'lucide-react';

const CAREER_MODULES_LIST = [
  { id: 1, name: "Python Foundations & Syntax", totalTopics: 5 },
  { id: 2, name: "Operators & Expressions", totalTopics: 5 },
  { id: 3, name: "Control Flow & Loops", totalTopics: 5 },
  { id: 4, name: "Strings & Text Processing", totalTopics: 5 },
  { id: 5, name: "Core Data Structures (Lists, Tuples, Sets, Dicts)", totalTopics: 6 },
  { id: 6, name: "Functions, Scope & Functional Python", totalTopics: 5 },
  { id: 7, name: "OOP for Production", totalTopics: 5 },
  { id: 8, name: "Files, Exceptions & Advanced Python", totalTopics: 5 },
  { id: 9, name: "Data Structures & Problem Solving", totalTopics: 5 },
  { id: 10, name: "Real-World Workplace Python (APIs, DBs, Testing)", totalTopics: 4 }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { openPlayground } = useCodePlayground();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProgress() {
      try {
        const res = await progressService.getDashboardProgress();
        setData(res);
      } catch (err) {
        setError('Failed to fetch learning progress: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid var(--bg-sage)',
          borderTopColor: 'var(--text-forest)',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading your Python learning progress...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="app-container" style={{ padding: '3rem 0' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--bg-elevated)' }}>
          <AlertCircle size={36} style={{ color: 'var(--error)', margin: '0 auto 1rem' }} />
          <h3>Could not load dashboard</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{error || 'Unable to load progress data.'}</p>
        </div>
      </div>
    );
  }

  // Calculate Job Readiness Progress %
  const totalBankQuestions = Math.max(data.total_bank_questions || 1050, 1000);
  const questionsSolved = data.total_correct || 0;
  const questionsAttempted = data.total_attempted || 0;
  const topicsCompletedCount = data.topics_progress?.filter(tp => tp.correct > 0)?.length || 0;
  const totalTopics = 50;
  const jobReadinessPct = Math.min(100, Math.round(((questionsSolved / totalBankQuestions) * 70) + ((topicsCompletedCount / totalTopics) * 30)));

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container">
        
        {/* 1. Welcome Banner */}
        <div className="card" style={{
          backgroundColor: 'var(--surface-white)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem 2.5rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.65rem' }}>
              <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                ID: {user?.user_id}
              </span>
              <span className="badge" style={{ backgroundColor: 'var(--bg-paper)' }}>
                Job-Readiness Track
              </span>
            </div>
            
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-forest)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Vanakkam, {user?.full_name?.split(' ')[0]}! 🐍
            </h1>
            
            <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '640px', lineHeight: 1.55 }}>
              Learn Python topic-by-topic in English, Tanglish & Tamil, test code live, and complete all 1,000+ questions to get job-ready.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/learn" className="btn btn-primary" style={{ gap: '0.45rem' }}>
              <BookOpen size={16} />
              <span>📖 Continue Learning Topic</span>
            </Link>

            <Link to="/practice" className="btn btn-secondary" style={{ gap: '0.45rem' }}>
              <Sparkles size={16} />
              <span>✨ Practice Questions</span>
            </Link>

            <button
              onClick={() => openPlayground({
                code: '# Practice scratchpad\nprint("Vanakkam Python! 🐍")\n',
                title: 'Python Playground',
                context: 'Dashboard'
              })}
              className="btn btn-secondary"
              style={{
                backgroundColor: 'var(--surface-white)',
                border: '1px solid var(--border-olive)',
                gap: '0.45rem'
              }}
            >
              <Terminal size={16} />
              <span>🐍 Open Code Editor</span>
            </button>
          </div>
        </div>

        {/* 2. Four Clean Progress Cards (No Gamified "Points" Card) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}>
          {/* Card 1: TOPICS MASTERED */}
          <div className="card" style={{
            backgroundColor: 'var(--surface-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-olive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                TOPICS MASTERED
              </span>
              <BookOpen size={18} style={{ color: 'var(--text-forest)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-forest)' }}>
              {topicsCompletedCount} <span style={{ fontSize: '1.15rem', color: 'var(--text-olive)', fontWeight: 600 }}>/ 50</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-olive)', marginTop: '0.2rem' }}>
              W3Schools-style lessons completed
            </div>
          </div>

          {/* Card 2: QUESTIONS SOLVED */}
          <div className="card" style={{
            backgroundColor: 'var(--surface-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-olive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                QUESTIONS SOLVED
              </span>
              <CheckCircle2 size={18} style={{ color: 'var(--text-forest)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-forest)' }}>
              {questionsSolved} <span style={{ fontSize: '1.15rem', color: 'var(--text-olive)', fontWeight: 600 }}>/ {totalBankQuestions}+</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-olive)', marginTop: '0.2rem' }}>
              Job-ready question bank progress
            </div>
          </div>

          {/* Card 3: OVERALL ACCURACY */}
          <div className="card" style={{
            backgroundColor: 'var(--surface-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-olive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                OVERALL ACCURACY
              </span>
              <Target size={18} style={{ color: 'var(--success)' }} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
              {Math.round(data.overall_accuracy)}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-olive)', marginTop: '0.2rem' }}>
              {data.total_correct} correct of {questionsAttempted} attempts
            </div>
          </div>

          {/* Card 4: SAVED & MISTAKES */}
          <div className="card" style={{
            backgroundColor: 'var(--surface-white)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-olive)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                SAVED & MISTAKES
              </span>
              <Bookmark size={18} style={{ color: 'var(--text-forest)' }} />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-forest)' }}>
              {data.bookmarked_count || 0} <span style={{ fontSize: '1rem', color: 'var(--text-olive)', fontWeight: 600 }}>Saved</span> · {Math.max(0, questionsAttempted - questionsSolved)} <span style={{ fontSize: '1rem', color: 'var(--error)', fontWeight: 600 }}>To Review</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-olive)', marginTop: '0.2rem' }}>
              <Link to="/bookmarks" style={{ fontWeight: 600, color: 'var(--text-forest)' }}>Saved</Link> · <Link to="/mistakes" style={{ fontWeight: 600, color: 'var(--error)' }}>Review Mistakes →</Link>
            </div>
          </div>
        </div>

        {/* 3. Career Readiness & Smart Next-Step Banner */}
        <div className="card" style={{
          backgroundColor: 'var(--bg-sage)',
          border: '1.5px solid var(--border-olive)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-forest)',
              letterSpacing: '0.04em',
              marginBottom: '0.4rem'
            }}>
              <Briefcase size={16} />
              <span>CAREER READINESS JOURNEY</span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-forest)', marginBottom: '0.35rem' }}>
              Job-Readiness Status: {jobReadinessPct}% Complete
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-forest)', lineHeight: 1.5, marginBottom: '1rem' }}>
              Completing all 50 topics and 1,000+ verified questions certifies that you are ready for Python developer technical interviews and production coding tasks.
            </p>

            {/* Overall Progress Bar */}
            <div style={{ height: '8px', backgroundColor: 'rgba(40, 56, 47, 0.15)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                backgroundColor: 'var(--text-forest)',
                width: `${jobReadinessPct}%`,
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/learn" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem', whiteSpace: 'nowrap' }}>
              <span>Resume Topic →</span>
            </Link>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-forest)', textAlign: 'center' }}>
              Next: Python Foundations & Syntax
            </span>
          </div>
        </div>

        {/* 4. Curriculum Mastery Grid: 10 Career Modules */}
        <div className="card" style={{
          backgroundColor: 'var(--surface-white)',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-forest)', marginBottom: '0.2rem' }}>
                Curriculum Mastery (10 Career Modules)
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-olive)' }}>
                Progressively conquer each module from basic syntax to APIs, databases, and algorithms.
              </p>
            </div>
            <Link to="/learn" className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.85rem' }}>
              <span>View W3Schools Curriculum →</span>
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {CAREER_MODULES_LIST.map((mod) => {
              // Approximate progress per module based on topics progress
              const completedInModule = Math.min(mod.totalTopics, Math.round((topicsCompletedCount / 50) * mod.totalTopics));
              const modPct = Math.round((completedInModule / mod.totalTopics) * 100);

              return (
                <div
                  key={mod.id}
                  style={{
                    backgroundColor: 'var(--bg-paper)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-olive)', textTransform: 'uppercase' }}>
                        Module {mod.id}
                      </span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-forest)' }}>
                        {completedInModule} / {mod.totalTopics} Topics
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-forest)', lineHeight: 1.35 }}>
                      {mod.name}
                    </h4>
                  </div>

                  <div>
                    <div style={{ height: '6px', backgroundColor: 'var(--border-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginBottom: '0.75rem' }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: 'var(--text-forest)',
                        width: `${modPct}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>

                    <Link
                      to={`/learn`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text-forest)',
                        textDecoration: 'none'
                      }}
                    >
                      <span>Study Module</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
