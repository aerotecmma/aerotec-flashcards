const estado = {
  resultado: null,
  mostrarApenasErros: false,
  filtroMateria: 'todas',
  filtroStatus: 'todas'
};

const elementos = {
  loading: document.getElementById('loading'),
  infoMateria: document.getElementById('info-materia'),
  infoData: document.getElementById('info-data'),
  infoHora: document.getElementById('info-hora'),
  infoTempo: document.getElementById('info-tempo'),
  resultStatus: document.getElementById('result-status'),
  scoreNumber: document.getElementById('score-number'),
  scoreCircleBg: document.getElementById('score-circle-bg'),
  labelCorrect: document.getElementById('label-correct'),
  labelWrong: document.getElementById('label-wrong'),
  labelEmpty: document.getElementById('label-empty'),
  percentCorrect: document.getElementById('percent-correct'),
  percentWrong: document.getElementById('percent-wrong'),
  percentEmpty: document.getElementById('percent-empty'),
  barCorrect: document.getElementById('bar-correct'),
  barWrong: document.getElementById('bar-wrong'),
  barEmpty: document.getElementById('bar-empty'),
  feedbackText: document.getElementById('feedback-text'),
  feedbackSubtext: document.getElementById('feedback-subtext'),
  questionsContainer: document.getElementById('questions-container'),
  questionsCount: document.getElementById('questions-count'),
  filterMateria: document.getElementById('filter-materia'),
  filterStatus: document.getElementById('filter-status')
};

function escapeHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto == null ? '' : String(texto);
  return div.innerHTML;
}

function formatarTempo(segundos) {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return h > 0
    ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function carregarResultado() {
  const raw = localStorage.getItem('resultado_simulado') || sessionStorage.getItem('resultado_backup');
  if (!raw) throw new Error('Nenhum resultado encontrado.');

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed.correcoes) || !parsed.estatisticas) {
    throw new Error('Formato de resultado invalido.');
  }

  estado.resultado = parsed;
}

function atualizarCabecalho() {
  const { correcoes, estatisticas } = estado.resultado;
  const materias = [...new Set(correcoes.map((c) => c.materia).filter(Boolean))];
  const agora = new Date();

  elementos.infoMateria.textContent = materias.length > 1 ? `${materias.length} materias` : (materias[0] || 'Geral');
  elementos.infoData.textContent = agora.toLocaleDateString('pt-BR');
  elementos.infoHora.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  elementos.infoTempo.textContent = formatarTempo(Number(estatisticas.tempo_total || 0));
}

function atualizarResumo() {
  const { correcoes, estatisticas } = estado.resultado;
  const total = Number(estatisticas.total || correcoes.length || 0);
  const acertos = Number(estatisticas.acertos || 0);
  const erros = correcoes.filter((c) => !c.acertou).length;
  const emBranco = Math.max(0, total - correcoes.length);
  const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;
  const aprovado = percentual >= 70;

  elementos.resultStatus.textContent = aprovado ? 'APROVADO' : 'REPROVADO';
  elementos.resultStatus.className = `result-status-badge ${aprovado ? 'status-aprovado' : 'status-reprovado'}`;

  elementos.scoreNumber.textContent = `${percentual}%`;
  elementos.scoreCircleBg.style.setProperty('--percent', `${percentual}%`);

  elementos.labelCorrect.textContent = acertos;
  elementos.labelWrong.textContent = erros;
  elementos.labelEmpty.textContent = emBranco;

  const pA = total > 0 ? Math.round((acertos / total) * 100) : 0;
  const pE = total > 0 ? Math.round((erros / total) * 100) : 0;
  const pB = total > 0 ? Math.round((emBranco / total) * 100) : 0;

  elementos.percentCorrect.textContent = `${pA}%`;
  elementos.percentWrong.textContent = `${pE}%`;
  elementos.percentEmpty.textContent = `${pB}%`;

  elementos.barCorrect.style.width = `${pA}%`;
  elementos.barWrong.style.width = `${pE}%`;
  elementos.barEmpty.style.width = `${pB}%`;

  elementos.feedbackText.textContent = aprovado ? 'Bom desempenho no simulado.' : 'Abaixo da meta de 70%.';
  elementos.feedbackSubtext.textContent = aprovado
    ? 'Revise os erros para consolidar o aprendizado.'
    : 'Foque nos topicos com mais erros e refaca o simulado.';
}

function filtrarCorrecoes() {
  let itens = [...estado.resultado.correcoes];

  if (estado.mostrarApenasErros) itens = itens.filter((c) => !c.acertou);
  if (estado.filtroMateria !== 'todas') itens = itens.filter((c) => c.materia === estado.filtroMateria);
  if (estado.filtroStatus !== 'todas') {
    const querCorretas = estado.filtroStatus === 'corretas';
    itens = itens.filter((c) => c.acertou === querCorretas);
  }

  return itens.sort((a, b) => a.numero - b.numero);
}

