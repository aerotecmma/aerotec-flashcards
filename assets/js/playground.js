console.log('🎮 Playground UX carregado');

// =============================
// ESTADO DO PLAYGROUND
// =============================
const TOTAL_QUESTOES = 20;

let questaoAtual = 0;

const estadoQuestoes = Array.from({ length: TOTAL_QUESTOES }, () => ({
  resposta: null,
  revisao: false
}));

// =============================
// ELEMENTOS DOM
// =============================
const alternativas = document.querySelectorAll('.alternativa');
const numeroQuestaoEl = document.getElementById('numeroQuestao');

const btnAnterior = document.getElementById('btnAnterior');
const btnProxima = document.getElementById('btnProxima');
const btnLimpar = document.getElementById('btnLimpar');
const btnRevisao = document.getElementById('btnRevisao');

const timerEl = document.getElementById('timer');

// =============================
// FUNÇÕES DE UI
// =============================
function atualizarQuestao() {
  numeroQuestaoEl.textContent = `Questão ${questaoAtual + 1}`;

  // Limpa estados visuais
  alternativas.forEach(alt => {
    alt.classList.remove('selecionada');
  });

  // Aplica resposta salva
  const resposta = estadoQuestoes[questaoAtual].resposta;
  if (resposta) {
    document
      .querySelector(`.alternativa[data-letra="${resposta}"]`)
      ?.classList.add('selecionada');
  }

  // Estado de revisão
  btnRevisao.classList.toggle(
    'ativo',
    estadoQuestoes[questaoAtual].revisao
  );

  atualizarBotoes();
}

function atualizarBotoes() {
  btnAnterior.disabled = questaoAtual === 0;
  btnProxima.disabled = questaoAtual === TOTAL_QUESTOES - 1;
}

// =============================
// EVENTOS
// =============================
alternativas.forEach(alt => {
  alt.addEventListener('click', () => {
    const letra = alt.dataset.letra;

    // Salva resposta
    estadoQuestoes[questaoAtual].resposta = letra;

    // Atualiza UI
    alternativas.forEach(a => a.classList.remove('selecionada'));
    alt.classList.add('selecionada');
  });
});

btnLimpar.addEventListener('click', () => {
  estadoQuestoes[questaoAtual].resposta = null;
  alternativas.forEach(a => a.classList.remove('selecionada'));
});

btnRevisao.addEventListener('click', () => {
  const estado = estadoQuestoes[questaoAtual];
  estado.revisao = !estado.revisao;
  btnRevisao.classList.toggle('ativo', estado.revisao);
});

btnAnterior.addEventListener('click', () => {
  if (questaoAtual > 0) {
    questaoAtual--;
    atualizarQuestao();
  }
});

btnProxima.addEventListener('click', () => {
  if (questaoAtual < TOTAL_QUESTOES - 1) {
    questaoAtual++;
    atualizarQuestao();
  }
});

// =============================
// TIMER (UX)
// =============================
let tempo = 60 * 60; // 60 minutos

function iniciarTimer() {
  setInterval(() => {
    tempo--;

    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    timerEl.textContent = `${minutos}:${segundos
      .toString()
      .padStart(2, '0')}`;

    if (tempo <= 0) {
      timerEl.textContent = 'Tempo esgotado';
    }
  }, 1000);
}

// =============================
// INIT
// =============================
atualizarQuestao();
iniciarTimer();
