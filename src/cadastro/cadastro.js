document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');
    const messageDiv = document.getElementById('message');
    const dataCadastroInput = document.getElementById('dataCadastro');
    
    // Set current datetime when page loads
    const now = new Date();
    // Format to datetime-local format (YYYY-MM-DDTHH:MM)
    const formattedDateTime = now.toISOString().slice(0, 16);
    dataCadastroInput.value = formattedDateTime;
    
    // CPF mask
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 3) {
            value = value.replace(/^(\d{3})/, '$1.');
        }
        if (value.length > 7) {
            value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
        }
        if (value.length > 11) {
            value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
        }
        
        e.target.value = value.substring(0, 14);
    });
    
    // Phone mask
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            value = '(' + value;
        }
        if (value.length > 3) {
            value = value.substring(0, 3) + ') ' + value.substring(3);
        }
        if (value.length > 10) {
            value = value.substring(0, 10) + '-' + value.substring(10);
        }
        
        e.target.value = value.substring(0, 15);
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (form.checkValidity()) {
            // Simulate form submission
            messageDiv.textContent = 'Paciente cadastrado com sucesso!';
            messageDiv.className = 'message success';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                messageDiv.className = 'message';
                // Reset datetime to current time
                const now = new Date();
                dataCadastroInput.value = now.toISOString().slice(0, 16);
            }, 3000);
        } else {
            messageDiv.textContent = 'Por favor, preencha todos os campos corretamente.';
            messageDiv.className = 'message error';
        }
    });
});