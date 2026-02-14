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
    topico: 'grandezas_eletricas',
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
    topico: 'protecao_eletrica',
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
  },
  {
    id: 'gmp1-tcma-001',
    enunciado: 'De acordo com o texto, todos os motores aeronauticos devem atender a tres exigencias gerais fundamentais. Sao elas:',
    opcoes: [
      { id: 'A', texto: 'Potencia, peso e durabilidade.', correta: false },
      { id: 'B', texto: 'Eficiencia, economia e confiabilidade.', correta: true },
      { id: 'C', texto: 'Compacidade, potencia e baixo custo.', correta: false },
      { id: 'D', texto: 'Refrigeracao, baixa vibracao e peso reduzido.', correta: false }
    ],
    explicacao: 'Todos os motores devem obedecer as exigencias gerais de eficiencia, economia e confiabilidade.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'exigencias_gerais',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 2)'
  },
  {
    id: 'gmp1-tcma-002',
    enunciado: 'Segundo a apostila, alem da economia de combustivel, um motor aeronautico deve ser economico tambem em relacao a:',
    opcoes: [
      { id: 'A', texto: 'Apenas ao custo de manutencao.', correta: false },
      { id: 'B', texto: 'Apenas ao custo de aquisicao original.', correta: false },
      { id: 'C', texto: 'Ao custo de obtencao original e ao custo de manutencao.', correta: true },
      { id: 'D', texto: 'Ao custo do oleo lubrificante e sistemas de ignicao.', correta: false }
    ],
    explicacao: 'A economia exigida inclui consumo de combustivel, custo de obtencao original e custo de manutencao.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'economia_do_motor',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 2)'
  },
  {
    id: 'gmp1-tcma-003',
    enunciado: 'O texto estabelece que o motor deve ser capaz de prover alta potencia de saida sem sacrificar:',
    opcoes: [
      { id: 'A', texto: 'A compacidade.', correta: false },
      { id: 'B', texto: 'A refrigeracao.', correta: false },
      { id: 'C', texto: 'A confiabilidade.', correta: true },
      { id: 'D', texto: 'O peso especifico.', correta: false }
    ],
    explicacao: 'O texto afirma que a alta potencia de saida nao pode ocorrer com sacrificio da confiabilidade.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'potencia_e_confiabilidade',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 2)'
  },
  {
    id: 'gmp1-tcma-004',
    enunciado: 'Com relacao a durabilidade, e exigido que o motor:',
    opcoes: [
      { id: 'A', texto: 'Opere por longos periodos entre revisoes.', correta: true },
      { id: 'B', texto: 'Tenha peso reduzido mesmo que menos resistente.', correta: false },
      { id: 'C', texto: 'Seja revisado a cada 100 horas de voo.', correta: false },
      { id: 'D', texto: 'Utilize apenas materiais ferrosos em sua construcao.', correta: false }
    ],
    explicacao: 'A durabilidade requerida e para operação por longos períodos entre revisões.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'durabilidade',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 2)'
  },
  {
    id: 'gmp1-tcma-005',
    enunciado: 'De acordo com o texto, os sistemas de ignicao dos motores devem ser capazes de:',
    opcoes: [
      { id: 'A', texto: 'Operar apenas em condicoes atmosfericas padrao.', correta: false },
      { id: 'B', texto: 'Entregar o impulso eletrico as velas ou ignitores no tempo exato, mesmo em condicoes adversas.', correta: true },
      { id: 'C', texto: 'Funcionar independentemente do sistema de combustivel.', correta: false },
      { id: 'D', texto: 'Dispensar o uso de dispositivos medidores de combustivel.', correta: false }
    ],
    explicacao: 'As exigencias ditam sistemas de ignicao capazes de entregar impulso eletrico no tempo exato, mesmo em condicoes adversas.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'sistema_de_ignicao',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 2)'
  },
  {
    id: 'gmp1-tcma-006',
    enunciado: 'De acordo com a apostila, os motores em linha geralmente possuem:',
    opcoes: [
      { id: 'A', texto: 'Número ímpar de cilindros, sendo mais comuns os de 3 e 5 cilindros.', correta: false },
      { id: 'B', texto: 'Número par de cilindros, embora alguns motores de 3 cilindros tenham sido construídos.', correta: true },
      { id: 'C', texto: 'Apenas 12 cilindros, sempre refrigerados a líquido.', correta: false },
      { id: 'D', texto: 'Cilindros dispostos radialmente ao redor do cárter.', correta: false }
    ],
    explicacao: 'Motores em linha geralmente possuem numero par de cilindros, embora existam casos de 3 cilindros.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'motores_em_linha',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-007',
    enunciado: 'Quando um motor em linha é projetado com os cilindros abaixo do eixo de manivelas, ele é denominado:',
    opcoes: [
      { id: 'A', texto: 'Motor invertido.', correta: true },
      { id: 'B', texto: 'Motor radial.', correta: false },
      { id: 'C', texto: 'Motor em V invertido.', correta: false },
      { id: 'D', texto: 'Motor oposto.', correta: false }
    ],
    explicacao: 'Quando os cilindros ficam abaixo do eixo de manivelas, a denominacao e motor invertido.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'motor_invertido',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-008',
    enunciado: 'Uma vantagem dos motores em linha montados na posição invertida é:',
    opcoes: [
      { id: 'A', texto: 'Maior facilidade de refrigeração a líquido.', correta: false },
      { id: 'B', texto: 'Menor razão peso-potência.', correta: false },
      { id: 'C', texto: 'Possibilidade de um trem de pouso menor e maior visibilidade para o piloto.', correta: true },
      { id: 'D', texto: 'Dispensa o uso de engrenagens de redução.', correta: false }
    ],
    explicacao: 'A posicao invertida favorece trem de pouso menor e melhora a visibilidade para o piloto.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'vantagens_motor_em_linha_invertido',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-009',
    enunciado: 'Os motores em linha refrigerados a ar, quando aumentam de tamanho, apresentam como desvantagem:',
    opcoes: [
      { id: 'A', texto: 'Aumento da razão peso-potência.', correta: false },
      { id: 'B', texto: 'Dificuldade de refrigeração adequada.', correta: true },
      { id: 'C', texto: 'Impossibilidade de serem montados em asas.', correta: false },
      { id: 'D', texto: 'Necessidade de hélices de passo fixo.', correta: false }
    ],
    explicacao: 'Em motores em linha refrigerados a ar, o aumento de tamanho dificulta a refrigeracao adequada.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'refrigeracao_motores_em_linha',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-010',
    enunciado: 'Os motores em linha são, em larga escala, restritos a:',
    opcoes: [
      { id: 'A', texto: 'Grandes aeronaves de transporte comercial.', correta: false },
      { id: 'B', texto: 'Pequenas e médias potências utilizadas em pequenas aeronaves.', correta: true },
      { id: 'C', texto: 'Motores de foguete.', correta: false },
      { id: 'D', texto: 'Apenas aplicações militares supersônicas.', correta: false }
    ],
    explicacao: 'Esse tipo de motor e amplamente restrito a pequenas e medias potencias para pequenas aeronaves.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'aplicacao_motores_em_linha',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-011',
    enunciado: 'Nos motores opostos, os cilindros estão dispostos:',
    opcoes: [
      { id: 'A', texto: 'Em uma única fileira vertical.', correta: false },
      { id: 'B', texto: 'Em duas carreiras radialmente ao redor do cárter.', correta: false },
      { id: 'C', texto: 'Em duas carreiras diretamente opostas, com eixo de manivelas no centro.', correta: true },
      { id: 'D', texto: 'Em ângulo de 60º entre si.', correta: false }
    ],
    explicacao: 'Motores opostos possuem duas carreiras diretamente opostas com eixo de manivelas central.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'arranjo_motores_opostos',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-012',
    enunciado: 'Nos motores opostos, os pistões das duas carreiras de cilindros são conectados:',
    opcoes: [
      { id: 'A', texto: 'A eixos de manivelas independentes.', correta: false },
      { id: 'B', texto: 'Ao mesmo eixo de manivelas.', correta: true },
      { id: 'C', texto: 'A um único virabrequim por meio de bielas articuladas.', correta: false },
      { id: 'D', texto: 'A um anel de ressaltos comum.', correta: false }
    ],
    explicacao: 'Nos motores opostos, os pistoes das duas carreiras sao conectados ao mesmo eixo de manivelas.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'pistoes_motores_opostos',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-013',
    enunciado: 'A versão de motor oposto predominantemente utilizada em aviação é:',
    opcoes: [
      { id: 'A', texto: 'Refrigerada a líquido.', correta: false },
      { id: 'B', texto: 'Refrigerada a ar.', correta: true },
      { id: 'C', texto: 'Refrigerada a óleo.', correta: false },
      { id: 'D', texto: 'Mista (ar e líquido).', correta: false }
    ],
    explicacao: 'Embora existam variantes, em aviacao predomina a versao de motor oposto refrigerada a ar.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'refrigeracao_motores_opostos',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-014',
    enunciado: 'Uma das vantagens dos motores opostos é:',
    opcoes: [
      { id: 'A', texto: 'Alta razão peso-potência.', correta: false },
      { id: 'B', texto: 'Elevada vibração, compensada por contrapesos.', correta: false },
      { id: 'C', texto: 'Baixa razão peso-potência e relativa baixa vibração.', correta: true },
      { id: 'D', texto: 'Grande área frontal, melhorando o arrasto.', correta: false }
    ],
    explicacao: 'Motores opostos se destacam por baixa razao peso-potencia e relativamente baixa vibracao.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'vantagens_motores_opostos',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-015',
    enunciado: 'A silhueta estreita dos motores opostos os torna ideais para:',
    opcoes: [
      { id: 'A', texto: 'Instalação vertical em fuselagens estreitas.', correta: false },
      { id: 'B', texto: 'Instalação horizontal em asas de aeronaves.', correta: true },
      { id: 'C', texto: 'Montagem em torres de helicópteros.', correta: false },
      { id: 'D', texto: 'Uso exclusivo em aeronaves experimentais.', correta: false }
    ],
    explicacao: 'A estreita silhueta favorece instalacao horizontal em asas de aeronaves.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'instalacao_motores_opostos',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-016',
    enunciado: 'Nos motores em V, os cilindros são montados em duas carreiras em linha, geralmente com ângulo de:',
    opcoes: [
      { id: 'A', texto: '30º', correta: false },
      { id: 'B', texto: '45º', correta: false },
      { id: 'C', texto: '60º', correta: true },
      { id: 'D', texto: '90º', correta: false }
    ],
    explicacao: 'Nos motores em V, as carreiras de cilindros sao montadas geralmente com angulo de 60 graus.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'geometria_motores_em_v',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-017',
    enunciado: 'A maioria dos motores em V possui:',
    opcoes: [
      { id: 'A', texto: '6 cilindros.', correta: false },
      { id: 'B', texto: '9 cilindros.', correta: false },
      { id: 'C', texto: '12 cilindros.', correta: true },
      { id: 'D', texto: '18 cilindros.', correta: false }
    ],
    explicacao: 'A maioria dos motores em V possui 12 cilindros.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'quantidade_cilindros_motores_em_v',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-018',
    enunciado: 'A designação de um motor em V, como V-1710, indica:',
    opcoes: [
      { id: 'A', texto: 'O número de cilindros e a potência.', correta: false },
      { id: 'B', texto: 'O ângulo entre as carreiras e o número de cilindros.', correta: false },
      { id: 'C', texto: 'A letra V seguida do deslocamento do pistão em polegadas cúbicas.', correta: true },
      { id: 'D', texto: 'A letra V seguida da potência em HP.', correta: false }
    ],
    explicacao: 'A designacao usa a letra V seguida do deslocamento em polegadas cubicas, como no exemplo V-1710.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'designacao_motores_em_v',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-019',
    enunciado: 'Os motores em V podem ser refrigerados a:',
    opcoes: [
      { id: 'A', texto: 'Apenas a líquido.', correta: false },
      { id: 'B', texto: 'Apenas a ar.', correta: false },
      { id: 'C', texto: 'Líquido ou ar.', correta: true },
      { id: 'D', texto: 'Apenas a óleo.', correta: false }
    ],
    explicacao: 'Motores em V podem ser refrigerados a liquido ou a ar.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'refrigeracao_motores_em_v',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-020',
    enunciado: 'O motor V-1710, citado na apostila, é um exemplo clássico de motor:',
    opcoes: [
      { id: 'A', texto: 'Radial.', correta: false },
      { id: 'B', texto: 'Em linha.', correta: false },
      { id: 'C', texto: 'Em V.', correta: true },
      { id: 'D', texto: 'Oposto.', correta: false }
    ],
    explicacao: 'O V-1710 e exemplo de motor em V conforme a nomenclatura apresentada.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'exemplo_motor_em_v',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-021',
    enunciado: 'Os motores radiais consistem de:',
    opcoes: [
      { id: 'A', texto: 'Cilindros dispostos em linha reta.', correta: false },
      { id: 'B', texto: 'Cilindros opostos horizontalmente.', correta: false },
      { id: 'C', texto: 'Uma ou mais carreiras de cilindros dispostos ao redor de um cárter central.', correta: true },
      { id: 'D', texto: 'Cilindros em duas fileiras em ângulo de 60º.', correta: false }
    ],
    explicacao: 'Motores radiais possuem uma ou mais carreiras de cilindros ao redor de um carter central.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'conceito_motores_radiais',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-022',
    enunciado: 'O número de cilindros que podem compor uma carreira em um motor radial é:',
    opcoes: [
      { id: 'A', texto: 'Apenas 5 ou 7.', correta: false },
      { id: 'B', texto: 'Apenas 9.', correta: false },
      { id: 'C', texto: '3, 5, 7 ou 9.', correta: true },
      { id: 'D', texto: 'Sempre ímpar, podendo ser 1, 3, 5, 7 ou 9.', correta: false }
    ],
    explicacao: 'Uma carreira de motor radial pode ter 3, 5, 7 ou 9 cilindros.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'cilindros_por_carreira_radial',
    nivel: 'facil',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-023',
    enunciado: 'A faixa de potência dos motores radiais, conforme a apostila, varia de:',
    opcoes: [
      { id: 'A', texto: '50 a 500 HP.', correta: false },
      { id: 'B', texto: '100 a 3.800 HP.', correta: true },
      { id: 'C', texto: '500 a 2.000 HP.', correta: false },
      { id: 'D', texto: '1.000 a 5.000 HP.', correta: false }
    ],
    explicacao: 'A apostila indica faixa de potencia entre 100 e 3800 cavalos-forca para motores radiais.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'faixa_potencia_motores_radiais',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 5)'
  },
  {
    id: 'gmp1-tcma-024',
    enunciado: 'Em motores radiais de duas carreiras, como o Wright R-3350, o cárter é composto por:',
    opcoes: [
      { id: 'A', texto: 'Seção única fundida.', correta: false },
      { id: 'B', texto: 'Seção frontal, quatro seções principais e seção traseira.', correta: true },
      { id: 'C', texto: 'Apenas seção dianteira e traseira.', correta: false },
      { id: 'D', texto: 'Seções unidas por solda.', correta: false }
    ],
    explicacao: 'No exemplo do Wright R-3350, o carter inclui secao frontal, quatro secoes principais e secao traseira.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'carter_radial_duas_carreiras',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 6-7)'
  },
  {
    id: 'gmp1-tcma-025',
    enunciado: 'O eixo de manivelas de um motor radial de uma só carreira de cilindros é do tipo:',
    opcoes: [
      { id: 'A', texto: 'Dupla manivela (180º).', correta: false },
      { id: 'B', texto: 'Manivela única (360º).', correta: true },
      { id: 'C', texto: 'Tripla manivela (120º).', correta: false },
      { id: 'D', texto: 'Quadrupla manivela (90º).', correta: false }
    ],
    explicacao: 'Em radial de uma carreira, o eixo de manivelas utilizado e o de manivela unica, de 360 graus.',
    modulo: 'GMP1',
    materia: 'teoria_e_construcao_de_motores_de_aeronaves',
    topico: 'eixo_motores_radiais',
    nivel: 'medio',
    referencia: 'Apostila - Teoria e Construcao de Motores de Aeronaves (p. 11)'
  },
  {
    id: 'gmp1-sae-001',
    enunciado: 'No sistema de admissao, o principal objetivo do filtro de ar e:',
    opcoes: [
      { id: 'A', texto: 'Aumentar a temperatura do ar admitido', correta: false },
      { id: 'B', texto: 'Reter impurezas antes da entrada no motor', correta: true },
      { id: 'C', texto: 'Controlar o tempo de ignicao das velas', correta: false },
      { id: 'D', texto: 'Regular a pressao do oleo lubrificante', correta: false }
    ],
    explicacao: 'O filtro de ar impede a entrada de particulas que causam desgaste prematuro no motor.',
    modulo: 'GMP1',
    materia: 'sistemas_de_admissao_e_de_escapamento',
    topico: 'filtro_de_ar',
    nivel: 'facil',
    referencia: 'ANAC - Sistemas de Motor'
  },
  {
    id: 'gmp1-sae-002',
    enunciado: 'A principal funcao do coletor de admissao em motor alternativo e:',
    opcoes: [
      { id: 'A', texto: 'Conduzir e distribuir a mistura/ar para os cilindros', correta: true },
      { id: 'B', texto: 'Expulsar gases queimados para fora da aeronave', correta: false },
      { id: 'C', texto: 'Pressurizar o sistema de oleo do motor', correta: false },
      { id: 'D', texto: 'Acionar mecanicamente as valvulas de escape', correta: false }
    ],
    explicacao: 'O coletor de admissao distribui uniformemente o fluxo para os cilindros.',
    modulo: 'GMP1',
    materia: 'sistemas_de_admissao_e_de_escapamento',
    topico: 'coletor_de_admissao',
    nivel: 'medio',
    referencia: 'Fundamentos de Motores Aeronauticos'
  },
  {
    id: 'gmp1-sae-003',
    enunciado: 'No sistema de escapamento, uma funcao importante do silencioso e:',
    opcoes: [
      { id: 'A', texto: 'Aumentar a octanagem do combustivel', correta: false },
      { id: 'B', texto: 'Reduzir o ruido dos gases de escape', correta: true },
      { id: 'C', texto: 'Controlar a mistura ar-combustivel na admissao', correta: false },
      { id: 'D', texto: 'Substituir o sistema de ignicao magneto', correta: false }
    ],
    explicacao: 'O silencioso atenua o ruido gerado pela expulsao dos gases do motor.',
    modulo: 'GMP1',
    materia: 'sistemas_de_admissao_e_de_escapamento',
    topico: 'silencioso_de_escape',
    nivel: 'facil',
    referencia: 'Sistemas de Escapamento - Manual Basico'
  },
  {
    id: 'gmp1-sae-004',
    enunciado: 'Um vazamento no coletor de escapamento pode resultar principalmente em:',
    opcoes: [
      { id: 'A', texto: 'Melhora da eficiencia volumetrica do motor', correta: false },
      { id: 'B', texto: 'Maior vida util das valvulas de escape', correta: false },
      { id: 'C', texto: 'Risco de gases quentes e monoxido em areas indevidas', correta: true },
      { id: 'D', texto: 'Reducao da temperatura dos gases na saida', correta: false }
    ],
    explicacao: 'Falhas no escapamento podem direcionar gases quentes/toxicos para compartimentos sensiveis.',
    modulo: 'GMP1',
    materia: 'sistemas_de_admissao_e_de_escapamento',
    topico: 'seguranca_no_escapamento',
    nivel: 'medio',
    referencia: 'Seguranca de Sistemas de Motor'
  },
  {
    id: 'gmp1-scmmc-001',
    enunciado: 'A funcao principal da bomba de combustivel em motores alternativos e:',
    opcoes: [
      { id: 'A', texto: 'Resfriar o sistema de escapamento', correta: false },
      { id: 'B', texto: 'Enviar combustivel com pressao/fluxo adequado ao sistema de alimentacao', correta: true },
      { id: 'C', texto: 'Controlar o tempo de abertura das valvulas', correta: false },
      { id: 'D', texto: 'Aumentar a taxa de compressao do motor', correta: false }
    ],
    explicacao: 'A bomba garante suprimento continuo de combustivel nas condicoes operacionais exigidas.',
    modulo: 'GMP1',
    materia: 'sistemas_de_combustivel_do_motor_e_medicao_do_combustivel',
    topico: 'bomba_de_combustivel',
    nivel: 'facil',
    referencia: 'ANAC - Sistemas de Combustivel'
  },
  {
    id: 'gmp1-scmmc-002',
    enunciado: 'No sistema de medicao de combustivel, um erro comum de indicacao pode ser causado por:',
    opcoes: [
      { id: 'A', texto: 'Desgaste de velas de ignicao', correta: false },
      { id: 'B', texto: 'Falha no sensor/transmissor de nivel', correta: true },
      { id: 'C', texto: 'Obstrucao no sistema de escapamento', correta: false },
      { id: 'D', texto: 'Baixa compressao em cilindros', correta: false }
    ],
    explicacao: 'A indicacao depende do conjunto sensor/transmissor e do indicador no painel.',
    modulo: 'GMP1',
    materia: 'sistemas_de_combustivel_do_motor_e_medicao_do_combustivel',
    topico: 'indicacao_de_nivel',
    nivel: 'medio',
    referencia: 'Instrumentacao de Sistemas de Combustivel'
  },
  {
    id: 'gmp1-scmmc-003',
    enunciado: 'A valvula seletora de combustivel permite principalmente:',
    opcoes: [
      { id: 'A', texto: 'Selecionar tanque e/ou interromper o fluxo de combustivel', correta: true },
      { id: 'B', texto: 'Regular automaticamente a mistura ar-combustivel', correta: false },
      { id: 'C', texto: 'Aumentar a pressao de oleo do motor', correta: false },
      { id: 'D', texto: 'Controlar a temperatura dos gases de escape', correta: false }
    ],
    explicacao: 'A seletora define a origem do combustivel e pode cortar o suprimento conforme projeto.',
    modulo: 'GMP1',
    materia: 'sistemas_de_combustivel_do_motor_e_medicao_do_combustivel',
    topico: 'valvula_seletora',
    nivel: 'facil',
    referencia: 'Manual de Sistemas de Combustivel'
  },
  {
    id: 'gmp1-scmmc-004',
    enunciado: 'A presenca de agua no combustivel representa risco porque pode:',
    opcoes: [
      { id: 'A', texto: 'Aumentar o poder calorifico do combustivel', correta: false },
      { id: 'B', texto: 'Melhorar a atomizacao em todas as condicoes', correta: false },
      { id: 'C', texto: 'Causar falhas de combustao e interrupcao de fluxo', correta: true },
      { id: 'D', texto: 'Reduzir a formacao de vapores inflamaveis', correta: false }
    ],
    explicacao: 'Contaminacao por agua pode gerar falhas de funcionamento e risco operacional.',
    modulo: 'GMP1',
    materia: 'sistemas_de_combustivel_do_motor_e_medicao_do_combustivel',
    topico: 'contaminacao_do_combustivel',
    nivel: 'medio',
    referencia: 'Boas Praticas de Manutencao de Combustivel'
  },
  // NOVA MATÉRIA: GMP 1 REVISÕES
  {
    id: 'gmp1-rev-001',
    enunciado: 'Qual unidade do carburador de injeção de pressão que incorpora borboleta, Venturi principal e de apoio e tubos de impacto?',
    opcoes: [
      { id: 'A', texto: 'unidade reguladora' },
      { id: 'B', texto: 'controle automático de mistura' },
      { id: 'C', texto: 'corpo do acelerador' },
      { id: 'D', texto: 'unidade de controle de combustível' }
    ],
    correta: 'C',
    explicacao: 'A unidade do carburador de injeção de pressão que incorpora a borboleta, Venturi principal e de apoio, e tubos de impacto é o corpo do acelerador. O corpo do acelerador é responsável por controlar o fluxo de ar para o motor, regulando assim a velocidade e potência do motor.',
    modulo: 'GMP1',
    materia: 'revisoes',
    topico: 'sistema_de_combustivel',
    nivel: 'medio',
    referencia: 'Sistemas de Motores Aeronáuticos - Capítulo 5'
  },
  {
    id: 'gmp1-rev-002',
  enunciado: 'O aumento da cilindrada pode ser conseguido com:',
  opcoes: [
    { id: 'A', texto: 'O aumento do curso' },
    { id: 'B', texto: 'A redução do diâmetro do cilindro' },
    { id: 'C', texto: 'A redução do número de cilindros' },
    { id: 'D', texto: 'Todas as acima' }
  ],
  correta: 'A',
  explicacao: 'A cilindrada aumenta quando se aumenta o curso do pistão, pois aumenta o volume deslocado entre PMS e PMI.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'cilindrada',
  nivel: 'medio',
  referencia: 'Motores Aeronáuticos'
},

