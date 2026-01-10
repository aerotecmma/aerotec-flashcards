// ========== resultado.js - SISTEMA DE ANÁLISE DE DESEMPENHO ==========

console.log('🚀 Sistema de Análise de Desempenho - Inicializando...');

// ========== CLASSE PRINCIPAL DO SISTEMA ==========
class SistemaAnaliseDesempenho {
    constructor() {
        console.log('🔧 Inicializando Sistema de Análise...');
        
        this.estado = {
            dadosSimulado: null,
            analise: null,
            recomendacoes: null,
            historico: [],
            config: {
                mostrarApenasErros: false,
                filtroMateria: 'todas',
                filtroStatus: 'todas',
                tema: localStorage.getItem('tema') || 'light'
            }
        };
        
        this.elementos = this.cacheElementos();
        this.analytics = new AnalyticsEngine();
        this.recomendador = new RecomendadorEstudo();
        this.inicializar();
    }
    
    cacheElementos() {
        return {
            // Elementos básicos
            loading: document.getElementById('loading'),
            infoMateria: document.getElementById('info-materia'),
            infoData: document.getElementById('info-data'),
            infoHora: document.getElementById('info-hora'),
            infoTempo: document.getElementById('info-tempo'),
            resultStatus: document.getElementById('result-status'),
            scoreNumber: document.getElementById('score-number'),
            scoreCircleBg: document.getElementById('score-circle-bg'),
            
            // Estatísticas
            labelCorrect: document.getElementById('label-correct'),
            labelWrong: document.getElementById('label-wrong'),
            labelEmpty: document.getElementById('label-empty'),
            barCorrect: document.getElementById('bar-correct'),
            barWrong: document.getElementById('bar-wrong'),
            barEmpty: document.getElementById('bar-empty'),
            
            // Containers
            questionsContainer: document.getElementById('questions-container'),
            questionsCount: document.getElementById('questions-count'),
            
            // Filtros
            filterMateria: document.getElementById('filter-materia'),
            filterStatus: document.getElementById('filter-status'),
            
            // Elementos para análises avançadas (serão criados)
            analyticsContainer: null,
            insightsContainer: null,
            recomendacoesContainer: null
        };
    }
    
    async inicializar() {
        console.log('🚀 Iniciando análise completa...');
        
        try {
            // 1. Carregar dados
            await this.carregarDados();
            
            // 2. Processar análises
            this.processarAnalisesCompletas();
            
            // 3. Carregar histórico para comparação
            await this.carregarHistorico();
            
            // 4. Atualizar interface
            this.atualizarInterfaceBasica();
            this.criarInterfaceAnalytics();
            this.renderizarQuestoes();
            
            // 5. Ocultar loading e mostrar conteúdo
            this.mostrarConteudo();
            
            // 6. Configurar interações
            this.configurarInteracoes();
            
            console.log('✅ Sistema inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.mostrarErro('Erro ao processar análise. Tente novamente.');
        }
    }
    
    // ========== CARREGAMENTO DE DADOS ==========
    
    async carregarDados() {
        console.log('📥 Carregando dados...');
        
        // Tentar múltiplas fontes
        const fontes = [
            this.carregarLocalStorage.bind(this),
            this.carregarSessionStorage.bind(this),
            this.carregarParametrosURL.bind(this),
            this.criarDadosDemonstracao.bind(this)
        ];
        
        for (const fonte of fontes) {
            try {
                const dados = await fonte();
                if (dados && this.validarDados(dados)) {
                    this.estado.dadosSimulado = dados;
                    console.log('✅ Dados carregados com sucesso');
                    return;
                }
            } catch (error) {
                console.warn(`⚠️ Fonte falhou: ${error.message}`);
            }
        }
        
        throw new Error('Nenhum dado válido encontrado');
    }
    
    carregarLocalStorage() {
        const dados = localStorage.getItem('resultado_simulado');
        if (!dados) throw new Error('Nenhum dado no localStorage');
        
        const parsed = JSON.parse(dados);
        console.log('📦 Dados do localStorage:', parsed);
        return parsed;
    }
    
    carregarSessionStorage() {
        const dados = sessionStorage.getItem('resultado_backup');
        if (!dados) throw new Error('Nenhum dado no sessionStorage');
        return JSON.parse(dados);
    }
    
    carregarParametrosURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const dadosBase64 = urlParams.get('dados');
        
        if (!dadosBase64) throw new Error('Nenhum parâmetro na URL');
        
        try {
            const dados = JSON.parse(atob(dadosBase64));
            console.log('🔗 Dados da URL carregados');
            return dados;
        } catch (error) {
            throw new Error('Dados da URL inválidos');
        }
    }
    
    criarDadosDemonstracao() {
        console.log('🔄 Criando dados de demonstração...');
        
        // Dados de exemplo para demonstração
        const correcoes = Array.from({ length: 20 }, (_, i) => ({
            numero: i + 1,
            materia: ['ELÉTRICA', 'MATEMÁTICA', 'PORTUGUÊS'][i % 3],
            nivel: i % 3 === 0 ? 'Fácil' : i % 3 === 1 ? 'Médio' : 'Difícil',
            topico: ['Circuitos', 'Magnetismo', 'Álgebra', 'Geometria', 'Gramática'][i % 5],
            pergunta: `Questão ${i + 1}: Exemplo de pergunta sobre conhecimentos específicos para ANAC.`,
            resposta_usuario: i < 14 ? `Alternativa ${i % 2 === 0 ? 'A' : 'B'}` : `Alternativa ${i % 2 === 0 ? 'B' : 'A'}`,
            resposta_correta: `Alternativa ${i % 2 === 0 ? 'A' : 'B'}`,
            acertou: i < 14, // 14 acertos, 6 erros
            explicacao: `Explicação detalhada da questão ${i + 1}. Esta questão avalia conhecimentos fundamentais para a prova.`,
            referencia: 'ANAC - Edital 2024',
            tempo_gasto: Math.floor(Math.random() * 120) + 60 // 60-180 segundos
        }));
        
        return {
            correcoes: correcoes,
            estatisticas: {
                total: 20,
                acertos: 14,
                percentual: 70,
                aprovado: true,
                tempo_total: 2400, // 40 minutos
                respondidas: 20,
                data: new Date().toISOString()
            },
            metadata: {
                simulado_id: 'demo_' + Date.now(),
                versao: '1.0'
            }
        };
    }
    
