@echo off
chcp 1251 >nul
cd /d "C:\Users\Papan\project-name"
docker-compose up -d postgres
echo PostgreSQL started
pause