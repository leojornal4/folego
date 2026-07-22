// Base de dados e lógica de rotação diária para a Plataforma Bíblica Premium e Portal da Igreja

export interface Versiculo {
  id: number;
  texto: string;
  referencia: string;
  imagemUrl: string;
}

export interface Frase {
  id: number;
  autor: string;
  texto: string;
}

export interface Oracao {
  id: number;
  texto: string;
}

export interface Curiosidade {
  id: number;
  titulo: string;
  texto: string;
}

export interface Pergunta {
  id: number;
  pergunta: string;
  resposta: string;
}

export interface Desafio {
  id: number;
  texto: string;
}

export interface LeituraProgramada {
  data: string; // Formato YYYY-MM-DD
  leituras: string[]; // ex: ["1 Crônicas 19:1-21:30", "Salmos 11", "Provérbios 19", "Romanos 2:25-3:8"]
  tempoEstimado: number; // minutos
  concluida?: boolean;
  trechoBiblico?: string; // Campo opcional para conter o texto bíblico digitado
}

export interface Licao {
  id: string;
  titulo: string;
  introducao: string;
  conteudo: string;
  passagens: string[]; // ex: ["Filipenses 4:6-7"]
  reflexao: string[]; // perguntas
  oracao: string;
}

export interface EstudoTematico {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  imagemUrl: string;
  ico: string; // nome do ícone lucide
  licoes: Licao[];
}

export interface Devocional {
  data: string; // Formato YYYY-MM-DD
  titulo: string;
  texto: string;
  aplicacao: string;
  oracao: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  local: string;
  imagemUrl: string;
}

export interface Aviso {
  id: string;
  titulo: string;
  categoria: string;
  data: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagemUrl: string;
  galeria: string[];
  data: string;
}

export interface GaleriaItem {
  id: string;
  tipo: 'imagem' | 'video';
  url: string;
  categoria: string;
  titulo: string;
}

export interface Pastor {
  id: string;
  nome: string;
  cargo: string;
  bio: string;
  imagemUrl: string;
  contato: string;
}

export interface Ministerio {
  id: string;
  nome: string;
  descricao: string;
  imagemUrl: string;
}

export interface ComentarioOracao {
  id: string;
  autor: string;
  texto: string;
  data: string;
}

export interface PedidoOracao {
  id: string;
  nome?: string;
  telefone?: string;
  mensagem: string;
  data: string;
  anonimo: boolean;
  atendido: boolean;
  privado: boolean;
  aprovado: boolean;
  amens: number;
  comentarios: ComentarioOracao[];
  motivo: string;
}

export interface PedidoVisita {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  mensagem: string;
  data: string;
  atendido: boolean;
}

// ==================== BANCO AUTOMÁTICO DE DADOS ====================

export const VERSICULOS_PADRAO: Versiculo[] = [
  {
    id: 1,
    texto: "A tua palavra é lâmpada para os meus pés e luz para o meu caminho.",
    referencia: "Salmos 119:105",
    imagemUrl: "https://images.unsplash.com/photo-1507421870095-26511b816e0b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    texto: "Busquem, pois, em primeiro lugar o Reino de Deus e a sua justiça, e todas essas coisas serão acrescentadas a vocês.",
    referencia: "Mateus 6:33",
    imagemUrl: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    texto: "O Senhor é o meu pastor; nada me faltará. Em verdes pastagens me faz repousar e me conduz a águas tranquilas.",
    referencia: "Salmos 23:1-2",
    imagemUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    texto: "Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.",
    referencia: "Josué 1:9",
    imagemUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    texto: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.",
    referencia: "Romanos 8:28",
    imagemUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    texto: "Posso todas as coisas naquele que me fortalece.",
    referencia: "Filipenses 4:13",
    imagemUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 7,
    texto: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor in todos os seus caminhos, e ele endireitará as suas veredas.",
    referencia: "Provérbios 3:5-6",
    imagemUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 8,
    texto: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Não maltrata, não procura seus interesses, não se ira facilmente, não guarda rancor.",
    referencia: "1 Coríntios 13:4-5",
    imagemUrl: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1200&auto=format&fit=crop"
  }
];

export const FRASES_PADRAO: Frase[] = [
  { id: 1, autor: "C. S. Lewis", texto: "Deus não quer tanto nossas ações quanto o próprio agente; Ele nos quer." },
  { id: 2, autor: "Charles Spurgeon", texto: "A Bíblia que está caindo aos pedaços geralmente pertence a alguém que não está." },
  { id: 3, autor: "John Piper", texto: "Deus é mais glorificado em nós quando estamos mais satisfeitos nele." },
  { id: 4, autor: "Billy Graham", texto: "A salvação é gratuita, mas o discipulado custa tudo o que temos." },
  { id: 5, autor: "A. W. Tozer", texto: "Deus procura pessoas para quem Ele possa se revelar, e quanto mais vazios formos, mais Ele nos preencherá." },
  { id: 6, autor: "Augustus Nicodemus", texto: "A fé bíblica não é um salto no escuro, mas o andar na luz da Palavra revelada." },
  { id: 7, autor: "Hernandes Dias Lopes", texto: "A oração não muda a Deus, muda a nós, alinhando a nossa vontade com a soberana vontade divina." },
  { id: 8, autor: "Paul Washer", texto: "As pessoas não rejeitam a Cristo por falta de evidências, mas porque amam o seu pecado." },
  { id: 9, autor: "John MacArthur", texto: "A verdade da Palavra de Deus não é uma opinião a ser debatida, mas uma autoridade a ser obedecida." },
  { id: 10, autor: "Tim Keller", texto: "O evangelho não é apenas o ABC da vida cristã, é de A a Z." }
];

export const ORACOES_PADRAO: Oracao[] = [
  { id: 1, texto: "Senhor, fortalece minha fé para permanecer firme diante das dificuldades e dá-me sabedoria para fazer as escolhas que te honram hoje. Amém." },
  { id: 2, texto: "Pai celeste, aquieta o meu coração ansioso. Que a tua paz, que excede todo o entendimento, guarde a minha mente e a minha vida no dia de hoje. Amém." },
  { id: 3, texto: "Deus de amor, abre os meus olhos para enxergar as necessidades do meu próximo. Usa as minhas mãos para abençoar e a minha boca para falar da tua graça. Amém." },
  { id: 4, texto: "Senhor Jesus, ajuda-me a caminhar em santidade. Purifica as minhas intenções, os meus pensamentos e as minhas palavras. Seja o meu guia e a minha força. Amém." },
  { id: 5, texto: "Espírito Santo, sopra vida e renovo espiritual em minha alma. Dá-me fome e sede da tua Palavra e revelação do teu caráter neste tempo de leitura. Amém." }
];

