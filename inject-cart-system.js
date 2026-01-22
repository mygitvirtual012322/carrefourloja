/**
 * Script de Injeção Automática
 * 
 * Adiciona o sistema de carrinho em todas as páginas HTML da loja
 */

const fs = require('fs');
const path = require('path');

const LOJA_DIR = path.join(__dirname, 'CARREFOUR LOJA');
const CART_SCRIPT = '<script src="/carrefour-cart-system.js"></script>';

function injectCartSystem(htmlPath) {
    try {
        let content = fs.readFileSync(htmlPath, 'utf8');

        // Verifica se já tem o script injetado
        if (content.includes('carrefour-cart-system.js')) {
            console.log(`⏭️  Já injetado: ${htmlPath}`);
            return false;
        }

        // Injeta antes do </body>
        if (content.includes('</body>')) {
            content = content.replace('</body>', `  ${CART_SCRIPT}\n</body>`);
            fs.writeFileSync(htmlPath, content, 'utf8');
            console.log(`✅ Injetado: ${htmlPath}`);
            return true;
        } else {
            console.log(`⚠️  Sem </body>: ${htmlPath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Erro em ${htmlPath}:`, error.message);
        return false;
    }
}

function findAllHTMLFiles(dir) {
    const files = [];

    function scan(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            // Ignora arquivos ocultos e node_modules
            if (item.startsWith('.') || item === 'node_modules') continue;

            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scan(fullPath);
            } else if (item.endsWith('.html')) {
                files.push(fullPath);
            }
        }
    }

    scan(dir);
    return files;
}

// Executa
console.log('🚀 Iniciando injeção do sistema de carrinho...\n');

const htmlFiles = findAllHTMLFiles(LOJA_DIR);
console.log(`📁 Encontrados ${htmlFiles.length} arquivos HTML\n`);

let injected = 0;
let skipped = 0;

htmlFiles.forEach(file => {
    if (injectCartSystem(file)) {
        injected++;
    } else {
        skipped++;
    }
});

console.log(`\n✨ Concluído!`);
console.log(`   ✅ Injetados: ${injected}`);
console.log(`   ⏭️  Ignorados: ${skipped}`);
console.log(`   📊 Total: ${htmlFiles.length}`);