{
  id: 'gmp1-rev-003',
  enunciado: 'As palhetas do rotor são fixadas aos discos por raiz tipo:',
  opcoes: [
    { id: 'A', texto: 'Rebites tipo pinheiro' },
    { id: 'B', texto: 'Bulbo ou raiz tipo pinheiro' },
    { id: 'C', texto: 'Parafusos tipo bulbo' },
    { id: 'D', texto: 'Soldas tipo pinheiro' }
  ],
  correta: 'B',
  explicacao: 'As palhetas de turbina são fixadas por encaixe mecânico tipo bulbo ou pinheiro para suportar altas cargas centrífugas.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'turbinas',
  nivel: 'medio',
  referencia: 'Motores a Reação'
},

{
  id: 'gmp1-rev-004',
  enunciado: 'Denomina-se pontos mortos as posições:',
  opcoes: [
    { id: 'A', texto: 'Onde o pistão para' },
    { id: 'B', texto: 'Extremas atingidas pelo pistão em seu movimento' },
    { id: 'C', texto: 'Que o pistão atinge quando o motor para' },
    { id: 'D', texto: 'Extremas apenas no curso descendente' }
  ],
  correta: 'B',
  explicacao: 'Ponto morto superior e inferior são as posições extremas do movimento do pistão.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'mecanica_basica',
  nivel: 'facil',
  referencia: 'Fundamentos de Motores'
},

