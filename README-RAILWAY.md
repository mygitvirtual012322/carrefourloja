# 🚀 Deploy no Railway - Guia Completo

## ✅ Tudo Preparado!

O projeto está **100% pronto** para deploy no Railway.

## 📋 Arquivos Criados

- ✅ `server.js` - Servidor Express para servir os arquivos estáticos
- ✅ `package.json` - Atualizado com dependências e scripts
- ✅ `railway.json` - Configuração do Railway
- ✅ `.gitignore` - Arquivos a ignorar no Git

## 🚀 Como Fazer Deploy no Railway

### Opção 1: Via GitHub (Recomendado)

1. **Crie um repositório no GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Preparado para Railway"
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```

2. **No Railway:**
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório
   - Railway detectará automaticamente o `package.json` e `railway.json`
   - Clique em "Deploy"

3. **Pronto!** Railway irá:
   - Instalar dependências (`npm install`)
   - Iniciar o servidor (`npm start`)
   - Gerar uma URL pública

### Opção 2: Via Railway CLI

1. **Instale o Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Faça login:**
   ```bash
   railway login
   ```

3. **Inicialize o projeto:**
   ```bash
   railway init
   ```

4. **Faça deploy:**
   ```bash
   railway up
   ```

### Opção 3: Upload Direto

1. No Railway, clique em "New Project"
2. Selecione "Empty Project"
3. Clique em "Add Service" → "GitHub Repo" ou "Upload"
4. Se usar upload, faça upload da pasta do projeto

## 🔧 Configurações Importantes

### Variáveis de Ambiente (Opcional)

Se precisar de variáveis de ambiente no futuro:

1. No Railway, vá em "Variables"
2. Adicione variáveis como:
   - `PORT` (já configurado automaticamente)
   - `NODE_ENV=production`

### Domínio Personalizado

1. No Railway, vá em "Settings"
2. Clique em "Generate Domain" ou adicione um domínio customizado
3. Configure o DNS conforme instruções

## ✅ O Que Está Funcionando

- ✅ Servidor Express servindo arquivos estáticos
- ✅ Rotas funcionando (`/`, `/cart`, `/products/...`, etc.)
- ✅ Carrinho com localStorage funcionando
- ✅ Checkout Pagou.ai funcionando
- ✅ Layout original mantido

## 🧪 Testar Localmente Antes do Deploy

```bash
npm install
npm start
```

Acesse: `http://localhost:8000`

## 📝 Notas

- O servidor usa a porta definida pela variável `PORT` (Railway define automaticamente)
- Todos os arquivos estáticos são servidos da pasta `CARREFOUR LOJA`
- O sistema de carrinho e checkout já está funcionando perfeitamente
- Não precisa de banco de dados - tudo usa localStorage do navegador

## 🐛 Troubleshooting

### Se o deploy falhar:

1. **Verifique os logs no Railway:**
   - Vá em "Deployments" → Clique no deployment → Veja os logs

2. **Verifique se todas as dependências estão no package.json:**
   ```bash
   npm install
   ```

3. **Teste localmente primeiro:**
   ```bash
   npm start
   ```

### Se as rotas não funcionarem:

- O servidor está configurado para servir `index.html` para rotas não encontradas
- Todas as rotas do Shopify devem funcionar normalmente

## 🎉 Pronto para Produção!

Tudo está configurado e pronto para funcionar no Railway!

---

**Última atualização:** Janeiro 2025

