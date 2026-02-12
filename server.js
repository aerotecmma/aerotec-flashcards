const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const perguntas = [
  {
    id: 'gmp1-001',
    enunciado: 'Em um circuito em serie, o aumento da resistencia total provoca:',
    opcoes: [
      { id: 'A', texto: 'A diminuicao da corrente no circuito' },
      { id: 'B', texto: 'O aumento da corrente no circuito' },
      { id: 'C', texto: 'A queda da resistencia total' },
      { id: 'D', texto: 'A mudanca da frequencia da fonte' }
    ],
    correta: 'A',
    explicacao: 'Pela lei de Ohm, com tensao constante, aumento de resistencia reduz corrente.',
    modulo: 'GMP1',
    materia: 'eletrica',
    topico: 'circuitos',
    nivel: 'medio',
    referencia: 'ANAC - Fundamentos de Eletricidade'
  },
  {
    id: 'gmp1-002',
    enunciado: 'Qual grandeza eletrica e medida em ampere (A)?',
    opcoes: [
      { id: 'A', texto: 'Tensao' },
      { id: 'B', texto: 'Resistencia' },
      { id: 'C', texto: 'Corrente eletrica' },
      { id: 'D', texto: 'Capacitancia' }
    ],
    correta: 'C',
    explicacao: 'Ampere e unidade de corrente eletrica no SI.',
    modulo: 'GMP1',
    materia: 'eletrica',
    topico: 'grandezas eletricas',
    nivel: 'facil',
    referencia: 'SI - Unidades Eletricas'
  },
  {
    id: 'gmp1-003',
    enunciado: 'A funcao principal de um fusivel em um circuito e:',
    opcoes: [
      { id: 'A', texto: 'Aumentar a tensao de saida' },
      { id: 'B', texto: 'Proteger contra sobrecorrente' },
      { id: 'C', texto: 'Armazenar energia eletrica' },
      { id: 'D', texto: 'Filtrar ruidos de alta frequencia' }
    ],
    correta: 'B',
    explicacao: 'O fusivel abre o circuito quando a corrente excede o limite nominal.',
    modulo: 'GMP1',
    materia: 'eletrica',
    topico: 'protecao eletrica',
    nivel: 'medio',
    referencia: 'ANAC - Seguranca de Sistemas'
  },
  {
    id: 'gmp1-004',
    enunciado: 'Capacitancia e a propriedade que se opoe a variacoes de:',
    opcoes: [
      { id: 'A', texto: 'Corrente em regime permanente' },
      { id: 'B', texto: 'Fluxo magnetico' },
      { id: 'C', texto: 'Tensao' },
      { id: 'D', texto: 'Potencia ativa' }
    ],
    correta: 'C',
    explicacao: 'Capacitores se opoem a variacoes de tensao e armazenam carga eletrica.',
    modulo: 'GMP1',
    materia: 'eletrica',
    topico: 'capacitancia',
    nivel: 'medio',
    referencia: 'Fundamentos de Circuitos'
  }
];

const sessoesSimulado = new Map();
const SESSION_TTL_MS = 6 * 60 * 60 * 1000;

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeOptionId(value) {
  const option = String(value || '').trim().toUpperCase();
  return ['A', 'B', 'C', 'D'].includes(option) ? option : null;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessoesSimulado.entries()) {
    if (session.expiresAt < now) {
      sessoesSimulado.delete(id);
    }
  }
}

function filtrarPerguntas({ materia, modulo }) {
  return perguntas.filter((p) => {
    const matchMateria = !materia || normalize(materia) === 'todas' || normalize(p.materia) === normalize(materia);
    const matchModulo = !modulo || normalize(modulo) === 'todos' || normalize(p.modulo) === normalize(modulo);
    return matchMateria && matchModulo;
  });
}

