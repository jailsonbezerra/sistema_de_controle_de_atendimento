document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    const dataCadastroInput = document.getElementById('dataCadastro');
    const messageDiv = document.getElementById('message');

    
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    dataCadastroInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;

    
    function formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, ""); 
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return cpf;
    }

   
    function formatPhone(phone) {
        phone = phone.replace(/\D/g, ""); 
        phone = phone.replace(/^(\d{2})(\d)/g, "($1) $2");
        phone = phone.replace(/(\d)(\d{4})$/, "$1-$2");
        return phone;
    }

   
    document.getElementById('cpf').addEventListener('input', (e) => {
        e.target.value = formatCPF(e.target.value);
    });

    
    document.getElementById('telefone').addEventListener('input', (e) => {
        e.target.value = formatPhone(e.target.value);
    });

    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

       
        const paciente = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            endereco: document.getElementById('endereco').value,
            telefone: document.getElementById('telefone').value,
            dataCadastro: document.getElementById('dataCadastro').value
        };

        console.log('Dados do Paciente para Cadastro:', paciente);
        showMessage('Paciente cadastrado com sucesso! (Dados no console)', 'success');
        cadastroForm.reset(); 
        const nowAfterReset = new Date();
        const yearAfterReset = nowAfterReset.getFullYear();
        const monthAfterReset = (nowAfterReset.getMonth() + 1).toString().padStart(2, '0');
        const dayAfterReset = nowAfterReset.getDate().toString().padStart(2, '0');
        const hoursAfterReset = nowAfterReset.getHours().toString().padStart(2, '0');
        const minutesAfterReset = nowAfterReset.getMinutes().toString().padStart(2, '0');
        dataCadastroInput.value = `${yearAfterReset}-${monthAfterReset}-${dayAfterReset}T${hoursAfterReset}:${minutesAfterReset}`;
    });

    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`; 
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000); 
    }
});