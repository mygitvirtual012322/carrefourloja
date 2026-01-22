/**
 * Sistema de Carrinho Independente
 * Funciona sem depender da Shopify
 */

class ShopifyCart {
    constructor() {
        this.storageKey = 'shopify_cart';
        this.config = null;
        this.loadConfig();
    }

    async loadConfig() {
        try {
            const response = await fetch('/config.json');
            this.config = await response.json();
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        }
    }

    // Inicializa o carrinho
    init() {
        this.updateCartUI();
        this.attachEventListeners();
    }

    // Obtém o carrinho do localStorage
    getCart() {
        const cart = localStorage.getItem(this.storageKey);
        return cart ? JSON.parse(cart) : { items: [], total: 0 };
    }

    // Salva o carrinho no localStorage
    saveCart(cart) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.updateCartUI();
        this.dispatchCartUpdate();
    }

    // Adiciona produto ao carrinho
    addToCart(product) {
        const cart = this.getCart();

        // Verifica se o produto já existe no carrinho
        const existingItem = cart.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            cart.items.push({
                id: product.id,
                handle: product.handle,
                title: product.title,
                price: product.price,
                quantity: product.quantity || 1,
                image: product.image,
                url: product.url,
                checkoutId: product.checkoutId // UUID do pagou.ai
            });
        }

        cart.total = this.calculateTotal(cart.items);
        this.saveCart(cart);

        // Mostra notificação
        this.showNotification(`${product.title} adicionado ao carrinho!`);
    }

    // Remove produto do carrinho
    removeFromCart(productId) {
        const cart = this.getCart();
        cart.items = cart.items.filter(item => item.id !== productId);
        cart.total = this.calculateTotal(cart.items);
        this.saveCart(cart);
    }

    // Atualiza quantidade
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.items.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                cart.total = this.calculateTotal(cart.items);
                this.saveCart(cart);
            }
        }
    }

    // Calcula total do carrinho
    calculateTotal(items) {
        return items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    // Limpa o carrinho
    clearCart() {
        localStorage.removeItem(this.storageKey);
        this.updateCartUI();
    }

    // Obtém quantidade total de itens
    getTotalItems() {
        const cart = this.getCart();
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Atualiza a UI do carrinho
    updateCartUI() {
        const totalItems = this.getTotalItems();
        const cartCount = document.querySelector('.cart-count');

        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Mostra notificação
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Dispara evento customizado quando o carrinho é atualizado
    dispatchCartUpdate() {
        window.dispatchEvent(new CustomEvent('cartUpdated', {
            detail: this.getCart()
        }));
    }

    // Anexa event listeners aos botões de adicionar ao carrinho
    attachEventListeners() {
        document.addEventListener('click', (e) => {
            // Botão adicionar ao carrinho
            if (e.target.matches('.add-to-cart-btn, .add-to-cart-btn *')) {
                e.preventDefault();
                const button = e.target.closest('.add-to-cart-btn');
                this.handleAddToCart(button);
            }

            // Botão abrir carrinho
            if (e.target.matches('.cart-icon, .cart-icon *')) {
                e.preventDefault();
                this.openCartModal();
            }
        });
    }

    // Manipula clique no botão adicionar ao carrinho
    handleAddToCart(button) {
        const productData = button.dataset;

        const product = {
            id: productData.productId,
            handle: productData.productHandle,
            title: productData.productTitle,
            price: parseFloat(productData.productPrice),
            image: productData.productImage,
            url: productData.productUrl,
            checkoutId: productData.checkoutId,
            quantity: 1
        };

        this.addToCart(product);
    }

    // Abre modal do carrinho
    openCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.add('active');
            this.renderCartItems();
        }
    }

    // Fecha modal do carrinho
    closeCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Renderiza itens do carrinho no modal
    renderCartItems() {
        const cart = this.getCart();
        const container = document.getElementById('cart-items-container');
        const totalElement = document.getElementById('cart-total');

        if (!container) return;

        if (cart.items.length === 0) {
            container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            if (totalElement) totalElement.textContent = 'R$ 0,00';
            return;
        }

        container.innerHTML = cart.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h4>${item.title}</h4>
          <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="qty-btn" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="remove-item" onclick="window.cart.removeFromCart('${item.id}')">&times;</button>
      </div>
    `).join('');

        if (totalElement) {
            totalElement.textContent = `R$ ${cart.total.toFixed(2)}`;
        }
    }

    // Redireciona para o checkout
    redirectToCheckout() {
        const cart = this.getCart();

        if (cart.items.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        // Se houver apenas 1 produto, redireciona direto para o checkout dele
        if (cart.items.length === 1) {
            const item = cart.items[0];
            const checkoutUrl = `${this.config.checkoutBaseUrl}/${item.checkoutId}?model=${this.config.checkoutModel}`;
            window.location.href = checkoutUrl;
            return;
        }

        // Para múltiplos produtos, precisamos de uma solução diferente
        // Vamos criar uma página intermediária ou usar API do pagou.ai
        this.handleMultipleProducts(cart);
    }

    // Manipula checkout com múltiplos produtos
    handleMultipleProducts(cart) {
        // OPÇÃO 1: Criar página intermediária que mostra todos os produtos
        // e permite o usuário escolher qual comprar

        // OPÇÃO 2: Tentar usar API do pagou.ai para criar checkout com múltiplos produtos
        // (precisa verificar se a API suporta isso)

        // OPÇÃO 3: Abrir múltiplas abas (não recomendado)

        // Por enquanto, vamos usar OPÇÃO 1 - página de seleção
        this.showMultiProductSelection(cart);
    }

    // Mostra seleção de produtos para checkout
    showMultiProductSelection(cart) {
        const modal = document.createElement('div');
        modal.className = 'checkout-selection-modal';
        modal.innerHTML = `
      <div class="checkout-selection-content">
        <h2>Selecione o produto para finalizar a compra</h2>
        <p>O checkout atual suporta apenas um produto por vez. Selecione qual produto deseja comprar:</p>
        <div class="product-selection-list">
          ${cart.items.map(item => `
            <div class="product-selection-item">
              <img src="${item.image}" alt="${item.title}">
              <div>
                <h4>${item.title}</h4>
                <p>Quantidade: ${item.quantity}</p>
                <p class="price">R$ ${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button class="btn-checkout-product" data-checkout-id="${item.checkoutId}">
                Comprar
              </button>
            </div>
          `).join('')}
        </div>
        <button class="close-modal" onclick="this.closest('.checkout-selection-modal').remove()">Fechar</button>
      </div>
    `;

        document.body.appendChild(modal);

        // Adiciona event listeners aos botões
        modal.querySelectorAll('.btn-checkout-product').forEach(btn => {
            btn.addEventListener('click', () => {
                const checkoutId = btn.dataset.checkoutId;
                const checkoutUrl = `${this.config.checkoutBaseUrl}/${checkoutId}?model=${this.config.checkoutModel}`;
                window.location.href = checkoutUrl;
            });
        });
    }
}

// Inicializa o carrinho quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShopifyCart();
    window.cart.init();
});
