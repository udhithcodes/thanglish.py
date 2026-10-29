import React, { createContext, useContext, useState, useCallback } from 'react';

const CodePlaygroundContext = createContext(null);

export function CodePlaygroundProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [initialCode, setInitialCode] = useState('');
  const [title, setTitle] = useState('Python Playground');
  const [topicContext, setTopicContext] = useState('');

  const openPlayground = useCallback((options = {}) => {
    const newCode = options.code !== undefined 
      ? options.code 
      : '# Write Python code here and click Run\nprint("Vanakkam Python! 🐍")\n';
    
    setCode(newCode);
    setInitialCode(newCode);
    setTitle(options.title || 'Interactive Python Playground');
    setTopicContext(options.context || '');
    setIsOpen(true);
  }, []);

  const closePlayground = useCallback(() => {
    setIsOpen(false);
  }, []);

  const togglePlayground = useCallback(() => {
    setIsOpen(prev => {
      if (!prev && !code) {
        const defaultSnippet = '# Write Python code here and click Run\nprint("Vanakkam Python! 🐍")\n';
        setCode(defaultSnippet);
        setInitialCode(defaultSnippet);
      }
      return !prev;
    });
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(initialCode);
  }, [initialCode]);

  const clearCode = useCallback(() => {
    setCode('');
  }, []);

  return (
    <CodePlaygroundContext.Provider
      value={{
        isOpen,
        code,
        setCode,
        title,
        topicContext,
        openPlayground,
        closePlayground,
        togglePlayground,
        resetCode,
        clearCode,
      }}
    >
      {children}
    </CodePlaygroundContext.Provider>
  );
}

export function useCodePlayground() {
  const context = useContext(CodePlaygroundContext);
  if (!context) {
    throw new Error('useCodePlayground must be used within a CodePlaygroundProvider');
  }
  return context;
}

export default CodePlaygroundContext;
