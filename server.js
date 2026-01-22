/**
 * Servidor para Railway - Serve a loja Carrefour
 * 
 * Este servidor serve todos os arquivos estáticos da pasta "CARREFOUR LOJA"
 * e lida com as rotas do Shopify (products, collections, cart, etc.)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Servir arquivos estáticos da pasta "CARREFOUR LOJA"
const publicPath = path.join(__dirname, 'CARREFOUR LOJA');

// Middleware para servir arquivos estáticos
app.use(express.static(publicPath, {
    extensions: ['html', 'htm'],
    index: 'index.html'
}));

// Rota para a raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Função auxiliar para verificar se arquivo existe
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

// Função auxiliar para servir index.html de uma pasta
function serveIndexFromDir(dirPath, res, fallbackToRoot = true) {
    const indexPath = path.join(dirPath, 'index.html');
    if (fileExists(indexPath)) {
        res.sendFile(indexPath);
        return true;
    }
    if (fallbackToRoot) {
        res.sendFile(path.join(publicPath, 'index.html'));
    }
    return false;
}

// Rota catch-all para lidar com todas as rotas do Shopify
app.get('*', (req, res) => {
    const requestedPath = req.path;
    
    // Remove query string para verificar o arquivo
    const cleanPath = requestedPath.split('?')[0];
    
    // Se tem extensão, tenta servir o arquivo diretamente
    if (cleanPath.includes('.') && !cleanPath.endsWith('/')) {
        const filePath = path.join(publicPath, cleanPath);
        if (fileExists(filePath)) {
            res.sendFile(filePath);
            return;
        }
    }
    
    // Para rotas sem extensão ou com barra final, tenta servir index.html da pasta
    // Ex: /products/algum-produto -> /products/algum-produto/index.html
    const dirPath = path.join(publicPath, cleanPath.replace(/\/$/, ''));
    const indexPath = path.join(dirPath, 'index.html');
    
    if (fileExists(indexPath)) {
        res.sendFile(indexPath);
        return;
    }
    
    // Se não encontrou, tenta a pasta pai (para rotas como /products/.../index.html)
    const parentDir = path.dirname(dirPath);
    if (parentDir !== publicPath && fileExists(path.join(parentDir, 'index.html'))) {
        res.sendFile(path.join(parentDir, 'index.html'));
        return;
    }
    
    // Fallback: serve o index.html principal
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📁 Servindo arquivos de: ${publicPath}`);
    console.log(`🌐 Servidor pronto para receber requisições!`);
    if (process.env.RAILWAY_ENVIRONMENT) {
        console.log(`🚂 Rodando no Railway!`);
    }
});

