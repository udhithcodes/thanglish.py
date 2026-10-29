import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { questionService } from '../services/questionService';
import { BookOpen, Search, ArrowRight, Play, Terminal, Code2, Sparkles, Filter } from 'lucide-react';

export default function TopicsPage() {
  const [topics, setTopics] = useState([]);
  const [activeLevel, setActiveLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopics() {
      setLoading(true);
      try {
        const data = await questionService.getTopics(activeLevel || null);
        setTopics(data);
      } catch (err) {
        console.error('Failed to load topics', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, [activeLevel]);

  const filteredTopics = topics.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="app-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--yellow-subtle)',
            color: 'var(--badge-text)',
            border: '1px solid var(--yellow-border)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            <BookOpen size={15} />
            <span>Curriculum Modules</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '1rem'
          }}>
            Python <span style={{ color: 'var(--copper-base)' }}>Topics & Concepts</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Browse through 15 fundamental and advanced Python concepts. Each topic has practice questions and timed quizzes.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{
          backgroundColor: 'var(--bg-elevated)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          {/* Level Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                className={`btn btn-sm ${activeLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}
              >
                {lvl || 'All Topics'}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px', flex: '0 1 320px' }}>
            <Search size={16} style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              type="text"
              placeholder="Search Python topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.3rem', fontSize: '0.88rem' }}
            />
          </div>
        </div>

        {/* Topics Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--copper-subtle)',
              borderTopColor: 'var(--copper-base)',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading Python topics...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="card" style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>No topics found matching your criteria.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredTopics.map((topic) => {
              const levelColor =
                topic.level === 'Beginner' ? '#34A853' :
                topic.level === 'Intermediate' ? '#CB764A' : '#b8982a';

              return (
                <div
                  key={topic.id}
                  className="card"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.75rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all var(--transition-normal)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--copper-subtle)',
                      color: 'var(--copper-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Code2 size={20} />
                    </div>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        color: levelColor,
                        fontWeight: 700,
                        border: `1px solid ${levelColor}33`
                      }}
                    >
                      {topic.level}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    {topic.name}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1, marginBottom: '1.5rem' }}>
                    {topic.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <Link
                      to={`/practice?topic=${topic.id}&level=${encodeURIComponent(topic.level)}`}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <span>Practice</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      to={`/quiz?topicId=${topic.id}&level=${encodeURIComponent(topic.level)}`}
                      className="btn btn-secondary btn-sm"
                      title="Start Quiz for this topic"
                    >
                      <Play size={14} />
                      <span>Quiz</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