{
  id: 'gmp1-rev-005',
  enunciado: 'Quais os dois tipos básicos de sistemas de escapamento para motores convencionais?',
  opcoes: [
    { id: 'A', texto: 'Sistema aberto e sistema coletor' },
    { id: 'B', texto: 'Sistema fechado e sistema duplo' },
    { id: 'C', texto: 'Sistema aberto e sistema fechado' },
    { id: 'D', texto: 'Sistema integrado e de saída' }
  ],
  correta: 'A',
  explicacao: 'Motores convencionais utilizam escapamento aberto ou sistema coletor.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'escapamento',
  nivel: 'medio',
  referencia: 'Sistemas de Motor'
},

{
  id: 'gmp1-rev-006',
  enunciado: 'Quem controla a unidade de controle de combustível?',
  opcoes: [
    { id: 'A', texto: 'FCU' },
    { id: 'B', texto: 'Syncrophaser' },
    { id: 'C', texto: 'Coordenador' },
    { id: 'D', texto: 'Controlador de combustível' }
  ],
  correta: 'C',
  explicacao: 'O coordenador atua mecanicamente sobre o controlador de combustível regulando o funcionamento do motor.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'controle_combustivel',
  nivel: 'medio',
  referencia: 'Sistema de Combustível'
},

{
  id: 'gmp1-rev-007',
  enunciado: 'Com o motor em rotação constante, o torque da hélice será:',
  opcoes: [
    { id: 'A', texto: 'Maior que o torque do motor' },
    { id: 'B', texto: 'Igual e de sentido contrário ao torque do motor' },
    { id: 'C', texto: 'Menor que o torque do motor' },
    { id: 'D', texto: 'Igual e de mesmo sentido' }
  ],
  correta: 'B',
  explicacao: 'Em equilíbrio dinâmico, o torque da hélice é igual em módulo e oposto ao torque do motor.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'helices',
  nivel: 'medio',
  referencia: 'Princípios de Funcionamento'
},

