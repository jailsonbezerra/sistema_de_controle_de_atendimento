import { getPacientes } from '../../scripts/localStorage.js';

// Funções auxiliares
function formatarCPF(cpf) {
    if (!cpf) return 'Não informado';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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

function criarItemComIcone(icone, texto) {
    const item = document.createElement('div');
    item.classList.add('info-item');

    const iconeI = document.createElement('i');
    iconeI.classList.add('fas', icone);

    const textoSpan = document.createElement('span');
    textoSpan.textContent = texto;

    item.appendChild(iconeI);
    item.appendChild(textoSpan);
    
    return item;
}

// Função para criar o card do paciente
function criarCardPaciente(paciente) {
    const card = document.createElement('article');
    const nomeCard = document.createElement('div');
    const prioridadeCard = document.createElement('div');

    const itensCard = document.createElement('div');

    const btnTriagem = document.createElement('button');

    const cpfCard = formatarCPF(paciente.cpf);
    const idadeCard = calcularIdade(paciente.dataNascimento);
    const statusCard = paciente.status || 'Não informado';

    btnTriagem.classList.add('btn-triagem');

    card.classList.add('paciente-card', `prioridade-${paciente.prioridade}`);

    // Adiciona classe de urgência para prioridade urgente
    if (paciente.prioridade.toUpperCase() === 'urgente'.toLocaleUpperCase()) {
        card.classList.add('urgente');
    }

    prioridadeCard.innerText = paciente.prioridade.toUpperCase();
    prioridadeCard.classList.add('prioridade-tag', `prioridade-${paciente.prioridade}`);

    nomeCard.innerText = paciente.nome || 'Nome não informado';
    nomeCard.classList.add('paciente-nome', 'paciente-header');

    itensCard.appendChild(criarItemComIcone('fa-id-card', `CPF: ${cpfCard}`));
    itensCard.appendChild(criarItemComIcone('fa-birthday-cake', `Idade: ${idadeCard}`));
    itensCard.appendChild(criarItemComIcone('fa-user-md', `Status: ${statusCard}`));

    btnTriagem.appendChild(criarItemComIcone('fa-notes-medical', ''));
    btnTriagem.innerText = 'Triagem';
    btnTriagem.setAttribute('data-id', paciente.id);
    
    card.appendChild(prioridadeCard);
    card.appendChild(nomeCard);
    card.appendChild(itensCard);
    card.appendChild(btnTriagem);
    
    return card;
}

// Função para atualizar o contador de pacientes
function atualizarContadorPacientes(pacientes) {
    const contador = document.getElementById('contador-pacientes');
    if (contador) {
        contador.textContent = pacientes.length;
        
        // Atualiza classes do contador baseado na prioridade mais alta
        contador.className = 'badge';
        if (pacientes.some(p => p.prioridade === 'urgente')) {
            contador.classList.add('urgente');
        } else if (pacientes.some(p => p.prioridade === 'moderado')) {
            contador.classList.add('moderado');
        } else {
            contador.classList.add('normal');
        }
    }
}

// Função para exibir os pacientes na tela
function exibirPacientes(filtroPrioridade = null) {
    const container = document.getElementById('pacientesContainer');
    let pacientes = getPacientes();

    // Aplicar filtro se especificado
    if(filtroPrioridade) {
        pacientes = pacientes.filter(p => p.prioridade === filtroPrioridade);
    }
    
    container.innerHTML = '';
    
    if (pacientes.length === 0) {
        const mensagem = filtroPrioridade 
            ? `Nenhum paciente com prioridade ${filtroPrioridade.toUpperCase()} aguardando triagem`
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

function btnClicado(e) {
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    exibirPacientes(e.target.dataset.prioridade);
}

function configurarFiltros() {
    document.getElementById('btn-todos').addEventListener('click', btnClicado);
    
    document.getElementById('btn-urgente').addEventListener('click', btnClicado);
    
    document.getElementById('btn-moderado').addEventListener('click', btnClicado);
    
    document.getElementById('btn-normal').addEventListener('click', btnClicado);
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    exibirPacientes();
    configurarFiltros();
    
    // Atualizar a cada 30 segundos (opcional)
    setInterval(exibirPacientes, 30000);
});