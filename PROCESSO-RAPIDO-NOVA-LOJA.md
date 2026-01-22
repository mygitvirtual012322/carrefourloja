# ⚡ Processo Rápido - Nova Loja

## 🎯 Objetivo
Transformar uma loja Shopify clonada em loja funcional com carrinho e checkout Pagou.ai.

## 📋 Checklist Rápido (5 minutos)

### 1. Preparar Estrutura
- [ ] Loja clonada na pasta `[NOVA LOJA]/`
- [ ] Estrutura: `index.html`, `cart/index.html`, `products/`, etc.

### 2. Copiar Sistema de Carrinho
```bash
# Copiar arquivo
cp "CARREFOUR LOJA/carrefour-cart-system.js" "[NOVA LOJA]/carrefour-cart-system.js"
```

### 3. Incluir Script no index.html
**Adicionar antes de `</body>`:**
```html
<script src="./carrefour-cart-system.js"></script>
```

### 4. Verificar Página do Carrinho
**Arquivo:** `[NOVA LOJA]/cart/index.html`

**Verificar se tem:**
- `window.renderCart = function(cart) { ... }`
- `window.getCart = function() { ... }`
- Form sem `action` ou com `onsubmit="return false;"`

**Se não tiver, copiar de:** `CARREFOUR LOJA/cart/index.html`

### 5. Remover Links Shopify
**Executar no PowerShell:**
```powershell
Get-ChildItem -Path "[NOVA LOJA]" -Recurse -Filter "*.html" | ForEach-Object { 
    $content = Get-Content $_.FullName -Raw; 
    if ($content -match 'href="https://.*\.myshopify\.com/cart"') { 
        $content = $content -replace 'href="https://[^"]*\.myshopify\.com/cart"', 'href="javascript:void(0)"'; 
        Set-Content $_.FullName -Value $content -NoNewline; 
    } 
}
```

### 6. Testar
- [ ] Adicionar produto → Carrinho funciona?
- [ ] Carrinho mostra produtos?
- [ ] Checkout Pagou.ai funciona?
- [ ] Preços aparecem?

### 7. Ajustar Cores (Opcional)
- [ ] Editar CSS do carrinho em `cart/index.html`

## ✅ Pronto!

A loja está funcionando igual à `CARREFOUR LOJA`.

---

**Tempo estimado:** 5-10 minutos por loja

