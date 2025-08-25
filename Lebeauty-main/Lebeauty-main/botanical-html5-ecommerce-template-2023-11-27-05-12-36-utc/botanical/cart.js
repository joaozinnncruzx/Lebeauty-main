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
             z
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
        } else {
            // Redireciona para a página de checkout
            window.location.href = 'checkout.html';
        }
    });

    // ... o restante do seu código ...
});

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="decrease-quantity" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-name="${item.name}">+</button>
                    </div>
                    <button class="remove-item-btn" data-name="${item.name}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }

    // Adicionar produto ao carrinho
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const productElement = e.target.closest('.featureCol');
            const productName = productElement.querySelector('.title a').textContent;
            const productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('R$', '').replace(',', '.'));
            const productImage = productElement.querySelector('.imgHolder img').src;

            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
        }
    });

    // Lógica para o carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartPopup.style.display = 'flex';
            renderCartItems();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartPopup.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === cartPopup) {
            cartPopup.style.display = 'none';
        }
    });

    cartItemsContainer.addEventListener('click', function(e) {
        const name = e.target.dataset.name;
        if (e.target.classList.contains('increase-quantity')) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += 1;
            }
        } else if (e.target.classList.contains('decrease-quantity')) {
            const item = cart.find(item => item.name === name);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        } else if (e.target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.name !== name);
        }
        saveCart();
    });

    // Lógica de carregar detalhes do produto
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('name');
        const productPrice = parseFloat(urlParams.get('price'));
        const productImage = urlParams.get('image');
        const productDescription = urlParams.get('description');

        if (productName && !isNaN(productPrice)) {
            productDetailContainer.innerHTML = `
                <div class="col-md-6 text-center">
                    <img src="${productImage}" alt="${productName}" class="product-image">
                </div>
                <div class="col-md-6 product-info">
                    <h1>${productName}</h1>
                    <p class="product-price">R$ ${productPrice.toFixed(2).replace('.', ',')}</p>
                    <p class="product-description">${productDescription}</p>
                    <div class="quantity-control">
                        <button id="decrease-btn">-</button>
                        <input type="text" id="quantity-input" value="1" readonly>
                        <button id="increase-btn">+</button>
                    </div>
                    <button class="btn-add-to-cart" id="add-to-cart-detail-btn" 
                            data-name="${productName}" 
                            data-price="${productPrice}"
                            data-image="${productImage}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;

            // Lógica de quantidade
            const quantityInput = document.getElementById('quantity-input');
            const decreaseBtn = document.getElementById('decrease-btn');
            const increaseBtn = document.getElementById('increase-btn');
            const addToCartDetailBtn = document.getElementById('add-to-cart-detail-btn');
            
            decreaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                }
            });

            increaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                quantityInput.value = quantity + 1;
            });

            addToCartDetailBtn.addEventListener('click', () => {
                const name = addToCartDetailBtn.dataset.name;
                const price = parseFloat(addToCartDetailBtn.dataset.price);
                const image = addToCartDetailBtn.dataset.image;
                const quantity = parseInt(quantityInput.value);

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        name: name,
                        price: price,
                        image: image,
                        quantity: quantity
                    });
                }
                saveCart();
                alert(`${quantity} unidade(s) de ${name} adicionada(s) ao carrinho!`);
            });
        } else {
            productDetailContainer.innerHTML = '<p class="text-center">Produto não encontrado.</p>';
        }
    }

    updateCartCount();
});

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="decrease-quantity" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-name="${item.name}">+</button>
                    </div>
                    <button class="remove-item-btn" data-name="${item.name}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
    
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if (document.getElementById('favorites-list')) {
            renderFavoritesList();
        }
    }

    function renderFavoritesList() {
        const favoritesListContainer = document.getElementById('favorites-list');
        if (!favoritesListContainer) return;

        favoritesListContainer.innerHTML = '';
        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '<p class="text-center w-100">Você não tem nenhum item favorito.</p>';
        } else {
            favorites.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'featureCol', 'position-relative', 'mb-6');
                productElement.innerHTML = `
                    <div class="border">
                        <div class="imgHolder position-relative w-100 overflow-hidden">
                            <img src="${product.image}" alt="${product.name}" class="img-fluid w-100">
                            <ul class="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                                <li class="mr-2 overflow-hidden">
                                    <a href="javascript:void(0);" class="icon-heart d-block remove-from-favorites-btn" data-name="${product.name}"></a>
                                </li>
                                <li class="mr-2 overflow-hidden">
                                    <a href="javascript:void(0);" class="icon-cart d-block add-to-cart-btn" 
                                       data-name="${product.name}" 
                                       data-price="${product.price}" 
                                       data-image="${product.image}"></a>
                                </li>
                                <li class="mr-2 overflow-hidden">
                                    <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}" class="icon-eye d-block"></a>
                                </li>
                            </ul>
                        </div>
                        <div class="text-center py-xl-5 py-sm-4 py-2 px-xl-2 px-1">
                            <span class="title d-block mb-2">
                                <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}">${product.name}</a>
                            </span>
                            <span class="price d-block fwEbold">R$${product.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                `;
                favoritesListContainer.appendChild(productElement);
            });
        }
    }

    // Adicionar produto ao carrinho
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productName = btn.dataset.name;
            const productPrice = parseFloat(btn.dataset.price);
            const productImage = btn.dataset.image;

            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
          // Substitua a linha do alert por este bloco de código:

const toast = document.getElementById("custom-toast");

// Mostra o toast adicionando a classe 'show'
toast.classList.add("show");

// Esconde o toast após 3 segundos
setTimeout(function(){ 
    toast.classList.remove("show"); 
}, 3000); // 3000ms = 3 segundos
        }
    });

    // Lógica para o carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartPopup.style.display = 'flex';
            renderCartItems();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartPopup.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === cartPopup) {
            cartPopup.style.display = 'none';
        }
    });

    cartItemsContainer.addEventListener('click', function(e) {
        const name = e.target.dataset.name;
        if (e.target.classList.contains('increase-quantity')) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += 1;
            }
        } else if (e.target.classList.contains('decrease-quantity')) {
            const item = cart.find(item => item.name === name);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        } else if (e.target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.name !== name);
        }
        saveCart();
    });

    // Lógica de favoritos
    document.body.addEventListener('click', function(e) {
        const heartBtn = e.target.closest('.icon-heart');
        if (heartBtn) {
            e.preventDefault();
            const productElement = e.target.closest('.featureCol');
            const productName = productElement.querySelector('.title a').textContent.trim();
            const productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('R$', '').replace(',', '.'));
            const productImage = productElement.querySelector('.imgHolder img').src;
            const productLink = productElement.querySelector('.title a').href;
            const urlParams = new URLSearchParams(productLink.substring(productLink.indexOf('?')));
            const productDescription = urlParams.get('description');

            const existingFav = favorites.find(item => item.name === productName);

            if (heartBtn.classList.contains('remove-from-favorites-btn')) {
                // Remover dos favoritos
                favorites = favorites.filter(item => item.name !== productName);
                alert(`"${productName}" removido dos favoritos.`);
            } else {
                // Adicionar aos favoritos
                if (existingFav) {
                    alert(`"${productName}" já está nos favoritos!`);
                } else {
                    favorites.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        description: productDescription
                    });
                }
            }
            saveFavorites();
        }
    });

    // Lógica de carregar detalhes do produto
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('name');
        const productPrice = parseFloat(urlParams.get('price'));
        const productImage = urlParams.get('image');
        const productDescription = urlParams.get('description');

        if (productName && !isNaN(productPrice)) {
            productDetailContainer.innerHTML = `
                <div class="col-md-6 text-center">
                    <img src="${decodeURIComponent(productImage)}" alt="${decodeURIComponent(productName)}" class="product-image">
                </div>
                <div class="col-md-6 product-info">
                    <h1>${decodeURIComponent(productName)}</h1>
                    <p class="product-price">R$ ${productPrice.toFixed(2).replace('.', ',')}</p>
                    <p class="product-description">${decodeURIComponent(productDescription || '')}</p>
                    <div class="quantity-control">
                        <button id="decrease-btn">-</button>
                        <input type="text" id="quantity-input" value="1" readonly>
                        <button id="increase-btn">+</button>
                    </div>
                    <button class="btn-add-to-cart" id="add-to-cart-detail-btn" 
                            data-name="${decodeURIComponent(productName)}" 
                            data-price="${productPrice}"
                            data-image="${decodeURIComponent(productImage)}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;

            const quantityInput = document.getElementById('quantity-input');
            const decreaseBtn = document.getElementById('decrease-btn');
            const increaseBtn = document.getElementById('increase-btn');
            const addToCartDetailBtn = document.getElementById('add-to-cart-detail-btn');
            
            decreaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                }
            });

            increaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                quantityInput.value = quantity + 1;
            });

            addToCartDetailBtn.addEventListener('click', () => {
                const name = addToCartDetailBtn.dataset.name;
                const price = parseFloat(addToCartDetailBtn.dataset.price);
                const image = addToCartDetailBtn.dataset.image;
                const quantity = parseInt(quantityInput.value);

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        name: name,
                        price: price,
                        image: image,
                        quantity: quantity
                    });
                }
                saveCart();
                alert(`${quantity} unidade(s) de ${name} adicionada(s) ao carrinho!`);
            });
        } else {
            productDetailContainer.innerHTML = '<p class="text-center w-100">Produto não encontrado.</p>';
        }
    }

    renderFavoritesList();
    updateCartCount();
});

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Array de produtos para carregar a página inicial
    const productsData = [
        {
            name: "Batom de brilho YSL",
            price: 269.90,
            image: "images/Batom de brilho YSL.jpg",
            description: "Este é um batom de brilho da YSL, que oferece cor intensa e um acabamento radiante, ideal para quem busca lábios volumosos e hidratados. Sua fórmula de longa duração não craquela."
        },
        {
            name: "Corretivo YSL",
            price: 319.00,
            image: "images/Corretivo YSL.jpg",
            description: "O Corretivo YSL é a solução perfeita para uma pele impecável. Sua fórmula leve e de alta cobertura disfarça olheiras e imperfeições, proporcionando um acabamento natural e luminoso que dura o dia todo."
        },
        {
            name: "Lip Bunny",
            price: 65.90,
            image: "images/Lip Bunny.jpg",
            description: "O Lip Bunny é um hidratante labial que adiciona uma cor suave e um brilho delicado. Perfeito para o uso diário, ele mantém os lábios macios e nutridos, com um toque de diversão e frescor."
        },
        {
            name: "Iluminador Dior",
            price: 399.00,
            image: "images/Iluminador dior.jpg",
            description: "O Iluminador Dior é o segredo para um brilho radiante e sofisticado. Sua textura fina e sedosa se funde à pele, realçando os pontos altos do rosto com um acabamento luxuoso e duradouro."
        }
    ];

    function updateCartCount() {
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="decrease-quantity" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-name="${item.name}">+</button>
                    </div>
                    <button class="remove-item-btn" data-name="${item.name}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
    
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if (document.getElementById('favorites-list')) {
            renderFavoritesList();
        }
    }

    function renderFavoritesList() {
        const favoritesListContainer = document.getElementById('favorites-list');
        if (!favoritesListContainer) return;

        favoritesListContainer.innerHTML = '';
        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '<p class="text-center w-100">Você não tem nenhum item favorito.</p>';
        } else {
            favorites.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'featureCol', 'position-relative', 'mb-6');
                productElement.innerHTML = `
                    <div class="border">
                        <div class="imgHolder position-relative w-100 overflow-hidden">
                            <img src="${product.image}" alt="${product.name}" class="img-fluid w-100">
                            <ul class="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                                <li class="mr-2 overflow-hidden">
                                    <a href="javascript:void(0);" class="icon-heart d-block remove-from-favorites-btn" data-name="${product.name}"></a>
                                </li>
                                <li class="mr-2 overflow-hidden">
                                    <a href="javascript:void(0);" class="icon-cart d-block add-to-cart-btn" 
                                       data-name="${product.name}" 
                                       data-price="${product.price}" 
                                       data-image="${product.image}"></a>
                                </li>
                                <li class="mr-2 overflow-hidden">
                                    <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}" class="icon-eye d-block"></a>
                                </li>
                            </ul>
                        </div>
                        <div class="text-center py-xl-5 py-sm-4 py-2 px-xl-2 px-1">
                            <span class="title d-block mb-2">
                                <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}">${product.name}</a>
                            </span>
                            <span class="price d-block fwEbold">R$${product.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                `;
                favoritesListContainer.appendChild(productElement);
            });
        }
    }

    // Função para renderizar os produtos na página inicial
    function renderProducts() {
        const productListContainer = document.getElementById('product-list');
        if (!productListContainer) return;

        productListContainer.innerHTML = '';
        productsData.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'featureCol', 'position-relative', 'mb-6');
            productElement.innerHTML = `
                <div class="border">
                    <div class="imgHolder position-relative w-100 overflow-hidden">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid w-100">
                        <ul class="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                            <li class="mr-2 overflow-hidden">
                                <a href="javascript:void(0);" class="icon-heart d-block" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" data-description="${product.description}"></a>
                            </li>
                            <li class="mr-2 overflow-hidden">
                                <a href="javascript:void(0);" class="icon-cart d-block add-to-cart-btn" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}"></a>
                            </li>
                            <li class="mr-2 overflow-hidden">
                                <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}" class="icon-eye d-block"></a>
                            </li>
                        </ul>
                    </div>
                    <div class="text-center py-xl-5 py-sm-4 py-2 px-xl-2 px-1">
                        <span class="title d-block mb-2">
                            <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}">${product.name}</a>
                        </span>
                        <span class="price d-block fwEbold">R$${product.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                </div>
            `;
            productListContainer.appendChild(productElement);
        });
    }

    // Adicionar produto ao carrinho
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productName = btn.dataset.name;
            const productPrice = parseFloat(btn.dataset.price);
            const productImage = btn.dataset.image;

            const existingItem = cart.find(item => item.name === productName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
        }
    });

    // Lógica para o carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartPopup.style.display = 'flex';
            renderCartItems();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartPopup.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === cartPopup) {
            cartPopup.style.display = 'none';
        }
    });

    cartItemsContainer.addEventListener('click', function(e) {
        const name = e.target.dataset.name;
        if (e.target.classList.contains('increase-quantity')) {
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += 1;
            }
        } else if (e.target.classList.contains('decrease-quantity')) {
            const item = cart.find(item => item.name === name);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        } else if (e.target.classList.contains('remove-item-btn')) {
            cart = cart.filter(item => item.name !== name);
        }
        saveCart();
    });

    // Lógica de favoritos
    document.body.addEventListener('click', function(e) {
        const heartBtn = e.target.closest('.icon-heart');
        if (heartBtn) {
            e.preventDefault();
            const productName = heartBtn.dataset.name;
            const productPrice = parseFloat(heartBtn.dataset.price);
            const productImage = heartBtn.dataset.image;
            const productDescription = heartBtn.dataset.description;

            const existingFav = favorites.find(item => item.name === productName);

            if (heartBtn.classList.contains('remove-from-favorites-btn')) {
                favorites = favorites.filter(item => item.name !== productName);
                alert(`"${productName}" removido dos favoritos.`);
            } else {
                if (existingFav) {
                    alert(`"${productName}" já está nos favoritos!`);
                } else {
                    favorites.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        description: productDescription
                    });
                }
            }
            saveFavorites();
        }
    });

    // Lógica de carregar detalhes do produto
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('name');
        const productPrice = parseFloat(urlParams.get('price'));
        const productImage = urlParams.get('image');
        const productDescription = urlParams.get('description');

        const product = productsData.find(p => p.name === decodeURIComponent(productName));

        if (product) {
            productDetailContainer.innerHTML = `
                <div class="col-md-6 text-center">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <div class="col-md-6 product-info">
                    <h1>${product.name}</h1>
                    <p class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="quantity-control">
                        <button id="decrease-btn">-</button>
                        <input type="text" id="quantity-input" value="1" readonly>
                        <button id="increase-btn">+</button>
                    </div>
                    <button class="btn-add-to-cart" id="add-to-cart-detail-btn" 
                            data-name="${product.name}" 
                            data-price="${product.price}"
                            data-image="${product.image}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;

            const quantityInput = document.getElementById('quantity-input');
            const decreaseBtn = document.getElementById('decrease-btn');
            const increaseBtn = document.getElementById('increase-btn');
            const addToCartDetailBtn = document.getElementById('add-to-cart-detail-btn');
            
            decreaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                }
            });

            increaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                quantityInput.value = quantity + 1;
            });

            addToCartDetailBtn.addEventListener('click', () => {
                const name = addToCartDetailBtn.dataset.name;
                const price = parseFloat(addToCartDetailBtn.dataset.price);
                const image = addToCartDetailBtn.dataset.image;
                const quantity = parseInt(quantityInput.value);

                const existingItem = cart.find(item => item.name === name);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        name: name,
                        price: price,
                        image: image,
                        quantity: quantity
                    });
                }
                saveCart();
                alert(`${quantity} unidade(s) de ${name} adicionada(s) ao carrinho!`);
            });
        } else {
            productDetailContainer.innerHTML = '<p class="text-center w-100">Produto não encontrado.</p>';
        }
    }

    // Chama as funções de renderização ao carregar a página
    renderProducts();
    renderFavoritesList();
    updateCartCount();
});

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');
    const productDetailContainer = document.getElementById('product-detail-container');
    const favoritesListContainer = document.getElementById('favorites-list');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function updateCartCount() {
        if (cartCountSpan) {
            cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div class="item-quantity">
                        <button class="decrease-quantity" data-name="${item.name}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-name="${item.name}">+</button>
                    </div>
                    <button class="remove-item-btn" data-name="${item.name}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                total += item.price * item.quantity;
            });
        }
        cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCartItems();
    }
    
    function saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if (favoritesListContainer) {
            renderFavoritesList();
        }
    }

    function renderFavoritesList() {
        if (!favoritesListContainer) return;

        favoritesListContainer.innerHTML = '';
        if (favorites.length === 0) {
            favoritesListContainer.innerHTML = '<p class="text-center w-100">Você não tem nenhum item favorito.</p>';
        } else {
            favorites.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'featureCol', 'position-relative', 'mb-6');
                productElement.innerHTML = `
                    <div class="border">
                        <div class="imgHolder position-relative w-100 overflow-hidden">
                            <img src="${product.image}" alt="${product.name}" class="img-fluid w-100">
                            <ul class="list-unstyled postHoverLinskList d-flex justify-content-center m-0">
                                <li class="mr-2 overflow-hidden">
                                    <a href="javascript:void(0);" class="icon-heart d-block remove-from-favorites-btn" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}" data-description="${product.description}"></a>
                                </li>
                                <li class="mr-2 overflow-hidden">
                                    <a href="javascript:void(0);" class="icon-cart d-block add-to-cart-btn" 
                                       data-name="${product.name}" 
                                       data-price="${product.price}" 
                                       data-image="${product.image}"></a>
                                </li>
                                <li class="mr-2 overflow-hidden">
                                    <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}" class="icon-eye d-block"></a>
                                </li>
                            </ul>
                        </div>
                        <div class="text-center py-xl-5 py-sm-4 py-2 px-xl-2 px-1">
                            <span class="title d-block mb-2">
                                <a href="shop-detail.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description || '')}">${product.name}</a>
                            </span>
                            <span class="price d-block fwEbold">R$${product.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>
                `;
                favoritesListContainer.appendChild(productElement);
            });
        }
    }

    // Adicionar produto ao carrinho a partir das páginas de produto e detalhes
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productName = btn.dataset.name;
            const productPrice = parseFloat(btn.dataset.price);
            const productImage = btn.dataset.image;

            const existingItem = cart.find(item => item.name === productName);
            const quantity = parseInt(document.getElementById('quantity-input')?.value || 1);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity
                });
            }
        }
    });

    // Lógica para o carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartPopup.style.display = 'flex';
            renderCartItems();
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartPopup.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === cartPopup) {
            cartPopup.style.display = 'none';
        }
    });

    if(cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function(e) {
            const name = e.target.dataset.name;
            if (e.target.classList.contains('increase-quantity')) {
                const item = cart.find(item => item.name === name);
                if (item) {
                    item.quantity += 1;
                }
            } else if (e.target.classList.contains('decrease-quantity')) {
                const item = cart.find(item => item.name === name);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                }
            } else if (e.target.classList.contains('remove-item-btn')) {
                cart = cart.filter(item => item.name !== name);
            }
            saveCart();
        });
    }

    // Lógica de favoritos
    document.body.addEventListener('click', function(e) {
        const heartBtn = e.target.closest('.icon-heart');
        if (heartBtn) {
            e.preventDefault();
            const productName = heartBtn.dataset.name;
            const productPrice = parseFloat(heartBtn.dataset.price);
            const productImage = heartBtn.dataset.image;
            const productDescription = heartBtn.dataset.description;

            const existingFav = favorites.find(item => item.name === productName);

            if (heartBtn.classList.contains('remove-from-favorites-btn')) {
                favorites = favorites.filter(item => item.name !== productName);
                alert(`"${productName}" removido dos favoritos.`);
            } else {
                if (existingFav) {
                    alert(`"${productName}" já está nos favoritos!`);
                } else {
                    favorites.push({
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        description: productDescription
                    });
                   const toast = document.getElementById("custom-toast");

// Mostra o toast adicionando a classe 'show'
toast.classList.add("show");

// Esconde o toast após 3 segundos
setTimeout(function(){ 
    toast.classList.remove("show"); 
}, 3000); // 3000ms = 3 segundos
                }
            }
            saveFavorites();
        }
    });

    // Lógica de carregar detalhes do produto na página shop-detail.html
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productName = urlParams.get('name');
        const productPrice = parseFloat(urlParams.get('price'));
        const productImage = urlParams.get('image');
        const productDescription = urlParams.get('description');

        if (productName && !isNaN(productPrice)) {
            productDetailContainer.innerHTML = `
                <div class="col-md-6 text-center">
                    <img src="${decodeURIComponent(productImage)}" alt="${decodeURIComponent(productName)}" class="product-image">
                </div>
                <div class="col-md-6 product-info">
                    <h1>${decodeURIComponent(productName)}</h1>
                    <p class="product-price">R$ ${productPrice.toFixed(2).replace('.', ',')}</p>
                    <p class="product-description">${decodeURIComponent(productDescription || '')}</p>
                    <div class="quantity-control">
                        <button id="decrease-btn">-</button>
                        <input type="text" id="quantity-input" value="1" readonly>
                        <button id="increase-btn">+</button>
                    </div>
                    <button class="btn-add-to-cart" id="add-to-cart-detail-btn" 
                            data-name="${decodeURIComponent(productName)}" 
                            data-price="${productPrice}"
                            data-image="${decodeURIComponent(productImage)}">
                        Adicionar ao Carrinho
                    </button>
                </div>
            `;
            const quantityInput = document.getElementById('quantity-input');
            const decreaseBtn = document.getElementById('decrease-btn');
            const increaseBtn = document.getElementById('increase-btn');

            if(decreaseBtn) {
                 decreaseBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantityInput.value);
                    if (quantity > 1) {
                        quantityInput.value = quantity - 1;
                    }
                });
            }
            if(increaseBtn) {
                increaseBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantityInput.value);
                    quantityInput.value = quantity + 1;
                });
            }
        } else {
            productDetailContainer.innerHTML = '<p class="text-center w-100">Produto não encontrado.</p>';
        }
    }

    // Chamadas para garantir que tudo funcione ao carregar as páginas
    updateCartCount();
    renderFavoritesList();

    document.addEventListener('DOMContentLoaded', () => {

    // ===== SELETORES DE ELEMENTOS =====
    const cartIcon = document.getElementById('cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const checkoutButton = document.getElementById('checkout-btn');

    // Elementos do Pop-up de Notificação (Toast)
    const customToast = document.getElementById('custom-toast');
    const toastMessage = document.getElementById('toast-message');

    // ===== ESTADO DO CARRINHO =====
    // Tenta carregar o carrinho do localStorage. Se não existir, começa com um array vazio.
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // ===== FUNÇÕES PRINCIPAIS =====

    /**
     * Salva o estado atual do carrinho no localStorage.
     */
    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    /**
     * Adiciona um produto ao carrinho ou incrementa sua quantidade.
     * @param {string} name - Nome do produto.
     * @param {number} price - Preço do produto.
     * @param {string} image - URL da imagem do produto.
     */
    function addToCart(name, price, image) {
        // Verifica se o item já existe no carrinho
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            // Se existir, aumenta a quantidade
            existingItem.quantity++;
        } else {
            // Se não, adiciona o novo item com quantidade 1
            cart.push({ name, price, image, quantity: 1 });
        }
        
        saveCart(); // Salva o carrinho no localStorage
        updateCartUI(); // Atualiza a interface do carrinho
        showToast(`'${name}' foi adicionado ao carrinho!`); // Mostra a notificação
    }

    /**
     * Remove um item do carrinho.
     * @param {string} name - Nome do produto a ser removido.
     */
    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
        updateCartUI();
    }

    /**
     * Atualiza a quantidade de um item no carrinho.
     * @param {string} name - Nome do produto.
     * @param {number} quantity - Nova quantidade.
     */
    function updateQuantity(name, quantity) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                removeFromCart(name); // Remove se a quantidade for 0 ou menor
            } else {
                saveCart();
                updateCartUI();
            }
        }
    }
    
    /**
     * Atualiza toda a interface do carrinho (pop-up, total e contador).
     */
    function updateCartUI() {
        cartItemsContainer.innerHTML = ''; // Limpa os itens atuais
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center">Seu carrinho está vazio.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                totalItems += item.quantity;

                // Cria o HTML para cada item no carrinho
                const cartItemHTML = `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <p class="cart-item-name">${item.name}</p>
                            <p class="cart-item-price">R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                            <div class="cart-item-quantity">
                                <label>Qtd: </label>
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-name="${item.name}">
                            </div>
                        </div>
                        <button class="remove-item-btn" data-name="${item.name}">&times;</button>
                    </div>
                `;
                cartItemsContainer.innerHTML += cartItemHTML;
            });
        }
        
        // Atualiza o valor total e o contador no ícone
        cartTotalElement.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        cartCountElement.innerText = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none'; // Mostra/esconde o contador
    }

    /**
     * Mostra uma notificação (toast) na tela.
     * @param {string} message - A mensagem a ser exibida.
     */
    function showToast(message) {
        if (customToast && toastMessage) {
            toastMessage.innerText = message;
            customToast.classList.add('show');
            // Esconde o toast após 3 segundos
            setTimeout(() => {
                customToast.classList.remove('show');
            }, 3000);
        }
    }

    // ===== EVENT LISTENERS (OUVINTES DE EVENTOS) =====
    
    // Abrir o pop-up do carrinho
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartPopup.style.display = 'block';
        });
    }

    // Fechar o pop-up do carrinho
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartPopup.style.display = 'none';
        });
    }
    
    // Fechar o pop-up clicando fora dele
    if (cartPopup) {
        cartPopup.addEventListener('click', (e) => {
            if (e.target === cartPopup) {
                cartPopup.style.display = 'none';
            }
        });
    }

    // Adicionar item ao clicar nos botões "Adicionar ao Carrinho"
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);
            const image = button.dataset.image;
            addToCart(name, price, image);
        });
    });

    // Event listener para os botões de remover e inputs de quantidade (usando delegação de evento)
    cartItemsContainer.addEventListener('click', (e) => {
        // Se o clique foi no botão de remover
        if (e.target.classList.contains('remove-item-btn')) {
            const name = e.target.dataset.name;
            removeFromCart(name);
        }
    });

    cartItemsContainer.addEventListener('change', (e) => {
        // Se o valor do input de quantidade mudou
        if (e.target.classList.contains('quantity-input')) {
            const name = e.target.dataset.name;
            const quantity = parseInt(e.target.value, 10);
            updateQuantity(name, quantity);
        }
    });

    // Botão de Finalizar Compra
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                // Redireciona para a página de checkout.
                // Os dados do carrinho estarão salvos no localStorage para serem usados lá.
                window.location.href = 'checkout.html'; // Mude para o nome da sua página de checkout
            } else {

            }
        });
    }

    // ===== INICIALIZAÇÃO =====
    // Atualiza a UI do carrinho assim que a página carrega para mostrar os itens já salvos.
    updateCartUI();
});
    
});