# 🛒 Sistema de Clonagem Shopify + Checkout Externo

Sistema completo para clonar uma loja Shopify e integrar com checkout externo (pagou.ai), mantendo funcionalidade mesmo com a loja original offline.

## 📋 O que foi criado

### Arquivos Principais

1. **`config.json`** - Configurações da loja e mapeamento de produtos
2. **`cart-system.js`** - Sistema de carrinho independente
3. **`cart-styles.css`** - Estilos do carrinho
4. **`shopify-scraper.js`** - Script para clonar a loja
5. **`package.json`** - Dependências do projeto
6. **`exemplo.html`** - Página de exemplo mostrando como usar

## 🚀 Como Usar

### Passo 1: Instalar Dependências

```bash
npm install
```

Isso vai instalar:
- `puppeteer` - Para clonar a loja
- `http-server` - Para testar localmente

### Passo 2: Configurar Produtos

Abra o arquivo `config.json` e adicione o mapeamento de TODOS os seus produtos:

```json
{
  "productMapping": {
    "handle-do-produto-shopify": "UUID-do-checkout-pagou-ai",
    "juego-comedor-terraza": "323e135e-2538-486f-a7e4-045d8e4dfffa",
    "outro-produto": "OUTRO-UUID-AQUI"
  }
}
```

**Como pegar o UUID do checkout:**
- Acesse o produto no checkout pagou.ai
- A URL será algo como: `https://seguro.pagou.ai/checkout/323e135e-2538-486f-a7e4-045d8e4dfffa`
- O UUID é a parte: `323e135e-2538-486f-a7e4-045d8e4dfffa`

**Como pegar o handle do Shopify:**
- É a última parte da URL do produto
- Ex: `https://loja.myshopify.com/products/juego-comedor` → handle é `juego-comedor`

### Passo 3: Clonar a Loja

```bash
npm run clone
```

Isso vai:
1. Abrir um navegador automaticamente
2. Acessar sua loja Shopify
3. Inserir a senha automaticamente
4. Clonar todas as páginas
5. Baixar todas as imagens
6. Injetar o sistema de carrinho
7. Salvar tudo na pasta `cloned-store/`

**Aguarde até ver a mensagem:** `=== Clonagem concluída! ===`

### Passo 4: Testar Localmente

```bash
npm run serve
```

Isso vai:
- Iniciar um servidor local na porta 8080
- Abrir automaticamente no navegador
- Você pode testar o carrinho e checkout

### Passo 5: Hospedar os Arquivos

Copie a pasta `cloned-store/` para seu servidor/hospedagem.

**Opções de hospedagem:**

#### Opção A: Vercel (Grátis e Fácil)
1. Instale Vercel CLI: `npm i -g vercel`
2. Entre na pasta: `cd cloned-store`
3. Execute: `vercel`
4. Siga as instruções

#### Opção B: Netlify (Grátis e Fácil)
1. Acesse https://app.netlify.com/
2. Arraste a pasta `cloned-store` para o site
3. Pronto!

#### Opção C: Servidor Próprio (VPS, Hospedagem)
1. Faça upload via FTP/SFTP
2. Configure o domínio
3. Pronto!

## 🎯 Como Funciona

### Sistema de Carrinho

1. **Adicionar ao Carrinho**: Cliente clica em "Adicionar ao Carrinho"
2. **LocalStorage**: Produto é salvo no navegador (funciona offline!)
3. **Múltiplos Produtos**: Cliente pode adicionar vários produtos
4. **Finalizar Compra**: 
   - Se 1 produto → Redireciona direto para checkout pagou.ai
   - Se múltiplos → Mostra seleção de qual produto comprar

### Integração com Checkout

Cada produto tem um UUID único do pagou.ai. Quando o cliente finaliza:

```
Produto → UUID → https://seguro.pagou.ai/checkout/UUID?model=modern
```

## 📝 Personalizações

### Adicionar Novo Produto

1. Cadastre o produto no checkout pagou.ai
2. Pegue o UUID do checkout
3. Adicione no `config.json`:
   ```json
   "productMapping": {
     "handle-do-produto": "UUID-aqui"
   }
   ```
4. Execute `npm run clone` novamente

### Mudar Cores do Carrinho

Edite `cart-styles.css`:

```css
.cart-icon {
  background: #000; /* Mude a cor aqui */
}

.checkout-btn {
  background: #000; /* Mude a cor aqui */
}
```

### Mudar Textos

Edite `cart-system.js` e procure por:
- `"adicionado ao carrinho!"` - Notificação
- `"Seu carrinho está vazio"` - Carrinho vazio
- `"Finalizar Compra"` - Botão checkout

## 🔧 Solução de Problemas

### "Produto não encontrado no checkout"
- Verifique se o UUID está correto no `config.json`
- Teste o link direto: `https://seguro.pagou.ai/checkout/SEU-UUID?model=modern`

### "Carrinho não aparece"
- Verifique se os arquivos `cart-system.js` e `cart-styles.css` estão carregando
- Abra o Console do navegador (F12) e veja se há erros

### "Imagens não aparecem"
- Verifique se a pasta `assets/` foi copiada junto
- Pode precisar ajustar os caminhos das imagens

### "Shopify bloqueou o scraper"
- Mude `headless: false` para `headless: true` no `shopify-scraper.js`
- Adicione delays entre as requisições

## 📱 Múltiplos Produtos no Checkout

**Limitação atual:** O checkout pagou.ai aceita apenas 1 produto por vez.

**Soluções implementadas:**

1. **1 Produto**: Redireciona direto
2. **Múltiplos**: Mostra modal para cliente escolher qual comprar

**Solução futura (se pagou.ai tiver API):**
- Criar checkout dinâmico com múltiplos produtos via API
- Precisa verificar documentação do pagou.ai

## 🎨 Exemplo de Uso

Veja o arquivo `exemplo.html` para ver como adicionar produtos manualmente.

Estrutura básica de um botão:

```html
<button 
  class="add-to-cart-btn"
  data-product-id="prod-001"
  data-product-handle="nome-do-produto"
  data-product-title="Nome do Produto"
  data-product-price="99.90"
  data-product-image="url-da-imagem"
  data-product-url="/products/nome"
  data-checkout-id="UUID-do-pagou-ai">
  Adicionar ao Carrinho
</button>
```

## 📞 Próximos Passos

1. ✅ Clone a loja
2. ✅ Configure os UUIDs
3. ✅ Teste localmente
4. ⬜ Hospede os arquivos
5. ⬜ Configure domínio
6. ⬜ Teste em produção

## ⚠️ Importante

- **Backup**: Sempre mantenha backup dos arquivos clonados
- **Atualização**: Se mudar produtos na Shopify, execute `npm run clone` novamente
- **Legal**: Certifique-se de ter direitos sobre o conteúdo clonado
- **Shopify Offline**: Mesmo com a Shopify offline, os arquivos clonados continuam funcionando!

## 🎉 Pronto!

Agora você tem uma loja independente que funciona mesmo se a Shopify cair, com carrinho funcional e integração com checkout externo!
