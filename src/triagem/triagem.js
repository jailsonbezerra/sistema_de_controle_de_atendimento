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

function formatarData(dataISO) {
    if (!dataISO) return 'Data não disponível';
    
    try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return 'Data inválida';
        
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return 'Erro na data';
    }
}

function calcularIdade(dataNascimento) {
    if (!dataNascimento) return 'Idade não informada';
    
    try {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        
        if (isNaN(nascimento.getTime())) return 'Data inválida';
        
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return `${idade} anos`;
    } catch (error) {
        console.error('Erro ao calcular idade:', error);
        return 'Erro na idade';
    }
}

function formatarPrioridade(prioridade) {
    const prioridadeObj = Object.values(PRIORIDADES).find(p => p.valor === prioridade);
    return prioridadeObj ? prioridadeObj.label : prioridade.toUpperCase();
}

function obterClassePrioridade(prioridade) {
    return `prioridade-${prioridade}`;
}

// Função principal para carregar pacientes
function carregarPacientes() {
    try {
        const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
        return pacientes.filter(p => !p.triagem && p.status !== 'cancelado');
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
        return [];
    }
}

// Função para criar o card do paciente
function criarCardPaciente(paciente) {
    const card = document.createElement('div');
    card.classList.add('paciente-card', obterClassePrioridade(paciente.prioridade));
    
    // Adiciona classe de urgência para prioridade urgente
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
    
    return card;
}

// Função para atualizar o contador de pacientes
function atualizarContadorPacientes(pacientes) {
    const contador = document.getElementById('contador-pacientes');
    if (contador) {
        contador.textContent = pacientes.length;
        
        // Atualiza classes do contador baseado na prioridade mais alta
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

// Função para exibir os pacientes na tela
function exibirPacientes(filtroPrioridade = null) {
    const container = document.getElementById('pacientesContainer');
    let pacientes = carregarPacientes();
    
    // Aplicar filtro se especificado
    if (filtroPrioridade) {
        pacientes = pacientes.filter(p => p.prioridade === filtroPrioridade);
    }
    
    container.innerHTML = '';
    
    if (pacientes.length === 0) {
        const mensagem = filtroPrioridade 
            ? `Nenhum paciente com prioridade ${formatarPrioridade(filtroPrioridade)} aguardando triagem`
            : 'Nenhum paciente aguardando triagem';
            
        container.innerHTML = `
            <div class="nenhum-paciente">
                <i class="fas fa-user-clock fa-2x"></i>
                <p>${mensagem}</p>
            </div>
        `;
        
        atualizarContadorPacientes(pacientes);
        return;
    }
    
    // Ordenar por prioridade (urgente > moderado > normal) e depois por data de cadastro
    pacientes.sort((a, b) => {
        // Ordem das prioridades (1 = urgente vem primeiro)
        const ordemPrioridade = {
            'urgente': 1,
            'moderado': 2,
            'normal': 3
        };
        
        // Comparar prioridades
        if (ordemPrioridade[a.prioridade] < ordemPrioridade[b.prioridade]) return -1;
        if (ordemPrioridade[a.prioridade] > ordemPrioridade[b.prioridade]) return 1;
        
        // Se prioridades iguais, ordenar por data de cadastro (mais antigo primeiro)
        return new Date(a.dataCadastro) - new Date(b.dataCadastro);
    });
    
    // Criar cards para cada paciente
    pacientes.forEach(paciente => {
        container.appendChild(criarCardPaciente(paciente));
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-triagem').forEach(btn => {
        btn.addEventListener('click', function() {
            const pacienteId = this.getAttribute('data-id');
            window.location.href = `triagem-form.html?id=${pacienteId}`;
        });
    });
    
    atualizarContadorPacientes(pacientes);
}

// Função para configurar os filtros
function configurarFiltros() {
    document.getElementById('btn-todos').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-todos').classList.add('active');
        exibirPacientes();
    });
    
    document.getElementById('btn-urgente').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-urgente').classList.add('active');
        exibirPacientes(PRIORIDADES.URGENTE.valor);
    });
    
    document.getElementById('btn-moderado').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-moderado').classList.add('active');
        exibirPacientes(PRIORIDADES.MODERADO.valor);
    });
    
    document.getElementById('btn-normal').addEventListener('click', () => {
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('btn-normal').classList.add('active');
        exibirPacientes(PRIORIDADES.NORMAL.valor);
    });
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    exibirPacientes();
    configurarFiltros();
    
    // Atualizar a cada 30 segundos (opcional)
    setInterval(exibirPacientes, 30000);
});