    validarDados(dados) {
        if (!dados.correcoes || !Array.isArray(dados.correcoes)) {
            throw new Error('Estrutura de correcoes inválida');
        }
        
        if (!dados.estatisticas || typeof dados.estatisticas !== 'object') {
            throw new Error('Estrutura de estatisticas inválida');
        }
        
        return true;
    }
    
    // ========== ANÁLISES AVANÇADAS ==========
    
    processarAnalisesCompletas() {
        console.log('🔍 Processando análises avançadas...');
        
        const { correcoes, estatisticas } = this.estado.dadosSimulado;
        
        this.estado.analise = {
            // Análise básica
            basica: this.analytics.analisarDesempenhoBasico(correcoes, estatisticas),
            
            // Análise de padrões
            padroes: this.analytics.identificarPadroes(correcoes),
            
            // Pontos críticos
            pontosCriticos: this.analytics.identificarPontosCriticos(correcoes),
            
            // Eficiência
            eficiencia: this.analytics.calcularEficiencia(correcoes, estatisticas),
            
            // Comparação com histórico
            evolucao: this.compararComHistorico(estatisticas)
        };
        
        // Gerar recomendações baseadas nas análises
        this.estado.recomendacoes = this.recomendador.gerarRecomendacoesCompletas(
            this.estado.analise,
            correcoes
        );
        
        console.log('✅ Análises processadas:', this.estado.analise);
    }
    
    compararComHistorico(estatisticasAtuais) {
        if (this.estado.historico.length === 0) return null;
        
        const ultimo = this.estado.historico[this.estado.historico.length - 1];
        
        return {
            comparacao: {
                percentualVariacao: estatisticasAtuais.percentual - ultimo.percentual,
                acertosVariacao: estatisticasAtuais.acertos - ultimo.acertos,
                tempoVariacao: estatisticasAtuais.tempo_total - ultimo.tempo_total
            },
            tendencia: this.analytics.calcularTendencia(this.estado.historico),
            melhorResultado: Math.max(...this.estado.historico.map(h => h.percentual)),
            mediaGeral: this.calcularMediaHistorico()
        };
    }
    
    calcularMediaHistorico() {
        if (this.estado.historico.length === 0) return 0;
        
        const soma = this.estado.historico.reduce((acc, curr) => acc + curr.percentual, 0);
        return Math.round(soma / this.estado.historico.length);
    }
    
    async carregarHistorico() {
        try {
            const historicoSalvo = localStorage.getItem('historico_simulados');
            if (historicoSalvo) {
                this.estado.historico = JSON.parse(historicoSalvo);
                console.log('📊 Histórico carregado:', this.estado.historico.length, 'registros');
            }
            
            // Salvar atual no histórico
            this.salvarNoHistorico();
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar histórico:', error);
        }
    }
    
    salvarNoHistorico() {
        try {
            const { estatisticas } = this.estado.dadosSimulado;
            const registro = {
                data: new Date().toISOString(),
                percentual: estatisticas.percentual,
                acertos: estatisticas.acertos,
                total: estatisticas.total,
                tempo_total: estatisticas.tempo_total,
                aprovado: estatisticas.aprovado,
                materia: this.estado.dadosSimulado.correcoes[0]?.materia || 'Geral'
            };
            
            this.estado.historico.push(registro);
            
            // Manter apenas últimos 50 registros
            if (this.estado.historico.length > 50) {
                this.estado.historico.shift();
            }
            
            localStorage.setItem('historico_simulados', JSON.stringify(this.estado.historico));
            console.log('💾 Histórico atualizado');
            
        } catch (error) {
            console.warn('⚠️ Não foi possível salvar histórico:', error);
        }
    }
    
    // ========== INTERFACE ==========
    
    atualizarInterfaceBasica() {
        const { estatisticas } = this.estado.dadosSimulado;
        const agora = new Date();
        
        // Informações básicas
        this.elementos.infoData.textContent = this.formatarData(agora);
        this.elementos.infoHora.textContent = this.formatarHora(agora);
        this.elementos.infoTempo.textContent = this.formatarTempo(estatisticas.tempo_total);
        
        // Matéria
        const materias = [...new Set(this.estado.dadosSimulado.correcoes.map(c => c.materia))];
        this.elementos.infoMateria.textContent = materias.length === 1 
            ? materias[0] 
            : `${materias.length} matérias`;
        
        // Status e pontuação
        this.atualizarStatusPontuacao(estatisticas);
        
        // Estatísticas básicas
        this.atualizarEstatisticasBasicas(estatisticas);
    }
    
    atualizarStatusPontuacao(estatisticas) {
        const aprovado = estatisticas.aprovado;
        const percentual = estatisticas.percentual;
        
        // Status badge
        this.elementos.resultStatus.textContent = aprovado ? '🎉 APROVADO!' : '😔 REPROVADO';
        this.elementos.resultStatus.className = `result-status-badge ${aprovado ? 'status-aprovado' : 'status-reprovado'}`;
        
        // Score circle
        this.elementos.scoreNumber.textContent = `${percentual}%`;
        this.elementos.scoreCircleBg.style.setProperty('--percent', `${percentual}%`);
        
        // Feedback
        this.atualizarFeedback(percentual, aprovado);
    }
    
