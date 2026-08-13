import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const { output, operation, originalUrl } = location.state || { output: null, operation: '', originalUrl: null };

  // ✅ সঠিক টেমপ্লেট লিটারেল ব্যবহার করুন (ব্যাকটিক `)
  const processedUrl = output ? `http://localhost:5000/outputs/${output}` : null;

  return (
    <div>
      <h1>Result</h1>
      {processedUrl && originalUrl ? (
        <div>
          <p><strong>Operation:</strong> {operation}</p>
          <div className="row">
            <div className="col-md-6">
              <h5>Original</h5>
              <img src={originalUrl} alt="Original" className="img-fluid border rounded" style={{ maxHeight: '400px' }} />
            </div>
            <div className="col-md-6">
              <h5>Processed</h5>
              <img src={processedUrl} alt="Processed" className="img-fluid border rounded" style={{ maxHeight: '400px' }} />
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <a href={processedUrl} download className="btn btn-success">
              <i className="bi bi-download me-1"></i>Download Processed
            </a>
            <Link to="/manual" className="btn btn-secondary">
              <i className="bi bi-arrow-left me-1"></i>Back to Manual
            </Link>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">
          No result to display. Please process an image first.
          <Link to="/manual" className="ms-3">Go to Manual</Link>
        </div>
      )}
    </div>
  );
};

export default Result;