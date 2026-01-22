/**
 * Sistema de Carrinho com Integração pagou.ai
 * Versão 2.0 - Com API Pública
 */

class ShoppingCart {
    constructor() {
        this.storageKey = 'shopping_cart';
        this.init();
    }

    init() {
        // Carrega carrinho do localStorage
        this.loadCart();

        // Atualiza UI
        this.updateCartUI();

        // Adiciona event listeners
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Botões "Adicionar ao Carrinho"
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.currentTarget;

                const product = {
                    id: button.dataset.productId,
                    handle: button.dataset.productHandle,
                    title: button.dataset.productTitle,
                    price: button.dataset.productPrice,
                    image: button.dataset.productImage,
                    url: button.dataset.productUrl,
                    checkoutId: button.dataset.checkoutId,
                    quantity: 1
                };

                this.addToCart(product);
            });
        });
    }

    loadCart() {
        const saved = localStorage.getItem(this.storageKey);
        this.cart = saved ? JSON.parse(saved) : { items: [], total: 0 };
    }

    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    }

    getCart() {
        return this.cart;
    }

    addToCart(product) {
        // Verifica se produto já existe
        const existingItem = this.cart.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.items.push(product);
        }

        this.calculateTotal();
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.title} adicionado ao carrinho!`);
    }

    removeFromCart(productId) {
        this.cart.items = this.cart.items.filter(item => item.id !== productId);
        this.calculateTotal();
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.calculateTotal();
            this.saveCart();
            this.updateCartUI();
        }
    }

    calculateTotal() {
        this.cart.total = this.cart.items.reduce((sum, item) => {
            return sum + (parseFloat(item.price) * item.quantity);
        }, 0);
    }

    updateCartUI() {
        // Atualiza contador
        const countElement = document.querySelector('.cart-count');
        const itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);

        if (countElement) {
            if (itemCount > 0) {
                countElement.textContent = itemCount;
                countElement.style.display = 'flex';
            } else {
                countElement.style.display = 'none';
            }
        }

        // Atualiza total
        const totalElement = document.getElementById('cart-total');
        if (totalElement) {
            totalElement.textContent = `R$ ${this.cart.total.toFixed(2)}`;
        }
    }

    async redirectToCheckout() {
        const cart = this.getCart();

        if (cart.items.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        try {
            // Mostra loading
            const checkoutBtn = document.querySelector('.checkout-btn');
            const originalText = checkoutBtn.textContent;
            checkoutBtn.textContent = 'Gerando checkout...';
            checkoutBtn.disabled = true;

            // Cria integração com pagou.ai
            const pagouai = new PagouAICheckout('twqm8i-xi.myshopify.com');

            // Formata itens do carrinho
            const items = cart.items.map(item => ({
                id: item.checkoutId || item.id,
                variantId: item.checkoutId || item.id,
                productId: item.id,
                title: item.title,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                handle: item.handle,
                url: item.url
            }));

            console.log('📦 Criando checkout com', items.length, 'produtos');

            // Cria checkout dinâmico
            const checkoutUrl = await pagouai.createCheckout(items);

            console.log('✅ Checkout criado:', checkoutUrl);

            // Redireciona para checkout
            window.location.href = checkoutUrl;

        } catch (error) {
            console.error('❌ Erro ao criar checkout:', error);
            alert('Erro ao criar checkout. Tente novamente.');

            // Restaura botão
            const checkoutBtn = document.querySelector('.checkout-btn');
            checkoutBtn.textContent = 'Finalizar Compra';
            checkoutBtn.disabled = false;
        }
    }

    openCartModal() {
        const modal = document.getElementById('cart-modal');
        const overlay = document.querySelector('.cart-modal-overlay');

        if (modal && overlay) {
            this.renderCartItems();
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    }

    closeCartModal() {
        const modal = document.getElementById('cart-modal');
        const overlay = document.querySelector('.cart-modal-overlay');

        if (modal && overlay) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');

        if (!container) return;

        if (this.cart.items.length === 0) {
            container.innerHTML = '<p class="empty-cart">Seu carrinho está vazio</p>';
            return;
        }

        container.innerHTML = this.cart.items.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <p class="cart-item-price">R$ ${parseFloat(item.price).toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.cart.removeFromCart('${item.id}')">&times;</button>
      </div>
    `).join('');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializa carrinho quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cart = new ShoppingCart();
    });
} else {
    window.cart = new ShoppingCart();
}