    atualizarFeedback(percentual, aprovado) {
        const feedbackText = document.getElementById('feedback-text');
        const feedbackSubtext = document.getElementById('feedback-subtext');
        
        if (!feedbackText || !feedbackSubtext) return;
        
        feedbackText.textContent = this.obterFeedbackPrincipal(percentual, aprovado);
        feedbackSubtext.textContent = aprovado 
            ? 'Continue mantendo essa consistência nos estudos!'
            : 'Identifique seus pontos fracos e foque neles.';
    }
    
    obterFeedbackPrincipal(percentual, aprovado) {
        if (aprovado) {
            if (percentual >= 90) return '🏆 EXCELENTE! Nível excepcional!';
            if (percentual >= 80) return '⭐ MUITO BOM! Quase perfeito!';
            if (percentual >= 70) return '👍 BOM TRABALHO! Aprovado com folga.';
            return '😅 Passou raspando! Estude um pouco mais.';
        } else {
            if (percentual >= 60) return 'Quase lá! Falta pouco para a aprovação.';
            if (percentual >= 50) return 'Na metade do caminho. Continue!';
            if (percentual >= 40) return 'Precisa melhorar. Revise os conteúdos.';
            return '📚 Foque nos estudos básicos primeiro.';
        }
    }
    
    atualizarEstatisticasBasicas(estatisticas) {
        const { correcoes } = this.estado.dadosSimulado;
        const total = estatisticas.total || 20;
        const acertos = estatisticas.acertos || 0;
        const erros = correcoes.filter(c => !c.acertou).length;
        const emBranco = total - correcoes.length;
        
        // Labels
        this.elementos.labelCorrect.textContent = acertos;
        this.elementos.labelWrong.textContent = erros;
        this.elementos.labelEmpty.textContent = emBranco;
        
        // Percentuais para barras
        const percentAcertos = Math.round((acertos / total) * 100);
        const percentErros = Math.round((erros / total) * 100);
        const percentBranco = Math.round((emBranco / total) * 100);
        
        // Atualizar percentuais nos labels
        const percentCorrect = document.getElementById('percent-correct');
        const percentWrong = document.getElementById('percent-wrong');
        const percentEmpty = document.getElementById('percent-empty');
        
        if (percentCorrect) percentCorrect.textContent = `${percentAcertos}%`;
        if (percentWrong) percentWrong.textContent = `${percentErros}%`;
        if (percentEmpty) percentEmpty.textContent = `${percentBranco}%`;
        
        // Animar barras
        setTimeout(() => {
            this.elementos.barCorrect.style.width = `${percentAcertos}%`;
            this.elementos.barWrong.style.width = `${percentErros}%`;
            this.elementos.barEmpty.style.width = `${percentBranco}%`;
        }, 500);
    }
    
