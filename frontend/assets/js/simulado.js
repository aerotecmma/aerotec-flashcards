// SIMULADO.JS CORRIGIDO - VERSÃO COMPATÍVEL COM resultado.js

// ========== CONFIGURAÇÃO ==========
const CONFIG = {
    API_BASE_URL: 'http://localhost:3001',
    TOTAL_QUESTOES: 20,
    TEMPO_LIMITE: 60 * 60,
    LOCAL_STORAGE_KEY: 'simulado_anac_estado'
};

// ========== ESTADO GLOBAL ==========
let estadoSimulado = {
    simulado_id: null,
    perguntas: [],
    respostas: {},
    marcadas: new Set(),
    questaoAtual: 0,
    tempoInicio: null,
    tempoDecorrido: 0,
    tempoInterval: null,
    materia: null,
    estadoSalvo: false
};

// ========== ELEMENTOS DOM ==========
const elementos = {
    timer: document.getElementById('timer'),
    currentQuestion: document.getElementById('current-question'),
    questionNumber: document.getElementById('question-number'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    progressNumbers: document.getElementById('progress-numbers'),
    btnAnterior: document.getElementById('btn-anterior'),
    btnProxima: document.getElementById('btn-proxima'),
    btnMarcar: document.getElementById('btn-marcar'),
    btnLimpar: document.getElementById('btn-limpar'),
    modalFinalizar: document.getElementById('modal-finalizar'),
    modalRespondidas: document.getElementById('modal-respondidas'),
    modalTempo: document.getElementById('modal-tempo'),
    modalMarcadas: document.getElementById('modal-marcadas'),
    questionTopic: document.querySelector('.question-topic')
};

// ========== FUNÇÕES UTILITÁRIAS ==========
class Utils {
    static formatarTempo(segundos) {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }

    static criarElemento(tag, classes = [], atributos = {}) {
        const elemento = document.createElement(tag);
        classes.forEach(classe => elemento.classList.add(classe));
        Object.entries(atributos).forEach(([attr, valor]) => elemento.setAttribute(attr, valor));
        return elemento;
    }

    static salvarEstadoLocal() {
        try {
            const estadoParaSalvar = {
                ...estadoSimulado,
                marcadas: Array.from(estadoSimulado.marcadas),
                tempoInicio: Date.now() - (estadoSimulado.tempoDecorrido * 1000)
            };
            localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(estadoParaSalvar));
            estadoSimulado.estadoSalvo = true;
        } catch (error) {
            console.error('Erro ao salvar estado:', error);
        }
    }

    static carregarEstadoLocal() {
        try {
            const estadoSalvo = localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY);
            if (estadoSalvo) {
                const parsed = JSON.parse(estadoSalvo);
                parsed.marcadas = new Set(parsed.marcadas);
                return parsed;
            }
        } catch (error) {
            console.error('Erro ao carregar estado:', error);
        }
        return null;
    }

    static limparEstadoLocal() {
        localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEY);
    }

    static exibirNotificacao(mensagem, tipo = 'info', duracao = 3000) {
        const notificacao = this.criarElemento('div', ['notificacao', `notificacao-${tipo}`]);
        notificacao.textContent = mensagem;
        document.body.appendChild(notificacao);

        setTimeout(() => {
            notificacao.classList.add('fade-out');
            setTimeout(() => notificacao.remove(), 500);
        }, duracao);
    }

    static validarResposta(resposta) {
        return ['A', 'B'].includes(resposta);
    }

    static calcularPorcentagemCompleta() {
        const respondidas = Object.keys(estadoSimulado.respostas).length;
        return Math.round((respondidas / CONFIG.TOTAL_QUESTOES) * 100);
    }
}

// ========== CONTROLE DO SIMULADO ==========
class ControladorSimulado {
    static async iniciar() {
        console.log('🚀 Iniciando simulado...');

        // Verificar se há estado salvo
        const estadoSalvo = Utils.carregarEstadoLocal();
        if (estadoSalvo && await this.verificarContinuarSimulado(estadoSalvo)) {
            estadoSimulado = estadoSalvo;
            estadoSimulado.tempoInicio = Date.now() - (estadoSimulado.tempoDecorrido * 1000);
            this.renderizarEstadoSalvo();
        } else {
            await this.carregarNovoSimulado();
        }

        this.iniciarTemporizador();
        this.gerarBotoesProgresso();
        this.carregarQuestao(estadoSimulado.questaoAtual);
        this.configurarEventListeners();
        this.configurarProtecaoNavegacao();
    }

