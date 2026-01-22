@echo off
echo ========================================
echo   INICIANDO LOJA CARREFOUR LOCALMENTE
echo ========================================
echo.
echo Escolha uma opcao:
echo.
echo 1. Python (se tiver instalado)
echo 2. Node.js (se tiver instalado)
echo 3. Abrir pasta no explorador
echo.
set /p opcao="Digite o numero da opcao (1, 2 ou 3): "

if "%opcao%"=="1" (
    echo.
    echo Iniciando servidor Python na porta 8000...
    echo Acesse: http://localhost:8000
    echo.
    cd "CARREFOUR LOJA"
    python -m http.server 8000
)

if "%opcao%"=="2" (
    echo.
    echo Iniciando servidor Node.js na porta 8000...
    echo Acesse: http://localhost:8000
    echo.
    cd "CARREFOUR LOJA"
    npx http-server -p 8000 -o
)

if "%opcao%"=="3" (
    echo.
    echo Abrindo pasta no explorador...
    explorer "CARREFOUR LOJA"
    pause
    exit
)

pause




