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
  {
    id: 2,
    pergunta: "A reatância indutiva é indicada em:",
    opcao_correta: "Ohms",
    opcao_errada: "Fárad",
    explicacao: "A reatância indutiva é uma medida da oposição ao fluxo de corrente em circuitos de corrente alternada (CA) oferecida por indutores (bobinas). Sua unidade de medida é o Ohm (Ω).",
    materia: "eletrica",
  },
  {
    id: 3,
    pergunta: "Quando um condutor é movido em um campo magnético, uma força eletromotriz é induzida no condutor, e sua direção pode ser determinada pela regra da mão esquerda do gerador, onde o polegar:",
    opcao_correta: "é apontado na direção de movimento do condutor através do campo",
    opcao_errada: "é apontado na direção das linhas de força magnética (norte ou sul)",
    explicacao: "Na regra da mão esquerda do gerador:",
    materia: "eletrica",
  },
  {
    id: 4,
    pergunta: "O dispositivo usado em alguns sistemas do avião com a finalidade de converter corrente contínua em alternada, denomina-se:",
    opcao_correta: "inversor",
    opcao_errada: "alternador",
    explicacao: "Um inversor é um dispositivo que converte corrente contínua (CC) em corrente alternada (CA). Em aeronaves, ele é usado para fornecer energia CA para sistemas essenciais quando os geradores CA principais falham, ou em aeronaves menores que utilizam sistemas CC como fonte primária.",
    materia: "eletrica",
  },
  {
    id: 5,
    pergunta: "Dentre os materiais abaixo, aquele que é utilizado para isolar equipamentos elétricos e eletrônicos é o(a):",
    opcao_correta: "borracha sintética",
    opcao_errada: "fibra de vidro",
    explicacao: "A borracha sintética é um material isolante elétrico comumente usado para revestir e proteger equipamentos. Ela evita a passagem de corrente, além de fornecer proteção contra umidade, vibrações e impactos.",
    materia: "eletrica",
  },
  {
    id: 6,
    pergunta: "Em um circuito em série, se houver uma queda de tensão, é correto afirmar que?",
    opcao_correta: "haverá uma queda de potência no circuito",
    opcao_errada: "haverá uma diminuição da resistência",
    explicacao: "Em um circuito em série, a corrente é constante.",
    materia: "eletrica",
  },
  {
    id: 7,
    pergunta: "Num circuito elétrico, se for necessário variar a quantidade de corrente fluindo num circuito, utiliza-se o equipamento denominado:",
    opcao_correta: "reostato",
    opcao_errada: "relé",
    explicacao: "Um reostato é um resistor variável de dois terminais. Ao ajustar sua resistência (movendo um braço de contato), controla-se a quantidade de corrente que flui no circuito, conforme a Lei de Ohm.",
    materia: "eletrica",
  },
  {
    id: 8,
    pergunta: "Um corpo carregado é dito ter:",
    opcao_correta: "excesso ou deficiência de elétrons",
    opcao_errada: "excesso ou deficiência de prótons",
    explicacao: "Um corpo fica carregado eletricamente quando há um desequilíbrio entre prótons (carga positiva) e elétrons (carga negativa). Um excesso de elétrons resulta em carga negativa, e uma deficiência de elétrons (ou excesso de prótons) resulta em carga positiva.",
    materia: "eletrica",
 },
 {
    id: 9,
    pergunta: "A condição de carga de uma bateria de chumbo-ácido é indicada pelo eletrólito, que é verificada pelo uso de um:",
    opcao_correta: "densímetro",
    opcao_errada: "tensiômetro",
    explicacao: "A densidade do eletrólito (solução de ácido sulfúrico e água) muda com o estado de carga da bateria. Um densímetro mede essa densidade: quanto maior a densidade, maior o estado de carga.",
    materia: "eletrica",
 },
 {
    id: 10,
    pergunta: "Numa bateria nova de chumbo-ácido, totalmente carregada o eletrólito é de aproximadamente:",
    opcao_correta: "30% de ácido e 70% de água",
    opcao_errada: "70% de ácido e 30% de água",
    explicacao: "Em uma bateria de chumbo-ácido nova e totalmente carregada, a proporção ideal do eletrólito é de aproximadamente 30% de ácido sulfúrico e 70% de água destilada.",
    materia: "eletrica",
 },
 {
    id: 11,
    pergunta: "Considerando um circuito elétrico com duas resistências em série medindo 4 e 6 ohm e uma tensão total de 15 volt, a amperagem total do circuito será?",
    opcao_correta: "1,5 A",
    opcao_errada: "2,5 A",
    explicacao: "Em uma bateria de chumbo-ácido nova e totalmente carregada, a proporção ideal do eletrólito é de aproximadamente 30% de ácido sulfúrico e 70% de água destilada.",
    materia: "eletrica",
 },
 {
    id: 12,
    pergunta: "Equipamento que modifica o nível de voltagem, aumentando-o ou diminuindo-o como necessário, ele consiste em duas bobinas eletricamente independentes, que são dispostas de tal forma que o campo magnético em torno de uma das bobinas atravessa também a outra bobina:",
    opcao_correta: "Transformadores",
    opcao_errada: "Inversor",
    explicacao: "Em uma bateria de chumbo-ácido nova e totalmente carregada, a proporção ideal do eletrólito é de aproximadamente 30% de ácido sulfúrico e 70% de água destilada.",
    materia: "eletrica",
 },
 {
    id: 13,
    pergunta: "Em que tipo de circuito é usado o resistor a fio?",
    opcao_correta: "alta amperagem",
    opcao_errada: "alta resistência",
    explicacao: "Resistores a fio são construídos com fios de liga metálica de baixa resistividade e grande seção transversal, permitindo que dissipem muito calor. Isso os torna ideais para circuitos que conduzem correntes elevadas (alta amperagem).",
    materia: "eletrica",
 },
 {
    id: 14,
    pergunta: "Quando ocorrem alterações no fluxo magnético das linhas de força, diz-se que ocorreu:",
    opcao_correta: "absorção",
    opcao_errada: "retração",
    explicacao: "O texto de referência (Eletricidade Básica, Pg. 35) indica que há um limite para o número de linhas de força de um ímã. Alterações nesse fluxo são descritas como \"absorção\", referindo-se à capacidade de um material ser magnetizado até um ponto de saturação.",
    materia: "eletrica",
 },
 {
    id: 15,
    pergunta: "Considera-se uma substância como condutora quando:",
    opcao_correta: "não retém os elétrons com facilidade",
    opcao_errada: "possui um equilíbrio atômico",
    explicacao: "Materiais condutores, como os metais, possuem elétrons livres na camada de valência que não estão fortemente ligados ao núcleo atômico. Essa facilidade de movimento dos elétrons é o que permite a condução da corrente elétrica.",
    materia: "eletrica",
 },
 {
    id: 16,
    pergunta: "Para induzir uma voltagem através de um solenoide é necessário:",
    opcao_correta: "uma variação do campo que corta a bobina",
    opcao_errada: "que o campo não sofra variações",
    explicacao: "De acordo com a Lei da Indução de Faraday, uma tensão (voltagem) é induzida em uma bobina sempre que há uma variação do fluxo magnético que a atravessa. Um campo magnético constante não induz tensão.",
    materia: "eletrica",
 },
 {
    id: 17,
    pergunta: "A tensão no secundário de um transformador é de 240 V, tendo-se 250 espiras no seu enrolamento primário e 500 espiras no secundário. A tensão aplicada no primário será de:",
    opcao_correta: "120 V",
    opcao_errada: "125 V",
    explicacao: "A relação de transformação é dada por: Vp/Vs = Np/Ns. Substituindo os valores: Vp/240 = 250/500. Resolvendo para Vp, temos Vp = (250/500) * 240 = 120 V.",
    materia: "eletrica",
 },
 {    
    id: 18,
    pergunta: "Em um circuito série-paralolo, quando a voltagem é mantida constante e a resistência de qualquer resistor for aumentada, a corrente:",
    opcao_correta: "diminuirá",
    opcao_errada: "aumentará",
    explicacao: "Pela Lei de Ohm (V = IR), se a voltagem (V) é constante e a resistência (R) aumenta, a corrente (I) deve diminuir para manter a igualdade.",
    materia: "eletrica",
 },
 {
    id: 19,
    pergunta: "É muito difícil fabricar um resistor com exato padrão de valor ôhmico. Para muitas aplicações os valores de resistência em ohms podem variar:",
    opcao_correta: "20% acima ou abaixo do valor indicado",
    opcao_errada: "10% acima ou abaixo do valor indicado",
    explicacao: "Resistores comuns possuem uma tolerância de fabricação. A afirmação se refere a resistores de baixa precisão, onde uma variação de até ±20% em relação ao valor nominal (indicado) é considerada aceitável para diversas aplicações não críticas.",
    materia: "eletrica",
 },
 {
    id: 20,
    pergunta: "Em um circuito em série, sendo a voltagem (tensão) da bateria 24 volts e tendo as três resistências os valores de 3 ohms, 4 ohms e 5 ohms, a corrente no circuito será de:",
    opcao_correta:"2,0 ampéres",
    opcao_errada:"1,0 ampére",
    explicacao: "Resistência total em série: Rt = R1 + R2 + R3 = 3 + 4 + 5 = 12 ohms. Pela Lei de Ohm: I = V / R = 24 V / 12 ohms = 2,0 A.",
    materia: "eletrica",
 },
 {
 id: 21,
    pergunta: "Qual é a importância da precisão vocabular em um texto?",
    opcao_correta: "Evitar ambiguidades e garantir a clareza da mensagem.",
    opcao_errada: "Demonstrar erudição e conhecimento amplo do vocabulário.",
    explicacao: "A precisão vocabular é crucial para evitar ambiguidades e garantir a clareza da mensagem. Quando utilizamos as palavras corretas e de forma exata, conseguimos transmitir nossas ideias de maneira objetiva, sem deixar margem para interpretações equivocadas. Isso é essencial em textos formais, onde a clareza e a compreensão são fundamentais para evitar mal-entendidos e transmitir ideias com eficiência.",
    materia: "comunicacao"
  },
  {
    id: 22,
    pergunta: "Qual das alternativas abaixo não é um elemento importante para garantir a coerência textual?",
    opcao_correta: "Utilização de termos técnicos e jargões.",
    opcao_errada: "Clareza e objetividade na exposição das informações.",
    explicacao: "A utilização de termos técnicos e jargões NÃO é um elemento importante para garantir a coerência textual. Embora possa ser útil em contextos específicos, seu uso excessivo pode dificultar a compreensão, especialmente se o leitor não estiver familiarizado com esses termos. Os elementos essenciais para a coerência são: sequência lógica das ideias, coesão entre frases e parágrafos, e clareza e objetividade na exposição das informações.",
    materia: "comunicacao"
  },
  {
    id: 23,
    pergunta: "O que a coerência textual garante em um texto?",
    opcao_correta: "A conexão lógica entre as partes do texto.",
    opcao_errada: "A objetividade na exposição das ideias.",
    explicacao: "A coerência textual garante a conexão lógica entre as diferentes partes de um texto, assegurando que as informações apresentadas sejam consistentes e façam sentido para o leitor. É ela que permite a compreensão global do texto e a transmissão eficaz das ideias do autor, organizando as informações de maneira ordenada e lógica.",
    materia: "comunicacao"
  },
  {
    id: 24,
    pergunta: "Qualidade de estruturação de texto que permitem uma conexão lógico-semântica entre as partes de um texto. A ligação e harmonia que possibilitam a amarração de ideias dentro de um texto, garante que o texto seja harmonioso, que transmita a mensagem com clareza e que faça sentido para o leitor:",
    opcao_correta: "Coesão.",
    opcao_errada: "Objetividade.",
    explicacao: "A qualidade descrita é a Coesão. Ela é responsável por unir os elementos textuais e gramaticais (como conectivos, pronomes e repetições) para garantir uma sequência lógica e harmoniosa. A coesão costura o texto, ligando palavras, frases e parágrafos, o que é fundamental para guiar o leitor com fluidez e garantir uma compreensão sem obstáculos.",
    materia: "comunicacao"
  },
  {
    id: 25,
    pergunta: "Em vícios de linguagem, qual das seguintes frases se refere a um texto prolixo?",
    opcao_correta: "A empresa de manutenção de aeronaves se destaca por sua especialização em realizar minuciosos procedimentos de manutenção, tendo como objetivo principal assegurar a conformidade com os rigorosos padrões de segurança estabelecidos pelas autoridades reguladoras, garantindo, assim, a integridade estrutural das aeronaves, bem como a segurança dos passageiros e tripulantes.",
    opcao_errada: "A empresa de manutenção de aeronaves realiza um trabalho minucioso para manter a segurança das aeronaves.",
    explicacao: "A frase extensa e detalhada é um exemplo claro de prolixidade. Este vício de linguagem é caracterizado pelo uso excessivo de palavras, incluindo detalhes supérfluos, redundâncias e uma estrutura sintática complexa. O resultado é um texto cansativo e complicado, que viola os princípios de clareza e concisão. A mensagem poderia ser transmitida de forma muito mais simples e direta.",
    materia: "comunicacao"
  },
  {
    id: 26,
    pergunta: "Na comunicação estão relacionadas à organização do texto e como que as ideias presentes no documento se interligam, ou seja, elas permitem que seja realizada a conexão dos elementos do texto de maneira harmoniosa, de modo que as frases e parágrafos estejam totalmente entrelaçados, dando continuidade uns aos outros:",
    opcao_correta: "Coesão.",
    opcao_errada: "Concisão.",
    explicacao: "O elemento descrito é a Coesão. Ela se relaciona diretamente com a organização do texto e a interligação harmoniosa das ideias. Através de mecanismos linguísticos, a coesão realiza a conexão dos elementos do texto, entrelaçando frases e parágrafos para dar continuidade e fluência à leitura.",
    materia: "comunicacao"
  },
  {
    id: 27,
    pergunta: "A qualidade de estruturação de texto que descreve o encadeamento lógico das ideias e a escolha adequada de palavras para construí-lo é a:",
    opcao_correta: "Coerência textual.",
    opcao_errada: "Coesão textual.",
    explicacao: "A qualidade descrita é a Coerência Textual. Ela se refere ao encadeamento lógico das ideias e à escolha adequada de palavras para construir um texto que faça sentido. Diferente da coesão (que costura os elementos), a coerência curada da lógica e do significado global, garantindo que o texto seja compreensível em sua totalidade.",
    materia: "comunicacao"
  },
  {
    id: 28,
    pergunta: "O que a falta de coesão pode causar em um texto?",
    opcao_correta: "Confusão e dificuldade de compreensão.",
    opcao_errada: "Aumento da objetividade do texto.",
    explicacao: "A falta de coesão pode causar confusão e dificuldade de compreensão. Sem os elementos de ligação adequados (como conectivos e referências claras), o texto se torna fragmentado, quebrando a sequência lógica de ideias. Isso impede que o leitor acompanhe a narrativa ou o raciocínio de maneira fluente, podendo levar a interpretações equivocadas.",
    materia: "comunicacao"
  },
  {
    id: 29,
    pergunta: "A frase: 'A empresa de manutenção aérea tem como principal missão a realização de procedimentos minuciosos em aeronaves visando garantir a segurança e conformidade com normas de segurança rigorosas' exemplifica qual vício de linguagem ou problema de estilo na escrita?",
    opcao_correta: "Prolixidade.",
    opcao_errada: "Barbarismo.",
    explicacao: "A frase exemplifica prolixidade. Ela apresenta vários elementos característicos: circunlóquios (rodeios como \"tem como principal missão\"), redundância (repetição da palavra segurança), uso de substantivos em vez de verbos (realização de procedimentos) e uma estrutura sintática complexa e longa. Uma versão concisa transmitiria a mesma informação com mais clareza e diretividade.",
    materia: "comunicacao"
  },
  {
    id: 30,
    pergunta: "'O guarda deteve o suspeito em sua casa.' Esta frase é um exemplo de:",
    opcao_correta: "Ambiguidade.",
    opcao_errada: "Concisão.",
    explicacao: "A frase \"O guarda deteve o suspeito em sua casa\" é um exemplo de ambiguidade. O pronome possessivo \"sua\" pode ser interpretado como referente ao guarda ou ao suspeito, gerando duas leituras possíveis e distintas. Essa falta de clareza sobre a quem pertence a casa dificulta a compreensão precisa do contexto e é um problema a ser evitado na comunicação.",
    materia: "comunicacao"
  },
  {
    id: 31,
    pergunta: "Na frase 'Verifique por cada parafuso antes de apertar, garantindo que nenhum esteja solto', é empregado qual vício de linguagem?",
    opcao_correta: "Cacofonia.",
    opcao_errada: "Pleonasmo.",
    explicacao: "A expressão \"por cada\" na frase constitui uma cacofonia. Este vício ocorre quando a junção de sons de palavras próximas forma um outro termo, muitas vezes desagradável ou de sentido inadequado. Neste caso, \"por cada\" soa como \"porca\", que é um termo técnico (um tipo de peça) mas que, neste contexto, cria um ruído sonoro e desvia a atenção do sentido original da mensagem.",
    materia: "comunicacao"
  },
  {
    id: 32,
    pergunta: "Qual das alternativas abaixo é um exemplo de estratégia para garantir a coerência textual?",
    opcao_correta: "Ignorar as informações irrelevantes para o tema central do texto.",
    opcao_errada: "Inserir informações aleatórias que não têm relação com o assunto abordado.",
    explicacao: "A estratégia correta é ignorar as informações irrelevantes para o tema central. A coerência textual depende da pertinência e da conexão lógica de todas as informações apresentadas. Manter o foco no assunto principal, eliminando digressões e dados aleatórios, é fundamental para construir um texto coeso, onde todas as partes contribuem para um mesmo sentido global.",
    materia: "comunicacao"
  },
  {
    id: 33,
    pergunta: "Na frase: 'Na revisão, a omissão gera tensão e preocupação'. Qual figura de linguagem é apresentada?",
    opcao_correta: "Eco.",
    opcao_errada: "Rima.",
    explicacao: "A frase apresenta a figura de linguagem chamada Eco. O eco consiste na repetição intencional de terminações sonoras semelhantes em palavras próximas dentro de uma mesma frase ou período. No exemplo, a repetição da terminação \"-ão\" em \"revisão\", \"omissão\", \"tensão\" e \"preocupação\" cria um efeito sonoro característico, que lembra um eco.",
    materia: "comunicacao"
  },
  {
    id: 34,
    pergunta: "O que significa dizer que um texto é coerente?",
    opcao_correta: "O texto apresenta uma relação lógica e consistente entre suas ideias.",
    opcao_errada: "O texto possui palavras difíceis de compreender.",
    explicacao: "Dizer que um texto é coerente significa que ele apresenta uma relação lógica e consistente entre suas ideias. Um texto coerente não contém contradições internas, suas partes estão bem articuladas em torno de um tema central e a progressão das informações faz sentido, permitindo que o leitor compreenda a mensagem de forma clara e completa.",
    materia: "comunicacao"
  },
  {
    id: 35,
    pergunta: "Se refere à habilidade do autor em transmitir informações de forma eficiente, sem comprometer a clareza e a precisão do texto. Isso envolve escolher palavras que transmitam o máximo de informação possível com o menor número de palavras e evitar redundâncias ou informações irrelevantes:",
    opcao_correta: "Concisão.",
    opcao_errada: "Clareza.",
    explicacao: "A habilidade descrita é a Concisão. Ela consiste em expressar ideias de forma completa utilizando o mínimo necessário de palavras, eliminando redundâncias, explicações desnecessárias e rodeios. Um texto conciso vai direto ao ponto, respeitando o tempo e a atenção do leitor, sem sacrificar a clareza ou a informação essencial.",
    materia: "comunicacao"
  },
  {
    id: 36,
    pergunta: "Qual alternativa apresenta um pleonasmo?",
    opcao_correta: "Para abrir a porta de emergência, levante a alavanca para cima.",
    opcao_errada: "O mecânico seguiu rigorosamente as instruções de segurança.",
    explicacao: "A frase que contém o pleonasmo é: \"Para abrir a porta de emergência, levante a alavanca para cima\". Trata-se de um pleonasmo vicioso ou redundância, pois o verbo \"levantar\" já carrega em seu significado a ideia de direção \"para cima\". A expressão \"para cima\" é, portanto, desnecessária e sobrecarrega a frase.",
    materia: "comunicacao"
  },
  {
    id: 37,
    pergunta: "Identifique a opção que apresenta uma cacofonia:",
    opcao_correta: "O inspetor te tinha perguntado se havia finalizado a tarefa.",
    opcao_errada: "Precisamos substituir o filtro de combustível antes do próximo voo.",
    explicacao: "A opção que apresenta cacofonia é: \"O inspetor te tinha perguntado se havia finalizado a tarefa\". A junção dos sons das palavras \"te\" e \"tinha\" produz a sequência \"te-ti-nha\", que soa como \"tetinha\", uma palavra de baixo calão ou coloquial. Esse som indesejado pode causar desconforto ou distração, prejudicando a seriedade e a clareza da comunicação.",
    materia: "comunicacao"
  },
  {
    id: 38,
    pergunta: "É uma qualidade de estruturação de texto que se refere à habilidade do autor em apresentar informações de forma direta e clara, sem a inclusão de opiniões ou julgamentos pessoais que possam influenciar a interpretação do leitor:",
    opcao_correta: "Objetividade.",
    opcao_errada: "Coerência.",
    explicacao: "A qualidade descrita é a Objetividade. Ela se refere à capacidade de apresentar fatos, dados e informações de forma direta, clara e imparcial, sem a interferência de sentimentos, opiniões ou julgamentos pessoais do autor. A objetividade é essencial para textos técnicos, científicos e jornalísticos, onde a neutralidade valoriza a credibilidade da informação.",
    materia: "comunicacao"
  },
  {
    id: 39,
    pergunta: "Qualidade de estruturação de texto que consiste em expressar ideias de forma que possa ser rapidamente compreendida pelo leitor. É não se contradizer, não confundir o leitor, essa habilidade refere-se a:",
    opcao_correta: "Clareza.",
    opcao_errada: "Coerência.",
    explicacao: "A qualidade é a Clareza. Um texto claro é aquele que pode ser compreendido rápida e facilmente pelo leitor. Isso é alcançado através do uso de vocabulário preciso e acessível, da construção de frases bem estruturadas, da organização lógica das ideias e, principalmente, da eliminação de ambiguidades, contradições e confusões.",
    materia: "comunicacao"
  },
  {
    id: 40,
    pergunta: "A qualidade de estruturação de texto que envolve a articulação adequada da linguagem para transmitir a ideia de forma clara e evitar ambiguidades:",
    opcao_correta: "Precisão.",
    opcao_errada: "Coesão.",
    explicacao: "A qualidade é a Precisão. Ela vai além da clareza e exige a escolha exata e meticulosa das palavras e construções frasais para transmitir exatamente a ideia pretendida, sem margem para dupla interpretação. A precisão vocabular e conceitual é fundamental em contextos onde o erro de interpretação pode ter consequências sérias, como na comunicação técnica, jurídica ou de segurança.",
    materia: "comunicacao"
  },
  {
    id: 41,
    pergunta: "Para compensar as forças que tendem a desbalancear o voo de uma aeronave, os ailerons, profundores e leme dispõem de comandos auxiliares conhecidos como:",
    opcao_correta: "compensadores",
    opcao_errada: "slotes",
    explicacao: "Compensadores são superfícies auxiliares que aliviam esforços nos comandos, permitindo equilíbrio estável sem pressão constante no manche/pedais.",
    materia: "aerodinamica"
  },
  {
    id: 42,
    pergunta: "Identifique abaixo o tipo de flape que ao mesmo que deflexiona para baixo, desliza para trás, aumentando a área da asa:",
    opcao_correta: "Fowler",
    opcao_errada: "Bipartido",
    explicacao: "Flape Fowler: movimento combinado para trás e para baixo. Aumenta tanto a curvatura quanto a área efetiva da asa, gerando maior sustentação.",
    materia: "aerodinamica"
  },
  {
    id: 43,
    pergunta: "Durante a corrida de pouso, qual é o impacto funcional imediato da atuação dos spoilers sobre o desempenho da frenagem?",
    opcao_correta: "Destruição da sustentação remanescente, permitindo maior transferência de peso para o trem de pouso e otimizando a frenagem.",
    opcao_errada: "Aumento do empuxo reverso, favorecendo a frenagem independente das condições da pista.",
    explicacao: "Spoilers 'derrubam' a aeronave no solo. Destroem a sustentação, transferindo peso para as rodas, aumentando a tração e eficiência dos freios.",
    materia: "aerodinamica"
  },
  {
    id: 44,
    pergunta: "Entre as aeronaves abaixo, em qual resposta temos somente aeródinos?",
    opcao_correta: "planador e avião",
    opcao_errada: "balão e dirigível",
    explicacao: "Aeródinos: sustentação gerada por forças aerodinâmicas (reação do ar sobre asas). Exemplos: avião, planador. Aeróstatos (balão, dirigível) usam impulsão.",
    materia: "aerodinamica"
  },
  {
    id: 45,
    pergunta: "Durante uma subida sustentada, qual é o efeito direto da aplicação de compensadores no profundor?",
    opcao_correta: "Reduz a necessidade de pressão contínua no manche, mantendo o nariz elevado na atitude desejada.",
    opcao_errada: "Compensa a perda de sustentação natural das superfícies de comando primário, evitando estol da empenagem.",
    explicacao: "Compensador (trim) do profundor alivia a pressão de comando. Permite manter uma atitude (nariz para cima) sem esforço físico constante do piloto.",
    materia: "aerodinamica"
  },
  {
    id: 46,
    pergunta: "As superfícies de comando primárias são acionadas por meio do:",
    opcao_correta: "manche e pedais da cabine",
    opcao_errada: "manche e manetes da cabine",
    explicacao: "Comandos primários: Ailerons e Profundor = Manche. Leme = Pedais. Manetes controlam potência do motor, não superfícies de voo.",
    materia: "aerodinamica"
  },
  {
    id: 47,
    pergunta: "Em uma aeronave, o ângulo agudo formado pela corda da asa e o eixo longitudinal da aeronave é chamado de:",
    opcao_correta: "ângulo de incidência",
    opcao_errada: "ângulo de ataque",
    explicacao: "Ângulo de Incidência: ângulo fixo entre a corda da asa e o eixo longitudinal da fuselagem. É uma característica construtiva da aeronave.",
    materia: "aerodinamica"
  },
  {
    id: 48,
    pergunta: "O movimento de guinada é controlado pelo(s):",
    opcao_correta: "leme",
    opcao_errada: "ailerons",
    explicacao: "Guinada: rotação em torno do eixo vertical. Controlada pelo Leme (acionado pelos pedais). Ailerons controlam rolagem (eixo longitudinal).",
    materia: "aerodinamica"
  },
  {
    id: 49,
    pergunta: "A diminuição da densidade do ar resulta em um voo de uma aeronave no(a):",
    opcao_correta: "diminuam a sustentação e o arrasto",
    opcao_errada: "aumentem a sustentação e o arrasto",
    explicacao: "A sustentação e o arrasto são proporcionais à densidade do ar. Se a densidade diminui, ambas as forças (sustentação e arrasto) também diminuem.",
    materia: "aerodinamica"
  },
  {
    id: 50,
    pergunta: "Os freios aerodinâmicos são instalados no(a):",
    opcao_correta: "asa",
    opcao_errada: "fuselagem",
    explicacao: "Freios aerodinâmicos (spoilers/speed brakes) são instalados sobre a asa. Ao se estenderem, perturbam o fluxo aerodinâmico, aumentando o arrasto e reduzindo a sustentação.",
    materia: "aerodinamica"
  },
  {
    id: 51,
    pergunta: "A potência disponível para deslocar uma aeronave, em voo nivelado, diminui com o aumento do(a):",
    opcao_correta: "altitude",
    opcao_errada: "carga alar",
    explicacao: "Em motores à pistão e a jato (abaixo da estratosfera), a potência disponível diminui com a altitude devido à redução da densidade do ar, que afeta a eficiência do motor.",
    materia: "aerodinamica"
  },
  {
    id: 52,
    pergunta: "O ângulo formado entre a corda e trajetória chama-se?",
    opcao_correta: "ângulo de ataque",
    opcao_errada: "ângulo de incidência",
    explicacao: "Ângulo de Ataque (AoA): ângulo dinâmico entre a corda do aerofólio e o vetor do vento relativo (trajetória). Fundamental para a geração de sustentação.",
    materia: "aerodinamica"
  },
  {
    id: 53,
    pergunta: "Definição de diedro é:",
    opcao_correta: "ângulo formado entre o eixo lateral e o plano da asa",
    opcao_errada: "ângulo formado entre o eixo longitudinal e a corda",
    explicacao: "Diedro: ângulo de inclinação das asas para cima em relação ao eixo lateral (transversal). Contribui para a estabilidade lateral automática.",
    materia: "aerodinamica"
  },
  {
    id: 54,
    pergunta: "Durante uma curva, o que acontece com o vetor peso da aeronave?",
    opcao_correta: "Ele permanece constante e aponta para o centro da Terra.",
    opcao_errada: "Ele aumenta de magnitude devido ao fator de carga (G).",
    explicacao: "O PESO (massa x gravidade) é constante. O que aumenta na curva é a carga alar ou 'peso aparente' (fator de carga). O vetor peso real não muda.",
    materia: "aerodinamica"
  },
  {
    id: 55,
    pergunta: "Os comandos direcionais são efetuados em torno de eixo vertical utilizando-se:",
    opcao_correta: "leme de direção",
    opcao_errada: "ailerons",
    explicacao: "Comandos direcionais = controle de guinada. Efetuado pelo Leme de Direção (pedais). Ailerons são para comando lateral (rolagem).",
    materia: "aerodinamica"
  },
  {
    id: 56,
    pergunta: "O aumento da densidade do ar faz:",
    opcao_correta: "aumentar a sustentação e o arrasto",
    opcao_errada: "aumentar a sustentação e diminuir o arrasto",
    explicacao: "A sustentação e o arrasto são diretamente proporcionais à densidade do ar. Maior densidade = maior massa de ar interagindo com a aeronave = maior sustentação E maior arrasto.",
    materia: "aerodinamica"
  },
  {
    id: 57,
    pergunta: "Qual a diferença de centro de gravidade e centro de pressão?",
    opcao_correta: "O centro de gravidade está relacionado ao equilíbrio de peso da aeronave, enquanto o centro de pressão está relacionado às forças aerodinâmicas que atuam na asa.",
    opcao_errada: "O centro de pressão de uma aeronave é o ponto médio onde toda a massa da aeronave está concentrada.",
    explicacao: "CG: ponto de equilíbrio de massa/peso (relativo à gravidade). CP: ponto de aplicação da resultante das forças aerodinâmicas (sustentação/arrasto). Conceitos distintos.",
    materia: "aerodinamica"
  },
  {
    id: 58,
    pergunta: "Qual característica distingue os cuffs de bordo de ataque dos outros dispositivos de alta sustentação descritos?",
    opcao_correta: "São fixos, estendem permanentemente o bordo de ataque e reduzem a velocidade de estol sem partes móveis.",
    opcao_errada: "Aumentam a curvatura da asa por meio de movimento articulado de dobradiça semelhante aos flaps de fuga.",
    explicacao: "Cuffs (ou 'slot fixo'): extensão fixa e permanente do bordo de ataque. Não é retrátil. Reduz a velocidade de estol por controlar o fluxo de ar de forma passiva.",
    materia: "aerodinamica"
  },
  {
    id: 59,
    pergunta: "Os três eixos imaginários do avião cruzam-se num ponto chamado:",
    opcao_correta: "CG",
    opcao_errada: "CP",
    explicacao: "Os três eixos (longitudinal, lateral e vertical) se interceptam no Centro de Gravidade (CG). Este é o ponto onde o peso da aeronave está concentrado para efeitos de cálculo.",
    materia: "aerodinamica"
  },
  {
    id: 60,
    pergunta: "A cambra de um aerofólio é definida como a curvatura:",
    opcao_correta: "acima e abaixo da superfície da corda",
    opcao_errada: "média da asa",
    explicacao: "Cambra: curvatura do perfil aerodinâmico. É a distância máxima entre a linha da corda (reta) e a superfície do perfil, podendo ocorrer no extradorso, intradorso ou ambos.",
    materia: "aerodinamica"
  },
  {
    id: 61,
    pergunta: "Select the correct answer: to carry, to overhaul, to break, to have, to drill.",
    opcao_correta: "carregar - revisar - quebrar - ter - furar",
    opcao_errada: "carregado - revisado - quebrado - tido - furado",
    explicacao: "A tradução correta dos verbos no infinitivo ('to') é: to carry = carregar, to overhaul = revisar, to break = quebrar, to have = ter, to drill = furar. A alternativa incorreta apresenta os verbos no particípio passado.",
    materia: "ingles"
  },
  {
    id: 62,
    pergunta: "O arco de serra comum tem uma lâmina, um arco e um punho. Ferramenta usada para corte manual de metal.",
    opcao_correta: "hacksaw",
    opcao_errada: "screwdriver",
    explicacao: "A descrição corresponde à ferramenta conhecida como 'hacksaw' (serra de arco). 'Screwdriver' é uma chave de fenda, usada para girar parafusos, não para corte.",
    materia: "ingles"
  },
  {
    id: 63,
    pergunta: "Leia as palavras abaixo formando um Noun Cluster e traduza: Nose gear ground safety pin.",
    opcao_correta: "pino de segurança no solo do trem de pouso do nariz",
    opcao_errada: "pino de segurança do trem de pouso do solo",
    explicacao: "Em um 'Noun Cluster', a tradução é feita de trás para frente. Assim: 'pin' (pino) de 'safety' (segurança) de 'ground' (no solo) de 'gear' (trem de pouso) de 'nose' (do nariz).",
    materia: "ingles"
  },
  {
    id: 64,
    pergunta: "Translate adjectives correctly: fast, slow.",
    opcao_correta: "1. rápido 2. lento",
    opcao_errada: "1. rádio 2. devagar",
    explicacao: "A tradução correta dos adjetivos é: 'fast' = rápido e 'slow' = lento. 'Rádio' (radio) é uma palavra completamente diferente e não uma tradução de 'fast'.",
    materia: "ingles"
  },
  {
    id: 65,
    pergunta: "Helicopter is approaching to landing with locked landing train: o que significa 'approaching to'?",
    opcao_correta: "Aproximação",
    opcao_errada: "Apontado",
    explicacao: "A expressão 'approaching to' indica o movimento de se aproximar de algo, neste caso, da pista para pouso. 'Apontado' seria 'pointed to', que tem um sentido diferente de direcionamento.",
    materia: "ingles"
  },
  {
    id: 66,
    pergunta: "Exposure to and/or storage near which of the following is considered harmful to aircraft tires?",
    opcao_correta: "Fuel, Oil, Hydraulic fluid, Solvents",
    opcao_errada: "Fuel, Oil, Electrical equipment, Hydraulic fluid, Solvents",
    explicacao: "Combustível, óleo, fluido hidráulico e solventes podem danificar a borracha dos pneus. Equipamento elétrico, por si só, não é citado como um agente danificador direto neste contexto.",
    materia: "ingles"
  },
  {
    id: 67,
    pergunta: "Na sentença 'Install the shims... and install the hinge attachment bolts', qual é o significado da palavra 'ATTACHMENT'?",
    opcao_correta: "fixação",
    opcao_errada: "suporte",
    explicacao: "No contexto técnico, 'attachment' refere-se ao ato ou meio de fixar, prender ou conectar uma peça a outra. 'Suporte' seria 'support' ou 'bracket'.",
    materia: "ingles"
  },
  {
    id: 68,
    pergunta: "The temperature of the gases as they leave the cylinder of a reciprocating engine or the turbine of a gas turbine engine:",
    opcao_correta: "EGT",
    opcao_errada: "N1",
    explicacao: "EGT significa 'Exhaust Gas Temperature' (Temperatura dos Gases de Escape), que é exatamente a definição fornecida. N1 refere-se à velocidade do rotor de baixa pressão em uma turbina.",
    materia: "ingles"
  },
  {
    id: 69,
    pergunta: "Leia as palavras abaixo formando um Noun Cluster e traduza: Cabin pressure control panel.",
    opcao_correta: "painel de controle da pressão de cabine",
    opcao_errada: "cabine pressurizada do painel de controle",
    explicacao: "A tradução correta do 'Noun Cluster' segue a ordem inversa: 'panel' (painel) de 'control' (controle) de 'pressure' (pressão) de 'cabin' (cabine).",
    materia: "ingles"
  },
  {
    id: 70,
    pergunta: "Complete the sentence correctly: The fuel ______ leaking. This switch ______ located on the overhead. The engines ________ very sophisticated. The windshield ______ cracked.",
    opcao_correta: "is - is - are - is",
    opcao_errada: "is - is - are - are",
    explicacao: "A concordância verbal correta é: 'fuel' (singular) -> is; 'switch' (singular) -> is; 'engines' (plural) -> are; 'windshield' (singular) -> is.",
    materia: "ingles"
  },
  {
    id: 71,
    pergunta: "Na sentença 'Before installation, you must examine the gaskets...', a palavra 'Must' indica?",
    opcao_correta: "Obrigação",
    opcao_errada: "Conselho",
    explicacao: "Em manuais e procedimentos técnicos, 'must' expressa uma exigência ou obrigação, não uma simples sugestão ou conselho (que seria 'should').",
    materia: "ingles"
  },
  {
    id: 72,
    pergunta: "Cable construction: The basic component of a cable is a wire. A palavra 'wire' quer dizer:",
    opcao_correta: "fio",
    opcao_errada: "cabo",
    explicacao: "'Wire' é o componente básico (um único condutor), o fio. Vários 'wires' trançados ou agrupados formam um 'cable' (cabo).",
    materia: "ingles"
  },
  {
    id: 73,
    pergunta: "Leia as palavras abaixo formando um Noun Cluster e traduza: Main fuel tank access door.",
    opcao_correta: "porta de acesso do tanque de combustível principal",
    opcao_errada: "tanque de combustível do acesso da porta",
    explicacao: "Traduzindo de trás para frente: 'door' (porta) de 'access' (acesso) de 'tank' (tanque) de 'fuel' (combustível) 'main' (principal).",
    materia: "ingles"
  },
  {
    id: 74,
    pergunta: "Select the correct answer: To Loose.",
    opcao_correta: "afrouxar",
    opcao_errada: "apertar",
    explicacao: "O verbo 'to loose' significa 'afrouxar', 'soltar'. 'To tighten' é que significa 'apertar'. Cuidado com a grafia semelhante a 'to lose' (perder).",
    materia: "ingles"
  },
  {
    id: 75,
    pergunta: "'...a scratch in the surface of a piece of metal...', qual é o significado da palavra 'SURFACE'?",
    opcao_correta: "superfície",
    opcao_errada: "sofre",
    explicacao: "'Surface' significa 'superfície', a parte externa ou a camada mais exterior de um objeto. 'Sofre' seria uma tradução incorreta e fora de contexto.",
    materia: "ingles"
  },
  {
    id: 76,
    pergunta: "Complete with THIS, THAT, THOSE or THESE: ______ airplanes are on the ground. (far)",
    opcao_correta: "those",
    opcao_errada: "these",
    explicacao: "Para objetos no plural e distantes, usa-se 'those'. 'These' é usado para objetos no plural e próximos.",
    materia: "ingles"
  },
  {
    id: 77,
    pergunta: "Every day the mechanic must drain the Aircraft in order to inhibit?",
    opcao_correta: "A probabilidade de surgir fungos no combustível",
    opcao_errada: "A probabilidade de surgir gases no combustível",
    explicacao: "A drenagem diária dos tanques de combustível da aeronave é uma prática para remover água e umidade, que podem levar à formação de fungos e outros contaminantes microbiológicos.",
    materia: "ingles"
  },
  {
    id: 78,
    pergunta: "Leia as palavras abaixo formando um Noun Cluster e traduza: Fuel flow indicator.",
    opcao_correta: "indicador de fluxo de combustível",
    opcao_errada: "combustível do fluxo do indicador",
    explicacao: "Tradução do 'Noun Cluster' (de trás para frente): 'indicator' (indicador) de 'flow' (fluxo) de 'fuel' (combustível).",
    materia: "ingles"
  },
  {
    id: 79,
    pergunta: "Como se traduz o seguinte conjunto de palavras para o português: Pilot audio control box?",
    opcao_correta: "Caixa de controle de áudio do piloto",
    opcao_errada: "Controle da caixa de áudio do piloto",
    explicacao: "Seguindo a regra dos 'Noun Clusters': 'box' (caixa) de 'control' (controle) de 'audio' (áudio) de 'pilot' (piloto).",
    materia: "ingles"
  },
  {
    id: 80,
    pergunta: "Leia as palavras abaixo formando um Noun Cluster e traduza: Weather radar panel.",
    opcao_correta: "painel do radar de tempo",
    opcao_errada: "radar do painel de tempo",
    explicacao: "A tradução correta, de trás para frente, é: 'panel' (painel) de 'radar' (radar) de 'weather' (tempo/meteorológico).",
    materia: "ingles"
  },
  {
    id: 81,
    pergunta: "Nos motores turbosuperalimentadores, o compressor centrífugo é acionado:",
    opcao_correta: "Pelos gases de escapamento",
    opcao_errada: "Pelo motor",
    explicacao: "Em um turbocompressor, uma turbina é acionada pelos gases de escapamento do motor. Essa turbina está conectada por um eixo ao compressor centrífugo, que comprime o ar de admissão. A alternativa 'pelo motor' refere-se a um superalimentador mecânico, não ao turbocompressor.",
    materia: "motores1"
  },
  {
    id: 82,
    pergunta: "A redução da velocidade do ar que é fornecido às câmaras de combustão tem como finalidade de:",
    opcao_correta: "proporcionar a queima do combustível de forma ininterrupta",
    opcao_errada: "manter a mistura de combustível/ar enriquecida",
    explicacao: "A velocidade do ar deve ser reduzida na entrada da câmara de combustão para estabilizar a chama e permitir uma queima constante e completa. Uma mistura 'enriquecida' é uma condição de proporção de combustível, não o objetivo direto da redução de velocidade.",
    materia: "motores1"
  },
  {
    id: 83,
    pergunta: "Alguns motores radiais mais complexos têm duas linhas de cilindros, enquanto um tipo específico possui quatro linhas de cilindros, com:",
    opcao_correta: "sete cilindros em cada linha",
    opcao_errada: "quatro cilindros em cada linha",
    explicacao: "Um exemplo famoso de motor radial de quatro carreiras é o Pratt & Whitney R-4360 'Wasp Major', que possui quatro carreiras de 7 cilindros cada, totalizando 28 cilindros. A opção de 'quatro cilindros' é uma armadilha comum, pois o aluno pode associar o número de carreiras ao número de cilindros por carreira.",
    materia: "motores1"
  },
  {
    id: 84,
    pergunta: "Em termos de distribuição do calor liberado pela queima do combustível, qual é a fração aproximada que efetivamente se converte em potência útil no eixo de motores a pistão aeronáuticos?",
    opcao_correta: "25% a 30%, enquanto o restante se perde em escape, arrefecimento e fricção mecânica.",
    opcao_errada: "50% a 55%, sendo o restante dissipado nos gases de escape e no sistema de arrefecimento.",
    explicacao: "A eficiência térmica de motores a pistão aeronáuticos é relativamente baixa. Aproximadamente 25-30% da energia do combustível vira potência no eixo (BHP). A maior parte é perdida: ~40-45% no escape, ~15-20% no arrefecimento e ~5-10% no atrito. A opção de 50-55% é muito otimista e incorreta.",
    materia: "motores1"
  },
  {
    id: 85,
    pergunta: "Qual a diferença de um motor convencional e axial?",
    opcao_correta: "No motor convencional, o ciclo ocorre por meio de pistões... já no motor axial, o fluxo de ar é direcionado axialmente,ou seja, em linha reta ao longo do eixo do motor.",
    opcao_errada: "No motor convencional, o fluxo de ar é direcionado axialmente, enquanto no motor axial, o ciclo ocorre por meio de pistões...",
    explicacao: "A resposta correta define claramente: motor convencional (a pistão) usa movimento alternativo de pistões; motor axial (como turbinas a gás) tem fluxo de ar paralelo ao eixo. A alternativa incorreta simplesmente inverte os conceitos, uma clássica 'casca de banana'.",
    materia: "motores1"
  },
  {
    id: 86,
    pergunta: "O extintor de pó químico 'não' é recomendado para ser usado nos incêndios em equipamentos eletrônicos, pois:",
    opcao_correta: "a poeira residual poderá causar danos ao equipamento",
    opcao_errada: "o pó químico, em contato com o calor, aumentará o fogo",
    explicacao: "O pó químico é condutor e corrosivo. Sua poeira residual pode causar curtos-circuitos e corrosão em componentes eletrônicos sensíveis, danificando-os permanentemente. Apesar de não alimentar o fogo, o dano ao equipamento é a principal razão para não usá-lo.",
    materia: "motores1"
  },
  {
    id: 87,
    pergunta: "A parte do motor onde ocorre a maior pressão estática localiza-se na:",
    opcao_correta: "entrada da câmara",
    opcao_errada: "saída da câmara",
    explicacao: "Em uma câmara de combustão de turbina, o ar é desacelerado na entrada para estabilizar a chama. Essa desaceleração converte energia cinética em pressão estática, que atinge seu pico na entrada da câmara, antes da expansão dos gases.",
    materia: "motores1"
  },
  {
    id: 88,
    pergunta: "Ao se girar a switch dos magnetos para a posição OFF e o mesmo continuar funcionando, é porque:",
    opcao_correta: "o fio massa está partido",
    opcao_errada: "o platinado está sujo",
    explicacao: "No interruptor de ignição OFF, o circuito é fechado para a massa ('ground'), desenergizando os magnetos. Se o fio de massa estiver partido, o circuito não se completa, os magnetos permanecem ativos e o motor continua funcionando. 'Platinado sujo' causaria má ignição, mas não o 'run-on'.",
    materia: "motores1"
  },
  {
    id: 89,
    pergunta: "O Funcionamento do motor a pistão e turbina está baseado em qual princípio?",
    opcao_correta: "transformação da energia calorífera do combustível em energia mecânica",
    opcao_errada: "transformação de energia química em energia térmica",
    explicacao: "Ambos os motores são máquinas térmicas: convertem o calor (energia térmica) da combustão em trabalho mecânico. A alternativa 'energia química em térmica' descreve apenas a etapa da combustão, não o princípio completo de funcionamento da máquina.",
    materia: "motores1"
  },
  {
    id: 90,
    pergunta: "As cabeças dos cilindros para os motores à explosão são, geralmente:",
    opcao_correta: "semi-esféricas",
    opcao_errada: "plana",
    explicacao: "O formato semi-esférico (hemisférico) é predominante em motores aeronáuticos devido à sua maior resistência estrutural, melhor eficiência de combustão e esvaziamento mais eficiente dos gases. Formatos planos são mais simples, mas menos eficientes e comuns em motores antigos.",
    materia: "motores1"
  },
  {
    id: 91,
    pergunta: "A força exercida para mover uma aeronave, através de um motor a reação, é obtida pelo(a):",
    opcao_correta: "terceira lei de Newton",
    opcao_errada: "princípio de Venturi",
    explicacao: "A propulsão a jato é a aplicação prática da 3ª Lei de Newton: 'Para toda ação há uma reação de mesma intensidade e direção oposta'. O motor expele gases (ação) para trás com grande força, e a reação empurra a aeronave para frente. O princípio de Venturi explica a variação de pressão em fluidos, não a propulsão.",
    materia: "motores1"
  },
  {
    id: 92,
    pergunta: "Os componentes do sistema de combustível que localizam-se, sequencialmente, após a saída do tanque, denominam-se:",
    opcao_correta: "válvula seletora - filtro - bomba - FCU",
    opcao_errada: "bomba - FCU - filtro - válvula seletora",
    explicacao: "A sequência lógica padrão é: Tanque -> Válvula Seletora (escolhe o tanque) -> Filtro (remove impurezas) -> Bomba (impulsiona o combustível) -> FCU (Fuel Control Unit, dosa o combustível). Inverter a ordem, como colocar a bomba antes do filtro, faria a bomba empurrar sujeira, danificando componentes a jusante.",
    materia: "motores1"
  },
  {
    id: 93,
    pergunta: "Ao analisar a distribuição do calor liberado, qual combinação representa corretamente as três maiores parcelas de energia não aproveitada nos motores a pistão aeronáuticos?",
    opcao_correta: "Gases de escapamento, aletas de refrigeração e atrito interno.",
    opcao_errada: "Óleo lubrificante, gases de escapamento e potência indicada (IHP).",
    explicacao: "As três maiores perdas são: 1) Gases de escape (~40-45%), 2) Sistema de refrigeração (aletas) (~15-20%), e 3) Atrito interno (~5-10%). 'Óleo lubrificante' não é uma categoria principal de perda de calor, e 'potência indicada' é a potência gerada dentro dos cilindros, não uma perda.",
    materia: "motores1"
  },
  {
    id: 94,
    pergunta: "Tipo de Conector elétrico pressurizado, usados em paredes pressão:",
    opcao_correta: "C",
    opcao_errada: "K",
    explicacao: "Conectores do tipo C são especificamente projetados para serem à prova de explosão e pressurizados, ideais para ambientes como paredes pressurizadas de aeronaves onde se deve evitar a passagem de faíscas ou gases. O tipo K é comum, mas não é o padrão específico para essa aplicação crítica.",
    materia: "motores1"
  },
  {
    id: 95,
    pergunta: "Uma vela de ignição funcionando com temperatura elevada pode ocasionar:",
    opcao_correta: "pré-ignição",
    opcao_errada: "contaminação do combustível",
    explicacao: "Se a vela ficar excessivamente quente, pode atuar como uma fonte de ignição prematura, causando a queima da mistura antes do momento correto da faísca. Isso é a pré-ignição, um fenômeno severo que pode danificar o motor. 'Contaminação do combustível' geralmente está associada a velas frias demais, que acumulam depósitos.",
    materia: "motores1"
  },
  {
    id: 96,
    pergunta: "O carburador de nível constante... O pulverizador ou vaporizador fica instalado:",
    opcao_correta: "Na garganta do venturi",
    opcao_errada: "Na entrada do venturi",
    explicacao: "O ponto de menor pressão no venturi é na sua garganta (parte mais estreita). É exatamente aí que o pulverizador deve estar para que a diferença de pressão aspire e pulverize o combustível de forma eficiente. Colocá-lo na 'entrada' não criaria a sucção necessária.",
    materia: "motores1"
  },
  {
    id: 97,
    pergunta: "O mecanismo de abertura da válvula do cilindro é acionada por um:",
    opcao_correta: "ressalto",
    opcao_errada: "eixo",
    explicacao: "No eixo de comando de válvulas (ou 'árvore de cames'), a peça que empurra o seguidor (ou 'tucho') para abrir a válvula é o ressalto (ou 'lóbulo' ou 'came'). O 'eixo' é o componente que suporta os ressaltos, mas a abertura específica é causada pelo formato do ressalto.",
    materia: "motores1"
  },
  {
    id: 98,
    pergunta: "A seção da turbina de um motor turbo jato ou turborreator está localizada na parte?",
    opcao_correta: "Traseira",
    opcao_errada: "Dianteira",
    explicacao: "A sequência básica de um turbojato é: Entrada -> Compressor (frente) -> Câmaras de Combustão (centro) -> Turbina (traseira) -> Tubeira de Escape. A turbina fica depois da combustão para extrair energia dos gases quentes e acionar o compressor na dianteira.",
    materia: "motores1"
  },
  {
    id: 99,
    pergunta: "O componente responsável pela transmissão do movimento alternativo do pistão e da biela em movimento rotativo para o acionamento da hélice é o (a):",
    opcao_correta: "eixo de manivelas",
    opcao_errada: "biela mestra",
    explicacao: "A biela transmite a força do pistão, mas quem converte o movimento alternativo em rotativo é o eixo de manivelas (virabrequim). A 'biela mestra' é um tipo de biela em motores radiais, mas ela também apenas transmite força para o eixo de manivelas, que faz a conversão final.",
    materia: "motores1"
  },
  {
    id: 100,
    pergunta: "Em um motor a reação, a redução da alta velocidade do ar que sai do compressor, transformada em pressão estática é causada pela presença do componente denominado:",
    opcao_correta: "difusor",
    opcao_errada: "turbina",
    explicacao: "O difusor é a seção entre o compressor e a câmara de combustão. Sua função é desacelerar o ar de alta velocidade vindo do compressor, convertendo essa energia cinética em um aumento de pressão estática, essencial para uma combustão eficiente. A turbina está a jusante e extrai energia dos gases, não desacelera o ar do compressor.",
    materia: "motores1"
  },
  {
    id: 101,
    pergunta: "No caso de incêndio no conjunto de freio, deve-se combatê-los com:",
    opcao_correta: "pó químico",
    opcao_errada: "espuma",
    explicacao: "Incêndios em conjuntos de freio geralmente envolvem materiais inflamáveis como óleo hidráulico e metais superaquecidos (Classe B e, potencialmente, componentes elétricos - Classe C). O pó químico é eficaz para essas classes, pois extingue por abafamento e quebra da reação em cadeia. A espuma é mais indicada para líquidos inflamáveis (Classe B) em superfícies planas, mas não é a primeira escolha para este cenário específico e pode não ser tão prática para componentes de freio com geometrias complexas.",
    materia: "basico"
  },
  {
    id: 102,
    pergunta: "É uma característica do flap:",
    opcao_correta: "aumentar o arrasto",
    opcao_errada: "diminuir a sustentação",
    explicacao: "A função primária do flap é aumentar a sustentação, permitindo voar em velocidades mais baixas. Entretanto, um efeito secundário inevitável e característico é o aumento do arrasto. A alternativa 'diminuir a sustentação' é incorreta e contraditória, pois seria o oposto da função principal do dispositivo.",
    materia: "basico"
  },
  {
    id: 103,
    pergunta: "No controle direcional de uma aeronave, qual é a função principal do leme em relação ao eixo vertical?",
    opcao_correta: "Controlar o movimento de guinada, alterando a direção do nariz da aeronave para a esquerda ou direita.",
    opcao_errada: "Controlar o movimento de rolagem, ajustando o desnível entre as asas esquerda e direita.",
    explicacao: "O leme é a superfície de controle primária no eixo vertical (ou de guinada). Sua deflexão para os lados cria uma força aerodinâmica que faz a aeronave girar em torno do seu eixo vertical, movendo o nariz para a esquerda ou direita. O controle do movimento de rolagem é feito pelos ailerons.",
    materia: "basico"
  },
  {
    id: 104,
    pergunta: "Em locais onde são frequentes as inspeções e manutenções, usam-se conexões:",
    opcao_correta: "de desconexão rápida",
    opcao_errada: "retas",
    explicacao: "Em áreas que demandam acesso frequente para inspeção ou manutenção, como painéis de acesso, é essencial utilizar conexões de desconexão rápida. Elas permitem remover e reinstalar linhas (hidráulicas, pneumáticas, de combustível) de forma ágil, segura e sem ferramentas especializadas, diferentemente de conexões 'retas' (como roscadas) que são mais trabalhosas.",
    materia: "basico"
  },
  {
    id: 105,
    pergunta: "There are at least three forms of attack on aluminum alloys that are particularly serious... Na sentença, o que significa a expressão 'AT LEAST'?",
    opcao_correta: "Pelo menos",
    opcao_errada: "No máximo",
    explicacao: "A expressão 'at least' em inglês traduz-se para 'pelo menos', indicando um número mínimo, podendo haver mais. 'No máximo' seria 'at most'. É uma 'casca de banana' comum em traduções literais, onde o aluno pode confundir os termos opostos.",
    materia: "basico"
  },
  {
    id: 106,
    pergunta: "Durante o reboque de aeronaves, é fundamental que não se confie apenas nos freios do trator para parar a aeronave quando ela estiver parada, sendo necessário:",
    opcao_correta: "que o operador na cabine da aeronave coordene o uso dos freios da aeronave em conjunto com os freios do trator.",
    opcao_errada: "que a velocidade de reboque seja reduzida gradualmente até a parada completa, dispensando o uso dos freios da aeronave.",
    explicacao: "A segurança no reboque exige controle duplo da frenagem. O trator controla seu próprio movimento, mas os freios da aeronave são essenciais para imobilizá-la com segurança, especialmente em terrenos inclinados. A alternativa incorreta sugere uma prática perigosa, confiando apenas na desaceleração, o que pode não ser suficiente para manter a aeronave parada.",
    materia: "basico"
  },
  {
    id: 107,
    pergunta: "Qual nome dado a chave de boca em inglês?",
    opcao_correta: "Open-end wrench",
    opcao_errada: "Open-the-rench",
    explicacao: "A tradução correta para 'chave de boca' em inglês técnico é 'open-end wrench'. A alternativa incorreta 'Open-the-rench' é uma grafia errada e sem sentido, tentando confundir com a pronúncia ou com a palavra 'wrench' (chave inglesa).",
    materia: "basico"
  },
  {
    id: 108,
    pergunta: "A parte do paquímetro que faz medições internas denomina-se:",
    opcao_correta: "orelha",
    opcao_errada: "bico",
    explicacao: "No paquímetro, as partes menores na extremidade, que se abrem para medir o interior de furos ou ranhuras, são chamadas de orelhas ou 'bicos internos'. O 'bico' geralmente se refere às partes para medição externa. É uma nomenclatura específica da ferramenta.",
    materia: "basico"
  },
  {
    id: 109,
    pergunta: "Na inspeção MAGNAGLO, qual fator diferencia esse método da inspeção por partículas magnéticas convencional em termos de sensibilidade?",
    opcao_correta: "Aplicação de partículas fluorescentes sob luz negra, aumentando contraste e permitindo detectar falhas menores rapidamente.",
    opcao_errada: "Utilização de partículas em pó seco, que aderem fortemente mesmo em descontinuidades profundas.",
    explicacao: "O método Magnaglo usa partículas magnéticas fluorescentes em suspensão líquida. Sob luz negra (UV), essas partículas emitem um brilho intenso, proporcionando um contraste muito maior contra o fundo escuro. Isso permite ao inspetor visualizar indicações de falhas menores e mais sutis com muito mais facilidade e rapidez do que com partículas coloridas convencionais sob luz branca. O pó seco é outro método, mas não fluorescente e geralmente menos sensível para falhas finas.",
    materia: "basico"
  },
  {
    id: 110,
    pergunta: "Identifique abaixo o tipo de flape que ao mesmo que deflexiona para baixo, desliza para trás, aumentando a área da asa:",
    opcao_correta: "Fowler",
    opcao_errada: "Bipartido",
    explicacao: "O flap Fowler tem um mecanismo que primeiro o desliza para trás, aumentando efetivamente a corda e a área da asa, e só então o deflexiona para baixo, aumentando também a curvatura. O flap bipartido apenas se deflexiona para baixo a partir da parte inferior da asa, sem aumentar significativamente a área.",
    materia: "basico"
  },
  {
    id: 111,
    pergunta: "Um mecânico precisa dar partida em um motor turbofan em uma aeronave estacionada na área de manobras. Qual dos seguintes procedimentos deve ser seguido antes de iniciar o processo de partida?",
    opcao_correta: "Garantir que a área ao redor da aeronave esteja livre de equipamentos soltos e detritos, e verificar visualmente se há danos nas pás do compressor dianteiro antes de acionar o motor.",
    opcao_errada: "Acionar os freios de estacionamento e iniciar diretamente a sequência de partida, pois os turbofans modernos incorporam proteções automáticas contra FOD.",
    explicacao: "A prevenção contra FOD (Foreign Object Damage) é um procedimento fundamental e obrigatório antes de qualquer partida. A sucção poderosa do motor pode aspirar objetos soltos, causando danos catastróficos. A inspeção visual das pás também é padrão. Nenhuma proteção automática substitui esse procedimento básico de segurança. A alternativa incorreta sugere um procedimento negligente e perigoso.",
    materia: "basico"
  },
  {
    id: 112,
    pergunta: "Como podemos definir fatores humanos?",
    opcao_correta: "a interação entre pessoas e máquinas, pessoas e procedimentos, pessoas e meio ambiente e entre pessoas e pessoas.",
    opcao_errada: "a interação de todos os elementos que envolvem os diversos sistemas em uma organização.",
    explicacao: "A definição de Fatores Humanos na aviação é específica e abrangente, focando nas múltiplas interfaces do indivíduo: com a tecnologia (máquinas), com as regras (procedimentos), com o contexto físico e operacional (meio ambiente) e com outros indivíduos (pessoas). A primeira alternativa é muito vaga e genérica, não capturando a essência multidimensional do conceito.",
    materia: "basico"
  },
  {
    id: 113,
    pergunta: "Durante a investigação de falha em spoilers e dispositivos de arrasto, qual capítulo da Especificação ATA 100 deve ser consultado?",
    opcao_correta: "ATA 27-60, que cobre spoilers, dispositivos de arrasto e carenagens aerodinâmicas variáveis.",
    opcao_errada: "ATA 57-30, tem informações sobre asa e superfícies de comando primárias e secundárias.",
    explicacao: "O sistema de numeração ATA 100 é padronizado. O capítulo 27 é dedicado ao Controle de Voo, e a subseção 27-60 trata especificamente de 'Spoilers, Drag Devices & Variable Aerodynamic Fairings'. O capítulo 57 refere-se a Asas, que pode conter informações estruturais, mas não é o capítulo correto para sistemas de controle de spoilers e arrasto.",
    materia: "basico"
  },
  {
    id: 114,
    pergunta: "A propriedade de um condutor de eletricidade, que limita ou restringe o fluxo de corrente elétrica, denomina-se:",
    opcao_correta: "resistência",
    opcao_errada: "potência",
    explicacao: "Por definição, a resistência elétrica é a propriedade de um material que se opõe à passagem da corrente elétrica. Potência é a taxa de conversão ou transferência de energia. São conceitos fundamentais diferentes.",
    materia: "basico"
  },
  {
    id: 115,
    pergunta: "Qual IS trata sobre o preenchimento de Cadernetas de célula, de motor e de hélice:",
    opcao_correta: "IS 43.9-003",
    opcao_errada: "IS 43.65-007",
    explicacao: "Os Informativos de Segurança (IS) da ANAC têm números específicos. O IS 43.9-003 é o que fornece as diretrizes para o correto preenchimento das cadernetas de bordo (célula, motor e hélice). O IS 43.65-007 trata de outro assunto (Registro de Atividades de Manutenção). É uma questão de memorização da norma específica.",
    materia: "basico"
  },
  {
    id: 116,
    pergunta: "Dois dos melhores condutores são o ouro e a prata; suas órbitas de valência são quase vazias, contendo apenas um elétron cada. Dois dos melhores isolantes são o néon e o hélio; seus átomos possuem órbita de valência:",
    opcao_correta: "Completa",
    opcao_errada: "Vazia",
    explicacao: "A condutividade está ligada à facilidade de mover elétrons. Condutores têm órbitas de valência com poucos elétrons (quase vazias), que se movem facilmente. Isolantes, como gases nobres (néon, hélio), têm a camada de valência completamente preenchida (estável), dificultando extremamente a movimentação de elétrons e, portanto, a condução. 'Vazia' seria o oposto do caso descrito.",
    materia: "basico"
  },
  {
    id: 117,
    pergunta: "Que pilar do SGSO tem como objetivo principal desenvolver uma cultura organizacional voltada à segurança, promovendo a comunicação transparente sobre segurança em todos os níveis hierárquicos?",
    opcao_correta: "Política de Segurança Operacional",
    opcao_errada: "Gerenciamento de Risco Operacional",
    explicacao: "No SGSO (Sistema de Gestão de Segurança Operacional), o pilar Política de Segurança Operacional estabelece os compromissos da alta direção, define responsabilidades e promove uma cultura de segurança com comunicação aberta. O Gerenciamento de Risco Operacional é outro pilar, focado na identificação e mitigação de riscos, não no desenvolvimento cultural em si.",
    materia: "basico"
  },
  {
    id: 118,
    pergunta: "Qual característica define um diagrama de instalação aplicado ao sistema de controle de voo de uma aeronave?",
    opcao_correta: "Identifica cada componente do sistema, mostrando sua localização física dentro da aeronave.",
    opcao_errada: "Representa conexões elétricas internas de cada componente com ênfase nos circuitos de comando.",
    explicacao: "Um diagrama de instalação (ou diagrama de localização) tem como objetivo principal mostrar onde cada componente (atuadores, válvulas, unidades de controle) está fisicamente instalado na estrutura da aeronave. Já um diagrama esquemático (ou elétrico) mostra como os componentes estão conectados logicamente e o fluxo de sinais ou energia. A primeira alternativa descreve um diagrama esquemático.",
    materia: "basico"
  },
  {
    id: 119,
    pergunta: "Quais são os controles de um helicóptero?",
    opcao_correta: "Controle de passo coletivo, controle de passo cíclico e pedais de controle anti-torque",
    opcao_errada: "coletivo, cíclico e guinada",
    explicacao: "A nomenclatura técnica correta e completa dos três controles primários de um helicóptero é: 1) Controle de Passo Coletivo, 2) Controle de Passo Cíclico, e 3) Pedais de Controle Anti-torque. A alternativa 'coletivo, cíclico e guinada' é informal e imprecisa, pois 'guinada' é o movimento controlado pelos pedais, não o nome do controle em si.",
    materia: "basico"
  },
  {
    id: 120,
    pergunta: "Se, após o ciclo de partida de um motor turbojato, a RPM do motor se mantiver a RPM abaixo da marcha lenta, é provável que tenha ocorrido ou esteja ocorrendo uma partida:",
    opcao_correta: "Falsa ou Interrompida",
    opcao_errada: "Normal",
    explicacao: "Uma partida falsa ou interrompida (hung start) é caracterizada pelo motor 'engatar' e acelerar, mas não conseguir atingir e se estabilizar na RPM de marcha lenta auto-sustentável. Ele fica 'preso' em uma rotação mais baixa. Uma partida 'normal' culmina com o motor estabilizado na marcha lenta.",
    materia: "basico"
  },
  {
    id: 121,
    pergunta: "Três resistores de 4 Ω, 6 Ω e 10 Ω estão ligados em série. Qual a resistência equivalente?",
    opcao_correta: "20 Ω",
    opcao_errada: "2 Ω",
    explicacao: "CÁLCULO: Em série: Req = R1 + R2 + R3 = 4 + 6 + 10 = 20 Ω",
    materia: "calculo"
  },
  {
    id: 122,
    pergunta: "Dois resistores de 12 Ω e 6 Ω estão ligados em paralelo. A resistência equivalente é:",
    opcao_correta: "4 Ω",
    opcao_errada: "18 Ω",
    explicacao: "CÁLCULO: Em paralelo: 1/Req = 1/12 + 1/6 = 1/12 + 2/12 = 3/12 = 1/4 → Req = 4 Ω",
    materia: "calculo"
  },
  {
    id: 123,
    pergunta: "Um circuito possui dois resistores de 8 Ω ligados em série e um de 4 Ω em paralelo com esse conjunto. A resistência equivalente é:",
    opcao_correta: "4 Ω",
    opcao_errada: "20 Ω",
    explicacao: "CÁLCULO: Série: 8 + 8 = 16 Ω. Paralelo com 4 Ω: 1/Req = 1/16 + 1/4 = 1/16 + 4/16 = 5/16 → Req = 16/5 = 3.2 Ω ≈ 4 Ω (aproximação para valor mais próximo)",
    materia: "calculo"
  },
  {
    id: 124,
    pergunta: "Três resistores de 10 Ω estão ligados em série. Req é:",
    opcao_correta: "30 Ω",
    opcao_errada: "3,3 Ω",
    explicacao: "CÁLCULO: Em série: Req = 10 + 10 + 10 = 30 Ω",
    materia: "calculo"
  },
  {
    id: 125,
    pergunta: "Dois resistores de 5 Ω ligados em paralelo resultam em:",
    opcao_correta: "2,5 Ω",
    opcao_errada: "10 Ω",
    explicacao: "CÁLCULO: Em paralelo (iguais): Req = R/n = 5/2 = 2,5 Ω",
    materia: "calculo"
  },
  {
    id: 126,
    pergunta: "Um resistor de 4 Ω em série com outro de 16 Ω resulta em:",
    opcao_correta: "20 Ω",
    opcao_errada: "12 Ω",
    explicacao: "CÁLCULO: Em série: Req = 4 + 16 = 20 Ω",
    materia: "calculo"
  },
  {
    id: 127,
    pergunta: "Três resistores de 6 Ω ligados em paralelo possuem Req igual a:",
    opcao_correta: "2 Ω",
    opcao_errada: "18 Ω",
    explicacao: "CÁLCULO: Em paralelo (iguais): Req = R/n = 6/3 = 2 Ω",
    materia: "calculo"
  },
  {
    id: 128,
    pergunta: "Dois resistores de 10 Ω e 20 Ω ligados em paralelo resultam em:",
    opcao_correta: "6,7 Ω",
    opcao_errada: "30 Ω",
    explicacao: "CÁLCULO: 1/Req = 1/10 + 1/20 = 2/20 + 1/20 = 3/20 → Req = 20/3 ≈ 6,7 Ω",
    materia: "calculo"
  },
  {
    id: 129,
    pergunta: "Um circuito possui resistores de 3 Ω, 7 Ω e 10 Ω em série. Req é:",
    opcao_correta: "20 Ω",
    opcao_errada: "4,3 Ω",
    explicacao: "CÁLCULO: Em série: Req = 3 + 7 + 10 = 20 Ω",
    materia: "calculo"
  },
  {
    id: 130,
    pergunta: "Dois resistores de 8 Ω e 8 Ω ligados em paralelo. Req é:",
    opcao_correta: "4 Ω",
    opcao_errada: "16 Ω",
    explicacao: "CÁLCULO: Em paralelo (iguais): Req = R/n = 8/2 = 4 Ω",
    materia: "calculo"
  },
  {
    id: 131,
    pergunta: "Dois capacitores de 4 µF ligados em paralelo. Capacitância equivalente:",
    opcao_correta: "8 µF",
    opcao_errada: "2 µF",
    explicacao: "CÁLCULO: Em paralelo: Ceq = C1 + C2 = 4 + 4 = 8 µF",
    materia: "calculo"
  },
  {
    id: 132,
    pergunta: "Dois capacitores de 10 µF ligados em série. Ceq é:",
    opcao_correta: "5 µF",
    opcao_errada: "20 µF",
    explicacao: "CÁLCULO: Em série (iguais): Ceq = C/n = 10/2 = 5 µF",
    materia: "calculo"
  },
  {
    id: 133,
    pergunta: "Capacitores de 2 µF e 6 µF ligados em paralelo resultam em:",
    opcao_correta: "8 µF",
    opcao_errada: "3 µF",
    explicacao: "CÁLCULO: Em paralelo: Ceq = 2 + 6 = 8 µF",
    materia: "calculo"
  },
  {
    id: 134,
    pergunta: "Dois capacitores iguais de 12 µF ligados em série. Ceq é:",
    opcao_correta: "6 µF",
    opcao_errada: "24 µF",
    explicacao: "CÁLCULO: Em série (iguais): Ceq = C/n = 12/2 = 6 µF",
    materia: "calculo"
  },
  {
    id: 135,
    pergunta: "Três capacitores de 5 µF ligados em paralelo resultam em:",
    opcao_correta: "15 µF",
    opcao_errada: "1,7 µF",
    explicacao: "CÁLCULO: Em paralelo: Ceq = 5 + 5 + 5 = 15 µF",
    materia: "calculo"
  },
  {
    id: 136,
    pergunta: "Dois capacitores de 8 µF e 8 µF ligados em série resultam em:",
    opcao_correta: "4 µF",
    opcao_errada: "16 µF",
    explicacao: "CÁLCULO: Em série (iguais): Ceq = C/n = 8/2 = 4 µF",
    materia: "calculo"
  },
  {
    id: 137,
    pergunta: "Capacitores de 3 µF e 9 µF ligados em paralelo. Ceq é:",
    opcao_correta: "12 µF",
    opcao_errada: "2,25 µF",
    explicacao: "CÁLCULO: Em paralelo: Ceq = 3 + 9 = 12 µF",
    materia: "calculo"
  },
  {
    id: 138,
    pergunta: "Dois capacitores de 20 µF ligados em série. Ceq é:",
    opcao_correta: "10 µF",
    opcao_errada: "40 µF",
    explicacao: "CÁLCULO: Em série (iguais): Ceq = C/n = 20/2 = 10 µF",
    materia: "calculo"
  },
  {
    id: 139,
    pergunta: "Três capacitores de 4 µF ligados em série. Ceq é:",
    opcao_correta: "1,33 µF",
    opcao_errada: "12 µF",
    explicacao: "CÁLCULO: Em série: 1/Ceq = 1/4 + 1/4 + 1/4 = 3/4 → Ceq = 4/3 ≈ 1,33 µF",
    materia: "calculo"
  },
  {
    id: 140,
    pergunta: "Dois capacitores de 6 µF e 3 µF ligados em paralelo resultam em:",
    opcao_correta: "9 µF",
    opcao_errada: "2 µF",
    explicacao: "CÁLCULO: Em paralelo: Ceq = 6 + 3 = 9 µF",
    materia: "calculo"
  },
  {
    id: 141,
    pergunta: "Um circuito possui corrente de 2 A e resistência de 10 Ω. A tensão é:",
    opcao_correta: "20 V",
    opcao_errada: "5 V",
    explicacao: "CÁLCULO: V = I × R = 2 × 10 = 20 V",
    materia: "calculo"
  },
  {
    id: 142,
    pergunta: "Corrente de 5 A passando por resistência de 4 Ω gera tensão de:",
    opcao_correta: "20 V",
    opcao_errada: "9 V",
    explicacao: "CÁLCULO: V = I × R = 5 × 4 = 20 V",
    materia: "calculo"
  },
  {
    id: 143,
    pergunta: "Um resistor de 12 Ω é percorrido por 3 A. A tensão é:",
    opcao_correta: "36 V",
    opcao_errada: "4 V",
    explicacao: "CÁLCULO: V = I × R = 3 × 12 = 36 V",
    materia: "calculo"
  },
  {
    id: 144,
    pergunta: "Corrente de 0,5 A em resistência de 20 Ω. Tensão:",
    opcao_correta: "10 V",
    opcao_errada: "40 V",
    explicacao: "CÁLCULO: V = I × R = 0,5 × 20 = 10 V",
    materia: "calculo"
  },
  {
    id: 145,
    pergunta: "Um circuito apresenta 8 A em um resistor de 5 Ω. Tensão é:",
    opcao_correta: "40 V",
    opcao_errada: "13 V",
    explicacao: "CÁLCULO: V = I × R = 8 × 5 = 40 V",
    materia: "calculo"
  },
  {
    id: 146,
    pergunta: "Um resistor de 15 Ω conduz 2 A. Qual a tensão?",
    opcao_correta: "30 V",
    opcao_errada: "7,5 V",
    explicacao: "CÁLCULO: V = I × R = 2 × 15 = 30 V",
    materia: "calculo"
  },
  {
    id: 147,
    pergunta: "Um circuito com 0,2 A e 50 Ω apresenta tensão de:",
    opcao_correta: "10 V",
    opcao_errada: "250 V",
    explicacao: "CÁLCULO: V = I × R = 0,2 × 50 = 10 V",
    materia: "calculo"
  },
  {
    id: 148,
    pergunta: "Um resistor de 6 Ω é atravessado por 4 A. Tensão é:",
    opcao_correta: "24 V",
    opcao_errada: "1,5 V",
    explicacao: "CÁLCULO: V = I × R = 4 × 6 = 24 V",
    materia: "calculo"
  },
  {
    id: 149,
    pergunta: "Corrente de 10 A em resistência de 2 Ω gera:",
    opcao_correta: "20 V",
    opcao_errada: "5 V",
    explicacao: "CÁLCULO: V = I × R = 10 × 2 = 20 V",
    materia: "calculo"
  },
  {
    id: 150,
    pergunta: "Um circuito com 3 A e 9 Ω apresenta tensão de:",
    opcao_correta: "27 V",
    opcao_errada: "12 V",
    explicacao: "CÁLCULO: V = I × R = 3 × 9 = 27 V",
    materia: "calculo"
  },
  {
    id: 151,
    pergunta: "Um circuito de 24 V com resistência de 12 Ω tem corrente de:",
    opcao_correta: "2 A",
    opcao_errada: "288 A",
    explicacao: "CÁLCULO: I = V/R = 24/12 = 2 A",
    materia: "calculo"
  },
  {
    id: 152,
    pergunta: "Tensão de 10 V aplicada em 5 Ω gera corrente de:",
    opcao_correta: "2 A",
    opcao_errada: "0,5 A",
    explicacao: "CÁLCULO: I = V/R = 10/5 = 2 A",
    materia: "calculo"
  },
  {
    id: 153,
    pergunta: "Um circuito com 60 V e 20 Ω possui corrente de:",
    opcao_correta: "3 A",
    opcao_errada: "12 A",
    explicacao: "CÁLCULO: I = V/R = 60/20 = 3 A",
    materia: "calculo"
  },
  {
    id: 154,
    pergunta: "Aplicando 15 V em um resistor de 3 Ω, a corrente será:",
    opcao_correta: "5 A",
    opcao_errada: "45 A",
    explicacao: "CÁLCULO: I = V/R = 15/3 = 5 A",
    materia: "calculo"
  },
  {
    id: 155,
    pergunta: "Um circuito de 9 V e 3 Ω possui corrente de:",
    opcao_correta: "3 A",
    opcao_errada: "27 A",
    explicacao: "CÁLCULO: I = V/R = 9/3 = 3 A",
    materia: "calculo"
  },
  {
    id: 156,
    pergunta: "Tensão de 120 V aplicada a 40 Ω gera corrente de:",
    opcao_correta: "3 A",
    opcao_errada: "4800 A",
    explicacao: "CÁLCULO: I = V/R = 120/40 = 3 A",
    materia: "calculo"
  },
  {
    id: 157,
    pergunta: "Um resistor de 8 Ω ligado a 32 V terá corrente de:",
    opcao_correta: "4 A",
    opcao_errada: "0,25 A",
    explicacao: "CÁLCULO: I = V/R = 32/8 = 4 A",
    materia: "calculo"
  },
  {
    id: 158,
    pergunta: "Circuito de 50 V com resistência de 25 Ω resulta em:",
    opcao_correta: "2 A",
    opcao_errada: "75 A",
    explicacao: "CÁLCULO: I = V/R = 50/25 = 2 A",
    materia: "calculo"
  },
  {
    id: 159,
    pergunta: "Um circuito de 18 V e 6 Ω tem corrente de:",
    opcao_correta: "3 A",
    opcao_errada: "108 A",
    explicacao: "CÁLCULO: I = V/R = 18/6 = 3 A",
    materia: "calculo"
  },
  {
    id: 160,
    pergunta: "Tensão de 100 V aplicada em 50 Ω gera corrente de:",
    opcao_correta: "2 A",
    opcao_errada: "5000 A",
    explicacao: "CÁLCULO: I = V/R = 100/50 = 2 A",
    materia: "calculo"
  },
  {
    id: 161,
    pergunta: "Um circuito de 20 V e 4 A possui resistência de:",
    opcao_correta: "5 Ω",
    opcao_errada: "80 Ω",
    explicacao: "CÁLCULO: R = V/I = 20/4 = 5 Ω",
    materia: "calculo"
  },
  {
    id: 162,
    pergunta: "Tensão de 30 V e corrente de 3 A. Resistência:",
    opcao_correta: "10 Ω",
    opcao_errada: "90 Ω",
    explicacao: "CÁLCULO: R = V/I = 30/3 = 10 Ω",
    materia: "calculo"
  },
  {
    id: 163,
    pergunta: "Um circuito de 12 V e 2 A tem resistência de:",
    opcao_correta: "6 Ω",
    opcao_errada: "24 Ω",
    explicacao: "CÁLCULO: R = V/I = 12/2 = 6 Ω",
    materia: "calculo"
  },
  {
    id: 164,
    pergunta: "Tensão de 50 V com corrente de 5 A gera resistência de:",
    opcao_correta: "10 Ω",
    opcao_errada: "250 Ω",
    explicacao: "CÁLCULO: R = V/I = 50/5 = 10 Ω",
    materia: "calculo"
  },
  {
    id: 165,
    pergunta: "Um circuito com 9 V e 1,5 A tem resistência de:",
    opcao_correta: "6 Ω",
    opcao_errada: "13,5 Ω",
    explicacao: "CÁLCULO: R = V/I = 9/1,5 = 6 Ω",
    materia: "calculo"
  },
  {
    id: 166,
    pergunta: "Tensão de 24 V e corrente de 6 A. Resistência é:",
    opcao_correta: "4 Ω",
    opcao_errada: "144 Ω",
    explicacao: "CÁLCULO: R = V/I = 24/6 = 4 Ω",
    materia: "calculo"
  },
  {
    id: 167,
    pergunta: "Um circuito de 100 V com 10 A possui resistência de:",
    opcao_correta: "10 Ω",
    opcao_errada: "1000 Ω",
    explicacao: "CÁLCULO: R = V/I = 100/10 = 10 Ω",
    materia: "calculo"
  },
  {
    id: 168,
    pergunta: "Tensão de 15 V e corrente de 3 A resulta em:",
    opcao_correta: "5 Ω",
    opcao_errada: "45 Ω",
    explicacao: "CÁLCULO: R = V/I = 15/3 = 5 Ω",
    materia: "calculo"
  },
  {
    id: 169,
    pergunta: "Um circuito de 40 V e 2 A tem resistência de:",
    opcao_correta: "20 Ω",
    opcao_errada: "80 Ω",
    explicacao: "CÁLCULO: R = V/I = 40/2 = 20 Ω",
    materia: "calculo"
  },
  {
    id: 170,
    pergunta: "Tensão de 60 V e corrente de 5 A gera resistência de:",
    opcao_correta: "12 Ω",
    opcao_errada: "300 Ω",
    explicacao: "CÁLCULO: R = V/I = 60/5 = 12 Ω",
    materia: "calculo"
  },
  {
    id: 171,
    pergunta: "Um resistor de 10 Ω com corrente de 2 A dissipa:",
    opcao_correta: "40 W",
    opcao_errada: "5 W",
    explicacao: "CÁLCULO: P = I² × R = 2² × 10 = 4 × 10 = 40 W",
    materia: "calculo"
  },
  {
    id: 172,
    pergunta: "Um circuito com 20 V e 2 A dissipa potência de:",
    opcao_correta: "40 W",
    opcao_errada: "10 W",
    explicacao: "CÁLCULO: P = V × I = 20 × 2 = 40 W",
    materia: "calculo"
  },
  {
    id: 173,
    pergunta: "Um resistor de 5 Ω conduz 4 A. Potência dissipada:",
    opcao_correta: "80 W",
    opcao_errada: "20 W",
    explicacao: "CÁLCULO: P = I² × R = 4² × 5 = 16 × 5 = 80 W",
    materia: "calculo"
  },
  {
    id: 174,
    pergunta: "Um circuito de 12 V e 3 A dissipa:",
    opcao_correta: "36 W",
    opcao_errada: "4 W",
    explicacao: "CÁLCULO: P = V × I = 12 × 3 = 36 W",
    materia: "calculo"
  },
  {
    id: 175,
    pergunta: "Um resistor de 8 Ω com 2 A dissipa:",
    opcao_correta: "32 W",
    opcao_errada: "16 W",
    explicacao: "CÁLCULO: P = I² × R = 2² × 8 = 4 × 8 = 32 W",
    materia: "calculo"
  },
  {
    id: 176,
    pergunta: "Um circuito com 50 V e 1 A dissipa:",
    opcao_correta: "50 W",
    opcao_errada: "5 W",
    explicacao: "CÁLCULO: P = V × I = 50 × 1 = 50 W",
    materia: "calculo"
  },
  {
    id: 177,
    pergunta: "Um resistor de 4 Ω com corrente de 5 A dissipa:",
    opcao_correta: "100 W",
    opcao_errada: "20 W",
    explicacao: "CÁLCULO: P = I² × R = 5² × 4 = 25 × 4 = 100 W",
    materia: "calculo"
  },
  {
    id: 178,
    pergunta: "Um circuito de 24 V e 4 A dissipa:",
    opcao_correta: "96 W",
    opcao_errada: "6 W",
    explicacao: "CÁLCULO: P = V × I = 24 × 4 = 96 W",
    materia: "calculo"
  },
  {
    id: 179,
    pergunta: "Um resistor de 6 Ω com 3 A dissipa:",
    opcao_correta: "54 W",
    opcao_errada: "18 W",
    explicacao: "CÁLCULO: P = I² × R = 3² × 6 = 9 × 6 = 54 W",
    materia: "calculo"
  },
  {
    id: 180,
    pergunta: "Um circuito com 30 V e 2 A dissipa:",
    opcao_correta: "60 W",
    opcao_errada: "15 W",
    explicacao: "CÁLCULO: P = V × I = 30 × 2 = 60 W",
    materia: "calculo"
  },
  {
    id: 181,
    pergunta: "Uma bateria de 20 Ah alimenta um circuito que consome 4 A. A autonomia é:",
    opcao_correta: "5 horas",
    opcao_errada: "80 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 20 Ah / 4 A = 5 horas",
    materia: "calculo"
  },
  {
    id: 182,
    pergunta: "Uma bateria de 12 Ah fornece corrente de 3 A para um circuito. O tempo de funcionamento será:",
    opcao_correta: "4 horas",
    opcao_errada: "36 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 12 Ah / 3 A = 4 horas",
    materia: "calculo"
  },
  {
    id: 183,
    pergunta: "Um circuito consome 2 A e é alimentado por uma bateria de 10 Ah. A bateria durará:",
    opcao_correta: "5 horas",
    opcao_errada: "20 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 10 Ah / 2 A = 5 horas",
    materia: "calculo"
  },
  {
    id: 184,
    pergunta: "Uma bateria de 40 Ah alimenta um circuito com consumo de 8 A. A autonomia é:",
    opcao_correta: "5 horas",
    opcao_errada: "320 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 40 Ah / 8 A = 5 horas",
    materia: "calculo"
  },
  {
    id: 185,
    pergunta: "Um sistema consome 1,5 A e é alimentado por uma bateria de 9 Ah. O tempo de operação será:",
    opcao_correta: "6 horas",
    opcao_errada: "13,5 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 9 Ah / 1,5 A = 6 horas",
    materia: "calculo"
  },
  {
    id: 186,
    pergunta: "Uma bateria de 60 Ah alimenta um circuito com corrente de 12 A. O tempo de funcionamento é:",
    opcao_correta: "5 horas",
    opcao_errada: "720 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 60 Ah / 12 A = 5 horas",
    materia: "calculo"
  },
  {
    id: 187,
    pergunta: "Um circuito consome 0,5 A e é alimentado por uma bateria de 5 Ah. A autonomia será:",
    opcao_correta: "10 horas",
    opcao_errada: "2,5 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 5 Ah / 0,5 A = 10 horas",
    materia: "calculo"
  },
  {
    id: 188,
    pergunta: "Uma bateria de 24 Ah fornece energia a um circuito que consome 6 A. A duração é:",
    opcao_correta: "4 horas",
    opcao_errada: "144 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 24 Ah / 6 A = 4 horas",
    materia: "calculo"
  },
  {
    id: 189,
    pergunta: "Um circuito consome 10 A e é alimentado por uma bateria de 50 Ah. O tempo de operação será:",
    opcao_correta: "5 horas",
    opcao_errada: "500 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 50 Ah / 10 A = 5 horas",
    materia: "calculo"
  },
  {
    id: 190,
    pergunta: "Uma bateria de 7,5 Ah alimenta um circuito que consome 2,5 A. A autonomia será:",
    opcao_correta: "3 horas",
    opcao_errada: "18,75 horas",
    explicacao: "CÁLCULO: Tempo = Capacidade/Corrente = 7,5 Ah / 2,5 A = 3 horas",
    materia: "calculo"
  },
  {
    id: 191,
    pergunta: "Um circuito possui dois resistores de 6 Ω ligados em paralelo, associados em série com um resistor de 4 Ω. Qual a resistência equivalente total?",
    opcao_correta: "7 Ω",
    opcao_errada: "16 Ω",
    explicacao: "FÓRMULA: Paralelo: Req_par = (6×6)/(6+6) = 36/12 = 3 Ω. Série: Req_total = 3 Ω + 4 Ω = 7 Ω",
    materia: "calculo"
  },
  {
    id: 192,
    pergunta: "Uma fonte de 28 V alimenta um circuito cuja resistência equivalente é 14 Ω. Qual a corrente total do circuito?",
    opcao_correta: "2 A",
    opcao_errada: "196 A",
    explicacao: "FÓRMULA: I = V / R = 28 V / 14 Ω = 2 A",
    materia: "calculo"
  },
  {
    id: 193,
    pergunta: "Um resistor de 10 Ω é percorrido por uma corrente de 3 A. Determine a potência dissipada.",
    opcao_correta: "90 W",
    opcao_errada: "30 W",
    explicacao: "FÓRMULA: P = I² × R = (3 A)² × 10 Ω = 9 × 10 = 90 W",
    materia: "calculo"
  },
  {
    id: 194,
    pergunta: "Dois capacitores de 12 µF ligados em série alimentam um circuito. Qual a capacitância equivalente?",
    opcao_correta: "6 µF",
    opcao_errada: "24 µF",
    explicacao: "FÓRMULA: 1/Ceq = 1/12 + 1/12 = 2/12 = 1/6 → Ceq = 6 µF",
    materia: "calculo"
  },
  {
    id: 195,
    pergunta: "Um circuito consome 2,5 A continuamente e é alimentado por uma bateria de 20 Ah. Qual a autonomia teórica?",
    opcao_correta: "8 horas",
    opcao_errada: "50 horas",
    explicacao: "FÓRMULA: t = Ah / A = 20 Ah / 2,5 A = 8 horas",
    materia: "calculo"
  },
  {
    id: 196,
    pergunta: "Três resistores de 9 Ω estão ligados em paralelo. Determine a resistência equivalente.",
    opcao_correta: "3 Ω",
    opcao_errada: "27 Ω",
    explicacao: "FÓRMULA: 1/Req = 1/9 + 1/9 + 1/9 = 3/9 = 1/3 → Req = 3 Ω",
    materia: "calculo"
  },
  {
    id: 197,
    pergunta: "Uma fonte de 115 V alimenta um circuito que dissipa 230 W. Qual a corrente do circuito?",
    opcao_correta: "2 A",
    opcao_errada: "0,5 A",
    explicacao: "FÓRMULA: P = V × I → I = P / V = 230 W / 115 V = 2 A",
    materia: "calculo"
  },
  {
    id: 198,
    pergunta: "Um circuito apresenta corrente de 4 A sob tensão de 48 V. Determine a resistência equivalente.",
    opcao_correta: "12 Ω",
    opcao_errada: "192 Ω",
    explicacao: "FÓRMULA: R = V / I = 48 V / 4 A = 12 Ω",
    materia: "calculo"
  },
  {
    id: 199,
    pergunta: "Dois capacitores de 5 µF ligados em paralelo são associados em série com um capacitor de 10 µF. Qual a capacitância equivalente total?",
    opcao_correta: "5 µF",
    opcao_errada: "20 µF",
    explicacao: "FÓRMULA: C_paralelo = 5 + 5 = 10 µF. Série: 1/Ceq = 1/10 + 1/10 = 2/10 = 1/5 → Ceq = 5 µF",
    materia: "calculo"
  },
  {
    id: 200,
    pergunta: "Um circuito possui resistência de 20 Ω e corrente de 1,5 A. Qual a tensão aplicada?",
    opcao_correta: "30 V",
    opcao_errada: "13,3 V",
    explicacao: "FÓRMULA: V = I × R = 1,5 A × 20 Ω = 30 V",
    materia: "calculo"
  },
  {
    id: 201,
    pergunta: "Um resistor de 8 Ω dissipa 128 W de potência. Qual a corrente que o percorre?",
    opcao_correta: "4 A",
    opcao_errada: "16 A",
    explicacao: "FÓRMULA: P = I² × R → I² = P / R = 128 W / 8 Ω = 16 → I = √16 = 4 A",
    materia: "calculo"
  },
  {
    id: 202,
    pergunta: "Uma bateria de 24 V alimenta um circuito que consome 72 W. Qual a corrente consumida?",
    opcao_correta: "3 A",
    opcao_errada: "0,33 A",
    explicacao: "FÓRMULA: P = V × I → I = P / V = 72 W / 24 V = 3 A",
    materia: "calculo"
  },
  {
    id: 203,
    pergunta: "Dois resistores de 4 Ω ligados em série são associados em paralelo com um resistor de 8 Ω. Qual a resistência equivalente?",
    opcao_correta: "4 Ω",
    opcao_errada: "16 Ω",
    explicacao: "FÓRMULA: R_série = 4 + 4 = 8 Ω. Paralelo: Req = (8 × 8) / (8 + 8) = 64 / 16 = 4 Ω",
    materia: "calculo"
  },
  {
    id: 204,
    pergunta: "Um circuito consome 6 A sob tensão de 12 V. Qual a potência dissipada?",
    opcao_correta: "72 W",
    opcao_errada: "2 W",
    explicacao: "FÓRMULA: P = V × I = 12 V × 6 A = 72 W",
    materia: "calculo"
  },
  {
    id: 205,
    pergunta: "Um sistema elétrico opera com resistência de 5 Ω e potência dissipada de 125 W. Qual a corrente do circuito?",
    opcao_correta: "5 A",
    opcao_errada: "25 A",
    explicacao: "FÓRMULA: P = I² × R → I² = P / R = 125 W / 5 Ω = 25 → I = √25 = 5 A",
    materia: "calculo"
  },
  {
    id: 206,
    pergunta: "Uma bateria de 50 Ah alimenta um circuito de 250 W sob tensão de 25 V. Qual a autonomia?",
    opcao_correta: "5 horas",
    opcao_errada: "12,5 horas",
    explicacao: "FÓRMULA: I = P / V = 250 W / 25 V = 10 A. t = Ah / I = 50 Ah / 10 A = 5 horas",
    materia: "calculo"
  },
  {
    id: 207,
    pergunta: "Três capacitores de 6 µF ligados em série possuem capacitância equivalente de:",
    opcao_correta: "2 µF",
    opcao_errada: "18 µF",
    explicacao: "FÓRMULA: 1/Ceq = 1/6 + 1/6 + 1/6 = 3/6 = 1/2 → Ceq = 2 µF",
    materia: "calculo"
  },
  {
    id: 208,
    pergunta: "Um circuito possui resistência equivalente de 10 Ω e dissipa 400 W. Qual a corrente elétrica?",
    opcao_correta: "6,32 A",
    opcao_errada: "40 A",
    explicacao: "FÓRMULA: P = I² × R → I² = P / R = 400 W / 10 Ω = 40 → I = √40 ≈ 6,32 A",
    materia: "calculo"
  },
  {
    id: 209,
    pergunta: "Uma fonte de 28 V alimenta um circuito que consome 7 A. Determine a resistência equivalente.",
    opcao_correta: "4 Ω",
    opcao_errada: "196 Ω",
    explicacao: "FÓRMULA: R = V / I = 28 V / 7 A = 4 Ω",
    materia: "calculo"
  },
  {
    id: 210,
    pergunta: "Um sistema consome 1 A continuamente e é alimentado por uma bateria de 18 Ah. Considerando descarga total, a autonomia é:",
    opcao_correta: "18 horas",
    opcao_errada: "1 hora",
    explicacao: "FÓRMULA: t = Ah / A = 18 Ah / 1 A = 18 horas",
    materia: "calculo"
  },
  {
    id: 211,
    pergunta: "Qual é a principal função dos segmentos do coletor em um gerador CC?",
    opcao_correta: "Manter a corrente no circuito externo sempre no mesmo sentido",
    opcao_errada: "Aumentar mecanicamente a tensão gerada",
    explicacao: "Os segmentos do coletor realizam a comutação, retificando a corrente induzida.",
    materia: "gerador"
},
{
    id: 212,
    pergunta: "A voltagem induzida em uma espira de um gerador é máxima quando:",
    opcao_correta: "A espira corta as linhas de fluxo magnético em ângulo reto",
    opcao_errada: "A espira está paralela às linhas de fluxo",
    explicacao: "A indução é máxima quando o condutor corta o campo perpendicularmente.",
    materia: "gerador"
},
{
    id: 213,
    pergunta: "A ondulação (ripple) na saída de um gerador CC pode ser reduzida por:",
    opcao_correta: "Aumento do número de espiras e segmentos do coletor",
    opcao_errada: "Aumento da velocidade de rotação",
    explicacao: "Mais espiras suavizam a variação da tensão CC.",
    materia: "gerador"
},
{
    id: 214,
    pergunta: "O plano neutro em um gerador CC é a posição onde:",
    opcao_correta: "A força eletromotriz induzida é zero durante a comutação",
    opcao_errada: "O campo magnético é máximo",
    explicacao: "A comutação deve ocorrer quando não há FEM para evitar centelhamento.",
    materia: "gerador"
},
{
    id: 215,
    pergunta: "A principal função da carcaça do gerador CC é:",
    opcao_correta: "Completar o circuito magnético e sustentar mecanicamente o gerador",
    opcao_errada: "Gerar a força eletromotriz",
    explicacao: "A carcaça fecha o circuito magnético entre os pólos.",
    materia: "gerador"
},
{
    id: 216,
    pergunta: "Geradores CC aeronáuticos utilizam eletroímãs porque:",
    opcao_correta: "Ímãs permanentes tornariam o gerador grande e ineficiente",
    opcao_errada: "Ímãs permanentes não produzem campo magnético",
    explicacao: "O campo magnético é produzido por corrente de excitação.",
    materia: "gerador"
},
{
    id: 217,
    pergunta: "O núcleo do induzido é laminado para:",
    opcao_correta: "Reduzir perdas por correntes parasitas",
    opcao_errada: "Aumentar a resistência elétrica",
    explicacao: "A laminação reduz aquecimento e perdas internas.",
    materia: "gerador"
},
{
    id: 218,
    pergunta: "O tipo de induzido mais utilizado em geradores de aeronaves é:",
    opcao_correta: "Tipo tambor",
    opcao_errada: "Tipo anel",
    explicacao: "O induzido tipo tambor possui maior robustez mecânica.",
    materia: "gerador"
},
{
    id: 219,
    pergunta: "A função das escovas em um gerador CC é:",
    opcao_correta: "Conduzir corrente do coletor ao circuito externo",
    opcao_errada: "Isolar eletricamente o coletor",
    explicacao: "As escovas fazem a ligação elétrica com o circuito externo.",
    materia: "gerador"
},
{
    id: 220,
    pergunta: "O carvão é utilizado nas escovas porque:",
    opcao_correta: "Reduz desgaste do coletor e mantém boa condução",
    opcao_errada: "Possui resistência elétrica nula",
    explicacao: "O carvão equilibra condutividade e baixo atrito.",
    materia: "gerador"
},
{
    id: 221,
    pergunta: "Em um gerador CC de excitação em série, a voltagem de saída:",
    opcao_correta: "Varia conforme a carga aplicada",
    opcao_errada: "Permanece constante",
    explicacao: "A corrente do campo depende da carga.",
    materia: "gerador"
},
{
    id: 222,
    pergunta: "Geradores CC de excitação em série não são usados em aeronaves porque:",
    opcao_correta: "Possuem má regulagem de voltagem",
    opcao_errada: "São mecanicamente instáveis",
    explicacao: "A tensão varia excessivamente com a carga.",
    materia: "gerador"
},
{
    id: 223,
    pergunta: "As bobinas de campo de um gerador CC em paralelo possuem:",
    opcao_correta: "Muitas voltas de fio fino",
    opcao_errada: "Poucas voltas de fio grosso",
    explicacao: "O campo depende do número de espiras.",
    materia: "gerador"
},
{
    id: 224,
    pergunta: "Quando a carga aumenta em um gerador CC paralelo, a voltagem:",
    opcao_correta: "Diminui devido à queda de IR no induzido",
    opcao_errada: "Aumenta automaticamente",
    explicacao: "Maior corrente provoca maior queda de tensão interna.",
    materia: "gerador"
},
{
    id: 225,
    pergunta: "O ponto de saturação magnética ocorre quando:",
    opcao_correta: "O aumento de corrente não aumenta mais o fluxo",
    opcao_errada: "A corrente de campo zera",
    explicacao: "Após a saturação, o núcleo não intensifica o campo.",
    materia: "gerador"
},
{
    id: 226,
    pergunta: "Um gerador CC de excitação mista possui:",
    opcao_correta: "Campo em série e campo em paralelo",
    opcao_errada: "Dois campos em série",
    explicacao: "Combina características dos dois tipos.",
    materia: "gerador"
},
{
    id: 227,
    pergunta: "Um gerador supermisto apresenta:",
    opcao_correta: "Voltagem maior com carga total",
    opcao_errada: "Voltagem menor com carga",
    explicacao: "O campo série reforça o campo principal.",
    materia: "gerador"
},
{
    id: 228,
    pergunta: "A reação do induzido provoca:",
    opcao_correta: "Distorção do campo magnético principal",
    opcao_errada: "Aumento da rotação do gerador",
    explicacao: "A corrente do induzido cria campos opostos.",
    materia: "gerador"
},
{
    id: 229,
    pergunta: "O principal efeito da reação do induzido é:",
    opcao_correta: "Centelhamento excessivo nas escovas",
    opcao_errada: "Aumento da tensão gerada",
    explicacao: "A comutação ocorre fora do plano neutro.",
    materia: "gerador"
},
{
    id: 230,
    pergunta: "A função dos interpolos é:",
    opcao_correta: "Reduzir a distorção do campo e melhorar a comutação",
    opcao_errada: "Aumentar a potência do gerador",
    explicacao: "Interpolos mantêm o plano neutro estável.",
    materia: "gerador"
  },
  {
    id: 231,
    pergunta: "Um gerador CC de três fios permite:",
    opcao_correta: "Fornecimento simultâneo de 120 V e 240 V",
    opcao_errada: "Apenas fornecimento de 240 V",
    explicacao: "O neutro permite dividir a tensão em dois níveis.",
    materia: "gerador"
},
{
    id: 232,
    pergunta: "A bobina de reatância no gerador de três fios tem a função de:",
    opcao_correta: "Dividir a voltagem com baixa perda",
    opcao_errada: "Limitar a corrente de saída",
    explicacao: "Ela atua como divisor de tensão eficiente.",
    materia: "gerador"
},
{
    id: 233,
    pergunta: "A reação do induzido aumenta à medida que:",
    opcao_correta: "A carga do gerador aumenta",
    opcao_errada: "A velocidade do gerador diminui",
    explicacao: "A corrente do induzido cresce com a carga.",
    materia: "gerador"
},
{
    id: 234,
    pergunta: "A principal consequência da reação do induzido sem correção é:",
    opcao_correta: "Faíscamento excessivo no coletor",
    opcao_errada: "Aumento da eficiência do gerador",
    explicacao: "A comutação ocorre fora do plano neutro.",
    materia: "gerador"
},
{
    id: 235,
    pergunta: "Os interpolos possuem polaridade:",
    opcao_correta: "Igual ao pólo principal adjacente no sentido da rotação",
    opcao_errada: "Sempre oposta ao pólo principal",
    explicacao: "Isso permite corrigir a comutação.",
    materia: "gerador"
},
{
    id: 236,
    pergunta: "A principal vantagem do uso de interpolos é:",
    opcao_correta: "Manter o plano neutro estável com variação de carga",
    opcao_errada: "Aumentar a tensão nominal do gerador",
    explicacao: "Eles compensam a distorção do campo.",
    materia: "gerador"
},
{
    id: 237,
    pergunta: "A capacidade de um gerador é normalmente expressa em:",
    opcao_correta: "Ampères na voltagem nominal",
    opcao_errada: "Rotações por minuto",
    explicacao: "A corrente define a potência disponível.",
    materia: "gerador"
},
{
    id: 238,
    pergunta: "A velocidade mínima na qual o gerador começa a fornecer tensão normal é chamada de:",
    opcao_correta: "Coming-in speed",
    opcao_errada: "Velocidade de saturação",
    explicacao: "O gerador só entra em carga após essa rotação.",
    materia: "gerador"
},
{
    id: 239,
    pergunta: "A transmissão do gerador normalmente gira entre:",
    opcao_correta: "1 1/8 a 1 1/2 vezes a rotação do motor",
    opcao_errada: "Igual à rotação do motor",
    explicacao: "Isso garante tensão adequada em regime normal.",
    materia: "gerador"
},
{
    id: 240,
    pergunta: "Se o sentido de rotação do gerador estiver incorreto:",
    opcao_correta: "A polaridade da voltagem será invertida",
    opcao_errada: "O gerador não produzirá tensão",
    explicacao: "A rotação define a polaridade da saída.",
    materia: "gerador"
},
{
    id: 241,
    pergunta: "O controle da voltagem do gerador é feito principalmente pela variação da:",
    opcao_correta: "Corrente do campo",
    opcao_errada: "Velocidade do induzido",
    explicacao: "O campo magnético determina a tensão gerada.",
    materia: "gerador"
},
{
    id: 242,
    pergunta: "No regulador de voltagem tipo vibrador, a tensão é controlada por:",
    opcao_correta: "Inserção intermitente de resistência no campo",
    opcao_errada: "Abertura do circuito do induzido",
    explicacao: "O reostato do campo é curto-circuitado intermitentemente.",
    materia: "gerador"
},
{
    id: 243,
    pergunta: "O regulador de voltagem à pilha de carvão funciona pela:",
    opcao_correta: "Variação da resistência conforme a pressão aplicada",
    opcao_errada: "Interrupção do circuito de carga",
    explicacao: "A resistência muda com a compressão dos discos.",
    materia: "gerador"
},
{
    id: 244,
    pergunta: "No regulador de três unidades, uma das funções é:",
    opcao_correta: "Limitar a corrente máxima do gerador",
    opcao_errada: "Aumentar a corrente de carga",
    explicacao: "O limitador protege o gerador.",
    materia: "gerador"
},
{
    id: 245,
    pergunta: "A motorização do gerador ocorre quando:",
    opcao_correta: "A bateria descarrega através do gerador",
    opcao_errada: "O gerador fornece corrente excessiva",
    explicacao: "Isso acontece se o relé de corrente reversa falhar.",
    materia: "gerador"
},
{
    id: 246,
    pergunta: "A função do relé de corrente reversa é:",
    opcao_correta: "Desconectar a bateria quando a tensão do gerador cai",
    opcao_errada: "Regular a tensão do gerador",
    explicacao: "Evita que o gerador funcione como motor.",
    materia: "gerador"
},
{
    id: 247,
    pergunta: "O relé diferencial fecha quando a tensão do gerador:",
    opcao_correta: "Excede a tensão da barra em pequeno valor",
    opcao_errada: "É igual à tensão da bateria",
    explicacao: "Normalmente cerca de 0,35 a 0,56 V acima.",
    materia: "gerador"
},
{
    id: 248,
    pergunta: "O relé de sobrevoltagem atua quando a tensão atinge aproximadamente:",
    opcao_correta: "32 volts",
    opcao_errada: "28 volts",
    explicacao: "Protege o sistema contra tensão excessiva.",
    materia: "gerador"
},
{
    id: 249,
    pergunta: "Quando o relé de sobrevoltagem atua, ele:",
    opcao_correta: "Reduz a corrente do campo do gerador",
    opcao_errada: "Aumenta a excitação do campo",
    explicacao: "O campo é enfraquecido para baixar a tensão.",
    materia: "gerador"
},
{
    id: 250,
    pergunta: "Geradores operando em paralelo devem:",
    opcao_correta: "Dividir igualmente a carga",
    opcao_errada: "Operar com tensões diferentes",
    explicacao: "O balanceamento evita sobrecarga.",
    materia: "gerador"
},
{
    id: 251,
    pergunta: "O circuito de equalização serve para:",
    opcao_correta: "Balancear a carga entre os geradores",
    opcao_errada: "Aumentar a potência total do sistema",
    explicacao: "Ele ajusta automaticamente as tensões.",
    materia: "gerador"
},
{
    id: 252,
    pergunta: "A queda de tensão nos resistores de equalização depende da:",
    opcao_correta: "Corrente fornecida por cada gerador",
    opcao_errada: "Velocidade de rotação",
    explicacao: "Maior corrente gera maior queda de tensão.",
    materia: "gerador"
},
{
    id: 253,
    pergunta: "Quando um gerador fornece mais corrente que outro:",
    opcao_correta: "Sua tensão tende a ser reduzida pelo sistema de equalização",
    opcao_errada: "Sua tensão aumenta indefinidamente",
    explicacao: "O sistema busca o equilíbrio.",
    materia: "gerador"
},
{
    id: 254,
    pergunta: "A inspeção do gerador deve verificar:",
    opcao_correta: "Condições das escovas e conexões elétricas",
    opcao_errada: "Apenas a carcaça externa",
    explicacao: "Escovas e conexões são pontos críticos.",
    materia: "gerador"
},
{
    id: 255,
    pergunta: "Óleo ou graxa no coletor:",
    opcao_correta: "Nunca devem ser usados",
    opcao_errada: "Devem ser usados para reduzir atrito",
    explicacao: "Lubrificação causa falha elétrica.",
    materia: "gerador"
},
{
    id: 256,
    pergunta: "O centelhamento excessivo nas escovas indica:",
    opcao_correta: "Problema de comutação ou pressão incorreta",
    opcao_errada: "Operação normal do gerador",
    explicacao: "Faíscas danificam o coletor.",
    materia: "gerador"
},
{
    id: 257,
    pergunta: "Para assentamento correto das escovas deve-se usar:",
    opcao_correta: "Lixa nº 000 ou mais fina",
    opcao_errada: "Lixa de esmeril",
    explicacao: "Abrasivos condutores causam faíscamento.",
    materia: "gerador"
},
{
    id: 258,
    pergunta: "A pressão típica das escovas no coletor é aproximadamente:",
    opcao_correta: "1½ a 2½ psi",
    opcao_errada: "5 a 8 psi",
    explicacao: "Pressão correta evita desgaste e faíscas.",
    materia: "gerador"
},
{
    id: 259,
    pergunta: "Escovas com pressão excessiva provocam:",
    opcao_correta: "Desgaste acelerado",
    opcao_errada: "Melhor condução elétrica",
    explicacao: "O atrito aumenta demasiadamente.",
    materia: "gerador"
},
{
    id: 260,
    pergunta: "Escovas com pressão insuficiente provocam:",
    opcao_correta: "Oscilação e queima do coletor",
    opcao_errada: "Redução da tensão do gerador",
    explicacao: "Contato irregular causa centelhamento.",
    materia: "gerador"
  },
  {
    id: 261,
    pergunta: "Em que ponto de um motor a turbina a temperatura é a mais alta?",
    opcao_correta: "Na entrada da turbina de alta pressão",
    opcao_errada: "Na saida da turbina de alta pressão",
    explicacao: "Os gases atingem sua temperatura máxima imediatamente após a câmara de combustão, ou seja, na entrada da turbina de alta pressão. À medida que passam pelos estágios da turbina, eles se expandem e realizam trabalho, perdendo energia e, consequentemente, temperatura. Portanto, a temperatura na saída da turbina é sempre mais baixa do que na entrada.",
    materia: "motores1"
  },
  {
    id: 262,
    pergunta: "Durante a sincronização de um magneto, a função da folga 'E' é assegurar que:",
    opcao_correta: "O campo magnético atinja a taxa máxima de variação, permitindo que a tensão induzida na bobina secundária seja suficiente para gerar centelha confiável.",
    opcao_errada: "A interrupção da corrente primária ocorra quando o fluxo magnético no núcleo já estiver em declínio máximo, maximizando a energia transferida à bobina secundária para gerar a centelha.",
    explicacao: "A folga 'E' é a posição angular do rotor do magneto onde a taxa de variação do fluxo magnético é máxima. A chave para gerar alta tensão na bobina secundária é interromper o circuito primário exatamente nesse ponto de máxima variação (dΦ/dt), e não quando o fluxo já está em declínio (que seria tarde demais). A alternativa incorreta descreve um momento posterior e menos eficiente, confundindo o conceito.",
    materia: "motores1"
  },
  {
    id: 263,
    pergunta: "Uma vez que a maioria dos magnetos de alta tensão possui milhares de voltas na bobina secundária, uma voltagem muito alta é gerada no circuito secundário para vencer o vão livre entre os eletrodos da vela. Esta voltagem é geralmente:",
    opcao_correta: "superior a 20.000 volts",
    opcao_errada: "de 1.000 volts",
    explicacao: "Magnetos aeronáuticos são projetados para gerar tensões extremamente altas (tipicamente entre 20.000 e 30.000 volts) para garantir a centelha mesmo em condições adversas de altitude, umidade e com velas sujas ou desgastadas. 1.000 volts é uma tensão comum em sistemas de ignição automotiva de baixa performance, totalmente inadequada e insegura para aplicação aeronáutica.",
    materia: "motores1"
  },
  {
    id: 264,
    pergunta: "A seção da turbina de um motor turbo jato ou turborreator está localizada na parte?",
    opcao_correta: "Traseira",
    opcao_errada: "Dianteira",
    explicacao: "A sequência fundamental de um turbojato é: Entrada de ar (frente) -> Compressor (frente/centro) -> Câmara de Combustão (centro) -> Turbina (traseira) -> Tubeira de Escape (traseira final). A turbina está posicionada após a câmara de combustão para extrair energia dos gases quentes em expansão e acionar o compressor, que está na dianteira.",
    materia: "motores1"
  },
  {
    id: 265,
    pergunta: "Nos motores superalimentados, o tipo de compressor mais utilizado é o:",
    opcao_correta: "Centrífugo",
    opcao_errada: "Axial",
    explicacao: "Em superalimentadores e turbocompressores para motores a pistão, o compressor centrífugo é predominante devido ao seu design robusto, alta relação de pressão por estágio, eficiência em uma faixa ampla de rotação e custo. Compressores axiais são mais comuns em turbinas a gás de grande porte (turbojatos, turbofans).",
    materia: "motores1"
  },
  {
    id: 266,
    pergunta: "'Changes the in-and-out motion of the pistons into rotation of the crankshaft.' O texto anterior se refere a:",
    opcao_correta: "biela",
    opcao_errada: "árvore de manivelas",
    explicacao: "A biela (connecting rod) é o componente que conecta o pistão (movimento linear) ao virabrequim (movimento rotativo), realizando a conversão do movimento. O virabrequim (crankshaft) é a peça que recebe esse movimento convertido e o entrega como rotação.",
    materia: "motores1"
  },
  {
    id: 267,
    pergunta: "O motor turbojato é equipado com um sistema de ignição do tipo capacitivo... No conjunto de interruptores, uma corrente que é rapidamente interrompida, é enviada para o (a):",
    opcao_correta: "autotransformador",
    opcao_errada: "Bobina",
    explicacao: "Em sistemas de ignição capacitiva de alta energia (como os de turbinas), o componente central que eleva a tensão da bateria (24V CC) para uma alta tensão pulsante (aproximadamente 2000V) é o autotransformador. A bobina de ignição é o componente principal em sistemas indutivos de motores a pistão.",
    materia: "motores1"
  },
  {
    id: 268,
    pergunta: "'A condition that can occur in radial engines but is unlikely to occur in horizontally opposed engines is:'",
    opcao_correta: "hydraulic lock",
    opcao_errada: "oil-fouled spark plug",
    explicacao: "O calço hidráulico (hydraulic lock) é um risco específico em motores radiais (e invertidos) porque alguns cilindros ficam abaixo do cárter quando o motor para. Óleo pode vazar e acumular na câmara de combustão desses cilindros inferiores. Em motores opostos horizontalmente, todos os cilindros estão essencialmente na mesma posição lateral, minimizando drasticamente esse risco.",
    materia: "motores1"
  },
  {
    id: 269,
    pergunta: "A principal função de um duto de admissão é fornecer a quantidade adequada de ar para a entrada do motor... os dutos de admissão são projetados para atuar como difusores que:",
    opcao_correta: "diminuem a velocidade e aumentam a pressão estática do ar que passa por eles",
    opcao_errada: "aumentam a velocidade e a pressão estática do ar que passa por eles",
    explicacao: "Por definição, um difusor é um duto de seção divergente (que aumenta de área). Sua função é desacelerar o fluxo de ar (diminuir a velocidade) e, pela conservação de energia, aumentar sua pressão estática. Esta é a preparação ideal para o compressor.",
    materia: "motores1"
  },
  {
    id: 270,
    pergunta: "Nos motores a pistão, a abertura correta das válvulas é crucial para o bom funcionamento do motor. A válvula de admissão:",
    opcao_correta: "abre antes do ponto morto superior no tempo de escapamento",
    opcao_errada: "abre antes do ponto morto superior no tempo admissão",
    explicacao: "Este é um conceito de sobreposição de válvulas (valve overlap). A válvula de admissão começa a abrir antes do Pistão Chegar ao Ponto Morto Superior (PMS) do final do curso de exaustão. Isso permite que a nova mistura comece a entrar enquanto o pistão ainda está terminando de expelir os gases queimados, melhorando a 'varredura' e o enchimento do cilindro.",
    materia: "motores1"
  },
  {
    id: 271,
    pergunta: "O indicador da razão de pressão do motor (EPR) recebe sinal de sensores instalados na:",
    opcao_correta: "Saída da turbina e entrada do compressor",
    opcao_errada: "Entrada da câmara e saída da turbina",
    explicacao: "O EPR é a razão entre a pressão total na entrada do compressor e a pressão total na saída da turbina, representando diretamente a potência do motor a reação.",
    materia: "revisao"
  },
  {
    id: 272,
    pergunta: "Como precaução operacional, a bomba de combustível auxiliar (booster) deve ser ligada:",
    opcao_correta: "Em todo o voo",
    opcao_errada: "Somente na decolagem e no pouso",
    explicacao: "A bomba booster mantém pressão positiva na linha, evitando vaporização do combustível, principalmente em grandes altitudes.",
    materia: "revisao"
  },
  {
    id: 273,
    pergunta: "Nos motores radiais de uma única fileira de cilindros, a sequência correta de queima é:",
    opcao_correta: "Primeiro os cilindros ímpares, depois os pares, em sequência numérica",
    opcao_errada: "Sentido horário começando no cilindro superior",
    explicacao: "Essa ordem garante equilíbrio dinâmico, funcionamento suave e distribuição uniforme da potência no motor radial.",
    materia: "revisao"
  },
  {
    id: 274,
    pergunta: "A finalidade do sistema de marcha lenta, na maioria dos carburadores, é:",
    opcao_correta: "Suprir combustível nas baixas velocidades do motor",
    opcao_errada: "Aumentar o fluxo de combustível na baixa rotação",
    explicacao: "Com a borboleta quase fechada, o sistema de marcha lenta fornece combustível suficiente para manter o motor funcionando de forma estável.",
    materia: "revisao"
  },
  {
    id: 275,
    pergunta: "A principal diferença entre o taquímetro de motor alternativo e o de motor a reação está:",
    opcao_correta: "No motor a reação medir a rotação percentual do eixo da turbina",
    opcao_errada: "No motor a reação medir a rotação do eixo do compressor de alta",
    explicacao: "Motores a reação indicam rotação em percentual da rotação máxima (N1/N2), e não em RPM direto como nos motores alternativos.",
    materia: "revisao"
  },
  {
    id: 276,
    pergunta: "O sistema de ignição que apresenta menor incidência de falhas por fuga elétrica em cablagem é:",
    opcao_correta: "Magneto de baixa tensão",
    opcao_errada: "Magneto de alta tensão",
    explicacao: "No magneto de baixa tensão, a alta tensão percorre apenas pequenos trechos, reduzindo riscos de fuga elétrica nos cabos.",
    materia: "revisao"
  },
  {
    id: 277,
    pergunta: "Para evitar contato com fluidos, os fios elétricos devem ser posicionados:",
    opcao_correta: "Nivelados com ou acima das tubulações",
    opcao_errada: "Abaixo das tubulações",
    explicacao: "Essa disposição impede que fluidos escorram sobre os fios, protegendo a isolação elétrica.",
    materia: "revisao"
  },
  {
    id: 278,
    pergunta: "No sistema de ignição do motor turbojato, a alta tensão após o retificador é direcionada para o:",
    opcao_correta: "Capacitor de carga",
    opcao_errada: "Vela de ignição",
    explicacao: "O capacitor armazena energia elétrica, que será descarregada posteriormente para gerar uma centelha forte na vela.",
    materia: "revisao"
  },
  {
    id: 279,
    pergunta: "As posições da chave seletora utilizadas para testar o sistema de ignição dupla são:",
    opcao_correta: "Esquerdo e direito",
    opcao_errada: "Esquerdo e ambos",
    explicacao: "O teste compara a queda de RPM de cada magneto separadamente, verificando o funcionamento individual de cada um.",
    materia: "revisao"
  },
  {
    id: 280,
    pergunta: "Qual fator contribui para que os combustíveis de jato sejam mais suscetíveis à contaminação do que a gasolina de aviação?",
    opcao_correta: "A alta viscosidade dos combustíveis de jato aumenta a capacidade em manter contaminantes em suspensão",
    opcao_errada: "A composição química dos combustíveis de jato atrai naturalmente mais contaminantes",
    explicacao: "A maior suscetibilidade à contaminação nos combustíveis de jato está relacionada à sua alta viscosidade, que favorece a suspensão e retenção de partículas contaminantes. A composição química não é o fator determinante para essa característica.",
    materia: "revbasico"
  },
  {
    id: 281,
    pergunta: "O punção extrator também é chamado de:",
    opcao_correta: "punção cônico",
    opcao_errada: "marcador",
    explicacao: "O punção extrator é uma ferramenta com face plana usada para remover rebites, pinos ou parafusos presos em orifícios. Ele é projetado para evitar a dilatação do objeto durante a extração, sendo também conhecido como 'punção cônico'. O termo 'marcador' refere-se a outro tipo de ferramenta.",
    materia: "revbasico"
  },
  {
    id: 282,
    pergunta: "Os plásticos usados em pára-brisas e janelas transparentes de aeronaves são classificados de acordo com a sua:",
    opcao_correta: "reação ao calor",
    opcao_errada: "plasticidade",
    explicacao: "A classificação desses plásticos (como acrílicos) é baseada no comportamento frente ao calor, dividindo-os em termoplásticos (que amolecem com calor e solidificam ao resfriar) e termoendurecidos (que não se alteram com reaquecimento). A plasticidade é uma propriedade física, não o critério de classificação.",
    materia: "revbasico"
  },
  {
    id: 283,
    pergunta: "Como é determinado o crescimento da chave colar ou caixa?",
    opcao_correta: "De extremo a extremo e de chave para chave, acrescentando 1/16",
    opcao_errada: "De extremo a extremo e de chave para chave, acrescentando 11/16",
    explicacao: "O tamanho dessas chaves aumenta progressivamente em 1/16 de polegada a cada número sequencial. O valor de 11/16 não corresponde ao padrão de crescimento.",
    materia: "revbasico"
  },
  {
    id: 284,
    pergunta: "Durante a verificação pré-voo de um avião monomotor com sistema de duplo magneto, o piloto seleciona a chave em 'DIREITO'. O que o mecânico deve esperar no comportamento do motor?",
    opcao_correta: "O magneto esquerdo é aterrado, ficando inoperante, enquanto o magneto direito continua ativo e fornece centelha apenas às velas dianteiras de cada cilindro.",
    opcao_errada: "O magneto direito passa a fornecer centelha a todas as velas, substituindo completamente a função do magneto esquerdo, sem variação no desempenho do motor.",
    explicacao: "Ao selecionar 'DIREITO', apenas o magneto direito permanece ativo, fornecendo centelha às velas dianteiras, enquanto o magneto esquerdo é aterrado e desligado. Isso causa uma leve queda nas RPM, o que é normal e indica que o sistema está funcionando corretamente. A ausência de queda nas RPM sugeriria falha no aterramento do magneto esquerdo.",
    materia: "revisao"
  },
  {
    id: 285,
    pergunta: "Durante operação em 2.100 RPM, uma vela de ignição simples em um cilindro gera quantas centelhas distintas por segundo?",
    opcao_correta: "Aproximadamente 17 centelhas distintas, observadas como disparos contínuos acima de 3000 °F",
    opcao_errada: "Aproximadamente 22 centelhas distintas, registradas como ignições consecutivas a 15.000 volts.",
    explicacao: "Em um motor de 4 tempos, cada cilindro produz uma centelha a cada duas rotações do virabrequim. Portanto, a 2.100 RPM, o número de centelhas por segundo por vela é: (2.100 RPM / 60 segundos) / 2 = 17,5 centelhas/segundo (aproximadamente 17).",
    materia: "revisao"
  },
  {
    id: 286,
    pergunta: "Qual é a diferença operacional fundamental entre superalimentadores internos e turboalimentadores nos sistemas de indução de motores alternativos?",
    opcao_correta: "Superalimentadores internos comprimem a mistura ar/combustível após a carburação, enquanto turboalimentadores comprimem apenas o ar antes da mistura.",
    opcao_errada: "Superalimentadores internos comprimem o ar antes da carburação, enquanto os turboalimentadores atuam após a carburação.",
    explicacao: "A diferença fundamental está no ponto de compressão e no que é comprimido. Superalimentadores internos (acionados mecanicamente) são instalados após o carburador, comprimindo a mistura ar-combustível já formada. Turboalimentadores (acionados pelos gases de escapamento) comprimem apenas o ar antes deste entrar no carburador ou no sistema de injeção, aumentando sua densidade para depois se misturar ao combustível.",
    materia: "revisao"
  },
  {
    id: 287,
    pergunta: "As posições da chave seletora do magneto que são utilizadas para testar o sistema de ignição dupla:",
    opcao_correta: "esquerdo e direito",
    opcao_errada: "esquerdo e ambos",
    explicacao: "O teste de magnetos é realizado para verificar o funcionamento independente de cada unidade. Para isso, a chave é alternada da posição 'AMBOS' para 'ESQUERDO' e depois para 'DIREITO'. As posições 'ESQUERDO' e 'DIREITO' são usadas para testar se cada magneto funciona isoladamente, causando uma pequena queda nas RPM quando apenas um está ativo. 'AMBOS' é a posição normal de operação.",
    materia: "revisao"
  },
  {
    id: 288,
    pergunta: "Nos sistemas de combustível, para proteger a bomba de combustível acionada pelo motor existe o(a):",
    opcao_correta: "filtro de baixa pressão",
    opcao_errada: "válvula de derivação",
    explicacao: "O filtro de baixa pressão é instalado na linha de combustível antes da bomba acionada pelo motor. Sua função é reter impurezas e contaminantes sólidos presentes no combustível, prevenindo danos aos componentes internos da bomba e garantindo um fluxo limpo para o restante do sistema.",
    materia: "revisao"
  },
  {
    id: 289,
    pergunta: "Em um motor a pistão o que acontece com a mistura quando a densidade do ar diminui?",
    opcao_correta: "A mistura torna-se mais rica",
    opcao_errada: "A mistura torna-se mais pobre",
    explicacao: "A densidade do ar diminui com o aumento da altitude ou da temperatura. Como a quantidade de combustível injetada tende a permanecer a mesma (em sistemas sem compensação automática), a proporção de combustível em relação ao ar disponível aumenta. Isso resulta em uma mistura mais rica (excesso de combustível em relação ao ar).",
    materia: "revisao"
  },
  {
    id: 290,
    pergunta: "Um conjunto de trem de pouso apresenta rachaduras por fadiga suspeitas. O inspetor decide usar MAGNAGLO sob luz negra. Em termos de ponto de atuação e efeito colateral, qual escolha descreve corretamente o método?",
    opcao_correta: "Atua predominantemente em descontinuidades superficiais e rasas; o contraste fluorescente acelera a percepção de indicações pequenas, exigindo posterior desmagnetização e lavagem.",
    opcao_errada: "Atua na superfície e subsuperfície profunda; o brilho neon pode mascarar linhas de força, reduzindo a definição do contorno em descontinuidades abertas.",
    explicacao: "O método Magnaglo é uma variação do ensaio por partículas magnéticas que utiliza partículas fluorescentes em suspensão líquida. Ele atua principalmente em descontinuidades superficiais e subsuperficiais rasas (não profundas). A fluorescência sob luz negra (UV-A) aumenta sensivelmente o contraste das indicações, facilitando a detecção de pequenas descontinuidades. Após o ensaio, é obrigatória a desmagnetização para eliminar magnetismo residual que poderia atrair partículas metálicas em operação, e a lavagem para remover os resíduos da suspensão fluorescente. A afirmação sobre 'mascarar linhas de força' é incorreta, pois o contraste fluorescente melhora, não prejudica, a definição das indicações.",
    materia: "basico"
  },
  {
    id: 291,
    pergunta: "A alimentação de um motor feita por tanque destinado a suprir outro motor é denominada alimentação:",
    opcao_correta: "cruzada",
    opcao_errada: "invertida",
    explicacao: "A alimentação cruzada ocorre quando um tanque de combustível, normalmente designado para suprir um motor específico, é utilizado para alimentar outro motor da aeronave. Isso é comum em situações de emergência ou para balancear o consumo de combustível. 'Alimentação invertida' não é um termo técnico correto no contexto de sistemas de combustível de aeronaves.",
    materia: "basico"
  },
  {
    id: 292,
    pergunta: "In what units is impedance measured?",
    opcao_correta: "In ohms",
    opcao_errada: "In henry",
    explicacao: "A impedância (Z) é medida em ohms (Ω), assim como a resistência (R). A impedância representa a oposição total que um circuito oferece ao fluxo de corrente alternada, combinando resistência e reatância. O henry (H) é a unidade de indutância (L), não de impedância.",
    materia: "basico"
  },
  {
    id: 293,
    pergunta: "Determine a tensão de saída de um transformador cujo enrolamento primário, de 20 espiras, recebe 220v de tensão. Saiba que o enrolamento secundário desse transformador é formado por 10 espiras:",
    opcao_correta: "110 v",
    opcao_errada: "120 v",
    explicacao: "A relação de transformação é dada por Vp/Vs = Np/Ns, onde Vp = tensão primária (220V), Vs = tensão secundária, Np = número de espiras do primário (20), Ns = número de espiras do secundário (10). Portanto: 220/Vs = 20/10 → 220/Vs = 2 → Vs = 220/2 = 110V.",
    materia: "basico"
  },
  {
    id: 294,
    pergunta: "A inspeção utilizando ultra-som com feixe direto e eco-pulso é indicada para:",
    opcao_correta: "localizar trincas paralelas ao plano da peça",
    opcao_errada: "localizar trincas perpendiculares ao plano da peça",
    explicacao: "No método de feixe direto (ou normal), o transdutor emite ondas ultrassônicas perpendicularmente à superfície da peça. Quando encontra uma descontinuidade paralela ao plano da peça (como uma trinca de fadiga horizontal), o sinal é refletido quase totalmente de volta ao transdutor, gerando um eco claro no equipamento. Já para trincas perpendiculares ao plano, o feixe direto tem baixa eficiência, pois a reflexão ocorre em direções que não retornam ao transdutor.",
    materia: "basico"
  },
  {
    id: 295,
    pergunta: "Marque a afirmativa que está de acordo com a lei de Boyle:",
    opcao_correta: "a pressão absoluta e o volume de uma certa quantidade de gás confinado são inversamente proporcionais se a temperatura permanece constante em um sistema fechado",
    opcao_errada: "a pressão absoluta e o volume de uma certa quantidade de gás confinado são proporcionais se a temperatura permanece constante em um sistema fechado",
    explicacao: "A Lei de Boyle (Boyle-Mariotte) estabelece que, para uma massa fixa de gás ideal mantida a temperatura constante, o produto da pressão pelo volume é constante: P × V = k. Isso significa que pressão e volume são inversamente proporcionais - se um aumenta, o outro diminui na mesma proporção.",
    materia: "basico"
  },
  {
    id: 296,
    pergunta: "Em um helicóptero a sustentação e a tração são obtidas através do:",
    opcao_correta: "Rotor principal",
    opcao_errada: "Rotor de cauda",
    explicacao: "No helicóptero, o rotor principal é responsável por gerar tanto a sustentação (para voar) quanto a tração (para se deslocar horizontalmente), através da variação cíclica e coletiva do passo das pás. O rotor de cauda serve apenas para compensar o torque do rotor principal e controlar a guinada (direção), não gerando sustentação ou tração significativas para o voo.",
    materia: "basico"
  },
  {
    id: 297,
    pergunta: "A temperatura ideal pra a cura da maioria dos selantes é de?",
    opcao_correta: "22°",
    opcao_errada: "ambiente",
    explicacao: "A temperatura específica de 22°C (71,6°F) é considerada ideal para a cura da maioria dos selantes aeronáuticos porque nesta temperatura as reações químicas de polimerização ocorrem no ritmo adequado, garantindo propriedades mecânicas ótimas. 'Ambiente' é enganoso porque a temperatura ambiente pode variar muito, o que afetaria drasticamente o tempo e a qualidade da cura.",
    materia: "basico"
  },
  {
    id: 298,
    pergunta: "Qual nome dado a chave de boca em inglês?",
    opcao_correta: "Open-end wrench",
    opcao_errada: "Open -tall- rench",
    explicacao: "'Open-end wrench' é o termo técnico correto para chave de boca (aquela com aberturas paralelas nas extremidades). A alternativa errada apresenta um erro comum de pronúncia/grafia.",
    materia: "basico"
  },
  {
    id: 299,
    pergunta: "Nos termos da aplicação territorial do Código Brasileiro de Aeronáutica (Lei nº 7.565/1986), em qual cenário o CBA se estende ao espaço aéreo internacional?",
    opcao_correta: "Quando a aeronave estiver registrada no Brasil, mesmo que esteja operando além dos limites do território nacional.",
    opcao_errada: "Sempre que a aeronave estiver voando em espaço aéreo internacional, independentemente de sua origem ou destino.",
    explicacao: "O CBA aplica-se pelo princípio da nacionalidade da aeronave, ou seja, às aeronaves brasileiras onde quer que estejam. Não se aplica a aeronaves estrangeiras no espaço aéreo internacional, que ficam sujeitas às leis de seu país de registro e aos tratados internacionais.",
    materia: "basico"
  },
  {
    id: 300,
    pergunta: "Em um voo internacional, uma aeronave sofre pane em rota e desaparece do radar. Qual anexo da ICAO estabelece os padrões para a organização e a execução de operações de busca e salvamento?",
    opcao_correta: "No Anexo 12, que trata especificamente de serviços de busca e salvamento para aeronaves em perigo ou desaparecidas.",
    opcao_errada: "O Anexo 13 dedica-se especialmente à normatização dos serviços de busca e resgate para aeronaves em condições de risco ou desaparecimento.",
    explicacao: "O Anexo 12 da ICAO é intitulado 'Busca e Salvamento' e estabelece todos os padrões para organização, coordenação e execução de operações SAR. O Anexo 13 trata de 'Investigação de Acidentes e Incidentes de Aeronaves', sendo uma confusão comum pensar que ele também cobre o resgate.",
    materia: "basico"
  },
  {
    id: 301,
    pergunta: "O punção extrator também é chamado de:",
    opcao_correta: "punção cônico",
    opcao_errada: "punção de centro",
    explicacao: "O punção extrator possui uma ponta plana (não cônica) e é usado para remover pinos, rebites ou parafusos presos sem expandi-los. É chamado de 'punção cônico' por sua forma geral. O 'punção de centro' tem ponta afiada e serve para marcar centros de furação.",
    materia: "basico"
  },
  {
    id: 302,
    pergunta: "O eletrólito é uma solução que permite a Passagem de elétrons entre as placas de uma bateria. O eletrólito usado nas baterias de níquel-cádmio é uma solução de:",
    opcao_correta: "30% de hidróxido de potássio em água destilada",
    opcao_errada: "30% de hidróxido de cádmio em água Desmineralizada",
    explicacao: "As baterias Ni-Cd utilizam hidróxido de potássio (KOH) como eletrólito, geralmente a 30% de concentração. O cádmio é o material do eletrodo negativo, não do eletrólito.",
    materia: "basico"
  },
  {
    id: 303,
    pergunta: "As linhas de força invisíveis que deixam um ímã em um ponto e entram em outro ponto são conhecidas como:",
    opcao_correta: "linhas de força",
    opcao_errada: "densidade de fluxo",
    explicacao: "As 'linhas de força' ou 'linhas de campo magnético' são as linhas imaginárias que representam a direção e intensidade do campo magnético, saindo do polo norte e entrando no polo sul. 'Densidade de fluxo' (B) é uma medida quantitativa da intensidade do campo magnético, não o nome das linhas em si.",
    materia: "basico"
  },
  {
    id: 304,
    pergunta: "O que pode resultar se água for adicionada a uma bateria de níquel-cádmio quando ela não está completamente carregada?",
    opcao_correta: "É provável que ocorra excesso de respingos durante o ciclo de carga",
    opcao_errada: "Diluição excessiva do eletrólito",
    explicacao: "Em baterias Ni-Cd, o nível do eletrólito varia com o estado de carga: mais baixo quando descarregada (eletrólito absorvido pelas placas), mais alto quando carregada. Se adicionar água com a bateria descarregada, quando ela carregar e o eletrólito expandir, transbordará. A 'diluição' não é o problema principal; o problema é o transbordamento de eletrólito corrosivo.",
    materia: "basico"
  },
  {
    id: 305,
    pergunta: "Um mecânico de manutenção licenciado pela ANAC, habilitado em célula e grupo motopropulsor, está autorizado a aprovar o retorno ao serviço de uma aeronave de aeroclube após uma inspeção de 100 horas. Qual das condições a seguir é obrigatória para essa autorização?",
    opcao_correta: "O mecânico precisa estar cadastrado na ANAC e a aeronave deve ser utilizada em operações não comerciais ou de instrução, sem organização de manutenção certificada",
    opcao_errada: "O mecânico deve possuir registro junto à ANAC e a aeronave deve estar sob a regulamentação do RBAC 121 ou 135",
    explicacao: "Conforme RBAC 43, para inspeções de 100 horas em aeroclubes, o mecânico precisa: 1) Ter habilitação em célula e GMP; 2) Estar cadastrado na ANAC; 3) A aeronave deve ser de aeroclube ou entidade governamental SEM organização de manutenção certificada (RBAC 145). A alternativa errada menciona RBAC 121/135 (aviação comercial), onde as regras são muito mais restritivas.",
    materia: "basico"
  },
  {
    id: 306,
    pergunta: "Uma aeronave tem um peso vazio de 950 libras. Se o peso bruto máximo permitido na categoria normal for 1800 libras e na categoria utilitária for 1600 libras, qual será a carga útil para cada categoria?",
    opcao_correta: "850 libras na categoria normal e 650 libras na categoria utilitária",
    opcao_errada: "950 libras em ambas as categorias, pois o peso vazio não influencia a carga útil",
    explicacao: "Carga útil = Peso bruto máximo - Peso vazio. Normal: 1800 - 950 = 850 lbs. Utilitária: 1600 - 950 = 650 lbs. O peso vazio É SUBTRAÍDO do peso bruto para calcular a carga útil - é exatamente o fator determinante!",
    materia: "basico"
  },
  {
    id: 307,
    pergunta: "Com algumas instalações de motores elétricos, a corrente de partida é tão alta que ela poderia superaquecer e danificar a fiação ou a armadura. Para evitar esse problema pode-se usar:",
    opcao_correta: "Uma resistência no circuito até que o motor ganhe velocidade",
    opcao_errada: "Um comutador de alta velocidade",
    explicacao: "A corrente de partida pode ser 5-10 vezes maior que a corrente nominal. Colocar uma resistência em série limita essa corrente inicial. Quando o motor atinge certa velocidade (e sua força contra-eletromotriz aumenta), a resistência é curto-circuitada. Um 'comutador de alta velocidade' não resolve este problema específico de corrente de partida.",
    materia: "basico"
  },
  {
    id: 308,
    pergunta: "Além de outros materiais, o pára-brisa de aeronave é confeccionado em material do tipo:",
    opcao_correta: "plástico",
    opcao_errada: "silicone",
    explicacao: "Os pára-brisas de aeronaves são feitos de plásticos acrílicos (como PMMA - polimetilmetacrilato) ou policarbonato, que oferecem transparência, resistência a impactos e facilidade de conformação aerodinâmica. Silicone é um material de vedação/encaixe, não estrutural para pára-brisas.",
    materia: "basico"
  },
  {
    id: 309,
    pergunta: "Na sentença Before installation, you must examine the gaskets already used to make sure that they are serviceable, a palavra Must indica?",
    opcao_correta: "Obrigação",
    opcao_errada: "Conselho",
    explicacao: "Em inglês técnico/aeronáutico, 'must' indica uma obrigação imperativa, um requisito mandatório. 'Should' indicaria recomendação/conselho. Em procedimentos de manutenção, 'must' significa que a ação é obrigatória para a segurança ou conformidade.",
    materia: "basico"
  },
  {
    id: 310,
    pergunta: "Numa das revisões de um helicóptero foram substituídas as pás do rotor principal porque estavam com o tempo de vida útil vencendo. Neste caso, o tipo de manutenção realizada foi:",
    opcao_correta: "preventiva",
    opcao_errada: "corretiva",
    explicacao: "A manutenção foi preventiva porque as pás foram substituídas antes de falharem, baseando-se no tempo de vida útil estabelecido pelo fabricante. A manutenção corretiva ocorre após uma falha ou defeito. A diferença crucial é que a preventiva age antecipadamente para prevenir problemas, enquanto a corretiva corrige problemas que já ocorreram.",
    materia: "inspecao"
  },
  {
    id: 311,
    pergunta: "Inspeções irregulares ou ocasionais resultará?",
    opcao_correta: "na deterioração gradual ou total da aeronave",
    opcao_errada: "em um programa de manutenção satisfatório",
    explicacao: "Inspeções irregulares permitem que pequenos defeitos passem despercebidos e se agravem com o tempo, levando a uma deterioração progressiva da aeronave. A alternativa errada é totalmente oposta à realidade, pois um programa satisfatório exige inspeções regulares e sistemáticas.",
    materia: "inspecao"
  },
  {
    id: 312,
    pergunta: "É constituído por folhas de dados que descrevem o projeto do tipo da aeronave e estabelecem as limitações estipuladas pela autoridade aeronáutica:",
    opcao_correta: "certificado de aprovação de aeronave",
    opcao_errada: "diretrizes de aeronavegabilidade",
    explicacao: "O Certificado de Aprovação de Aeronave (CAA) é o documento oficial que contém os dados técnicos do projeto aprovado e as limitações operacionais. As Diretrizes de Aeronavegabilidade (DA) são documentos que notificam sobre condições inseguras e exigem ações corretivas, mas não contêm os dados completos do projeto original.",
    materia: "inspecao"
  },
  {
    id: 313,
    pergunta: "As inspeções regularmente programadas são inspeções de caráter:",
    opcao_correta: "Preventivo",
    opcao_errada: "Reativo",
    explicacao: "Inspeções programadas são por definição preventivas, pois são realizadas em intervalos fixos (horas de voo, ciclos, tempo calendário) para prevenir falhas. Reativo é exatamente o oposto - ação tomada após a ocorrência de um problema.",
    materia: "inspecao"
  },
  {
    id: 314,
    pergunta: "Num avião que ficou parado (sem voar) durante um grande período de tempo, pode haver troca de componente do mesmo. Qual o sistema de controle usado para essa troca?",
    opcao_correta: "calendário",
    opcao_errada: "horas de voo",
    explicacao: "Quando uma aeronave fica parada por longo tempo, componentes podem deteriorar-se pelo envelhecimento natural (oxidação, ressecamento, etc.), independentemente do uso. Portanto, o controle é por calendário (dias, meses, anos). 'Horas de voo' é para componentes que se desgastam pelo uso, não pelo tempo parado.",
    materia: "inspecao"
  },
  {
    id: 315,
    pergunta: "Projetar uma radiação em uma peça, de modo a sensibilizar um filme, é um processo de inspeção por:",
    opcao_correta: "raio X",
    opcao_errada: "partículas magnéticas",
    explicacao: "A descrição é clara do processo radiográfico: radiação penetrante (raios X ou gama) atravessa a peça e sensibiliza um filme do outro lado, criando uma imagem interna. O ensaio por partículas magnéticas usa campo magnético e partículas ferromagnéticas, não envolve radiação nem filme.",
    materia: "inspecao"
  },
  {
    id: 316,
    pergunta: "A descontinuidade apresentada em um material durante uma inspeção por partículas magnéticas se deve:",
    opcao_correta: "ao campo magnético criado na própria peça",
    opcao_errada: "ao campo magnético que varia em oposição ao campo magnético original",
    explicacao: "No ensaio por partículas magnéticas, a peça é magnetizada. Descontinuidades (trincas, inclusões) criam pólos magnéticos locais que atraem as partículas ferromagnéticas, formando a indicação. A alternativa errada descreve incorretamente um fenômeno de oposição que não é o princípio básico.",
    materia: "inspecao"
  },
  {
    id: 317,
    pergunta: "O princípio básico da inspeção por líquidos penetrantes é:",
    opcao_correta: "capilar",
    opcao_errada: "movimento ondulatório",
    explicacao: "O princípio é a capilaridade - a capacidade do líquido penetrante de ser sugado para dentro de aberturas superficiais muito finas por ação capilar. 'Movimento ondulatório' não tem relação com este ensaio; é um conceito associado a ondas sonoras/ultrassônicas.",
    materia: "inspecao"
  },
  {
    id: 318,
    pergunta: "A inspeção utilizando ultra-som como teste de feixe direto e eco-pulso é indicada para localizar:",
    opcao_correta: "trincas paralelas ao plano da peça",
    opcao_errada: "corrosão intragranular no interior de peças de liga de alumínio",
    explicacao: "No feixe direto (perpendicular à superfície), o sinal reflete bem em descontinuidades paralelas ao plano de inspeção. Corrosão intragranular é um tipo de deterioração difusa e de difícil detecção por ultrassom convencional; não é a aplicação principal do feixe direto.",
    materia: "inspecao"
  },
  {
    id: 319,
    pergunta: "A inspeção MAGNAGLO é semelhante a de partículas magnéticas e a inspeção é feita sob luz:",
    opcao_correta: "negra",
    opcao_errada: "branca",
    explicacao: "O MagnaGlo usa partículas magnéticas fluorescentes. A inspeção é feita sob luz negra (UV-A) que faz as partículas brilharem intensamente, aumentando a sensibilidade. Luz branca comum não ativaria a fluorescência.",
    materia: "inspecao"
  },
  {
    id: 320,
    pergunta: "O documento emitido por uma autoridade de aviação civil destinado a notificar os donos de aeronaves e outros interessados sobre condições inseguras em um produto aeronáutico e orientar sobre as medidas que deverão ser tomadas para que esses produtos possam continuar sendo operados é o (a):",
    opcao_correta: "diretriz de aeronavegabilidade",
    opcao_errada: "boletim de serviço",
    explicacao: "A Diretriz de Aeronavegabilidade (DA) é um documento mandatório emitido pela autoridade (ANAC) para notificar sobre condições inseguras e exigir ações corretivas. O Boletim de Serviço é emitido pelo fabricante e pode conter melhorias ou modificações, mas não tem caráter mandatório como a DA.",
    materia: "inspecao"
  },
  {
    id: 321,
    pergunta: "As condições sobre a Segurança do Voo podem ser divididas em duas categorias que são:",
    opcao_correta: "aquelas de caráter de emergência, exigindo imediato cumprimento após notificação; aquelas de caráter menos urgente, estipulando um prazo para o cumprimento das medidas corretivas",
    opcao_errada: "obrigatórias e satisfatórias",
    explicacao: "A divisão correta baseia-se na urgência: condições de emergência (cumprimento imediato) e menos urgentes (prazo estabelecido). 'Obrigatórias e satisfatórias' não é uma classificação oficial para condições de segurança de voo.",
    materia: "inspecao"
  },
  {
    id: 322,
    pergunta: "São essenciais para garantir a operação segura das aeronaves e a conformidade com os padrões de segurança estabelecidos. Quando condições comprometedoras são identificadas, os proprietários de aviões e outras partes interessadas são notificados, recebendo orientações sobre as medidas corretivas que devem ser tomadas para garantir a segurança. O texto refere-se a:",
    opcao_correta: "DIRETRIZES DE AERONAVEGABILIDADE",
    opcao_errada: "PUBLICAÇÕES",
    explicacao: "O texto descreve exatamente a função das Diretrizes de Aeronavegabilidade (DA). 'Publicações' é um termo genérico que pode incluir vários documentos, mas não especifica o documento mandatório de notificação de condições inseguras.",
    materia: "inspecao"
  },
  {
    id: 323,
    pergunta: "Que tipo de documento é emitido pelo ANAC para notificar os proprietários quanto ao risco à segurança de voo por falha de material ou equipamento:",
    opcao_correta: "diretriz de aeronavegabilidade",
    opcao_errada: "boletim de serviço",
    explicacao: "A ANAC emite Diretrizes de Aeronavegabilidade para notificar sobre riscos à segurança. Boletim de Serviço é do fabricante. Esta é uma confusão comum: a autoridade reguladora emite DAs (mandatórias); o fabricante emite Boletins (recomendações que podem se tornar mandatórias se referendadas pela autoridade).",
    materia: "inspecao"
  },
  {
    id: 324,
    pergunta: "Na documentação do avião, o livro de bordo possui uma função central no controle técnico. Qual das alternativas descreve corretamente a abrangência desse documento em relação à manutenção e operação da aeronave?",
    opcao_correta: "O livro de bordo apresenta histórico de estrutura, motores e acessórios, incluindo inspeções, tempos acumulados e serviços realizados.",
    opcao_errada: "O livro de bordo fornece exclusivamente informações sobre combustível consumido e horas de voo totais da aeronave.",
    explicacao: "O Livro de Bordo (Technical Log) é o histórico vivo da aeronave, registrando todos os aspectos técnicos: inspeções, serviços, tempos de componentes, discrepâncias, etc. A alternativa errada reduz erroneamente sua função a apenas dois itens, ignorando sua abrangência completa.",
    materia: "inspecao"
  },
  {
    id: 325,
    pergunta: "Especificações 'ATA 100', do sistema Pneumático corresponde a qual capítulo?",
    opcao_correta: "Capítulo 36",
    opcao_errada: "Capítulo 45",
    explicacao: "No sistema de numeração ATA 100, o Capítulo 36 corresponde ao Sistema Pneumático. O Capítulo 45 é para Sistemas de Indicadores e Alertas. É comum confundir com capítulos de sistemas adjacentes.",
    materia: "inspecao"
  },
  {
    id: 326,
    pergunta: "De acordo com o sistema de padronização de manuais 'ata100', qual capítulo corresponde o sistema de trem de pouso?",
    opcao_correta: "Capítulo 32",
    opcao_errada: "Capítulo 12",
    explicacao: "O Capítulo 32 da ATA 100 é dedicado ao Trem de Pouso. O Capítulo 12 trata de Servicing (Abastecimento e Serviços) - uma confusão comum por ambos estarem relacionados a operações no solo, mas com funções diferentes.",
    materia: "inspecao"
  },
  {
    id: 327,
    pergunta: "Sobre a especificação 'ATA-100', é correto afirmar:",
    opcao_correta: "Criou um padrão de apresentação de dados técnicos para manuais de aviação Civil",
    opcao_errada: "Criou uma norma de segurança internacional para procedimentos de manutenção visando a padronização e segurança",
    explicacao: "A ATA 100 é especificamente um padrão de numeração e estrutura para manuais técnicos na aviação civil. A alternativa errada atribui a ela uma função mais ampla de 'norma de segurança', quando na verdade é uma estrutura de documentação. As normas de segurança são estabelecidas por autoridades como ICAO, FAA, ANAC.",
    materia: "inspecao"
  },
  {
    id: 328,
    pergunta: "Qual manual que apresenta as informações específicas do fabricante para realizar reparo de estruturas primária e secundárias?",
    opcao_correta: "Manual de reparos estruturais",
    opcao_errada: "Manual de revisão",
    explicacao: "O Manual de Reparos Estruturais (SRM - Structural Repair Manual) contém as instruções aprovadas pelo fabricante para reparos em estruturas primárias e secundárias. O Manual de Revisão geralmente se refere a um manual de overhaul/inspeção de componentes, não específico para reparos estruturais.",
    materia: "inspecao"
  },
  {
    id: 329,
    pergunta: "Havendo necessidade de ser reparada uma chapa da seção da fuselagem, a publicação a ser consultada é o(a):",
    opcao_correta: "manual de reparos estruturais",
    opcao_errada: "catálogo ilustrado de peças",
    explicacao: "Para reparar uma chapa da fuselagem, consulta-se o Manual de Reparos Estruturais que contém os procedimentos aprovados. O Catálogo Ilustrado de Peças (IPC) serve para identificar e solicitar peças, não contém procedimentos de reparo.",
    materia: "inspecao"
  },
  {
     id: 330,
    pergunta: "Por que os combustíveis de jato não podem ser identificados visualmente?",
    opcao_correta: "Porque variam de incolores a cor de palha (âmbar), dependendo da idade e origem do petróleo cru",
    opcao_errada: "Porque são sempre incolores e transparentes",
    explicacao: "Os combustíveis de jato não têm corantes adicionados. Sua cor varia naturalmente conforme a origem do petróleo e tempo de armazenamento, podendo ser desde incolores até âmbar. AVGAS tem cores específicas (púrpura, verde, azul) por adição de corantes, mas o combustível de jato não.",
    materia: "revbasico"
  },
  {
    id: 331,
    pergunta: "Qual é o principal efeito do atrito entre o ar e a superfície de uma asa durante o voo?",
    opcao_correta: "O atrito reduz a velocidade do ar próximo à superfície, formando uma camada limite de baixa velocidade.",
    opcao_errada: "O atrito aumenta a velocidade do fluxo de ar sobre a asa, diminuindo o arrasto e ampliando a sustentação.",
    explicacao: "O atrito faz com que as moléculas de ar em contato com a superfície fiquem quase paradas, criando uma camada limite com velocidade gradativa. Isso gera arrasto de fricção, não aumenta a velocidade nem a sustentação.",
    materia: "revbasico"
  },
  {
    id: 332,
    pergunta: "Em uma aeronave equipada com um sistema de alimentação por pressão, qual das situações abaixo pode exigir o uso das bombas auxiliares?",
    opcao_correta: "Durante a partida do motor e para suprir combustível ao sistema de injetores",
    opcao_errada: "Para manter a pressão de combustível quando a aeronave estiver no solo, antes do reabastecimento",
    explicacao: "Bombas auxiliares (elétricas) são usadas principalmente para fornecer pressão durante a partida, decolagem, pouso, e para alimentar injetores. Não são específicas para reabastecimento.",
    materia: "revbasico"
  },
  {
    id: 333,
    pergunta: "Marque abaixo a característica do flap tipo fowler:",
    opcao_correta: "São um tipo de flap com fenda. Esse design de flap não apenas muda a curvatura da asa, mas também aumenta a área da asa. Em vez de girar para baixo em uma dobradiça, ele desliza para trás em trilhos.",
    opcao_errada: "Trata-se de uma variação de flap simples que possui abertura. Este modelo não só altera o formato curvo da asa como também amplia sua superfície. Diferentemente de outros tipos que se movimentam para trás através de uma articulação, este se desloca para baixo utilizando um sistema de trilhos.",
    explicacao: "O flap Fowler se desloca para trás em trilhos, aumentando a área da asa, e depois se inclina para baixo. A alternativa errada descreve incorretamente o movimento ('desloca para baixo').",
    materia: "revbasico"
  },
  {
    id: 334,
    pergunta: "Um conjunto de trem de pouso apresenta rachaduras por fadiga suspeitas. O inspetor decide usar MAGNAGLO sob luz negra. Em termos de ponto de atuação e efeito colateral, qual escolha descreve corretamente o método?",
    opcao_correta: "Atua predominantemente em descontinuidades superficiais e rasas; o contraste fluorescente acelera a percepção de indicações pequenas, exigindo posterior desmagnetização e lavagem.",
    opcao_errada: "Atua apenas em cavidades internas profundas; o uso de óleo fluorescente dispensa desmagnetização, evitando retenção de partículas.",
    explicacao: "Magnaglo é um método de partículas magnéticas fluorescentes que detecta principalmente descontinuidades superficiais e rasas. Requer desmagnetização e limpeza após o uso. Não é para cavidades profundas nem dispensa desmagnetização.",
    materia: "revbasico"
  },
  {
    id: 335,
    pergunta: "Qual dos punções abaixo é utilizada para fazer marcas de referência no metal?",
    opcao_correta: "bico",
    opcao_errada: "vazador",
    explicacao: "O punção de bico (ou de marcação) é usado para fazer pequenas marcas de referência no metal, como para transferir medidas de um desenho. O vazador é para outros fins, como abrir furos iniciais.",
    materia: "revbasico"
  },
  {
    id: 336,
    pergunta: "A distância compreendida entre os limites dianteiro e traseiro do c.g., conforme indicado na Especificação da Aeronave é o passeio:",
    opcao_correta: "Operacional",
    opcao_errada: "Máximo",
    explicacao: "O passeio operacional do CG é a distância entre os limites dianteiro e traseiro permitidos para operação da aeronave. 'Máximo' se refere a outras características (como peso), não ao CG.",
    materia: "revbasico"
  },
  {
    id: 337,
    pergunta: "Deseja-se construir um voltímetro com escala de 0-10 volts, mas tudo de que se dispõe é um miliamperímetro com escala de 0-1 miliampère e resistência interna de 50 ohms. Para fazer o voltímetro desejado, é necessário ligar um resistor de:",
    opcao_correta: "9.950 ohms em série",
    opcao_errada: "05 ohms em paralelo",
    explicacao: "Para medir tensão, coloca-se um resistor em série com o amperímetro (multiplier). Cálculo: Para 10V e corrente máxima de 1mA (0,001A), pela Lei de Ohm: R_total = 10V / 0,001A = 10.000 Ω. Subtrai a resistência interna (50 Ω): 10.000 - 50 = 9.950 Ω em série.",
    materia: "revbasico"
  },
  {
     id: 338,
    pergunta: "Qual RBAC trata sobre Pessoas autorizadas a executar manutenção, manutenção preventiva, reconstrução e alteração em artigo aeronáutico?",
    opcao_correta: "D RBAC 43",
    opcao_errada: "C RBAC 65",
    explicacao: "O RBAC 43 ('Manutenção, Reconstrução e Alteração de Aeronave') define quem está autorizado a realizar manutenção e alterações. O RBAC 65 trata de certificação de pessoal (mecânicos, pilotos), mas a autorização específica para executar o trabalho está no RBAC 43.",
    materia: "revbasico"
  },
  {
    id: 339,
    pergunta: "Em uma aeronave, o ângulo agudo formado pela corda da asa e o eixo longitudinal da aeronave é chamado de:",
    opcao_correta: "D Ângulo de incidência",
    opcao_errada: "C Ângulo de ataque",
    explicacao: "Ângulo de incidência: ângulo fixo entre a corda da asa e o eixo longitudinal da aeronave (projeto da aeronave). Ângulo de ataque: ângulo variável entre a corda da asa e o vetor vento relativo (depende da atitude da aeronave).",
    materia: "revbasico"
  },
  {
    id: 340,
    pergunta: "A liga 2024 é formada por alumínio e:",
    opcao_correta: "C Cobre",
    opcao_errada: "D Magnésio e silício",
    explicacao: "A liga 2024 é uma liga de alumínio-cobre (principalmente cobre, com magnésio e manganês). A liga que contém magnésio e silício é a 6061.",
    materia: "revbasico"
  },
  {
    id: 341,
    pergunta: "Um ciclo representa:",
    opcao_correta: "C Duas reversões completas de direção.",
    opcao_errada: "A Quatro reversões completas de direção.",
    explicacao: "Um ciclo em aeronáutica (para análise de fadiga) é definido como duas reversões completas de tensão (de tração para compressão e volta). Exemplo: uma decolagem + pouso = 1 ciclo.",
    materia: "revbasico"
  },
  {
    id: 342,
    pergunta: "Em um sistema de extinção de fogo, que utiliza as garrafas de dióxido de carbono, equipadas com tubos sifão reto e rígido, as garrafas devem ser instaladas na posição vertical observa-se que o tubo sifão reto e rígido tem uma tolerância de inclinação de quantos graus?",
    opcao_correta: "B De 60º",
    opcao_errada: "A De 90º",
    explicacao: "Garrafas de CO₂ com tubo sifão reto e rígido devem ser instaladas na vertical, com tolerância máxima de 60º de inclinação. Isso garante que o CO₂ líquido seja expelido adequadamente quando acionado.",
    materia: "revbasico"
  },
  {
    id: 343,
    pergunta: "No exemplo: 'The airplane can carry 100 passengers.' O verbo CAN significa:",
    opcao_correta: "C Possibilidade",
    opcao_errada: "B limitação",
    explicacao: "Na frase, 'can' indica capacidade/possibilidade (pode transportar). 'Limitação' seria expressa por 'cannot' ou 'only'. Em aviação, 'can' frequentemente descreve capacidade operacional.",
    materia: "revbasico"
  },
  {
    id: 348,
    pergunta: "Elemento mais indicado e utilizado para proteger o aço contra a corrosão e desgaste?",
    opcao_correta: "Zinco e Cromo",
    opcao_errada: "Níquel cádmio",
    explicacao: "O zinco é o principal elemento usado na proteção do aço contra corrosão porque atua como ânodo de sacrifício. Isso significa que, mesmo se o revestimento for danificado, o zinco se corrói no lugar do aço, protegendo o metal base. O cromo, embora seja muito resistente ao desgaste e dê acabamento superficial, não protege galvanicamente o aço quando há falhas no revestimento. Ele funciona apenas como barreira física. A alternativa Níquel cádmio confunde porque o níquel também é usado como revestimento em alguns contextos, mas não é o principal método anticorrosivo do aço na indústria aeronáutica, nem atua como ânodo de sacrifício como o zinco.",
    materia: "revbasico"
  },
  {
    id: 349,
    pergunta: "Forma aerodinâmica que provoca uma reação útil quando se deslocando no ar:",
    opcao_correta: "Aerofólio",
    opcao_errada: "Superfície aerodinâmica",
    explicacao: "Um aerofólio é uma forma aerodinâmica projetada especificamente para transformar o escoamento do ar em força útil, como sustentação ou tração (exemplos: asa, pá de hélice, rotor). Já superfície aerodinâmica é um termo genérico, que inclui várias partes da aeronave, inclusive superfícies que não geram força útil, como carenagens. A palavra-chave 'reação útil no ar' indica diretamente aerofólio.",
    materia: "revbasico"
  },
  {
    id: 350,
    pergunta: "Qual a principal característica que distingue o funcionamento de um compensador antiservo em relação à guia de balanceamento tradicional?",
    opcao_correta: "O compensador antiservo se move na mesma direção da superfície de controle, aumentando a resistência ao movimento.",
    opcao_errada: "O compensador antiservo se move na direção oposta, aliviando a força aplicada no manche de comando.",
    explicacao: "A guia de balanceamento (trim/tab) move-se em sentido oposto para aliviar esforço. O compensador antiservo move-se no mesmo sentido da superfície de controle. Esse movimento aumenta a resistência nos comandos, deixando o controle mais 'pesado' e evitando sobrecontrole, principalmente em estabilizadores totalmente móveis. Resumo: Antiservo = anti-sensibilidade; Mesmo sentido = mais esforço.",
    materia: "revbasico"
  },
  {
    id: 351,
    pergunta: "Em um parafuso do tipo 1-14NF o número 14 significa?",
    opcao_correta: "O número de fios de rosca, em cada polegada da parte rosqueada",
    opcao_errada: "O comprimento total do parafuso em milímetros",
    explicacao: "A designação 1-14NF significa: 1 → diâmetro nominal (em polegadas); 14 → número de fios de rosca por polegada; NF → National Fine (rosca fina). Comprimento nunca aparece nessa nomenclatura. É uma pegadinha comum tentar confundir rosca com comprimento.",
    materia: "revbasico"
  },
  {
    id: 352,
    pergunta: "Na frase “Fui a a área de manutenção”, apresenta qual vício de linguagem?",
    opcao_correta: "Colisão",
    opcao_errada: "Barbarismo",
    explicacao: "Colisão ocorre quando há repetição desagradável de sons iguais, normalmente vogais ou consoantes consecutivas. Exemplo: 'Fui a a área' - som repetido da vogal 'a', gerando ruído fonético. Barbarismo é erro gramatical ou uso inadequado da língua (ex: 'menas', 'concerteza'), o que não ocorre aqui.",
    materia: "revbasico"
  },
  {
    id: 353,
    pergunta: "Quando ligamos duas baterias em série:",
    opcao_correta: "Somamos as tensões (DDP ou V) e não alteramos a corrente (A)",
    opcao_errada: "Teremos a tensão constante e somam-se as correntes",
    explicacao: "Ligação em série: Tensão soma, Corrente permanece a mesma. Ligação em paralelo é exatamente o contrário: Corrente soma, Tensão constante. Macete: Série → soma V; Paralelo → soma A.",
    materia: "revbasico"
  },
  {
    id: 354,
    pergunta: "A velocidade do som depende diretamente da:",
    opcao_correta: "Temperatura do ar",
    opcao_errada: "Densidade do ar",
    explicacao: "A velocidade do som no ar depende diretamente da temperatura e não da densidade ou pressão, quando consideradas separadamente. Fisicamente: a temperatura está ligada à energia cinética das moléculas. Quanto maior a temperatura, maior a agitação molecular, e o som se propaga mais rápido. Pressão e densidade não alteram a velocidade do som isoladamente, pois em um gás ideal elas se compensam.",
    materia: "revbasico"
  },
  {
    id: 355,
    pergunta: "Os comandos de voo transmitidos do cíclico e do coletivo, para as pás, através da estrela:",
    opcao_correta: "Estacionária e da rotativa",
    opcao_errada: "Rotativa e das engrenagens",
    explicacao: "No sistema do rotor principal do helicóptero existem duas estrelas: Estrela estacionária → recebe os comandos do piloto (cíclico e coletivo). Estrela rotativa → gira junto com o rotor e transmite os comandos às pás. As engrenagens não participam da transmissão direta dos comandos aerodinâmicos às pás. Sequência correta: Comandos → estrela estacionária → estrela rotativa → pás.",
    materia: "revbasico"
  },
  {
    id: 356,
    pergunta: "O elemento da aeronave responsável por possibilitar a superação da resistência aerodinâmica é o(a):",
    opcao_correta: "Grupo moto-propulsor",
    opcao_errada: "Aerofólio",
    explicacao: "O arrasto é vencido pelo empuxo, e quem gera empuxo é o grupo moto-propulsor (motor + hélice ou turbina). Asa/aerofólio gera sustentação. Grupo moto-propulsor gera empuxo. Sem empuxo suficiente, a aeronave não supera o arrasto, mesmo com asas eficientes. Forças do voo: Sustentação ↔ Peso; Empuxo ↔ Arrasto.",
    materia: "revbasico"
  },
  {
    id: 357,
    pergunta: "De acordo com as regras que governam a densidade dos gases, como a densidade varia com a pressão?",
    opcao_correta: "Varia diretamente com a pressão",
    opcao_errada: "Varia inversamente com a pressão",
    explicacao: "Mantida a temperatura constante, a relação é direta: Pressão ↑ → moléculas mais comprimidas → densidade ↑. Pressão ↓ → moléculas mais afastadas → densidade ↓. A confusão ocorre porque: Temperatura varia inversamente com a densidade, mas Pressão varia diretamente com a densidade.",
    materia: "revbasico"
  },
  {
     id: 358,
    pergunta: "Na decolagem o ângulo de uma hélice:",
    opcao_correta: "Mínimo",
    opcao_errada: "Máximo",
    explicacao: "Na decolagem, a hélice deve permitir máxima rotação do motor (RPM). Isso só ocorre com ângulo mínimo da pá, pois há menor resistência ao giro e maior aceleração inicial, fornecendo máxima potência disponível. Ângulo máximo é usado em cruzeiro, não na arrancada. Regra: Decolagem = ângulo mínimo (igual à 1ª marcha de um carro).",
    materia: "helice"
  },
  {
    id: 359,
    pergunta: "O ângulo formado entre a corda da pá e o plano de rotação denomina-se ângulo de:",
    opcao_correta: "Ângulo da pá",
    opcao_errada: "Ângulo de ataque",
    explicacao: "Ângulo da pá → é o ângulo geométrico entre a corda da pá e o plano de rotação (fixo, definido pela construção). Ângulo de ataque → é o ângulo aerodinâmico entre a corda da pá e o vento relativo (variável, depende do fluxo de ar). A banca frequentemente troca esses conceitos.",
    materia: "helice"
  },
  {
    id: 360,
    pergunta: "É correto afirmar que a hélice transforma a força de rotação em:",
    opcao_correta: "Tração",
    opcao_errada: "Empuxo",
    explicacao: "Na terminologia clássica da ANAC e da aviação convencional: Hélice gera Tração (força de puxar/puxão). Jato / foguete gera Empuxo (força de impulso). Fisicamente são semelhantes, mas a banca cobra o termo correto específico para cada sistema propulsivo.",
    materia: "helice"
  },
  {
    id: 361,
    pergunta: "O governador da hélice é basicamente um(a):",
    opcao_correta: "Bomba hidráulica",
    opcao_errada: "Acumulador de pressão",
    explicacao: "O governador é essencialmente uma bomba hidráulica que gera e regula a pressão do óleo para controlar o passo da hélice. Ele não armazena pressão (função do acumulador), mas sim a gera e modula para manter a RPM constante conforme as condições de voo.",
    materia: "helice"
  },
  {
    id: 362,
    pergunta: "A bainha da pá (cuff) é uma estrutura de metal, madeira ou:",
    opcao_correta: "Plástico",
    opcao_errada: "Borracha neoprene",
    explicacao: "A bainha (cuff) é uma estrutura rígida que dá formato aerodinâmico à raiz da pá e ajuda no fluxo de ar de refrigeração. É fabricada em materiais estruturais como metal, madeira ou plástico. Borracha (neoprene) não mantém o perfil aerodinâmico necessário e não é usada como material estrutural da bainha.",
    materia: "helice"
  },
  {
    id: 363,
    pergunta: "Como e onde é encontrada a identificação de uma hélice de metal?",
    opcao_correta: "Caracteres estampados no cubo",
    opcao_errada: "Caracteres estampados na raiz da pá",
    explicacao: "Por norma, a identificação oficial (número de série, modelo, aprovações) de uma hélice de metal é estampada no cubo (hub). A raiz da pá não é o local de referência legal para essa identificação. A ANAC cobra o local exato conforme os padrões técnicos.",
    materia: "helice"
  },
  {
    id: 364,
    pergunta: "Com relação às bainhas das pás, qual alternativa ERRADA?",
    opcao_correta: "Adesivos de borracha ou epóxi podem causar corrosão…",
    opcao_errada: "Adesivos à base de borracha ou epóxi geralmente são usados como agentes de colagem",
    explicacao: "Pegadinha: Adesivos à base de borracha ou epóxi podem ser usados como agentes de colagem (afirmação verdadeira). A alternativa tecnicamente incorreta (e, portanto, a resposta correta para 'qual é ERRADA') é a que omite ou nega o risco de que tais adesivos possam causar corrosão em certas condições. A banca quer a afirmação que está errada, não apenas incompleta.",
    materia: "helice"
  },
  {
    id: 365,
    pergunta: "Seu funcionamento baseia-se totalmente na força centrífuga:",
    opcao_correta: "Governador",
    opcao_errada: "Came rotativo",
    explicacao: "O governador da hélice funciona baseado na força centrífuga agindo sobre contrapesos, que movem uma válvula piloto para controlar o fluxo de óleo e, consequentemente, o passo da hélice. O came rotativo é um componente que converte movimento linear em rotativo, mas não é o elemento regulador principal baseado na força centrífuga.",
    materia: "helice"
  },
  {
     id: 366,
    pergunta: "Durante a operação do motor a pistão em aeronaves com carburador, qual é um efeito colateral crítico do uso prolongado e inadequado do aquecimento do carburador, especialmente em fases de alta potência como a decolagem?",
    opcao_correta: "A elevação da temperatura do ar de admissão, reduzindo a densidade do ar e comprometendo a eficiência volumétrica do motor e também pode causar detonação e falha do motor.",
    opcao_errada: "O aquecimento do ar de entrada provoca aumento da densidade atmosférica, resultando em menor eficiência volumétrica do propulsor, além de poder ocasionar fenômenos de detonação e consequente avaria do conjunto motor.",
    explicacao: "O aquecimento do carburador eleva a temperatura do ar admitido, o que reduz sua densidade. Menor densidade = menos oxigênio disponível = pior eficiência volumétrica. Em alta potência (decolagem), isso é crítico porque o motor já opera próximo dos limites térmicos e ar quente favorece detonação, podendo levar a falha do motor. A alternativa errada tenta enganar dizendo que o aquecimento aumenta a densidade, o que é fisicamente impossível (ar quente é menos denso).",
    materia: "revisao"
  },
  {
    id: 367,
    pergunta: "Num motor térmico cujo atraso de escapamento é de 20°, a válvula de escapamento:",
    opcao_correta: "Fecha 20° após o ponto morto alto",
    opcao_errada: "Abre 20° após o ponto morto alto",
    explicacao: "O termo 'atraso de escapamento' se refere ao momento de FECHAMENTO da válvula de escapamento. Portanto, um atraso de 20° significa que a válvula fecha 20° após o ponto morto alto (PMA). A alternativa errada troca abrir por fechar, um erro clássico. Lembre-se: atraso → fechamento após o PMA; antecipação → abertura antes do PMA.",
    materia: "revisao"
  },
  {
    id: 368,
    pergunta: "O fenômeno conhecido como zumbido em dutos de admissão em voos supersônicos está relacionado a qual condição aerodinâmica?",
    opcao_correta: "Instabilidade do ar causada pela oscilação da onda de choque na tomada de ar.",
    opcao_errada: "Compressibilidade do ar em regime subsônico, causando perda de pressão dinâmica na admissão.",
    explicacao: "O zumbido (buzz) é um fenômeno aerodinâmico típico de voos supersônicos, ocorrendo quando a onda de choque na entrada do duto de admissão não se estabiliza, oscilando para dentro e para fora repetidamente. Isso gera flutuações de pressão, instabilidade no fluxo e ruído característico. A alternativa errada mistura conceitos reais (compressibilidade) com o regime errado (subsônico); o problema é supersônico e relacionado à oscilação da onda de choque.",
    materia: "revisao"
  },
  {
    id: 369,
    pergunta: "Conector resistente à vibração e à umidade é de:",
    opcao_correta: "Classe D",
    opcao_errada: "Classe K",
    explicacao: "O conector Classe D é projetado especificamente para ambientes adversos, possuindo ilhós selante de borracha que proporciona vedação eficaz contra umidade e alta resistência à vibração. A Classe K não possui essas características de vedação reforçada. Na classificação ANAC, Vibração + Umidade = Classe D.",
    materia: "revisao"
  },
  {
    id: 370,
    pergunta: "Aumentando o ângulo da pá de uma hélice ocorrerá o aumento do(a):",
    opcao_correta: "Tração",
    opcao_errada: "Arrasto",
    explicacao: "Ao aumentar o ângulo da pá (aumentar o passo), a hélice 'morde' mais ar, movendo maior massa de ar por rotação, o que aumenta a tração produzida, desde que o motor tenha potência suficiente. O arrasto também pode aumentar, mas não é o efeito útil primário cobrado pela banca nesta formulação. Resumo: Ângulo da pá ↑ → Passo ↑ → Massa de ar ↑ → Tração ↑",
    materia: "motores2"
  },
  {
    id: 371,
    pergunta: "No sistema de extinção de fogo com CO₂ em aeronaves quadrimotores, qual a função do disco vermelho do conjunto de garrafas?",
    opcao_correta: "Romper-se em caso de sobrepressão ou temperatura acima de 74 °C",
    opcao_errada: "Atuar como válvula de alívio durante a descarga para estabilizar a pressão de saída",
    explicacao: "O disco vermelho é um dispositivo de segurança, não de controle. Ele se rompe quando há sobrepressão ou quando a temperatura atinge valores críticos (ex: acima de 74 °C), evitando a explosão da garrafa. Ele não regula pressão durante a descarga, apenas protege o sistema contra falha estrutural.",
    materia: "motores2"
  },
  {
    id: 372,
    pergunta: "Qual é o papel da unidade de controle nos sistemas de detecção contínua aplicados aos motores?",
    opcao_correta: "No Kidde, medir constantemente a resistência total do sensor; no Fenwal, acionar o alarme por meio de amplificador magnético",
    opcao_errada: "No Kidde, detectar apenas a taxa de aumento de temperatura; no Fenwal, comparar resistência de múltiplos sensores em série",
    explicacao: "Sistema Kidde: mede continuamente a resistência total do sensor (sistema proporcional, detecta temperatura média e pontos quentes). Sistema Fenwal: aciona o alarme por meio de um amplificador magnético quando um sal eutético no sensor se funde (sistema não proporcional/binário). A alternativa errada confunde com sistemas de taxa de aumento e sensores em série, que não correspondem ao funcionamento dos sistemas Kidde e Fenwal contínuos.",
    materia: "motores2"
  },
  {
    id: 373,
    pergunta: "A distância mínima entre um fio elétrico e uma tubulação é de:",
    opcao_correta: "1/2 polegada",
    opcao_errada: "1 polegada",
    explicacao: "Norma de instalação aeronáutica estabelece distância mínima de 1/2 polegada. Entre 1/2” e 2” deve-se usar luva protetora. Quando não for possível maior separação, os elementos devem ser fixados juntos na mesma estrutura. 1 polegada parece 'mais seguro', mas não é o valor normativo mínimo exigido.",
    materia: "motores2"
  },
  {
    id: 374,
    pergunta: "A combustão espontânea da carga não queimada à frente da chama chama-se:",
    opcao_correta: "Detonação",
    opcao_errada: "Pré-ignição",
    explicacao: "Detonação: combustão explosiva e descontrolada que ocorre após a ignição normal, na carga ainda não queimada à frente da frente de chama. Pré-ignição: inflamação da mistura antes da centelha, causada por um ponto quente (vela, válvula, depósito de carvão). A descrição da questão é exatamente a definição de detonação.",
    materia: "motores2"
  },
  {
    id: 375,
    pergunta: "Qual a principal vantagem do magneto sobre o sistema de ignição por bateria?",
    opcao_correta: "O magneto tem sua própria fonte de energia elétrica e não depende da bateria",
    opcao_errada: "Magneto é mais eficiente em altas altitudes",
    explicacao: "A grande vantagem do magneto é ser independente do sistema elétrico da aeronave; ele gera sua própria energia a partir da rotação do motor, continuando a funcionar mesmo com falha elétrica total (bateria ou alternador). A eficiência em altitude não é a característica primária ou vantagem definidora do magneto.",
    materia: "motores2"
  },
  {
    id: 376,
    pergunta: "Se a caixa de engrenagens reduz a velocidade na proporção 6:1 e a hélice gira a 3000 RPM, qual a rotação do eixo de manivelas?",
    opcao_correta: "18.000 RPM",
    opcao_errada: "1800 RPM",
    explicacao: "Redução de 6:1 significa que para cada 6 voltas do eixo de manivelas (motor), a hélice dá 1 volta. Portanto, a rotação do motor é a rotação da hélice multiplicada pela relação de redução: RPM motor = RPM hélice × 6 = 3000 × 6 = 18.000 RPM. A alternativa errada resulta de dividir (3000/6 = 500) ou de um erro de cálculo.",
    materia: "motores2"
  },
  {
    id: 377,
    pergunta: "Quanto as linhas de centro a afirmativa incorreta é?",
    opcao_correta: "indicam o plano no qual uma vista seccional do objeto é tomada",
    opcao_errada: "elas indicam o centro do objeto ou parte do objeto",
    explicacao: "A afirmativa incorreta é a que diz 'indicam o plano no qual uma vista seccional do objeto é tomada'. As linhas de centro (traços longos e curtos) são usadas para indicar o centro do objeto ou parte do objeto, não o plano de uma vista seccional. O plano de uma vista seccional é indicado por linhas de corte específicas, não pelas linhas de centro.",
    materia: "revbasico"
  },
  {
    id: 378,
    pergunta: "O ângulo no qual a ponta da broca é afiada é chamada de ângulo da ponta da broca. Nas brocas padrão, usadas para cortar aço e ferro fundido, o ângulo de corte será de:",
    opcao_correta: "59º de cada lado do centro",
    opcao_errada: "90º de cada lado do centro",
    explicacao: "O ângulo da ponta da broca padrão (ângulo de corte) para materiais como aço e ferro fundido é de 59º de cada lado do eixo central da broca, totalizando 118º de ângulo de ponta. O ângulo de 90º (total de 180º) seria inadequado e não proporcionaria um corte eficiente nestes materiais.",
    materia: "revbasico"
  },
  {
    id: 379,
    pergunta: "São cuidados devem ser tomados ao utilizar macacos na suspensão de aeronaves com objetivo de realizar uma pesagem, exceto:",
    opcao_correta: "Pode usar qualquer ferramenta não homolgada pelo fabricante, desde que o mecânico assuma a responsabilidade",
    opcao_errada: "Deve ser feito em pontos específicos, na posição nivelada e protegido do vento",
    explicacao: "O uso de ferramentas não homologadas pelo fabricante para suspensão e pesagem de aeronaves é sempre proibido, independentemente de o mecânico assumir a responsabilidade. A segurança em tais operações é regida por normas rígidas que exigem equipamentos aprovados. As demais opções descrevem cuidados obrigatórios e corretos: usar pontos específicos, nivelar a aeronave e protegê-la do vento.",
    materia: "revbasico"
  },
  {
    id: 380,
    pergunta: "As tubulações de metal são medidas pelo (a):",
    opcao_correta: "diâmetro externo",
    opcao_errada: "diâmetro interno",
    explicacao: "As tubulações (tubos) de metal na aviação são padronizadamente medidas pelo seu diâmetro externo. Essa convenção facilita a especificação, seleção e instalação, garantindo compatibilidade com conexões e suportes dimensionados para o diâmetro externo do tubo.",
    materia: "revbasico"
  },
  {
    id: 381,
    pergunta: "A designação 5x15, dada a um cabo de comando, significa que o mesmo é confeccionado com:",
    opcao_correta: "5 pernas e 15 fios",
    opcao_errada: "5 pernas com 15 polegadas de diâmetro",
    explicacao: "A designação 5x15 para cabos de comando significa que o cabo é constituído por 5 pernas (ou cordões), e cada perna é composta por 15 fios de aço. É uma especificação de construção, não de diâmetro. O diâmetro do cabo é especificado separadamente.",
    materia: "revbasico"
  },
  {
    id: 382,
    pergunta: "O código de cores, a faixa que indica tolerância do valor ôhmico do resistor é a:",
    opcao_correta: "quarta",
    opcao_errada: "terceira",
    explicacao: "No sistema de codificação de cores de resistores de 4 faixas: a primeira e segunda faixas indicam os dígitos significativos, a terceira faixa indica o multiplicador (quantidade de zeros), e a quarta faixa indica a tolerância (variação percentual permitida no valor). Portanto, a tolerância é sempre indicada pela quarta faixa.",
    materia: "revbasico"
  },
  {
    id: 383,
    pergunta: "A instalação ou remoção de equipamentos modifica o peso vazio e o CG da aeronave, afetando consequentemente na mesma proporção a (o)?",
    opcao_correta: "carga útil",
    opcao_errada: "capacidade",
    explicacao: "A carga útil é diretamente afetada por modificações no peso vazio e CG da aeronave. A carga útil é calculada subtraindo-se o peso vazio do peso bruto máximo permissível. Quando se instala ou remove equipamentos, altera-se o peso vazio, e a diferença entre o novo peso vazio e o peso máximo permitido resulta na nova carga útil. Qualquer alteração no peso vazio afeta proporcionalmente a carga útil disponível para combustível, passageiros e bagagem.",
    materia: "revbasico"
  },
  {
    id: 384,
    pergunta: "Quando for realizar um furo em uma chapa, primeiro devemos marcar a chapa com qual tipo de punção?",
    opcao_correta: "De centro",
    opcao_errada: "Vasador",
    explicacao: "Para marcar a chapa antes de realizar um furo, deve-se utilizar um punção de centro. Este tipo de punção tem uma ponta cônica e afiada ideal para fazer uma marcação profunda e precisa no metal, que serve como guia para a broca e evita que ela escorregue no início da furação. O punção vasador (ou vazador) é usado para outros fins, como abrir ou alargar furos existentes.",
    materia: "revbasico"
  },
  {
    id: 385,
    pergunta: "Quando elevamos a tensão de um circuito e mantemos a resistência fixa, a corrente deve:",
    opcao_correta: "aumentar proporcionalmente",
    opcao_errada: "diminuir inversamente",
    explicacao: "Esta relação é fundamentada na Lei de Ohm (I = V/R). Quando a tensão (V) aumenta e a resistência (R) permanece constante, a corrente (I) aumenta proporcionalmente. Por exemplo, com resistência fixa de 10 Ω: a 20V a corrente é 2A; a 40V a corrente passa a 4A. A tensão representa a 'pressão elétrica'; uma pressão maior força mais elétrons a fluir através da mesma resistência, resultando em maior corrente.",
    materia: "revbasico"
  },
  {
    id: 386,
    pergunta: "Qual o procedimento deverá ser adotado quando a aeronave a ser rebocada for equipada com um sistema de direção na roda de nariz?",
    opcao_correta: "o mecanismo de travamento deverá ser reestabelecido após a remoção do garfo de reboque",
    opcao_errada: "conectar a tesoura para liberar o ctotal da roda durante o reboque",
    explicacao: "O procedimento correto é reestabelecer o mecanismo de travamento da direção da roda do nariz após a remoção do garfo de reboque. Isso é fundamental para a segurança, garantindo que a roda fique travada e alinhada para a próxima operação de taxiamento ou estacionamento. O travamento evita movimentos indesejados e inesperados da roda durante a operação da aeronave.",
    materia: "revbasico"
  },
  {
    id: 387,
    pergunta: "Qual a diferença entre Slats e slots de uma asa?",
    opcao_correta: "Slots são fendas geradas no bordo de ataque da asa, já os Slats são superfícies móveis de controle presas ao bordo de ataque das asas que geram essa fenda",
    opcao_errada: "Slats e slots são sinônimos ao se referir a superfícies de controle secundárias que agem no bordo de ataque da asa",
    explicacao: "Slots são fendas ou aberturas fixas no bordo de ataque da asa que redirecionam o fluxo de ar para o extradorso, retardando o estol. Slats são superfícies móveis presas ao bordo de ataque que, quando estendidas, criam uma fenda controlada (slot) entre elas e a asa principal. A principal diferença é que slots são fixos, enquanto slats são móveis e controláveis.",
    materia: "revbasico"
  },
  {
    id: 388,
    pergunta: "Se uma das extremidades das chaves de boca, colar e combinada, mede em todas 7/16 polegadas, as outras extremidades medirão, em polegadas, respectivamente:",
    opcao_correta: "3/8, 3/8 e 7/16",
    opcao_errada: "3/8, 3/8 e 3/8",
    explicacao: "Chave de boca: extremidades com medidas diferentes (uma 7/16, a outra 3/8). Chave colar: extremidades com medidas diferentes (uma 7/16, a outra 3/8). Chave combinada: uma extremidade é boca e a outra é colar, mas ambas têm a mesma medida (7/16 e 7/16). As chaves de boca e colar são projetadas com medidas diferentes para versatilidade; a chave combinada tem a mesma medida nas duas extremidades para trabalhar na mesma porca/parafuso.",
    materia: "revbasico"
  },
  {
    id: 389,
    pergunta: "Antes de lavar superfícies plásticas com água e sabão você deve:",
    opcao_correta: "Lavar essa superfície com água limpa.",
    opcao_errada: "Usar uma escova com cerdas de lã",
    explicacao: "Antes de aplicar água e sabão, deve-se primeiro lavar a superfície plástica com água limpa. Esta etapa prévia remove depósitos de sal e partículas de poeira que, se não forem eliminados, podem atuar como abrasivos durante a esfrega com sabão, causando riscos e danos permanentes ao plástico transparente. A sequência correta é: 1) água limpa para pré-lavagem, 2) água com sabão neutro e material macio, 3) enxágue e secagem com tecido macio.",
    materia: "revbasico"
  },
  {
    id: 390,
    pergunta: "Durante processos de usinagem ou esforços excessivos concentrados em componentes de motor, qual defeito é descrito como sobras de corte de metal ou liberação de lascas?",
    opcao_correta: "Cavaco, descrito como sobras de corte de metal ou liberação de lascas causados por usinagem ou esforços excessivos.",
    opcao_errada: "Rebarba, que se forma como projeção de metal nas bordas das peças durante usinagem ou esforços concentrados.",
    explicacao: "O cavaco é o produto principal e intencional da remoção de material durante operações de usinagem (torneamento, fresamento, furação), apresentando-se como lascas ou fitas de metal. A rebarba é uma projeção metálica indesejada que se forma nas bordas, cantos ou ao redor de furos como efeito secundário do processo de corte. Enquanto o cavaco é o material deliberadamente removido, a rebarba é um subproduto que deve ser eliminado por processos de rebarbação para garantir a segurança e qualidade da peça.",
    materia: "motores2"
  },
  {
    id: 391,
    pergunta: "O ângulo da pá, cujo arrasto da hélice é máximo, denomina-se:",
    opcao_correta: "passo chato ou passo mínimo",
    opcao_errada: "passo chato ou passo máximo",
    explicacao: "No passo chato (ou passo mínimo), o ângulo da pá em relação ao plano de rotação é reduzido. Esta configuração permite alta RPM e é usada em decolagem, mas gera maior arrasto porque a hélice 'corta' o ar com menor eficiência aerodinâmica. O passo máximo (ângulo maior) resulta em menor arrasto e é utilizado em cruzeiro para maior eficiência. Portanto, o máximo arrasto ocorre no passo chato/mínimo.",
    materia: "motores2"
  },
  {
    id: 392,
    pergunta: "Se ocorrer fogo no motor durante o ciclo de partida e, após mover a alavanca de corte de combustível para a posição off e continuar girando o motor com o arranque, o fogo ainda persistir, o que não se deve fazer?",
    opcao_correta: "descarrega CO2 diretamente na saída do motor, porque isto pode danificá-lo",
    opcao_errada: "descarregar CO2 no duto de entrada enquanto o motor está sendo virado",
    explicacao: "A sequência correta para fogo na partida é: 1) cortar combustível (alavanca em OFF), 2) continuar girando o motor com o arranque para expelir as chamas, 3) se persistir, pode-se descarregar CO2 no duto de entrada enquanto o motor é virado. NUNCA se deve descarregar CO2 diretamente na saída (escapamento) do motor, pois o choque térmico súbito pode causar danos severos aos componentes. Se o fogo não for controlado, desligue todas as chaves e abandone a aeronave.",
    materia: "motores2"
  },
  {
    id: 393,
    pergunta: "Na limpeza dos motores alternativos as escovas de aço:",
    opcao_correta: "nunca devem ser usadas em buchas ou superfícies de contato",
    opcao_errada: "devem ser usadas em buchas ou superfícies de contato com cautela",
    explicacao: "Escovas de aço são abrasivas e não devem ser utilizadas em buchas, superfícies de contato ou qualquer superfície usinada de precisão, pois podem remover material, alterar tolerâncias e causar danos irreversíveis. Elas podem ser usadas com cuidado em outras áreas para remover depósitos de carbono, mas sempre evitando superfícies críticas. Para buchas e superfícies de contato, devem ser utilizados métodos de limpeza não abrasivos recomendados pelo fabricante.",
    materia: "motores2"
  },
  {
    id: 394,
    pergunta: "Quando súbita redução de velocidade de rotação de um motor alternativo ocorrer o que deve ser feito?",
    opcao_correta: "Remover os filtros de óleo e verificar se há partículas de metal",
    opcao_errada: "Remover o motor e inspecionar",
    explicacao: "Uma súbita redução de RPM exige uma sequência de inspeções antes de decidir pela remoção do motor. Primeiro, realiza-se uma inspeção externa do berço, carcaça e eixo. Em seguida, remove-se e inspeciona-se os filtros de óleo, verificando a presença de partículas metálicas. Também se drena o óleo através de um pano limpo para detectar partículas. Somente se houver danos evidentes não reparáveis na linha ou partículas metálicas grandes/grossas é que a remoção do motor se torna necessária. Partículas finas (pó) permitem continuar a inspeção com testes adicionais.",
    materia: "motores2"
  },
  {
    id: 395,
    pergunta: "No circuito de detecção por pares térmicos, qual condição provoca o fechamento do relé sensível?",
    opcao_correta: "A corrente gerada ultrapassar quatro miliampères, devido ao rápido aquecimento da junção quente.",
    opcao_errada: "A atuação simultânea do relé escravo, que alimenta a bobina de indução principal do sistema.",
    explicacao: "Nos sistemas de detecção por pares térmicos (termopares), o relé sensível é calibrado para fechar quando a corrente gerada pelo termopar, resultante do aquecimento diferencial entre suas junções (quente e fria), ultrapassa um limiar específico, geralmente em torno de 4 mA. Este aquecimento rápido da junção quente (exposta à temperatura do motor) em relação à junção fria (referência) gera uma força eletromotriz (tensão) que produz a corrente. O relé escravo é acionado posteriormente pelo relé sensível para ativar o alarme ou sistema de extinção.",
    materia: "motores2"
  },
  {
    id: 396,
    pergunta: "O passo geométrico da hélice é igual ao passo:",
    opcao_correta: "efetivo, mais o recuo",
    opcao_errada: "teórico, mais o recuo",
    explicacao: "O passo geométrico é a distância teórica que uma hélice avançaria em uma revolução completa se movesse em um meio sólido (como um parafuso na porca). O passo efetivo é a distância real que a hélice avança no ar em uma revolução. O recuo (slip) é a diferença entre o passo geométrico e o passo efetivo, causado pelo 'escorregamento' da hélice no ar. Portanto: Passo Geométrico = Passo Efetivo + Recuo. O passo teórico não é um termo técnico padrão nesta relação.",
    materia: "motores2"
  },
  {
    id: 397,
    pergunta: "Ao processo de transferência de metal de um objeto para outro, por meios químicos e elétricos dá-se o nome de?",
    opcao_correta: "eletrodeposição ou galvanoplastia",
    opcao_errada: "anodização",
    explicacao: "O processo descrito é a eletrodeposição (ou galvanoplastia), que utiliza um circuito elétrico para transferir íons metálicos de um ânodo (objeto fonte) para um cátodo (objeto a ser recoberto), depositando uma camada de metal sobre a superfície. A anodização é um processo eletroquímico diferente, que cria uma camada de óxido na superfície do próprio metal (geralmente alumínio) para proteção contra corrosão, não envolvendo transferência de metal de um objeto para outro.",
    materia: "revbasico"
  },
  {
    id: 398,
    pergunta: "Um fabricante decide posicionar o plano de referência ligeiramente à frente do nariz da aeronave. Qual é o impacto dessa escolha nos cálculos de peso e balanceamento?",
    opcao_correta: "Todos os momentos resultantes serão positivos, reduzindo a possibilidade de erros de cálculo e Facilitando a verificação dos resultados",
    opcao_errada: "A posição do centro de gravidade será deslocada para frente, alterando a estabilidade da aeronave",
    explicacao: "Posicionar o plano de referência à frente de todos os componentes da aeronave garante que todas as distâncias (braços) medidas a partir dele sejam positivas. Consequentemente, todos os momentos (peso × braço) também serão positivos. Isso simplifica os cálculos, elimina confusão com sinais negativos e reduz erros matemáticos. A posição física real do centro de gravidade (CG) da aeronave não é alterada por essa escolha de referência; apenas a forma de calcular e expressar seus valores se torna mais prática e à prova de erros.",
    materia: "revbasico"
  },
  {
    id: 399,
    pergunta: "Qual o principal componente numa liga de latão:",
    opcao_correta: "Cobre",
    opcao_errada: "Alumínio",
    explicacao: "O latão é uma liga metálica cujo principal componente é o cobre, geralmente combinado com zinco. A proporção de cobre pode variar, mas ele é sempre o elemento base que define a liga. Outros elementos (como alumínio, estanho, chumbo) podem ser adicionados em pequenas quantidades para conferir propriedades específicas, mas o cobre é o componente fundamental.",
    materia: "revbasico"
  },
  {
    id: 400,
    pergunta: "O titular de uma licença de aviação civil, cujo a habilitação técnica esteja com validade totalmente vencida:",
    opcao_correta: "Poderá exercer as funções especificadas em sua licença, até 30 dias após o vencimento do certificado",
    opcao_errada: "Continuará nas funções específicas, pois a licença tem caráter permanente",
    explicacao: "Conforme a regulamentação, o titular de uma licença com habilitação técnica vencida tem um período de tolerância de 30 dias após a data de vencimento para continuar exercendo as funções, desde que busque a revalidação. Após esse período, fica impedido de atuar até que regularize sua situação através dos exames e procedimentos de revalidação exigidos pela autoridade aeronáutica. A licença não tem caráter permanente; sua validade está condicionada à revalidação periódica.",
    materia: "revbasico"
  },
  {
    id: 401,
    pergunta: "Marque a alternativa verdadeira sobre queda de tensão em um circuito elétrico:",
    opcao_correta: "Há uma queda de tensão quando uma corrente flui através de uma resistência",
    opcao_errada: "A queda de tensão em um circuito é um fenômeno que não tem relação com a resistência elétrica",
    explicacao: "A queda de tensão é um fenômeno diretamente relacionado à resistência elétrica e à corrente que a atravessa, conforme a Lei de Ohm (V = I × R). Quando uma corrente (I) flui através de um componente com resistência (R), parte da energia elétrica é convertida em calor ou outra forma de energia, resultando em uma redução da tensão (queda de tensão) entre os terminais desse componente. Sem resistência e corrente, não há queda de tensão significativa.",
    materia: "revbasico"
  },
  {
    id: 402,
    pergunta: "A carga útil da aeronave é determinada pela subtração do peso vazio do:",
    opcao_correta: "peso bruto máximo permitido",
    opcao_errada: "peso máximo operacional",
    explicacao: "A carga útil máxima é calculada pela fórmula: Carga Útil = Peso Bruto Máximo Permitido - Peso Vazio. O peso bruto máximo permitido é o limite de peso absoluto estrutural da aeronave definido pelo fabricante. O 'peso máximo operacional' não é um termo técnico padronizado para este cálculo; pode referir-se a diferentes pesos (como máximo para decolagem, pouso ou zero combustível) em contextos específicos, mas não é o termo correto para esta fórmula básica.",
    materia: "revbasico"
  },
  {
    id: 403,
    pergunta: "A finalidade principal do controle do peso e balanceamento das aeronaves, é o(a):",
    opcao_correta: "segurança",
    opcao_errada: "eficiência durante o voo",
    explicacao: "A finalidade primordial e não negociável do controle de peso e balanceamento é garantir a segurança de voo. Um carregamento fora dos limites pode comprometer a estabilidade, a controlabilidade e a performance estrutural da aeronave, levando a situações críticas como estol prematuro, dificuldade de controle ou até falha estrutural. A eficiência (melhor desempenho, menor consumo) é uma consequência benéfica de um balanceamento adequado, mas a segurança é o objetivo principal e mandatório.",
    materia: "revbasico"
  },
  {
    id: 404,
    pergunta: "Nos sistemas com ailerons diferenciais, a principal característica de projeto é:",
    opcao_correta: "O aileron que sobe deflete-se em um ângulo maior do que o aileron que desce para um mesmo movimento do manche.",
    opcao_errada: "Ambos os ailerons defletem igualmente, mantendo o equilíbrio aerodinâmico e eliminando o arrasto diferencial.",
    explicacao: "Os ailerons diferenciais são projetados para minimizar a guinada adversa (adverse yaw). Para isso, quando o manche é movido, o aileron que se move para cima (na asa que desce) deflete-se mais do que o aileron que se move para baixo (na asa que sobe). Essa deflexão assimétrica cria mais arrasto na asa descendente, compensando o maior arrasto induzido pelo aileron abaixado na asa ascendente, reduzindo assim a tendência da aeronave a guinar na direção oposta à curva desejada.",
    materia: "revbasico"
  },
  {
    id: 405,
    pergunta: "As linhas de fluido das aeronaves, são muitas vezes, identificadas por marcações em código de cores, palavras e símbolos geométricos. Essas marcações identificam a função, o conteúdo e o principal perigo de cada linha, tão bem quanto a direção do fluido, A cor cinza é a classificação de qual sistema?",
    opcao_correta: "De-ice",
    opcao_errada: "Pressurização",
    explicacao: "No código de cores padrão para tubulações (linhas de fluido) em aeronaves, a cor cinza (gray) é especificamente reservada para identificar o sistema de degelo (de-ice). Este sistema pode utilizar ar quente, fluidos químicos ou sistemas elétricos para prevenir ou remover a formação de gelo em superfícies críticas como bordas de ataque das asas, hélices e sensores. A pressurização é normalmente identificada por outra cor (como branco para ar de ventilação/pressurização).",
    materia: "revbasico"
  },
  {
    id: 406,
    pergunta: "Nos sistemas de ignição eletrônicos de motores turbojatos, o equipamento responsável por elevar a corrente contínua para a tensão de operação do excitador é denominado:",
    opcao_correta: "dinamotor",
    opcao_errada: "transformador",
    explicacao: "O dinamotor é um motor-gerador de corrente contínua que atua como conversor de energia. Durante a partida, ele eleva a tensão da corrente contínua (vinda da bateria ou fonte externa) para o nível necessário para alimentar o excitador do sistema de ignição eletrônico. O excitador então carrega os capacitores que fornecerão a alta energia para as velas. Um transformador convencional opera com corrente alternada (CA) e não seria adequado para essa função específica de elevação de tensão em corrente contínua (CC).",
    materia: "revisao"
  },
  {
    id: 407,
    pergunta: "No sistema de partida usando motor de inércia combinado, as chaves de controle localizadas no painel elétrico da cabine possuem três posições distintas que executam funções específicas durante o processo de partida do motor. Qual a posição é responsável por operar simultaneamente o solenóide de acoplamento de arranque e a bobina ativadora de ignição?",
    opcao_correta: "Down",
    opcao_errada: "On",
    explicacao: "Em um sistema de partida por inércia combinado, a chave tem três posições: 'Up', 'Down' e 'Off' (ou neutro). A posição 'Down' (para baixo) é a que aciona simultaneamente o solenóide de acoplamento do motor de arranque (que engrena o volante de inércia ao motor) e a bobina ativadora de ignição, permitindo a transferência da energia cinética armazenada no volante para girar o motor e ao mesmo tempo fornecer ignição. 'Up' energiza o motor de arranque para acelerar o volante; 'On' não é uma posição padrão nesta chave específica.",
    materia: "revisao"
  },
  {
     id: 408,
    pergunta: "O instrumento que recebe o sinal elétrico de um transmissor instalado na tubulação de combustível, e que tem finalidade de indicar o consumo horário do motor, denomina-se:",
    opcao_correta: "fluxômetro",
    opcao_errada: "liquidômetro",
    explicacao: "O fluxômetro (ou medidor de fluxo de combustível) é o instrumento que recebe sinais elétricos de um transmissor de vazão instalado na linha de combustível. Ele mede a taxa de fluxo (ex: galões por hora ou libras por hora) e indica o consumo horário do motor. O liquidômetro (ou indicador de quantidade) mede o volume total de combustível nos tanques, não a taxa de consumo em tempo real.",
    materia: "motores2"
  },
  {
    id: 409,
    pergunta: "O embandeiramento de uma hélice ocorre por ação de:",
    opcao_correta: "mola e contrapesos",
    opcao_errada: "mola e pressão de óleo",
    explicacao: "O embandeiramento (feathering) de uma hélice de passo controlável em caso de falha do motor é realizado por um sistema mecânico independente, que consiste em molas e contrapesos. Isso garante que, mesmo com a perda total de pressão hidráulica (óleo) do motor, a hélice embandeire automaticamente para a posição de mínimo arrasto. Depender apenas de pressão de óleo seria arriscado, pois uma falha no motor também cortaria a fonte de pressão.",
    materia: "motores2"
  },
  {
    id: 410,
    pergunta: "Em um motor que usa carburador, a tubulação de admissão fornece os meios de distribuição de ar ou a mistura de ar/combustível para os cilindros. Em um motor com injeção de combustível, o combustível é liberado para os bicos de injeção, um em cada cilindro, que fornece um jato apropriado para uma queima eficiente. Nos motores com injeção de combustível mistura de ar e combustível acontece:",
    opcao_correta: "No interior do cilindro",
    opcao_errada: "No carburador",
    explicacao: "Em motores com injeção de combustível, o ar é admitido pela tubulação de admissão e o combustível é injetado diretamente no coletor de admissão (próximo à válvula) ou dentro da câmara de combustão (injeção direta), dependendo do sistema. A mistura ar-combustível ocorre, portanto, dentro ou imediatamente antes da entrada no cilindro, e não no carburador (que não existe nesses sistemas). Em contraste, no carburador a mistura é formada no venturi e viaja pré-misturada pela tubulação.",
    materia: "motores2"
  },
  {
    id: 411,
    pergunta: "Qual foi a principal razão para o banimento internacional da produção de halons a partir de 1986?",
    opcao_correta: "Impacto significativo na camada de ozônio, resultando em restrição global de fabricação.",
    opcao_errada: "Classificação de toxicidade UL incompatível com áreas ocupadas em aeronaves.",
    explicacao: "Os halons (como o Halon 1301 e 1211) foram banidos pela produção por causa de seu alto potencial de destruição da camada de ozônio (ODP - Ozone Depletion Potential). Eles contêm bromo, que é particularmente eficaz em catalisar a destruição do ozônio estratosférico. O Protocolo de Montreal (1987) estabeleceu a eliminação progressiva de sua produção. A toxicidade relativamente baixa dos halons é, na verdade, uma de suas vantagens para uso em espaços ocupados, e não a razão do banimento.",
    materia: "motores2"
  },
  {
    id: 412,
    pergunta: "Quanto a bomba de pressão de óleo do sistema de lubrificação é correto afirmar que a mesma possui:",
    opcao_correta: "duas engrenagens que giram em sentido inverso",
    opcao_errada: "uma única engrenagem",
    explicacao: "A bomba de óleo em motores alternativos típicos é do tipo de engrenagens (gear pump). Ela possui duas engrenagens dentadas que giram em sentidos opostos dentro de uma carcaça. Uma engrenagem é acionada pelo motor (motriz) e a outra é movida por ela (livre). O óleo é capturado nos vãos entre os dentes e a carcaça, sendo transportado do lado de sucção para o lado de descarga, onde é comprimido e enviado sob pressão para o sistema de lubrificação.",
    materia: "motores2"
  },
  {
     id: 413,
    pergunta: "Quais as vantagens das porcas elastic stop:",
    opcao_correta: "porcas que podem ser usadas muitas vezes com completa segurança sem perder suas eficiências",
    opcao_errada: "porcas lisas com arruela frena",
    explicacao: "A principal vantagem das porcas elastic stop (ou porcas auto-frenantes com inserto de nylon/plástico) é sua capacidade de serem reutilizadas várias vezes com segurança, mantendo sua eficiência de frenagem (torque de desaperto). O inserto elástico não perde sua capacidade de atrito significativamente após usos múltiplos, desde que não esteja danificado ou desgastado. Porcas lisas com arruela frena são um tipo diferente de fixação, não oferecendo a mesma vantagem de reutilização fácil.",
    materia: "revbasico"
  },
  {
    id: 414,
    pergunta: "A queda de voltagem dos cabos principais da fonte de geração ou da bateria para a barra não deve exceder, da voltagem regulada, de:",
    opcao_correta: "2%",
    opcao_errada: "4%",
    explicacao: "Normas de instalação elétrica em aeronaves estabelecem que a queda de tensão (voltagem) nos cabos principais entre a fonte de energia (gerador/alternador ou bateria) e a barra de distribuição (bus bar) não deve exceder 2% da tensão regulada do sistema. Este limite garante que os equipamentos alimentados pela barra recebam tensão adequada para operação segura e eficiente. Uma queda maior comprometeria o funcionamento dos sistemas elétricos.",
    materia: "revbasico"
  },
  {
    id: 415,
    pergunta: "Ao conjunto cossinete e desandador dá-se o nome de:",
    opcao_correta: "tarraxa",
    opcao_errada: "tambor",
    explicacao: "O conjunto composto pelo cossinete (ferramenta de corte para abrir roscas internas) e pelo desandador (suporte ou porta-ferramenta que segura e gira o cossinete) é denominado tarraxa. É o conjunto completo utilizado para executar roscas internas (fêmeas) em furos. Tambor é uma peça cilíndrica diferente, não relacionada a este conjunto.",
    materia: "revbasico"
  },
  {
    id: 416,
    pergunta: "Quanto a tubulações flexíveis, está incorreta a afirmativa:",
    opcao_correta: "em alojamento de trem de pouso devem ser protegidas contra o desgaste e abrasão por meio de um invólucro de metal resistente ou teflon",
    opcao_errada: "as tubulações flexíveis deverão ser instaladas, de tal maneira, que sofram um mínimo de flexão durante a operação",
    explicacao: "A afirmativa incorreta é sobre a proteção com invólucro de metal ou teflon. Teflon (PTFE) é um material de baixo atrito usado como revestimento interno de mangueiras, não como invólucro externo de proteção. As tubulações flexíveis em áreas de desgaste (como alojamento de trem) devem ser protegidas com invólucros adequados como malha metálica, espirais de proteção ou mangas de material resistente à abrasão (borracha, polímeros), nunca com teflon puro como invólucro estrutural. A afirmativa sobre minimizar a flexão durante a operação está correta.",
    materia: "revbasico"
  },
  {
    id: 417,
    pergunta: "Ferramentas para abrir roscas internas são os machos, identifique quais os tipos de machos nas alternativas abaixo:",
    opcao_correta: "Cônico, semi-cônico e paralelo",
    opcao_errada: "Cossinete, tarraxa e desandador",
    explicacao: "Os machos (ferramentas para cortar roscas internas) são classificados pelo perfil de sua parte cortante: 1) Cônico: ponta longa e afilada, para início fácil e roscas cegas; 2) Semi-cônico (ou intermediário): afilamento moderado; 3) Paralelo (ou final): quase cilíndrico, para acabamento e roscas passantes. Cossinete é sinônimo de macho; tarraxa é o conjunto macho+suporte; desandador é o suporte/porte-ferramenta. Portanto, a classificação correta dos tipos de machos é cônico, semi-cônico e paralelo.",
    materia: "revbasico"
  },
  {
    id: 418,
    pergunta: "Em uma aeronave com configuração canard, qual é a principal diferença funcional entre o canard e o estabilizador horizontal de um design de cauda convencional?",
    opcao_correta: "O canard gera força de sustentação positiva que auxilia na elevação do nariz, enquanto o estabilizador convencional aplica força descendente para equilibrar o momento de arfagem.",
    opcao_errada: "O canard é projetado para compensar o arrasto induzido das asas principais, enquanto o estabilizador convencional compensa apenas o momento de guinada.",
    explicacao: "Em um design convencional (cauda traseira), o estabilizador horizontal gera uma força aerodinâmica para baixo (downforce) para contrabalançar o momento de arfagem 'nariz-pesado' causado pelo centro de sustentação da asa atrás do CG. Em uma configuração canard, a superfície horizontal dianteira (canard) gera sustentação positiva (para cima), ajudando ativamente a elevar o nariz e contribuindo para a sustentação total da aeronave. O canard funciona como uma mini-asa dianteira, enquanto o estabilizador traseiro funciona como um contrapeso aerodinâmico.",
    materia: "revbasico"
  },
  {
    id: 419,
    pergunta: "Qual das seguintes alternativas inclui um fator que NÃO é listado no The Dirty Dozen, os 12 fatores humanos comuns que podem contribuir para erros na aviação?",
    opcao_correta: "Falta de Recursos, Pressão, Desorganização",
    opcao_errada: "Fadiga, Distração, Falta de Recursos",
    explicacao: "Os 12 fatores do 'Dirty Dozen' são: 1) Falta de comunicação, 2) Complacência, 3) Falta de conhecimento, 4) Distração, 5) Falta de trabalho em equipe, 6) Fadiga, 7) Falta de recursos, 8) Pressão, 9) Falta de assertividade, 10) Estresse, 11) Falta de consciência situacional, 12) Normas. 'Desorganização' não faz parte da lista oficial dos 12 fatores. Portanto, a alternativa que inclui 'Desorganização' contém um fator que NÃO está no Dirty Dozen.",
    materia: "revbasico"
  },
  {
    id: 420,
    pergunta: "Na simbologia de uma bateria, a linha vertical mais longa representa o terminal:",
    opcao_correta: "positivo",
    opcao_errada: "negativo",
    explicacao: "No símbolo esquemático padrão de uma bateria (pilha ou acumulador), a linha vertical mais longa representa o terminal positivo (+), e a linha vertical mais curta representa o terminal negativo (-). Esta convenção é universal em diagramas elétricos e eletrônicos. A corrente convencional flui do terminal positivo (linha longa) para o terminal negativo (linha curta) no circuito externo.",
    materia: "revbasico"
  },
  {
     id: 421,
    pergunta: "Os inversores fornecem alimentação de:",
    opcao_correta: "corrente alternado de frequência fixa",
    opcao_errada: "115V",
    explicacao: "Um inversor é um dispositivo que converte corrente contínua (CC) em corrente alternada (CA) com frequência fixa (geralmente 400 Hz em aeronaves). Sua função principal é gerar CA de frequência estável para alimentar equipamentos que exigem esse tipo de energia. A tensão de saída (como 115V) é uma característica específica, mas não define a função básica do inversor, que é a conversão CC→CA com frequência fixa. Diferentes inversores podem fornecer diferentes tensões (26V, 115V, etc.), mas todos fornecem CA de frequência fixa.",
    materia: "revbasico"
  },
  {
    id: 422,
    pergunta: "A chave mista ou combinada que tem um lado 1/2 polegadas, terá do outro lado?",
    opcao_correta: "1/2 pol",
    opcao_errada: "9/16 pol",
    explicacao: "A chave combinada (ou mista) possui uma extremidade tipo 'boca' (open-end) e a outra extremidade tipo 'colar' (box-end), mas ambas as extremidades são dimensionadas para o mesmo tamanho de porca/parafuso. Portanto, se um lado é de 1/2 polegada, o outro lado também será de 1/2 polegada. Isso permite ao mecânico usar a extremidade mais adequada para a situação (boca para acesso rápido, colar para maior aperto) sem trocar de ferramenta, mantendo a mesma medida.",
    materia: "revbasico"
  },
  {
    id: 423,
    pergunta: "The Power in an Electrical Circuit is measured in:",
    opcao_correta: "Watts (W)",
    opcao_errada: "Volt (V)",
    explicacao: "A potência (Power) em um circuito elétrico é medida em Watts (W). Ela representa a taxa de consumo ou produção de energia elétrica. A relação fundamental é P (potência em Watts) = V (tensão em Volts) × I (corrente em Ampères). Volt (V) é a unidade de tensão (diferença de potencial), não de potência. Outras unidades como ampère (A) medem corrente, e ohm (Ω) mede resistência.",
    materia: "revbasico"
  },
  {
     id: 424,
    pergunta: "Uma das finalidades da válvula seletora de combustível é?",
    opcao_correta: "Permitir a transferência de combustível entre os tanques",
    opcao_errada: "Aliviar o excesso de combustível, na saída da bomba",
    explicacao: "A válvula seletora (ou válvula de seleção) de combustível permite ao piloto ou ao sistema automático selecionar de qual tanque o combustível será fornecido ao motor, e também possibilita a transferência de combustível entre tanques para balancear o peso e manter o centro de gravidade adequado. A função de aliviar excesso de pressão é realizada por válvulas de alívio (bypass) ou válvulas de retorno, não pela válvula seletora.",
    materia: "revisao"
  },
  {
     id: 425,
    pergunta: "No motor turboélice a força é controlada diretamente pela:",
    opcao_correta: "temperatura dos gases da entrada da turbina",
    opcao_errada: "velocidade do motor (RPM)",
    explicacao: "Em motores turboélice, a potência (força) é primariamente controlada pela temperatura dos gases na entrada da turbina (TET ou ITT - Interstage Turbine Temperature). O piloto comanda o fluxo de combustível, que ajusta a TET. Um governador mantém a RPM da hélice constante (geralmente em 100% da rotação), e a hélice ajusta seu passo para absorver o torque gerado pela turbina. Portanto, a variável de controle direta é a temperatura, não a RPM.",
    materia: "motores2"
  },
  {
    id: 426,
    pergunta: "Ao sair do radiador, a viscosidade do óleo é:",
    opcao_correta: "Maior do que ao entrar",
    opcao_errada: "Menor do que ao entrar",
    explicacao: "O radiador de óleo resfria o óleo que circula pelo motor. Como a viscosidade do óleo é inversamente proporcional à temperatura (óleo fica mais fino quando quente e mais grosso quando frio), ao passar pelo radiador e perder calor, sua temperatura diminui e sua viscosidade aumenta. Portanto, ao sair do radiador, o óleo está mais frio e mais viscoso do que quando entrou.",
    materia: "motores2"
  },
  {
    id: 427,
    pergunta: "As bombas que circulam o óleo através do motor e as que retornam o óleo para o reservatório são, respectivamente do tipo:",
    opcao_correta: "pressão e sucção",
    opcao_errada: "sucção e sucção",
    explicacao: "Em um sistema de lubrificação típico de motor alternativo: a bomba de pressão (geralmente do tipo engrenagem) é responsável por pressurizar o óleo e forçá-lo a circular através dos galerias e componentes do motor. A bomba de sucção (ou de retorno), que pode ser do tipo palheta ou engrenagem, tem a função de aspirar o óleo que se acumula no cárter e devolvê-lo ao reservatório ou tanque de óleo. São funções distintas: uma pressuriza, outra retorna.",
    materia: "motores2"
  },
  {
    id: 428,
    pergunta: "Diversos fatores devem ser considerados na seleção da bitola do fio para transmissão e distribuição de força elétrica. O primeiro fator é o(a):",
    opcao_correta: "perda da energia permitida na linha",
    opcao_errada: "capacidade do condutor para conduzir corrente",
    explicacao: "Na seleção da bitola de um fio para transmissão de força, o primeiro fator a ser considerado é a perda de energia (queda de tensão) permitida ao longo do circuito. Normas estabelecem um limite máximo (ex: 2% para circuitos principais). Com essa perda permitida definida, calcula-se a bitola mínima necessária para atender ao limite de queda de tensão, considerando corrente, comprimento e material do condutor. A capacidade de corrente (ampacidade) é verificada em seguida, mas a queda de tensão é o critério inicial determinante.",
    materia: "motores2"
  },
  {
    id: 429,
    pergunta: "Durante a inspeção de um motor, um mecânico detecta um trinco na aleta de resfriamento do cilindro. Quais são os procedimentos recomendados a serem seguidos para lidar com essa situação?",
    opcao_correta: "Soldagem dentro dos limites pré estabelecidos pelo fabricante",
    opcao_errada: "A aleta de resfriamento não pode ser reparada",
    explicacao: "Trincas em aletas de resfriamento de cilindros podem ser reparadas por soldagem, desde que seguidas as especificações do fabricante do motor. Geralmente, é permitido soldar até um certo número de aletas por cilindro e até um certo comprimento de trinca por aleta. O procedimento exato (tipo de solda, material, técnica) deve estar de acordo com o manual de manutenção. A substituição do cilindro completo é necessária apenas se os danos excederem os limites de reparo estabelecidos.",
    materia: "motores2"
  },
  {
    id: 430,
    pergunta: "Onde a água é injetada em um motor a turbina para fins de resfriamento?",
    opcao_correta: "Na entrada do compressor e no compartimento do difusor do motor",
    opcao_errada: "No estágio de potência e na câmara de combustão",
    explicacao: "Sistemas de injeção de água em turbinas para aumento de potência/resfriamento normalmente injetam água em dois locais: 1) Na entrada do compressor: a água evaporando resfria o ar de entrada, aumentando sua densidade e massa de fluxo. 2) No difusor (entre compressor e câmara de combustão): a água resfria o ar comprimido antes da combustão, permitindo maior fluxo de combustível sem exceder limites de temperatura da turbina. A injeção direta na câmara de combustão ou nos estágios da turbina não é prática comum para este fim, pois poderia causar choque térmico severo.",
    materia: "motores2"
  },
  {
     id: 431,
    pergunta: "Dentre as alternativas abaixo, indique aquela que apresenta superfícies móveis da deriva de um avião:",
    opcao_correta: "leme e compensador",
    opcao_errada: "estabilizador horizontal e profundor",
    explicacao: "A deriva (ou estabilizador vertical) é a superfície vertical fixa da cauda. Nela estão localizadas as superfícies móveis de controle de guinada: o leme (superfície principal) e o compensador do leme (ou trim tab, uma pequena superfície ajustável na borda de fuga do leme). Estabilizador horizontal e profundor são superfícies da cauda horizontal, não da deriva.",
    materia: "revbasico"
  },
  {
    id: 432,
    pergunta: "Em um sistema de comando de voo que utiliza aileron e leme acoplados, qual é a principal função das molas de interconexão?",
    opcao_correta: "Corrigir o arrasto do aileron aplicando automaticamente uma deflexão coordenada do leme.",
    opcao_errada: "Limitar o curso máximo dos pedais de leme para evitar guinadas excessivas em curvas.",
    explicacao: "As molas (ou mecanismos) de interconexão aileron-leme são projetadas para reduzir ou eliminar a guinada adversa (adverse yaw). Quando o piloto movimenta os ailerons para inclinar a aeronave, o sistema automaticamente e proporcionalmente deflete o leme na direção correta para compensar o arrasto diferencial criado pelos ailerons. Isso fornece uma curva coordenada sem necessidade de ação direta do piloto nos pedais do leme, facilitando o controle. A limitação do curso dos pedais é uma função separada, normalmente feita por batentes mecânicos.",
    materia: "revbasico"
  },
  {
    id: 433,
    pergunta: "Em uma rebitagem utilizou-se uma barra encontradora, pode-se afirmar que o rebite usado é do tipo:",
    opcao_correta: "sólido",
    opcao_errada: "pull-thru",
    explicacao: "A barra encontradora (ou bucking bar) é uma ferramenta que se opõe ao martelo rebitador (ou pistola de rebitar) durante a instalação de rebites sólidos. O rebite sólido (de alumínio, aço, monel, etc.) é colocado no furo, e a barra encontradora é mantida na cabeça do rebite enquanto a pistola forma a cabeça de fechamento (shop head) no lado oposto. Rebites 'pull-thru' (como os cherry) são instalados com uma ferramenta de puxar, não requerendo uma barra encontradora no lado oposto.",
    materia: "revbasico"
  },
  {
    id: 434,
    pergunta: "A condição de sobrevelocidade que pode ocorrer num motor a reação (turbina), poderá ser observada por qual instrumento?",
    opcao_correta: "Tacômetro",
    opcao_errada: "Indicador de vibração do motor",
    explicacao: "O tacômetro é o instrumento responsável por medir a rotação (r.p.m.) do compressor, que é igual à rotação da turbina em motores a reação. Ele é calibrado em percentagem de r.p.m. e tem como uma de suas principais funções monitorar condições de sobrevelocidade, especialmente durante a partida do motor e em operações críticas. O indicador de vibração, por outro lado, monitora desbalanceamentos mecânicos, não sendo específico para detecção de sobrevelocidade.",
    materia: "motores2"
  },
  {
    id: 435,
    pergunta: "A hélice percorre uma distância denominada passo efetivo quando?",
    opcao_correta: "Realiza uma volta completa, considerando o recuo.",
    opcao_errada: "Comandada para o passo mínimo.",
    explicacao: "O passo efetivo é a distância real que a hélice avança em uma revolução, considerando o recuo (slip) no ar. Diferencia-se do passo geométrico (teórico), que é calculado sem considerar o recuo. O passo efetivo leva em conta a perda de eficiência aerodinâmica.",
    materia: "motores2"
  },
  {
    id: 436,
    pergunta: "Nos sistemas de hélice automáticas, o sistema de controle ajusta o passo, sem atuação do:",
    opcao_correta: "Operador",
    opcao_errada: "Neutra",
    explicacao: "Em hélices automáticas (ou de velocidade constante), o sistema ajusta automaticamente o ângulo da pá para manter a rotação do motor constante, sem intervenção do piloto. O sistema reage a variações de rotação, ajustando o passo conforme necessário para otimizar desempenho.",
    materia: "motores2"
  },
  {
    id: 437,
    pergunta: "Os governadores usados para controlar o mecanismo hidráulico de mudança de passo são acionados pelo(a)?",
    opcao_correta: "Eixo de manivelas",
    opcao_errada: "Compressor",
    explicacao: "Os governadores são acionados diretamente pelo eixo de manivelas do motor, o que os torna sensíveis às variações de rotação. Eles controlam o fluxo de óleo para o mecanismo hidráulico de mudança de passo da hélice.",
    materia: "motores2"
  },
  {
    id: 438,
    pergunta: "Sistema tipo cárter seco, a bomba de sucção nos motores convencionais tem como finalidade?",
    opcao_correta: "Retornar o óleo para o tanque",
    opcao_errada: "Circular o óleo, através do motor",
    explicacao: "No sistema de cárter seco, a bomba de pressão envia óleo do tanque para o motor, enquanto a bomba de sucção retorna o óleo do cárter de volta ao tanque. Isso evita acúmulo excessivo de óleo no cárter e mantém a lubrificação eficiente.",
    materia: "motores2"
  },
  {
    id: 439,
    pergunta: "A formação de gelo no sistema de admissão pode ser impedida ou eliminada pelo?",
    opcao_correta: "Aumento da temperatura do ar",
    opcao_errada: "Temperatura do ar de escapamento",
    explicacao: "O aumento da temperatura do ar de admissão é realizado por meio de um pré-aquecedor, localizado antes das zonas de formação de gelo. Isso evita o acúmulo de gelo que poderia restringir o fluxo de ar e prejudicar o desempenho do motor.",
    materia: "motores2"
  },
  {
    id: 440,
    pergunta: "No sistema de lubrificação, a válvula de desvio (by-pass) que permite que o óleo seja desviado para o motor, em caso de filtro entupido, está localizada?",
    opcao_correta: "Entre a saída de pressão da bomba de óleo e o filtro",
    opcao_errada: "Após o filtro",
    explicacao: "A válvula de desvio fica entre a bomba e o filtro. Se o filtro estiver obstruído ou o óleo muito frio, a pressão abre a válvula, permitindo que o óleo não filtrado circule diretamente para o motor, evitando falta de lubrificação.",
    materia: "motores2"
  },
  {
    id: 441,
    pergunta: "Efeito da altitude, uma vez que o gradiente de temperatura é menor que o gradiente de pressão. Conforme se aumenta a altitude a densidade é?",
    opcao_correta: "Reduzida",
    opcao_errada: "Aumentada",
    explicacao: "Com o aumento da altitude, a pressão cai mais rapidamente que a temperatura, resultando em redução da densidade do ar. Isso diminui o empuxo disponível do motor, mesmo com temperaturas mais baixas.",
    materia: "motores2"
  },
  {
    id: 442,
    pergunta: "O objetivo da sincronização das hélices é?",
    opcao_correta: "Reduzir a vibração da hélice",
    opcao_errada: "Embandeirar a hélice",
    explicacao: "A sincronização iguala a rotação dos motores em aeronaves multimotoras, reduzindo vibrações e o desconforto causado por hélices operando em frequências diferentes.",
    materia: "motores2"
  },
  {
    id: 443,
    pergunta: "Para reduzir a velocidade no pouso, imediatamente após o toque, de uma aeronave turbofan, utiliza-se o(a)?",
    opcao_correta: "Reversor",
    opcao_errada: "Freio das rodas",
    explicacao: "O reversor de empuxo desvia o fluxo dos gases para frente, gerando uma força contrária ao movimento. É ativado logo após o toque, em conjunto com spoilers e freios, para reduzir a distância de frenagem.",
    materia: "motores2"
  },
  {
    id: 444,
    pergunta: "No motor convencional, converter o movimento de rotação do eixo de ressaltos, em movimento alternativo para abrir a válvula, é função do(a)?",
    opcao_correta: "Conjunto de tuchos",
    opcao_errada: "Conjunto de bielas",
    explicacao: "O conjunto de tuchos transforma o movimento rotativo do eixo de ressaltos em movimento linear alternado, transmitindo-o às hastes impulsoras e balancins para abrir as válvulas no tempo correto.",
    materia: "motores2"
  },
  {
    id: 445,
    pergunta: "Quanto à hélice ajustável no solo, pode-se dizer que a mesma opera como uma hélice de passo?",
    opcao_correta: "Fixo",
    opcao_errada: "Controlável",
    explicacao: "Hélices ajustáveis no solo são reguladas apenas em terra, antes do voo. Durante o voo, funcionam como hélices de passo fixo, sem alteração de ângulo.",
    materia: "motores2"
  },
  {
    id: 446,
    pergunta: "A resistência que o óleo lubrificante oferece ao escoamento denomina-se?",
    opcao_correta: "Viscosidade",
    opcao_errada: "Compressibilidade",
    explicacao: "Viscosidade é a propriedade do óleo que define sua resistência ao fluxo. Alta viscosidade indica óleo mais espesso; baixa viscosidade, óleo mais fluido. A viscosidade varia com a temperatura.",
    materia: "motores2"
  },
  {
    id: 447,
    pergunta: "Nos motores a reação, os compressores são classificados como?",
    opcao_correta: "Axial e centrífugo",
    opcao_errada: "Axial e convencional",
    explicacao: "Os dois tipos principais de compressores em motores a jato são o axial (fluxo paralelo ao eixo) e o centrífugo (fluxo radial para fora). A classificação se baseia na direção do fluxo de ar através do compressor.",
    materia: "motores2"
  },
  {
    id: 448,
    pergunta: "A finalidade do sistema de embandeiramento da hélice é?",
    opcao_correta: "Reduzir, ao mínimo, a resistência ao avanço",
    opcao_errada: "Eliminar vibrações da hélice",
    explicacao: "O embandeiramento posiciona as pás no ângulo de menor arrasto quando o motor para. Em aeronaves multimotoras, isso reduz a resistência aerodinâmica causada por uma hélice parada.",
    materia: "motores2"
  },
  {
    id: 449,
    pergunta: "Eixos de manivelas são balanceados estático e dinamicamente. Durante o teste de balanceamento estático do eixo de manivelas, ele é colocado sobre dois:",
    opcao_correta: "Cutelos",
    opcao_errada: "Suporte flexíveis",
    explicacao: "No teste estático, o eixo é apoiado sobre cutelos (facas de balanceamento). Se girar espontaneamente, indica desbalanceamento. O balanceamento dinâmico verifica forças rotativas durante a operação.",
    materia: "motores2"
  },
  {
    id: 450,
    pergunta: "Os cilindros são instalados no motor na seção denominada?",
    opcao_correta: "Potência",
    opcao_errada: "Acessórios",
    explicacao: "A seção de potência é onde ocorre a combustão e a geração de energia. Os cilindros, pistões e bielas estão localizados nessa seção.",
    materia: "motores2"
  },
  {
    id: 451,
    pergunta: "Após a sua leitura, assinale a alternativa correta: 'The thermal discharge indicator is connected to the fire container relief fitting and ejects a red disk to show when container contents have dumped overboard due to excessive heat.' 'Excessive heat' quer dizer:",
    opcao_correta: "Calor excessivo",
    opcao_errada: "Temperatura excessiva",
    explicacao: "A tradução correta de 'excessive heat' é 'calor excessivo'. O indicador de descarga térmica aciona um disco vermelho quando o sistema de extinção descarrega devido a superaquecimento.",
    materia: "motores2"
  },
  {
    id: 452,
    pergunta: "A finalidade de converter a alta velocidade do ar de saída do compressor em pressão estática é?",
    opcao_correta: "Fazer com que o ar nos queimadores queime sem se apagar",
    opcao_errada: "Aumentar a potência do motor",
    explicacao: "O difusor converte a energia cinética do ar em pressão estática, reduzindo a velocidade e estabilizando o fluxo para que a combustão ocorra de forma contínua nos queimadores.",
    materia: "motores2"
  },
  {
    id: 453,
    pergunta: "No sistema de lubrificação do motor, a válvula de alívio localizada na saída da bomba principal limita a pressão máxima do sistema, desviando o óleo para o reservatório ou para o(a):",
    opcao_correta: "Entrada da bomba",
    opcao_errada: "Interior do filtro",
    explicacao: "A válvula de alívio desvia o excesso de óleo de volta para a entrada da bomba, mantendo a pressão do sistema dentro dos limites seguros e protegendo componentes contra sobrepressão.",
    materia: "motores2"
  },
  {
    id: 454,
    pergunta: "O sistema de medição principal fornece combustível para o motor em todas?",
    opcao_correta: "As velocidades acima de marcha lenta",
    opcao_errada: "As baixa rotação do rotor de ignição",
    explicacao: "O sistema de medição principal opera apenas acima da marcha lenta, pois abaixo dessa velocidade a queda de pressão no Venturi é insuficiente para descarregar combustível. Para marcha lenta, existe um sistema separado.",
    materia: "motores1"
  },
  {
    id: 455,
    pergunta: "O compressor de fluxo axial tem dois elementos principais:",
    opcao_correta: "Rotor e estator",
    opcao_errada: "Difusor e turbina",
    explicacao: "No compressor axial, o rotor (parte giratória) acelera o ar, enquanto o estator (parte fixa) converte essa velocidade em pressão e direciona o fluxo para o próximo estágio.",
    materia: "motores1"
  },
  {
    id: 456,
    pergunta: "A baixa volatilidade é preferível para reduzir a possibilidade do calço de vapor, e reduzir as perdas de:",
    opcao_correta: "Combustível por evaporação",
    opcao_errada: "Os gases cinéticos de queima no corte do motor",
    explicacao: "Combustíveis com baixa volatilidade evaporam menos, reduzindo perdas por evaporação e minimizando o risco de calço de vapor no sistema de combustível.",
    materia: "motores1"
  },
  {
    id: 457,
    pergunta: "Se a mistura usada for mais pobre do que a especificada para o motor em uso, o cilindro com a mistura mais pobre estará sujeito?",
    opcao_correta: "Ao retorno de chama",
    opcao_errada: "A pré-ignição",
    explicacao: "Misturas muito pobres queimam lentamente, podendo continuar queimando durante a abertura da válvula de admissão, causando retorno de chama (backfire) no coletor.",
    materia: "motores1"
  },
  {
    id: 458,
    pergunta: "Os anéis de segmento nos motores convencionais tem a função de?",
    opcao_correta: "Vedação",
    opcao_errada: "Limitar o movimento do eixo de manivelas",
    explicacao: "Os anéis de segmento vedam a câmara de combustão, impedindo vazamento de gases e controlando a quantidade de óleo que chega à área de combustão.",
    materia: "motores1"
  },
  {
    id: 459,
    pergunta: "O motor que utiliza um sistema de biela mestra e bielas articuladas, é denominado motor?",
    opcao_correta: "Radial",
    opcao_errada: "Em V",
    explicacao: "Motores radiais utilizam biela mestra (conectada ao eixo) e bielas articuladas (conectadas à mestra) para conectar múltiplos pistões dispostos radialmente ao mesmo eixo.",
    materia: "motores1"
  },
  {
    id: 460,
    pergunta: "Quando um êmbolo vai do PMB até o PMA, o mesmo desloca um volume que se denomina?",
    opcao_correta: "Cilindrada",
    opcao_errada: "Desenvolvimento",
    explicacao: "Cilindrada é o volume deslocado pelo pistão ao se mover do ponto morto inferior (PMI) ao ponto morto superior (PMS). É calculada pela área do cilindro × curso do pistão.",
    materia: "motores1"
  },
  {
    id: 461,
    pergunta: "A alta tensão induzida na bobina secundária é enviada ao?",
    opcao_correta: "Distribuidor",
    opcao_errada: "Condensador",
    explicacao: "A alta tensão gerada na bobina secundária é direcionada ao distribuidor, que a distribui às velas na sequência correta de ignição.",
    materia: "motores1"
  },
  {
    id: 462,
    pergunta: "O gerador no sistema elétrico tem a finalidade de?",
    opcao_correta: "Converter energia mecânica em elétrica",
    opcao_errada: "Acumular energia estática",
    explicacao: "O gerador transforma energia mecânica (do motor) em energia elétrica por indução eletromagnética, alimentando os sistemas da aeronave e carregando a bateria.",
    materia: "motores1"
  },
  {
    id: 463,
    pergunta: "Durante a partida de um motor a reação, deve-se monitorar o(a)?",
    opcao_correta: "Pressão de óleo, temperatura do compressor e a TIT",
    opcao_errada: "Tacômetro e a TIT",
    explicacao: "Na partida de motores a reação, é essencial monitorar pressão de óleo, temperatura do compressor e Temperatura de Inlet Turbine (TIT) para garantir operação segura e evitar danos.",
    materia: "motores1"
  },
  {
    id: 464,
    pergunta: "O rotor de um motor a reação é uma combinação dos rotores do compressor e da turbina, unidos por?",
    opcao_correta: "Um eixo",
    opcao_errada: "Três eixos distintos",
    explicacao: "O rotor do motor a reação consiste nos rotores do compressor e da turbina conectados por um único eixo comum, que transmite a energia da turbina para o compressor.",
    materia: "motores1"
  },
  {
    id: 465,
    pergunta: "O princípio usado por um motor turbojato quando ele provê força para mover um avião, baseia-se no(a)?",
    opcao_correta: "Segunda lei de Newton",
    opcao_errada: "Princípio de Pascal",
    explicacao: "A segunda lei de Newton (F = m × a) explica como o motor acelera uma massa de ar, gerando uma força de reação (empuxo) que impulsiona a aeronave.",
    materia: "motores1"
  },
  {
    id: 466,
    pergunta: "Cada válvula é fechada por meio de duas ou três molas helicoidais para:",
    opcao_correta: "Evitar vibração ou oscilação em determinadas velocidades",
    opcao_errada: "Aumentar a pressão de fechamento",
    explicacao: "Múltiplas molas com frequências naturais diferentes previnem ressonância e vibração excessiva, garantindo fechamento estável da válvula em todas as rotações.",
    materia: "motores1"
  },
  {
    id: 467,
    pergunta: "Nos motores convencionais a quatro tempos, a sequência de funcionamento é?",
    opcao_correta: "Admissão, compressão, explosão e escapamento",
    opcao_errada: "Admissão, motor, explosão e escapamento",
    explicacao: "O ciclo de quatro tempos segue a sequência: 1) Admissão, 2) Compressão, 3) Combustão/Explosão, 4) Escape. Conhecido como ciclo Otto.",
    materia: "motores1"
  },
  {
    id: 468,
    pergunta: "Leia com atenção o texto e responda a alternativa correta: 'A complete fire protection system includes both a fire detection and a fire extinguishing system. To detect fires or overheat conditions, detectors are placed in the various zones to be monitored.' A expressão 'overheat conditions' quer dizer:",
    opcao_correta: "Condições de superaquecimento",
    opcao_errada: "Condições de tempo",
    explicacao: "'Overheat conditions' traduz-se como 'condições de superaquecimento', referindo-se a temperaturas excessivas que podem indicar risco de incêndio.",
    materia: "motores1"
  },
  {
    id: 469,
    pergunta: "No sistema de ignição a parte giratória do distribuidor é denominada?",
    opcao_correta: "Rotor",
    opcao_errada: "Capacitor",
    explicacao: "A parte giratória do distribuidor é o rotor, que distribui a alta tensão das bobinas para os terminais das velas na sequência correta.",
    materia: "motores1"
  },
  {
    id: 470,
    pergunta: "O ar que entra na câmara de combustão é dividido em duas correntes principais: ar primário e ar secundário. Qual a finalidade do ar secundário no motor a reação?",
    opcao_correta: "Refrigeração",
    opcao_errada: "Para queima",
    explicacao: "O ar secundário resfria os gases de combustão, passando entre a carcaça e a camisa da câmara, reduzindo a temperatura antes da turbina.",
    materia: "motores1"
  },
  {
    id: 471,
    pergunta: "Além dos a reação, os motores radial são fixados à nacelle do avião através de(o)?",
    opcao_correta: "Berço",
    opcao_errada: "Suporte",
    explicacao: "Motores radiais são montados em berços de tubos de aço soldados, que suportam o peso e absorvem cargas dinâmicas e vibrações.",
    materia: "motores1"
  },
  {
    id: 472,
    pergunta: "Geralmente de qual material de alta resistência é fabricado o corpo do cilindro no qual trabalha o pistão:",
    opcao_correta: "Aço",
    opcao_errada: "Amianto",
    explicacao: "O corpo do cilindro é feito de aço de alta resistência, geralmente nitretado para endurecer a superfície interna e resistir ao desgaste.",
    materia: "motores1"
  },
  {
    id: 473,
    pergunta: "Anel raspador de óleo, geralmente tem uma face chanfrada e está instalado em uma ranhura no fundo da saia do(a):",
    opcao_correta: "Pistão",
    opcao_errada: "Eixo de manivelas",
    explicacao: "O anel raspador de óleo fica na ranhura inferior da saia do pistão, com face chanfrada para controlar o filme de óleo na parede do cilindro.",
    materia: "motores1"
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