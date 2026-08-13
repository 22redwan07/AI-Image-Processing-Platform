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

export const colorAdjust = async (file, brightness = 0, contrast = 1.0, saturation = 1.0) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('brightness', String(brightness));
  formData.append('contrast', String(contrast));
  formData.append('saturation', String(saturation));
  const response = await api.post('/color-adjust', formData);
  return response.data;
};
// ----- NEW FUNCTIONS FOR ADVANCED FEATURES -----
export const processCommand = async (file, command) => {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('command', command);
  const res = await api.post('/process-command', fd);
  return res.data;
};

export const detectObjects = async (file) => {
  const fd = new FormData();
  fd.append('image', file);
  const res = await api.post('/object-detection', fd);
  return res.data;
};

export const extractOCR = async (file) => {
  const fd = new FormData();
  fd.append('image', file);
  const res = await api.post('/ocr', fd);
  return res.data;
};

export const removeBackground = async (file) => {
  const fd = new FormData();
  fd.append('image', file);
  const res = await api.post('/remove-background', fd);
  return res.data;
};

export const getHistory = async () => {
  const res = await api.get('/history');
  return res.data;
};

export const getMetadata = async (file) => {
  const fd = new FormData();
  fd.append('image', file);
  const res = await api.post('/metadata', fd);
  return res.data;
};

export const registerUser = async (username, password) => {
  const res = await api.post('/auth/register', { username, password });
  return res.data;
};

export const loginUser = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const batchProcess = async (files, operation) => {
  const fd = new FormData();
  files.forEach(f => fd.append('images', f));
  fd.append('operation', operation);
  const res = await api.post('/batch-process', fd);
  return res.data;
};
