document.addEventListener('DOMContentLoaded', function() {
    // Obtém o ID do paciente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');
    
    // Carrega os dados do paciente
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(p => p.id === pacienteId);
    
    if (!paciente) {
        alert('Paciente não encontrado!');
        window.location.href = 'atendimento.html';
        return;
    }
    
    // Preenche os dados do paciente
    document.getElementById('pacienteNome').textContent = paciente.nome;
    document.getElementById('pacienteCpf').textContent = `CPF: ${formatarCPF(paciente.cpf)}`;
    document.getElementById('pacienteIdade').textContent = `Idade: ${calcularIdade(paciente.dataNascimento)}`;
    
    // Preenche a prioridade
    const prioridadeTag = document.getElementById('pacientePrioridade');
    prioridadeTag.textContent = formatarPrioridade(paciente.prioridade);
    prioridadeTag.classList.add(`prioridade-${paciente.prioridade}`);
    
    // Preenche os dados da triagem
    if (paciente.triagem) {
        document.getElementById('triagemPressao').textContent = paciente.triagem.pressao || 'Não informado';
        document.getElementById('triagemBatimentos').textContent = paciente.triagem.batimentos || 'Não informado';
        document.getElementById('triagemTemperatura').textContent = paciente.triagem.temperatura || 'Não informado';
        document.getElementById('triagemPeso').textContent = paciente.triagem.peso || 'Não informado';
        document.getElementById('triagemAltura').textContent = paciente.triagem.altura || 'Não informado';
        document.getElementById('triagemObservacoes').textContent = paciente.triagem.observacoes || 'Nenhuma observação registrada';
    }
    
    // Configura o botão voltar
    document.getElementById('btnVoltar').addEventListener('click', function() {
        window.location.href = 'atendimento.html';
    });
    
    // Configura o formulário de atendimento
    document.getElementById('formAtendimento').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtém os dados do formulário
        const atendimento = {
            data: new Date().toISOString(),
            cid: document.getElementById('cid').value,
            diagnostico: document.getElementById('diagnostico').value,
            medicamentos: document.getElementById('medicamentos').value,
            exames: document.getElementById('exames').value,
            conduta: document.getElementById('conduta').value,
            encaminhamento: document.getElementById('encaminhamento').value,
            medico: "Dr. Médico" // Você pode pegar de um login ou deixar fixo
        };
        
        // Validação dos campos obrigatórios
        if (!atendimento.diagnostico || !atendimento.conduta) {
            alert('Por favor, preencha os campos obrigatórios (Diagnóstico e Conduta)!');
            return;
        }
        
        // Atualiza o paciente
        const pacienteIndex = pacientes.findIndex(p => p.id === pacienteId);
        if (pacienteIndex !== -1) {
            pacientes[pacienteIndex].atendimento = atendimento;
            pacientes[pacienteIndex].status = 'atendido';
            
            // Salva no localStorage
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            
            // Feedback e redirecionamento
            alert('Atendimento registrado com sucesso!');
            window.location.href = 'atendimento.html';
        }
    });
    
    // Funções auxiliares (repetidas aqui para independência)
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
        const prioridades = {
            'urgente': 'URGENTE',
            'moderado': 'MODERADO',
            'normal': 'NORMAL'
        };
        return prioridades[prioridade] || prioridade.toUpperCase();
    }
});