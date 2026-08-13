import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactCompareSlider } from 'react-compare-slider';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import {
  blurImage,
  sharpenImage,
  edgeDetection,
  colorAdjust,
  detectObjects,
  extractOCR,
  removeBackground,
  getMetadata,
  processCommand,
} from '../services/api';

Modal.setAppElement('#root');

const Process = () => {
  const location = useLocation();

  // === STATE ===
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [resultInfo, setResultInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');

  // Manual tab
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1.0);
  const [saturation, setSaturation] = useState(1.0);
  const [liveColorPreview, setLiveColorPreview] = useState(null);

  // Natural tab
  const [command, setCommand] = useState('');

  // Batch tab
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchOperation, setBatchOperation] = useState('blur');
  const [batchResults, setBatchResults] = useState([]);

  // Modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const canvasRef = useRef(null);
  const [originalImageData, setOriginalImageData] = useState(null);

  // === FILE UPLOAD ===
  useEffect(() => {
    if (location.state?.file) {
      handleFileSelect(location.state.file);
    }
  }, [location.state]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalPreview(url);
    setProcessedPreview(null);
    setLiveColorPreview(null);
    setResultInfo(null);
    setBatchResults([]);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      // Initial live color preview
      updateLiveColorPreview(0, 1.0, 1.0);
    };
    img.src = url;
  };

  // === LIVE COLOR PREVIEW (Canvas) ===
  const updateLiveColorPreview = (b, c, s) => {
    if (!originalImageData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = new ImageData(
      new Uint8ClampedArray(originalImageData.data),
      originalImageData.width,
      originalImageData.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let bv = data[i + 2];

      r = ((r / 255 - 0.5) * c + 0.5) * 255;
      g = ((g / 255 - 0.5) * c + 0.5) * 255;
      bv = ((bv / 255 - 0.5) * c + 0.5) * 255;

      r += b;
      g += b;
      bv += b;

      if (s !== 1.0) {
        const gray = 0.299 * r + 0.587 * g + 0.114 * bv;
        r = gray + (r - gray) * s;
        g = gray + (g - gray) * s;
        bv = gray + (bv - gray) * s;
      }

      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, bv));
    }

    ctx.putImageData(imageData, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setLiveColorPreview(dataUrl);
  };

  useEffect(() => {
    if (originalImageData) {
      updateLiveColorPreview(brightness, contrast, saturation);
    }
  }, [brightness, contrast, saturation]);

  // === OPERATION HANDLER ===
  const handleOperation = async (operation, apiCall, ...args) => {
    if (!selectedFile) {
      toast.error('Please upload an image first.');
      return;
    }
    setProcessing(true);
    setResultInfo(null);

    try {
      let response;
      if (operation === 'color') {
        response = await apiCall(selectedFile, brightness, contrast, saturation);
      } else {
        response = await apiCall(selectedFile, ...args);
      }

      if (response.success === false) {
        toast.error(response.error || 'Operation failed');
        setProcessing(false);
        return;
      }

      // Metadata - no image output
      if (operation === 'metadata') {
        setResultInfo({ type: 'metadata', data: response.metadata });
        setProcessedPreview(null);
        toast.success('Metadata extracted!');
        setProcessing(false);
        return;
      }

      // OCR
      if (operation === 'ocr') {
        setResultInfo({ type: 'ocr', data: response.detections || [] });
        toast.success(`OCR: ${response.detections?.length || 0} blocks found`);
      }

      // YOLO
      if (operation === 'object_detection') {
        setResultInfo({ type: 'yolo', data: response.objects || [] });
        toast.success(`YOLO: ${response.objects?.length || 0} objects detected`);
      }

      // Image output
      if (response.output) {
        const processedUrl = `http://localhost:5000/outputs/${response.output}`;
        setProcessedPreview(processedUrl);
        setLiveColorPreview(null); // clear live preview
      }

    } catch (error) {
      toast.error(error.message || 'Processing failed');
    } finally {
      setProcessing(false);
    }
  };

  // === MANUAL TAB HANDLERS ===
  const handleBlur = () => handleOperation('blur', blurImage);
  const handleSharpen = () => handleOperation('sharpen', sharpenImage);
  const handleEdges = () => handleOperation('edges', edgeDetection);
  const handleColor = () => handleOperation('color', colorAdjust);
  const handleObjectDetection = () => handleOperation('object_detection', detectObjects);
  const handleOCR = () => handleOperation('ocr', extractOCR);
  const handleRemoveBg = () => handleOperation('remove_background', removeBackground);
  const handleMetadata = () => handleOperation('metadata', getMetadata);

  // === NATURAL TAB ===
  const handleNaturalCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) {
      toast.error('Please enter a command.');
      return;
    }
    if (!selectedFile) {
      toast.error('Please upload an image first.');
      return;
    }
    setProcessing(true);
    setResultInfo(null);

    try {
      const response = await processCommand(selectedFile, command);
      if (!response.success) {
        toast.error(response.error || 'Command failed');
        setProcessing(false);
        return;
      }

      if (response.output) {
        const processedUrl = `http://localhost:5000/outputs/${response.output}`;
        setProcessedPreview(processedUrl);
        setLiveColorPreview(null);
      }

      if (response.operation === 'ocr' && response.detections) {
        setResultInfo({ type: 'ocr', data: response.detections });
        toast.success(`OCR: ${response.detections.length} blocks`);
      }
      if (response.operation === 'object_detection' && response.objects) {
        setResultInfo({ type: 'yolo', data: response.objects });
        toast.success(`YOLO: ${response.objects.length} objects`);
      }
      if (response.operation === 'metadata' && response.metadata) {
        setResultInfo({ type: 'metadata', data: response.metadata });
        toast.success('Metadata extracted');
      }
      setCommand('');
    } catch (error) {
      toast.error(error.message || 'Command failed');
    } finally {
      setProcessing(false);
    }
  };

  // === BATCH TAB ===
  const handleBatchProcess = async () => {
    if (batchFiles.length === 0) {
      toast.error('Please select at least one image.');
      return;
    }
    setProcessing(true);
    setBatchResults([]);

    try {
      const formData = new FormData();
      batchFiles.forEach((f) => formData.append('images', f));
      formData.append('operation', batchOperation);

      const res = await fetch('http://localhost:5000/api/batch-process', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setBatchResults(data.results);
        toast.success(`Processed ${data.results.length} images`);

        // Show first successful result in preview
        const firstSuccess = data.results.find(r => r.success);
        if (firstSuccess) {
          const processedUrl = `http://localhost:5000/outputs/${firstSuccess.output}`;
          setProcessedPreview(processedUrl);
          setLiveColorPreview(null);
        }
      } else {
        toast.error('Batch failed: ' + (data.error || 'Unknown error'));
      }
    } catch (e) {
      toast.error('Batch error: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  // === MODAL ===
  const openModal = (src) => {
    setModalImage(src);
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setModalImage(null);
  };

  // === DISPLAY ===
  const displayPreview = processedPreview || liveColorPreview;
  const previewLabel = processedPreview ? 'Processed' : 'Live Preview';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="container-fluid py-4"
    >
      <div className="row g-4">
        {/* LEFT PANEL */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <h4 className="mb-3">
              <i className="bi bi-upload me-2 text-primary"></i>Upload Image
            </h4>

            {/* Upload Area */}
            <div
              className="border border-2 border-dashed rounded-3 p-4 text-center bg-light"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]);
              }}
            >
              <i className="bi bi-cloud-upload fs-1 text-primary"></i>
              <p className="mt-2 text-muted">Drag & drop or click to select</p>
              <input
                type="file"
                accept="image/*"
                className="d-none"
                id="fileInput"
                onChange={(e) => {
                  if (e.target.files[0]) handleFileSelect(e.target.files[0]);
                }}
              />
              <button className="btn btn-primary" onClick={() => document.getElementById('fileInput').click()}>
                Choose File
              </button>
            </div>
            {selectedFile && <p className="mt-2 text-muted">Selected: {selectedFile.name}</p>}

            <hr className="my-4" />

            {/* TABS */}
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
                  onClick={() => setActiveTab('manual')}
                >
                  <i className="bi bi-tools me-1"></i>Manual
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'natural' ? 'active' : ''}`}
                  onClick={() => setActiveTab('natural')}
                >
                  <i className="bi bi-mic me-1"></i>Natural
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'batch' ? 'active' : ''}`}
                  onClick={() => setActiveTab('batch')}
                >
                  <i className="bi bi-files me-1"></i>Batch
                </button>
              </li>
            </ul>

            {/* === MANUAL TAB === */}
            {activeTab === 'manual' && (
              <div>
                <h5 className="mb-2">Processing Options</h5>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <button className="btn btn-primary" onClick={handleBlur} disabled={processing}>
                    <i className="bi bi-eraser me-1"></i>Blur
                  </button>
                  <button className="btn btn-primary" onClick={handleSharpen} disabled={processing}>
                    <i className="bi bi-pencil me-1"></i>Sharpen
                  </button>
                  <button className="btn btn-primary" onClick={handleEdges} disabled={processing}>
                    <i className="bi bi-bounding-box-circles me-1"></i>Edges
                  </button>
                  <button className="btn btn-success" onClick={handleObjectDetection} disabled={processing}>
                    <i className="bi bi-eye me-1"></i>YOLO
                  </button>
                  <button className="btn btn-success" onClick={handleOCR} disabled={processing}>
                    <i className="bi bi-textarea me-1"></i>OCR
                  </button>
                  <button className="btn btn-success" onClick={handleRemoveBg} disabled={processing}>
                    <i className="bi bi-image me-1"></i>Remove BG
                  </button>
                  <button className="btn btn-info text-white" onClick={handleMetadata} disabled={processing}>
                    <i className="bi bi-info-circle me-1"></i>Metadata
                  </button>
                </div>

                <div className="card p-3 bg-light border">
                  <h6><i className="bi bi-palette me-2"></i>Color Adjustment</h6>
                  <div className="mb-2">
                    <label className="form-label">Brightness: {brightness}</label>
                    <input
                      type="range"
                      className="form-range"
                      min="-100"
                      max="100"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Contrast: {contrast.toFixed(1)}</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0.0"
                      max="3.0"
                      step="0.1"
                      value={contrast}
                      onChange={(e) => setContrast(parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Saturation: {saturation.toFixed(1)}</label>
                    <input
                      type="range"
                      className="form-range"
                      min="0.0"
                      max="3.0"
                      step="0.1"
                      value={saturation}
                      onChange={(e) => setSaturation(parseFloat(e.target.value))}
                    />
                  </div>
                  <button className="btn btn-primary mt-2" onClick={handleColor} disabled={processing}>
                    Apply Color (Backend)
                  </button>
                  <small className="text-muted mt-1 d-block">
                    * Sliders give live preview. Click "Apply Color" to save.
                  </small>
                </div>
              </div>
            )}

            {/* === NATURAL TAB === */}
            {activeTab === 'natural' && (
              <div>
                <h5 className="mb-2">Natural Language Command</h5>
                <form onSubmit={handleNaturalCommand}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder='e.g., "Sharpen this image"'
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    <i className="bi bi-send me-1"></i>Send Command
                  </button>
                </form>
                <small className="text-muted mt-2 d-block">
                  * blur, sharpen, edges, object detection, OCR, remove background,
                  metadata, rotate, flip, resize, brightness, contrast, grayscale
                </small>
              </div>
            )}

            {/* === BATCH TAB === */}
            {activeTab === 'batch' && (
              <div>
                <h5 className="mb-2">Batch Processing</h5>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    accept="image/*"
                    onChange={(e) => setBatchFiles(Array.from(e.target.files))}
                  />
                  <small className="text-muted">Select multiple images</small>
                </div>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={batchOperation}
                    onChange={(e) => setBatchOperation(e.target.value)}
                  >
                    <option value="blur">Blur</option>
                    <option value="sharpen">Sharpen</option>
                    <option value="edges">Edge Detection</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary"
                  disabled={processing || batchFiles.length === 0}
                  onClick={handleBatchProcess}
                >
                  <i className="bi bi-play me-1"></i>Process Batch
                </button>

                {batchResults.length > 0 && (
                  <div className="mt-3">
                    <h6>Results ({batchResults.length})</h6>
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                      {batchResults.map((r, i) => (
                        <div
                          key={i}
                          className="d-flex justify-content-between align-items-center border-bottom py-1"
                        >
                          <span className="text-truncate" style={{ maxWidth: '100px', fontSize: '13px' }}>
                            {r.filename}
                          </span>
                          {r.success ? (
                            <span className="badge bg-success" style={{ fontSize: '11px' }}>
                              ✅ {r.output}
                            </span>
                          ) : (
                            <span className="badge bg-danger" style={{ fontSize: '11px' }}>
                              ❌ {r.error}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {processing && (
              <div className="mt-3 text-center text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Processing...
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL - PREVIEW */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h4 className="mb-3"><i className="bi bi-eye me-2 text-primary"></i>Preview</h4>

            {originalPreview && displayPreview ? (
              <div>
                <div className="compare-slider-container">
                  <ReactCompareSlider
                    itemOne={
                      <img src={originalPreview} alt="Original" style={{ width: '100%', display: 'block' }} />
                    }
                    itemTwo={
                      <img src={displayPreview} alt="Processed" style={{ width: '100%', display: 'block' }} />
                    }
                    orientation="horizontal"
                    handleColor="#0d6efd"
                    handleSize={40}
                  />
                </div>
                <div className="d-flex justify-content-between mt-2 text-muted small">
                  <span>Original</span>
                  <span>{previewLabel}</span>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-6">
                  <h6 className="text-muted">Original</h6>
                  {originalPreview ? (
                    <div className="border rounded-3 overflow-hidden bg-light">
                      <img
                        src={originalPreview}
                        alt="Original"
                        onClick={() => openModal(originalPreview)}
                        style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', cursor: 'pointer' }}
                      />
                    </div>
                  ) : (
                    <div className="border rounded-3 p-5 text-center text-muted bg-light">
                      <i className="bi bi-image fs-1"></i>
                      <p>No image</p>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted">{previewLabel}</h6>
                  {displayPreview ? (
                    <div className="border rounded-3 overflow-hidden bg-light">
                      <img
                        src={displayPreview}
                        alt="Preview"
                        onClick={() => openModal(displayPreview)}
                        style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', cursor: 'pointer' }}
                      />
                    </div>
                  ) : (
                    <div className="border rounded-3 p-5 text-center text-muted bg-light">
                      <i className="bi bi-hourglass-split fs-1"></i>
                      <p>Waiting</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Result Info */}
            {resultInfo && (
              <div className="mt-3 p-3 bg-light rounded-3 border">
                {resultInfo.type === 'ocr' && (
                  <div>
                    <h6 className="mb-1">📝 Detected Text</h6>
                    {resultInfo.data.length === 0 ? (
                      <p className="mb-0 text-muted">No text detected.</p>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {resultInfo.data.map((item, idx) => (
                          <li key={idx}>
                            <strong>{item.text}</strong> (confidence: {item.confidence})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {resultInfo.type === 'yolo' && (
                  <div>
                    <h6 className="mb-1">🔍 Detected Objects</h6>
                    {resultInfo.data.length === 0 ? (
                      <p className="mb-0 text-muted">No objects detected.</p>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {resultInfo.data.map((obj, idx) => (
                          <li key={idx}>
                            <span className="badge bg-primary me-1">{obj.class}</span> {obj.confidence}%
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {resultInfo.type === 'metadata' && (
                  <div>
                    <h6 className="mb-1">📋 Metadata</h6>
                    <pre style={{ fontSize: '11px', margin: 0 }}>{JSON.stringify(resultInfo.data, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {displayPreview && originalPreview && (
              <div className="mt-3 text-center">
                <a href={displayPreview} download className="btn btn-success">
                  <i className="bi bi-download me-1"></i>Download
                </a>
                <button className="btn btn-outline-secondary ms-2" onClick={() => openModal(displayPreview)}>
                  <i className="bi bi-zoom-in me-1"></i>Zoom
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
          },
          content: {
            background: 'transparent',
            border: 'none',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        {modalImage && (
          <img
            src={modalImage}
            alt="Zoom"
            className="img-fluid rounded-3 shadow-lg"
            onClick={closeModal}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              cursor: 'pointer',
              objectFit: 'contain',
            }}
          />
        )}
      </Modal>
    </motion.div>
  );
};

export default Process;