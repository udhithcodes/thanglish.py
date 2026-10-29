import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      padding: '3rem 0 2rem',
      marginTop: 'auto',
      transition: 'all var(--transition-normal)'
    }}>
      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem'
            }}>
              <span>🐍 thanglish</span>
              <span style={{ color: 'var(--copper-base)' }}>.py</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Helping students master Python programming while improving their English comprehension through natural Tanglish and Tamil translations.
            </p>
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              marginTop: '1rem'
            }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#CB764A' }} title="Old Copper" />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F5E7A1' }} title="Butter Yellow" />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#292544' }} title="Nebula" />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFF5EE', border: '1px solid #ccc' }} title="Seashell" />
            </div>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Learning Paths
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <Link to="/levels">Beginner Python</Link>
              <Link to="/levels">Intermediate Challenges</Link>
              <Link to="/levels">Advanced OOP & Algorithms</Link>
              <Link to="/practice">Interactive Practice</Link>
            </div>
          </div>

          {/* Student Resources */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Student Tools
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <Link to="/topics">All Python Topics</Link>
              <Link to="/bookmarks">Bookmarked Questions</Link>
              <Link to="/mistakes">Review Mistakes</Link>
              <Link to="/dashboard">Personal Dashboard</Link>
            </div>
          </div>

          {/* Philosophy */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Our Philosophy
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Read in English → Understand in Tanglish or Tamil → Solve in Python → Learn from mistakes → Improve English & Python together.
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} thanglish.py. Built for students learning Python across languages.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Old Copper • Butter Yellow • Nebula • Seashell</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
