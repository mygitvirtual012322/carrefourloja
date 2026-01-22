#!/bin/bash

echo "========================================"
echo "  INICIANDO LOJA CARREFOUR LOCALMENTE"
echo "========================================"
echo ""
echo "Escolha uma opção:"
echo ""
echo "1. Python (se tiver instalado)"
echo "2. Node.js (se tiver instalado)"
echo "3. Abrir pasta no explorador"
echo ""
read -p "Digite o número da opção (1, 2 ou 3): " opcao

case $opcao in
    1)
        echo ""
        echo "Iniciando servidor Python na porta 8000..."
        echo "Acesse: http://localhost:8000"
        echo ""
        cd "CARREFOUR LOJA"
        python3 -m http.server 8000
        ;;
    2)
        echo ""
        echo "Iniciando servidor Node.js na porta 8000..."
        echo "Acesse: http://localhost:8000"
        echo ""
        cd "CARREFOUR LOJA"
        npx http-server -p 8000 -o
        ;;
    3)
        echo ""
        echo "Abrindo pasta no explorador..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "CARREFOUR LOJA"
        else
            xdg-open "CARREFOUR LOJA"
        fi
        ;;
    *)
        echo "Opção inválida!"
        exit 1
        ;;
esac




