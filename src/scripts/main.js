const btnCadastro = document.querySelector('.btn-cadastro');
const btnTriagem = document.querySelector('.btn-triagem');
const btnAtendimento = document.querySelector('.btn-atendimento');


btnCadastro.addEventListener('click', () => {
  window.location.href = 'src/pages/cadastro/cadastro.html';
});

btnTriagem.addEventListener('click', () => {
  window.location.href = 'src/pages/triagem/triagem.html';
});

btnAtendimento.addEventListener('click', () => {
  window.location.href = 'src/pages/atendimento/atendimento.html';
});