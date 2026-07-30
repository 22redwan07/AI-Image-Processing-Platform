import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const { output, operation } = location.state || { output: null, operation: '' };

  // Build image URL (assuming backend serves outputs)
  const imageUrl = output ? http://localhost:5000/outputs/ : null;

  return (
    <div>
      <h1>Result</h1>
      {imageUrl ? (
        <div>
          <p>Operation: {operation}</p>
          <img src={imageUrl} alt="Processed result" className="img-fluid border rounded" style={{ maxHeight: '500px' }} />
          <div className="mt-3">
            <a href={imageUrl} download className="btn btn-success me-2">
              <i className="bi bi-download"></i> Download
            </a>
            <Link to="/upload" className="btn btn-secondary">
              <i className="bi bi-arrow-left"></i> Back
            </Link>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No result to display. Please process an image first.</div>
      )}
    </div>
  );
};

export default Result;