{
  id: 'gmp1-rev-008',
  enunciado: 'A corrente que o condensador primário absorve durante a abertura dos platinados vai para a massa quando:',
  opcoes: [
    { id: 'A', texto: 'A chave é desligada' },
    { id: 'B', texto: 'Os platinados fecham' },
    { id: 'C', texto: 'Os platinados abrem novamente' },
    { id: 'D', texto: 'A centelha ocorre' }
  ],
  correta: 'B',
  explicacao: 'O condensador descarrega quando os platinados fecham evitando arco elétrico nos contatos.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'ignicao',
  nivel: 'medio',
  referencia: 'Sistema de Ignição'
  },
{
  id: 'gmp1-rev-009',
  enunciado: 'Baixar a velocidade do ar axialmente na camara de combustao evitando que a chama se propague muito rapido e funcao das:',
  opcoes: [
    { id: 'A', texto: 'Aletas difusoras' },
    { id: 'B', texto: 'Aletas redutoras' },
    { id: 'C', texto: 'Aletas convergentes' },
    { id: 'D', texto: 'Aletas de turbilhonamento' }
  ],
  correta: 'D',
  explicacao: 'As aletas de turbilhonamento baixam a velocidade axial do ar na camara de combustao, evitam propagacao muito rapida da chama e aumentam a turbulencia para melhorar a mistura ar-combustivel.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'camara_de_combustao',
  nivel: 'medio',
  referencia: 'Revisoes GMP1'
},

