# fix-project.ps1
# AI Image Processing Platform – Complete Fix Script
# এটি সব ফাইল ঠিক করবে, ডিপেন্ডেন্সি ইনস্টল করবে এবং সার্ভার চালু করবে।

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Image Processing Platform Fixer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# ১. পাথ ডিফাইন
$Root = Get-Location
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

# ২. ব্যাকএন্ড ফাইল ওভাররাইট
Write-Host "`n[1] Writing Backend Files..." -ForegroundColor Yellow

# app.py
@"
import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from routes import register_blueprints
from utils.error_handlers import register_error_handlers

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    register_blueprints(app)
    register_error_handlers(app)

    @app.route('/outputs/<filename>')
    def serve_output(filename):
        return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

    return app

app = create_app()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
"@ | Out-File -FilePath (Join-Path $Backend "app.py") -Encoding utf8

# config.py
@"
import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    OUTPUT_FOLDER = os.path.join(os.getcwd(), 'outputs')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    os.makedirs(os.path.join(os.getcwd(), 'logs'), exist_ok=True)
    os.makedirs(os.path.join(os.getcwd(), 'models'), exist_ok=True)
"@ | Out-File -FilePath (Join-Path $Backend "config.py") -Encoding utf8

# requirements.txt
@"
Flask==2.3.3
flask-cors==4.0.0
python-dotenv==1.0.0
opencv-python==4.8.1.78
numpy==1.24.3
Pillow==10.0.0
"@ | Out-File -FilePath (Join-Path $Backend "requirements.txt") -Encoding utf8

# services/image_processing.py
@"
import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
from config import Config

class ImageProcessor:
    @staticmethod
    def save_uploaded_file(file):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        return filepath

    @staticmethod
    def blur_image(filepath):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        blurred = cv2.GaussianBlur(img, (5,5), 0)
        return ImageProcessor._save_output(blurred, "blur")

    @staticmethod
    def sharpen_image(filepath):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        kernel = np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
        sharpened = cv2.filter2D(img, -1, kernel)
        return ImageProcessor._save_output(sharpened, "sharpen")

    @staticmethod
    def edge_detection(filepath):
        img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Could not read image")
        edges = cv2.Canny(img, 100, 200)
        return ImageProcessor._save_output(edges, "edges")

    @staticmethod
    def adjust_color(filepath, brightness=0, contrast=1.0, saturation=1.0):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        img = cv2.convertScaleAbs(img, alpha=contrast, beta=brightness)
        if saturation != 1.0:
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
            hsv[:,:,1] = np.clip(hsv[:,:,1] * saturation, 0, 255)
            img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        return ImageProcessor._save_output(img, "color_adj")

    @staticmethod
    def _save_output(image, prefix):
        import time
        filename = f"{prefix}_{int(time.time())}.png"
        output_path = os.path.join(Config.OUTPUT_FOLDER, filename)
        cv2.imwrite(output_path, image)
        return output_path
"@ | Out-File -FilePath (Join-Path $Backend "services\image_processing.py") -Encoding utf8

# routes/__init__.py
@"
from .upload import upload_bp
from .blur import blur_bp
from .sharpen import sharpen_bp
from .edge_detection import edge_bp
from .health import health_bp
from .placeholders import placeholders_bp

