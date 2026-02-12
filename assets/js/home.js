document.addEventListener('DOMContentLoaded', async function () {
  try {
    const materias = await carregarMaterias();
    renderizarMaterias(materias);
    atualizarEstatisticas(materias);
  } catch (error) {
    console.error(error);
    mostrarErro();
  }
});

function resolveApiBaseUrl() {
  const saved = localStorage.getItem('api_base_url');
  if (saved) return saved;

  const host = window.location.hostname;
  const isLocal = !host || host === 'localhost' || host === '127.0.0.1';
  return isLocal ? 'http://localhost:3001' : window.location.origin;
}

const API_URL = resolveApiBaseUrl();
const QUANTIDADES_VALIDAS = [20, 50, 100];

function quantidadeSelecionada() {
  const select = document.getElementById('quantidade-select');
  const valor = Number(select?.value || localStorage.getItem('quantidadeSelecionada') || 20);
  return QUANTIDADES_VALIDAS.includes(valor) ? valor : 20;
}

async function carregarMaterias() {
  const response = await fetch(`${API_URL}/api/materias`);
  if (!response.ok) throw new Error(`Erro ${response.status} ao buscar materias`);

  const codigos = await response.json();
  if (!Array.isArray(codigos)) throw new Error('Formato invalido de materias');

  const nomes = {
    eletrica: 'Eletricidade Basica',
    regulamentos: 'Regulamentos',
    estruturas: 'Estruturas',
    motores: 'Motores'
  };

  return codigos.map((codigo) => ({
    codigo,
    nome: nomes[codigo] || codigo.toUpperCase(),
    questoes: quantidadeSelecionada(),
    cor: '#1a56db'
  }));
}

function renderizarMaterias(materias) {
  const container = document.getElementById('materiasContainer');
  if (!container) return;

  container.innerHTML = '';

  materias.forEach((materia) => {
    const card = document.createElement('div');
    card.className = 'materia-card';
    card.style.borderTop = `4px solid ${materia.cor}`;

    card.innerHTML = `
      <h3>${materia.nome}</h3>
      <p>Simulado com 4 alternativas por questao e explicacao detalhada.</p>
      <div class="card-info">
        <span class="questoes-count">${quantidadeSelecionada()} questoes</span>
        <span class="tempo-estimado">~${Math.ceil(quantidadeSelecionada() * 2)} min</span>
      </div>
      <button class="btn-iniciar" data-codigo="${materia.codigo}" data-nome="${materia.nome}">Iniciar Simulado</button>
    `;

    const btn = card.querySelector('.btn-iniciar');
    btn.addEventListener('click', () => iniciarSimulado(materia.codigo, materia.nome));
    container.appendChild(card);
  });

  const cardGeral = document.createElement('div');
  cardGeral.className = 'materia-card';
  cardGeral.style.borderTop = '4px solid #ff6b6b';
  cardGeral.innerHTML = `
    <h3>Todas as materias</h3>
    <p>Banco misto com modulo e materia por questao.</p>
    <div class="card-info">
      <span class="questoes-count">${quantidadeSelecionada()} questoes</span>
      <span class="tempo-estimado">~${Math.ceil(quantidadeSelecionada() * 2)} min</span>
    </div>
    <button class="btn-iniciar" data-codigo="todas" data-nome="Todas as materias">Iniciar Geral</button>
  `;
  cardGeral.querySelector('.btn-iniciar').addEventListener('click', () => iniciarSimulado('todas', 'Todas as materias'));
  container.appendChild(cardGeral);
}

function iniciarSimulado(codigoMateria, nomeMateria) {
  const quantidade = quantidadeSelecionada();
  localStorage.setItem('materiaCodigo', codigoMateria);
  localStorage.setItem('materiaNome', nomeMateria);
  localStorage.setItem('quantidadeSelecionada', String(quantidade));

  const modulo = codigoMateria === 'todas' ? 'todos' : 'GMP1';
  localStorage.setItem('moduloSelecionado', modulo);

  const params = new URLSearchParams({
    materia: codigoMateria,
    modulo,
    quantidade: String(quantidade)
  });
  window.location.href = `simulado.html?${params.toString()}`;
}

function atualizarEstatisticas(materias) {
  const estatisticas = document.querySelector('.hero-stats');
  if (!estatisticas) return;

  const materiasItem = estatisticas.querySelector('.stat-item:nth-child(1) .stat-number');
  const questaoItem = estatisticas.querySelector('.stat-item:nth-child(2) .stat-number');
  const corteItem = estatisticas.querySelector('.stat-item:nth-child(3) .stat-number');

  if (materiasItem) materiasItem.textContent = materias.length;
  if (questaoItem) questaoItem.textContent = `${materias.length * 100}+`;
  if (corteItem) corteItem.textContent = '70%';
}

function mostrarErro() {
  const container = document.getElementById('materiasContainer');
  if (!container) return;
  container.innerHTML = '<div class="error-message"><h3>Erro ao carregar materias</h3><p>Verifique se o backend esta ativo.</p></div>';
}