    static async carregarNovoSimulado() {
        try {
            // 1. Obter matéria da URL ou localStorage
            const urlParams = new URLSearchParams(window.location.search);
            let materia = urlParams.get('materia') || localStorage.getItem('materiaSelecionada');
            
            if (!materia) {
                Utils.exibirNotificacao('Nenhuma matéria selecionada! Redirecionando...', 'erro');
                setTimeout(() => window.location.href = 'index.html', 2000);
                return;
            }

            estadoSimulado.materia = materia;

            // 2. Atualizar título da matéria
            if (elementos.questionTopic && materia !== 'todas') {
                elementos.questionTopic.textContent = materia.toUpperCase();
            }

            // 3. Buscar simulado no servidor
            const resposta = await fetch(`${CONFIG.API_BASE_URL}/api/simulado/iniciar?materia=${materia}`);
            
            if (!resposta.ok) {
                throw new Error(`HTTP ${resposta.status}`);
            }

            const data = await resposta.json();
            
            estadoSimulado.simulado_id = data.simulado_id;
            estadoSimulado.perguntas = data.perguntas;
            estadoSimulado.tempoInicio = Date.now();
            estadoSimulado.tempoDecorrido = 0;

            console.log('✅ Simulado carregado:', data);
            Utils.exibirNotificacao('Simulado iniciado com sucesso!', 'sucesso');

        } catch (error) {
            console.error('❌ Erro ao carregar simulado:', error);
            
            // Fallback para dados de exemplo (para desenvolvimento)
            if (window.location.hostname === 'localhost') {
                Utils.exibirNotificacao('Usando dados de exemplo (modo desenvolvimento)', 'aviso');
                await this.carregarDadosExemplo();
            } else {
                Utils.exibirNotificacao('Erro ao carregar simulado. Tente novamente.', 'erro');
                setTimeout(() => window.location.href = 'index.html', 3000);
            }
        }
    }

