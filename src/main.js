const modulos = {
  TRIAGEM: `
    <h2><i class="fas fa-clipboard-check"></i> Módulo de Triagem</h2>
    <div class="alert alert-info">
      <i class="fas fa-info-circle"></i> Preencha os dados vitais do paciente
    </div>
    <form class="medical-form">
      <div class="form-group">
        <label for="pressao"><i class="fas fa-heartbeat"></i> Pressão Arterial</label>
        <input type="text" id="pressao" placeholder="Ex: 120/80 mmHg">
      </div>
      <div class="form-group">
        <label for="temperatura"><i class="fas fa-thermometer-half"></i> Temperatura</label>
        <input type="text" id="temperatura" placeholder="Em graus Celsius">
      </div>
      <button type="submit" class="btn btn-secondary">
        <i class="fas fa-check"></i> Finalizar Triagem
      </button>
    </form>
  `,
  
  ATENDIMENTO: `
    <h2><i class="fas fa-user-md"></i> Módulo de Atendimento</h2>
    <div class="patient-card">
      <h3><i class="fas fa-procedures"></i> Prontuário Médico</h3>
      <div class="form-group">
        <label for="diagnostico"><i class="fas fa-file-medical"></i> Diagnóstico</label>
        <textarea id="diagnostico" rows="4" placeholder="Descreva o diagnóstico"></textarea>
      </div>
      <div class="form-group">
        <label for="prescricao"><i class="fas fa-prescription-bottle-alt"></i> Prescrição Médica</label>
        <textarea id="prescricao" rows="4" placeholder="Descreva a medicação"></textarea>
      </div>
      <button type="submit" class="btn">
        <i class="fas fa-file-medical-alt"></i> Salvar Atendimento
      </button>
    </div>
  `
};

async function carregarModulo(modulo) {
  const conteudo = document.getElementById('conteudo');
  
  // Remove mensagem de boas-vindas
  const welcomeMsg = conteudo.querySelector('.welcome-message');
  if (welcomeMsg) conteudo.removeChild(welcomeMsg);

  try {
    if (modulo === 'CADASTRO') {
      // Carrega o conteúdo externo
      const response = await fetch('cadastro/cadastro.html');
      if (!response.ok) throw new Error('Módulo não encontrado');
      const html = await response.text();
      conteudo.innerHTML = html;
      
      // Carrega scripts dinamicamente
      const scripts = conteudo.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript).remove();
      });
    } else {
      conteudo.innerHTML = modulos[modulo];
    }
    
    // Atualiza botão ativo
    document.querySelectorAll('.medical-nav .btn').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
  } catch (error) {
    console.error('Erro ao carregar módulo:', error);
    conteudo.innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-triangle"></i> Erro ao carregar o módulo: ${error.message}
        <p>Verifique se o arquivo existe e o servidor está rodando</p>
      </div>
    `;
  }
}

// Evento de submit genérico
document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Dados salvos com sucesso!');
  });
});