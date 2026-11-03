import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function OAuthCallbackPage() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const executedRef = useRef(false);

  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const providerTitle = provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'OAuth';

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    if (oauthError) {
      setStatus('error');
      setErrorMessage(errorDescription || `Authentication canceled or failed with ${providerTitle}.`);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage(`No authorization code received from ${providerTitle}.`);
      return;
    }

    const exchangeCode = async () => {
      try {
        await handleOAuthCallback(provider, code);
        setStatus('success');
        // Smoothly redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.message || `Failed to complete ${providerTitle} authentication.`);
      }
    };

    exchangeCode();
  }, [code, oauthError, errorDescription, provider, providerTitle, handleOAuthCallback, navigate]);

  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '75vh',
        padding: '2rem 1rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {status === 'processing' && (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--text-forest)'
              }}
            >
              <Loader2 className="animate-spin" size={32} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Signing in with {providerTitle}...
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Please wait while we verify your account credentials.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(46, 160, 67, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: '#2ea043'
              }}
            >
              <CheckCircle2 size={36} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Authentication Successful!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              Welcome! Redirecting you to your dashboard...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(229, 72, 77, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'var(--error)'
              }}
            >
              <AlertCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Sign-in Failed
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {errorMessage}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.65rem 1.25rem' }}>
                Back to Login
              </Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
                Try Sign Up <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
