/**
 * Integração com API Pública do pagou.ai
 * 
 * DESCOBERTA: A API é PÚBLICA e aceita múltiplos produtos!
 * 
 * Endpoint: POST https://api-checkout.pagou.ai/public/cart
 * Sem autenticação necessária!
 */

class PagouAICheckout {
    constructor(shopDomain) {
        this.shopDomain = shopDomain;
        this.apiUrl = 'https://api-checkout.pagou.ai/public/cart';
    }

    /**
     * Cria checkout dinâmico com múltiplos produtos
     * @param {Array} cartItems - Itens do carrinho local
     * @returns {Promise<string>} - URL do checkout pagou.ai
     */
    async createCheckout(cartItems) {
        try {
            // Formata payload no formato que a API espera
            const payload = this.formatPayload(cartItems);

            console.log('📦 Enviando para pagou.ai:', payload);

            // Chama API pública
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();

            console.log('✅ Resposta da API:', data);

            // Retorna URL do checkout
            return data.data.checkout_url;

        } catch (error) {
            console.error('❌ Erro ao criar checkout:', error);
            throw error;
        }
    }

    /**
     * Formata itens do carrinho para o formato da API
     */
    formatPayload(cartItems) {
        // Pega dados do carrinho Shopify
        const shopifyCart = this.convertToShopifyFormat(cartItems);

        return {
            shop: this.shopDomain,
            shopify_internal_domain: this.shopDomain,
            cart_payload: shopifyCart
        };
    }

    /**
     * Converte itens do carrinho local para formato Shopify
     */
    convertToShopifyFormat(cartItems) {
        return {
            token: this.generateToken(),
            note: null,
            attributes: {},
            original_total_price: this.calculateTotal(cartItems),
            total_price: this.calculateTotal(cartItems),
            total_discount: 0,
            total_weight: 0,
            item_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
            items: cartItems.map(item => this.formatItem(item)),
            requires_shipping: true,
            currency: 'ARS',
            items_subtotal_price: this.calculateTotal(cartItems),
            cart_level_discount_applications: []
        };
    }

    /**
     * Formata um item individual
     */
    formatItem(item) {
        // Converte preço para centavos (formato Shopify)
        const priceInCents = Math.round(parseFloat(item.price) * 100);

        return {
            id: item.variantId || item.id,
            properties: null,
            quantity: item.quantity || 1,
            variant_id: item.variantId || item.id,
            key: `${item.variantId || item.id}:${Date.now()}`,
            title: item.title,
            price: priceInCents,
            original_price: priceInCents,
            discounted_price: priceInCents,
            line_price: priceInCents * (item.quantity || 1),
            original_line_price: priceInCents * (item.quantity || 1),
            total_discount: 0,
            discounts: [],
            sku: item.sku || '',
            grams: 0,
            vendor: item.vendor || 'Minha Loja',
            taxable: true,
            product_id: item.productId || item.id,
            product_has_only_default_variant: false,
            gift_card: false,
            final_price: priceInCents,
            final_line_price: priceInCents * (item.quantity || 1),
            url: item.url || `/products/${item.handle}`,
            featured_image: {
                aspect_ratio: 1.0,
                alt: item.title,
                height: 500,
                url: item.image,
                width: 500
            },
            image: item.image,
            handle: item.handle,
            requires_shipping: true,
            product_type: item.productType || '',
            product_title: item.title,
            product_description: item.description || '',
            variant_title: item.variantTitle || null,
            variant_options: item.variantOptions || [],
            options_with_values: [],
            line_level_discount_allocations: [],
            line_level_total_discount: 0
        };
    }

    /**
     * Calcula total do carrinho em centavos
     */
    calculateTotal(items) {
        return items.reduce((total, item) => {
            const price = parseFloat(item.price) * 100;
            const quantity = item.quantity || 1;
            return total + (price * quantity);
        }, 0);
    }

    /**
     * Gera token único para o carrinho
     */
    generateToken() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}

// Exporta para uso global
window.PagouAICheckout = PagouAICheckout;
