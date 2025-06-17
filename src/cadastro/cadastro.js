document.addEventListener('DOMContentLoaded', function() {
    // Set current datetime
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('dataCadastro').value = localISOTime;

    // CPF Mask
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
        if (value.length > 7) value = value.replace(/(\.\d{3})/, '$1.');
        if (value.length > 11) value = value.replace(/(\.\d{3}\.\d{3})/, '$1-');
        e.target.value = value.substring(0, 14);
    });

    // Phone Mask
    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) value = '(' + value.substring(0, 2) + ')' + value.substring(2);
        if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10);
        e.target.value = value.substring(0, 15);
    });

    // Form submission
    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            showMessage('Por favor, preencha todos os campos corretamente', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(e.target);
        const paciente = Object.fromEntries(formData.entries());
        paciente.id = Date.now().toString();
        
        // Save to LocalStorage
        savePatient(paciente);
        
        // Show success message
        showMessage('Paciente cadastrado com sucesso!', 'success');
        
        // Reset form (except datetime)
        e.target.reset();
        document.getElementById('dataCadastro').value = localISOTime;
        resetPriorityButtons();
    });
});

// Set priority function
function setPriority(button, priority) {
    // Remove selected class from all buttons
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Update hidden select value
    document.getElementById('prioridade').value = priority;
}

// Reset priority buttons
function resetPriorityButtons() {
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('prioridade').value = '';
}

// Form validation
function validateForm() {
    const form = document.getElementById('cadastroForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            return false;
        }
    }
    
    return true;
}

// Save patient to LocalStorage
function savePatient(patient) {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    patients.push(patient);
    localStorage.setItem('patients', JSON.stringify(patients));
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}