{
  id: 'gmp1-rev-010',
  enunciado: 'Ciclo de motor termico e:',
  opcoes: [
    { id: 'A', texto: 'De quatro tempos' },
    { id: 'B', texto: 'De 360 graus de rotacao do eixo de manivelas' },
    { id: 'C', texto: 'Uma volta do eixo de manivelas' },
    { id: 'D', texto: 'O conjunto dos tempos de admissao, compressao, potencia e escape' }
  ],
  correta: 'D',
  explicacao: 'O ciclo do motor termico e o conjunto dos tempos de admissao, compressao, potencia e escape durante o funcionamento.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'ciclo_termico',
  nivel: 'facil',
  referencia: 'Revisoes GMP1'
},

{
  id: 'gmp1-rev-011',
  enunciado: 'Um motor tem avanco de abertura de admissao de 17 graus e atraso no fechamento de escapamento de 20 graus. O cruzamento de valvulas ocorre quando o eixo de manivelas descreve um angulo de:',
  opcoes: [
    { id: 'A', texto: '20 graus' },
    { id: 'B', texto: '30 graus' },
    { id: 'C', texto: '17 graus' },
    { id: 'D', texto: '37 graus' }
  ],
  correta: 'D',
  explicacao: 'O cruzamento de valvulas corresponde a soma do avanco de abertura da admissao com o atraso de fechamento do escapamento: 17 + 20 = 37 graus.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'cruzamento_de_valvulas',
  nivel: 'medio',
  referencia: 'Revisoes GMP1'
},

