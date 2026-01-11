document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 AeroTecMMA - Página inicial carregada');
    
    try {
        // 1. Carregar matérias da API REAL
        const materias = await carregarMaterias();
        
        // 2. Renderizar cards das matérias
        renderizarMaterias(materias);
        
        // 3. Atualizar contador de questões
        atualizarEstatisticas(materias);
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro();
    }
});

// ========== FUNÇÃO PRINCIPAL ATUALIZADA ==========
async function carregarMaterias() {
    try {
        console.log('📡 Buscando matérias da API...');
        
        const API_URL = 'https://aerotec-backend.onrender.com';
        
        // ✅ CONECTA AO BACKEND REAL (Render)
        const response = await fetch(`${API_URL}/api/materias`);
        
        if (!response.ok) {
            throw new Error(`API respondeu com status ${response.status}`);
        }
        
        const dados = await response.json();
        console.log('📦 Dados crus da API:', dados);
        
        // ✅ CONVERTE strings para objetos completos
        let materias;
        if (Array.isArray(dados) && dados.length > 0 && typeof dados[0] === 'string') {
            // Backend está retornando array de strings (códigos)
            materias = converterStringsParaMaterias(dados);
        } else {
            // Backend já retorna objetos completos
            materias = dados;
        }
        
        console.log('✅ Matérias processadas:', materias);
        return materias;
        
    } catch (error) {
        console.error('❌ Erro ao carregar matérias da API:', error);
        console.log('⚠️ Usando dados locais como fallback');
        
        // Fallback: dados locais completos
        return getMateriasFallback();
    }
}

// ✅ FUNÇÃO AUXILIAR: Converte array de strings para objetos de matérias
function converterStringsParaMaterias(codigosArray) {
    // Mapeamento completo de códigos para informações
    const mapeamento = {
        'eletrica': { nome: 'Eletricidade Básica', questoes: 20, cor: '#f59e0b' },
        'comunicacao': { nome: 'Comunicação Oral e Escrita', questoes: 20, cor: '#1a2980' },
        'aerodinamica': { nome: 'Aerodinâmica', questoes: 20, cor: '#667eea' },
        'ingles': { nome: 'Inglês Básico e Técnico', questoes: 20, cor: '#10b981' },
        'motores1': { nome: 'GMP 1', questoes: 20, cor: '#10b981' },
        'motores2': { nome: 'GMP 2', questoes: 20, cor: '#10b981' },
        'helice': { nome: 'Hélices', questoes: 20, cor: '#26d0ce' },
        'corrosao': { nome: 'Controle De Corrosão', questoes: 20, cor: '#26d0ce' },
        'desenho': { nome: 'Desenho Técnico', questoes: 20, cor: '#ff6b6b' },
        'combustiveis': { nome: 'Combustíveis e Sistema de Combustível', questoes: 20, cor: '#764ba2' },
        'basico': { nome: 'BÁSICO PREMIUM', questoes: 20, cor: '#667eea' },
        'calculo': { nome: 'Apenas Cálculos Elétricos', questoes: 20, cor: '#1a2980' },
        'gerador': { nome: 'Geradores e Motores Elétricos', questoes: 20, cor: '#1a2980' },
        'todas': { nome: 'Todas as Matérias', questoes: 20, cor: '#ff6b6b' }
    };
    
    // Cores para matérias não mapeadas
    const coresPadrao = ['#667eea', '#764ba2', '#1a2980', '#26d0ce', '#ff6b6b', '#f59e0b', '#10b981'];
    
    return codigosArray.map((codigo, index) => {
        const info = mapeamento[codigo] || {
            nome: codigo.charAt(0).toUpperCase() + codigo.slice(1).replace(/_/g, ' '),
            questoes: 20,
            cor: coresPadrao[index % coresPadrao.length]
        };
        
        return {
            nome: info.nome,
            codigo: codigo,
            questoes: info.questoes,
            cor: info.cor
        };
    });
}

// ✅ FUNÇÃO AUXILIAR: Dados de fallback
function getMateriasFallback() {
    return [
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
        { nome: 'Geradores e Motores Elétricos', codigo: 'gerador', questoes: 20, cor: '#1a2980' }
    ];
}

// ========== FUNÇÕES EXISTENTES (MANTIDAS) ==========

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
        <p>Simulado completo com ${materia.questoes || 20} questões específicas de ${materia.nome.toLowerCase()}</p>
        <div class="card-info">
            <span class="questoes-count">📊 ${materia.questoes || 20} questões</span>
            <span class="tempo-estimado">⏱️ ~${Math.ceil((materia.questoes || 20) * 2)} minutos</span>
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

// ✅ ATUALIZADA: Função para atualizar estatísticas
function atualizarEstatisticas(materias) {
    const estatisticas = document.querySelector('.hero-stats');
    
    if (estatisticas && materias) {
        // Total de matérias
        const materiasItem = estatisticas.querySelector('.stat-item:nth-child(1) .stat-number');
        if (materiasItem) {
            materiasItem.textContent = materias.length;
        }
        
        // Total de questões (soma de todas as matérias)
        const totalQuestoes = materias.reduce((sum, m) => sum + (m.questoes || 20), 0);
        const questaoItem = estatisticas.querySelector('.stat-item:nth-child(2) .stat-number');
        if (questaoItem) {
            questaoItem.textContent = `${totalQuestoes}+`;
        }
        
        // Atualizar porcentagem de corte
        const corteItem = estatisticas.querySelector('.stat-item:nth-child(3) .stat-number');
        if (corteItem) {
            // Lógica para calcular % de corte (pode ajustar depois)
            corteItem.textContent = '70%';
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
