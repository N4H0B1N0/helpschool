const CURSOS = [
  {
    id: "html", titulo: "HTML e CSS do Zero", categoria: "Programação", horas: 20,
    descricao: "Aprenda a estruturar e estilizar páginas web.",
    aulas: [
      { titulo: "O que é HTML?", texto: "HTML (HyperText Markup Language) é a linguagem que define a estrutura de uma página: títulos, parágrafos, imagens e links. Cada elemento é escrito com tags, como <h1> e <p>." },
      { titulo: "Tags e atributos", texto: "Atributos adicionam informações às tags. Exemplo: <a href=\"https://exemplo.com\">link</a>. O atributo href indica o destino do link." },
      { titulo: "Introdução ao CSS", texto: "CSS (Cascading Style Sheets) controla a aparência: cores, fontes e espaçamentos. Ele seleciona elementos e aplica regras de estilo." },
      { titulo: "Layout com Flexbox", texto: "Flexbox organiza elementos em linha ou coluna. Com display:flex no contêiner, você controla alinhamento e distribuição dos itens." }
    ],
    quiz: [
      { p: "Qual tag define o título principal da página?", o: ["<p>", "<h1>", "<div>"], c: 1 },
      { p: "Qual atributo define o destino de um link?", o: ["src", "href", "alt"], c: 1 },
      { p: "CSS serve principalmente para…", o: ["Estilizar a página", "Guardar dados", "Criar bancos"], c: 0 },
      { p: "Qual propriedade ativa o Flexbox?", o: ["display:flex", "float:flex", "position:flex"], c: 0 }
    ]
  },
  {
    id: "js", titulo: "JavaScript Essencial", categoria: "Programação", horas: 30,
    descricao: "Lógica de programação e interatividade para a web.",
    aulas: [
      { titulo: "Variáveis e tipos", texto: "Variáveis guardam valores. Use let para valores que mudam e const para constantes. Tipos comuns: number, string, boolean." },
      { titulo: "Condições", texto: "Com if/else o programa toma decisões: if (idade >= 18) { ... } else { ... }." },
      { titulo: "Laços de repetição", texto: "for e while repetem blocos de código. Ex.: for (let i = 0; i < 5; i++) executa 5 vezes." },
      { titulo: "Funções", texto: "Funções agrupam código reutilizável: function somar(a, b) { return a + b; }." }
    ],
    quiz: [
      { p: "Qual palavra declara uma constante?", o: ["var", "let", "const"], c: 2 },
      { p: "Qual estrutura toma decisões?", o: ["if/else", "for", "return"], c: 0 },
      { p: "Quantas vezes roda for(let i=0;i<5;i++)?", o: ["4", "5", "6"], c: 1 },
      { p: "Funções servem para…", o: ["Repetir código reutilizável", "Criar estilos", "Definir cores"], c: 0 }
    ]
  },
  {
    id: "gestao", titulo: "Gestão de Projetos Ágeis", categoria: "Gestão", horas: 15,
    descricao: "Scrum, backlog e entrega contínua de valor.",
    aulas: [
      { titulo: "Princípios ágeis", texto: "O Manifesto Ágil valoriza indivíduos e interações, software funcionando, colaboração com o cliente e resposta a mudanças." },
      { titulo: "Product Backlog", texto: "É a lista priorizada de tudo que o produto precisa. O Product Owner mantém e ordena os itens por valor." },
      { titulo: "Sprints", texto: "Sprint é um ciclo curto (1 a 4 semanas) em que o time entrega um incremento do produto." },
      { titulo: "Planning Poker", texto: "Técnica de estimativa em que o time usa cartas (Story Points) para medir a complexidade de cada item." }
    ],
    quiz: [
      { p: "Quem prioriza o Product Backlog?", o: ["Product Owner", "Cliente final", "Estagiário"], c: 0 },
      { p: "Quanto dura uma Sprint tipicamente?", o: ["1 a 4 semanas", "1 ano", "1 hora"], c: 0 },
      { p: "Planning Poker serve para…", o: ["Estimar esforço", "Contratar", "Testar código"], c: 0 },
      { p: "O Manifesto Ágil valoriza…", o: ["Burocracia", "Colaboração com o cliente", "Documentação exaustiva"], c: 1 }
    ]
  }
];
const NOTA_MINIMA = 70; 
