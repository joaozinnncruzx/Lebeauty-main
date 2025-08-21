document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('edit-button');
    const cancelButton = document.getElementById('cancel-button');
    const editForm = document.getElementById('edit-form');
    const infoDisplay = document.getElementById('info-display');
    const nameInput = document.getElementById('name-input');
    const emailInput = document.getElementById('email-input');
    const currentNameSpan = document.getElementById('current-name');
    const currentEmailSpan = document.getElementById('current-email');
    const displayNameSpan = document.getElementById('display-name');

    // Inicializa os campos de input com os valores atuais
    nameInput.value = currentNameSpan.textContent;
    emailInput.value = currentEmailSpan.textContent;

    // --- Lógica para mostrar o formulário de edição ---
    editButton.addEventListener('click', function() {
        infoDisplay.style.display = 'none';
        editForm.style.display = 'block';
    });

    // --- Lógica para esconder o formulário de edição (botão Cancelar) ---
    cancelButton.addEventListener('click', function() {
        infoDisplay.style.display = 'block';
        editForm.style.display = 'none';
        
        // Reseta os campos do formulário para os valores iniciais
        nameInput.value = currentNameSpan.textContent;
        emailInput.value = currentEmailSpan.textContent;
    });

    // --- Lógica para salvar e atualizar os dados na página ---
    editForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // Pega os novos valores dos inputs
        const newName = nameInput.value;
        const newEmail = emailInput.value;

        // Atualiza os valores nas áreas de exibição
        currentNameSpan.textContent = newName;
        currentEmailSpan.textContent = newEmail;
        displayNameSpan.textContent = newName;

        // Esconde o formulário e mostra as informações atualizadas
        infoDisplay.style.display = 'block';
        editForm.style.display = 'none';

        alert('As alterações foram salvas! (apenas nesta sessão do navegador)');
    });
});