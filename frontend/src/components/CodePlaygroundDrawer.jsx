import React, { useState } from 'react';
import { useCodePlayground } from '../context/CodePlaygroundContext';
import { questionService } from '../services/questionService';
import { Play, RotateCcw, Trash2, X, Terminal, AlertTriangle, Lightbulb, Sparkles, CheckCircle } from 'lucide-react';

// Smart Error Dictionary mapping standard Python exceptions to friendly Tanglish & Tamil explanations
const ERROR_GUIDES = {
  IndentationError: {
    tanglish: "Python-la if, for, def block ulla varra lines-ku munnaadi correct-a 4 spaces gap irukkanum! Tab & space mix pannaadheenga.",
    tamil: "பைத்தானில் if, for, def போன்ற பிளாக்குகளுக்குள் இருக்கும் வரிகளுக்கு முன்னால் 4 இடைவெளிகள் (spaces) இருக்க வேண்டும். Tab மற்றும் Space கலக்காதீர்கள்.",
    fix: "Indent the inner block lines by 4 spaces."
  },
  SyntaxError: {
    tanglish: "Python syntax-la edho colon (:), bracket (), quotes miss aagiduchu. Line ending-a check pannunga!",
    tamil: "ஒரு அடைப்புக்குறி, முக்காற்புள்ளி (:) அல்லது மேற்கோள்குறி விடுபட்டுள்ளது. வரியை சரிபார்க்கவும்.",
    fix: "Verify colons at line ends and matched parentheses/quotes."
  },
  TypeError: {
    tanglish: "Rendu different data types-a mix panna mudiyaadhu (eg. string + integer). Type casting `str()` or `int()` use pannunga.",
    tamil: "இரண்டு வெவ்வேறு தரவு வகைகளை நேரடியாக கலக்க முடியாது (எ.கா. string + integer). `str()` அல்லது `int()` பயன்படுத்தி மாற்றவும்.",
    fix: "Explicitly cast types, e.g. int('25') or str(100)."
  },
  IndexError: {
    tanglish: "List-oda size-ku mela irukkura index-a access panna try pandringa (out of range). Index 0-la start aagum.",
    tamil: "பட்டியலின் நீளத்தைத் தாண்டிய எண்ணை (index) அணுக முயற்சிக்கிறீர்கள். குறியீட்டெண் 0-வில் தொடங்குகிறது.",
    fix: "Check len(collection) and ensure index < length."
  },
  KeyError: {
    tanglish: "Indha key dictionary-la illa! KeyError varaama irukka `dict.get('key', default)` use pannalaam.",
    tamil: "இந்த சாவி (key) அகராதியில் இல்லை! பிழையைத் தவிர்க்க `dict.get('key')` பயன்படுத்தலாம்.",
    fix: "Use dict.get('key') or check `'key' in my_dict`."
  },
  NameError: {
    tanglish: "Indha variable name define pannala illa spelling thappa irukku! Use pandradhukku munnadi variable define pannanum.",
    tamil: "இந்த மாறி பெயர் (variable) இன்னும் உருவாக்கப்படவில்லை அல்லது எழுத்துப்பிழை உள்ளது.",
    fix: "Define and assign the variable before referencing it."
  },
  ZeroDivisionError: {
    tanglish: "Oru number-a 0-vaala divide panna mudiyaadhu! Divisor 0-va irukka koodadhu.",
    tamil: "எந்த எண்ணையும் 0-ஆல் வகுக்க முடியாது! வகுக்கும் எண் 0-ஆக இல்லை என்பதை உறுதிப்படுத்தவும்.",
    fix: "Add a condition `if divisor != 0:` before dividing."
  },
  AttributeError: {
    tanglish: "Indha data type-ku indha method illa! Example: integer-ku `.append()` panna mudiyaadhu.",
    tamil: "இந்த தரவு வகைக்கு இந்த செயல்பாடு (method) கிடையாது. எ.கா. எண்களுக்கு `.append()` பயன்படுத்த முடியாது.",
    fix: "Check the object's type and use its appropriate methods."
  },
  ValueError: {
    tanglish: "Function-ku kudutha input format thappu! Example: `int('hello')` integer-aa maaraadhu.",
    tamil: "கொடுக்கப்பட்ட மதிப்பு தவறான வடிவில் உள்ளது. எ.கா. எழுத்துகளை எண்ணாக மாற்ற முடியாது.",
    fix: "Ensure values are in valid formats before converting."
  }
};

