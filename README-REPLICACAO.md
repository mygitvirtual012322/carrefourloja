# 🚀 Sistema de Replicação de Lojas Shopify → Pagou.ai

## 📖 Documentação Completa

Este projeto contém **TODO o conhecimento** para transformar lojas Shopify clonadas em lojas funcionais com carrinho e checkout Pagou.ai.

### 📚 Guias Disponíveis

1. **`GUIA-REPLICACAO-LOJAS.md`** ⭐
   - Guia completo passo a passo
   - Explicação detalhada de cada etapa
   - Troubleshooting
   - **Use este para entender o processo completo**

2. **`PROCESSO-RAPIDO-NOVA-LOJA.md`** ⚡
   - Checklist rápido (5-10 minutos)
   - Passos essenciais apenas
   - **Use este para replicar rapidamente**

3. **`CONHECIMENTO-TECNICO.md`** 🧠
   - Conhecimento técnico profundo
   - Como funciona internamente
   - Arquitetura do sistema
   - **Use este para entender a fundo**

4. **`SOLUCAO-CHECKOUT-PAGOU-AI.md`** ✅
   - Solução do problema de preços zerados
   - Formato exato do payload
   - **Use este para entender o checkout**

## 🎯 Processo Resumido

Para cada nova loja:

1. **Copiar** `carrefour-cart-system.js` para a nova loja
2. **Incluir** script no `index.html`
3. **Verificar** página do carrinho tem `renderCart` e `getCart`
4. **Remover** links Shopify (comando PowerShell)
5. **Testar** - adicionar produto, verificar carrinho, testar checkout
6. **Ajustar cores** (opcional)

**Tempo:** 5-10 minutos por loja

## 📁 Estrutura do Projeto

```
Carrefour tema/
├── CARREFOUR LOJA/              # Loja de referência (funcionando)
│   ├── carrefour-cart-system.js
│   ├── cart/index.html
│   └── ...
├── OUTRA LOJA/                  # Nova loja (mesmo processo)
│   ├── carrefour-cart-system.js  # Copiar da CARREFOUR LOJA
│   └── ...
├── GUIA-REPLICACAO-LOJAS.md     # Guia completo
├── PROCESSO-RAPIDO-NOVA-LOJA.md # Checklist rápido
├── CONHECIMENTO-TECNICO.md       # Conhecimento técnico
└── SOLUCAO-CHECKOUT-PAGOU-AI.md # Solução checkout
```

## ✅ O Que Funciona

- ✅ Carrinho com localStorage
- ✅ Múltiplos produtos
- ✅ Persistência entre sessões
- ✅ Checkout Pagou.ai
- ✅ Preços corretos
- ✅ Console limpo
- ✅ Todas as rotas funcionando

## 🔑 Pontos Críticos

1. **Payload Pagou.ai:**
   - `presentment_price` em **unidades** (não centavos!)
   - `price` em **centavos**
   - IDs como **números** (não strings)

2. **Interceptações:**
   - Fetch (`/cart/add.js`, `/cart.js`)
   - Location (`window.location.href`)
   - Forms (submits de checkout)

3. **Console:**
   - Desabilitado no início do arquivo
   - Todos os `console.*` são noop

## 🚀 Começar Agora

**Para replicar uma nova loja:**
1. Abra `PROCESSO-RAPIDO-NOVA-LOJA.md`
2. Siga o checklist
3. Teste
4. Pronto!

**Para entender melhor:**
1. Leia `GUIA-REPLICACAO-LOJAS.md`
2. Consulte `CONHECIMENTO-TECNICO.md` se necessário

---

**Status:** ✅ Sistema completo e documentado
**Loja de Referência:** `CARREFOUR LOJA`
**Pronto para:** Replicar em quantas lojas precisar!

