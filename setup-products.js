/**
 * Script Helper para Configurar Produtos
 * 
 * USO:
 * 1. Pegue os links do checkout pagou.ai dos seus produtos
 * 2. Cole na lista CHECKOUT_LINKS abaixo
 * 3. Execute: node setup-products.js
 * 4. O script vai atualizar o config.json automaticamente
 */

const fs = require('fs');
const readline = require('readline');

// ============================================
// COLE SEUS LINKS DO CHECKOUT AQUI
// ============================================
const CHECKOUT_LINKS = [
    // Exemplo:
    'https://seguro.pagou.ai/checkout/323e135e-2538-486f-a7e4-045d8e4dfffa?model=modern',

    // Cole mais links aqui:
    // 'https://seguro.pagou.ai/checkout/OUTRO-UUID-AQUI?model=modern',
    // 'https://seguro.pagou.ai/checkout/MAIS-UM-UUID?model=modern',
];

// ============================================
// HANDLES DOS PRODUTOS DA SHOPIFY
// ============================================
const PRODUCT_HANDLES = [
    // Exemplo:
    'juego-comedor-terraza-jardin-exterior-4-sillas-y-quitasol-metal-1',

    // Cole os handles aqui (última parte da URL do produto):
    // 'outro-produto-handle',
    // 'mais-um-produto',
];

// ============================================
// NÃO PRECISA MEXER DAQUI PRA BAIXO
// ============================================

function extractUUID(checkoutUrl) {
    const match = checkoutUrl.match(/checkout\/([a-f0-9-]+)/i);
    return match ? match[1] : null;
}

function updateConfig() {
    console.log('🔧 Configurando produtos...\n');

    // Extrai UUIDs
    const uuids = CHECKOUT_LINKS.map(link => extractUUID(link)).filter(Boolean);

    console.log(`✓ Encontrados ${uuids.length} UUIDs do checkout`);
    console.log(`✓ Encontrados ${PRODUCT_HANDLES.length} handles da Shopify\n`);

    if (uuids.length === 0) {
        console.log('❌ Nenhum UUID encontrado! Adicione os links do checkout no arquivo.');
        return;
    }

    if (PRODUCT_HANDLES.length === 0) {
        console.log('❌ Nenhum handle encontrado! Adicione os handles dos produtos no arquivo.');
        return;
    }

    // Lê config atual
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    // Cria mapeamento
    const mapping = {};

    // Se tiver a mesma quantidade, mapeia 1:1
    if (uuids.length === PRODUCT_HANDLES.length) {
        console.log('📋 Mapeando produtos (1:1):\n');
        PRODUCT_HANDLES.forEach((handle, index) => {
            mapping[handle] = uuids[index];
            console.log(`   ${handle}`);
            console.log(`   → ${uuids[index]}\n`);
        });
    } else {
        // Se não, pede confirmação manual
        console.log('⚠️  Quantidade diferente de handles e UUIDs!');
        console.log(`   Handles: ${PRODUCT_HANDLES.length}`);
        console.log(`   UUIDs: ${uuids.length}\n`);
        console.log('Por favor, ajuste as listas para terem a mesma quantidade.\n');
        return;
    }

    // Atualiza config
    config.productMapping = mapping;

    // Salva
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    console.log('✅ config.json atualizado com sucesso!\n');
    console.log('📦 Produtos configurados:');
    Object.keys(mapping).forEach(handle => {
        console.log(`   ✓ ${handle}`);
    });

    console.log('\n🚀 Próximo passo: Execute "node shopify-scraper.js" para clonar a loja!');
}

// Modo interativo
async function interactiveMode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   🛒 CONFIGURADOR DE PRODUTOS - SHOPIFY + PAGOU.AI    ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('Este script vai te ajudar a configurar o mapeamento de produtos.\n');

    const answer = await new Promise(resolve => {
        rl.question('Você já editou as listas CHECKOUT_LINKS e PRODUCT_HANDLES no arquivo? (s/n): ', resolve);
    });

    rl.close();

    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'sim') {
        updateConfig();
    } else {
        console.log('\n📝 INSTRUÇÕES:\n');
        console.log('1. Abra o arquivo: setup-products.js');
        console.log('2. Encontre a seção CHECKOUT_LINKS');
        console.log('3. Cole os links do checkout pagou.ai dos seus produtos');
        console.log('4. Encontre a seção PRODUCT_HANDLES');
        console.log('5. Cole os handles dos produtos da Shopify');
        console.log('6. Execute novamente: node setup-products.js\n');

        console.log('💡 DICA: Como pegar os dados?\n');
        console.log('   CHECKOUT LINKS:');
        console.log('   - Acesse cada produto no checkout pagou.ai');
        console.log('   - Copie a URL completa');
        console.log('   - Exemplo: https://seguro.pagou.ai/checkout/UUID?model=modern\n');

        console.log('   PRODUCT HANDLES:');
        console.log('   - Acesse o produto na Shopify');
        console.log('   - Copie a última parte da URL');
        console.log('   - Exemplo: https://loja.myshopify.com/products/nome-do-produto');
        console.log('   - Handle: nome-do-produto\n');
    }
}

// Executa
if (CHECKOUT_LINKS.length === 1 && PRODUCT_HANDLES.length === 1) {
    // Modo interativo se ainda não configurou
    interactiveMode();
} else {
    // Modo automático se já configurou
    updateConfig();
}
