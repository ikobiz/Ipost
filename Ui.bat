@echo off
setlocal enabledelayedexpansion

:: === Ask for username ===
:askUsername
set /p username=Enter your username: 
:: Trim leading spaces
for /f "tokens=* delims= " %%a in ("!username!") do set username=%%a
if "!username!"=="" (
  echo Username cannot be empty or just spaces.
  goto askUsername
)

:: === Ask for post content ===
:askContent
set /p content=Enter your post content: 
for /f "tokens=* delims= " %%a in ("!content!") do set content=%%a
if "!content!"=="" (
  echo Post content cannot be empty or just spaces.
  goto askContent
)

:: === Send POST request ===
echo.
echo Sending post...
curl -X POST http://localhost:3000/posts ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"!username!\",\"content\":\"!content!\"}"

:: === Ask to view all posts ===
echo.
set /p view=Do you want to view all posts? (y/n): 
if /I "!view!"=="y" (
  echo.
  echo Fetching all posts...
  curl http://localhost:3000/posts
)

echo.
pause