export const CURIOSIDADES_PADRAO: Curiosidade[] = [
  { id: 1, titulo: "O Menor Capítulo", texto: "O menor capítulo de toda a Bíblia é o Salmo 117, com apenas dois versículos." },
  { id: 2, titulo: "O Maior Capítulo", texto: "O maior capítulo da Bíblia é o Salmo 119, composto por 176 versículos organizados em ordem alfabética hebraica." },
  { id: 3, titulo: "A Bíblia em Números", texto: "A Bíblia foi escrita por cerca de 40 autores diferentes, ao longo de um período de aproximadamente 1500 anos, em três idiomas: Hebraico, Aramaico e Grego." },
  { id: 4, titulo: "O Livro Mais Longo", texto: "Por número de palavras, o livro de Jeremias é o livro mais longo da Bíblia, superando até mesmo o livro de Salmos em volume total de texto original." },
  { id: 5, titulo: "Sem Menção de Deus", texto: "Os livros de Ester e Cânticos (Cantares de Salomão) são os únicos livros bíblicos que não mencionam a palavra 'Deus' diretamente em seus textos originais." }
];

export const PERGUNTAS_PADRAO: Pergunta[] = [
  { id: 1, pergunta: "Quem construiu a arca por ordem divina?", resposta: "Noé (Gênesis 6:13-14)" },
  { id: 2, pergunta: "Qual era a profissão de Lucas, o escritor de um dos evangelhos?", resposta: "Médico (Colossenses 4:14)" },
  { id: 3, pergunta: "Quantas vezes Pedro negou a Jesus antes do cantar do galo?", resposta: "Três vezes (Mateus 26:74-75)" },
  { id: 4, pergunta: "Quem foi levado ao céu em um redemoinho por uma carruagem de fogo?", resposta: "Elias (2 Reis 2:11)" },
  { id: 5, pergunta: "Qual discípulo é conhecido por ter duvidado da ressurreição de Jesus até ver suas feridas?", resposta: "Tomé (João 20:24-28)" }
];

export const DESAFIOS_PADRAO: Desafio[] = [
  { id: 1, texto: "Ore especificamente por um irmão ou amigo que você sabe que está passando por dificuldades." },
  { id: 2, texto: "Leia novamente um Salmo hoje (sugerimos Salmos 23 ou 103) e medite em cada frase em silêncio." },
  { id: 3, texto: "Ligue ou envie uma mensagem especial para um irmão da igreja demonstrando amor e encorajamento." },
  { id: 4, texto: "Exercite o perdão hoje: libere perdão em seu coração por alguma ofensa ou procure alguém para reconciliação." },
  { id: 5, texto: "Evangelize ou compartilhe uma mensagem de esperança sobre Jesus com pelo menos uma pessoa hoje." }
];

// ==================== PROGRAMAÇÃO DE LEITURA DIÁRIA (MANUAL) ====================

export const LEITURAS_PADRAO: LeituraProgramada[] = [
  {
    data: "2026-07-15",
    leituras: ["1 Crônicas 19:1–21:30", "Salmos 11", "Provérbios 19", "Romanos 2–3"],
    tempoEstimado: 28
  },
  {
    data: "2026-07-16",
    leituras: ["1 Crônicas 22:1–23:32", "Salmos 12", "Provérbios 20:1-15", "Romanos 4:1-12"],
    tempoEstimado: 22
  },
  {
    data: "2026-07-17",
    leituras: ["1 Crônicas 24:1–25:31", "Salmos 13-14", "Provérbios 20:16-30", "Romanos 4:13–5:11"],
    tempoEstimado: 25
  },
  {
    data: "2026-07-18",
    leituras: ["1 Crônicas 26:1–27:34", "Salmos 15", "Provérbios 21:1-15", "Romanos 5:12–6:14"],
    tempoEstimado: 24
  },
  {
    data: "2026-07-19",
    leituras: ["1 Crônicas 28:1–29:30", "Salmos 16", "Provérbios 21:16-31", "Romanos 6:15–7:6"],
    tempoEstimado: 26
  },
  {
    data: "2026-07-20",
    leituras: ["2 Crônicas 1:1–3:17", "Salmos 17", "Provérbios 22:1-16", "Romanos 7:7-25"],
    tempoEstimado: 20
  },
  {
    data: "2026-07-21",
    leituras: ["2 Crônicas 4:1–6:11", "Salmos 18:1-24", "Provérbios 22:17-29", "Romanos 8:1-17"],
    tempoEstimado: 27
  }
];

