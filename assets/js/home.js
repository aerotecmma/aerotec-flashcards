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
  const isGithubPages = host.endsWith('.github.io');
  if (isLocal) return 'http://localhost:3001';
  if (isGithubPages) return null;
  return window.location.origin;
}

const API_URL = resolveApiBaseUrl();
const QUANTIDADES_VALIDAS = [20, 50, 100];
const MATERIA_STOPWORDS = new Set(['a', 'e', 'da', 'das', 'de', 'do', 'dos']);
const FALLBACK_MATERIAS = [
  'eletrica',
  'teoria_e_construcao_de_motores_de_aeronaves',
  'sistemas_de_admissao_e_de_escapamento',
  'sistemas_de_combustivel_do_motor_e_medicao_do_combustivel',
  'revisoes'
];
let materiasCarregadasEmFallback = false;

function quantidadeSelecionada() {
  const select = document.getElementById('quantidade-select');
  const valor = Number(select?.value || localStorage.getItem('quantidadeSelecionada') || 20);
  return QUANTIDADES_VALIDAS.includes(valor) ? valor : 20;
}

async function carregarMaterias() {
  let materiasApi = null;

  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/api/materias`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) materiasApi = data;
      }
    } catch (error) {
      console.warn('Falha ao carregar materias da API. Usando fallback estatico.');
    }
  }

  if (!materiasApi || materiasApi.length === 0) {
    materiasCarregadasEmFallback = true;
    materiasApi = FALLBACK_MATERIAS;
  }

  return materiasApi
    .map((item) => {
      const codigo = typeof item === 'string' ? item : item?.codigo;
      if (!codigo) return null;
      const nomeDaApi = typeof item === 'object' && item ? item.nome : null;
      return {
        codigo,
        nome: nomeDaApi || formatarNomeMateria(codigo),
        questoes: quantidadeSelecionada(),
        cor: '#1a56db'
      };
    })
    .filter(Boolean);
}

function formatarNomeMateria(codigo) {
  const partes = String(codigo || '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) return String(codigo || '').toUpperCase();

  return partes
    .map((parte, index) => {
      if (index > 0 && MATERIA_STOPWORDS.has(parte)) return parte;
      return parte.charAt(0).toUpperCase() + parte.slice(1);
    })
    .join(' ');
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
  if (materiasCarregadasEmFallback && !API_URL) {
    alert('Cards carregados em modo estatico. Para iniciar simulados no GitHub Pages, configure localStorage api_base_url para sua API.');
    return;
  }

  const quantidade = quantidadeSelecionada();
  localStorage.setItem('materiaCodigo', codigoMateria);
  localStorage.setItem('materiaNome', nomeMateria);
  localStorage.setItem('quantidadeSelecionada', String(quantidade));

  const modulo = 'todos';
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
