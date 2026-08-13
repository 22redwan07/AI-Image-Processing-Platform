import React from 'react';

const ProcessingOptions = ({ onSelect }) => {
  const operations = [
    { key: 'blur', label: 'Blur', icon: 'bi-eraser' },
    { key: 'sharpen', label: 'Sharpen', icon: 'bi-pencil' },
    { key: 'edges', label: 'Edge Detection', icon: 'bi-bounding-box-circles' },
  ];

  return (
    <div className="my-3">
      <h5>Select Operation</h5>
      <div className="d-flex flex-wrap gap-2">
        {operations.map((op) => (
          <button
            key={op.key}
            className="btn btn-outline-primary"
            onClick={() => onSelect(op.key)}
          >
            <i className={`${op.icon} me-1`}></i> {op.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProcessingOptions;
