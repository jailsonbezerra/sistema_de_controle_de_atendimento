function carregarModulo(modulo) {
  const conteudo = document.getElementById('conteudo');
  let html = '';
  
  switch(modulo) {
    case 'CADASTRO':
      html = `
        <div class="module-title">
          <i class="fas fa-user-plus"></i>
          <h2>Módulo de Cadastro</h2>
        </div>
        <p>Área para cadastrar novos pacientes no sistema.</p>
        <ul class="module-list">
          <li><i class="fas fa-id-card"></i> Dados pessoais</li>
          <li><i class="fas fa-address-book"></i> Informações de contato</li>
          <li><i class="fas fa-file-medical"></i> Histórico médico</li>
          <li><i class="fas fa-heartbeat"></i> Informações sobre planos de saúde</li>
        </ul>
      `;
      break;
      
    case 'TRIAGEM':
      html = `
        <div class="module-title">
          <i class="fas fa-notes-medical"></i>
          <h2>Módulo de Triagem</h2>
        </div>
        <p>Área para avaliação inicial dos pacientes.</p>
        <ul class="module-list">
          <li><i class="fas fa-thermometer-half"></i> Verificação de sinais vitais</li>
          <li><i class="fas fa-stethoscope"></i> Análise de sintomas</li>
          <li><i class="fas fa-exclamation-triangle"></i> Classificação de urgência</li>
          <li><i class="fas fa-procedures"></i> Encaminhamento para especialidades</li>
        </ul>
      `;
      break;
      
    case 'ATENDIMENTO':
      html = `
        <div class="module-title">
          <i class="fas fa-user-md"></i>
          <h2>Módulo de Atendimento</h2>
        </div>
        <p>Área para atendimento médico especializado.</p>
        <ul class="module-list">
          <li><i class="fas fa-procedures"></i> Consulta médica</li>
          <li><i class="fas fa-prescription-bottle-alt"></i> Prescrição de medicamentos</li>
          <li><i class="fas fa-clipboard-check"></i> Exames e procedimentos</li>
          <li><i class="fas fa-file-prescription"></i> Relatórios e atestados</li>
        </ul>
      `;
      break;
      
    default:
      html = `
        <div class="welcome-message">
          <div class="welcome-icon">
            <i class="fas fa-heartbeat"></i>
          </div>
          <p>Selecione um módulo acima para iniciar o atendimento ao paciente.</p>
          <p>Sistema de gestão de fluxo hospitalar - Versão 2.0</p>
        </div>
      `;
  }
  
  conteudo.innerHTML = html;
}