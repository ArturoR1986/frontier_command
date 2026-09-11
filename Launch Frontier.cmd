@echo off
setlocal
cd /d "%~dp0"
set "FRONTIER_NODE=node"
where node >nul 2>nul
if errorlevel 1 set "FRONTIER_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
"%FRONTIER_NODE%" -e "if(Number(process.versions.node.split('.')[0])<24)process.exit(1)" >nul 2>nul
if errorlevel 1 (
  echo Frontier Command requires Node.js 24 or newer. Install it from nodejs.org, then launch again.
  pause
  exit /b 1
)
echo Frontier Command 0.2 - development build
echo Open http://127.0.0.1:4180/ in your browser once the server starts.
echo Keep this window open while playing. Ctrl+C stops the world safely.
"%FRONTIER_NODE%" scripts\frontier-server.mjs
pause
