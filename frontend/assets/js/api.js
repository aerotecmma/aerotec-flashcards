// api.js - FUNÇÕES PARA COMUNICAÇÃO COM A API
const API_URL = 'http://localhost:3001';

// Exportar para usar em outros arquivos
window.API = {
    URL: API_URL,
    
    // Buscar matérias
    async getMaterias() {
        const response = await fetch(`${API_URL}/api/materias`);
        return response.json();
    },
    
    // Iniciar simulado
    async iniciarSimulado(materia) {
        const response = await fetch(`${API_URL}/api/simulado/iniciar/${materia}`);
        return response.json();
    },
    
    // Corrigir simulado
    async corrigirSimulado(dados) {
        const response = await fetch(`${API_URL}/api/simulado/corrigir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        return response.json();
    }
}
console.log('📡 API configurada:', API_URL);