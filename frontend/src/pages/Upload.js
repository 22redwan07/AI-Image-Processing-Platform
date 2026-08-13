import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { uploadImage } from '../services/api';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setMessage('Upload successful: '+res.filename);
    } catch(e) {
      setMessage('Upload failed: '+e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = () => {
    if (selectedFile) navigate('/manual', { state: { file: selectedFile } });
    else alert('Please upload an image first.');
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <FileUpload onUpload={handleFileSelect} />
      {uploading && <div className="spinner-border mt-3"></div>}
      {message && <div className="alert alert-info mt-3">{message}</div>}
      {previewUrl && (
        <div className="mt-4">
          <h5>Original Image</h5>
          <img src={previewUrl} alt="preview" className="img-fluid border rounded" style={{ maxHeight: '400px' }} />
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleProcess}>
              <i className="bi bi-gear me-2"></i>Process with Manual Tools
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Upload;
