function carregarModulo(modulo) {
  switch(modulo) {
    case 'CADASTRO':
      window.location.href = 'cadastro/cadastro.html';
      break;
      
    case 'TRIAGEM':
      window.location.href = 'triagem/triagem.html';
      break;
      
    case 'ATENDIMENTO':
      window.location.href = 'atendimento/atendimento.html';
      break;
      
    default:
      // Pode manter uma página inicial ou redirecionar para a página principal
      window.location.href = 'index.html';
  }
}