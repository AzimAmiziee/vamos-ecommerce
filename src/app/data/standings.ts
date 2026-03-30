export interface StandingsEntry {
  rank: number;
  team: string;
  matchWins: number;
  matchLosses: number;
  gameWins: number;
  gameLosses: number;
  points: number;
  isVamos: boolean;
}

export const mplMyS16Standings: StandingsEntry[] = [
  { rank: 1, team: 'SRG OG ESPORTS',     matchWins: 9, matchLosses: 0, gameWins: 18, gameLosses: 3,  points: 24, isVamos: false },
  { rank: 2, team: 'CG ESPORTS',          matchWins: 5, matchLosses: 4, gameWins: 13, gameLosses: 8,  points: 18, isVamos: false },
  { rank: 3, team: 'TEAM VAMOS',          matchWins: 6, matchLosses: 3, gameWins: 13, gameLosses: 8,  points: 17, isVamos: true  },
  { rank: 4, team: 'HOMEBOIS',            matchWins: 5, matchLosses: 4, gameWins: 11, gameLosses: 9,  points: 15, isVamos: false },
  { rank: 5, team: 'MONSTER VICIOUS',     matchWins: 5, matchLosses: 4, gameWins: 10, gameLosses: 8,  points: 15, isVamos: false },
  { rank: 6, team: 'AERO ESPORTS',        matchWins: 4, matchLosses: 5, gameWins: 10, gameLosses: 11, points: 13, isVamos: false },
  { rank: 7, team: 'UNTITLED',            matchWins: 4, matchLosses: 5, gameWins: 9,  gameLosses: 11, points: 12, isVamos: false },
  { rank: 8, team: 'TEAM REY',            matchWins: 3, matchLosses: 6, gameWins: 7,  gameLosses: 14, points: 8,  isVamos: false },
  { rank: 9, team: 'TODAK',               matchWins: 3, matchLosses: 6, gameWins: 7,  gameLosses: 14, points: 8,  isVamos: false },
  { rank: 10, team: 'GAMESMY KELANTAN',   matchWins: 1, matchLosses: 8, gameWins: 5,  gameLosses: 17, points: 5,  isVamos: false },
];
