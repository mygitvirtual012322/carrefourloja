/**
 * Script de Injeção Automática - VERSÃO CORRIGIDA
 * 
 * Adiciona o sistema de carrinho em todas as páginas HTML da loja
 * Usa caminhos relativos para funcionar com file://
 */

const fs = require('fs');
const path = require('path');

const LOJA_DIR = path.join(__dirname, 'CARREFOUR LOJA');

function getRelativePath(htmlPath) {
    // Calcula profundidade do arquivo
    const relativePath = path.relative(LOJA_DIR, htmlPath);
    const depth = relativePath.split(path.sep).length - 1;

    // Cria caminho relativo
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    return `${prefix}carrefour-cart-system.js`;
}

function injectCartSystem(htmlPath) {
    try {
        let content = fs.readFileSync(htmlPath, 'utf8');

        // Verifica se já tem o script injetado
        if (content.includes('carrefour-cart-system.js')) {
            console.log(`⏭️  Já injetado: ${htmlPath}`);
            return false;
        }

        const scriptPath = getRelativePath(htmlPath);
        const scriptTag = `  <script src="${scriptPath}"></script>`;

        // Injeta antes do </body>
        if (content.includes('</body>')) {
            content = content.replace('</body>', `${scriptTag}\n</body>`);
            fs.writeFileSync(htmlPath, content, 'utf8');
            console.log(`✅ Injetado: ${path.relative(LOJA_DIR, htmlPath)} -> ${scriptPath}`);
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
console.log('🚀 Iniciando injeção do sistema de carrinho (caminhos relativos)...\n');

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
