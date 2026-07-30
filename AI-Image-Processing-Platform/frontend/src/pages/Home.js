import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

const Home = () => {
  const features = [
    { icon: 'bi-upload', title: 'Upload Images', desc: 'Drag and drop or select images to process.' },
    { icon: 'bi-sliders', title: 'Manual Controls', desc: 'Choose from a variety of image operations.' },
    { icon: 'bi-mic', title: 'Natural Language', desc: 'Type commands like "Sharpen this image" and let AI handle it.' },
    { icon: 'bi-cpu', title: 'AI Powered', desc: 'Future integration with YOLO, OCR, and more.' }
  ];

  return (
    <div>
      <div className="hero text-center">
        <h1 className="display-3 fw-bold">AI Image Processing Platform</h1>
        <p className="lead">Upload, process, and transform images with advanced AI tools.</p>
        <Link to="/upload" className="btn btn-light btn-lg mt-3">
          <i className="bi bi-upload me-2"></i>Get Started
        </Link>
      </div>

      <section className="my-5">
        <h2 className="text-center mb-4">Features</h2>
        <div className="row g-4">
          {features.map((f, idx) => (
            <div className="col-md-3" key={idx}>
              <Card icon={f.icon} title={f.title} description={f.desc} />
            </div>
          ))}
        </div>
      </section>

      <section className="my-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="row text-center">
          <div className="col-md-4">
            <i className="bi bi-cloud-upload fs-1 text-primary"></i>
            <h5 className="mt-2">1. Upload</h5>
            <p>Select an image from your device.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-gear fs-1 text-primary"></i>
            <h5 className="mt-2">2. Process</h5>
            <p>Choose an operation or type a command.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-download fs-1 text-primary"></i>
            <h5 className="mt-2">3. Download</h5>
            <p>Get your processed image instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
