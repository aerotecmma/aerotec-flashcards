function resolveApiBaseUrl() {
  const saved = localStorage.getItem('api_base_url');
  if (saved) return saved;

  const host = window.location.hostname;
  const isLocal = !host || host === 'localhost' || host === '127.0.0.1';
  return isLocal ? 'http://localhost:3001' : window.location.origin;
}

const CONFIG = {
  API_BASE_URL: resolveApiBaseUrl(),
  TEMPO_LIMITE: 60 * 60,
  AUTO_KEY: 'simulado_auto_avancar'
};

const estado = {
  simuladoId: null,
  perguntas: [],
  respostas: {},
  marcadas: new Set(),
  questaoAtual: 0,
  tempoDecorrido: 0,
  timerId: null,
  materia: 'todas',
  modulo: 'todos',
  quantidade: 20
};

const el = {
  timer: document.getElementById('timer'),
  currentQuestion: document.getElementById('current-question'),
  questionNumber: document.getElementById('question-number'),
  questionText: document.getElementById('question-text'),
  optionsContainer: document.getElementById('options-container'),
  progressNumbers: document.getElementById('progress-numbers'),
  btnAnterior: document.getElementById('btn-anterior'),
  btnProxima: document.getElementById('btn-proxima'),
  btnMarcar: document.getElementById('btn-marcar'),
  btnAutoAvancar: document.getElementById('btn-auto-avancar'),
  btnAutoToggle: document.getElementById('btn-auto-toggle'),
  autoText: document.getElementById('auto-avancar-text'),
  modalFinalizar: document.getElementById('modal-finalizar'),
  modalRespondidas: document.getElementById('modal-respondidas'),
  modalTempo: document.getElementById('modal-tempo'),
  modalMarcadas: document.getElementById('modal-marcadas'),
  questionTopic: document.querySelector('.question-topic')
};