export const ESTUDOS_TEMATICOS_PADRAO: EstudoTematico[] = [
  {
    id: "ansiedade",
    titulo: "Libertação da Ansiedade",
    descricao: "Descubra como a paz de Deus pode guardar seu coração e sua mente diante das preocupações deste mundo.",
    categoria: "Vida Cristã",
    imagemUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop",
    ico: "Compass",
    licoes: [
      {
        id: "ansiedade-1",
        titulo: "O Cuidado de um Pai Amoroso",
        introducao: "A base para vencer a ansiedade é compreender quem é Deus e o quanto Ele cuida de nós de forma paternal.",
        conteudo: "<p>Jesus nos convida a observar a criação para aprender sobre a fidelidade e o sustento de Deus. Se Ele alimenta as aves do céu e veste os lírios do campo com tanto esplendor, por que hesitamos em acreditar que Ele cuidará de nós?</p><p>A ansiedade muitas vezes nasce da ilusão de que estamos sozinhos e precisamos carregar o peso do nosso próprio sustento e futuro. Quando reconhecemos a Deus como um Pai perfeito e amoroso, compreendemos que o nosso amanhã está guardado em Suas mãos graciosas.</p>",
        passagens: ["Mateus 6:25-26", "1 Pedro 5:7"],
        reflexao: [
          "Quais são as áreas da sua vida em que você tem mais dificuldade de confiar que Deus agirá como um Pai cuidadoso?",
          "O que o exemplo das aves do céu e dos lírios do campo ensina sobre a provisão de Deus para você hoje?"
        ],
        oracao: "Pai querido, perdoa-me pelas vezes em que duvido do Teu cuidado amoroso. Ajuda-me a lembrar que sou precioso para Ti e que Tu governas o universo com amor e fidelidade. Entrego minhas preocupações em Tuas mãos. Amém."
      },
      {
        id: "ansiedade-2",
        titulo: "A Oração que Substitui a Ansiedade",
        introducao: "A ansiedade e a oração são forças opostas; onde uma cresce, a outra diminui.",
        conteudo: "<p>O apóstolo Paulo nos ensina uma rota prática para a paz: 'Não andem ansiosos por coisa alguma; antes, em tudo, apresentem as suas petições a Deus'. O antídoto para a preocupação não é a autoconfiança ou o otimismo vazio, mas a oração ativa combinada com gratidão.</p><p>Quando derramos o nosso coração perante o Senhor e agradecemos pelas bênçãos recebidas, tiramos os olhos dos problemas e os voltamos para a grandeza de Deus. Essa atitude desarma a ansiedade e abre caminho para a paz sobrenatural.</p>",
        passagens: ["Filipenses 4:6-7", "Salmos 55:22"],
        reflexao: [
          "Como você pode transformar sua principal preocupação de hoje em um pedido de oração específico?",
          "Quais são três motivos de gratidão pelos quais você pode agradecer a Deus hoje, mesmo em meio à luta?"
        ],
        oracao: "Senhor Deus, em vez de reter minhas preocupações no meu coração, eu as trago a Ti agora in oração. Obrigado por tudo o que já fizeste por mim. Coloco meus anseios diante do Teu altar e confio na Tua boa vontade. Em nome de Jesus, Amém."
      },
      {
        id: "ansiedade-3",
        titulo: "A Paz que Guarda o Coração",
        introducao: "A paz de Deus não é a ausência de tempestades, mas um guarda-costas espiritual que guarda nossa mente em Cristo.",
        conteudo: "<p>A promessa bíblica é extraordinária: a paz de Deus, que excede todo o entendimento humano, guardará os nossos corações e as nossas mentes em Cristo Jesus. A palavra usada originalmente para 'guardará' refere-se a uma sentinela militar protegendo uma fortaleza.</p><p>Essa paz não depende das circunstâncias ao redor. Ela é o Espírito Santo operando um consolo sobrenatural que blinda nossos sentimentos e pensamentos contra os ataques de dúvida e desespero.</p>",
        passagens: ["João 14:27", "Isaías 26:3"],
        reflexao: [
          "Você já experimentou a paz de Deus em um momento em que as circunstâncias eram totalmente desfavoráveis? Como foi?",
          "De que maneira você pode alimentar sua mente com a verdade de Cristo para fortalecer essa blindagem espiritual?"
        ],
        oracao: "Jesus, Tu disseste: 'Deixo-vos a paz, a minha paz vos dou'. Eu recebo essa paz hoje. Declaro que o meu coração não se turbará e nem terá medo, pois a Tua presença está comigo e me dá descanso seguro. Amém."
      }
    ]
  },
  {
    id: "fe",
    titulo: "Fortalecendo a Fé em Tempos de Crise",
    descricao: "Aprenda a fincar suas raízes em Deus para permanecer firme quando as tempestades da vida soprarem.",
    categoria: "Doutrina",
    imagemUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    ico: "Shield",
    licoes: [
      {
        id: "fe-1",
        titulo: "Firmeza sobre a Rocha",
        introducao: "A nossa estabilidade espiritual depende de onde escolhemos construir a nossa base.",
        conteudo: "<p>Jesus compara aquele que ouve e pratica Suas palavras ao homem prudente que construiu sua casa sobre a rocha. As tempestades, ventos e chuvas vieram, mas a casa não caiu. Isso nos ensina que a fé inabalável não é a que nunca enfrenta tempestades, mas a que está ancorada em Cristo.</p><p>Praticar a palavra nas pequenas escolhas diárias é o que solidifica as nossas fundações na Rocha Eterna.</p>",
        passagens: ["Mateus 7:24-25", "Lucas 6:47-49"],
        reflexao: [
          "O que significa, na prática da sua rotina diária, construir a sua vida sobre a Rocha?",
          "Identifique alguma área da sua vida que pode estar construída sobre a areia (opiniões, recursos passageiros)."
        ],
        oracao: "Eterno Senhor, Tu és a minha Rocha e a minha Salvação. Ajuda-me a ser não apenas ouvinte, mas praticante de Tua palavra, para que minha fé permaneça inabalável quando as dificuldades vierem. Amém."
      },
      {
        id: "fe-2",
        titulo: "O Escudo Protetor da Fé",
        introducao: "Como usar o escudo da fé para apagar todos os dardos inflamados do inimigo.",
        conteudo: "<p>Na armadura de Deus descrita por Paulo em Efésios, a fé é descrita como um escudo. O inimigo ataca constantemente com dardos de dúvida, acusação, medo e desespero. O escudo da fé bloqueia esses ataques ao declarar que Deus é bom, fiel e verdadeiro.</p><p>Quando confiamos no caráter de Deus, os dardos mentirosos perdem sua força e caem por terra sem nos ferir.</p>",
        passagens: ["Efésios 6:16", "Salmos 18:30"],
        reflexao: [
          "Qual dardo de dúvida ou medo tem tentado atingir você nos últimos dias?",
          "Como você pode erguer o escudo da fé contra essa mentira usando uma promessa específica da Palavra?"
        ],
        oracao: "Pai, eu levanto hoje o escudo da fé contra toda mentira, medo ou desânimo que tenta invadir minha mente. Declaro que o Teu caminho é perfeito e a Tua palavra é totalmente confiável. Sou protegido pelo Teu amor. Amém."
      }
    ]
  },
  {
    id: "financas",
    titulo: "Sabedoria e Finanças à Luz da Bíblia",
    descricao: "Explore os princípios eternos de Deus para gerenciar seus recursos materiais com sabedoria, fidelidade e paz.",
    categoria: "Mordomia Bíblica",
    imagemUrl: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=800&auto=format&fit=crop",
    ico: "BookMarked",
    licoes: [
      {
        id: "financas-1",
        titulo: "De Quem é a Riqueza?",
        introducao: "O primeiro passo para a liberdade financeira é entender que somos mordomos, e não donos.",
        conteudo: "<p>A Bíblia afirma claramente que tudo pertence ao Senhor. O ouro, a prata, as terras e a nossa própria vida. Quando mudamos nossa mentalidade de 'proprietários' para 'mordomos' (aqueles que administram algo em nome de outro), libertamo-nos do peso da possessividade e da ganância.</p><p>Honrar a Deus com as primícias dos nossos ganhos é um ato de adoração que reconhece Sua soberania e provisão constante sobre nós.</p>",
        passagens: ["Salmos 24:1", "Provérbios 3:9-10"],
        reflexao: [
          "Como o conceito de ser um 'mordomo' altera a sua percepção sobre os seus bens e salário?",
          "De que forma você pode expressar gratidão e adoração a Deus por meio do seu orçamento hoje?"
        ],
        oracao: "Senhor, reconheço que tudo o que tenho vem de Ti. Obrigado pelo sustento e pela oportunidade de gerenciar os Teus recursos. Ajuda-me a ser um mordomo fiel e generoso. Amém."
      },
      {
        id: "financas-2",
        titulo: "Evitando Dívidas e Planejando",
        introducao: "A prudência bíblica nos orienta a poupar, planejar e evitar as armadilhas do endividamento.",
        conteudo: "<p>Provérbios nos alerta que quem toma emprestado se torna servo de quem empresta. O endividamento descontrolado limita nossa liberdade de servir a Deus e abençoar outros. A Palavra elogia o sábio que planeja e armazena recursos em sua casa para tempos difíceis.</p><p>Viver um degrau abaixo das nossas possibilidades e planejar os gastos com sabedoria nos afasta das angústias financeiras.</p>",
        passagens: ["Provérbios 22:7", "Provérbios 21:20"],
        reflexao: [
          "O que tem impedido você de planejar melhor suas despesas e poupar recursos?",
          "Identifique um hábito de consumo que você pode ajustar para honrar melhor sua estabilidade financeira."
        ],
        oracao: "Pai, dá-me sabedoria para conter impulsos de consumo e planejar minha vida financeira com disciplina. Livra-me das amarras das dívidas para que eu possa servir-te com inteira liberdade. Amém."
      }
    ]
  },
  {
    id: "familia",
    titulo: "Restauração de Relacionamentos e Família",
    descricao: "Edifique seu lar e seus relacionamentos sobre as colunas bíblicas do perdão, do amor sacrificial e da verdade.",
    categoria: "Família",
    imagemUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=800&auto=format&fit=crop",
    ico: "Heart",
    licoes: [
      {
        id: "familia-1",
        titulo: "O Vínculo do Perdão",
        introducao: "Nenhum relacionamento sobrevive sem a prática diária e intencional do perdão mútuo.",
        conteudo: "<p>Paulo nos exorta a suportar uns aos outros e a perdoar mutuamente, assim como Cristo nos perdoou. O perdão não é um sentimento, mas uma decisão espiritual de liberar a dívida de quem nos ofendeu. Sem perdão, o rancor cria raízes que destroem casamentos e amizades.</p><p>O amor é o vínculo da perfeição que une corações em meio às imperfeições humanas.</p>",
        passagens: ["Colossenses 3:13-14", "1 Pedro 4:8"],
        reflexao: [
          "Existe alguém no seu círculo familiar ou de amizade que você precisa decidir perdoar hoje?",
          "Como o perdão que você recebeu de Cristo serve de modelo para você perdoar os outros?"
        ],
        oracao: "Querido Pai, perdoa-me pelos meus erros, assim como decido hoje perdoar quem me magoou. Retiro toda raiz de amargura do meu peito e decido amar com o Teu amor sacrificial. Amém."
      },
      {
        id: "familia-2",
        titulo: "Edificando o Lar sobre a Palavra",
        introducao: "A proteção e solidez da família dependem da presença e orientação de Deus no cotidiano do lar.",
        conteudo: "<p>Se o Senhor não edificar a casa, em vão trabalham os construtores. Edificar o lar sob a Palavra significa cultivar um ambiente de oração, respeito e bondade recíproca. Tratar uns aos outros com compaixão e brandura blinda a família contra as divisões deste mundo.</p><p>Que a sua casa seja um refúgio de paz onde o caráter de Cristo é refletido.</p>",
        passagens: ["Salmos 127:1", "Efésios 4:32"],
        reflexao: [
          "Como você avalia o 'alicerce espiritual' da sua casa hoje? Onde precisam melhorar?",
          "Que passos práticos de bondade e respeito você pode dar em direção aos seus familiares hoje?"
        ],
        oracao: "Senhor Jesus, eu consagro minha casa e minha família a Ti. Edifica o nosso lar sobre a Tua verdade. Que haja paz, respeito, união e compaixão em nossa convivência diária. Amém."
      }
    ]
  },
  {
    id: "discipulado",
    titulo: "Crescimento Espiritual e Discipulado",
    descricao: "Foque na intimidade com Deus para frutificar espiritualmente e cumprir o chamado de fazer novos discípulos.",
    categoria: "Crescimento",
    imagemUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop",
    ico: "BookMarked",
    licoes: [
      {
        id: "discipulado-1",
        titulo: "Permanecendo na Videira",
        introducao: "O crescimento espiritual não é esforço humano, mas o resultado natural de permanecer conectado a Cristo.",
        conteudo: "<p>Jesus afirma ser a Videira Verdadeira e nós as varas. Sem Ele, nada podemos fazer de valor eterno. Permanecer em Cristo significa cultivar uma vida constante de oração, leitura bíblica e obediência. O fruto do Espírito cresce em nós na medida em que nos submetemos ao Seu trabalhar.</p><p>O fruto gerado glorifica ao Pai e abençoa o próximo.</p>",
        passagens: ["João 15:4-5", "Gálatas 5:22-23"],
        reflexao: [
          "Você tem separado tempo diário para simplesmente 'permanecer' e conversar com a Videira (Jesus)?",
          "Qual aspecto do Fruto do Espírito (paz, paciência, mansidão, bondade) você mais deseja ver crescer hoje?"
        ],
        oracao: "Jesus, reconheço que sem Ti eu nada posso fazer. Decido permanecer em Ti hoje e nutrir minha alma com a Tua presença. Limpa o meu coração para que eu produza muito fruto para a Tua glória. Amém."
      },
      {
        id: "discipulado-2",
        titulo: "Tomando a Cruz e Seguindo",
        introducao: "O verdadeiro discipulado envolve renúncia pessoal e obediência à grande comissão.",
        conteudo: "<p>Jesus convida seus seguidores a negarem-se a si mesmos, tomarem sua cruz a cada dia e segui-lo. O caminho do discipulado requer alinhar a nossa vontade com os planos eternos do mestre. Além disso, somos comissionados a ir e fazer discípulos de todas as nações.</p><p>A caminhada com Cristo é ativa e nos move a ensinar e caminhar ao lado de outros irmãos.</p>",
        passagens: ["Lucas 9:23", "Mateus 28:19-20"],
        reflexao: [
          "O que significa para você 'negar-se a si mesmo' e tomar sua cruz na rotina atual?",
          "Quem na sua comunidade você pode apoiar e discipular compartilhando o que tem aprendido?"
        ],
        oracao: "Mestre Jesus, aceito o Teu convite para tomar minha cruz a cada dia e seguir-te. Capacita-me com o Teu Espírito para anunciar a Tua graça e caminhar em amor com os meus irmãos. Amém."
      }
    ]
  },
  {
    id: "desanimo",
    titulo: "Vencendo o Desânimo e a Tristeza",
    descricao: "Encontre cura, restauração mental e a renovação de suas forças emocionais no refúgio seguro de Deus.",
    categoria: "Cura Interior",
    imagemUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop",
    ico: "Compass",
    licoes: [
      {
        id: "desanimo-1",
        titulo: "Forças Renovadas",
        introducao: "Deus é o especialista em dar força ao cansado e multiplicar o vigor daquele que se sente fraco.",
        conteudo: "<p>O profeta Isaías nos garante que mesmo os jovens mais fortes se cansam e tropeçam, mas aqueles que esperam no Senhor renovam suas forças. Eles sobem com asas como águias, correm e não se cansam, caminham e não se fatigam. Esperar em Deus é confiar no Seu tempo e repousar em Seu poder.</p><p>Quando a alma estiver triste, podemos questionar e direcionar nossos pensamentos para a soberania do Pai.</p>",
        passagens: ["Isaías 40:29-31", "Salmos 42:11"],
        reflexao: [
          "Em quais áreas do seu coração você tem se sentido espiritualmente ou emocionalmente esgotado ultimamente?",
          "O que significa para você, hoje, 'esperar no Senhor' para renovar o seu vigor?"
        ],
        oracao: "Senhor, meu vigor se esgotou e me sinto cansado. Venho a Ti para receber o Teu renovo. Escolho esperar em Ti, pois sei que renovarás minhas forças e me farás andar com segurança sobre as alturas. Amém."
      },
      {
        id: "desanimo-2",
        titulo: "A Alegria que Fortalece",
        introducao: "A alegria do Senhor é a nossa sentinela e força nos dias de tristeza.",
        conteudo: "<p>Neemias nos exorta: 'Não vos entristeçais; porque a alegria do Senhor é a vossa força'. Essa alegria não depende do riso constante ou de facilidades terrenas, mas da certeza inabalável da nossa salvação. O choro pode durar uma noite inteira, mas o favor de Deus garante que a alegria virá pela manhã.</p><p>Foque nos motivos eternos de regozijo que temos em Cristo.</p>",
        passagens: ["Neemias 8:10", "Salmos 30:5"],
        reflexao: [
          "Como a certeza da sua salvação em Cristo pode trazer alegria mesmo quando as circunstâncias atuais são tristes?",
          "Como você pode focar hoje na bondade de Deus para afastar a sombra do desânimo?"
        ],
        oracao: "Querido Deus, preenche o meu ser com a Tua alegria, que é a minha fortaleza. Creio que, embora o choro dure uma noite, a Tua restauração e alegria virão pela manhã sobre a minha vida. Amém."
      }
    ]
  }
];

