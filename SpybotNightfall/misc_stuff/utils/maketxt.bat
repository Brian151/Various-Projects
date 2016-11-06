@echo off
color 1f
::should be self-explanatory i use this to create empty text files to copy the text cast member data into
:start
cls
set /p Fname=Enter a File Name:
echo. > %Fname%.txt
notepad %Fname%.txt
goto start
pause