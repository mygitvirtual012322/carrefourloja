# 📚 Guia Completo - Replicação de Loja Shopify para Pagou.ai

## 🎯 Objetivo

Este guia documenta **TODO o processo** para transformar uma loja Shopify clonada em uma loja funcional com:
- ✅ Carrinho usando localStorage
- ✅ Checkout integrado com Pagou.ai
- ✅ Todas as rotas funcionando localmente
- ✅ Console limpo (sem logs)

## 📁 Estrutura do Projeto

```
Carrefour tema/
├── CARREFOUR LOJA/          # Loja exemplo (já configurada)
│   ├── index.html
│   ├── carrefour-cart-system.js  # Sistema de carrinho
│   ├── cart/
│   │   └── index.html
│   ├── products/
│   │   └── [produto]/index.html
│   └── ...
├── OUTRA LOJA/              # Nova loja (mesmo formato)
│   ├── index.html
│   ├── carrefour-cart-system.js  # Copiar e ajustar
│   ├── cart/
│   │   └── index.html
│   └── ...
└── server.js                # Servidor (já configurado)
```

## 🔧 Passo a Passo Completo

### 1. Preparar a Estrutura da Nova Loja

A nova loja deve ter a mesma estrutura da "CARREFOUR LOJA":
- `index.html` na raiz
- `cart/index.html` (página do carrinho)
- `products/[handle]/index.html` (páginas de produtos)
- `collections/` (se houver)
- `pages/` (se houver)

### 2. Copiar e Ajustar o Sistema de Carrinho

**Arquivo:** `carrefour-cart-system.js`

**O que fazer:**
1. Copiar o arquivo `CARREFOUR LOJA/carrefour-cart-system.js` para a nova loja
2. Renomear se necessário (ex: `loja-cart-system.js`)
3. **NÃO precisa alterar nada no código** - ele funciona automaticamente!

**O sistema detecta automaticamente:**
- Rotas baseadas na URL atual
- Caminhos relativos corretos
- Estrutura de pastas

### 3. Incluir o Script no index.html

**Arquivo:** `[NOVA LOJA]/index.html`

**O que fazer:**
Adicionar no final do `<body>`, antes de `</body>`:

```html
<script src="./carrefour-cart-system.js"></script>
```

**Importante:** Ajustar o caminho do script conforme necessário:
- Se o script estiver na raiz: `./carrefour-cart-system.js`
- Se estiver em outra pasta: ajustar o caminho

### 4. Ajustar a Página do Carrinho

**Arquivo:** `[NOVA LOJA]/cart/index.html`

**O que fazer:**
1. Garantir que existe a função `window.renderCart(cart)` exposta globalmente
2. Garantir que existe a função `window.getCart()` exposta globalmente
3. Remover `action` do form de checkout (ou adicionar `onsubmit="return false;"`)

**Exemplo de função renderCart (já deve estar no HTML):**
```javascript
window.renderCart = function(cart) {
    // Função que renderiza o carrinho
    // Já deve existir no HTML da loja
};
```

**Exemplo de função getCart (já deve estar no HTML):**
```javascript
window.getCart = function() {
    return fetch('/cart.js', { headers: { 'Accept': 'application/json' } })
        .then(res => res.json());
};
```

### 5. Remover Referências à Shopify nos Links

**O que fazer:**
Substituir todos os links `href="https://[shop].myshopify.com/cart"` por `href="javascript:void(0)"`

**Comando PowerShell (ajustar caminho):**
```powershell
Get-ChildItem -Path "[NOVA LOJA]" -Recurse -Filter "*.html" | ForEach-Object { 
    $content = Get-Content $_.FullName -Raw; 
    if ($content -match 'href="https://.*\.myshopify\.com/cart"') { 
        $content = $content -replace 'href="https://[^"]*\.myshopify\.com/cart"', 'href="javascript:void(0)"'; 
        Set-Content $_.FullName -Value $content -NoNewline; 
        Write-Host "Corrigido: $($_.FullName)" 
    } 
}
```

### 6. Ajustar Moeda (se necessário)

**O que fazer:**
Se a loja usar outra moeda ou formato de preço diferente, pode precisar ajustar:

**Arquivo:** `carrefour-cart-system.js`

**Linha ~1095:** Função `extractPrice()` - ajustar se necessário para outro formato de moeda

**Linha ~1427:** `presentment_price` - já está em unidades, funciona para qualquer moeda

### 7. Ajustar Cores do Carrinho (Opcional)

**Arquivo:** `[NOVA LOJA]/cart/index.html`

**O que fazer:**
1. Localizar estilos CSS do carrinho
2. Ajustar cores para combinar com a loja
3. Manter a estrutura HTML intacta

### 8. Testar

**Checklist:**
- [ ] Adicionar produto ao carrinho funciona
- [ ] Carrinho mostra produtos com imagem e preço
- [ ] Botão "Finalizar compra" redireciona para Pagou.ai
- [ ] Preços aparecem corretamente no checkout Pagou.ai
- [ ] Console está limpo (sem logs)
- [ ] Links do carrinho não redirecionam para Shopify
- [ ] Todas as rotas funcionam localmente

## 🔑 Pontos Críticos do Sistema

### Como Funciona o Carrinho

1. **Interceptação de `/cart/add.js`:**
   - Quando produto é adicionado, intercepta a requisição
   - Extrai dados do produto (ID, preço, imagem, etc.)
   - Salva no `localStorage` com chave `carrefour_cart`
   - Redireciona para `/cart/index.html`

2. **Interceptação de `/cart.js`:**
   - Quando a página do carrinho carrega, busca `/cart.js`
   - Sistema intercepta e retorna dados do `localStorage`
   - Formata no formato Shopify para compatibilidade

3. **Interceptação de Checkout:**
   - Intercepta cliques em "Finalizar compra"
   - Formata itens no formato exato do Shopify
   - Envia para `https://api-checkout.pagou.ai/public/cart`
   - Redireciona para URL do checkout retornada

### Formato do Payload Pagou.ai

**CRÍTICO:** O payload deve seguir EXATAMENTE este formato:

```json
{
  "shop": "shop.myshopify.com",
  "shopify_internal_domain": "shop.myshopify.com",
  "cart_payload": {
    "token": "hash?key=hash",
    "note": "",
    "attributes": {},
    "original_total_price": 1757900,
    "total_price": 1757900,
    "total_discount": 0,
    "total_weight": 0,
    "item_count": 1,
    "items": [
      {
        "id": 47479087464692,
        "variant_id": 47479087464692,
        "product_id": 9284752376052,
        "quantity": 1,
        "properties": {},
        "key": "47479087464692:hash",
        "title": "Nome do Produto",
        "price": 1757900,
        "original_price": 1757900,
        "presentment_price": 17579,
        "discounted_price": 1757900,
        "line_price": 1757900,
        "original_line_price": 1757900,
        "total_discount": 0,
        "discounts": [],
        "sku": null,
        "grams": 0,
        "vendor": "Mi tienda",
        "taxable": true,
        "product_has_only_default_variant": true,
        "gift_card": false,
        "final_price": 1757900,
        "final_line_price": 1757900,
        "url": "/products/handle?variant=47479087464692",
        "featured_image": { ... },
        "image": "...",
        "handle": "handle-do-produto",
        "requires_shipping": true,
        "product_type": "",
        "product_title": "Nome do Produto",
        "product_description": "...",
        "variant_title": null,
        "variant_options": ["Default Title"],
        "options_with_values": [
          {
            "name": "Title",
            "value": "Default Title"
          }
        ],
        "line_level_discount_allocations": [],
        "line_level_total_discount": 0,
        "has_components": false
      }
    ],
    "requires_shipping": true,
    "currency": "ARS",
    "items_subtotal_price": 1757900,
    "cart_level_discount_applications": [],
    "discount_codes": []
  }
}
```

**Campos Críticos:**
- `id`, `variant_id`, `product_id`: **Números** (não strings)
- `price`: Em **centavos** (ex: 1757900 = ARS 17.579,00)
- `presentment_price`: Em **unidades** (ex: 17579 = ARS 17.579,00)
- `key`: Formato `variantId:hash`
- `token`: Formato `hash?key=hash`

### Interceptações Implementadas

