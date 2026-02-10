// server.js - API do ANAC Flashcards
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ========== CONFIGURAÇÕES ==========
app.use(cors());
app.use(express.json());

// CORREÇÃO CRÍTICA: frontend está na MESMA pasta que server.js
app.use(express.static('frontend'));
app.use('/assets', express.static('frontend/assets'));

// Banco de dados inicial (simulado)
const perguntas = [
  {
    id: 1,
    pergunta: "É uma propriedade que se opõe a qualquer variação na tensão em um circuito:",
    opcao_correta: "capacitância",
    opcao_errada: "capacitância indutiva",
    explicacao: "A capacitância é uma propriedade elétrica que se opõe a qualquer variação na tensão. Ela é medida em Farads (F) e está presente principalmente em capacitores, que armazenam carga elétrica e atuam como \"reservatórios\" para manter a tensão constante.",
    materia: "eletrica",
  },
];

// ========== ROTAS PRINCIPAIS ==========

// ROTA RAIZ - SERVE A PÁGINA HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
  
});
// ROTA PLAYGROUND - TESTE DE UX (sem API)
app.get('/playground', (req, res) => {
  console.log('🎮 MODO PLAYGROUND (UX) ATIVO');
  res.sendFile(path.join(__dirname, 'frontend/simulado-playground.html'));
});

// ROTA API INFO
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API ANAC Flashcards funcionando!',
    version: '1.0.0',
    endpoints: {
      aleatoria: 'GET /api/perguntas/aleatoria',
      responder: 'POST /api/respostas',
      materias: 'GET /api/materias',
      estatisticas: 'GET /api/estatisticas',
      simulado: 'GET /api/simulado/iniciar',
      simulado_materia: 'GET /api/simulado/iniciar/:materia'
    }
  });
});

// ========== ROTAS DA API ==========

// Pega uma pergunta aleatória
app.get('/api/perguntas/aleatoria', (req, res) => {
  try {
    if (perguntas.length === 0) {
      return res.status(404).json({ error: 'Nenhuma pergunta disponível' });
    }

    const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];
    
    // Embaralha as opções (50% chance de inverter)
    const inverter = Math.random() > 0.5;
    
    const resposta = {
      id: pergunta.id,
      pergunta: pergunta.pergunta,
      opcoes: {
        esquerda: inverter ? pergunta.opcao_errada : pergunta.opcao_correta,
        direita: inverter ? pergunta.opcao_correta : pergunta.opcao_errada
      },
      resposta_correta: pergunta.opcao_correta,
      materia: pergunta.materia,
      topico: pergunta.topico,
      nivel: pergunta.nivel,
      referencia: pergunta.referencia
    };

    res.json(resposta);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pergunta' });
  }
});

// Envia uma resposta
app.post('/api/respostas', (req, res) => {
  try {
    const { pergunta_id, resposta_usuario, tempo_segundos } = req.body;
    
    // Validação
    if (!pergunta_id || !resposta_usuario) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const pergunta = perguntas.find(p => p.id === pergunta_id);
    
    if (!pergunta) {
      return res.status(404).json({ error: 'Pergunta não encontrada' });
    }

    const acertou = resposta_usuario === pergunta.opcao_correta;
    const tempo = tempo_segundos || 0;

    // Resposta
    const resposta = {
      acertou,
      resposta_correta: pergunta.opcao_correta,
      explicacao: pergunta.explicacao,
      feedback: acertou 
        ? "✅ Excelente! Você acertou!" 
        : "❌ Essa era uma casca de banana!",
      dica: `Dica: ${pergunta.referencia}`,
      estatisticas: {
        tempo_resposta: tempo,
        nivel: pergunta.nivel
      }
    };

    res.json(resposta);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar resposta' });
  }
});

// Lista todas as matérias disponíveis
app.get('/api/materias', (req, res) => {
  const materias = [...new Set(perguntas.map(p => p.materia))];
  res.json(materias);
});

// Estatísticas gerais
app.get('/api/estatisticas', (req, res) => {
  res.json({
    total_perguntas: perguntas.length,
    materias: [...new Set(perguntas.map(p => p.materia))],
    niveis: {
      facil: perguntas.filter(p => p.nivel === 'facil').length,
      medio: perguntas.filter(p => p.nivel === 'medio').length,
      dificil: perguntas.filter(p => p.nivel === 'dificil').length
    }
  });
});

// ========== ROTAS PARA SIMULADO ==========

// 1. Simulado geral (todas matérias) - com query parameter
app.get('/api/simulado/iniciar', (req, res) => {
  const materia = req.query.materia || 'todas';
  iniciarSimuladoHandler(materia, res);
});

// 2. Simulado específico por matéria - com route parameter
app.get('/api/simulado/iniciar/:materia', (req, res) => {
  const materia = req.params.materia;
  iniciarSimuladoHandler(materia, res);
});

