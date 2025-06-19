import { getPacientes, addPaciente, getPaciente } from "../../scripts/localStorage.js";

document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial
    dataHoraAtual();

    // Máscaras de campos
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
        if (value.length > 7) value = value.replace(/(\.\d{3})/, '$1.');
        if (value.length > 11) value = value.replace(/(\.\d{3}\.\d{3})/, '$1-');
        e.target.value = value.substring(0, 14);
    });

    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) value = '(' + value.substring(0, 2) + ')' + value.substring(2);
        if (value.length > 10) value = value.substring(0, 10) + '-' + value.substring(10);
        e.target.value = value.substring(0, 15);
    });

    // Evento de submit do formulário
    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Por favor, preencha todos os campos obrigatórios corretamente', 'error');
            return;
        }
        
        const paciente = {
            id: Date.now().toString(),
            ...Object.fromEntries(new FormData(e.target).entries()),
            triagem: null,  // Inicializa como null para ser preenchido na triagem
            atendimento: null,  // Inicializa como null para ser preenchido no atendimento
            status: 'cadastrado'  // Novo campo para controle de fluxo
        };
        
        addPaciente(paciente);
        showMessage('Paciente cadastrado com sucesso!', 'success');
        
        // Reset do formulário mantendo a data/hora atual
        e.target.reset();
        document.getElementById('dataCadastro').value = localISOTime;
        resetPriorityButtons();
    });
});

const btnUrgente = document.querySelector('.urgent');
const btnModerate = document.querySelector('.moderate');
const btnNormal = document.querySelector('.normal');

btnUrgente.addEventListener('click', function() {
    setPriority(btnUrgente, 'urgente');
});

btnModerate.addEventListener('click', function() {
    setPriority(btnModerate, 'moderado');
});

btnNormal.addEventListener('click', function() {
    setPriority(btnNormal, 'normal');
});

const btnReset = document.querySelector('.reset-btn');

btnReset.addEventListener('click', function() {
    dataHoraAtual();
    resetPriorityButtons();

});

// Funções auxiliares
function setPriority(button, priority) {
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    button.classList.add('selected');
    document.getElementById('prioridade').value = priority;
}

function resetPriorityButtons() {
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('prioridade').value = '';
}

function validateForm() {
    const requiredFields = document.querySelectorAll('#cadastroForm [required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Validação específica para CPF (apenas tamanho, validação real seria mais complexa)
    const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        document.getElementById('cpf').classList.add('error');
        isValid = false;
    }
    
    return isValid;
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 5000);
}

function dataHoraAtual() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now - timezoneOffset)).toISOString().slice(0, 16);
    document.getElementById('dataCadastro').textContent = localISOTime;
}