    criarInterfaceAnalytics() {
        // Criar container para análises avançadas
        const mainResultCard = document.querySelector('.main-result-card');
        if (!mainResultCard) return;
        
        // Adicionar seção de análises
        const analyticsHTML = `
            <div class="analytics-section" style="margin-top: 40px; padding-top: 30px; border-top: 2px solid var(--border-color);">
                <h3 style="font-size: 1.3rem; margin-bottom: 25px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-chart-line"></i>
                    Análises Avançadas
                </h3>
                
                <div class="analytics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <!-- Insights -->
                    <div class="analytics-card insights-card">
                        <div class="card-header">
                            <i class="fas fa-lightbulb"></i>
                            <h4>Insights</h4>
                        </div>
                        <div class="card-content" id="insights-content">
                            <!-- Insights serão inseridos aqui -->
                        </div>
                    </div>
                    
                    <!-- Pontos Críticos -->
                    <div class="analytics-card pontos-card">
                        <div class="card-header">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h4>Pontos Críticos</h4>
                        </div>
                        <div class="card-content" id="pontos-criticos-content">
                            <!-- Pontos críticos serão inseridos aqui -->
                        </div>
                    </div>
                    
                    <!-- Recomendações -->
                    <div class="analytics-card recomendacoes-card">
                        <div class="card-header">
                            <i class="fas fa-graduation-cap"></i>
                            <h4>Plano de Estudo</h4>
                        </div>
                        <div class="card-content" id="recomendacoes-content">
                            <!-- Recomendações serão inseridos aqui -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        mainResultCard.insertAdjacentHTML('beforeend', analyticsHTML);
        
        // Armazenar referências
        this.elementos.insightsContainer = document.getElementById('insights-content');
        this.elementos.pontosCriticosContainer = document.getElementById('pontos-criticos-content');
        this.elementos.recomendacoesContainer = document.getElementById('recomendacoes-content');
        
        // Popular com dados
        this.atualizarInterfaceAnalytics();
    }
    
    atualizarInterfaceAnalytics() {
        if (!this.estado.analise) return;
        
        // Insights
        if (this.elementos.insightsContainer) {
            const insights = this.gerarInsightsInterface();
            this.elementos.insightsContainer.innerHTML = insights;
        }
        
        // Pontos críticos
        if (this.elementos.pontosCriticosContainer) {
            const pontosCriticos = this.gerarPontosCriticosInterface();
            this.elementos.pontosCriticosContainer.innerHTML = pontosCriticos;
        }
        
        // Recomendações
        if (this.elementos.recomendacoesContainer) {
            const recomendacoes = this.gerarRecomendacoesInterface();
            this.elementos.recomendacoesContainer.innerHTML = recomendacoes;
        }
    }
    
    gerarInsightsInterface() {
        const { analise } = this.estado;
        let insightsHTML = '<div style="display: flex; flex-direction: column; gap: 15px;">';
        
        // Insight 1: Eficiência
        if (analise.eficiencia) {
            insightsHTML += `
                <div class="insight-item">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                        <i class="fas fa-clock" style="color: var(--primary-color);"></i>
                        <strong>Eficiência Temporal</strong>
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
                        ${analise.eficiencia.classificacao} - ${analise.eficiencia.tempoMedioQuestao.toFixed(1)}s por questão
                    </p>
                </div>
            `;
        }
        
        // Insight 2: Padrões
        if (analise.padroes && analise.padroes.materiasProblematicas) {
            const materias = Object.keys(analise.padroes.materiasProblematicas);
            if (materias.length > 0) {
                const topMateria = materias[0];
                insightsHTML += `
                    <div class="insight-item">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <i class="fas fa-book" style="color: var(--danger-color);"></i>
                            <strong>Matéria com mais erros</strong>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
                            ${topMateria}: ${analise.padroes.materiasProblematicas[topMateria]} erros
                        </p>
                    </div>
                `;
            }
        }
        
        // Insight 3: Evolução
        if (analise.evolucao && analise.evolucao.comparacao) {
            const { percentualVariacao } = analise.evolucao.comparacao;
            if (this.estado.historico.length > 0) {
                const trendIcon = percentualVariacao > 0 ? '📈' : '📉';
                const trendText = percentualVariacao > 0 ? 'Melhorou' : 'Piorou';
                insightsHTML += `
                    <div class="insight-item">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <span>${trendIcon}</span>
                            <strong>Evolução</strong>
                        </div>
                        <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
                            ${trendText} ${Math.abs(percentualVariacao)}% vs último simulado
                        </p>
                    </div>
                `;
            }
        }
        
        // Insight 4: Consistência
        if (analise.basica && analise.basica.consistencia) {
            const consistencia = analise.basica.consistencia;
            const nivel = consistencia > 0.7 ? 'Alta' : consistencia > 0.5 ? 'Média' : 'Baixa';
            insightsHTML += `
                <div class="insight-item">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                        <i class="fas fa-chart-bar" style="color: var(--secondary-color);"></i>
                        <strong>Consistência</strong>
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">
                        ${nivel} - ${(consistencia * 100).toFixed(0)}% de regularidade
                    </p>
                </div>
            `;
        }
        
        insightsHTML += '</div>';
        return insightsHTML;
    }
    
    gerarPontosCriticosInterface() {
        const { pontosCriticos } = this.estado.analise;
        if (!pontosCriticos || pontosCriticos.length === 0) {
            return '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">Nenhum ponto crítico identificado</p>';
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
        
        pontosCriticos.forEach((ponto, index) => {
            const corPrioridade = ponto.prioridade === 'ALTA' ? 'var(--danger-color)' : 
                                 ponto.prioridade === 'MÉDIA' ? 'var(--warning-color)' : 'var(--text-tertiary)';
            
            html += `
                <div class="ponto-critico" style="padding: 12px; background: var(--bg-secondary); border-radius: 8px; border-left: 4px solid ${corPrioridade};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <strong style="font-size: 0.95rem;">${ponto.materia}</strong>
                        <span style="font-size: 0.8rem; padding: 3px 8px; background: ${corPrioridade}; color: white; border-radius: 4px;">
                            ${ponto.prioridade}
                        </span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary);">
                        <span>${ponto.topico}</span>
                        <span>${ponto.erros} erro${ponto.erros !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    gerarRecomendacoesInterface() {
        const { recomendacoes } = this.estado;
        if (!recomendacoes) {
            return '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">Carregando recomendações...</p>';
        }
        
        let html = '<div style="display: flex; flex-direction: column; gap: 15px;">';
        
        // Plano de estudo
        if (recomendacoes.planoEstudo && recomendacoes.planoEstudo.length > 0) {
            html += `
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="fas fa-calendar-check" style="color: var(--primary-color);"></i>
                        <strong style="font-size: 0.95rem;">Foco Esta Semana</strong>
                    </div>
            `;
            
            recomendacoes.planoEstudo.slice(0, 3).forEach(item => {
                html += `
                    <div style="font-size: 0.85rem; padding: 5px 0; border-bottom: 1px solid var(--border-color);">
                        • ${item}
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        // Estratégia
        if (recomendacoes.estrategiaProva) {
            html += `
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="fas fa-chess-board" style="color: var(--secondary-color);"></i>
                        <strong style="font-size: 0.95rem;">Estratégia Recomendada</strong>
                    </div>
                    <p style="font-size: 0.85rem; margin: 0; color: var(--text-secondary);">
                        ${recomendacoes.estrategiaProva}
                    </p>
                </div>
            `;
        }
        
        // Tempo de estudo
        if (recomendacoes.tempoEstudoRecomendado) {
            html += `
                <div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="fas fa-hourglass-half" style="color: var(--warning-color);"></i>
                        <strong style="font-size: 0.95rem;">Tempo de Estudo</strong>
                    </div>
                    <p style="font-size: 0.85rem; margin: 0; color: var(--text-secondary);">
                        ${recomendacoes.tempoEstudoRecomendado}
                    </p>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }
    
    // ========== QUESTÕES ==========
    
    renderizarQuestoes() {
        if (!this.estado.dadosSimulado) return;
        
        const { correcoes } = this.estado.dadosSimulado;
        const questoesFiltradas = this.filtrarQuestoes(correcoes);
        
        this.elementos.questionsContainer.innerHTML = '';
        this.elementos.questionsCount.textContent = `${questoesFiltradas.length} questões`;
        
        if (questoesFiltradas.length === 0) {
            this.mostrarEstadoVazio();
            return;
        }
        
        // Ordenar e renderizar
        questoesFiltradas
            .sort((a, b) => a.numero - b.numero)
            .forEach((correcao, index) => {
                this.criarQuestaoElemento(correcao, index);
            });
    }
    
    filtrarQuestoes(correcoes) {
        let filtradas = [...correcoes];
        
        // Aplicar filtros
        if (this.estado.config.mostrarApenasErros) {
            filtradas = filtradas.filter(c => !c.acertou);
        }
        
        if (this.estado.config.filtroMateria !== 'todas') {
            filtradas = filtradas.filter(c => c.materia === this.estado.config.filtroMateria);
        }
        
        if (this.estado.config.filtroStatus !== 'todas') {
            const querCorretas = this.estado.config.filtroStatus === 'corretas';
            filtradas = filtradas.filter(c => c.acertou === querCorretas);
        }
        
        return filtradas;
    }
    
    criarQuestaoElemento(correcao, index) {
        const questaoEl = document.createElement('div');
        questaoEl.className = `question-item ${correcao.acertou ? 'correct' : 'wrong'} fade-in`;
        questaoEl.style.animationDelay = `${index * 0.05}s`;
        
        const pergunta = this.escapeHTML(correcao.pergunta);
        const respostaUsuario = this.escapeHTML(correcao.resposta_usuario);
        const respostaCorreta = this.escapeHTML(correcao.resposta_correta);
        const explicacao = this.formatarTexto(correcao.explicacao);
        
        questaoEl.innerHTML = `
            <div class="question-header">
                <div class="question-number">Questão ${correcao.numero}</div>
                <div class="question-status ${correcao.acertou ? 'status-correct' : 'status-wrong'}">
                    ${correcao.acertou ? '✅ CORRETA' : '❌ ERRADA'}
                </div>
            </div>
            
            <div class="question-text">${pergunta}</div>
            
            <div class="answers-container">
                <div class="answer ${!correcao.acertou ? 'wrong-answer' : 'correct-answer'}">
                    <div class="answer-letter">${correcao.acertou ? '✓' : '✗'}</div>
                    <div class="answer-text">
                        <strong>Sua resposta:</strong> ${respostaUsuario}
                    </div>
                </div>
                
                ${!correcao.acertou ? `
                <div class="answer correct-answer">
                    <div class="answer-letter">✓</div>
                    <div class="answer-text">
                        <strong>Resposta correta:</strong> ${respostaCorreta}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="metadata">
                <div class="meta-item">
                    <i class="fas fa-book"></i>
                    <span>${correcao.materia || 'Geral'}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-chart-bar"></i>
                    <span>${correcao.nivel || 'N/A'}</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-tag"></i>
                    <span>${correcao.topico || 'N/A'}</span>
                </div>
            </div>
            
            <button class="btn-toggle" onclick="sistemaDesempenho.toggleExplicacao(${index})" data-index="${index}">
                <i class="fas fa-lightbulb"></i>
                Ver Explicação
            </button>
            
            <div class="explanation" id="expl-${index}">
                <div class="explanation-title">
                    <i class="fas fa-info-circle"></i>
                    Explicação
                </div>
                <div class="explanation-text">${explicacao}</div>
            </div>
        `;
        
        this.elementos.questionsContainer.appendChild(questaoEl);
    }
    
    mostrarEstadoVazio() {
        const mensagem = this.estado.config.mostrarApenasErros 
            ? `
                <div class="empty-state">
                    <div class="empty-state-icon">🎉</div>
                    <h3 class="empty-state-title">Parabéns!</h3>
                    <p>Você não errou nenhuma questão!</p>
                    <button class="btn-action btn-secondary" onclick="sistemaDesempenho.alternarApenasErros()" style="margin-top: 20px;">
                        <i class="fas fa-list"></i>
                        Ver Todas as Questões
                    </button>
                </div>
            `
            : `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">Nenhuma questão encontrada</h3>
                    <p>Não há questões para os filtros atuais.</p>
                </div>
            `;
        
        this.elementos.questionsContainer.innerHTML = mensagem;
    }
    
    // ========== INTERAÇÕES ==========
    
    configurarInteracoes() {
        // Filtros
        if (this.elementos.filterMateria) {
            this.elementos.filterMateria.addEventListener('change', (e) => {
                this.estado.config.filtroMateria = e.target.value;
                this.renderizarQuestoes();
                this.mostrarToast(`Filtrando por: ${e.target.value === 'todas' ? 'Todas matérias' : e.target.value}`);
            });
        }
        
        if (this.elementos.filterStatus) {
            this.elementos.filterStatus.addEventListener('change', (e) => {
                this.estado.config.filtroStatus = e.target.value;
                this.renderizarQuestoes();
                this.mostrarToast(`Filtrando: ${e.target.options[e.target.selectedIndex].text}`);
            });
        }
        
        // Popular filtro de matérias
        this.popularFiltroMaterias();
    }
    
    popularFiltroMaterias() {
        if (!this.elementos.filterMateria || !this.estado.dadosSimulado) return;
        
        const materias = [...new Set(this.estado.dadosSimulado.correcoes
            .map(c => c.materia)
            .filter(Boolean))];
        
        this.elementos.filterMateria.innerHTML = '<option value="todas">Todas as matérias</option>';
        
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia;
            option.textContent = materia;
            this.elementos.filterMateria.appendChild(option);
        });
    }
    
    toggleExplicacao(index) {
        const explicacao = document.getElementById(`expl-${index}`);
        const botoes = document.querySelectorAll(`[data-index="${index}"]`);
        
        if (explicacao.classList.contains('show')) {
            explicacao.classList.remove('show');
            botoes.forEach(b => b.innerHTML = '<i class="fas fa-lightbulb"></i> Ver Explicação');
        } else {
            explicacao.classList.add('show');
            botoes.forEach(b => b.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Explicação');
        }
    }
    
    alternarApenasErros() {
        this.estado.config.mostrarApenasErros = !this.estado.config.mostrarApenasErros;
        
        const botao = document.querySelector('[onclick*="alternarApenasErros"]');
        if (botao) {
            botao.innerHTML = this.estado.config.mostrarApenasErros 
                ? '<i class="fas fa-list"></i> Ver Todas' 
                : '<i class="fas fa-filter"></i> Ver Apenas Erros';
        }
        
        this.renderizarQuestoes();
        this.mostrarToast(this.estado.config.mostrarApenasErros 
            ? 'Mostrando apenas questões erradas' 
            : 'Mostrando todas as questões'
        );
    }
    
    // ========== AÇÕES ==========
    
    voltarParaSimulado() {
        this.mostrarToast('Redirecionando para novo simulado...', 'info');
        setTimeout(() => {
            window.location.href = 'simulado.html';
        }, 800);
    }
    
    compartilharResultado() {
        if (!this.estado.dadosSimulado) return;
        
        const { estatisticas } = this.estado.dadosSimulado;
        const texto = `🎯 Resultado Simulado ANAC: ${estatisticas.acertos}/${estatisticas.total} (${estatisticas.percentual}%) - ${estatisticas.aprovado ? 'APROVADO' : 'REPROVADO'}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Meu Resultado - Aerotec MMA',
                text: texto,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(texto)
                .then(() => this.mostrarToast('📋 Resultado copiado!', 'success'))
                .catch(() => this.mostrarToast('❌ Não foi possível compartilhar', 'error'));
        }
    }
    
    gerarRelatorio() {
        this.mostrarToast('Gerando relatório PDF...', 'info');
        
        // Simulação de geração de PDF
        setTimeout(() => {
            const conteudo = document.querySelector('.container').innerHTML;
            const janela = window.open('', '_blank');
            janela.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Relatório - Aerotec MMA</title>
                    <style>
                        body { font-family: Arial; padding: 30px; max-width: 800px; margin: 0 auto; }
                        .score { font-size: 3em; font-weight: bold; text-align: center; margin: 20px 0; }
                        .analytics-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin: 30px 0; }
                        @media print {
                            button { display: none !important; }
                            .theme-btn { display: none !important; }
                        }
                    </style>
                </head>
                <body>
                    <h1>Relatório de Resultado - Aerotec MMA</h1>
                    <div class="score" style="color: ${this.estado.dadosSimulado.estatisticas.aprovado ? 'green' : 'red'}">
                        ${this.estado.dadosSimulado.estatisticas.percentual}%
                    </div>
                    <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    <p><strong>Acertos:</strong> ${this.estado.dadosSimulado.estatisticas.acertos}/${this.estado.dadosSimulado.estatisticas.total}</p>
                    <hr>
                    ${conteudo}
                </body>
                </html>
            `);
            
            setTimeout(() => {
                janela.print();
            }, 500);
            
        }, 1000);
    }
    
    // ========== UTILITÁRIOS ==========
    
    formatarData(data) {
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    formatarHora(data) {
        return data.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    formatarTempo(segundos) {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        
        if (horas > 0) {
            return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
        }
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    
    formatarTexto(texto) {
        if (!texto) return '';
        return texto
            .replace(/\\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    escapeHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
    
    mostrarConteudo() {
        // Animação de saída do loading
        this.elementos.loading.style.opacity = '0';
        this.elementos.loading.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            this.elementos.loading.style.display = 'none';
            
            // Animar entrada do conteúdo
            document.querySelectorAll('.fade-in').forEach((el, i) => {
                el.style.animationDelay = `${i * 0.05}s`;
            });
            
            this.mostrarToast('✅ Análise completa!', 'success');
            
        }, 500);
    }
    
    mostrarErro(mensagem) {
        this.elementos.loading.innerHTML = `
            <div style="color: var(--danger-color); text-align: center; padding: 40px;">
                <h2 style="margin-bottom: 15px;">❌ Erro</h2>
                <p style="margin-bottom: 25px;">${mensagem}</p>
                <button class="btn-action btn-primary" onclick="window.location.href='simulado.html'">
                    ↩️ Voltar para Simulado
                </button>
            </div>
        `;
    }
    
    mostrarToast(mensagem, tipo = 'info') {
        // Remove toast anterior
        const toastAnterior = document.querySelector('.toast');
        if (toastAnterior) toastAnterior.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.innerHTML = `
            <span style="font-size: 1.2em;">
                ${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}
            </span>
            <span>${mensagem}</span>
        `;
        
        // Estilos inline
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 25px;
            border-radius: 10px;
            background: ${tipo === 'success' ? 'var(--secondary-color)' : 
                        tipo === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 10px 25px var(--shadow-heavy);
            display: flex;
            align-items: center;
            gap: 15px;
            animation: fadeIn 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========== MÓDULO DE ANÁLISE ==========

class AnalyticsEngine {
    analisarDesempenhoBasico(correcoes, estatisticas) {
        const total = estatisticas.total || 20;
        const acertos = estatisticas.acertos || 0;
        
        return {
            taxaAcerto: estatisticas.percentual,
            taxaErro: ((total - acertos) / total) * 100,
            consistencia: this.calcularConsistencia(correcoes),
            nivelDificuldadeMedio: this.calcularNivelMedio(correcoes),
            distribuicaoAcertos: this.calcularDistribuicao(correcoes)
        };
    }
    
    identificarPadroes(correcoes) {
        const padroes = {
            materiasProblematicas: this.agruparErrosPorMateria(correcoes),
            sequenciaErros: this.identificarSequenciasErros(correcoes),
            nivelErros: this.analisarNivelErros(correcoes),
            tempoPadrao: this.analisarPadraoTemporal(correcoes)
        };
        
        return padroes;
    }
    
    identificarPontosCriticos(correcoes) {
        const errosPorTopico = {};
        
        correcoes.forEach(correcao => {
            if (!correcao.acertou) {
                const chave = `${correcao.materia}-${correcao.topico}`;
                errosPorTopico[chave] = (errosPorTopico[chave] || 0) + 1;
            }
        });
        
        return Object.entries(errosPorTopico)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([chave, erros]) => {
                const [materia, topico] = chave.split('-');
                return {
                    materia,
                    topico,
                    erros,
                    prioridade: erros > 3 ? 'ALTA' : erros > 1 ? 'MÉDIA' : 'BAIXA'
                };
            });
    }
    
    calcularEficiencia(correcoes, estatisticas) {
        const tempoTotal = estatisticas.tempo_total || 0;
        const totalQuestoes = estatisticas.total || 20;
        const tempoMedio = tempoTotal / totalQuestoes;
        
        let classificacao = '';
        if (tempoMedio <= 90) classificacao = 'ÓTIMA';
        else if (tempoMedio <= 120) classificacao = 'BOA';
        else if (tempoMedio <= 150) classificacao = 'REGULAR';
        else classificacao = 'LENTA';
        
        return {
            tempoMedioQuestao: tempoMedio,
            classificacao,
            eficienciaPorMinuto: (estatisticas.acertos / (tempoTotal / 60)).toFixed(2)
        };
    }
    
    calcularTendencia(historico) {
        if (historico.length < 2) return 'ESTÁVEL';
        
        const ultimos3 = historico.slice(-3);
        const variacoes = [];
        
        for (let i = 1; i < ultimos3.length; i++) {
            variacoes.push(ultimos3[i].percentual - ultimos3[i-1].percentual);
        }
        
        const mediaVariacao = variacoes.reduce((a, b) => a + b, 0) / variacoes.length;
        
        if (mediaVariacao > 3) return 'POSITIVA';
        if (mediaVariacao < -3) return 'NEGATIVA';
        return 'ESTÁVEL';
    }
    
    calcularConsistencia(correcoes) {
        // Calcula quão consistente foi o desempenho ao longo da prova
        const blocos = [];
        let blocoAtual = [];
        
        correcoes.forEach((correcao, i) => {
            blocoAtual.push(correcao.acertou ? 1 : 0);
            
            if (blocoAtual.length === 5 || i === correcoes.length - 1) {
                const taxaAcertoBloco = blocoAtual.reduce((a, b) => a + b, 0) / blocoAtual.length;
                blocos.push(taxaAcertoBloco);
                blocoAtual = [];
            }
        });
        
        // Calcula variância entre blocos
        if (blocos.length < 2) return 1;
        
        const media = blocos.reduce((a, b) => a + b, 0) / blocos.length;
        const variacao = blocos.reduce((soma, bloco) => soma + Math.abs(bloco - media), 0) / blocos.length;
        
        // Consistência é o inverso da variação (normalizado entre 0 e 1)
        return Math.max(0, 1 - variacao);
    }
    
    calcularNivelMedio(correcoes) {
        const niveis = {
            'Fácil': 1,
            'Médio': 2,
            'Difícil': 3
        };
        
        const soma = correcoes.reduce((acc, correcao) => {
            return acc + (niveis[correcao.nivel] || 2);
        }, 0);
        
        const media = soma / correcoes.length;
        
        if (media < 1.5) return 'Fácil';
        if (media < 2.5) return 'Médio';
        return 'Difícil';
    }
    
    calcularDistribuicao(correcoes) {
        const distribuicao = {};
        
        correcoes.forEach(correcao => {
            const chave = correcao.materia || 'Geral';
            if (!distribuicao[chave]) {
                distribuicao[chave] = { total: 0, acertos: 0 };
            }
            
            distribuicao[chave].total++;
            if (correcao.acertou) distribuicao[chave].acertos++;
        });
        
        // Calcular percentuais
        Object.keys(distribuicao).forEach(materia => {
            const dados = distribuicao[materia];
            dados.percentual = Math.round((dados.acertos / dados.total) * 100);
        });
        
        return distribuicao;
    }
    
    agruparErrosPorMateria(correcoes) {
        const errosPorMateria = {};
        
        correcoes.forEach(correcao => {
            if (!correcao.acertou) {
                const materia = correcao.materia || 'Geral';
                errosPorMateria[materia] = (errosPorMateria[materia] || 0) + 1;
            }
        });
        
        // Ordenar por mais erros
        return Object.fromEntries(
            Object.entries(errosPorMateria).sort((a, b) => b[1] - a[1])
        );
    }
    
    identificarSequenciasErros(correcoes) {
        const sequencias = [];
        let sequenciaAtual = [];
        
        correcoes.sort((a, b) => a.numero - b.numero).forEach(correcao => {
            if (!correcao.acertou) {
                sequenciaAtual.push(correcao.numero);
            } else if (sequenciaAtual.length > 0) {
                if (sequenciaAtual.length > 1) {
                    sequencias.push([...sequenciaAtual]);
                }
                sequenciaAtual = [];
            }
        });
        
        // Adicionar última sequência se houver
        if (sequenciaAtual.length > 1) {
            sequencias.push([...sequenciaAtual]);
        }
        
        return sequencias;
    }
    
    analisarNivelErros(correcoes) {
        const errosPorNivel = {
            'Fácil': 0,
            'Médio': 0,
            'Difícil': 0
        };
        
        correcoes.forEach(correcao => {
            if (!correcao.acertou) {
                const nivel = correcao.nivel || 'Médio';
                errosPorNivel[nivel] = (errosPorNivel[nivel] || 0) + 1;
            }
        });
        
        return errosPorNivel;
    }
    
    analisarPadraoTemporal(correcoes) {
        // Simulação - na implementação real usaria timestamps
        const primeiras10 = correcoes.slice(0, 10).filter(c => !c.acertou).length;
        const ultimas10 = correcoes.slice(-10).filter(c => !c.acertou).length;
        
        return {
            errosInicio: primeiras10,
            errosFim: ultimas10,
            tendencia: primeiras10 > ultimas10 ? 'MELHOROU' : 
                      primeiras10 < ultimas10 ? 'PIOROU' : 'CONSTANTE'
        };
    }
}

// ========== MÓDULO DE RECOMENDAÇÕES ==========

class RecomendadorEstudo {
    gerarRecomendacoesCompletas(analise, correcoes) {
        return {
            planoEstudo: this.criarPlanoEstudo(analise.pontosCriticos),
            estrategiaProva: this.sugerirEstrategia(analise),
            recursos: this.recomendarRecursos(analise.pontosCriticos),
            tempoEstudoRecomendado: this.calcularTempoEstudo(analise),
            metas: this.definirMetas(analise.basica)
        };
    }
    
    criarPlanoEstudo(pontosCriticos) {
        if (!pontosCriticos || pontosCriticos.length === 0) {
            return ['Revise os conceitos básicos', 'Pratique com questões mistas'];
        }
        
        const plano = [];
        
        pontosCriticos.slice(0, 3).forEach(ponto => {
            plano.push(`Focar em ${ponto.topico} (${ponto.materia}) - ${ponto.erros} erro(s)`);
        });
        
        // Adicionar recomendações gerais
        plano.push('Revisar questões que errou anteriormente');
        plano.push('Fazer exercícios específicos dos tópicos problemáticos');
        
        return plano;
    }
    
    sugerirEstrategia(analise) {
        const { basica, padroes, eficiencia } = analise;
        
        if (eficiencia.classificacao === 'LENTA') {
            return 'Gerenciar melhor o tempo - não gastar mais que 2 minutos por questão';
        }
        
        if (padroes.sequenciaErros && padroes.sequenciaErros.length > 0) {
            return 'Fazer pausas estratégicas a cada 10 questões para manter o foco';
        }
        
        if (basica.consistencia < 0.5) {
            return 'Começar pelas questões mais fáceis para ganhar confiança';
        }
        
        return 'Manter estratégia atual - seu desempenho está consistente';
    }
    
    recomendarRecursos(pontosCriticos) {
        const recursos = ['Material oficial ANAC', 'Questões anteriores'];
        
        if (pontosCriticos && pontosCriticos.length > 0) {
            pontosCriticos.slice(0, 2).forEach(ponto => {
                recursos.push(`Videoaulas sobre ${ponto.topico}`);
            });
        }
        
        return recursos;
    }
    
    calcularTempoEstudo(analise) {
        const { basica } = analise;
        
        if (basica.taxaAcerto < 60) {
            return '2-3 horas diárias pelos próximos 7 dias';
        } else if (basica.taxaAcerto < 80) {
            return '1-2 horas diárias pelos próximos 5 dias';
        } else {
            return '30-60 minutos diários para manutenção';
        }
    }
    
    definirMetas(analiseBasica) {
        const taxaAtual = analiseBasica.taxaAcerto;
        
        if (taxaAtual < 70) {
            return {
                curtoPrazo: 'Alcançar 70% no próximo simulado',
                medioPrazo: 'Estabilizar em 75-80%',
                longoPrazo: 'Manter acima de 85%'
            };
        } else if (taxaAtual < 85) {
            return {
                curtoPrazo: 'Alcançar 80% no próximo simulado',
                medioPrazo: 'Estabilizar em 85%',
                longoPrazo: 'Bater 90% consistentemente'
            };
        } else {
            return {
                curtoPrazo: 'Manter acima de 85%',
                medioPrazo: 'Reduzir erros por distração',
                longoPrazo: 'Perfeccionar conhecimentos'
            };
        }
    }
}

// ========== INICIALIZAÇÃO DO SISTEMA ==========

let sistemaDesempenho;

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado - Inicializando Sistema de Análise...');
    
    // Configurar tema
    const temaSalvo = localStorage.getItem('tema') || 'light';
    if (temaSalvo === 'dark') {
        document.documentElement.classList.add('dark-mode');
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Configurar toggle de tema
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.onclick = function() {
            const html = document.documentElement;
            const isDark = html.classList.contains('dark-mode');
            
            if (isDark) {
                html.classList.remove('dark-mode');
                this.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('tema', 'light');
            } else {
                html.classList.add('dark-mode');
                this.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('tema', 'dark');
            }
        };
    }
    
    // Inicializar sistema
    sistemaDesempenho = new SistemaAnaliseDesempenho();
    
    // Timeout de segurança
    setTimeout(() => {
        const loading = document.getElementById('loading');
        if (loading && loading.style.display !== 'none') {
            console.warn('⚠️ Timeout de segurança - Forçando exibição do conteúdo');
            loading.style.display = 'none';
        }
    }, 10000);
});

// ========== FUNÇÕES GLOBAIS ==========

window.toggleFullscreen = function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Erro ao entrar em fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
};

// Exportar para debug
window.sistemaDesempenho = sistemaDesempenho;
window.AnalyticsEngine = AnalyticsEngine;
window.RecomendadorEstudo = RecomendadorEstudo;

console.log('✅ resultado.js - Sistema de Análise carregado!');