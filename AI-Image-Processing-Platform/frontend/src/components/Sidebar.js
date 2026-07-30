import React from 'react';

// Optional sidebar component
const Sidebar = () => {
  return (
    <div className="bg-light border-end p-3" style={{ width: '250px' }}>
      <h5>Tools</h5>
      <ul className="list-unstyled">
        <li><a href="#" className="text-decoration-none">Blur</a></li>
        <li><a href="#" className="text-decoration-none">Sharpen</a></li>
        <li><a href="#" className="text-decoration-none">Edge Detection</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