export const DEVOCIONAIS_PADRAO: Devocional[] = [
  {
    data: "2026-07-16",
    titulo: "A Confiança em Meio ao Caos",
    texto: "<p>Em 1 Crônicas vemos as preparações detalhadas do Templo e as lutas de Davi. Em meio às lutas cotidianas, a palavra de Deus nos convida a descansar. Muitas vezes corremos para estruturar nossas vidas com nossas próprias forças, esquecendo que o verdadeiro Santuário é construído por Deus em nós.</p><p>Quando Davi pecou ao fazer o censo, ele reconheceu o erro e se lançou nas mãos de Deus, sabendo que Sua misericórdia é infinita. Que hoje possamos nos render à misericórdia de Deus, sabendo que as nossas vidas estão seguras debaixo de Suas asas protetoras.</p>",
    aplicacao: "Hoje, ao invés de buscar controlar todas as variáveis do seu dia, separe 5 minutos para orar entregando o controle de sua vida inteiramente ao Pai.",
    oracao: "Pai Eterno, reconheço que muitas vezes sou ansioso e tento guiar meu caminho com minhas próprias mãos. Rendo-me à tua imensa misericórdia no dia de hoje. Em nome de Jesus, Amém."
  },
  {
    data: "2026-07-17",
    titulo: "Crescendo na Graça e no Conhecimento",
    texto: "<p>A leitura de hoje nos convida a mergulhar nas instruções detalhadas para o culto e serviço do Senhor. Tudo aponta para uma verdade maior: servir a Deus requer dedicação, ordem e amor. Na carta aos Romanos, Paulo nos lembra que fomos justificados pela fé e temos paz com Deus.</p><p>Esta paz não é a ausência de conflitos, mas a presença constante e consoladora do próprio Deus em nosso caminhar.</p>",
    aplicacao: "Compartilhe uma palavra de encorajamento ou um versículo lido hoje com um colega de trabalho ou amigo próximo.",
    oracao: "Querido Deus, obrigado pela paz da justificação que tenho em Cristo Jesus. Guia meus passos hoje para que minhas ações demonstrem o Teu amor. Amém."
  }
];

