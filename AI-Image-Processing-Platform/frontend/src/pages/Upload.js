import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { uploadImage } from '../services/api';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await uploadImage(file);
      setMessage(Upload successful: );
    } catch (error) {
      setMessage('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <FileUpload onUpload={handleUpload} />
      {uploading && <div className="spinner-border mt-3" role="status"></div>}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Upload;
