import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import ProcessingOptions from '../components/ProcessingOptions';
import { blurImage, sharpenImage, edgeDetection } from '../services/api';

const Manual = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleProcess = async (operation) => {
    if (!selectedFile) {
      alert('Please upload an image first.');
      return;
    }
    setProcessing(true);
    try {
      let response;
      switch (operation) {
        case 'blur':
          response = await blurImage(selectedFile);
          break;
        case 'sharpen':
          response = await sharpenImage(selectedFile);
          break;
        case 'edges':
          response = await edgeDetection(selectedFile);
          break;
        default:
          throw new Error('Unsupported operation');
      }
      // Navigate to result page with output filename
      navigate('/result', { state: { output: response.output, operation } });
    } catch (error) {
      alert('Processing failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Manual Processing</h1>
      <p>Upload an image, then select an operation.</p>
      <FileUpload onUpload={handleFileSelect} />
      {selectedFile && <p className="mt-2">Selected: {selectedFile.name}</p>}
      <ProcessingOptions onSelect={handleProcess} />
      {processing && <div className="spinner-border mt-3" role="status"></div>}
    </div>
  );
};

export default Manual;
