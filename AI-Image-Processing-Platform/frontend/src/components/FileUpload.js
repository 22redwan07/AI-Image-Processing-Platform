import React, { useRef } from 'react';

const FileUpload = ({ onUpload }) => {
  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="border border-2 border-dashed rounded p-5 text-center"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ borderColor: '#0d6efd', backgroundColor: '#f8f9fa' }}
    >
      <i className="bi bi-cloud-upload fs-1 text-primary"></i>
      <p className="mt-2">Drag & drop an image here, or click to select</p>
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        className="d-none"
        onChange={handleFileChange}
      />
      <button className="btn btn-primary" onClick={() => fileInput.current.click()}>
        Choose File
      </button>
    </div>
  );
};

export default FileUpload;
