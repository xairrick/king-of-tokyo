export interface Monster {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export interface Player {
  id: string;
  playerName: string;
  monsterName: string;
  monsterId: string;
  health: number;
  stars: number;
  inTokyo: boolean;
}

export type GamePhase = 'setup' | 'playing' | 'won';

export interface GameState {
  phase: GamePhase;
  playerCount: number;
  players: Player[];
  winnerId: string | null;
}

export const DEFAULT_HEALTH = 10;
export const MAX_HEALTH = 12;
export const MIN_HEALTH = 0;
export const MAX_STARS = 20;
export const MIN_STARS = 0;
