import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer py-5 mt-5" style={{ backgroundColor: '#1a1a2e', color: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-white">
              <i className="bi bi-cpu me-2"></i>AI Image Processor
            </h5>
            <p className="text-light" style={{ opacity: 0.85 }}>
              A modern platform for intelligent image processing.
            </p>
            <div className="d-flex gap-3">
              {/* GitHub – আপনার ইউজারনেম বসান */}
              <a href="https://github.com/22redwan07" target="_blank" rel="noopener noreferrer" className="text-light" style={{ opacity: 0.7 }}>
                <i className="bi bi-github fs-5"></i>
              </a>
              {/* LinkedIn – আপনার প্রোফাইল লিংক বসান */}
              <a href="https://www.linkedin.com/in/md-redwan-shiddiki" target="_blank" rel="noopener noreferrer" className="text-light" style={{ opacity: 0.7 }}>
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              {/* চাইলে টুইটার/ফেসবুকও যোগ করতে পারেন */}
              <a href="https://www.facebook.com/redwanshiddik22382" target="_blank" rel="noopener noreferrer" className="text-light" style={{ opacity: 0.7 }}>
                <i className="bi bi-facebook fs-5"></i>
              </a>
            </div>
          </div>
          <div className="col-md-2 mb-4">
            <h6 className="text-white fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>Home</Link></li>
              <li><Link to="/process" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>Process</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>About</Link></li>
            </ul>
          </div>
          <div className="col-md-2 mb-4">
            <h6 className="text-white fw-bold">Resources</h6>
            <ul className="list-unstyled">
              <li><Link to="/docs" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>Docs</Link></li>
              <li><Link to="/api" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>API</Link></li>
              <li><Link to="/support" className="text-light text-decoration-none" style={{ opacity: 0.8 }}>Support</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h6 className="text-white fw-bold">Stay Updated</h6>
            <p className="text-light" style={{ opacity: 0.8 }}>Subscribe to receive updates.</p>
            <div className="input-group">
              <input type="email" className="form-control" placeholder="Email address" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }} />
              <button className="btn btn-primary" type="button">Subscribe</button>
            </div>
          </div>
        </div>
        <hr className="border-secondary" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <div className="text-center text-light" style={{ opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} AI Image Processing Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;