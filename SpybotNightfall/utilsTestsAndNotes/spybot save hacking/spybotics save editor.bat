@echo off
title Spybotics SaveGame Editor

:menuMAIN
cls
echo.
echo Which slot would you like to edit?
echo a) slot 1
echo b) slot 2
echo c) slot 3
set /p sSLOT= :
if %sSLOT%==a goto 1a
if %sSLOT%==b goto 1b
if %sSLOT%==c goto 1c
:invalchoy1
echo TRY AGAIN
PAUSE
goto menuMAIN

:1a
set SLOT =sbslot1
goto menuBOT
:1b
set SLOT =sbslot2
goto menuBOT
:1c
set SLOT =sbslot3
goto menuBOT

:menuBOT
cls
echo What Spybot do you wish to equip?
echo a) 
echo b) 
echo c) 
echo d) 