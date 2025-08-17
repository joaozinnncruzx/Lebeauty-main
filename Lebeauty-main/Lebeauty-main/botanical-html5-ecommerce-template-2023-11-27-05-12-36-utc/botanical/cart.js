document.addEventListener('DOMContentLoaded', () => {
    // Variáveis do DOM (Elementos da página)
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const addCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Array que vai armazenar os itens do carrinho
    let cart = [];

    // Função para atualizar a exibição do carrinho
    function updateCartUI() {
        // Limpa a lista de itens do carrinho no HTML
        cartItemsContainer.innerHTML = '';
        let total = 0;

        // Loop através de cada item no array 'cart'
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            
            // Adiciona o HTML de cada item ao carrinho
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">R$${item.price.toFixed(2)}</span>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" data-index="${index}" data-action="decrement">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-btn" data-index="${index}" data-action="increment">+</button>
                        <button class="remove-btn" data-index="${index}">Remover</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);

            total += item.price * item.quantity;
        });

        // Atualiza o contador de itens e o total
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotalElement.textContent = `R$${total.toFixed(2)}`;
    }

    // Função para adicionar um produto ao carrinho
    function addToCart(product) {
        // Verifica se o produto já está no carrinho
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            // Se já existe, apenas aumenta a quantidade
            existingItem.quantity++;
        } else {
            // Se não, adiciona o novo produto com quantidade 1
            cart.push({ ...product, quantity: 1 });
        }
        
        // Atualiza a interface
        updateCartUI();
    }

    // Função para remover um produto do carrinho
    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    // Função para atualizar a quantidade de um produto
    function updateQuantity(index, action) {
        if (action === 'increment') {
            cart[index].quantity++;
        } else if (action === 'decrement') {
            cart[index].quantity--;
        }

        // Se a quantidade chegar a 0, remove o item
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            updateCartUI();
        }
    }

    // Eventos de clique
    
    // Mostra o pop-up do carrinho
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartPopup.style.display = 'flex';
    });

    // Fecha o pop-up do carrinho
    closeCartBtn.addEventListener('click', () => {
        cartPopup.style.display = 'none';
    });

    // Adiciona o produto ao carrinho quando o botão é clicado
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Pega os dados do produto do HTML
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);

            if (productName && !isNaN(productPrice)) {
                addToCart({ name: productName, price: productPrice });
                // Mostra o carrinho automaticamente
                cartPopup.style.display = 'flex';
            }
        });
    });

    // Manipula os botões de quantidade e remoção dentro do carrinho
    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('remove-btn')) {
            const index = target.dataset.index;
            removeFromCart(index);
        } else if (target.classList.contains('quantity-btn')) {
            const index = target.dataset.index;
            const action = target.dataset.action;
            updateQuantity(index, action);
        }
    });

    // Exemplo de botão para finalizar a compra
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            alert('Compra finalizada! Total: ' + cartTotalElement.textContent);
            cart = []; // Limpa o carrinho
            updateCartUI();
            cartPopup.style.display = 'none';
        } else {
            alert('Seu carrinho está vazio!');
        }
    });
});

document.getElementById('cart-icon').addEventListener('click', function() {
    document.getElementById('cart-popup').classList.add('active');
});

document.getElementById('close-cart-btn').addEventListener('click', function() {
    document.getElementById('cart-popup').classList.remove('active');
});

document.getElementById('checkout-btn').addEventListener('click', function() {
    window.location.href = 'checkout.html';
});

// cart.js

document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalSpan = document.getElementById('cart-total');
    const cartCountSpan = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <p>${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
                    <button class="remove-item-btn btn btn-sm btn-danger" data-name="${item.name}">Remover</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }

        cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
        updateCartCount();
        saveCart();
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productName = event.target.closest('.featureCol').querySelector('.title a').getAttribute('data-name');
            const productPrice = parseFloat(event.target.closest('.featureCol').querySelector('.price').textContent.replace('R$', '').replace(',', '.'));

            const existingItem = cart.find(item => item.name === productName);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: productName, price: productPrice, quantity: 1 });
            }

            renderCart();
        });
    });

    cartItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item-btn')) {
            const productName = event.target.getAttribute('data-name');
            cart = cart.filter(item => item.name !== productName);
            renderCart();
        }
    });

    cartIcon.addEventListener('click', () => {
        cartPopup.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartPopup.classList.remove('active');
    });

    checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    renderCart();
});

// cart.js
document.addEventListener('DOMContentLoaded', () => {
    // ... seu código existente ...

    const checkoutBtn = document.getElementById('checkout-btn');

    checkoutBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Seu carrinho está vazio. Adicione itens antes de finalizar a compra.');
        } else {
            // Redireciona para a página de checkout
            window.location.href = 'checkout.html';
        }
    });

    // ... o restante do seu código ...
});