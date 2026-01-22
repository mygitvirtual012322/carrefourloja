# 🔍 Como Capturar o Payload da Pagou.ai

## Método 1: Script Automático (RECOMENDADO)

1. Abra a loja Shopify REAL: `https://twqm8i-xi.myshopify.com`
2. Abra o Console (F12 → Console)
3. Abra o arquivo `capture-pagou-payload.js` e copie TODO o conteúdo
4. Cole no console e pressione Enter
5. Você verá: `🔍 Monitor Pagou.ai ATIVADO`
6. Adicione um produto ao carrinho
7. Vá para o checkout
8. O payload será exibido automaticamente no console!

## Método 2: DevTools Manual

1. Abra a loja Shopify REAL: `https://twqm8i-xi.myshopify.com`
2. Abra o DevTools (F12)
3. Vá na aba **Network**
4. Filtre por: `pagou` ou `checkout`
5. Adicione um produto ao carrinho
6. Vá para o checkout
7. Procure a requisição para `api-checkout.pagou.ai`
8. Clique na requisição
9. Vá na aba **Payload** ou **Request**
10. Copie o JSON completo

## Depois de Capturar

Envie o payload capturado para que eu possa:
- ✅ Analisar a estrutura exata
- ✅ Identificar quais campos são usados
- ✅ Ajustar o código para usar o mesmo formato