def register_blueprints(app):
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(blur_bp, url_prefix='/api')
    app.register_blueprint(sharpen_bp, url_prefix='/api')
    app.register_blueprint(edge_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(placeholders_bp, url_prefix='/api')
"@ | Out-File -FilePath (Join-Path $Backend "routes\__init__.py") -Encoding utf8

# routes/upload.py
@"
from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400
    if not validate_image_file(file):
        return jsonify({'error': 'Invalid file type'}), 400
    filepath = ImageProcessor.save_uploaded_file(file)
    return jsonify({'message':'Uploaded','filename':file.filename}), 200
"@ | Out-File -FilePath (Join-Path $Backend "routes\upload.py") -Encoding utf8

# routes/blur.py
@"
from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

blur_bp = Blueprint('blur', __name__)

@blur_bp.route('/blur', methods=['POST'])
def blur_image():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.blur_image(path)
    return jsonify({'output':os.path.basename(out)}),200
"@ | Out-File -FilePath (Join-Path $Backend "routes\blur.py") -Encoding utf8

# routes/sharpen.py
@"
from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

sharpen_bp = Blueprint('sharpen', __name__)

@sharpen_bp.route('/sharpen', methods=['POST'])
def sharpen_image():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.sharpen_image(path)
    return jsonify({'output':os.path.basename(out)}),200
"@ | Out-File -FilePath (Join-Path $Backend "routes\sharpen.py") -Encoding utf8

# routes/edge_detection.py
@"
from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

edge_bp = Blueprint('edge_detection', __name__)

@edge_bp.route('/edge-detection', methods=['POST'])
def edge_detection():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.edge_detection(path)
    return jsonify({'output':os.path.basename(out)}),200
"@ | Out-File -FilePath (Join-Path $Backend "routes\edge_detection.py") -Encoding utf8

# routes/health.py
@"
from flask import Blueprint, jsonify
health_bp = Blueprint('health', __name__)
@health_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status':'healthy'}),200
"@ | Out-File -FilePath (Join-Path $Backend "routes\health.py") -Encoding utf8

# routes/placeholders/__init__.py
@"
from flask import Blueprint
placeholders_bp = Blueprint('placeholders', __name__)
from .color_adjust import color_adjust_bp
placeholders_bp.register_blueprint(color_adjust_bp)
"@ | Out-File -FilePath (Join-Path $Backend "routes\placeholders\__init__.py") -Encoding utf8

# routes/placeholders/color_adjust.py
@"
from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

color_adjust_bp = Blueprint('color_adjust', __name__)

@color_adjust_bp.route('/color-adjust', methods=['POST'])
def color_adjust():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    try:
        brightness = int(request.form.get('brightness', 0))
        contrast = float(request.form.get('contrast', 1.0))
        saturation = float(request.form.get('saturation', 1.0))
    except:
        return jsonify({'error':'Invalid params'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.adjust_color(path, brightness, contrast, saturation)
    return jsonify({'output':os.path.basename(out)}),200
"@ | Out-File -FilePath (Join-Path $Backend "routes\placeholders\color_adjust.py") -Encoding utf8

# utils/validators.py
@"
from .file_utils import is_allowed_file
def validate_image_file(file):
    if not file or file.filename=='':
        return False
    return is_allowed_file(file.filename)
"@ | Out-File -FilePath (Join-Path $Backend "utils\validators.py") -Encoding utf8

# utils/file_utils.py
@"
import os
from config import Config
def get_file_extension(filename):
    return os.path.splitext(filename)[1].lower()
def is_allowed_file(filename):
    return '.' in filename and get_file_extension(filename)[1:] in Config.ALLOWED_EXTENSIONS
"@ | Out-File -FilePath (Join-Path $Backend "utils\file_utils.py") -Encoding utf8

# utils/error_handlers.py
@"
from flask import jsonify
def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e): return jsonify({'error':'Not found'}),404
    @app.errorhandler(500)
    def internal(e): return jsonify({'error':'Internal error'}),500
"@ | Out-File -FilePath (Join-Path $Backend "utils\error_handlers.py") -Encoding utf8

# .env.example
@"
SECRET_KEY=your-secret-key
"@ | Out-File -FilePath (Join-Path $Backend ".env.example") -Encoding utf8

Write-Host "   Backend files updated." -ForegroundColor Green

# ৩. ফ্রন্টএন্ড ফাইল ওভাররাইট (শুধু প্রয়োজনীয় ফাইল)
Write-Host "`n[2] Writing Frontend Files..." -ForegroundColor Yellow

# frontend/.env
@"
REACT_APP_API_URL=http://localhost:5000/api
"@ | Out-File -FilePath (Join-Path $Frontend ".env") -Encoding utf8

# frontend/src/services/api.js
@"
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'multipart/form-data' } });