function formatarPerguntaCliente(pergunta) {
  return {
    id: pergunta.id,
    pergunta: pergunta.enunciado,
    opcoes: shuffle(pergunta.opcoes).map((o) => ({ id: o.id, texto: o.texto })),
    modulo: pergunta.modulo,
    materia: pergunta.materia,
    topico: pergunta.topico,
    nivel: pergunta.nivel,
    referencia: pergunta.referencia
  };
}

function obterQuantidadeSolicitada(raw) {
  const n = Number(raw);
  if ([20, 50, 100].includes(n)) {
    return n;
  }
  return 20;
}

function textoOpcao(pergunta, optionId) {
  return pergunta.opcoes.find((o) => o.id === optionId)?.texto || null;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/playground', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/simulado-playground.html'));
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API Aerotec Flashcards online',
    version: '2.0.0',
    endpoints: {
      perguntas_aleatoria: 'GET /api/perguntas/aleatoria?materia=&modulo=',
      responder: 'POST /api/respostas',
      materias: 'GET /api/materias',
      modulos: 'GET /api/modulos',
      estatisticas: 'GET /api/estatisticas',
      simulado_iniciar: 'GET /api/simulado/iniciar?materia=&modulo=&quantidade=20|50|100',
      simulado_corrigir: 'POST /api/simulado/corrigir'
    }
  });
});

app.get('/api/materias', (req, res) => {
  res.json([...new Set(perguntas.map((p) => p.materia))]);
});

app.get('/api/modulos', (req, res) => {
  res.json([...new Set(perguntas.map((p) => p.modulo))]);
});

app.get('/api/estatisticas', (req, res) => {
  res.json({
    total_perguntas: perguntas.length,
    materias: [...new Set(perguntas.map((p) => p.materia))],
    modulos: [...new Set(perguntas.map((p) => p.modulo))],
    niveis: {
      facil: perguntas.filter((p) => p.nivel === 'facil').length,
      medio: perguntas.filter((p) => p.nivel === 'medio').length,
      dificil: perguntas.filter((p) => p.nivel === 'dificil').length
    }
  });
});

app.get('/api/perguntas/aleatoria', (req, res) => {
  try {
    const filtradas = filtrarPerguntas({
      materia: req.query.materia,
      modulo: req.query.modulo
    });

    if (filtradas.length === 0) {
      return res.status(404).json({ error: 'Nenhuma pergunta disponivel para o filtro informado' });
    }

    const pergunta = filtradas[Math.floor(Math.random() * filtradas.length)];
    return res.json(formatarPerguntaCliente(pergunta));
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar pergunta aleatoria' });
  }
});

