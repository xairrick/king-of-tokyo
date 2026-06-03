import type { Player } from '../types/game';
import { getMonster } from '../constants/monsters';
import MonsterAvatar from './MonsterAvatar';

interface DashboardProps {
  players: Player[];
  leader: Player | null;
  tokyoPlayer: Player | null;
  onNewGame: () => void;
}

export default function Dashboard({ players, leader, tokyoPlayer, onNewGame }: DashboardProps) {
  const alivePlayers = players.filter((p) => p.health > 0);

  return (
    <div className="bg-slate-900/90 border-b border-white/10 p-4 sm:p-6 mb-6">
      <div className="max-w-5xl mx-auto">
        {/* Title row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 tracking-tight">
            👑 King of Tokyo
          </h1>
          <button
            onClick={onNewGame}
            className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors active:scale-95 touch-manipulation"
          >
            🔄 New Game
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Leader panel */}
          <div className="rounded-2xl bg-yellow-950/50 border border-yellow-500/30 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-2">
              🏆 Current Leader
            </p>
            {leader ? (
              <div className="flex items-center gap-3">
                <MonsterAvatar monsterId={leader.monsterId} size="sm" />
                <div>
                  <p className="text-white font-bold">{leader.playerName}</p>
                  <p className={`text-sm ${getMonster(leader.monsterId).textColor}`}>
                    {leader.monsterName}
                  </p>
                  <p className="text-yellow-300 text-sm font-semibold mt-0.5">
                    ⭐ {leader.stars} stars
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No players alive</p>
            )}
          </div>

          {/* Tokyo panel */}
          <div className="rounded-2xl bg-purple-950/50 border border-purple-500/30 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              🏙️ Tokyo City
            </p>
            {tokyoPlayer ? (
              <div className="flex items-center gap-3">
                <MonsterAvatar monsterId={tokyoPlayer.monsterId} size="sm" />
                <div>
                  <p className="text-white font-bold">{tokyoPlayer.playerName}</p>
                  <p className={`text-sm ${getMonster(tokyoPlayer.monsterId).textColor}`}>
                    {tokyoPlayer.monsterName}
                  </p>
                  <p className="text-purple-300 text-sm font-semibold mt-0.5">
                    ❤️ {tokyoPlayer.health} HP · ⭐ {tokyoPlayer.stars}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center text-2xl">
                  🏙️
                </div>
                <p className="text-gray-400 text-sm">Tokyo is empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Player status bar */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {players.map((p) => {
            const m = getMonster(p.monsterId);
            const dead = p.health === 0;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium
                  ${dead ? 'border-gray-700 text-gray-500 opacity-50' : `${m.borderColor} ${m.textColor}`}
                  ${p.inTokyo ? 'bg-yellow-400/10' : 'bg-white/5'}
                `}
              >
                <span>{dead ? '💀' : m.emoji}</span>
                <span className="hidden sm:inline">{p.playerName}</span>
                <span className="text-yellow-300">⭐{p.stars}</span>
                {!dead && <span className="text-red-300">❤️{p.health}</span>}
              </div>
            );
          })}
          {alivePlayers.length === 0 && (
            <p className="text-gray-500 text-sm">All monsters have been defeated!</p>
          )}
        </div>
      </div>
    </div>
  );
}
