export function getPacientes() {
    const pacientes = localStorage.getItem('pacientes');

    return pacientes ? JSON.parse(pacientes) : [];
}

export function addPaciente(paciente) {
    const pacientes = getPacientes();
    pacientes.push(paciente);

    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

export function getPaciente(id) {
    const pacientes = getPacientes();
    const paciente = pacientes.find(paciente => paciente.id === id);

    return paciente || null;
}