app.post('/api/respostas', (req, res) => {
  try {
    const { pergunta_id, opcao_id, tempo_segundos } = req.body;

    if (!pergunta_id || !opcao_id) {
      return res.status(400).json({ error: 'Campos obrigatorios: pergunta_id e opcao_id' });
    }

    const pergunta = perguntas.find((p) => p.id === pergunta_id || String(p.id) === String(pergunta_id));
    if (!pergunta) {
      return res.status(404).json({ error: 'Pergunta nao encontrada' });
    }

    const marcada = normalizeOptionId(opcao_id);
    if (!marcada) {
      return res.status(400).json({ error: 'opcao_id invalida. Use A, B, C ou D.' });
    }

    const acertou = marcada === pergunta.correta;

    return res.json({
      acertou,
      opcao_marcada: marcada,
      opcao_correta: pergunta.correta,
      resposta_correta: textoOpcao(pergunta, pergunta.correta),
      explicacao: pergunta.explicacao,
      modulo: pergunta.modulo,
      materia: pergunta.materia,
      topico: pergunta.topico,
      nivel: pergunta.nivel,
      estatisticas: {
        tempo_resposta: Number(tempo_segundos || 0)
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar resposta' });
  }
});

app.get('/api/simulado/iniciar', (req, res) => {
  try {
    cleanupExpiredSessions();

    const materia = req.query.materia || 'todas';
    const modulo = req.query.modulo || 'todos';
    const quantidadeSolicitada = obterQuantidadeSolicitada(req.query.quantidade);

    const perguntasFiltradas = filtrarPerguntas({ materia, modulo });
    if (perguntasFiltradas.length === 0) {
      return res.status(404).json({ error: 'Nenhuma pergunta disponivel para este filtro' });
    }

    const selecionadas = shuffle(perguntasFiltradas).slice(0, Math.min(quantidadeSolicitada, perguntasFiltradas.length));

    const simuladoId = crypto.randomUUID();
    const answerKey = Object.fromEntries(selecionadas.map((q) => [q.id, q.correta]));

    sessoesSimulado.set(simuladoId, {
      simuladoId,
      answerKey,
      questionIds: selecionadas.map((q) => q.id),
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS
    });

    const perguntasCliente = selecionadas.map((q, index) => ({
      numero: index + 1,
      ...formatarPerguntaCliente(q)
    }));

    return res.json({
      simulado_id: simuladoId,
      modulo,
      materia,
      quantidade_solicitada: quantidadeSolicitada,
      total: perguntasCliente.length,
      total_disponivel: perguntasFiltradas.length,
      perguntas: perguntasCliente
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao iniciar simulado' });
  }
});

app.post('/api/simulado/corrigir', (req, res) => {
  try {
    cleanupExpiredSessions();

    const { simulado_id: simuladoId, respostas, tempo_total: tempoTotal } = req.body;

    if (!simuladoId || !Array.isArray(respostas)) {
      return res.status(400).json({ error: 'Campos obrigatorios: simulado_id e respostas[]' });
    }

    const sessao = sessoesSimulado.get(simuladoId);
    if (!sessao) {
      return res.status(404).json({ error: 'Sessao de simulado nao encontrada ou expirada' });
    }

    const respostasMap = new Map(
      respostas
        .filter((r) => r && (r.pergunta_id || r.id))
        .map((r) => [String(r.pergunta_id || r.id), normalizeOptionId(r.opcao_id || r.resposta)])
    );

    const correcoes = sessao.questionIds.map((questionId, index) => {
      const pergunta = perguntas.find((p) => String(p.id) === String(questionId));
      if (!pergunta) {
        return {
          numero: index + 1,
          pergunta_id: questionId,
          erro: 'Pergunta nao encontrada no banco atual'
        };
      }

      const marcada = respostasMap.get(String(questionId)) || null;
      const correta = sessao.answerKey[questionId];
      const acertou = marcada === correta;

      return {
        numero: index + 1,
        pergunta_id: questionId,
        pergunta: pergunta.enunciado,
        opcao_marcada: marcada,
        opcao_correta: correta,
        resposta_usuario: marcada ? textoOpcao(pergunta, marcada) : 'Em branco',
        resposta_correta: textoOpcao(pergunta, correta),
        acertou,
        explicacao: pergunta.explicacao,
        modulo: pergunta.modulo,
        materia: pergunta.materia,
        topico: pergunta.topico,
        nivel: pergunta.nivel,
        referencia: pergunta.referencia
      };
    });

    const total = correcoes.length;
    const acertos = correcoes.filter((c) => c.acertou).length;
    const percentual = total > 0 ? Math.round((acertos / total) * 100) : 0;

    return res.json({
      simulado_id: simuladoId,
      correcoes,
      estatisticas: {
        acertos,
        total,
        percentual,
        tempo_total: Number(tempoTotal || 0),
        aprovado: percentual >= 70
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao corrigir simulado' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('SERVIDOR AEROTEC FLASHCARDS INICIADO');
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Status: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Perguntas carregadas: ${perguntas.length}`);
  console.log('Endpoints principais:');
  console.log(`GET  http://localhost:${PORT}/`);
  console.log(`GET  http://localhost:${PORT}/api`);
  console.log(`GET  http://localhost:${PORT}/api/simulado/iniciar?modulo=GMP1&materia=eletrica&quantidade=20`);
  console.log(`POST http://localhost:${PORT}/api/simulado/corrigir`);
  console.log('='.repeat(50));
});
