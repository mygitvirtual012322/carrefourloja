const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuração
const config = require('./config.json');

class ShopifyScraper {
    constructor() {
        this.baseUrl = `https://${config.shopifyStore}`;
        this.password = config.shopifyPassword;
        this.outputDir = './cloned-store';
        this.products = [];
    }

    async init() {
        // Cria diretórios
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        ['assets', 'products'].forEach(dir => {
            const dirPath = path.join(this.outputDir, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
        });

        // Copia arquivos do sistema de carrinho
        this.copyCartFiles();

        // Inicia o browser
        this.browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1920, height: 1080 });
    }

    copyCartFiles() {
        // Copia cart-system.js
        fs.copyFileSync(
            path.join(__dirname, 'cart-system.js'),
            path.join(this.outputDir, 'cart-system.js')
        );

        // Copia cart-styles.css
        fs.copyFileSync(
            path.join(__dirname, 'cart-styles.css'),
            path.join(this.outputDir, 'cart-styles.css')
        );

        // Copia config.json
        fs.copyFileSync(
            path.join(__dirname, 'config.json'),
            path.join(this.outputDir, 'config.json')
        );

        console.log('Arquivos do carrinho copiados!');
    }

    async handlePasswordPage() {
        try {
            await this.page.waitForSelector('input[type="password"]', { timeout: 2000 });
            console.log('Página com senha detectada. Inserindo senha...');
            await this.page.type('input[type="password"]', this.password);
            await this.page.click('button[type="submit"], input[type="submit"]');
            await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
            console.log('Senha inserida com sucesso!');
        } catch (error) {
            // Sem senha, continua normalmente
        }
    }

    async scrapeHomePage() {
        console.log('Clonando página inicial...');

        await this.page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
        await this.handlePasswordPage();

        const html = await this.page.content();

        fs.writeFileSync(
            path.join(this.outputDir, 'index.html'),
            this.injectCartSystem(html)
        );

        console.log('Página inicial clonada!');
    }

    async scrapeProducts() {
        console.log('Buscando produtos...');

        try {
            // Vai para a página de coleções
            await this.page.goto(`${this.baseUrl}/collections/all`, { waitUntil: 'networkidle2' });
            await this.handlePasswordPage();

            // Busca links de produtos
            const productLinks = await this.page.$$eval('a[href*="/products/"]', links =>
                [...new Set(links.map(a => a.href).filter(href => href.includes('/products/')))]
            );

            console.log(`Encontrados ${productLinks.length} produtos!`);

            // Clona apenas os primeiros 5 produtos para teste
            const linksToClone = productLinks.slice(0, 5);

            for (const link of linksToClone) {
                await this.scrapeProductPage(link);
            }

        } catch (error) {
            console.error('Erro ao buscar produtos:', error.message);
        }
    }

    async scrapeProductPage(productUrl) {
        try {
            console.log(`Clonando: ${productUrl}...`);

            await this.page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 15000 });

            // Extrai dados do produto
            const productData = await this.page.evaluate(() => {
                const handle = window.location.pathname.split('/products/')[1];
                const title = document.querySelector('h1')?.textContent || 'Produto';
                const priceElement = document.querySelector('[class*="price"]');
                const price = priceElement?.textContent.match(/[\d.,]+/)?.[0] || '0';
                const image = document.querySelector('img[src*="cdn.shopify"]')?.src || '';

                return { handle, title, price, image };
            });

            if (!productData.handle) return;

            const html = await this.page.content();
            const modifiedHtml = this.injectCartSystem(this.modifyAddToCartButton(html, productData));

            const filename = `${productData.handle}.html`;
            fs.writeFileSync(
                path.join(this.outputDir, 'products', filename),
                modifiedHtml
            );

            this.products.push(productData);
            console.log(`✓ ${productData.title} clonado!`);

        } catch (error) {
            console.error(`Erro ao clonar ${productUrl}:`, error.message);
        }
    }

    injectCartSystem(html) {
        // Injeta CSS e JS do carrinho
        const cartIncludes = `
    <link rel="stylesheet" href="/cart-styles.css">
    <script src="/cart-system.js"></script>
  </head>`;

        html = html.replace('</head>', cartIncludes);

        // Injeta HTML do carrinho
        const cartHTML = `
    <!-- Cart System -->
    <div class="cart-icon" onclick="window.cart.openCartModal()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      <span class="cart-count" style="display: none;">0</span>
    </div>

    <div id="cart-modal" class="cart-modal">
      <div class="cart-header">
        <h2>Meu Carrinho</h2>
        <button class="close-cart" onclick="window.cart.closeCartModal()">&times;</button>
      </div>
      
      <div class="cart-body">
        <div id="cart-items-container"></div>
      </div>
      
      <div class="cart-footer">
        <div class="cart-total-row">
          <h3>Total:</h3>
          <span id="cart-total" class="cart-total">R$ 0,00</span>
        </div>
        <button class="checkout-btn" onclick="window.cart.redirectToCheckout()">
          Finalizar Compra
        </button>
      </div>
    </div>

    <div class="cart-modal-overlay" onclick="window.cart.closeCartModal()"></div>
  </body>`;

        html = html.replace('</body>', cartHTML);

        return html;
    }

    modifyAddToCartButton(html, product) {
        const checkoutId = config.productMapping[product.handle] || 'UUID-NAO-CONFIGURADO';

        // Adiciona atributos aos botões de adicionar ao carrinho
        const dataAttrs = `
      class="add-to-cart-btn"
      data-product-id="${product.handle}"
      data-product-handle="${product.handle}"
      data-product-title="${product.title.replace(/"/g, '&quot;')}"
      data-product-price="${product.price.replace(/[^\d.,]/g, '')}"
      data-product-image="${product.image}"
      data-product-url="/products/${product.handle}"
      data-checkout-id="${checkoutId}"
    `;

        // Substitui botões comuns
        html = html.replace(
            /<button([^>]*)(name="add"|class="[^"]*add[^"]*")([^>]*)>/gi,
            `<button ${dataAttrs} $1$2$3>`
        );

        html = html.replace(
            /<input([^>]*)type="submit"([^>]*)name="add"([^>]*)>/gi,
            `<button ${dataAttrs} type="submit">Adicionar ao Carrinho</button>`
        );

        return html;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async run() {
        try {
            console.log('=== Iniciando clonagem da loja Shopify ===\n');

            await this.init();
            await this.scrapeHomePage();
            await this.scrapeProducts();

            console.log('\n=== Clonagem concluída! ===');
            console.log(`Arquivos salvos em: ${this.outputDir}`);
            console.log(`Total de produtos clonados: ${this.products.length}`);
            console.log('\nPara testar: npm run serve');

        } catch (error) {
            console.error('Erro durante a clonagem:', error);
        } finally {
            await this.close();
        }
    }
}

// Executa o scraper
const scraper = new ShopifyScraper();
scraper.run();