1. **`interceptCartIconClick()`:**
   - Intercepta cliques no ícone do carrinho
   - Remove `href` dos links do carrinho
   - Redireciona para nosso cart local

2. **`interceptCartRedirect()`:**
   - Intercepta `window.location.href = "/cart"`
   - Intercepta `window.location.replace("/cart")`
   - Intercepta `window.location.assign("/cart")`
   - Corrige para caminho local correto

3. **`interceptCartRedirectAggressive()`:**
   - Monitora mudanças na URL
   - Corrige redirecionamentos incorretos

4. **`interceptFetch()`:**
   - Intercepta `fetch('/cart/add.js')` → salva no localStorage
   - Intercepta `fetch('/cart.js')` → retorna dados do localStorage
   - Intercepta `fetch('/cart/change.js')` → atualiza localStorage
   - Intercepta `fetch('/checkout')` → chama checkoutPagou()

5. **`interceptCheckoutForms()`:**
   - Intercepta submits de forms
   - Intercepta cliques em botões de checkout
   - Chama checkoutPagou()

## 🎨 Ajustes de Visual (Opcional)

### Cores do Carrinho

**Arquivo:** `[NOVA LOJA]/cart/index.html`

**O que ajustar:**
- Cores de botões
- Cores de texto
- Cores de bordas
- Background colors

**O que NÃO alterar:**
- Estrutura HTML
- IDs e classes principais
- Funções JavaScript (`renderCart`, `getCart`)

## 🐛 Troubleshooting Comum

### Problema: Carrinho vazio após adicionar produto

**Solução:**
- Verificar se `carrefour-cart-system.js` está incluído no `index.html`
- Verificar se o script está sendo carregado (Network tab)
- Verificar se há erros no console (antes de desabilitar console)

### Problema: Preços zerados no checkout Pagou.ai

**Solução:**
- Verificar se `presentment_price` está em unidades (não centavos)
- Verificar se `price` está em centavos
- Verificar se IDs são números (não strings)
- Verificar formato do `key` e `token`

### Problema: Links redirecionam para Shopify

**Solução:**
- Executar comando PowerShell para remover `href` dos links
- Verificar se `interceptCartIconClick()` está funcionando

### Problema: Console com logs

**Solução:**
- Verificar se código de desabilitar console está no início do arquivo
- Verificar se não há outros scripts fazendo logs

## 📝 Checklist Final

Antes de considerar uma loja pronta:

- [ ] Script `carrefour-cart-system.js` incluído no `index.html`
- [ ] Funções `renderCart` e `getCart` expostas globalmente no `cart/index.html`
- [ ] Form de checkout sem `action` ou com `onsubmit="return false;"`
- [ ] Todos os links `myshopify.com/cart` removidos
- [ ] Adicionar produto funciona
- [ ] Carrinho mostra produtos
- [ ] Checkout Pagou.ai funciona
- [ ] Preços aparecem corretamente
- [ ] Console limpo
- [ ] Todas as rotas funcionam

## 🔄 Processo Rápido para Nova Loja

1. **Copiar estrutura:**
   ```bash
   # Criar pasta da nova loja
   # Copiar arquivos HTML da loja clonada
   ```

2. **Copiar sistema de carrinho:**
   ```bash
   # Copiar carrefour-cart-system.js para nova loja
   ```

3. **Incluir script:**
   ```html
   <!-- Adicionar no index.html -->
   <script src="./carrefour-cart-system.js"></script>
   ```

4. **Remover links Shopify:**
   ```powershell
   # Executar comando PowerShell para remover hrefs
   ```

5. **Testar:**
   - Adicionar produto
   - Verificar carrinho
   - Testar checkout

6. **Ajustar cores (opcional):**
   - Editar CSS do carrinho

## ✅ Status Atual

**Loja de Referência:** `CARREFOUR LOJA`
- ✅ Totalmente funcional
- ✅ Console limpo
- ✅ Checkout Pagou.ai funcionando
- ✅ Preços corretos
- ✅ Todas as rotas funcionando

**Próximas Lojas:**
- Seguir exatamente o mesmo processo
- Usar `CARREFOUR LOJA` como referência

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0

