// order-confirmed.js

document.addEventListener('DOMContentLoaded', () => {
    const orderSummaryContainer = document.getElementById('order-summary');
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));

    if (lastOrder) {
        let itemsHtml = lastOrder.items.map(item => `
            <li>
                <span>${item.name} (x${item.quantity})</span>
                <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
            </li>
        `).join('');

        const orderHtml = `
            <h2>Resumo do Pedido</h2>
            <p><strong>Endereço de Entrega:</strong> ${lastOrder.address.street}, ${lastOrder.address.number}, ${lastOrder.address.city} - ${lastOrder.address.state}</p>
            <p><strong>Forma de Pagamento:</strong> Cartão de Debito (${lastOrder.payment.installments}x)</p>
            <ul>
                ${itemsHtml}
            </ul>
            <p class="total">Total: R$ ${lastOrder.total.toFixed(2)}</p>
        `;

        orderSummaryContainer.innerHTML = orderHtml;

    } else {
        orderSummaryContainer.innerHTML = '<p class="text-danger">Não foi possível encontrar os detalhes do seu pedido.</p>';
    }
});