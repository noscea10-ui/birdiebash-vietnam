@echo off
title Birdie Bash 3D - May Chu Online
color 0A
cd /d "%~dp0"

echo ===================================================
echo     KHOI DONG MAY CHU BIRDIE BASH 3D (TIENG VIET)
echo ===================================================
echo.

:: Kiem tra node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] May ban chua cai Node.js! Hay cai tai https://nodejs.org
    pause
    exit /b
)

:: Khoi dong server node
echo [1/2] Dang chay server backend port 3000...
start "BirdieBash Backend" /min node server.js

:: Cho 2 giay de server khoi dong
timeout /t 2 /nobreak >nul

echo [2/2] Dang mo duong ham Online ra toan the gioi...
echo.
echo ===================================================
echo   LINK CHOI CUNG MANG WIFI: http://192.168.1.144:3000
echo   LINK ONLINE TOAN CAU SE HIEN RA DUOI DAY:
echo ===================================================
echo.

if exist "%~dp0cloudflared.exe" (
    "%~dp0cloudflared.exe" tunnel --url http://localhost:3000
) else if exist "C:\Users\JWOS\.gemini\antigravity\scratch\cloudflared.exe" (
    "C:\Users\JWOS\.gemini\antigravity\scratch\cloudflared.exe" tunnel --url http://localhost:3000
) else (
    echo Khong tim thay cloudflared.exe.
    pause
)
