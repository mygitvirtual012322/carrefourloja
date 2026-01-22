# 🧠 Conhecimento Técnico - Sistema de Carrinho

## 🔍 Como Funciona

### Arquitetura

```
┌─────────────────────────────────────────┐
│  Loja Shopify Clonada (HTML estático)   │
│  - index.html                            │
│  - products/[handle]/index.html          │
│  - cart/index.html                       │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  carrefour-cart-system.js                │
│  - Intercepta fetch('/cart/add.js')      │
│  - Intercepta fetch('/cart.js')          │
│  - Intercepta window.location            │
│  - Gerencia localStorage                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  localStorage                            │
│  - Chave: 'carrefour_cart'               │
│  - Dados: { items: [], total: 0 }        │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Pagou.ai API                            │
│  - POST /public/cart                     │
│  - Retorna checkout_url                  │
└─────────────────────────────────────────┘
```

## 🔑 Interceptações

### 1. Fetch Interception

**Por quê?**
- Loja clonada tenta fazer `fetch('/cart/add.js')` que não existe localmente
- Interceptamos e salvamos no localStorage

**Como:**
```javascript
const originalFetch = window.fetch;
window.fetch = function(url, options) {
    if (url.includes('/cart/add.js')) {
        // Extrai dados do produto
        // Salva no localStorage
        // Retorna resposta fake
    }
    return originalFetch.apply(this, arguments);
};
```

### 2. Location Interception

**Por quê?**
- Loja clonada tenta fazer `window.location.href = "/cart"` que não existe
- Interceptamos e redirecionamos para `cart/index.html`

**Como:**
```javascript
Object.defineProperty(window, 'location', {
    get: function() {
        return new Proxy(originalLocation, {
            set: function(target, prop, value) {
                if (prop === 'href' && value.includes('/cart')) {
                    target.href = getCartPath(); // Corrige caminho
                }
            }
        });
    }
});
```

### 3. Form Submission Interception

**Por quê?**
- Form de checkout tenta enviar para Shopify
- Interceptamos e chamamos checkoutPagou()

**Como:**
```javascript
document.addEventListener('submit', function(e) {
    if (isCheckoutForm(e.target)) {
        e.preventDefault();
        checkoutPagou();
    }
}, true); // Capture phase
```

## 💾 Estrutura do localStorage

```javascript
{
    items: [
        {
            id: "9284752376052",           // Product ID
            productId: "9284752376052",    // Backup
            variantId: "47479087464692",   // Variant ID
            title: "Nome do Produto",
            price: 17579,                  // Em unidades (não centavos!)
            image: "https://...",
            imageUrl: "https://...",
            handle: "handle-do-produto",
            url: "/products/...",
            quantity: 1
        }
    ],
    total: 17579
}
```

**IMPORTANTE:**
- `price` no localStorage está em **unidades** (ex: 17579)
- Para Pagou.ai, convertemos para **centavos** (17579 * 100 = 1757900)
- `presentment_price` fica em **unidades** (17579)

## 📤 Formato do Payload Pagou.ai

### Por que este formato funciona?

A Pagou.ai foi feita para integrar com Shopify. Ela espera receber exatamente o formato que o Shopify envia.

**Campos que a Pagou.ai usa para reconhecer produtos:**
- `product_id` (número) - ID do produto no Shopify
- `variant_id` (número) - ID da variante no Shopify
- `presentment_price` (unidades) - Preço em unidades (não centavos!)

**Por que `presentment_price` é crítico?**
- A Pagou.ai usa este campo para exibir o preço
- Se estiver em centavos, o preço aparece 100x maior
- Se estiver em unidades, aparece correto

### Estrutura Completa

```javascript
{
    shop: "shop.myshopify.com",
    shopify_internal_domain: "shop.myshopify.com",
    cart_payload: {
        token: "hash?key=hash",  // Formato específico do Shopify
        items: [
            {
                id: variantId,              // Número
                variant_id: variantId,      // Número
                product_id: productId,      // Número
                price: priceInCents,        // Centavos (1757900)
                presentment_price: priceInUnits,  // Unidades (17579)
                key: "variantId:hash",      // Formato específico
                // ... outros campos
            }
        ],
        // ... outros campos
    }
}
```

## 🎯 Detecção Automática

O sistema detecta automaticamente:

1. **Tipo de página:**
   - `detectPageType()` verifica pathname
   - Retorna: 'product', 'cart', ou 'home'

2. **Caminho do carrinho:**
   - `getCartPath()` calcula caminho relativo
   - Funciona para file:// e http://
   - Ajusta baseado na página atual

3. **Dados do produto:**
   - `extractProductFromPage()` busca:
     - Product ID (ShopifyAnalytics, data-product-id, etc.)
     - Variant ID (input[name="id"], etc.)
     - Preço (meta tags, seletores CSS)
     - Imagem (meta og:image, seletores CSS)

## 🔧 Ajustes por Loja

### O que SEMPRE é igual:
- ✅ Lógica do carrefour-cart-system.js
- ✅ Formato do payload Pagou.ai
- ✅ Estrutura do localStorage
- ✅ Interceptações

### O que pode variar:
- 🎨 Cores do carrinho (CSS)
- 📝 Textos/idioma
- 🖼️ Layout do carrinho (HTML)
- 💰 Formato de moeda (ajustar extractPrice se necessário)

## 🐛 Problemas Comuns e Soluções

### 1. Produto não aparece no carrinho

**Causa:** Dados não extraídos corretamente

**Solução:**
- Verificar se Product ID está sendo encontrado
- Verificar seletor de preço
- Verificar seletor de imagem
- Adicionar logs temporários (antes de desabilitar console)

### 2. Preço zerado no checkout

**Causa:** Formato incorreto do payload

**Solução:**
- Verificar se `presentment_price` está em unidades
- Verificar se `price` está em centavos
- Verificar se IDs são números (não strings)
- Comparar com payload que funciona (ver SOLUCAO-CHECKOUT-PAGOU-AI.md)

### 3. Links redirecionam para Shopify

**Causa:** Links não foram removidos

**Solução:**
- Executar comando PowerShell para remover hrefs
- Verificar se interceptCartIconClick() está funcionando

### 4. Console com logs

**Causa:** Console não foi desabilitado

**Solução:**
- Verificar se código de desabilitar console está no início do arquivo
- Verificar se não há outros scripts fazendo logs

## 📚 Arquivos de Referência

- `CARREFOUR LOJA/carrefour-cart-system.js` - Sistema completo
- `CARREFOUR LOJA/cart/index.html` - Página do carrinho (referência)
- `SOLUCAO-CHECKOUT-PAGOU-AI.md` - Documentação do checkout
- `GUIA-REPLICACAO-LOJAS.md` - Guia completo de replicação

## ✅ Checklist Técnico

Antes de considerar uma loja pronta:

- [ ] `carrefour-cart-system.js` incluído e funcionando
- [ ] Interceptações ativas (fetch, location, forms)
- [ ] localStorage funcionando
- [ ] Payload no formato correto
- [ ] `presentment_price` em unidades
- [ ] `price` em centavos
- [ ] IDs como números
- [ ] Console desabilitado
- [ ] Links Shopify removidos

---

**Última atualização:** Janeiro 2025

