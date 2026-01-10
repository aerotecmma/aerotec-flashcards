document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 AeroTecMMA - Página inicial carregada');
    
    try {
        // 1. Carregar matérias da API
        const materias = await carregarMaterias();
        
        // 2. Renderizar cards das matérias
        renderizarMaterias(materias);
        
        // 3. Atualizar contador de questões
        atualizarEstatisticas();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro();
    }
});

// Função para carregar matérias da API
async function carregarMaterias() {
    try {
        console.log('📡 Buscando matérias da API...');
        
        // Temporário: usando dados fixos enquanto a API não está pronta
        const materiasFake = [
            { nome: 'Aerodinâmica', codigo: 'aerodinamica', questoes: 20, cor: '#667eea' },
            { nome: 'Combustíveis e Sistema de combustivel', codigo: 'combustiveis', questoes: 20, cor: '#764ba2' },
            { nome: 'Comunicação Oral e Escrita', codigo: 'comunicacao', questoes: 20, cor: '#1a2980' },
            { nome: 'Controle De Corrosão', codigo: 'corrosao', questoes: 20, cor: '#26d0ce' },
            { nome: 'Desenho Técnico', codigo: 'desenho', questoes: 20, cor: '#ff6b6b' },
            { nome: 'Eletricidade Básica', codigo: 'eletrica', questoes: 20, cor: '#f59e0b' },
            { nome: 'Inglês Básico e Técnico', codigo: 'ingles', questoes: 20, cor: '#10b981' },
            { nome: 'Hélices', codigo: 'helice', questoes: 20, cor: '#10b981' },
            { nome: 'GMP 1', codigo: 'motores1', questoes: 20, cor: '#10b981' },
            { nome: 'GMP 2', codigo: 'motores2', questoes: 20, cor: '#10b981' },
            { nome: 'BÁSICO PREMIUM', codigo: 'basico', questoes: 20, cor: '#667eea' },
            { nome: 'Apenas Cálculos Elétricos', codigo: 'calculo', questoes: 20, cor: '#1a2980' },
            { nome: 'Geradores e Motores Elétricos', codigo: 'gerador', questoes: 20, cor: '#1a2980' },

        ];  
        
        console.log('✅ Matérias carregadas:', materiasFake);
        return materiasFake;
        
        // Quando a API estiver pronta, descomente:
        // const response = await fetch('http://localhost:3001/api/materias');
        // if (!response.ok) throw new Error('API não respondeu');
        // return await response.json();
        
    } catch (error) {
        console.error('❌ Erro ao carregar matérias:', error);
        throw error;
    }
}

// Função para renderizar cards das matérias
function renderizarMaterias(materias) {
    const container = document.getElementById('materiasContainer');
    
    if (!container) {
        console.error('❌ Container de matérias não encontrado!');
        return;
    }
    
    // Limpar loading
    container.innerHTML = '';
    
    // Adicionar cada matéria
    materias.forEach(materia => {
        const card = criarCardMateria(materia);
        container.appendChild(card);
    });
    
    // Adicionar opção "Todas as Matérias"
    const todasCard = criarCardTodasMaterias();
    container.appendChild(todasCard);
}

// Função para criar card de uma matéria específica
function criarCardMateria(materia) {
    const card = document.createElement('div');
    card.className = 'materia-card';
    
    // Cor personalizada se tiver
    if (materia.cor) {
        card.style.borderTop = `4px solid ${materia.cor}`;
    }
    
    card.innerHTML = `
        <h3>${materia.nome}</h3>
        <p>Simulado completo com 20 questões específicas de ${materia.nome.toLowerCase()}</p>
        <div class="card-info">
            <span class="questoes-count">📊 ${materia.questoes || 20} questões</span>
            <span class="tempo-estimado">⏱️ ~40 minutos</span>
        </div>
        <button class="btn-iniciar" data-codigo="${materia.codigo}" data-nome="${materia.nome}">
            ▶️ Iniciar Simulado
        </button>
    `;
    
    // Adicionar evento de clique
    const btn = card.querySelector('.btn-iniciar');
    btn.addEventListener('click', (e) => iniciarSimulado(materia.codigo, materia.nome, e));
    
    return card;
}

// Função para criar card "Todas as Matérias"
function criarCardTodasMaterias() {
    const card = document.createElement('div');
    card.className = 'materia-card';
    card.style.borderTop = '4px solid #ff6b6b';
    
    card.innerHTML = `
        <h3>🎯 Todas as Matérias</h3>
        <p>Simulado misto com questões de todas as matérias disponíveis</p>
        <div class="card-info">
            <span class="questoes-count">📊 20 questões</span>
            <span class="tempo-estimado">⏱️ ~40 minutos</span>
        </div>
        <button class="btn-iniciar" data-codigo="todas" data-nome="Todas as Matérias" 
                style="background: linear-gradient(90deg, #ff6b6b, #ff8e53);">
            🚀 Iniciar Simulado Geral
        </button>
    `;
    
    const btn = card.querySelector('.btn-iniciar');
    btn.addEventListener('click', (e) => iniciarSimulado('todas', 'Todas as Matérias', e));
    
    return card;
}

// Função para iniciar simulado - VERSÃO CORRIGIDA
function iniciarSimulado(codigoMateria, nomeMateria, event) {
    console.log(`🎬 Iniciando simulado: ${nomeMateria} (${codigoMateria})`);
    
    // Salvar dados no localStorage para a próxima página
    localStorage.setItem('materiaCodigo', codigoMateria);
    localStorage.setItem('materiaNome', nomeMateria);
    localStorage.setItem('tempoInicio', Date.now());
    
    // Mostrar mensagem de carregamento
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '🔄 Carregando...';
    btn.disabled = true;
    
    // ✅ REDIRECIONAR COM MATÉRIA NA URL
    window.location.href = `simulado.html?materia=${codigoMateria}`;
}

// Função para atualizar estatísticas (futuramente da API)
function atualizarEstatisticas() {
    // Futuramente buscar da API: /api/estatisticas
    const totalQuestoes = 140; // Temporário
    const estatisticas = document.querySelector('.hero-stats');
    
    if (estatisticas) {
        const questaoItem = estatisticas.querySelector('.stat-item:nth-child(2) .stat-number');
        if (questaoItem) {
            questaoItem.textContent = `${totalQuestoes}+`;
        }
    }
}

// Função para mostrar erro
function mostrarErro() {
    const container = document.getElementById('materiasContainer');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h3>⚠️ Erro ao carregar matérias</h3>
                <p>Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.</p>
                <button onclick="location.reload()" class="btn-iniciar">🔄 Tentar Novamente</button>
            </div>
        `;
    }
}

// Adicionar CSS para erro (inline para rapidez)
document.head.insertAdjacentHTML('beforeend', `
<style>
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px;
        background: #ffeaea;
        border-radius: 10px;
        border: 2px solid #ff6b6b;
    }
    
    .error-message h3 {
        color: #d63031;
        margin-bottom: 15px;
    }
    
    .card-info {
        display: flex;
        justify-content: space-between;
        margin: 15px 0;
        font-size: 0.9rem;
        color: #666;
    }
    
    .questoes-count, .tempo-estimado {
        display: flex;
        align-items: center;
        gap: 5px;
    }
</style>
`);