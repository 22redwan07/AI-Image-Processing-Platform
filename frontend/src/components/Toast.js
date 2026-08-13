import React from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;
  const bgClass = type === 'success' ? 'bg-success' : type === 'danger' ? 'bg-danger' : 'bg-info';
  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
      <div className={	oast show  text-white} role="alert">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
