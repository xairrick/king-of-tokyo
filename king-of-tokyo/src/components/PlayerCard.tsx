import { useState, useEffect, useRef } from 'react';
import type { Player } from '../types/game';
import { MAX_HEALTH, MIN_HEALTH, MAX_STARS, MIN_STARS } from '../types/game';
import { getMonster } from '../constants/monsters';
import MonsterAvatar from './MonsterAvatar';
import CounterControl from './CounterControl';
import { useSounds } from '../hooks/useSounds';

interface PlayerCardProps {
  player: Player;
  onUpdatePlayer: (id: string, updates: Partial<Player>) => void;
  onAdjustHealth: (id: string, delta: number) => void;
  onAdjustStars: (id: string, delta: number) => void;
  onClaimTokyo: (id: string) => void;
  onLeaveTokyo: (id: string) => void;
  onRevive: (id: string) => void;
  tokyoOccupied: boolean;
}

export default function PlayerCard({
  player,
  onUpdatePlayer,
  onAdjustHealth,
  onAdjustStars,
  onClaimTokyo,
  onLeaveTokyo,
  onRevive,
  tokyoOccupied,
}: PlayerCardProps) {
  const [editingPlayerName, setEditingPlayerName] = useState(false);
  const [editingMonsterName, setEditingMonsterName] = useState(false);
  const [playerNameDraft, setPlayerNameDraft] = useState(player.playerName);
  const [monsterNameDraft, setMonsterNameDraft] = useState(player.monsterName);

  const { playClickUp, playClickDown, playDeath } = useSounds();
  const prevHealthRef = useRef(player.health);

  // Trigger death sound when health transitions to 0
  useEffect(() => {
    if (prevHealthRef.current > 0 && player.health === 0) {
      playDeath();
    }
    prevHealthRef.current = player.health;
  }, [player.health, playDeath]);

  const monster = getMonster(player.monsterId);
  const isDead = player.health === 0;

  const commitPlayerName = () => {
    const name = playerNameDraft.trim() || player.playerName;
    onUpdatePlayer(player.id, { playerName: name });
    setPlayerNameDraft(name);
    setEditingPlayerName(false);
  };

  const commitMonsterName = () => {
    const name = monsterNameDraft.trim() || player.monsterName;
    onUpdatePlayer(player.id, { monsterName: name });
    setMonsterNameDraft(name);
    setEditingMonsterName(false);
  };

  return (
    <div
      className={`
        relative rounded-2xl border-2 p-4 flex flex-col gap-4 transition-all duration-300
        ${isDead
          ? 'border-gray-600 bg-gray-900/80 opacity-70 grayscale'
          : `${monster.borderColor} bg-slate-900/80`
        }
        ${player.inTokyo ? 'ring-2 ring-yellow-400 shadow-lg shadow-yellow-400/20' : ''}
      `}
    >
      {/* Tokyo badge */}
      {player.inTokyo && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-extrabold px-3 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
          🏙️ In Tokyo
        </div>
      )}

      {/* Dead overlay */}
      {isDead && (
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-black/60 z-10 gap-3">
          <span className="text-6xl">💀</span>
          <button
            onClick={() => onRevive(player.id)}
            className="bg-green-600 hover:bg-green-500 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors active:scale-95 touch-manipulation shadow-lg"
          >
            🩹 Revive (5 HP)
          </button>
        </div>
      )}

      {/* Header: avatar + names */}
      <div className="flex items-center gap-3">
        <MonsterAvatar monsterId={player.monsterId} size="md" dead={isDead} />
        <div className="flex-1 min-w-0">
          {/* Player name */}
          {editingPlayerName ? (
            <input
              autoFocus
              type="text"
              value={playerNameDraft}
              onChange={(e) => setPlayerNameDraft(e.target.value)}
              onBlur={commitPlayerName}
              onKeyDown={(e) => e.key === 'Enter' && commitPlayerName()}
              className="w-full bg-white/10 text-white rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:ring-2 focus:ring-yellow-400 mb-1"
              maxLength={20}
            />
          ) : (
            <button
              onClick={() => { setPlayerNameDraft(player.playerName); setEditingPlayerName(true); }}
              className="text-white font-bold text-base hover:text-yellow-300 transition-colors text-left w-full truncate block mb-1"
              title="Click to edit player name"
            >
              {player.playerName}
            </button>
          )}

          {/* Monster name */}
          {editingMonsterName ? (
            <input
              autoFocus
              type="text"
              value={monsterNameDraft}
              onChange={(e) => setMonsterNameDraft(e.target.value)}
              onBlur={commitMonsterName}
              onKeyDown={(e) => e.key === 'Enter' && commitMonsterName()}
              className="w-full bg-white/10 rounded-lg px-2 py-0.5 text-xs outline-none focus:ring-2 focus:ring-yellow-400"
              style={{ color: 'inherit' }}
              maxLength={20}
            />
          ) : (
            <button
              onClick={() => { setMonsterNameDraft(player.monsterName); setEditingMonsterName(true); }}
              className={`text-sm font-medium hover:opacity-80 transition-opacity text-left w-full truncate block ${monster.textColor}`}
              title="Click to edit monster name"
            >
              {player.monsterName}
            </button>
          )}
        </div>
      </div>

      {/* Health counter */}
      <div className={`rounded-xl p-3 ${isDead ? 'bg-gray-800/50' : 'bg-red-950/60'}`}>
        <CounterControl
          value={player.health}
          min={MIN_HEALTH}
          max={MAX_HEALTH}
          onDecrement={() => onAdjustHealth(player.id, -1)}
          onIncrement={() => onAdjustHealth(player.id, 1)}
          label="❤️ Health"
          accentColor="text-red-300"
          disabled={isDead}
          onSound={playClickUp}
          onSoundDown={playClickDown}
        />
      </div>

      {/* Stars counter */}
      <div className="rounded-xl bg-yellow-950/60 p-3">
        <CounterControl
          value={player.stars}
          min={MIN_STARS}
          max={MAX_STARS}
          onDecrement={() => onAdjustStars(player.id, -1)}
          onIncrement={() => onAdjustStars(player.id, 1)}
          label="⭐ Stars"
          accentColor="text-yellow-300"
          disabled={isDead}
          onSound={playClickUp}
          onSoundDown={playClickDown}
        />
        {/* Star progress bar */}
        <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
            style={{ width: `${(player.stars / MAX_STARS) * 100}%` }}
          />
        </div>
      </div>

      {/* Tokyo buttons */}
      {!isDead && (
        <div className="flex gap-2">
          {player.inTokyo ? (
            <button
              onClick={() => onLeaveTokyo(player.id)}
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-xl text-sm transition-colors active:scale-95 touch-manipulation"
            >
              🚪 Leave Tokyo
            </button>
          ) : (
            <button
              onClick={() => onClaimTokyo(player.id)}
              disabled={tokyoOccupied}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-2 rounded-xl text-sm transition-colors active:scale-95 touch-manipulation"
            >
              🏙️ Enter Tokyo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
