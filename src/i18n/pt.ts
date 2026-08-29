import type { en } from "./en";

// Typed against `en`, so every key here is required and matches the English signatures.
export const pt: typeof en = {
  yourBoard: "Seu tabuleiro",
  yourFinalBoard: "Seu tabuleiro final",
  target: "Alvo",

  moves: "Jogadas",
  par: "Par",

  bestToday: (best) => `Melhor de hoje ${best}`,
  dayStreak: (streak) =>
    `🔥 ${streak} ${streak === 1 ? "dia seguido" : "dias seguidos"}`,
  bestStreak: (days) => `🏆 Melhor sequência: ${days}`,

  optimal: "Perfeito",

  nextPuzzleIn: "Próximo desafio em",

  gaveUpHeadline: "Você desistiu do desafio de hoje.",
  gaveUpSubhead: "Volte amanhã para um novo.",
  optimalHeadline: "Perfeito! 🏆",
  optimalSubhead: (par) =>
    `Você igualou o par (${par}) — o mínimo de jogadas possível.`,
  solvedHeadline: (moves) => `Resolvido em ${moves}`,
  solvedSubhead: (par) => `O par é ${par}. Consegue igualar?`,
  parWasNoResets: (par) => `O par era ${par}. Sem tentativas restantes.`,
  tryAgain: (remaining) => `Tentar de novo (${remaining})`,

  reset: (remaining) => `Reiniciar (${remaining})`,
  giveUp: "Desisto",
  doneForToday: "Encerrar por hoje",
  controlLabel: (orientation, line, direction) => {
    const noun = orientation === "row" ? "linha" : "coluna";
    const way = {
      row: { back: "a esquerda", forward: "a direita" },
      column: { back: "cima", forward: "baixo" },
    }[orientation][direction];
    return `Mover ${noun} ${line} para ${way}`;
  },

  muteSound: "Silenciar",
  unmuteSound: "Ativar som",
  switchToLightTheme: "Mudar para o tema claro",
  switchToDarkTheme: "Mudar para o tema escuro",

  menu: "Menu",
  sound: "Som",
  theme: "Tema",
  language: "Idioma",

  installPrompt: "Baixe e jogue offline",
  install: "Instalar",
  dismiss: "Dispensar",
  close: "Fechar",

  winDistribution: "Distribuição de vitórias",
  orMore: "ou mais",
  played: "Joguei",
  winRate: "Venci",
  dnf: "Não resolvi",

  madeBy: "Feito por",

  howToPlay: {
    heading: "Como jogar",
    cta: "Entendi — jogar",
    steps: [
      {
        title: "Iguale o alvo.",
        body: "Reorganize seu tabuleiro até que ele corresponda ao alvo de hoje.",
      },
      {
        title: "Desloque linhas e colunas.",
        body: "Toque nas setas ou deslize uma linha (◀ ▶) ou coluna (▲ ▼) para movê-la. A peça que sai por uma borda reaparece no lado oposto.",
      },
      {
        title: "Atenção à estrela.",
        body: "Em alguns dias surge uma peça marcada (★) — leve-a também até seu lugar no alvo, como as demais.",
      },
      {
        title: "Alcance o par.",
        body: "O par é o menor número de jogadas possível. Iguale-o para um resultado {optimal}.",
      },
      {
        title: "Mantenha sua sequência.",
        body: "Resolva um desafio todo dia para manter sua sequência.",
      },
    ],
  },

  share: {
    button: "Compartilhar",
    copied: "Resultado copiado",
    optimal: "🏆 Resolvido no par",
    solved: (moves, par) => `✅ Resolvido em ${moves} (+${moves - par})`,
  },

  swipeNews: {
    heading: "Novo: deslize para mover",
    body: "Arraste uma linha ou coluna com o dedo para movê-la — sem precisar tocar nas setas.",
    cta: "Entendi",
  },

  support: {
    prompt: "Curtindo o Loop? Me apoie",
    cta: "aqui",
    heading: "Apoie o jogo",
    withPix: "Com PIX",
    pixQrAlt: "QR Code do PIX",
    copyPix: "PIX copia e cola",
    copied: "Copiado!",
    or: "ou",
    buyMeACoffee: "Buy Me a Coffee",
  },
};
