import React from 'react';

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  return (
    <button
      className={tn btn- }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
