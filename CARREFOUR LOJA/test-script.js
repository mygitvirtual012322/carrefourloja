// Script de teste para verificar se está carregando
console.log('🧪 TESTE: Script carregado!');
console.log('🧪 URL atual:', window.location.href);
console.log('🧪 Pathname:', window.location.pathname);

// Testa interceptação de links
document.addEventListener('DOMContentLoaded', function () {
    console.log('🧪 DOM carregado!');

    const links = document.querySelectorAll('a[href*="shopify.com/products"]');
    console.log('🧪 Links de produtos encontrados:', links.length);

    links.forEach((link, i) => {
        console.log(`🧪 Link ${i}:`, link.href);
    });
});
