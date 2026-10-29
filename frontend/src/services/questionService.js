import { apiRequest } from './api';

export const questionService = {
  getTopics: (level = null) => {
    const query = level ? `?level=${encodeURIComponent(level)}` : '';
    return apiRequest(`/questions/topics${query}`);
  },

  getQuestions: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.level) searchParams.append('level', params.level);
    if (params.topicId) searchParams.append('topic_id', params.topicId);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.offset) searchParams.append('offset', params.offset);

    const qs = searchParams.toString();
    return apiRequest(`/questions${qs ? `?${qs}` : ''}`);
  },

  getQuestionById: (id) => {
    return apiRequest(`/questions/${id}`);
  },

  evaluateAnswer: (payload) => {
    return apiRequest('/questions/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  runCode: (code, inputData = '') => {
    return apiRequest('/questions/run-code', {
      method: 'POST',
      body: JSON.stringify({ code, input_data: inputData }),
    });
  },

  toggleBookmark: (questionId) => {
    return apiRequest(`/bookmarks/${questionId}`, {
      method: 'POST',
    });
  },

  getBookmarks: () => {
    return apiRequest('/bookmarks');
  },

  getIncorrectQuestions: () => {
    return apiRequest('/questions/incorrect');
  },
};

export default questionService;
