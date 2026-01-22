/**
 * Remove scripts antigos e reinjeta com caminho correto
 */

const fs = require('fs');
const path = require('path');

const LOJA_DIR = path.join(__dirname, 'CARREFOUR LOJA');

function getRelativePath(htmlPath) {
    const relativePath = path.relative(LOJA_DIR, htmlPath);
    const depth = relativePath.split(path.sep).length - 1;
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    return `${prefix}carrefour-cart-system.js`;
}

function reinjectScript(htmlPath) {
    try {
        let content = fs.readFileSync(htmlPath, 'utf8');

        // Remove script antigo
        content = content.replace(/<script src="\/carrefour-cart-system\.js"><\/script>\n?/g, '');
        content = content.replace(/<script src="carrefour-cart-system\.js"><\/script>\n?/g, '');

        const scriptPath = getRelativePath(htmlPath);
        const scriptTag = `  <script src="${scriptPath}"></script>`;

        // Injeta novo
        if (content.includes('</body>')) {
            content = content.replace('</body>', `${scriptTag}\n</body>`);
            fs.writeFileSync(htmlPath, content, 'utf8');
            console.log(`✅ ${path.relative(LOJA_DIR, htmlPath)} -> ${scriptPath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ ${htmlPath}:`, error.message);
        return false;
    }
}

function findAllHTMLFiles(dir) {
    const files = [];
    function scan(currentDir) {
        const items = fs.readdirSync(currentDir);
        for (const item of items) {
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

console.log('🔄 Reinjetando scripts com caminhos corretos...\n');

const htmlFiles = findAllHTMLFiles(LOJA_DIR);
let count = 0;

htmlFiles.forEach(file => {
    if (reinjectScript(file)) count++;
});

console.log(`\n✨ ${count} arquivos atualizados!`);
