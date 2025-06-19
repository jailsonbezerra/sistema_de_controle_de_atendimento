document.addEventListener('DOMContentLoaded', function() {
    // Obtém o ID do paciente da URL
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');
    
    // Carrega os dados do paciente
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes.find(p => p.id === pacienteId);
    
    if (!paciente) {
        alert('Paciente não encontrado!');
        window.location.href = 'triagem.html';
        return;
    }
    
    // Preenche os dados do paciente
    document.getElementById('pacienteNome').textContent = paciente.nome;
    document.getElementById('pacienteCpf').textContent = `CPF: ${formatarCPF(paciente.cpf)}`;
    document.getElementById('pacienteIdade').textContent = `Idade: ${calcularIdade(paciente.dataNascimento)}`;
    
    const prioridadeTag = document.getElementById('pacientePrioridade');
    prioridadeTag.textContent = formatarPrioridade(paciente.prioridade);
    prioridadeTag.classList.add(`prioridade-${paciente.prioridade}`);
    
    // Define a prioridade atual no select
    const selectPrioridade = document.getElementById('prioridade');
    selectPrioridade.value = paciente.prioridade;
    
    // Atualiza a tag de prioridade quando o select muda
    selectPrioridade.addEventListener('change', function() {
        prioridadeTag.textContent = formatarPrioridade(this.value);
        prioridadeTag.className = 'prioridade-tag'; // Remove classes anteriores
        prioridadeTag.classList.add(`prioridade-${this.value}`);
    });
    
    // Configura o botão cancelar
    document.getElementById('btnCancelar').addEventListener('click', function() {
        window.location.href = 'triagem.html';
    });
    
    // Configura o formulário
    document.getElementById('formTriagem').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtém os dados da triagem
        const triagem = {
            pressao: document.getElementById('pressao').value,
            batimentos: document.getElementById('batimentos').value,
            temperatura: document.getElementById('temperatura').value,
            peso: document.getElementById('peso').value,
            altura: document.getElementById('altura').value,
            observacoes: document.getElementById('observacoes').value,
            dataTriagem: new Date().toISOString(),
            prioridadeAtualizada: document.getElementById('prioridade').value !== paciente.prioridade
        };
        
        // Atualiza o paciente com os dados da triagem e prioridade
        paciente.triagem = triagem;
        paciente.prioridade = document.getElementById('prioridade').value; // Atualiza a prioridade
        paciente.status = 'aguardando_atendimento';
        
        // Salva no localStorage
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        
        // Redireciona para a lista de triagem
        window.location.href = 'triagem.html';
    });
    
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
        const formatos = {
            'urgente': 'URGENTE',
            'moderado': 'MODERADO',
            'normal': 'NORMAL'
        };
        return formatos[prioridade] || prioridade.toUpperCase();
    }
});