export const uploadImage = async (file) => {
    const fd = new FormData(); fd.append('image', file);
    const res = await api.post('/upload', fd);
    return res.data;
};
export const blurImage = async (file) => {
    const fd = new FormData(); fd.append('image', file);
    const res = await api.post('/blur', fd);
    return res.data;
};
export const sharpenImage = async (file) => {
    const fd = new FormData(); fd.append('image', file);
    const res = await api.post('/sharpen', fd);
    return res.data;
};
export const edgeDetection = async (file) => {
    const fd = new FormData(); fd.append('image', file);
    const res = await api.post('/edge-detection', fd);
    return res.data;
};
export const colorAdjust = async (file, brightness=0, contrast=1.0, saturation=1.0) => {
    const fd = new FormData();
    fd.append('image', file);
    fd.append('brightness', String(brightness));
    fd.append('contrast', String(contrast));
    fd.append('saturation', String(saturation));
    const res = await api.post('/color-adjust', fd);
    return res.data;
};
"@ | Out-File -FilePath (Join-Path $Frontend "src\services\api.js") -Encoding utf8

# frontend/src/pages/Upload.js (logo চেঞ্জ হয়নি)
@"
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { uploadImage } from '../services/api';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setMessage('Upload successful: '+res.filename);
    } catch(e) {
      setMessage('Upload failed: '+e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = () => {
    if (selectedFile) navigate('/manual', { state: { file: selectedFile } });
    else alert('Please upload an image first.');
  };

  return (
    <div>
      <h1>Upload Image</h1>
      <FileUpload onUpload={handleFileSelect} />
      {uploading && <div className="spinner-border mt-3"></div>}
      {message && <div className="alert alert-info mt-3">{message}</div>}
      {previewUrl && (
        <div className="mt-4">
          <h5>Original Image</h5>
          <img src={previewUrl} alt="preview" className="img-fluid border rounded" style={{ maxHeight: '400px' }} />
          <div className="mt-3">
            <button className="btn btn-primary" onClick={handleProcess}>
              <i className="bi bi-gear me-2"></i>Process with Manual Tools
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Upload;
"@ | Out-File -FilePath (Join-Path $Frontend "src\pages\Upload.js") -Encoding utf8

# frontend/src/pages/Manual.js (logo চেঞ্জ হয়নি)
@"
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { blurImage, sharpenImage, edgeDetection, colorAdjust } from '../services/api';

const Manual = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1.0);
  const [saturation, setSaturation] = useState(1.0);

  useEffect(() => {
    if (location.state?.file) {
      setSelectedFile(location.state.file);
      setPreviewUrl(URL.createObjectURL(location.state.file));
    }
  }, [location.state]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleProcess = async (op) => {
    if (!selectedFile) { alert('Upload first'); return; }
    setProcessing(true);
    try {
      let res;
      switch(op) {
        case 'blur': res = await blurImage(selectedFile); break;
        case 'sharpen': res = await sharpenImage(selectedFile); break;
        case 'edges': res = await edgeDetection(selectedFile); break;
        case 'color': res = await colorAdjust(selectedFile, brightness, contrast, saturation); break;
        default: throw new Error('Unknown op');
      }
      navigate('/result', { state: { output: res.output, operation: op, originalUrl: previewUrl } });
    } catch(e) {
      alert('Processing failed: '+e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Manual Processing</h1>
      <FileUpload onUpload={handleFileSelect} />
      {previewUrl && (
        <div className="mt-3">
          <h5>Original Image</h5>
          <img src={previewUrl} alt="preview" className="img-fluid border rounded" style={{ maxHeight: '300px' }} />
        </div>
      )}
      {selectedFile && (
        <div className="mt-4">
          <h5>Processing Options</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button className="btn btn-outline-primary" onClick={()=>handleProcess('blur')} disabled={processing}>Blur</button>
            <button className="btn btn-outline-primary" onClick={()=>handleProcess('sharpen')} disabled={processing}>Sharpen</button>
            <button className="btn btn-outline-primary" onClick={()=>handleProcess('edges')} disabled={processing}>Edge Detection</button>
          </div>
          <div className="card p-3">
            <h6>Color Adjustment</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <label>Brightness: {brightness}</label>
                <input type="range" className="form-range" min="-100" max="100" value={brightness} onChange={(e)=>setBrightness(parseInt(e.target.value))} />
              </div>
              <div className="col-md-4">
                <label>Contrast: {contrast.toFixed(1)}</label>
                <input type="range" className="form-range" min="0.0" max="3.0" step="0.1" value={contrast} onChange={(e)=>setContrast(parseFloat(e.target.value))} />
              </div>
              <div className="col-md-4">
                <label>Saturation: {saturation.toFixed(1)}</label>
                <input type="range" className="form-range" min="0.0" max="3.0" step="0.1" value={saturation} onChange={(e)=>setSaturation(parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="mt-2">
              <button className="btn btn-primary" onClick={()=>handleProcess('color')} disabled={processing}>Apply Color Adjustment</button>
            </div>
          </div>
          {processing && <div className="spinner-border mt-3"></div>}
        </div>
      )}
    </div>
  );
};
export default Manual;
"@ | Out-File -FilePath (Join-Path $Frontend "src\pages\Manual.js") -Encoding utf8

# frontend/src/pages/Result.js (logo চেঞ্জ হয়নি)
@"
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Result = () => {
  const { state } = useLocation();
  const { output, operation, originalUrl } = state || {};

  const processedUrl = output ? `http://localhost:5000/outputs/${output}` : null;

  return (
    <div>
      <h1>Result</h1>
      {processedUrl && originalUrl ? (
        <div>
          <p><strong>Operation:</strong> {operation}</p>
          <div className="row">
            <div className="col-md-6">
              <h5>Original</h5>
              <img src={originalUrl} className="img-fluid border rounded" style={{ maxHeight: '400px' }} alt="original" />
            </div>
            <div className="col-md-6">
              <h5>Processed</h5>
              <img src={processedUrl} className="img-fluid border rounded" style={{ maxHeight: '400px' }} alt="processed" />
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <a href={processedUrl} download className="btn btn-success"><i className="bi bi-download me-1"></i>Download Processed</a>
            <Link to="/manual" className="btn btn-secondary"><i className="bi bi-arrow-left me-1"></i>Back</Link>
          </div>
        </div>
      ) : (
        <div className="alert alert-warning">No result. Go to <Link to="/manual">Manual</Link></div>
      )}
    </div>
  );
};
export default Result;
"@ | Out-File -FilePath (Join-Path $Frontend "src\pages\Result.js") -Encoding utf8

# navbar (logo ঠিক রাখা)
@"
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-cpu me-2"></i>AI Image Processor
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/upload">Upload</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/manual">Manual</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/natural">Natural</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
"@ | Out-File -FilePath (Join-Path $Frontend "src\components\Navbar.js") -Encoding utf8

Write-Host "   Frontend files updated." -ForegroundColor Green

# ৪. ডিপেন্ডেন্সি ইনস্টল
Write-Host "`n[3] Installing Dependencies..." -ForegroundColor Yellow

# Backend
Write-Host "   Installing Python packages..." -ForegroundColor Gray
Set-Location $Backend
if (Test-Path "venv") {
    Write-Host "   Virtual environment exists. Activating..." -ForegroundColor Gray
} else {
    Write-Host "   Creating virtual environment..." -ForegroundColor Gray
    python -m venv venv
}
& .\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt

# Frontend
Write-Host "   Installing Node packages..." -ForegroundColor Gray
Set-Location $Frontend
npm install

Write-Host "`n[4] Done!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " NOW FOLLOW THESE STEPS:" -ForegroundColor Yellow
Write-Host "1. Backend: cd backend; .\venv\Scripts\activate; python run.py" -ForegroundColor White
Write-Host "2. Frontend: cd frontend; npm start" -ForegroundColor White
Write-Host "3. Open http://localhost:3000" -ForegroundColor White
Write-Host "4. Upload an image, go to Manual, test Blur/Sharpen/Edge/Color" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan