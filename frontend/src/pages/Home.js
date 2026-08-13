import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const Home = () => {
  const features = [
    { icon: 'bi-upload', title: 'Upload Images', desc: 'Drag and drop or select images to process instantly.' },
    { icon: 'bi-sliders', title: 'Manual Controls', desc: 'Choose from a variety of image operations like blur, sharpen, edge detection.' },
    { icon: 'bi-mic', title: 'Natural Language', desc: 'Type commands like "Sharpen this image" and let AI handle it.' },
    { icon: 'bi-cpu', title: 'AI Powered', desc: 'Future integration with YOLO, OCR, and more.' }
  ];

  return (
    <div>
      {/* Hero Section - Premium Gradient */}
      <div className="hero-section py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <span className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill">
                <i className="bi bi-stars me-1"></i>
              </span>
              <h1 className="display-3 fw-bold mb-3" style={{ color: '#1a1a2e' }}>
                AI Image Processing <br />
                <span style={{ background: 'linear-gradient(135deg, #0d6efd, #6610f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Platform</span>
              </h1>
              <p className="lead mb-4 text-secondary">
                Upload, process, and transform images with advanced AI tools. Experience the future of image editing.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/process" className="btn btn-primary btn-lg px-5 py-3 shadow-sm">
                  <i className="bi bi-rocket me-2"></i>Get Started
                </Link>
                <Link to="/about" className="btn btn-outline-secondary btn-lg px-4 py-3">
                  <i className="bi bi-info-circle me-2"></i>Learn More
                </Link>
              </div>
              <div className="mt-4 d-flex justify-content-center gap-4 text-secondary">
                <span><i className="bi bi-check-circle-fill text-primary me-1"></i> Free to use</span>
                <span><i className="bi bi-check-circle-fill text-primary me-1"></i> No registration</span>
                <span><i className="bi bi-check-circle-fill text-primary me-1"></i> Instant results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="container my-5">
        <h2 className="text-center mb-4 fw-bold">Everything you need</h2>
        <div className="row g-4">
          {features.map((f, idx) => (
            <div className="col-md-3" key={idx}>
              <Card icon={f.icon} title={f.title} description={f.desc} />
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container my-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-4 bg-light rounded-3">
              <i className="bi bi-cloud-upload fs-1 text-primary"></i>
              <h5 className="mt-2">1. Upload</h5>
              <p className="text-muted">Select an image from your device.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-light rounded-3">
              <i className="bi bi-gear fs-1 text-primary"></i>
              <h5 className="mt-2">2. Process</h5>
              <p className="text-muted">Choose an operation or type a command.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-light rounded-3">
              <i className="bi bi-download fs-1 text-primary"></i>
              <h5 className="mt-2">3. Download</h5>
              <p className="text-muted">Get your processed image instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;