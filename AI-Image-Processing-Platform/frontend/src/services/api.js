import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData);
  return response.data;
};

export const blurImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/blur', formData);
  return response.data;
};

export const sharpenImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/sharpen', formData);
  return response.data;
};

export const edgeDetection = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/edge-detection', formData);
  return response.data;
};

// Placeholder for other operations - will be implemented later
export const enhanceImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/enhance', formData);
  return response.data;
};
// ... additional API calls can be added as needed
