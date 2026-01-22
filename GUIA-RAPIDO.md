# 📋 Guia Rápido: Como Configurar Produtos

## 🎯 Processo Simplificado

Criei um script que facilita MUITO! Você só precisa copiar e colar.

### Passo 1: Pegar Links do Checkout

No checkout pagou.ai, pegue o link de cada produto:

```
https://seguro.pagou.ai/checkout/323e135e-2538-486f-a7e4-045d8e4dfffa?model=modern
https://seguro.pagou.ai/checkout/OUTRO-UUID-AQUI?model=modern
https://seguro.pagou.ai/checkout/MAIS-UM-UUID?model=modern
```

### Passo 2: Pegar Handles da Shopify

Na Shopify, pegue a última parte da URL de cada produto:

```
https://twqm8i-xi.myshopify.com/products/juego-comedor
                                         ^^^^^^^^^^^^^^
                                         Este é o handle
```

### Passo 3: Editar o Script

Abra `setup-products.js` e cole:

```javascript
const CHECKOUT_LINKS = [
  'https://seguro.pagou.ai/checkout/323e135e-2538-486f-a7e4-045d8e4dfffa?model=modern',
  'https://seguro.pagou.ai/checkout/OUTRO-UUID?model=modern',
  'https://seguro.pagou.ai/checkout/MAIS-UM?model=modern',
];

const PRODUCT_HANDLES = [
  'juego-comedor-terraza-jardin-exterior-4-sillas-y-quitasol-metal-1',
  'outro-produto-handle',
  'mais-um-produto',
];
```

**IMPORTANTE:** A ordem tem que ser a mesma! Primeiro link = primeiro handle.

### Passo 4: Executar

```bash
node setup-products.js
```

O script vai:
- ✅ Extrair os UUIDs automaticamente
- ✅ Criar o mapeamento
- ✅ Atualizar o `config.json`

### Passo 5: Clonar a Loja

```bash
node shopify-scraper.js
```

Pronto! 🎉

---

## 💡 Alternativa: Fazer Manualmente

Se preferir, pode editar o `config.json` direto:

```json
{
  "productMapping": {
    "handle-produto-1": "UUID-checkout-1",
    "handle-produto-2": "UUID-checkout-2",
    "handle-produto-3": "UUID-checkout-3"
  }
}
```

---

## ❓ FAQ

**P: Preciso configurar TODOS os produtos?**
R: Não! Configure só os que você quer vender. Os outros vão aparecer com "UUID-NAO-CONFIGURADO".

**P: E se eu adicionar produtos depois?**
R: Só editar o `setup-products.js` novamente e executar `node shopify-scraper.js` de novo.

**P: Os produtos precisam estar na mesma ordem?**
R: Sim! O primeiro link do checkout deve corresponder ao primeiro handle da Shopify.

**P: Posso testar com 1 produto só?**
R: Sim! Já está configurado com 1 produto de exemplo funcionando.

---

## 🚀 Resumo

1. **Copie** links do checkout pagou.ai
2. **Copie** handles da Shopify  
3. **Cole** no `setup-products.js`
4. **Execute** `node setup-products.js`
5. **Clone** com `node shopify-scraper.js`
6. **Hospede** a pasta `cloned-store/`

Simples assim! 😊
