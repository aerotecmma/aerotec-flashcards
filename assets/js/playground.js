console.log('Playground UX carregado');

const TOTAL_QUESTOES = 20;
const LETRAS = ['A', 'B', 'C', 'D'];

let questaoAtual = 0;
const estadoQuestoes = Array.from({ length: TOTAL_QUESTOES }, () => ({ resposta: null, revisao: false }));

const alternativas = document.querySelectorAll('.alternativa');
const numeroQuestaoEl = document.getElementById('numeroQuestao');
const btnAnterior = document.getElementById('btnAnterior');
const btnProxima = document.getElementById('btnProxima');
const btnLimpar = document.getElementById('btnLimpar');
const btnRevisao = document.getElementById('btnRevisao');
const timerEl = document.getElementById('timer');

function atualizarQuestao() {
  if (!numeroQuestaoEl) return;
  numeroQuestaoEl.textContent = `Questao ${questaoAtual + 1}`;
  alternativas.forEach((alt) => alt.classList.remove('selecionada'));

  const resposta = estadoQuestoes[questaoAtual].resposta;
  if (resposta) document.querySelector(`.alternativa[data-letra="${resposta}"]`)?.classList.add('selecionada');

  if (btnRevisao) btnRevisao.classList.toggle('ativo', estadoQuestoes[questaoAtual].revisao);
  if (btnAnterior) btnAnterior.disabled = questaoAtual === 0;
  if (btnProxima) btnProxima.disabled = questaoAtual === TOTAL_QUESTOES - 1;
}

alternativas.forEach((alt) => {
  alt.addEventListener('click', () => {
    const letra = alt.dataset.letra;
    if (!LETRAS.includes(letra)) return;
    estadoQuestoes[questaoAtual].resposta = letra;
    alternativas.forEach((a) => a.classList.remove('selecionada'));
    alt.classList.add('selecionada');
  });
});

btnLimpar?.addEventListener('click', () => {
  estadoQuestoes[questaoAtual].resposta = null;
  alternativas.forEach((a) => a.classList.remove('selecionada'));
});

btnRevisao?.addEventListener('click', () => {
  const registro = estadoQuestoes[questaoAtual];
  registro.revisao = !registro.revisao;
  btnRevisao.classList.toggle('ativo', registro.revisao);
});

btnAnterior?.addEventListener('click', () => {
  if (questaoAtual > 0) {
    questaoAtual -= 1;
    atualizarQuestao();
  }
});

btnProxima?.addEventListener('click', () => {
  if (questaoAtual < TOTAL_QUESTOES - 1) {
    questaoAtual += 1;
    atualizarQuestao();
  }
});

let tempo = 60 * 60;
setInterval(() => {
  tempo -= 1;
  const minutos = Math.floor(tempo / 60);
  const segundos = tempo % 60;
  if (timerEl) timerEl.textContent = `${minutos}:${String(segundos).padStart(2, '0')}`;
}, 1000);

atualizarQuestao();
