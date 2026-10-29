import { apiRequest } from './api';

export const quizService = {
  startQuiz: (payload) => {
    return apiRequest('/quiz/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  submitQuiz: (payload) => {
    return apiRequest('/quiz/submit', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getHistory: () => {
    return apiRequest('/quiz/history');
  },
};

export const progressService = {
  getDashboardProgress: () => {
    return apiRequest('/progress');
  },
};