{
  id: 'gmp1-rev-012',
  enunciado: 'Quais os principais componentes do sistema de admissao de um motor convencional tipico?',
  opcoes: [
    { id: 'A', texto: 'Valvula de ar de entrada, coletor de admissao e coletor de escalpamento' },
    { id: 'B', texto: 'Carburador, tomada de ar e tubulacao de admissao' },
    { id: 'C', texto: 'Sistema indicador de temperatura, pressao e fluxo' },
    { id: 'D', texto: 'Um carburador, uma tomada de ar e uma tubulacao de admissao e escapamento' }
  ],
  correta: 'B',
  explicacao: 'Os principais componentes sao carburador, tomada de ar e tubulacao de admissao, que conduzem o ar e a mistura ar-combustivel aos cilindros.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'sistema_de_admissao',
  nivel: 'medio',
  referencia: 'Revisoes GMP1'
},

{
  id: 'gmp1-rev-013',
  enunciado: 'Como sao operadas as aletas do intensificador dos escapamentos de um motor convencional?',
  opcoes: [
    { id: 'A', texto: 'Atraves de molas' },
    { id: 'B', texto: 'Atraves da pressao de ar' },
    { id: 'C', texto: 'Atraves de cabos de comando' },
    { id: 'D', texto: 'Atraves de um atuador eletrico' }
  ],
  correta: 'D',
  explicacao: 'As aletas do intensificador dos escapamentos sao operadas por um atuador eletrico, que controla suas posicoes de abertura e fechamento.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'escapamento_convencional',
  nivel: 'medio',
  referencia: 'Revisoes GMP1'
},

