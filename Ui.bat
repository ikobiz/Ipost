@echo off
setlocal enabledelayedexpansion

:: Ask for username
set /p username=Enter your username: 

:: Ask for post content
set /p content=Enter your post content: 

:: Send POST request
echo Sending post...
curl -X POST http://localhost:3000/posts ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"!username!\",\"content\":\"!content!\"}"

:: Ask if user wants to view all posts
set /p view=Do you want to view all posts? (y/n): 
if /I "!view!"=="y" (
  echo Fetching all posts...
  curl http://localhost:3000/posts
)

pause