    static async carregarDadosExemplo() {
        // Dados de exemplo para desenvolvimento
        estadoSimulado.perguntas = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            pergunta: `Questão de exemplo ${i + 1} sobre ${estadoSimulado.materia || 'ANAC'}`,
            opcoes: {
                A: `Alternativa A da questão ${i + 1}`,
                B: `Alternativa B da questão ${i + 1}`
            },
            letra_correta: Math.random() > 0.5 ? 'A' : 'B'
        }));
        estadoSimulado.simulado_id = 'exemplo_' + Date.now();
    }

    static async verificarContinuarSimulado(estadoSalvo) {
        // Verificar se o simulado salvo é recente (menos de 24 horas)
        const tempoPassado = Date.now() - estadoSalvo.tempoInicio;
        const vinteQuatroHoras = 24 * 60 * 60 * 1000;
        
        if (tempoPassado > vinteQuatroHoras) {
            Utils.limparEstadoLocal();
            return false;
        }

        // Perguntar ao usuário se deseja continuar
        return await new Promise(resolve => {
            const modal = Utils.criarElemento('div', ['modal-continuar']);
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Simulado em andamento</h3>
                    <p>Você tem um simulado incompleto de ${Utils.formatarTempo(estadoSalvo.tempoDecorrido)}.</p>
                    <p>${Object.keys(estadoSalvo.respostas).length} questões respondidas.</p>
                    <div class="modal-buttons">
                        <button class="btn btn-secondary" id="btn-novo">Iniciar Novo</button>
                        <button class="btn btn-primary" id="btn-continuar">Continuar</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            document.getElementById('btn-novo').addEventListener('click', () => {
                modal.remove();
                Utils.limparEstadoLocal();
                resolve(false);
            });
            
            document.getElementById('btn-continuar').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });
        });
    }

    static renderizarEstadoSalvo() {
        Utils.exibirNotificacao(`Simulado retomado. ${Object.keys(estadoSimulado.respostas).length} questões respondidas.`, 'info');
    }

    static iniciarTemporizador() {
        estadoSimulado.tempoInterval = setInterval(() => {
            estadoSimulado.tempoDecorrido++;
            
            // Atualizar timer na tela
            if (elementos.timer) {
                elementos.timer.textContent = Utils.formatarTempo(estadoSimulado.tempoDecorrido);
            }
            
            // Verificar tempo limite
            if (estadoSimulado.tempoDecorrido >= CONFIG.TEMPO_LIMITE) {
                this.tempoEsgotado();
            }
            
            // Salvar estado a cada 30 segundos
            if (estadoSimulado.tempoDecorrido % 30 === 0) {
                Utils.salvarEstadoLocal();
            }
        }, 1000);
    }

    static tempoEsgotado() {
        clearInterval(estadoSimulado.tempoInterval);
        Utils.exibirNotificacao('Tempo esgotado! Finalizando simulado...', 'aviso');
        setTimeout(() => this.finalizar(), 2000);
    }

    static gerarBotoesProgresso() {
        if (!elementos.progressNumbers) return;
        
        elementos.progressNumbers.innerHTML = '';
        
        for (let i = 0; i < CONFIG.TOTAL_QUESTOES; i++) {
            const btn = Utils.criarElemento('div', ['nav-dot'], {
                'data-indice': i,
                'title': `Questão ${i + 1}`
            });
            
            btn.innerHTML = `
                ${i + 1}
                <div class="status-indicator"></div>
            `;
            
            btn.addEventListener('click', () => this.carregarQuestao(i));
            
            elementos.progressNumbers.appendChild(btn);
        }
    }

    static carregarQuestao(indice) {
        if (indice < 0 || indice >= CONFIG.TOTAL_QUESTOES) return;
        
        const questao = estadoSimulado.perguntas[indice];
        if (!questao) return;
        
        estadoSimulado.questaoAtual = indice;
        
        // Atualizar elementos da tela
        this.atualizarCabecalhoQuestao(indice, questao);
        this.atualizarOpcoesResposta(indice, questao);
        this.atualizarBotoesNavegacao(indice);
        this.atualizarBotoesAcoes(indice);
        this.atualizarBotoesProgresso();
        
        // Rolagem suave para o topo da questão
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Salvar estado
        Utils.salvarEstadoLocal();
    }

    static atualizarCabecalhoQuestao(indice, questao) {
        if (elementos.currentQuestion) {
            elementos.currentQuestion.textContent = indice + 1;
        }
        
        if (elementos.questionNumber) {
            elementos.questionNumber.textContent = `Questão ${indice + 1}`;
        }
        
        if (elementos.questionText) {
            elementos.questionText.textContent = questao.pergunta;
        }
    }

    static atualizarOpcoesResposta(indice, questao) {
        if (!elementos.optionsContainer) return;
        
        elementos.optionsContainer.innerHTML = '';
        
        ['A', 'B'].forEach(letra => {
            const label = Utils.criarElemento('label', ['option']);
            
            const input = Utils.criarElemento('input', [], {
                type: 'radio',
                name: `q${indice}`,
                value: letra,
                id: `opcao-${indice}-${letra}`
            });
            
            if (estadoSimulado.respostas[indice] === letra) {
                input.checked = true;
            }
            
            input.addEventListener('change', () => this.selecionarResposta(letra));
            
            const customRadio = Utils.criarElemento('span', ['custom-radio']);
            const optionLetter = Utils.criarElemento('span', ['option-letter']);
            optionLetter.textContent = letra + '.';
            
            const optionText = Utils.criarElemento('span', ['option-text']);
            optionText.textContent = questao.opcoes[letra] || `Alternativa ${letra}`;
            
            label.appendChild(input);
            label.appendChild(customRadio);
            label.appendChild(optionLetter);
            label.appendChild(optionText);
            elementos.optionsContainer.appendChild(label);
        });
    }

    static atualizarBotoesNavegacao(indice) {
        if (elementos.btnAnterior) {
            elementos.btnAnterior.disabled = indice === 0;
        }
        
        if (elementos.btnProxima) {
            elementos.btnProxima.disabled = indice === CONFIG.TOTAL_QUESTOES - 1;
        }
    }

    static atualizarBotoesAcoes(indice) {
        if (elementos.btnMarcar) {
            const marcada = estadoSimulado.marcadas.has(indice);
            elementos.btnMarcar.classList.toggle('active', marcada);
            elementos.btnMarcar.innerHTML = marcada 
                ? '<i class="fas fa-bookmark"></i> Desmarcar Revisão' 
                : '<i class="far fa-bookmark"></i> Marcar para Revisão';
        }
    }

    static selecionarResposta(letra) {
        if (!Utils.validarResposta(letra)) return;
        
        estadoSimulado.respostas[estadoSimulado.questaoAtual] = letra;
        
        // Atualizar visual da questão atual
        this.atualizarBotoesProgresso();
        
        // Notificação de confirmação
        Utils.exibirNotificacao('Resposta registrada!', 'sucesso', 1500);
        
        // Auto-avançar se configurado
        const autoAvancar = localStorage.getItem('autoAvancar') === 'true';
        if (autoAvancar && estadoSimulado.questaoAtual < CONFIG.TOTAL_QUESTOES - 1) {
            setTimeout(() => this.carregarQuestao(estadoSimulado.questaoAtual + 1), 500);
        }
    }

    static marcarParaRevisao() {
        const indice = estadoSimulado.questaoAtual;
        
        if (estadoSimulado.marcadas.has(indice)) {
            estadoSimulado.marcadas.delete(indice);
            Utils.exibirNotificacao('Questão desmarcada da revisão', 'info', 1500);
        } else {
            estadoSimulado.marcadas.add(indice);
            Utils.exibirNotificacao('Questão marcada para revisão', 'sucesso', 1500);
        }
        
        this.atualizarBotoesAcoes(indice);
        this.atualizarBotoesProgresso();
        Utils.salvarEstadoLocal();
    }

    static limparResposta() {
        delete estadoSimulado.respostas[estadoSimulado.questaoAtual];
        this.carregarQuestao(estadoSimulado.questaoAtual);
        Utils.exibirNotificacao('Resposta limpa', 'info', 1500);
    }

    static atualizarBotoesProgresso() {
        const botoes = elementos.progressNumbers?.children;
        if (!botoes) return;
        
        for (let i = 0; i < botoes.length; i++) {
            const btn = botoes[i];
            btn.classList.remove('active', 'answered', 'marked');
            
            if (i === estadoSimulado.questaoAtual) {
                btn.classList.add('active');
            }
            
            if (estadoSimulado.respostas[i] !== undefined) {
                btn.classList.add('answered');
            }
            
            if (estadoSimulado.marcadas.has(i)) {
                btn.classList.add('marked');
            }
        }
    }

    static questaoAnterior() {
        if (estadoSimulado.questaoAtual > 0) {
            this.carregarQuestao(estadoSimulado.questaoAtual - 1);
        }
    }

    static proximaQuestao() {
        if (estadoSimulado.questaoAtual < CONFIG.TOTAL_QUESTOES - 1) {
            this.carregarQuestao(estadoSimulado.questaoAtual + 1);
        }
    }

    // ========== FUNÇÃO FINALIZAR CORRIGIDA ==========
    static async finalizar() {
        console.log('🔄 Iniciando processo de finalização...');
        clearInterval(estadoSimulado.tempoInterval);
        
        // Preparar dados para envio
        const respostasArray = this.prepararRespostasParaEnvio();
        
        console.log('📊 Dados preparados:', {
            totalRespostas: respostasArray.length,
            tempoTotal: estadoSimulado.tempoDecorrido,
            materia: estadoSimulado.materia
        });
        
        try {
            // 1. Tentar enviar para API
            console.log('📤 Enviando para correção na API...');
            const resultadoAPI = await this.enviarRespostasParaCorrecao(respostasArray);
            console.log('✅ Resposta da API:', resultadoAPI);
            
            // 2. FORMATAR para o formato que resultado.js espera
            console.log('🔄 Formatando dados para resultado.js...');
            const resultadoFormatado = this.formatarParaResultadoJS(resultadoAPI, respostasArray, true);
            console.log('✅ Dados formatados:', resultadoFormatado);
            
            // 3. Salvar NO FORMATO CORRETO no localStorage
            console.log('💾 Salvando no localStorage...');
            localStorage.setItem('resultado_simulado', JSON.stringify(resultadoFormatado));
            
            // 4. Backup adicional no sessionStorage
            sessionStorage.setItem('resultado_backup', JSON.stringify(resultadoFormatado));
            
            // 5. Limpar estado do simulado
            Utils.limparEstadoLocal();
            
            // 6. Redirecionar para resultado
            console.log('🔗 Redirecionando para resultado.html...');
            setTimeout(() => {
                window.location.href = 'resultado.html';
            }, 500);
            
        } catch (error) {
            console.error('❌ Erro ao finalizar simulado, usando fallback local:', error);
            
            // 7. Fallback: calcular localmente
            const resultadoLocal = this.calcularResultadoLocal(respostasArray);
            
            // 8. FORMATAR para o formato que resultado.js espera
            const resultadoFormatado = this.formatarParaResultadoJS(resultadoLocal, respostasArray, false);
            
            // 9. Salvar NO FORMATO CORRETO
            localStorage.setItem('resultado_simulado', JSON.stringify(resultadoFormatado));
            sessionStorage.setItem('resultado_backup', JSON.stringify(resultadoFormatado));
            
            // 10. Limpar estado e redirecionar
            Utils.limparEstadoLocal();
            window.location.href = 'resultado.html';
        }
    }

    // ========== NOVA FUNÇÃO: FORMATAR PARA resultado.js ==========
    static formatarParaResultadoJS(dadosAPI, respostasArray, veioDaAPI = true) {
        console.log('📝 Formatando dados para resultado.js...');
        
        // 1. Criar array de correções no formato correto
        const correcoes = respostasArray.map(resposta => {
            const pergunta = estadoSimulado.perguntas[resposta.numero - 1];
            const respostaCorreta = pergunta?.letra_correta || 'A';
            const acertou = veioDaAPI ? 
                resposta.correta : 
                (resposta.resposta === respostaCorreta);
            
            // Determinar nível baseado na questão
            const niveis = ['Fácil', 'Médio', 'Difícil'];
            const nivel = niveis[resposta.numero % 3];
            
            // Determinar tópico baseado na matéria
            const topicosPorMateria = {
                'ELÉTRICA': ['Circuitos', 'Eletromagnetismo', 'Instalações'],
                'MATEMÁTICA': ['Álgebra', 'Geometria', 'Cálculo'],
                'PORTUGUÊS': ['Gramática', 'Interpretação', 'Redação']
            };
            const topicos = topicosPorMateria[estadoSimulado.materia] || ['Geral'];
            const topico = topicos[resposta.numero % topicos.length];
            
            return {
                numero: resposta.numero,
                materia: estadoSimulado.materia || 'Geral',
                nivel: nivel,
                topico: topico,
                pergunta: pergunta?.pergunta || `Questão ${resposta.numero}`,
                resposta_usuario: resposta.resposta_texto || `Alternativa ${resposta.resposta}`,
                resposta_correta: pergunta?.opcoes?.[respostaCorreta] || `Alternativa ${respostaCorreta}`,
                acertou: acertou,
                explicacao: `Esta é uma explicação detalhada da questão ${resposta.numero} sobre ${estadoSimulado.materia || 'ANAC'}. A resposta correta é a alternativa ${respostaCorreta} porque...`,
                referencia: 'ANAC - Manual do Candidato 2024'
            };
        });
        
        // 2. Calcular estatísticas
        const totalQuestoes = estadoSimulado.perguntas.length || 20;
        const acertos = veioDaAPI ? 
            dadosAPI.corretas || dadosAPI.acertos || 0 : 
            correcoes.filter(c => c.acertou).length;
        const percentual = Math.round((acertos / totalQuestoes) * 100);
        
        // 3. Retornar no formato QUE resultado.js ESPERA
        const resultadoFormatado = {
            correcoes: correcoes,
            estatisticas: {
                total: totalQuestoes,
                acertos: acertos,
                percentual: percentual,
                aprovado: percentual >= 70,
                tempo_total: estadoSimulado.tempoDecorrido || 0
            },
            metadata: {
                simulado_id: estadoSimulado.simulado_id,
                materia: estadoSimulado.materia,
                data: new Date().toISOString(),
                origem: veioDaAPI ? 'api' : 'local'
            }
        };
        
        console.log('✅ Formatação concluída:', {
            totalCorrecoes: resultadoFormatado.correcoes.length,
            estatisticas: resultadoFormatado.estatisticas,
            formatoValido: resultadoFormatado.correcoes && resultadoFormatado.estatisticas
        });
        
        return resultadoFormatado;
    }

    static prepararRespostasParaEnvio() {
        const respostasArray = [];
        
        for (let i = 0; i < CONFIG.TOTAL_QUESTOES; i++) {
            if (estadoSimulado.respostas[i] !== undefined) {
                const pergunta = estadoSimulado.perguntas[i];
                const minhaLetra = estadoSimulado.respostas[i];
                const meuTexto = pergunta?.opcoes?.[minhaLetra] || `Alternativa ${minhaLetra}`;
                const respostaCorreta = pergunta?.letra_correta || 'A';
                const textoCorreto = pergunta?.opcoes?.[respostaCorreta] || `Alternativa ${respostaCorreta}`;
                const acertou = minhaLetra === respostaCorreta;
                
                respostasArray.push({
                    numero: i + 1,
                    pergunta_id: pergunta?.id || i + 1,
                    resposta: minhaLetra,
                    resposta_texto: meuTexto,
                    resposta_letra: minhaLetra,
                    texto_correto: textoCorreto, // IMPORTANTE para o resultado.js
                    correta: acertou,
                    letra_correta: respostaCorreta,
                    marcada_revisao: estadoSimulado.marcadas.has(i),
                    materia: estadoSimulado.materia
                });
            }
        }
        
        console.log('📋 Respostas preparadas para envio:', respostasArray);
        return respostasArray;
    }

    static async enviarRespostasParaCorrecao(respostasArray) {
        console.log('📤 Enviando para correção...');
        
        const resposta = await fetch(`${CONFIG.API_BASE_URL}/api/simulado/corrigir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                simulado_id: estadoSimulado.simulado_id,
                respostas: respostasArray,
                tempo_total: estadoSimulado.tempoDecorrido,
                materia: estadoSimulado.materia,
                data_realizacao: new Date().toISOString()
            })
        });
        
        if (!resposta.ok) {
            throw new Error(`HTTP ${resposta.status}: ${await resposta.text()}`);
        }
        
        const resultado = await resposta.json();
        console.log('✅ Resposta da API de correção:', resultado);
        return resultado;
    }

    static calcularResultadoLocal(respostasArray) {
        const corretas = respostasArray.filter(r => r.correta).length;
        const porcentagem = Math.round((corretas / CONFIG.TOTAL_QUESTOES) * 100);
        
        const resultado = {
            simulado_id: estadoSimulado.simulado_id,
            total_questoes: CONFIG.TOTAL_QUESTOES,
            respondidas: respostasArray.length,
            corretas: corretas,
            acertos: corretas, // Duplicado para compatibilidade
            porcentagem: porcentagem,
            tempo_total: estadoSimulado.tempoDecorrido,
            materia: estadoSimulado.materia,
            respostas: respostasArray,
            data: new Date().toISOString(),
            modo_offline: true
        };
        
        console.log('📊 Resultado calculado localmente:', resultado);
        return resultado;
    }

    static configurarEventListeners() {
        // Teclado shortcuts
        document.addEventListener('keydown', (e) => {
            // Ignorar se estiver em input/texto
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.questaoAnterior();
                    break;
                case 'ArrowRight':
                    this.proximaQuestao();
                    break;
                case '1':
                    this.selecionarResposta('A');
                    break;
                case '2':
                    this.selecionarResposta('B');
                    break;
                case 'm':
                case 'M':
                    this.marcarParaRevisao();
                    break;
                case 'Escape':
                    if (elementos.modalFinalizar?.style.display === 'flex') {
                        this.fecharModal();
                    }
                    break;
            }
        });
        
        // Salvar estado antes de fechar a página
        window.addEventListener('beforeunload', (e) => {
            if (Object.keys(estadoSimulado.respostas).length > 0 && !estadoSimulado.estadoSalvo) {
                Utils.salvarEstadoLocal();
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    static configurarProtecaoNavegacao() {
        window.addEventListener('beforeunload', (e) => {
            if (Object.keys(estadoSimulado.respostas).length > 0) {
                const mensagem = 'Você tem um simulado em andamento. Tem certeza que deseja sair?';
                e.returnValue = mensagem;
                return mensagem;
            }
        });
    }

    static abrirModalFinalizar() {
        const respondidas = Object.keys(estadoSimulado.respostas).length;
        const marcadas = estadoSimulado.marcadas.size;
        
        if (elementos.modalRespondidas) {
            elementos.modalRespondidas.textContent = respondidas;
        }
        
        if (elementos.modalMarcadas) {
            elementos.modalMarcadas.textContent = marcadas;
        }
        
        if (elementos.modalTempo) {
            elementos.modalTempo.textContent = Utils.formatarTempo(estadoSimulado.tempoDecorrido);
        }
        
        if (elementos.modalFinalizar) {
            elementos.modalFinalizar.style.display = 'flex';
        }
    }

    static fecharModal() {
        if (elementos.modalFinalizar) {
            elementos.modalFinalizar.style.display = 'none';
        }
    }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 simulado.js carregado - Versão COMPATÍVEL com resultado.js');
    
    // Adicionar estilos para notificações
    const estilosNotificacoes = `
        .notificacao {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
            max-width: 350px;
        }
        
        .notificacao-sucesso { background: linear-gradient(135deg, #10b981, #34d399); }
        .notificacao-erro { background: linear-gradient(135deg, #dc2626, #ef4444); }
        .notificacao-aviso { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
        .notificacao-info { background: linear-gradient(135deg, #3b82f6, #60a5fa); }
        
        .fade-out {
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.5s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .modal-continuar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-continuar .modal-content {
            background: white;
            padding: 30px;
            border-radius: 16px;
            max-width: 400px;
            width: 90%;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = estilosNotificacoes;
    document.head.appendChild(styleSheet);
    
    // Iniciar o simulado
    ControladorSimulado.iniciar().catch(error => {
        console.error('Erro fatal ao iniciar simulado:', error);
        Utils.exibirNotificacao('Erro ao iniciar simulado. Recarregue a página.', 'erro');
    });
});

// ========== FUNÇÕES GLOBAIS PARA HTML ==========
// Estas funções são chamadas pelos onclick no HTML
window.marcarParaRevisao = () => ControladorSimulado.marcarParaRevisao();
window.limparResposta = () => ControladorSimulado.limparResposta();
window.questaoAnterior = () => ControladorSimulado.questaoAnterior();
window.proximaQuestao = () => ControladorSimulado.proximaQuestao();
window.abrirModalFinalizar = () => ControladorSimulado.abrirModalFinalizar();
window.fecharModal = () => ControladorSimulado.fecharModal();
window.finalizarSimulado = () => ControladorSimulado.finalizar();

// ========== FUNÇÃO DE DEBUG ==========
// Use esta função no console para testar a finalização
window.testarFinalizacao = async function() {
    console.log('🧪 TESTANDO FINALIZAÇÃO...');
    
    // Simula algumas respostas para teste
    estadoSimulado.respostas = {
        0: 'A',
        1: 'B', 
        2: 'A',
        3: 'B',
        4: 'A',
        5: 'B',
        6: 'A',
        7: 'B',
        8: 'A',
        9: 'B'
    };
    
    estadoSimulado.materia = 'ELÉTRICA';
    estadoSimulado.tempoDecorrido = 1200; // 20 minutos
    
    const respostasArray = ControladorSimulado.prepararRespostasParaEnvio();
    const resultadoFormatado = ControladorSimulado.formatarParaResultadoJS(
        { corretas: 7, acertos: 7, porcentagem: 70 },
        respostasArray,
        false
    );
    
    console.log('✅ Formato gerado:', resultadoFormatado);
    console.log('📊 Validação:', {
        temCorrecoes: !!resultadoFormatado.correcoes,
        temEstatisticas: !!resultadoFormatado.estatisticas,
        correcoesLength: resultadoFormatado.correcoes.length,
        estatisticas: resultadoFormatado.estatisticas,
        formatoCorreto: resultadoFormatado.correcoes && resultadoFormatado.estatisticas
    });
    
    // Salva para testar
    localStorage.setItem('resultado_simulado', JSON.stringify(resultadoFormatado));
    sessionStorage.setItem('resultado_backup', JSON.stringify(resultadoFormatado));
    
    console.log('💾 Dados salvos no formato correto!');
    console.log('🔗 Pronto para redirecionar para resultado.html');
    console.log('👉 Digite: window.location.href = "resultado.html"');
};

// Exportar para uso global
window.ControladorSimulado = ControladorSimulado;
window.Utils = Utils;