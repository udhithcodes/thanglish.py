import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles, CheckCircle2, ArrowRight, BookOpen, Award,
  Terminal, SplitSquareVertical, Globe, ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { setLanguage } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>

      {/* ══ Hero Section ══ */}
      <section style={{
        padding: '5rem 0 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Soft radial sage glow */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(220,232,213,0.55) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div className="app-container" style={{ maxWidth: '820px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-sage)',
            color: 'var(--text-forest)',
            border: '1px solid var(--border-olive)',
            fontWeight: 700,
            fontSize: '0.84rem',
            marginBottom: '1.75rem',
          }}>
            <Sparkles size={15} />
            <span>Overcoming the Programming Language Barrier</span>
          </div>

          {/* Main Title — all Forest, no copper highlights */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-forest)',
            letterSpacing: '-0.03em',
            marginBottom: '1.35rem',
          }}>
            Learn Python. Understand English.{' '}
            <span style={{
              display: 'inline-block',
              backgroundColor: 'var(--bg-sage)',
              color: 'var(--text-forest)',
              borderRadius: 'var(--radius-md)',
              padding: '0 0.35em',
            }}>
              Think in Your Language.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.12rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            marginBottom: '2.75rem',
            maxWidth: '680px',
            margin: '0 auto 2.75rem',
          }}>
            Many students know Python concepts but struggle with English questions.
            <strong> thanglish.py</strong> bridges this gap with natural Tanglish and Tamil translations,
            interactive quizzes, and instant feedback — from Beginner to Advanced.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <span>Go to My Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  <span>Start Learning Python Free</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Log In
                </Link>
              </>
            )}
            <Link to="/practice" className="btn btn-outline btn-lg">
              <span>Try Instant Practice</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 3-Language Showcase Card ══ */}
      <section className="app-container" style={{ margin: '0 auto 4.5rem', maxWidth: '980px' }}>
        <div className="card" style={{
          backgroundColor: 'var(--surface-white)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div>
              <span className="badge" style={{ marginBottom: '0.5rem' }}>Core Innovation</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-forest)' }}>
                One Question. Three Seamless Perspectives.
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge">English</span>
              <span className="badge">Tanglish</span>
              <span className="badge">தமிழ்</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))',
            gap: '1.25rem',
          }}>
            {/* English Card */}
            <div style={{
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              borderTop: '4px solid var(--text-olive)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-olive)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                1. Read in English
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-forest)', lineHeight: 1.6, fontWeight: 500 }}>
                "Write a Python program to find the largest number in a list."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-olive)' }}>
                Read the technical question as presented in exams and interviews.
              </div>
            </div>

            {/* Tanglish Card */}
            <div style={{
              backgroundColor: 'var(--bg-sage)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              borderTop: '4px solid var(--text-forest)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-forest)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                2. Understand in Tanglish
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-forest)', lineHeight: 1.6, fontWeight: 600 }}>
                "Oru list-la irukkura numbers-la, romba periya number edhu-nu kandupidikka Python program ezhudhunga."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Conversational Tamil in English letters removes comprehension anxiety instantly.
              </div>
            </div>

            {/* Tamil Card */}
            <div style={{
              backgroundColor: 'var(--surface-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              borderTop: '4px solid var(--text-olive)',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-olive)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                3. Validate in Tamil Script
              </div>
              <p className="font-tamil" style={{ fontSize: '1.05rem', color: 'var(--text-forest)', lineHeight: 1.75, fontWeight: 600 }}>
                "ஒரு பட்டியலில் உள்ள எண்களில் மிகப்பெரிய எண்ணைக் கண்டறிய Python நிரலை எழுதுங்கள்."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-olive)' }}>
                Reinforce understanding in pure Tamil script.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Feature Grid ══ */}
      <section className="app-container" style={{ margin: '0 auto 4.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-forest)', marginBottom: '0.75rem' }}>
            Built Specifically for Python Learners
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to go from complete beginner to writing clean, idiomatic Python code.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(255px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            { icon: Award, title: '3 Structured Levels', desc: 'Beginner, Intermediate, and Advanced tiers covering syntax, comprehensions, algorithms, and OOP.' },
            { icon: SplitSquareVertical, title: 'Side-by-Side Comparison', desc: 'Compare English and Tanglish side by side to learn key technical phrases while programming.' },
            { icon: Terminal, title: 'Isolated Code Sandbox', desc: 'Write Python code and test it against test cases safely with sub-second execution in a secure sandbox.' },
            { icon: CheckCircle2, title: 'Smart Progress Tracking', desc: 'Review mistakes, save bookmarks, track accuracy per topic, and receive custom study recommendations.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card card-hover" style={{ backgroundColor: 'var(--surface-white)' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-sage)',
                color: 'var(--text-forest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                <Icon size={22} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-forest)' }}>
                {title}
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CTA Banner — Forest background ══ */}
      <section className="app-container" style={{ margin: '0 auto 2rem' }}>
        <div style={{
          backgroundColor: 'var(--text-forest)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(40, 56, 47, 0.28)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Sage blob accent */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(220,232,213,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
            Ready to Master Python on Your Terms?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '580px', margin: '0 auto 2rem' }}>
            Join students learning Python without letting English comprehension hold them back.
          </p>
          <Link
            to={isAuthenticated ? '/practice' : '/signup'}
            className="btn btn-lg"
            style={{
              backgroundColor: 'var(--bg-sage)',
              color: 'var(--text-forest)',
              border: '1px solid transparent',
              fontWeight: 800,
              fontSize: '1.05rem',
              padding: '0.9rem 2.4rem',
            }}
          >
            {isAuthenticated ? 'Continue Practice' : 'Create Your Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
}
