// Constantes de prioridades
const PRIORIDADES = {
    URGENTE: {
        valor: 'urgente',
        label: 'URGENTE',
        ordem: 1,
        cor: '#ff6b6b',
        corClara: '#ffebee'
    },
    MODERADO: {
        valor: 'moderado',
        label: 'MODERADO',
        ordem: 2,
        cor: '#ffd166',
        corClara: '#fff8e1'
    },
    NORMAL: {
        valor: 'normal',
        label: 'NORMAL',
        ordem: 3,
        cor: '#06d6a0',
        corClara: '#e8f5e9'
    }
};

// Funções auxiliares
function formatarCPF(cpf) {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return 'Idade não informada';
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return `${idade} anos`;
}

function formatarPrioridade(prioridade) {
    const prioridadeObj = Object.values(PRIORIDADES).find(p => p.valor === prioridade);
    return prioridadeObj ? prioridadeObj.label : prioridade.toUpperCase();
}

function obterClassePrioridade(prioridade) {
    return `prioridade-${prioridade}`;
}

// Carrega pacientes prontos para atendimento
function carregarPacientesParaAtendimento() {
    try {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        return pacientes.filter(p => p.triagem && p.status === 'aguardando_atendimento');
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        return [];
    }
}

// Cria card do paciente
function criarCardPacienteAtendimento(paciente) {
    const card = document.createElement('div');
    card.classList.add('paciente-card', obterClassePrioridade(paciente.prioridade));
    
    if (paciente.prioridade === PRIORIDADES.URGENTE.valor) {
        card.classList.add('urgente');
    }
    
    card.innerHTML = `
        <div class="prioridade-tag ${obterClassePrioridade(paciente.prioridade)}">
            ${formatarPrioridade(paciente.prioridade)}
        </div>
        <div class="paciente-header">
            <h3 class="paciente-nome">${paciente.nome || 'Nome não informado'}</h3>
        </div>
        <div class="paciente-info">
            <div class="info-item">
                <i class="fas fa-id-card"></i>
                <span>CPF: ${formatarCPF(paciente.cpf)}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-birthday-cake"></i>
                <span>Idade: ${calcularIdade(paciente.dataNascimento)}</span>
            </div>
        </div>
        <div class="triagem-info">
            <p><strong>Pressão:</strong> ${paciente.triagem.pressao || 'Não informado'}</p>
            <p><strong>Batimentos:</strong> ${paciente.triagem.batimentos || 'Não informado'}</p>
            <p><strong>Temperatura:</strong> ${paciente.triagem.temperatura || 'Não informado'}</p>
        </div>
        <button class="btn-atender" data-id="${paciente.id}">
            <i class="fas fa-user-md"></i>
            Iniciar Atendimento
        </button>
    `;
    
    return card;
}

// Atualiza contador de pacientes
function atualizarContadorPacientes(pacientes) {
    const contador = document.getElementById('contador-pacientes');
    if (contador) {
        contador.textContent = pacientes.length;
        contador.className = 'badge';
        
        if (pacientes.some(p => p.prioridade === PRIORIDADES.URGENTE.valor)) {
            contador.classList.add('urgente');
        } else if (pacientes.some(p => p.prioridade === PRIORIDADES.MODERADO.valor)) {
            contador.classList.add('moderado');
        } else if (pacientes.length > 0) {
            contador.classList.add('normal');
        }
    }
}

// Exibe pacientes na tela
function exibirPacientesParaAtendimento(filtroPrioridade = null) {
    const container = document.getElementById('pacientesContainer');
    let pacientes = carregarPacientesParaAtendimento();
    
    if (filtroPrioridade) {
        pacientes = pacientes.filter(p => p.prioridade === filtroPrioridade);
    }
    
    container.innerHTML = '';
    
    if (pacientes.length === 0) {
        const mensagem = filtroPrioridade 
            ? `Nenhum paciente com prioridade ${formatarPrioridade(filtroPrioridade)} para atendimento`
            : 'Nenhum paciente aguardando atendimento médico';
            
        container.innerHTML = `
            <div class="nenhum-paciente">
                <i class="fas fa-procedures fa-2x"></i>
                <p>${mensagem}</p>
            </div>
        `;
        
        atualizarContadorPacientes(pacientes);
        return;
    }
    
    // Ordenar por prioridade e data de triagem
    pacientes.sort((a, b) => {
        const ordemPrioridade = {
            'urgente': 1,
            'moderado': 2,
            'normal': 3
        };
        
        if (ordemPrioridade[a.prioridade] < ordemPrioridade[b.prioridade]) return -1;
        if (ordemPrioridade[a.prioridade] > ordemPrioridade[b.prioridade]) return 1;
        
        return new Date(a.triagem.dataTriagem) - new Date(b.triagem.dataTriagem);
    });
    
    // Criar cards para cada paciente
    pacientes.forEach(paciente => {
        container.appendChild(criarCardPacienteAtendimento(paciente));
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-atender').forEach(btn => {
        btn.addEventListener('click', function() {
            const pacienteId = this.getAttribute('data-id');
            iniciarAtendimentoMedico(pacienteId);
        });
    });
    
    atualizarContadorPacientes(pacientes);
}

// Inicia atendimento médico
function iniciarAtendimentoMedico(pacienteId) {
    // Atualiza status para "em_atendimento"
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const pacienteIndex = pacientes.findIndex(p => p.id === pacienteId);
    
    if (pacienteIndex !== -1) {
        pacientes[pacienteIndex].status = 'em_atendimento';
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
    }
    
    // Redireciona para o formulário de atendimento
    window.location.href = `atendimento-form.html?id=${pacienteId}`;
}

// Configura filtros
function configurarFiltros() {
    document.getElementById('btn-todos').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-todos').classList.add('active');
        exibirPacientesParaAtendimento();
    });
    
    document.getElementById('btn-urgente').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-urgente').classList.add('active');
        exibirPacientesParaAtendimento(PRIORIDADES.URGENTE.valor);
    });
    
    document.getElementById('btn-moderado').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-moderado').classList.add('active');
        exibirPacientesParaAtendimento(PRIORIDADES.MODERADO.valor);
    });
    
    document.getElementById('btn-normal').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-normal').classList.add('active');
        exibirPacientesParaAtendimento(PRIORIDADES.NORMAL.valor);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    exibirPacientesParaAtendimento();
    configurarFiltros();
    
    // Atualiza a cada 30 segundos
    setInterval(exibirPacientesParaAtendimento, 30000);
});