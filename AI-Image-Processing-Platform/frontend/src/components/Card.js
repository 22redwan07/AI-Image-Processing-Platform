import React from 'react';

const Card = ({ icon, title, description }) => {
  return (
    <div className="card h-100 text-center p-3">
      <div className="card-body">
        <i className={i  fs-1 text-primary}></i>
        <h5 className="card-title mt-3">{title}</h5>
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
};

export default Card;