function renderizarQuestoes() {
  const correcoes = filtrarCorrecoes();
  elementos.questionsContainer.innerHTML = '';
  elementos.questionsCount.textContent = `${correcoes.length} questoes`;

  if (correcoes.length === 0) {
    elementos.questionsContainer.innerHTML = '<div class="empty-state"><p>Nenhuma questao para o filtro selecionado.</p></div>';
    return;
  }

  correcoes.forEach((c) => {
    const item = document.createElement('div');
    item.className = `question-item ${c.acertou ? 'correct' : 'wrong'} fade-in`;

    const expId = `expl-${c.numero}`;
    item.innerHTML = `
      <div class="question-header">
        <div class="question-number">Questao ${c.numero}</div>
        <div class="question-status ${c.acertou ? 'status-correct' : 'status-wrong'}">${c.acertou ? 'CORRETA' : 'ERRADA'}</div>
      </div>
      <div class="question-text">${escapeHTML(c.pergunta)}</div>
      <div class="answers-container">
        <div class="answer ${c.acertou ? 'correct-answer' : 'wrong-answer'}">
          <div class="answer-letter">${escapeHTML(c.opcao_marcada || '-')}</div>
          <div class="answer-text"><strong>Sua resposta:</strong> ${escapeHTML(c.resposta_usuario)}</div>
        </div>
        <div class="answer correct-answer">
          <div class="answer-letter">${escapeHTML(c.opcao_correta || '-')}</div>
          <div class="answer-text"><strong>Resposta correta:</strong> ${escapeHTML(c.resposta_correta)}</div>
        </div>
      </div>
      <div class="metadata">
        <div class="meta-item"><i class="fas fa-layer-group"></i><span>${escapeHTML(c.modulo || 'N/A')}</span></div>
        <div class="meta-item"><i class="fas fa-book"></i><span>${escapeHTML(c.materia || 'N/A')}</span></div>
        <div class="meta-item"><i class="fas fa-tag"></i><span>${escapeHTML(c.topico || 'N/A')}</span></div>
      </div>
      <button class="btn-toggle" onclick="toggleExplicacao('${expId}')"><i class="fas fa-lightbulb"></i> Ver explicacao</button>
      <div class="explanation" id="${expId}">
        <div class="explanation-title"><i class="fas fa-info-circle"></i> Explicacao</div>
        <div class="explanation-text">${escapeHTML(c.explicacao || 'Sem explicacao cadastrada.').replace(/\n/g, '<br>')}</div>
      </div>
    `;

    elementos.questionsContainer.appendChild(item);
  });
}

function configurarFiltros() {
  const materias = [...new Set(estado.resultado.correcoes.map((c) => c.materia).filter(Boolean))];
  elementos.filterMateria.innerHTML = '<option value="todas">Todas as materias</option>';
  materias.forEach((m) => {
    const option = document.createElement('option');
    option.value = m;
    option.textContent = m;
    elementos.filterMateria.appendChild(option);
  });

  elementos.filterMateria.addEventListener('change', (e) => {
    estado.filtroMateria = e.target.value;
    renderizarQuestoes();
  });

  elementos.filterStatus.addEventListener('change', (e) => {
    estado.filtroStatus = e.target.value;
    renderizarQuestoes();
  });
}

function toggleExplicacao(id) {
  const node = document.getElementById(id);
  if (node) node.classList.toggle('show');
}

function alternarApenasErros() {
  estado.mostrarApenasErros = !estado.mostrarApenasErros;
  const btn = document.getElementById('btn-apenas-erros');
  if (btn) {
    btn.innerHTML = estado.mostrarApenasErros
      ? '<i class="fas fa-list"></i> Ver Todas'
      : '<i class="fas fa-filter"></i> Ver Apenas Erros';
  }
  renderizarQuestoes();
}

function voltarParaSimulado() {
  window.location.href = 'simulado.html';
}

function compartilharResultado() {
  const { estatisticas } = estado.resultado;
  const texto = `Resultado Aerotec: ${estatisticas.acertos}/${estatisticas.total} (${estatisticas.percentual}%)`;
  if (navigator.share) {
    navigator.share({ title: 'Resultado Aerotec', text: texto, url: window.location.href });
  } else {
    navigator.clipboard.writeText(texto);
    alert('Resumo copiado para a area de transferencia.');
  }
}

function gerarRelatorio() {
  window.print();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

function inicializarTema() {
  const temaSalvo = localStorage.getItem('tema') || 'light';
  if (temaSalvo === 'dark') {
    document.documentElement.classList.add('dark-mode');
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('tema', isDark ? 'dark' : 'light');
  });
}

function iniciarPaginaResultado() {
  try {
    carregarResultado();
    atualizarCabecalho();
    atualizarResumo();
    configurarFiltros();
    renderizarQuestoes();
    inicializarTema();
    if (elementos.loading) elementos.loading.style.display = 'none';
  } catch (error) {
    if (elementos.loading) {
      elementos.loading.innerHTML = `<div style="padding:20px;color:#dc2626;">${escapeHTML(error.message)}</div>`;
    }
  }
}

window.toggleExplicacao = toggleExplicacao;
window.alternarApenasErros = alternarApenasErros;
window.voltarParaSimulado = voltarParaSimulado;
window.gerarRelatorio = gerarRelatorio;
window.compartilharResultado = compartilharResultado;
window.toggleFullscreen = toggleFullscreen;

document.addEventListener('DOMContentLoaded', iniciarPaginaResultado);
