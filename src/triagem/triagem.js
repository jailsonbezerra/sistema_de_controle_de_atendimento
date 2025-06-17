// Função para formatar CPF
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar data
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para calcular idade
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade;
}

// Função para carregar pacientes do localStorage
function carregarPacientes() {
    try {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        return pacientes.filter(p => !p.triagem && p.status !== 'cancelado');
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        return [];
    }
}

// Função para exibir pacientes na tela
function exibirPacientes() {
    const container = document.getElementById('pacientesContainer');
    const filtroPrioridade = document.getElementById('filtro-prioridade').value;
    const filtroBusca = document.getElementById('filtro-busca').value.toLowerCase();
    
    const pacientes = carregarPacientes()
        .filter(p => {
            const prioridadeMatch = filtroPrioridade === 'todos' || p.prioridade === filtroPrioridade;
            const buscaMatch = filtroBusca === '' || 
                              p.nome.toLowerCase().includes(filtroBusca) || 
                              p.cpf.includes(filtroBusca);
            return prioridadeMatch && buscaMatch;
        });
    
    container.innerHTML = '';
    
    if (pacientes.length === 0) {
        container.innerHTML = `
            <div class="nenhum-paciente">
                <i class="fas fa-user-clock fa-2x" style="margin-bottom: 10px;"></i>
                <p>Nenhum paciente encontrado</p>
            </div>
        `;
        return;
    }
    
    pacientes.forEach(paciente => {
        const card = document.createElement('div');
        card.className = `paciente-card ${paciente.prioridade}`;
        card.innerHTML = `
            <div class="paciente-header">
                <h3 class="paciente-nome">${paciente.nome}</h3>
                <span class="prioridade ${paciente.prioridade}">
                    ${paciente.prioridade.toUpperCase()}
                </span>
            </div>
            <div class="paciente-info">
                <div class="info-item">
                    <i class="fas fa-id-card"></i>
                    <span>CPF: ${formatarCPF(paciente.cpf.replace(/\D/g, ''))}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>Idade: ${calcularIdade(paciente.dataNascimento)} anos</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Cadastrado em: ${formatarData(paciente.dataCadastro)}</span>
                </div>
            </div>
            <button class="btn-triagem" data-id="${paciente.id}">
                <i class="fas fa-notes-medical"></i>
                Iniciar Triagem
            </button>
        `;
        container.appendChild(card);
    });
    
    // Adiciona eventos aos botões de triagem
    document.querySelectorAll('.btn-triagem').forEach(btn => {
        btn.addEventListener('click', function() {
            const pacienteId = this.getAttribute('data-id');
            window.location.href = `triagem-form.html?id=${pacienteId}`;
        });
    });
}

// Event listeners para os filtros
document.getElementById('filtro-prioridade').addEventListener('change', exibirPacientes);
document.getElementById('filtro-busca').addEventListener('input', exibirPacientes);

// Carrega os pacientes quando a página é aberta
document.addEventListener('DOMContentLoaded', exibirPacientes);