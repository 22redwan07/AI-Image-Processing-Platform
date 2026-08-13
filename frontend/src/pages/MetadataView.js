import React, { useState } from 'react';
import { getMetadata } from '../services/api';

const MetadataView = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const res = await getMetadata(file);
      if (res.success) {
        setMetadata(res.metadata);
      } else {
        alert(res.error);
      }
    } catch (err) {
      alert('Error fetching metadata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Image Metadata</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="file" className="form-control" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Extract Metadata'}
        </button>
      </form>
      {metadata && (
        <div className="mt-4">
          <h5>Metadata</h5>
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default MetadataView;
