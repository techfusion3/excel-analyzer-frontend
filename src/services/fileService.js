import api from '../api/config';

// Get list of uploaded files
export const getFiles = async () => {
  try {
    const response = await api.get('/api/files');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a single file by ID
export const getFileById = async (fileId) => {
  try {
    const response = await api.get(`/api/files/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload a file
export const uploadFile = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get file columns/structure
export const getFileStructure = async (fileId) => {
  try {
    const response = await api.get(`/api/files/${fileId}/structure`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Generate chart from file
export const generateChart = async (fileId, config) => {
  try {
    const response = await api.post(`/api/files/${fileId}/chart`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a file
export const deleteFile = async (fileId) => {
  try {
    const response = await api.delete(`/api/files/${fileId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
