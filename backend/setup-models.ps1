# setup-models.ps1
# Downloads models for AI Image Processing Platform

Write-Host "AI Image Processing Platform - Model Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Create folders
$modelDir = "models"
if (!(Test-Path $modelDir)) { New-Item -ItemType Directory -Path $modelDir -Force | Out-Null }

$easyocrDir = "$env:USERPROFILE\.EasyOCR\model"
if (!(Test-Path $easyocrDir)) { New-Item -ItemType Directory -Path $easyocrDir -Force | Out-Null }

# YOLO model
$yoloUrl = "https://github.com/ultralytics/assets/releases/download/v8.4.0/yolov8n.pt"
$yoloPath = "$modelDir\yolov8n.pt"
if (!(Test-Path $yoloPath)) {
    Write-Host "Downloading YOLOv8 model..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $yoloUrl -OutFile $yoloPath -UseBasicParsing
    Write-Host "YOLO downloaded." -ForegroundColor Green
} else {
    Write-Host "YOLO model already exists." -ForegroundColor Green
}

# EasyOCR detection
$craftUrl = "https://github.com/JaidedAI/EasyOCR/releases/download/pre-v1.1.6/craft_mlt_25k.pth"
$craftPath = "$easyocrDir\craft_mlt_25k.pth"
if (!(Test-Path $craftPath)) {
    Write-Host "Downloading EasyOCR detection model..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $craftUrl -OutFile $craftPath -UseBasicParsing
    Write-Host "Detection model downloaded." -ForegroundColor Green
} else {
    Write-Host "Detection model already exists." -ForegroundColor Green
}

# EasyOCR recognition
$recogUrl = "https://github.com/JaidedAI/EasyOCR/releases/download/pre-v1.1.6/english_g2.pth"
$recogPath = "$easyocrDir\english_g2.pth"
if (!(Test-Path $recogPath)) {
    Write-Host "Downloading EasyOCR recognition model..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $recogUrl -OutFile $recogPath -UseBasicParsing
    Write-Host "Recognition model downloaded." -ForegroundColor Green
} else {
    Write-Host "Recognition model already exists." -ForegroundColor Green
}

Write-Host "All models are ready!" -ForegroundColor Green
Write-Host "You can now run: python run.py" -ForegroundColor Cyan