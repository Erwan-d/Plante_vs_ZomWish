@echo off

echo Lancement du serveur Vue...
start cmd /k "cd pvz && npm run dev"

echo Lancement du serveur Phaser...
start cmd /k "cd src && npx http-server"

pause
