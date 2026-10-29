import React, { useState, useEffect } from 'react';
import { apiRequest } from '../services/api';
import { questionService } from '../services/questionService';
import { Shield, PlusCircle, Trash2, CheckCircle2, AlertCircle, Database, Users, HelpCircle, Award } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [topics, setTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [topicId, setTopicId] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [questionType, setQuestionType] = useState('mcq');
  const [title, setTitle] = useState('');
  const [englishQuestion, setEnglishQuestion] = useState('');
  const [tanglishQuestion, setTanglishQuestion] = useState('');
  const [tamilQuestion, setTamilQuestion] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [explanation, setExplanation] = useState('');
  const [tanglishExplanation, setTanglishExplanation] = useState('');
  const [hints, setHints] = useState('');
  const [points, setPoints] = useState(10);

  // Options State for MCQ
  const [options, setOptions] = useState([
    { option_key: 'A', option_text: '', is_correct: false },
    { option_key: 'B', option_text: '', is_correct: false },
    { option_key: 'C', option_text: '', is_correct: false },
    { option_key: 'D', option_text: '', is_correct: false },
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, topicsData, questionsData] = await Promise.all([
        apiRequest('/admin/stats'),
        questionService.getTopics(),
        questionService.getQuestions({ limit: 50 })
      ]);
      setStats(statsData);
      setTopics(topicsData);
      setQuestions(questionsData);
      if (topicsData.length > 0) setTopicId(topicsData[0].id);
    } catch (err) {
      setError(err.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    if (field === 'is_correct') {
      updated.forEach((opt, idx) => {
        opt.is_correct = idx === index ? value : false;
      });
    } else {
      updated[index][field] = value;
    }
    setOptions(updated);
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        topic_id: parseInt(topicId),
        level,
        question_type: questionType,
        title,
        english_question: englishQuestion,
        tanglish_question: tanglishQuestion || null,
        tamil_question: tamilQuestion || null,
        code_snippet: codeSnippet || null,
        explanation: explanation || null,
        tanglish_explanation: tanglishExplanation || null,
        hints: hints || null,
        points: parseInt(points) || 10,
        options: options.filter(opt => opt.option_text.trim() !== '')
      };

      await apiRequest('/admin/questions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setMessage('Question added successfully with translations!');
      setShowAddForm(false);
      // Reset form
      setTitle('');
      setEnglishQuestion('');
      setTanglishQuestion('');
      setTamilQuestion('');
      setCodeSnippet('');
      setExplanation('');
      setTanglishExplanation('');
      setHints('');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Question #${id}?`)) return;
    try {
      await apiRequest(`/admin/questions/${id}`, { method: 'DELETE' });
      setQuestions(prev => prev.filter(q => q.id !== id));
      setMessage(`Question #${id} deleted.`);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2.5rem 0 5rem' }}>
      <div className="app-container">
        {/* Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Shield size={20} style={{ color: 'var(--text-forest)' }} />
              <span className="badge badge-accent">Administrator Mode</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Platform Administration
            </h1>
          </div>

          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="btn btn-primary"
          >
            <PlusCircle size={17} />
            <span>{showAddForm ? 'Close Question Form' : 'Add New Question'}</span>
          </button>
        </div>

        {message && (
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--success-subtle)',
            color: 'var(--success)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.85rem 1rem',
            backgroundColor: 'var(--error-subtle)',
            color: 'var(--error)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Aggregate Stats Cards */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem'
          }}>
            <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Users</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-forest)' }}>{stats.total_users}</div>
            </div>
            <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Question Bank</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.total_questions}</div>
            </div>
            <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quiz Attempts</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-forest)' }}>{stats.total_attempts}</div>
            </div>
            <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Answers Evaluated</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>{stats.total_answers}</div>
            </div>
            <div className="card" style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Topics</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--info)' }}>{stats.total_topics}</div>
            </div>
          </div>
        )}

        {/* Add Question Form Modal/Section */}
        {showAddForm && (
          <div className="card animate-fade-in" style={{
            backgroundColor: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2.5rem',
            border: '1px solid var(--border-olive)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Add Question with Multi-Language Translations
            </h2>

            <form onSubmit={handleCreateQuestion}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Topic</label>
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="form-input"
                    required
                  >
                    {topics.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.level})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="form-input">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Question Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. List Slicing Step"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* 3 Language Questions Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">English Question (Original) *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="What will this code print?"
                    value={englishQuestion}
                    onChange={(e) => setEnglishQuestion(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tanglish Question (Spoken Tamil in English)</label>
                  <textarea
                    rows={3}
                    placeholder="Indha code-oda output enna-nu sollunga?"
                    value={tanglishQuestion}
                    onChange={(e) => setTanglishQuestion(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tamil Question (தமிழ் எழுத்துகளில்)</label>
                  <textarea
                    rows={3}
                    placeholder="இந்த நிரலின் வெளியீடு என்ன?"
                    value={tamilQuestion}
                    onChange={(e) => setTamilQuestion(e.target.value)}
                    className="form-input font-tamil"
                  />
                </div>
              </div>

              {/* Code Snippet */}
              <div className="form-group">
                <label className="form-label">Code Snippet (Optional)</label>
                <textarea
                  rows={4}
                  className="form-input font-mono"
                  placeholder="x = [1, 2, 3]&#10;print(x[::-1])"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                />
              </div>

              {/* MCQ Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">MCQ Options (Check the correct answer)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {options.map((opt, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--bg-muted)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <input
                        type="radio"
                        name="correct_option"
                        checked={opt.is_correct}
                        onChange={() => handleOptionChange(idx, 'is_correct', true)}
                        title="Mark as correct answer"
                      />
                      <strong style={{ width: '20px' }}>{opt.option_key}:</strong>
                      <input
                        type="text"
                        placeholder={`Option ${opt.option_key} text`}
                        value={opt.option_text}
                        onChange={(e) => handleOptionChange(idx, 'option_text', e.target.value)}
                        className="form-input"
                        style={{ padding: '0.35rem 0.6rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanations & Hints */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">English Explanation</label>
                  <textarea
                    rows={2}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tanglish Explanation</label>
                  <textarea
                    rows={2}
                    value={tanglishExplanation}
                    onChange={(e) => setTanglishExplanation(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  <span>{submitting ? 'Adding...' : 'Publish Question'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Question Bank Table */}
        <div className="card" style={{
          backgroundColor: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
            Question Bank ({questions.length} displayed)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>ID</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Title</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Level</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Topic</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Translations</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>#{q.id}</td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{q.title}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span className="badge badge-accent">{q.level}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)' }}>{q.topic_name || '-'}</td>
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-muted)' }}>
                        Tanglish: {q.translations?.tanglish ? '✓' : '✗'} | Tamil: {q.translations?.ta ? '✓' : '✗'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="btn btn-sm"
                        style={{ color: 'var(--error)', padding: '0.25rem 0.5rem' }}
                        title="Delete question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
