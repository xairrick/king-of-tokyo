import { useState } from 'react';
import type { Player } from '../types/game';
import { MONSTERS } from '../constants/monsters';
import MonsterAvatar from './MonsterAvatar';

interface SetupScreenProps {
  onStart: (playerCount: number, players: Player[]) => void;
  buildSetupPlayers: (count: number) => Player[];
}

export default function SetupScreen({ onStart, buildSetupPlayers }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState<Player[]>(() => buildSetupPlayers(2));

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayers(buildSetupPlayers(count));
  };

  const updatePlayer = (index: number, updates: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  // Ensure no two players pick the same monster
  const usedMonsterIds = players.map((p) => p.monsterId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 drop-shadow-lg tracking-tight mb-2">
          👑 King of Tokyo
        </h1>
        <p className="text-gray-400 text-lg">Set up your game</p>
      </div>

      {/* Player count selector */}
      <div className="mb-8 text-center">
        <p className="text-white font-semibold mb-3 text-lg">Number of Players</p>
        <div className="flex gap-2 justify-center">
          {[2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleCountChange(n)}
              className={`w-12 h-12 rounded-full font-bold text-lg transition-all
                ${playerCount === n
                  ? 'bg-yellow-400 text-black scale-110 shadow-lg shadow-yellow-400/30'
                  : 'bg-white/10 text-white hover:bg-white/20'
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Player setup cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
        {players.map((player, index) => {
          const monster = MONSTERS.find((m) => m.id === player.monsterId)!;
          return (
            <div
              key={player.id}
              className={`rounded-2xl border-2 ${monster.borderColor} bg-white/5 p-4 flex flex-col gap-3`}
            >
              <div className="flex items-center gap-3">
                <MonsterAvatar monsterId={player.monsterId} size="sm" />
                <div className="flex-1">
                  <label className="text-xs text-gray-400 block mb-1">Player Name</label>
                  <input
                    type="text"
                    value={player.playerName}
                    onChange={(e) => updatePlayer(index, { playerName: e.target.value })}
                    className="w-full bg-white/10 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                    maxLength={20}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Choose Monster</label>
                <div className="grid grid-cols-5 gap-1">
                  {MONSTERS.map((m) => {
                    const takenByOther = usedMonsterIds.includes(m.id) && m.id !== player.monsterId;
                    return (
                      <button
                        key={m.id}
                        onClick={() => !takenByOther && updatePlayer(index, { monsterId: m.id, monsterName: m.name })}
                        disabled={takenByOther}
                        title={m.name}
                        className={`
                          w-full aspect-square rounded-lg text-2xl flex items-center justify-center border-2 transition-all
                          ${player.monsterId === m.id
                            ? `${m.bgColor} ${m.borderColor} scale-110`
                            : takenByOther
                              ? 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed'
                              : `bg-white/5 ${m.borderColor} hover:${m.bgColor}`
                          }
                        `}
                      >
                        {m.emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Monster Name</label>
                <input
                  type="text"
                  value={player.monsterName}
                  onChange={(e) => updatePlayer(index, { monsterName: e.target.value })}
                  className="w-full bg-white/10 text-white rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  maxLength={20}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onStart(playerCount, players)}
        className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-xl px-10 py-4 rounded-2xl shadow-lg shadow-yellow-400/30 transition-all active:scale-95 touch-manipulation"
      >
        ⚔️ Start Game
      </button>
    </div>
  );
}