// Função comum para iniciar simulado
function iniciarSimuladoHandler(materia, res) {
  // Filtrar perguntas por matéria se especificada
  let perguntasFiltradas = perguntas;
  if (materia && materia !== 'todas') {
    perguntasFiltradas = perguntas.filter(p => 
      p.materia.toLowerCase().includes(materia.toLowerCase())
    );
  }
  
  // Embaralha perguntas
  const shuffled = [...perguntasFiltradas].sort(() => 0.5 - Math.random());

  const simulado = shuffled.slice(0, 20).map((p, index) => {
    const corretaEmA = Math.random() > 0.5;

    return {
      numero: index + 1,
      id: p.id,
      pergunta: p.pergunta,
      opcoes: {
        A: corretaEmA ? p.opcao_correta : p.opcao_errada,
        B: corretaEmA ? p.opcao_errada : p.opcao_correta
      },
      // ✅ CRÍTICO: Retorna a letra correta (não o texto)
      letra_correta: corretaEmA ? "A" : "B",
      // ✅ Mantém o texto também para exibição
      texto_correta: p.opcao_correta,
      texto_errada: p.opcao_errada,
      materia: p.materia,
      topico: p.topico,
      nivel: p.nivel
    };
  });
  
  res.json({
    simulado_id: Date.now(),
    materia: materia,
    perguntas: simulado,
    total: simulado.length,
    total_disponivel: perguntasFiltradas.length
  });
}

// Corrige simulado completo - VERSÃO MODIFICADA
app.post('/api/simulado/corrigir', (req, res) => {
  const { simulado_id, respostas, tempo_total } = req.body;
  
  const correcoes = respostas.map(resp => {
    const pergunta = perguntas.find(p => p.id === resp.pergunta_id);
    
    if (!pergunta) {
      return {
        numero: resp.numero,
        pergunta_id: resp.pergunta_id,
        erro: "Pergunta não encontrada"
      };
    }
    
    // ✅ CRÍTICO: Se o frontend enviar a letra, convertemos para texto para comparação
    let respostaUsuarioTexto = resp.resposta;
    
    // Se a resposta for uma letra ('A' ou 'B'), precisamos do texto correspondente
    // Mas como não temos o mapeamento A/B original aqui, temos um problema...
    // SOLUÇÃO: O frontend deve enviar o TEXTO da opção selecionada
    
    // Para compatibilidade com versões antigas:
    let acertou = false;
    
    if (resp.resposta_texto) {
      // Se o frontend enviou o texto
      acertou = resp.resposta_texto === pergunta.opcao_correta;
    } else if (resp.correta !== undefined) {
      // Se o frontend já calculou a correção
      acertou = resp.correta;
    } else {
      // Modo antigo (compara texto diretamente)
      acertou = resp.resposta === pergunta.opcao_correta;
    }
    
    return {
      numero: resp.numero,
      pergunta_id: resp.pergunta_id,
      pergunta: pergunta.pergunta,
      resposta_usuario: resp.resposta_texto || resp.resposta,
      resposta_correta: pergunta.opcao_correta,
      acertou: acertou,
      explicacao: pergunta.explicacao,
      materia: pergunta.materia,
      topico: pergunta.topico,
      nivel: pergunta.nivel
    };
  });
  
  const acertos = correcoes.filter(c => c.acertou).length;
  const total = correcoes.length || 20;
  
  res.json({
    simulado_id,
    correcoes,
    estatisticas: {
      acertos,
      total: 20,
      percentual: Math.round((acertos / 20) * 100),
      tempo_total: tempo_total || 0,
      aprovado: acertos >= 14  // 70% para aprovação
    }
  });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 SERVIDOR ANAC FLASHCARDS INICIADO!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📊 Status: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 Perguntas carregadas: ${perguntas.length}`);
  console.log(`📁 Frontend: ${path.join(__dirname, 'frontend')}`);
  console.log('='.repeat(50));
  console.log('\n📋 Endpoints disponíveis:');
  console.log(`👉 GET  http://localhost:${PORT}/          (Página inicial)`);
  console.log(`👉 GET  http://localhost:${PORT}/api       (Info da API)`);
  console.log(`👉 GET  http://localhost:${PORT}/api/materias`);
  console.log(`👉 GET  http://localhost:${PORT}/api/simulado/iniciar?materia=regulamentos`);
  console.log(`👉 GET  http://localhost:${PORT}/api/simulado/iniciar/regulamentos`);
  console.log(`👉 POST http://localhost:${PORT}/api/simulado/corrigir`);
  console.log('='.repeat(50));
  console.log(`🎮 Playground UX: http://localhost:${PORT}/playground`);
});