@echo off
rem La moulinette, depuis mon bureau. Le detail est dans scripts/plier.mjs.
rem
rem   scripts\plier.bat        tous les poemes de plis-source/
rem   scripts\plier.bat 015    celui-la seulement
cd /d "%~dp0.."
node scripts/plier.mjs %*