// ==================== INFORMAÇÕES DA IGREJA ====================

export const EVENTOS_PADRAO: Evento[] = [
  {
    id: "e1",
    titulo: "Conferência Global da Fé 2026",
    descricao: "Um encontro marcante para alinhar nosso coração com os propósitos eternos do Senhor. Três dias de adoração profunda, palavra inspiradora e comunhão intencional.",
    data: "2026-07-24",
    local: "Auditório Principal",
    imagemUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "e2",
    titulo: "Retiro de Jovens: Conectados",
    descricao: "Venha viver dias de transformação na presença do Senhor, longe da correria do dia a dia. Muita dinâmica, louvor, trilhas e renovo espiritual para os jovens.",
    data: "2026-08-14",
    local: "Recanto dos Lagos",
    imagemUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "e3",
    titulo: "Seminário para Casais: Edificando o Lar",
    descricao: "Princípios bíblicos práticos para fortalecer o casamento e criar uma atmosfera de paz, amor e respeito mútuo em sua casa. Vagas limitadas.",
    data: "2026-09-05",
    local: "Salão Social",
    imagemUrl: "https://images.unsplash.com/photo-1464798429116-8e26f96b2e60?q=80&w=600&auto=format&fit=crop"
  }
];

export const AVISOS_PADRAO: Aviso[] = [
  { id: "a1", titulo: "Leitura Coletiva e Debate de Romanos - Próxima Segunda", categoria: "Estudo Bíblico", data: "Segunda-feira" },
  { id: "a2", titulo: "Dia Comunitário de Jejum e Oração - Semanal", categoria: "Oração", data: "Semanal" },
  { id: "a3", titulo: "Perguntas Bíblicas da Semana respondidas no Mural", categoria: "Mural", data: "Semanal" },
  { id: "a4", titulo: "Encontro de Estudo Bíblico Online via Vídeo", categoria: "Estudo Bíblico", data: "2026-08-02" }
];

export const NOTICIAS_PADRAO: Noticia[] = [
  {
    id: "n1",
    titulo: "Inauguração do Novo Espaço Kids da Igreja",
    resumo: "Um ambiente totalmente remodelado e seguro para o ensino bíblico criativo e diversão de nossas crianças.",
    conteudo: "<p>Com imensa alegria, a igreja anuncia a inauguração do novo <strong>Espaço Kids</strong>. Pensado nos mínimos detalhes para acolher crianças de 0 a 10 anos, o espaço conta com acessibilidade, salas temáticas, biblioteca infantil e banheiros adaptados.</p><p>Nosso objetivo é proporcionar um ambiente estimulante onde a Palavra de Deus seja ensinada de forma cativante e relevante para as novas gerações, enquanto os pais adoram tranquilamente no templo principal.</p>",
    imagemUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop"
    ],
    data: "2026-07-10"
  },
  {
    id: "n2",
    titulo: "Projeto Social Impacto distribui alimentos e carinho",
    resumo: "Ação realizada no último sábado beneficiou mais de 120 famílias da comunidade com cestas de alimentos e atendimento médico.",
    conteudo: "<p>Mais uma ação do <strong>Projeto Impacto</strong> levou alento e esperança para as comunidades locais. Com o apoio de voluntários da igreja, foram montadas e entregues mais de 120 cestas básicas, além de oferecer serviços gratuitos de corte de cabelo, atendimento pediátrico, aconselhamento e oração.</p><p>Agradecemos a cada membro que contribuiu com doações e dedicou seu tempo. O evangelho se manifesta na prática!</p>",
    imagemUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
    galeria: [
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop"
    ],
    data: "2026-07-12"
  }
];