{
  id: 'gmp1-rev-014',
  enunciado: 'O que controla a entrada de ar nos motores alternativos?',
  opcoes: [
    { id: 'A', texto: 'Carburador' },
    { id: 'B', texto: 'Difusor' },
    { id: 'C', texto: 'Unidade de controle' },
    { id: 'D', texto: 'Valvula de admissao' }
  ],
  correta: 'A',
  explicacao: 'O carburador controla a entrada de ar nos motores alternativos e realiza a dosagem da mistura conforme a fase operacional.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'carburacao',
  nivel: 'facil',
  referencia: 'Revisoes GMP1'
},

{
  id: 'gmp1-rev-015',
  enunciado: 'Um turbosuperalimentador tipico e composto de tres partes principais:',
  opcoes: [
    { id: 'A', texto: 'Conjunto compressor, conjunto de turbina a gas e impulsor' },
    { id: 'B', texto: 'Compressor do impulsor e difusor, carcaca da bomba e rolamentos' },
    { id: 'C', texto: 'Resfriador interno do compressor, carcaca da bomba e conjunto de turbina a gas' },
    { id: 'D', texto: 'Conjunto de turbina de gas, conjunto do compressor e carcaca da bomba e rolamentos' }
  ],
  correta: 'D',
  explicacao: 'As tres partes principais sao conjunto de turbina de gas, conjunto do compressor e carcaca da bomba com rolamentos.',
  modulo: 'GMP1',
  materia: 'revisoes',
  topico: 'turbosuperalimentador',
  nivel: 'medio',
  referencia: 'Revisoes GMP1'
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

function obterOpcaoCorreta(pergunta) {
  const corretaTopo = normalizeOptionId(pergunta?.correta);
  if (corretaTopo) return corretaTopo;

  const opcoes = Array.isArray(pergunta?.opcoes) ? pergunta.opcoes : [];
  const opcaoCorreta = opcoes.find((opcao) => opcao && opcao.correta === true);
  return normalizeOptionId(opcaoCorreta?.id);
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
  const normalized = normalizeOptionId(optionId);
  return pergunta.opcoes.find((o) => normalizeOptionId(o.id) === normalized)?.texto || null;
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

    const correta = obterOpcaoCorreta(pergunta);
    if (!correta) {
      return res.status(500).json({ error: 'Pergunta sem alternativa correta configurada' });
    }

    const acertou = marcada === correta;

    return res.json({
      acertou,
      opcao_marcada: marcada,
      opcao_correta: correta,
      resposta_correta: textoOpcao(pergunta, correta),
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
    const answerKeyEntries = selecionadas.map((q) => [q.id, obterOpcaoCorreta(q)]);
    if (answerKeyEntries.some(([, correta]) => !correta)) {
      return res.status(500).json({ error: 'Banco de perguntas contem item sem alternativa correta configurada' });
    }
    const answerKey = Object.fromEntries(answerKeyEntries);

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