function formatarTempo(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const secs = segundos % 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function totalQuestoes() {
  return estado.perguntas.length;
}

function validarOpcao(opcaoId) {
  return ['A', 'B', 'C', 'D'].includes(String(opcaoId || '').toUpperCase());
}

function atualizarAutoAvancarUI() {
  const ativo = localStorage.getItem(CONFIG.AUTO_KEY) === 'true';
  if (el.autoText) el.autoText.textContent = `Auto-Avancar: ${ativo ? 'ON' : 'OFF'}`;
  if (el.btnAutoAvancar) el.btnAutoAvancar.classList.toggle('active', ativo);
  if (el.btnAutoToggle) el.btnAutoToggle.classList.toggle('active', ativo);
}

function atualizarTimer() {
  if (el.timer) el.timer.textContent = formatarTempo(estado.tempoDecorrido);
}

function iniciarTimer() {
  clearInterval(estado.timerId);
  estado.timerId = setInterval(() => {
    estado.tempoDecorrido += 1;
    atualizarTimer();
    if (estado.tempoDecorrido >= CONFIG.TEMPO_LIMITE) finalizarSimulado();
  }, 1000);
}

function atualizarRotuloTotal() {
  const total = totalQuestoes();
  const progress = document.querySelector('.progress-display span');
  if (progress) {
    progress.innerHTML = `Questao <span id="current-question">${estado.questaoAtual + 1}</span> de ${total}`;
    el.currentQuestion = document.getElementById('current-question');
  }

  const respondidasNode = el.modalRespondidas?.closest('.stat-item')?.querySelector('strong');
  if (respondidasNode) {
    respondidasNode.innerHTML = `<span id="modal-respondidas">${Object.keys(estado.respostas).length}</span>/${total}`;
    el.modalRespondidas = document.getElementById('modal-respondidas');
  }
}

function atualizarBotoesNavegacao() {
  const idx = estado.questaoAtual;
  const total = totalQuestoes();
  if (el.btnAnterior) el.btnAnterior.disabled = idx === 0;
  if (el.btnProxima) el.btnProxima.disabled = idx >= total - 1;
}

function atualizarIndicadoresProgresso() {
  const botoes = el.progressNumbers?.children;
  if (!botoes) return;

  for (let i = 0; i < botoes.length; i += 1) {
    const btn = botoes[i];
    btn.classList.remove('active', 'answered', 'marked');
    if (i === estado.questaoAtual) btn.classList.add('active');

    const pergunta = estado.perguntas[i];
    if (pergunta && estado.respostas[pergunta.id]) btn.classList.add('answered');
    if (estado.marcadas.has(i)) btn.classList.add('marked');
  }
}

function renderizarBotoesProgresso() {
  if (!el.progressNumbers) return;
  el.progressNumbers.innerHTML = '';

  for (let i = 0; i < totalQuestoes(); i += 1) {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.innerHTML = `${i + 1}<div class="status-indicator"></div>`;
    dot.addEventListener('click', () => carregarQuestao(i));
    el.progressNumbers.appendChild(dot);
  }
}

function renderizarOpcoes(questao) {
  if (!el.optionsContainer) return;
  el.optionsContainer.innerHTML = '';

  for (const opcao of questao.opcoes) {
    const label = document.createElement('label');
    label.className = 'option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `q${questao.id}`;
    input.value = opcao.id;
    if (estado.respostas[questao.id] === opcao.id) input.checked = true;
    input.addEventListener('change', () => selecionarResposta(opcao.id));

    const custom = document.createElement('span');
    custom.className = 'custom-radio';

    const letter = document.createElement('span');
    letter.className = 'option-letter';
    letter.textContent = `${opcao.id}.`;

    const text = document.createElement('span');
    text.className = 'option-text';
    text.textContent = opcao.texto;

    label.append(input, custom, letter, text);
    el.optionsContainer.appendChild(label);
  }
}

function carregarQuestao(indice) {
  if (indice < 0 || indice >= totalQuestoes()) return;

  estado.questaoAtual = indice;
  const questao = estado.perguntas[indice];
  if (!questao) return;

  if (el.currentQuestion) el.currentQuestion.textContent = indice + 1;
  if (el.questionNumber) el.questionNumber.textContent = `Questao ${indice + 1}`;
  if (el.questionText) el.questionText.textContent = questao.pergunta;
  if (el.questionTopic) el.questionTopic.textContent = `${questao.modulo || ''} ${questao.materia || ''}`.trim();

  renderizarOpcoes(questao);
  atualizarBotoesNavegacao();
  atualizarIndicadoresProgresso();
  atualizarRotuloTotal();
}

function selecionarResposta(opcaoId) {
  const opcao = String(opcaoId || '').toUpperCase();
  if (!validarOpcao(opcao)) return;

  const questao = estado.perguntas[estado.questaoAtual];
  if (!questao) return;

  estado.respostas[questao.id] = opcao;
  atualizarIndicadoresProgresso();
  atualizarRotuloTotal();

  const auto = localStorage.getItem(CONFIG.AUTO_KEY) === 'true';
  if (auto && estado.questaoAtual < totalQuestoes() - 1) {
    setTimeout(() => carregarQuestao(estado.questaoAtual + 1), 300);
  }
}

function montarRespostasParaCorrecao() {
  return estado.perguntas
    .map((p, index) => {
      const opcaoId = estado.respostas[p.id];
      if (!opcaoId) return null;
      return { numero: index + 1, pergunta_id: p.id, opcao_id: opcaoId };
    })
    .filter(Boolean);
}

async function finalizarSimulado() {
  clearInterval(estado.timerId);

  try {
    const respostas = montarRespostasParaCorrecao();
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/simulado/corrigir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ simulado_id: estado.simuladoId, respostas, tempo_total: estado.tempoDecorrido })
    });

    if (!response.ok) throw new Error(`Falha na correcao (${response.status})`);

    const resultado = await response.json();
    localStorage.setItem('resultado_simulado', JSON.stringify(resultado));
    sessionStorage.setItem('resultado_backup', JSON.stringify(resultado));
    window.location.href = 'resultado.html';
  } catch (error) {
    alert('Nao foi possivel finalizar o simulado. Tente novamente.');
    console.error(error);
  }
}

