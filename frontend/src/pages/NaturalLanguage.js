import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const NaturalLanguage = () => {
  const [command, setCommand] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (file) => setSelectedFile(file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload an image.');
      return;
    }
    if (!command.trim()) {
      alert('Please enter a command.');
      return;
    }
    setProcessing(true);
    try {
      // Placeholder: send command and file to backend (not yet implemented)
      // For demo, we simply navigate to result with mock data
      navigate('/result', { state: { output: 'demo_output.png', operation: command } });
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Natural Language Command</h1>
      <p>Type a command like "Sharpen this image" or "Detect objects".</p>
      <FileUpload onUpload={handleFileSelect} />
      {selectedFile && <p className="mt-2">Selected: {selectedFile.name}</p>}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="e.g., Sharpen this image"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={processing}>
          {processing ? 'Processing...' : 'Send Command'}
        </button>
      </form>
    </div>
  );
};

export default NaturalLanguage;
