// checkout.js

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos HTML
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalSpan = document.getElementById('checkout-total');
    
    const addressList = document.getElementById('address-list');
    const addAddressBtn = document.getElementById('add-address-btn');
    const addressForm = document.getElementById('address-form');
    const cancelAddressBtn = document.getElementById('cancel-address-btn');
    const addressStreetInput = document.getElementById('address-street');
    const addressNumberInput = document.getElementById('address-number');
    const addressComplementInput = document.getElementById('address-complement');
    const addressCityInput = document.getElementById('address-city');
    const addressStateInput = document.getElementById('address-state');
    const addressZipInput = document.getElementById('address-zip');
    
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    const cardInstallmentsSelect = document.getElementById('card-installments');
    const emailInput = document.getElementById('email');

    // Novas referências para a seleção de pagamento
    const paymentMethodSelect = document.getElementById('payment-method-select');
    const creditForm = document.getElementById('credit-form');
    const debitForm = document.getElementById('debit-form');
    
    const cardNumberInput = document.getElementById('card-number');
    const cardNameInput = document.getElementById('card-name');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');

    const debitCardNumberInput = document.getElementById('debit-card-number');
    const debitCardNameInput = document.getElementById('debit-card-name');
    const debitExpiryDateInput = document.getElementById('debit-expiry-date');
    const debitCvvInput = document.getElementById('debit-cvv');

    // Dados do carrinho e endereço
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    let selectedAddress = null;
    
    // --- Funções de Endereço (sem alteração) ---
    function saveAddresses() {
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }

    function renderAddresses() {
        addressList.innerHTML = '';
        if (addresses.length === 0) {
            addressList.innerHTML = '<li class="list-group-item text-muted">Nenhum endereço cadastrado.</li>';
        } else {
            addresses.forEach((addr, index) => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center', 'address-item');
                if (selectedAddress && selectedAddress.street === addr.street && selectedAddress.number === addr.number) {
                    li.classList.add('active', 'bg-light');
                }
                li.innerHTML = `
                    <div>
                        <strong>${addr.street}, ${addr.number}</strong><br>
                        <span>${addr.city} - ${addr.state}, ${addr.zip}</span>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-info select-address-btn" data-index="${index}">Selecionar</button>
                        <button class="btn btn-sm btn-danger remove-address-btn" data-index="${index}">Remover</button>
                    </div>
                `;
                addressList.appendChild(li);
            });
        }
    }

    addAddressBtn.addEventListener('click', () => {
        addressForm.style.display = 'block';
        addAddressBtn.style.display = 'none';
        addressForm.reset();
    });

    cancelAddressBtn.addEventListener('click', () => {
        addressForm.style.display = 'none';
        addAddressBtn.style.display = 'block';
    });

    addressForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newAddress = {
            street: addressStreetInput.value,
            number: addressNumberInput.value,
            complement: addressComplementInput.value,
            city: addressCityInput.value,
            state: addressStateInput.value,
            zip: addressZipInput.value
        };
        addresses.push(newAddress);
        saveAddresses();
        renderAddresses();
        addressForm.style.display = 'none';
        addAddressBtn.style.display = 'block';
    });

    addressList.addEventListener('click', (event) => {
        if (event.target.classList.contains('select-address-btn')) {
            const index = event.target.getAttribute('data-index');
            selectedAddress = addresses[index];
            renderAddresses();
        } else if (event.target.classList.contains('remove-address-btn')) {
            const index = event.target.getAttribute('data-index');
            addresses.splice(index, 1);
            if (selectedAddress && selectedAddress === addresses[index]) {
                selectedAddress = null;
            }
            saveAddresses();
            renderAddresses();
        }
    });

    paymentMethodSelect.addEventListener('change', (event) => {
        if (event.target.value === 'credit') {
            creditForm.style.display = 'block';
            debitForm.style.display = 'none';
        } else {
            creditForm.style.display = 'none';
            debitForm.style.display = 'block';
        }
    });

    function renderCheckoutItems() {
        checkoutItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            checkoutItemsContainer.innerHTML = '<li class="text-muted">Seu carrinho está vazio.</li>';
        } else {
            cart.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                li.innerHTML = `
                    <span>${item.name}</span>
                    <span class="badge badge-primary badge-pill">x${item.quantity}</span>
                    <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutItemsContainer.appendChild(li);
                total += item.price * item.quantity;
            });
        }
        checkoutTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
    }

    function generateInstallments() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cardInstallmentsSelect.innerHTML = '';
        const maxInstallments = 12; 
        
        for (let i = 1; i <= maxInstallments; i++) {
            const option = document.createElement('option');
            const installmentValue = (total / i).toFixed(2);
            option.value = i;
            
            if (i === 1) {
                 option.textContent = `1x de R$ ${total.toFixed(2)} (à vista)`;
            } else {
                option.textContent = `${i}x de R$ ${installmentValue}`;
            }
            cardInstallmentsSelect.appendChild(option);
        }
    }
    
    // Função para validar os campos do cartão
    function validateCardFields(paymentMethod) {
        if (paymentMethod === 'credit') {
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            const cardName = cardNameInput.value.trim();
            const expiryDate = expiryDateInput.value.trim();
            const cvv = cvvInput.value.trim();
            
            if (cardNumber.length < 16 || isNaN(cardNumber)) {
                alert('Por favor, insira um número de cartão de crédito válido com 16 dígitos.');
                return false;
            }
            if (cardName === '') {
                alert('Por favor, insira o nome impresso no cartão de crédito.');
                return false;
            }
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Por favor, insira a data de validade no formato MM/AA.');
                return false;
            }
            if (cvv.length < 3 || isNaN(cvv)) {
                alert('Por favor, insira um CVV válido.');
                return false;
            }
        } else if (paymentMethod === 'debit') {
            const cardNumber = debitCardNumberInput.value.replace(/\s/g, '');
            const cardName = debitCardNameInput.value.trim();
            const expiryDate = debitExpiryDateInput.value.trim();
            const cvv = debitCvvInput.value.trim();
            
            if (cardNumber.length < 16 || isNaN(cardNumber)) {
                alert('Por favor, insira um número de cartão de débito válido com 16 dígitos.');
                return false;
            }
            if (cardName === '') {
                alert('Por favor, insira o nome impresso no cartão de débito.');
                return false;
            }
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                alert('Por favor, insira a data de validade no formato MM/AA.');
                return false;
            }
            if (cvv.length < 3 || isNaN(cvv)) {
                alert('Por favor, insira um CVV válido.');
                return false;
            }
        }
        return true;
    }

    // Evento de submissão do formulário de pagamento
    confirmPaymentBtn.addEventListener('click', (event) => {
        event.preventDefault();

        if (!selectedAddress) {
            alert('Por favor, selecione ou adicione um endereço de entrega.');
            return;
        }

        const paymentMethod = paymentMethodSelect.value;
        if (!validateCardFields(paymentMethod)) {
            return;
        }
        
        console.log('Processando pagamento...');
        
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let paymentInfo = { method: paymentMethod };
        if (paymentMethod === 'credit') {
            paymentInfo.cardNumber = '************' + cardNumberInput.value.slice(-4);
            paymentInfo.installments = cardInstallmentsSelect.value;
            paymentInfo.expiryDate = expiryDateInput.value;
        } else {
            paymentInfo.cardNumber = '************' + debitCardNumberInput.value.slice(-4);
            paymentInfo.expiryDate = debitExpiryDateInput.value;
        }

        localStorage.setItem('lastOrder', JSON.stringify({
            items: cart,
            total: total,
            address: selectedAddress,
            payment: paymentInfo
        }));
        
        localStorage.setItem('cart', JSON.stringify([]));
        window.location.href = 'order-confirmed.html';
    });
    
    
    // --- Inicialização ---
    renderCheckoutItems();
    renderAddresses();
    generateInstallments();
});