async function carregarSimulado() {
  const params = new URLSearchParams(window.location.search);
  estado.materia = params.get('materia') || localStorage.getItem('materiaCodigo') || 'todas';
  estado.modulo = params.get('modulo') || localStorage.getItem('moduloSelecionado') || 'todos';
  estado.quantidade = Number(params.get('quantidade') || localStorage.getItem('quantidadeSelecionada') || 20);

  const query = new URLSearchParams({
    materia: estado.materia,
    modulo: estado.modulo,
    quantidade: String([20, 50, 100].includes(estado.quantidade) ? estado.quantidade : 20)
  });

  const response = await fetch(`${CONFIG.API_BASE_URL}/api/simulado/iniciar?${query.toString()}`);
  if (!response.ok) throw new Error(`Erro ao iniciar simulado (${response.status})`);

  const data = await response.json();
  estado.simuladoId = data.simulado_id;
  estado.perguntas = data.perguntas || [];

  if (estado.perguntas.length === 0) throw new Error('Sem perguntas para o filtro escolhido');
}

function marcarParaRevisao() {
  const idx = estado.questaoAtual;
  if (estado.marcadas.has(idx)) estado.marcadas.delete(idx);
  else estado.marcadas.add(idx);

  if (el.modalMarcadas) el.modalMarcadas.textContent = estado.marcadas.size;
  atualizarIndicadoresProgresso();
}

function limparResposta() {
  const questao = estado.perguntas[estado.questaoAtual];
  if (!questao) return;
  delete estado.respostas[questao.id];
  carregarQuestao(estado.questaoAtual);
}

function questaoAnterior() {
  carregarQuestao(estado.questaoAtual - 1);
}

function proximaQuestao() {
  carregarQuestao(estado.questaoAtual + 1);
}

function abrirModalFinalizar() {
  if (!el.modalFinalizar) return;
  if (el.modalRespondidas) el.modalRespondidas.textContent = Object.keys(estado.respostas).length;
  if (el.modalTempo) el.modalTempo.textContent = formatarTempo(estado.tempoDecorrido);
  if (el.modalMarcadas) el.modalMarcadas.textContent = estado.marcadas.size;
  el.modalFinalizar.style.display = 'flex';
}

function fecharModal() {
  if (el.modalFinalizar) el.modalFinalizar.style.display = 'none';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const btn = document.getElementById('btn-dark-mode');
  if (!btn) return;
  const isDark = document.body.classList.contains('dark-mode');
  btn.classList.toggle('active', isDark);
  btn.innerHTML = isDark
    ? '<i class="fas fa-sun"></i><span>Tema Claro</span>'
    : '<i class="fas fa-moon"></i><span>Tema Escuro</span>';
}

function toggleAutoAvancar() {
  const atual = localStorage.getItem(CONFIG.AUTO_KEY) === 'true';
  localStorage.setItem(CONFIG.AUTO_KEY, String(!atual));
  atualizarAutoAvancarUI();
}

function configurarEventos() {
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowLeft') questaoAnterior();
    if (e.key === 'ArrowRight') proximaQuestao();
    if (['1', '2', '3', '4'].includes(e.key)) {
      const letter = ['A', 'B', 'C', 'D'][Number(e.key) - 1];
      selecionarResposta(letter);
    }
    if (e.key.toLowerCase() === 'm') marcarParaRevisao();
  });
}

async function iniciar() {
  try {
    await carregarSimulado();
    atualizarAutoAvancarUI();
    atualizarTimer();
    iniciarTimer();
    renderizarBotoesProgresso();
    carregarQuestao(0);
    configurarEventos();
  } catch (error) {
    console.error(error);
    alert('Nao foi possivel carregar o simulado. Verifique o backend e tente novamente.');
  }
}

window.toggleDarkMode = toggleDarkMode;
window.toggleAutoAvancar = toggleAutoAvancar;
window.marcarParaRevisao = marcarParaRevisao;
window.limparResposta = limparResposta;
window.questaoAnterior = questaoAnterior;
window.proximaQuestao = proximaQuestao;
window.abrirModalFinalizar = abrirModalFinalizar;
window.fecharModal = fecharModal;
window.finalizarSimulado = finalizarSimulado;

document.addEventListener('DOMContentLoaded', iniciar);
