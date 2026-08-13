import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';

const History = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(data => {
        setRecords(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;

  return (
    <div className="container mt-4">
      <h2>Processing History</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Date</th>
              <th>Original</th>
              <th>Operation</th>
              <th>Status</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan="5" className="text-center">No records yet</td></tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={idx}>
                  <td>{rec.timestamp}</td>
                  <td>{rec.original_filename}</td>
                  <td>{rec.operation}</td>
                  <td>
                    <span className={rec.status === 'success' ? 'badge bg-success' : 'badge bg-danger'}>
                      {rec.status}
                    </span>
                  </td>
                  <td>{rec.output_filename || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;