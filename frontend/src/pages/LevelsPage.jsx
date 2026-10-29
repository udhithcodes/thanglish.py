import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Zap, Layers, ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react';

const TRACKS = [
  {
    id: 'Beginner',
    title: 'Beginner Track',
    badge: 'Level 1',
    cssColor: 'var(--success)',
    rawColor: '#34A853',
    icon: Sparkles,
    tagline: 'Foundation: Variables, Loops, Conditionals & Collections',
    description: 'Perfect for students writing their first Python programs. Master basic syntax, data types, if-else logic, loops, and built-in data structures with bilingual explanations.',
    topics: [
      'Python Syntax & Variables',
      'Operators & Expressions',
      'Conditionals (If, Elif, Else)',
      'Loops (For & While)',
      'Lists & Tuples',
      'Dictionaries & Sets',
      'Functions & Scope'
    ],
    points: '120+ Points',
    questionsCount: '15+ Questions'
  },
  {
    id: 'Intermediate',
    title: 'Intermediate Track',
    badge: 'Level 2',
    cssColor: '#5C7A60',
    rawColor: '#5C7A60',
    icon: Zap,
    tagline: 'Fluency: Comprehensions, Strings, Files & Functional Python',
    description: 'Take your Python logic to the next level. Write pythonic code, parse complex strings, work with file I/O, safely handle exceptions, and utilize lambda functions.',
    topics: [
      'List Comprehensions & Slicing',
      'String Algorithms & Formatting',
      'File Handling (Context Managers)',
      'Exception Handling (Try / Except)',
      'Lambda, Map & Filter'
    ],
    points: '180+ Points',
    questionsCount: '15+ Questions'
  },
  {
    id: 'Advanced',
    title: 'Advanced Track',
    badge: 'Level 3',
    cssColor: '#28382F',
    rawColor: '#28382F',
    icon: Layers,
    tagline: 'Mastery: OOP, Decorators, Generators & DSA',
    description: 'Deep dive into professional Python engineering. Master object-oriented design, custom classes, closures, memory-efficient generators, and algorithm complexity.',
    topics: [
      'OOP (Classes, Inheritance, Encapsulation)',
      'Decorators & Function Closures',
      'Generators & Lazy Streams (Yield)',
      'Data Structures & Time Complexity'
    ],
    points: '240+ Points',
    questionsCount: '15+ Questions'
  }
];

export default function LevelsPage() {
  return (
    <div className="animate-fade-in" style={{ padding: '3rem 0 5rem' }}>
      <div className="app-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-sage)',
            color: 'var(--text-forest)',
            border: '1px solid var(--border-olive)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1rem'
          }}>
            <Award size={15} />
            <span>Structured Python Curriculum</span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: 'var(--text-forest)',
            letterSpacing: '-0.02em',
            marginBottom: '1rem'
          }}>
            Choose Your Learning Track
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every level provides questions explained in English, Tanglish, and Tamil.
            Level up progressively from Python basics to advanced OOP.
          </p>
        </div>

        {/* Tracks Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {TRACKS.map((track) => {
            const IconComponent = track.icon;
            return (
              <div
                key={track.id}
                className="card"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all var(--transition-normal)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {/* Accent top stripe */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  backgroundColor: track.cssColor
                }} />

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: track.cssColor
                  }}>
                    <IconComponent size={22} />
                  </div>
                  <span className="badge badge-accent" style={{ fontWeight: 700 }}>
                    {track.badge}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  {track.title}
                </h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: track.cssColor, marginBottom: '1rem' }}>
                  {track.tagline}
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {track.description}
                </p>

                {/* Topics List */}
                <div style={{ flex: 1, marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    Topics Included:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {track.topics.map((t, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        <CheckCircle2 size={15} style={{ color: track.cssColor, flexShrink: 0 }} />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link
                    to={`/practice?level=${encodeURIComponent(track.id)}`}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <span>Practice {track.id} Questions</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to={`/quiz?level=${encodeURIComponent(track.id)}`}
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                  >
                    <Play size={15} />
                    <span>Take {track.id} Quiz</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
