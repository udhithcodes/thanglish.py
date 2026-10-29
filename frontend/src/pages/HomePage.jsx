import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles, CheckCircle2, ArrowRight, BookOpen, Award,
  Terminal, SplitSquareVertical, Globe, ShieldCheck
} from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const { setLanguage } = useLanguage();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        padding: '4.5rem 0 3.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="app-container" style={{ maxWidth: '850px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--yellow-subtle)',
            color: 'var(--badge-text)',
            border: '1px solid var(--yellow-border)',
            fontWeight: 700,
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>Overcoming the Programming Language Barrier</span>
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Learn Python. Understand English.{' '}
            <span style={{ color: 'var(--copper-base)' }}>Think in Your Language.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.18rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '720px',
            margin: '0 auto 2.5rem'
          }}>
            Many students know Python concepts but struggle with English questions.
            <strong> thanglish.py</strong> bridges this gap with natural Tanglish and Tamil translations,
            interactive quizzes, and instant feedback.
          </p>

          {/* Call to Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                <span>Go to Student Dashboard</span>
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

      {/* The 3-Language Feature Showcase Card */}
      <section className="app-container" style={{ margin: '1rem auto 4rem', maxWidth: '1000px' }}>
        <div className="card" style={{
          backgroundColor: 'var(--bg-elevated)',
          border: '2px solid var(--copper-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1.25rem',
            marginBottom: '1.75rem'
          }}>
            <div>
              <span className="badge badge-copper" style={{ marginBottom: '0.4rem' }}>Core Innovation</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                One Question. Three Seamless Perspectives.
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge" style={{ backgroundColor: 'var(--bg-muted)' }}>English</span>
              <span className="badge" style={{ backgroundColor: 'var(--copper-subtle)', color: 'var(--copper-base)' }}>Tanglish</span>
              <span className="badge" style={{ backgroundColor: 'var(--yellow-subtle)', color: 'var(--badge-text)' }}>தமிழ்</span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* English Card */}
            <div style={{
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              borderTop: '4px solid var(--text-muted)'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                1. Read in English
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500 }}>
                "Write a Python program to find the largest number in a list."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Read the technical question as presented in exams and interviews.
              </div>
            </div>

            {/* Tanglish Card */}
            <div style={{
              backgroundColor: 'var(--copper-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              borderTop: '4px solid var(--copper-base)'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--copper-base)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                2. Understand in Tanglish
              </div>
              <p style={{ fontSize: '1.02rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 600 }}>
                "Oru list-la irukkura numbers-la, romba periya number edhu-nu kandupidikka Python program ezhudhunga."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--copper-hover)' }}>
                Conversational Tamil in English letters removes comprehension anxiety instantly.
              </div>
            </div>

            {/* Tamil Card */}
            <div style={{
              backgroundColor: 'var(--yellow-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              borderTop: '4px solid var(--yellow-dark)'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--yellow-dark)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                3. Validate in Tamil Script
              </div>
              <p className="font-tamil" style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7, fontWeight: 600 }}>
                "ஒரு பட்டியலில் உள்ள எண்களில் மிகப்பெரிய எண்ணைக் கண்டறிய Python நிரலை எழுதுங்கள்."
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Reinforce understanding in pure Tamil script.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages Grid */}
      <section className="app-container" style={{ margin: '3rem auto 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Built Specifically for Python Learners
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Everything you need to go from complete beginner to writing clean, idiomatic Python code.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--copper-subtle)',
              color: 'var(--copper-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Award size={22} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              3 Structured Levels
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Beginner, Intermediate, and Advanced tiers covering syntax, comprehensions, algorithms, and OOP.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--yellow-subtle)',
              color: 'var(--yellow-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <SplitSquareVertical size={22} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Side-by-Side Comparison
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Compare English and Tanglish side by side to learn key technical English phrases while programming.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--copper-subtle)',
              color: 'var(--copper-base)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Terminal size={22} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Isolated Code Sandbox
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Write Python code and test it against test cases safely with sub-second execution in an isolated sandbox.
            </p>
          </div>

          <div className="card card-hover">
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'var(--success-subtle)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={22} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Smart Progress Tracking
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Review mistakes, save bookmarks, track accuracy per topic, and receive custom study recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Banner CTA */}
      <section className="app-container" style={{ margin: '2rem auto' }}>
        <div style={{
          backgroundColor: 'var(--copper-base)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(203, 118, 74, 0.35)'
        }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
            Ready to Master Python on Your Terms?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.95, maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join students learning Python without letting English comprehension hold them back.
          </p>
          <Link
            to={isAuthenticated ? "/practice" : "/signup"}
            className="btn btn-accent btn-lg"
            style={{ fontWeight: 800, fontSize: '1.05rem', padding: '0.9rem 2.2rem' }}
          >
            {isAuthenticated ? "Continue Practice" : "Create Your Free Account"}
          </Link>
        </div>
      </section>
    </div>
  );
}
