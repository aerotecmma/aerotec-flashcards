function resolveApiBaseUrl() {
  const saved = localStorage.getItem('api_base_url');
  if (saved) return saved;

  const host = window.location.hostname;
  const isLocal = !host || host === 'localhost' || host === '127.0.0.1';
  return isLocal ? 'http://localhost:3001' : window.location.origin;
}

const API_URL = resolveApiBaseUrl();

window.API = {
  URL: API_URL,

  async getMaterias() {
    const response = await fetch(`${API_URL}/api/materias`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar materias: ${response.status}`);
    }
    return response.json();
  },

  async iniciarSimulado({ materia = 'todas', modulo = 'todos', quantidade = 20 } = {}) {
    const params = new URLSearchParams({ materia, modulo, quantidade: String(quantidade) });
    const response = await fetch(`${API_URL}/api/simulado/iniciar?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Erro ao iniciar simulado: ${response.status}`);
    }
    return response.json();
  },

  async corrigirSimulado(dados) {
    const response = await fetch(`${API_URL}/api/simulado/corrigir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) {
      throw new Error(`Erro ao corrigir simulado: ${response.status}`);
    }
    return response.json();
  }
};
