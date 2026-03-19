#!/bin/bash
PROJECT_ID="project-f338c3d2-64dd-47cd-873"
REPO="asia-southeast1-docker.pkg.dev/$PROJECT_ID/agri-scan-repo"

echo "🚀 Đang build Backend..."
docker build --platform linux/amd64 -t $REPO/asa-backend:latest -f apps/backend/Dockerfile .
docker push $REPO/asa-backend:latest

echo "🌐 Đang build Web..."
docker build --platform linux/amd64 -t $REPO/asa-web:latest -f apps/web/Dockerfile .
docker push $REPO/asa-web:latest

echo "📡 Đang ra lệnh cho Server cập nhật..."
ssh tranphuckhangvllvl@34.143.142.97 "cd ~/AGRI-SCAN-AI-ASA- && docker compose pull && docker compose up -d"