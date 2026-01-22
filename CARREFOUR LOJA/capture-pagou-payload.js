// Script para capturar payload da Pagou.ai na loja Shopify real
// COMO USAR:
// 1. Abra a loja Shopify real: https://twqm8i-xi.myshopify.com
// 2. Abra o console (F12)
// 3. Cole este script completo
// 4. Adicione um produto ao carrinho e vá para checkout
// 5. O payload será exibido automaticamente no console

(function() {
    console.log('%c🔍 Monitor Pagou.ai ATIVADO', 'background: #222; color: #bada55; font-size: 16px; padding: 10px;');
    
    // Intercepta fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        const options = args[1] || {};
        
        // Verifica se é requisição para Pagou.ai
        if (typeof url === 'string' && url.includes('api-checkout.pagou.ai')) {
            console.log('%c📤 REQUISIÇÃO PARA PAGOU.AI CAPTURADA!', 'background: #0a0; color: #fff; font-size: 14px; padding: 5px;');
            console.log('URL:', url);
            
            // Se tiver body, tenta parsear
            if (options.body) {
                try {
                    const payload = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
                    console.log('%c📦 PAYLOAD COMPLETO:', 'background: #00a; color: #fff; font-size: 14px; padding: 5px;');
                    console.log(JSON.stringify(payload, null, 2));
                    
                    // Analisa itens
                    if (payload.cart_payload && payload.cart_payload.items) {
                        console.log('%c🔍 ANÁLISE DOS ITENS:', 'background: #a00; color: #fff; font-size: 14px; padding: 5px;');
                        payload.cart_payload.items.forEach((item, idx) => {
                            console.log(`\n📦 Item ${idx + 1}:`);
                            console.log('   id:', item.id, `(tipo: ${typeof item.id})`);
                            console.log('   product_id:', item.product_id, `(tipo: ${typeof item.product_id})`);
                            console.log('   variant_id:', item.variant_id, `(tipo: ${typeof item.variant_id})`);
                            console.log('   sku:', item.sku || 'VAZIO');
                            console.log('   handle:', item.handle || 'VAZIO');
                            console.log('   price:', item.price, 'centavos');
                            console.log('   title:', item.title);
                        });
                    }
                    
                    // Salva no localStorage para fácil acesso
                    localStorage.setItem('pagou_payload_captured', JSON.stringify(payload));
                    console.log('%c✅ Payload salvo no localStorage como "pagou_payload_captured"', 'background: #0a0; color: #fff; padding: 5px;');
                    console.log('%c💡 Para ver novamente: JSON.parse(localStorage.getItem("pagou_payload_captured"))', 'background: #00a; color: #fff; padding: 5px;');
                    
                } catch (e) {
                    console.error('Erro ao parsear payload:', e);
                }
            }
        }
        
        // Chama o fetch original
        return originalFetch.apply(this, args);
    };
    
    console.log('✅ Interceptação ativa! Adicione um produto ao carrinho e vá para checkout.');
})();