function analyzeError(stderr) {
  if (!stderr) return null;

  for (const [errType, guide] of Object.entries(ERROR_GUIDES)) {
    if (stderr.includes(errType)) {
      return {
        type: errType,
        ...guide
      };
    }
  }

  return {
    type: "Runtime / Logic Error",
    tanglish: "Code-la edho runtime error vandhurukku. Traceback-la kadasila kaattura line number-aiyum error message-aiyum padinga.",
    tamil: "குறியீட்டில் ஒரு பிழை ஏற்பட்டுள்ளது. பிழைச் செய்தியில் கடைசியில் உள்ள வரி எண்ணை சரிபார்க்கவும்.",
    fix: "Read the traceback line numbers from bottom to top."
  };
}

export default function CodePlaygroundDrawer() {
  const {
    isOpen,
    code,
    setCode,
    title,
    topicContext,
    closePlayground,
    resetCode,
    clearCode
  } = useCodePlayground();

  const [inputData, setInputData] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'input' | 'guide'

  if (!isOpen) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab('output');
    try {
      const res = await questionService.runCode(code, inputData);
      setOutput({
        stdout: res.stdout || '',
        stderr: res.stderr || '',
        success: res.success,
        errorGuide: analyzeError(res.stderr)
      });
    } catch (err) {
      setOutput({
        stdout: '',
        stderr: err.message || 'Execution failed.',
        success: false,
        errorGuide: analyzeError(err.message)
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleKeyDown = (e) => {
    // Cmd+Enter or Ctrl+Enter to run
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
    // Allow Tab key inside textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <>
      {/* Semi-transparent backdrop on small screens */}
      <div
        onClick={closePlayground}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(40, 56, 47, 0.35)',
          backdropFilter: 'blur(3px)',
          zIndex: 9998,
        }}
        className="playground-backdrop"
      />

      {/* Slide-over Split Panel Docked Right */}
      <aside
        role="dialog"
        aria-label="Python Code Playground"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(640px, 100vw)',
          backgroundColor: 'var(--surface-white)',
          boxShadow: '-8px 0 32px rgba(40, 56, 47, 0.18)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid var(--border-olive)',
          animation: 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '0.9rem 1.25rem',
          backgroundColor: 'var(--text-forest)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
            <span style={{ fontSize: '1.25rem' }}>🐍</span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontWeight: 700,
                fontSize: '0.96rem',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {title}
              </div>
              {topicContext && (
                <div style={{ fontSize: '0.72rem', color: 'var(--bg-sage)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {topicContext}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="btn btn-sm"
              style={{
                backgroundColor: 'var(--bg-sage)',
                color: 'var(--text-forest)',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Run Python code (Ctrl + Enter)"
            >
              <Play size={14} fill="var(--text-forest)" />
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>

            <button
              onClick={closePlayground}
              className="btn btn-sm"
              style={{
                color: '#ffffff',
                padding: '0.35rem 0.5rem',
                borderRadius: 'var(--radius-md)',
              }}
              title="Close editor and keep your place"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div style={{
          padding: '0.5rem 1.25rem',
          backgroundColor: 'var(--bg-paper)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
        }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={resetCode}
              className="btn btn-sm"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: 'var(--text-forest)' }}
              title="Reset code to original snippet"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
            <button
              onClick={clearCode}
              className="btn btn-sm"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', color: 'var(--text-olive)' }}
              title="Clear all code"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>

          <span style={{ color: 'var(--text-olive)', fontSize: '0.75rem', fontWeight: 500 }}>
            Press <kbd style={{ padding: '0.1rem 0.35rem', backgroundColor: 'var(--bg-sage)', borderRadius: '4px', color: 'var(--text-forest)', fontWeight: 700 }}>Ctrl+Enter</kbd> to run
          </span>
        </div>

        {/* Editor Code Area */}
        <div style={{ flex: '1 1 52%', display: 'flex', flexDirection: 'column', minHeight: '220px', backgroundColor: '#18241E' }}>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck="false"
            placeholder="# Write Python code here and click Run..."
            style={{
              flex: 1,
              width: '100%',
              padding: '1rem 1.25rem',
              backgroundColor: '#18241E',
              color: '#DCE8D5',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              border: 'none',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Console / Output Panel (Lower Section) */}
        <div style={{
          flex: '1 1 48%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F1713',
          borderTop: '2px solid var(--text-forest)',
          color: '#E0E8DC',
          fontFamily: 'var(--font-mono)',
          overflow: 'hidden',
        }}>
          {/* Output Header Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 1rem',
            backgroundColor: '#141E18',
            borderBottom: '1px solid rgba(220, 232, 213, 0.1)',
            fontSize: '0.78rem',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setActiveTab('output')}
                style={{
                  color: activeTab === 'output' ? '#DCE8D5' : '#78917A',
                  fontWeight: activeTab === 'output' ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'output' ? 'rgba(220, 232, 213, 0.1)' : 'transparent',
                }}
              >
                <Terminal size={13} />
                <span>Console Output</span>
              </button>

              <button
                onClick={() => setActiveTab('input')}
                style={{
                  color: activeTab === 'input' ? '#DCE8D5' : '#78917A',
                  fontWeight: activeTab === 'input' ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  backgroundColor: activeTab === 'input' ? 'rgba(220, 232, 213, 0.1)' : 'transparent',
                }}
              >
                <span>Standard Input (stdin)</span>
              </button>
            </div>

            {output && (
              <span style={{
                fontSize: '0.72rem',
                color: output.success ? '#34A853' : '#FF6B6B',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                {output.success ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}
                {output.success ? 'Execution Succeeded' : 'Error Occurred'}
              </span>
            )}
          </div>

          {/* Tab Content: Input */}
          {activeTab === 'input' && (
            <div style={{ padding: '0.85rem 1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.76rem', color: '#78917A', marginBottom: '0.4rem' }}>
                Optional standard input for <code>input()</code> calls:
              </div>
              <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder="Enter inputs here (one per line)..."
                style={{
                  flex: 1,
                  backgroundColor: '#0F1713',
                  color: '#DCE8D5',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  padding: '0.5rem',
                  border: '1px solid rgba(120, 145, 122, 0.3)',
                  borderRadius: '6px',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>
          )}

          {/* Tab Content: Output & Doubt Clearer */}
          {activeTab === 'output' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
              {!output && !isRunning && (
                <div style={{ color: '#78917A', fontSize: '0.85rem', lineHeight: 1.6, padding: '1rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', color: '#DCE8D5' }}>
                    <Lightbulb size={16} />
                    <strong>Instant Python Execution</strong>
                  </div>
                  <div>Click <strong>Run</strong> to test your code. Test ideas, fix syntax doubts, or experiment freely.</div>
                </div>
              )}

              {isRunning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#DCE8D5', padding: '1rem 0' }}>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid #78917A',
                    borderTopColor: '#DCE8D5',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  <span>Executing Python in secure sandbox...</span>
                </div>
              )}

              {output && (
                <>
                  {/* Standard Output */}
                  {output.stdout && (
                    <div style={{ marginBottom: '1rem' }}>
                      <pre style={{
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: '#DCE8D5',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                      }}>
                        {output.stdout}
                      </pre>
                    </div>
                  )}

                  {/* Standard Error */}
                  {output.stderr && (
                    <div style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1rem',
                    }}>
                      <div style={{
                        color: '#FF8585',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        marginBottom: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}>
                        <AlertTriangle size={14} />
                        <span>PYTHON TRACEBACK</span>
                      </div>
                      <pre style={{
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        color: '#FFA8A8',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                      }}>
                        {output.stderr}
                      </pre>
                    </div>
                  )}

                  {/* Smart Tanglish & Tamil Doubt Clearer Card */}
                  {output.errorGuide && output.stderr && (
                    <div style={{
                      backgroundColor: 'rgba(220, 232, 213, 0.08)',
                      border: '1.5px solid var(--text-olive)',
                      borderRadius: '10px',
                      padding: '1rem',
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-sans)',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--bg-sage)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        marginBottom: '0.6rem',
                      }}>
                        <Sparkles size={16} />
                        <span>Doubt Clearer (Tanglish & Tamil Explanation)</span>
                      </div>

                      <div style={{
                        fontSize: '0.85rem',
                        color: '#E8EFE5',
                        lineHeight: 1.55,
                        marginBottom: '0.5rem',
                      }}>
                        <strong>Tanglish:</strong> {output.errorGuide.tanglish}
                      </div>

                      <div style={{
                        fontSize: '0.85rem',
                        color: '#C6D6C2',
                        lineHeight: 1.6,
                        fontFamily: 'var(--font-tamil)',
                        marginBottom: '0.6rem',
                      }}>
                        <strong>தமிழ்:</strong> {output.errorGuide.tamil}
                      </div>

                      <div style={{
                        fontSize: '0.8rem',
                        color: '#84B892',
                        fontWeight: 600,
                        backgroundColor: 'rgba(40, 56, 47, 0.4)',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                      }}>
                        💡 <strong>Quick Fix:</strong> {output.errorGuide.fix}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (max-width: 768px) {
          .playground-backdrop {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .playground-backdrop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
