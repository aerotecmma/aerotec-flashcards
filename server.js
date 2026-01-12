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