export const GALERIA_PADRAO: GaleriaItem[] = [
  { id: "g1", tipo: "imagem", url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop", categoria: "Cultos", titulo: "Celebração Especial de Páscoa" },
  { id: "g2", tipo: "imagem", url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop", categoria: "Social", titulo: "Ação Social Projeto Impacto" },
  { id: "g3", tipo: "imagem", url: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=600&auto=format&fit=crop", categoria: "Jovens", titulo: "Culto de Jovens Conectados" },
  { id: "g4", tipo: "imagem", url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop", categoria: "Eventos", titulo: "Conferência Fé 2026" },
  { id: "g5", tipo: "imagem", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop", categoria: "Cultos", titulo: "Grupo de Louvor e Adoração" }
];

export const PASTORES_PADRAO: Pastor[] = [
  {
    id: "p1",
    nome: "Pr. Roberto Silva",
    cargo: "Pastor Presidente",
    bio: "Graduado em Teologia pelo Seminário Presbiteriano, Roberto serve à igreja há mais de 15 anos com dedicação na pregação expositiva e no pastoreio de famílias.",
    imagemUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    contato: "pr.roberto@igreja.org.br"
  },
  {
    id: "p2",
    nome: "Pr. Felipe Costa",
    cargo: "Pastor Adjunto e Ministério de Jovens",
    bio: "Felipe é apaixonado por discipulado de jovens e plantação de igrejas. Busca equipar a nova geração para viver um evangelho integral na sociedade.",
    imagemUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    contato: "pr.felipe@igreja.org.br"
  },
  {
    id: "p3",
    nome: "Pra. Maria de Souza",
    cargo: "Pastora de Aconselhamento e Ministério de Mulheres",
    bio: "Com formação em psicologia cristã e teologia, Maria tem se dedicado ao pastoreio e aconselhamento de mulheres, lares e cura emocional.",
    imagemUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    contato: "pra.maria@igreja.org.br"
  }
];

export const MINISTERIOS_PADRAO: Ministerio[] = [
  { id: "m1", nome: "Infantil (Kids)", descricao: "Discipulado bíblico criativo e seguro para as crianças.", imagemUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=400&auto=format&fit=crop" },
  { id: "m2", nome: "Jovens (Conectados)", descricao: "Comunhão, louvor e palavra voltada para a juventude.", imagemUrl: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=400&auto=format&fit=crop" },
  { id: "m3", nome: "Ministério de Louvor", descricao: "Adoração em música conduzida com excelência espiritual.", imagemUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop" },
  { id: "m4", nome: "Casais (Famílias)", descricao: "Fortalecendo casamentos baseados na aliança divina.", imagemUrl: "https://images.unsplash.com/photo-1464798429116-8e26f96b2e60?q=80&w=400&auto=format&fit=crop" },
  { id: "m5", nome: "Missões e Ação Social", descricao: "Levando o evangelho prático às ruas e nações.", imagemUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=400&auto=format&fit=crop" },
  { id: "m6", nome: "Intercessão e Oração", descricao: "Coluna espiritual da igreja que clama pelas famílias e ministérios.", imagemUrl: "https://images.unsplash.com/photo-1507421870095-26511b816e0b?q=80&w=400&auto=format&fit=crop" },
  { id: "m7", nome: "Homens (Varões)", descricao: "Homens de fé crescendo juntos em caráter e liderança doméstica.", imagemUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
  { id: "m8", nome: "Mulheres (Virtuosas)", descricao: "Encontros de oração, reflexão e discipulado feminino.", imagemUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" }
];

// ==================== LÓGICA DE PERSISTÊNCIA E ROTAÇÃO ====================

function getHashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getDailyIndex(dateStr: string, length: number): number {
  if (length === 0) return 0;
  const hash = getHashCode(dateStr);
  return hash % length;
}

export const PRAYERS_PADRAO: PedidoOracao[] = [
  {
    id: "po_1",
    nome: "Wilson Filho",
    telefone: "(11) 99999-1111",
    mensagem: "Hoje aceitei Jesus como meu Salvador. Peço as orações de todos para que Deus me mantenha firme nos caminhos do Senhor. Amém!",
    data: "2026-07-13",
    anonimo: false,
    atendido: false,
    privado: false,
    aprovado: true,
    amens: 161,
    comentarios: [
      { id: "c_1", autor: "Maria Souza", texto: "Glória a Deus, Wilson! Estarei orando por você nessa caminhada.", data: "2026-07-13" },
      { id: "c_2", autor: "Pastor André", texto: "Seja muito bem-vindo ao corpo de Cristo, meu irmão!", data: "2026-07-14" }
    ],
    motivo: "Outros"
  },
  {
    id: "po_2",
    nome: "Ana Beatriz",
    telefone: "(11) 99999-2222",
    mensagem: "Peço orações pela restauração da saúde da minha avó que está internada. Que a graça e o conforto do Senhor estejam sobre ela.",
    data: "2026-07-15",
    anonimo: false,
    atendido: false,
    privado: false,
    aprovado: true,
    amens: 42,
    comentarios: [
      { id: "c_3", autor: "Marcos Lima", texto: "Orando pela saúde da sua avó. Deus está no controle.", data: "2026-07-15" }
    ],
    motivo: "Saúde e Enfermidade"
  },
  {
    id: "po_3",
    nome: "Anônimo",
    telefone: "",
    mensagem: "Peço oração direcionada a meu trabalho e decisões profissionais difíceis neste mês. Que o Senhor dê sabedoria.",
    data: "2026-07-16",
    anonimo: true,
    atendido: false,
    privado: false,
    aprovado: true,
    amens: 28,
    comentarios: [],
    motivo: "Vida Financeira e Trabalho"
  }
];

export function getCurrentLocalDateString(): string {
  const date = new Date();
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 10);
  return localISOTime;
}

export class LocalDatabase {
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined';
  }

  private get<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser) return defaultValue;
    const item = localStorage.getItem(`church_portal_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  }

  private set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    localStorage.setItem(`church_portal_${key}`, JSON.stringify(value));
  }

  // --- Versículos do Dia ---
  getVersiculos(): Versiculo[] {
    return this.get<Versiculo[]>('versiculos', VERSICULOS_PADRAO);
  }

  addVersiculo(v: Omit<Versiculo, 'id'>) {
    const list = this.getVersiculos();
    const newV = { ...v, id: list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1 };
    this.set('versiculos', [...list, newV]);
    return newV;
  }

  getVersiculoDoDia(dateStr: string): Versiculo {
    const list = this.getVersiculos();
    const idx = getDailyIndex(dateStr, list.length);
    return list[idx] || VERSICULOS_PADRAO[0];
  }

  // --- Frases do Dia ---
  getFrases(): Frase[] {
    return this.get<Frase[]>('frases', FRASES_PADRAO);
  }

  addFrase(f: Omit<Frase, 'id'>) {
    const list = this.getFrases();
    const newF = { ...f, id: list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1 };
    this.set('frases', [...list, newF]);
    return newF;
  }

  getFraseDoDia(dateStr: string): Frase {
    const list = this.getFrases();
    const idx = getDailyIndex(dateStr + "_frase", list.length);
    return list[idx] || FRASES_PADRAO[0];
  }

  // --- Orações do Dia ---
  getOracoes(): Oracao[] {
    return this.get<Oracao[]>('oracoes', ORACOES_PADRAO);
  }

  addOracao(o: Omit<Oracao, 'id'>) {
    const list = this.getOracoes();
    const newO = { ...o, id: list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1 };
    this.set('oracoes', [...list, newO]);
    return newO;
  }

  getOracaoDoDia(dateStr: string): Oracao {
    const list = this.getOracoes();
    const idx = getDailyIndex(dateStr + "_oracao", list.length);
    return list[idx] || ORACOES_PADRAO[0];
  }

  // --- Curiosidades ---
  getCuriosidades(): Curiosidade[] {
    return this.get<Curiosidade[]>('curiosidades', CURIOSIDADES_PADRAO);
  }

  addCuriosidade(c: Omit<Curiosidade, 'id'>) {
    const list = this.getCuriosidades();
    const newC = { ...c, id: list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1 };
    this.set('curiosidades', [...list, newC]);
    return newC;
  }

  getCuriosidadeDoDia(dateStr: string): Curiosidade {
    const list = this.getCuriosidades();
    const idx = getDailyIndex(dateStr + "_curiosidade", list.length);
    return list[idx] || CURIOSIDADES_PADRAO[0];
  }

  // --- Perguntas Bíblicas ---
  getPerguntas(): Pergunta[] {
    return this.get<Pergunta[]>('perguntas', PERGUNTAS_PADRAO);
  }

  addPergunta(p: Omit<Pergunta, 'id'>) {
    const list = this.getPerguntas();
    const newP = { ...p, id: list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1 };
    this.set('perguntas', [...list, newP]);
    return newP;
  }

  getPerguntaDoDia(dateStr: string): Pergunta {
    const list = this.getPerguntas();
    const idx = getDailyIndex(dateStr + "_pergunta", list.length);
    return list[idx] || PERGUNTAS_PADRAO[0];
  }

  // --- Desafios ---
  getDesafios(): Desafio[] {
    return this.get<Desafio[]>('desafios', DESAFIOS_PADRAO);
  }

  addDesafio(d: Omit<Desafio, 'id'>) {
    const list = this.getDesafios();
    const newD = { ...d, id: list.length > 0 ? Math.max(...list.map(x => x.id)) + 1 : 1 };
    this.set('desafios', [...list, newD]);
    return newD;
  }

  getDesafioDoDia(dateStr: string): Desafio {
    const list = this.getDesafios();
    const idx = getDailyIndex(dateStr + "_desafio", list.length);
    return list[idx] || DESAFIOS_PADRAO[0];
  }

  // --- Leituras Diárias ---
  getLeituras(): LeituraProgramada[] {
    return this.get<LeituraProgramada[]>('leituras_programadas', LEITURAS_PADRAO);
  }

  addLeitura(l: LeituraProgramada) {
    const list = this.getLeituras().filter(x => x.data !== l.data);
    const newList = [...list, l].sort((a, b) => a.data.localeCompare(b.data));
    this.set('leituras_programadas', newList);
  }

  deleteLeitura(data: string) {
    const list = this.getLeituras().filter(x => x.data !== data);
    this.set('leituras_programadas', list);
  }

  getLeituraDaData(dateStr: string): LeituraProgramada | null {
    const list = this.getLeituras();
    const match = list.find(x => x.data === dateStr);
    if (match) return match;
    
    // Rotação automática caso a data não possua registro manual
    const idx = getDailyIndex(dateStr + "_leitura_auto", LEITURAS_PADRAO.length);
    const fallback = LEITURAS_PADRAO[idx] || LEITURAS_PADRAO[0];
    return {
      data: dateStr,
      leituras: fallback.leituras,
      tempoEstimado: fallback.tempoEstimado,
      trechoBiblico: fallback.trechoBiblico
    };
  }

  // --- Devocionais ---
  getDevocionais(): Devocional[] {
    return this.get<Devocional[]>('devocionais', DEVOCIONAIS_PADRAO);
  }

  addDevocional(d: Devocional) {
    const list = this.getDevocionais().filter(x => x.data !== d.data);
    const newList = [...list, d].sort((a, b) => a.data.localeCompare(b.data));
    this.set('devocionais', newList);
  }

  deleteDevocional(data: string) {
    const list = this.getDevocionais().filter(x => x.data !== data);
    this.set('devocionais', list);
  }

  getDevocionalDaData(dateStr: string): Devocional | null {
    const list = this.getDevocionais();
    const match = list.find(x => x.data === dateStr);
    if (match) return match;

    // Rotação automática caso a data não possua registro manual
    const idx = getDailyIndex(dateStr + "_devocional_auto", DEVOCIONAIS_PADRAO.length);
    const fallback = DEVOCIONAIS_PADRAO[idx] || DEVOCIONAIS_PADRAO[0];
    return {
      data: dateStr,
      titulo: fallback.titulo,
      texto: fallback.texto,
      aplicacao: fallback.aplicacao,
      oracao: fallback.oracao
    };
  }

  // --- Progresso ---
  getProgressoLeitura(): { [date: string]: boolean } {
    return this.get<{ [date: string]: boolean }>('progresso_leitura', {});
  }

  marcarLeituraConcluida(dateStr: string, concluida: boolean) {
    const prog = this.getProgressoLeitura();
    prog[dateStr] = concluida;
    this.set('progresso_leitura', prog);
  }

  // --- Eventos ---
  getEventos(): Evento[] {
    return this.get<Evento[]>('eventos', EVENTOS_PADRAO);
  }

  addEvento(ev: Omit<Evento, 'id'>) {
    const list = this.getEventos();
    const newEv = { ...ev, id: `e_${Math.random().toString(36).substr(2, 9)}` };
    this.set('eventos', [...list, newEv]);
    return newEv;
  }

  // --- Avisos ---
  getAvisos(): Aviso[] {
    return this.get<Aviso[]>('avisos', AVISOS_PADRAO);
  }

  addAviso(av: Omit<Aviso, 'id'>) {
    const list = this.getAvisos();
    const newAv = { ...av, id: `a_${Math.random().toString(36).substr(2, 9)}` };
    this.set('avisos', [...list, newAv]);
    return newAv;
  }

  // --- Notícias ---
  getNoticias(): Noticia[] {
    return this.get<Noticia[]>('noticias', NOTICIAS_PADRAO);
  }

  addNoticia(no: Omit<Noticia, 'id'>) {
    const list = this.getNoticias();
    const newNo = { ...no, id: `n_${Math.random().toString(36).substr(2, 9)}` };
    this.set('noticias', [...list, newNo]);
    return newNo;
  }

  // --- Métodos de Edição e Exclusão do Mural ---
  deleteEvento(id: string) {
    const list = this.getEventos().filter(x => x.id !== id);
    this.set('eventos', list);
  }

  updateEvento(ev: Evento) {
    const list = this.getEventos().map(x => x.id === ev.id ? ev : x);
    this.set('eventos', list);
  }

  deleteAviso(id: string) {
    const list = this.getAvisos().filter(x => x.id !== id);
    this.set('avisos', list);
  }

  updateAviso(av: Aviso) {
    const list = this.getAvisos().map(x => x.id === av.id ? av : x);
    this.set('avisos', list);
  }

  deleteNoticia(id: string) {
    const list = this.getNoticias().filter(x => x.id !== id);
    this.set('noticias', list);
  }

  updateNoticia(no: Noticia) {
    const list = this.getNoticias().map(x => x.id === no.id ? no : x);
    this.set('noticias', list);
  }

  // --- Galeria ---
  getGaleria(): GaleriaItem[] {
    return this.get<GaleriaItem[]>('galeria', GALERIA_PADRAO);
  }

  addGaleriaItem(g: Omit<GaleriaItem, 'id'>) {
    const list = this.getGaleria();
    const newG = { ...g, id: `g${list.length + 1}` };
    this.set('galeria', [...list, newG]);
    return newG;
  }

  // --- Pastores ---
  getPastores(): Pastor[] {
    return this.get<Pastor[]>('pastores', PASTORES_PADRAO);
  }

  addPastor(p: Omit<Pastor, 'id'>) {
    const list = this.getPastores();
    const newP = { ...p, id: `p${list.length + 1}` };
    this.set('pastores', [...list, newP]);
    return newP;
  }

  // --- Ministérios ---
  getMinisterios(): Ministerio[] {
    return this.get<Ministerio[]>('ministerios', MINISTERIOS_PADRAO);
  }

  addMinisterio(m: Omit<Ministerio, 'id'>) {
    const list = this.getMinisterios();
    const newM = { ...m, id: `m${list.length + 1}` };
    this.set('ministerios', [...list, newM]);
    return newM;
  }

  // --- Pedidos de Oração ---
  getPedidosOracao(): PedidoOracao[] {
    return this.get<PedidoOracao[]>('pedidos_oracao', PRAYERS_PADRAO);
  }

  addPedidoOracao(po: Omit<PedidoOracao, 'id' | 'data' | 'atendido' | 'aprovado' | 'amens' | 'comentarios'>) {
    const list = this.getPedidosOracao();
    const newPo: PedidoOracao = {
      ...po,
      id: `po_${Math.random().toString(36).substr(2, 9)}`,
      data: getCurrentLocalDateString(),
      atendido: false,
      aprovado: false, // Novos pedidos de oração públicos precisam de aprovação prévia
      amens: 0,
      comentarios: []
    };
    this.set('pedidos_oracao', [newPo, ...list]);
    return newPo;
  }

  marcarPedidoOracaoAprovado(id: string, aprovado: boolean) {
    const list = this.getPedidosOracao();
    const item = list.find(x => x.id === id);
    if (item) {
      item.aprovado = aprovado;
      this.set('pedidos_oracao', list);
    }
  }

  marcarPedidoOracaoAtendido(id: string, atendido: boolean) {
    const list = this.getPedidosOracao();
    const item = list.find(x => x.id === id);
    if (item) {
      item.atendido = atendido;
      this.set('pedidos_oracao', list);
    }
  }

  darAmen(id: string): number {
    const list = this.getPedidosOracao();
    const item = list.find(x => x.id === id);
    if (item) {
      item.amens = (item.amens || 0) + 1;
      this.set('pedidos_oracao', list);
      return item.amens;
    }
    return 0;
  }

  adicionarComentario(pedidoId: string, autor: string, texto: string): ComentarioOracao | null {
    const list = this.getPedidosOracao();
    const item = list.find(x => x.id === pedidoId);
    if (item) {
      if (!item.comentarios) item.comentarios = [];
      const newComment: ComentarioOracao = {
        id: `c_${Math.random().toString(36).substr(2, 9)}`,
        autor: autor.trim() || "Anônimo",
        texto: texto.trim(),
        data: getCurrentLocalDateString()
      };
      item.comentarios.push(newComment);
      this.set('pedidos_oracao', list);
      return newComment;
    }
    return null;
  }

  deletePedidoOracao(id: string) {
    const list = this.getPedidosOracao().filter(x => x.id !== id);
    this.set('pedidos_oracao', list);
  }

  deleteComentarioOracao(pedidoId: string, comentarioId: string) {
    const list = this.getPedidosOracao();
    const item = list.find(x => x.id === pedidoId);
    if (item && item.comentarios) {
      item.comentarios = item.comentarios.filter(x => x.id !== comentarioId);
      this.set('pedidos_oracao', list);
    }
  }

  // --- Motivos de Oração ---
  getMotivosOracao(): string[] {
    return this.get<string[]>('motivos_oracao', ["Saúde e Enfermidade", "Família e Restauração Lar", "Vida Financeira e Trabalho", "Outros"]);
  }

  setMotivosOracao(motivos: string[]) {
    this.set('motivos_oracao', motivos);
  }

  // --- Pedidos de Visita ---
  getPedidosVisita(): PedidoVisita[] {
    return this.get<PedidoVisita[]>('pedidos_visita', []);
  }

  addPedidoVisita(pv: Omit<PedidoVisita, 'id' | 'data' | 'atendido'>) {
    const list = this.getPedidosVisita();
    const newPv: PedidoVisita = {
      ...pv,
      id: `pv_${Math.random().toString(36).substr(2, 9)}`,
      data: getCurrentLocalDateString(),
      atendido: false
    };
    this.set('pedidos_visita', [newPv, ...list]);
    return newPv;
  }

  marcarPedidoVisitaAtendido(id: string, atendido: boolean) {
    const list = this.getPedidosVisita();
    const item = list.find(x => x.id === id);
    if (item) {
      item.atendido = atendido;
      this.set('pedidos_visita', list);
    }
  }

  // --- Contador de Acessos ---
  getAcessos(): number {
    return this.get<number>('acessos_contador', 0);
  }

  incrementarAcessos(): number {
    const atual = this.getAcessos();
    const novo = atual + 1;
    this.set('acessos_contador', novo);
    return novo;
  }
}

// Singleton helper para usar no cliente
let dbInstance: LocalDatabase;
export function getDb(): LocalDatabase {
  if (!dbInstance) {
    dbInstance = new LocalDatabase();
  }
  return dbInstance;
}
