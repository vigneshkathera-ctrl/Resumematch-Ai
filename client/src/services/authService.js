import api from './api';

export const authService = {
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export const analysisService = {
  async analyze(formData, onUploadProgress) {
    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress
    });
    return response.data;
  },

  async getAnalyses() {
    const response = await api.get('/analyses');
    return response.data;
  },

  async getAnalysisById(id) {
    const response = await api.get(`/analyses/${id}`);
    return response.data;
  },

  async deleteAnalysis(id) {
    const response = await api.delete(`/analyses/${id}`);
    return response.data;
  }
};

