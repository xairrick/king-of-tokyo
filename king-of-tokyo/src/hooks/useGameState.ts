import { useState, useEffect, useCallback } from 'react';
import type { GameState, Player } from '../types/game';
import { DEFAULT_HEALTH, MAX_HEALTH, MIN_HEALTH, MAX_STARS, MIN_STARS } from '../types/game';
import { MONSTERS } from '../constants/monsters';

const STORAGE_KEY = 'king-of-tokyo-state';

function buildInitialPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i}`,
    playerName: `Player ${i + 1}`,
    monsterName: MONSTERS[i % MONSTERS.length].name,
    monsterId: MONSTERS[i % MONSTERS.length].id,
    health: DEFAULT_HEALTH,
    stars: 0,
    inTokyo: false,
  }));
}

const initialState: GameState = {
  phase: 'setup',
  playerCount: 2,
  players: [],
  winnerId: null,
};

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GameState;
  } catch {
    // ignore
  }
  return initialState;
}

export function useGameState() {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const startGame = useCallback((playerCount: number, players: Player[]) => {
    setState({
      phase: 'playing',
      playerCount,
      players,
      winnerId: null,
    });
  }, []);

  const newGame = useCallback(() => {
    setState({ ...initialState });
  }, []);

  const updatePlayer = useCallback((id: string, updates: Partial<Player>) => {
    setState((prev) => {
      const players = prev.players.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );

      // Check win condition
      const winner = players.find((p) => p.stars >= MAX_STARS);

      return {
        ...prev,
        players,
        phase: winner ? 'won' : prev.phase,
        winnerId: winner ? winner.id : prev.winnerId,
      };
    });
  }, []);

  const adjustHealth = useCallback((id: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id
          ? { ...p, health: Math.min(MAX_HEALTH, Math.max(MIN_HEALTH, p.health + delta)) }
          : p
      ),
    }));
  }, []);

  const adjustStars = useCallback((id: string, delta: number) => {
    setState((prev) => {
      const players = prev.players.map((p) =>
        p.id === id
          ? { ...p, stars: Math.min(MAX_STARS, Math.max(MIN_STARS, p.stars + delta)) }
          : p
      );
      const winner = players.find((p) => p.stars >= MAX_STARS);
      return {
        ...prev,
        players,
        phase: winner ? 'won' : prev.phase,
        winnerId: winner ? winner.id : prev.winnerId,
      };
    });
  }, []);

  const smashTokyo = useCallback(() => {
    setState((prev) => {
      const tokyoPlayer = prev.players.find((p) => p.inTokyo);
      if (!tokyoPlayer) return prev;
      const players = prev.players.map((p) =>
        p.inTokyo ? p : { ...p, health: Math.max(MIN_HEALTH, p.health - 1) }
      );
      return { ...prev, players };
    });
  }, []);

  const continueGame = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'playing', winnerId: null }));
  }, []);

  const revivePlayer = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id ? { ...p, health: 5 } : p
      ),
    }));
  }, []);

  const claimTokyo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) => ({
        ...p,
        inTokyo: p.id === id,
      })),
    }));
  }, []);

  const leaveTokyo = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === id ? { ...p, inTokyo: false } : p
      ),
    }));
  }, []);

  const getLeader = useCallback((): Player | null => {
    if (!state.players.length) return null;
    const alive = state.players.filter((p) => p.health > 0);
    if (!alive.length) return null;
    return alive.reduce((best, p) => (p.stars > best.stars ? p : best), alive[0]);
  }, [state.players]);

  const getTokyoPlayer = useCallback((): Player | null => {
    return state.players.find((p) => p.inTokyo) ?? null;
  }, [state.players]);

  const buildSetupPlayers = useCallback((count: number): Player[] => {
    return buildInitialPlayers(count);
  }, []);

  return {
    state,
    startGame,
    newGame,
    continueGame,
    revivePlayer,
    smashTokyo,
    updatePlayer,
    adjustHealth,
    adjustStars,
    claimTokyo,
    leaveTokyo,
    getLeader,
    getTokyoPlayer,
    buildSetupPlayers,
  };
}
