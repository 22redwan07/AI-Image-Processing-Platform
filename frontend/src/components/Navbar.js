import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // আপনার লোগো পাথ ঠিক রাখুন

const Navbar = () => {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark py-3" 
      style={{
        background: 'linear-gradient(135deg, #0a2540 0%, #1a3a5c 50%, #2d4b6e 100%)',
        zIndex: 1050,
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/">
          <img src={logo} alt="Logo" height="35" className="me-2" />
          AI Image Processor
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink 
                className="nav-link px-3 text-white-50" 
                to="/"
                style={({ isActive }) => isActive ? { color: '#fff', fontWeight: '600' } : {}}
              >
                Home
              </NavLink>
            </li>

            {/* ৩ ডট মেনু (ড্রপডাউন) */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center text-white-50"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ padding: '0.5rem 0.75rem' }}
              >
                <i className="bi bi-three-dots-vertical fs-4"></i>
              </a>
              <ul 
                className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2" 
                aria-labelledby="navbarDropdown" 
                style={{ 
                  minWidth: '200px', 
                  borderRadius: '0.75rem',
                  background: '#ffffff',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }}
              >
                <li><Link className="dropdown-item py-2" to="/process"><i className="bi bi-tools me-2 text-primary"></i>Processing</Link></li>
                <li><Link className="dropdown-item py-2" to="/upload"><i className="bi bi-upload me-2 text-primary"></i>Upload</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item py-2" to="/about"><i className="bi bi-info-circle me-2 text-primary"></i>About</Link></li>
                <li><Link className="dropdown-item py-2" to="/contact"><i className="bi bi-envelope me-2 text-primary"></i>Contact</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;