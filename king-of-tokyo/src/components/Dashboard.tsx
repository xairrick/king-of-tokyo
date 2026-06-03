import type { Player } from '../types/game';
import { getMonster } from '../constants/monsters';
import MonsterAvatar from './MonsterAvatar';

interface DashboardProps {
  players: Player[];
  leader: Player | null;
  tokyoPlayer: Player | null;
  onNewGame: () => void;
  onSmash: () => void;
  compact: boolean;
  onToggleCompact: () => void;
}

export default function Dashboard({ players, leader, tokyoPlayer, onNewGame, onSmash, compact, onToggleCompact }: DashboardProps) {
  const alivePlayers = players.filter((p) => p.health > 0);

  return (
    <div className={`bg-slate-900/90 border-b border-white/10 ${compact ? 'p-2 sm:p-3 mb-3' : 'p-4 sm:p-6 mb-6'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Title row */}
        <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-4'} flex-wrap gap-2`}>
          <h1 className={`${compact ? 'text-lg' : 'text-2xl sm:text-3xl'} font-extrabold text-yellow-400 tracking-tight`}>
            👑 King of Tokyo
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCompact}
              title={compact ? 'Switch to full view' : 'Switch to compact view'}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors active:scale-95 touch-manipulation"
            >
              {compact ? '🖥️' : '📱'}
            </button>
            <button
              onClick={onNewGame}
              className={`bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors active:scale-95 touch-manipulation ${compact ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'}`}
            >
              🔄 {compact ? '' : 'New Game'}
            </button>
          </div>
        </div>

        {compact ? (
          /* ── Compact: single summary row ── */
          <div className="flex items-center gap-3 flex-wrap text-sm">
            {/* Leader */}
            <div className="flex items-center gap-1.5 bg-yellow-950/50 border border-yellow-500/30 rounded-xl px-3 py-1.5">
              <span className="text-yellow-500 font-bold text-xs uppercase tracking-wide">🏆</span>
              {leader ? (
                <>
                  <span className="text-base">{getMonster(leader.monsterId).emoji}</span>
                  <span className="text-white font-bold">{leader.playerName}</span>
                  <span className="text-yellow-300 font-semibold">⭐{leader.stars}</span>
                </>
              ) : (
                <span className="text-gray-500 text-xs">—</span>
              )}
            </div>

            {/* Tokyo */}
            <div className="flex items-center gap-1.5 bg-purple-950/50 border border-purple-500/30 rounded-xl px-3 py-1.5">
              <span className="text-purple-400 font-bold text-xs uppercase tracking-wide">🏙️</span>
              {tokyoPlayer ? (
                <>
                  <span className="text-base">{getMonster(tokyoPlayer.monsterId).emoji}</span>
                  <span className="text-white font-bold">{tokyoPlayer.playerName}</span>
                  <span className="text-red-300">❤️{tokyoPlayer.health}</span>
                </>
              ) : (
                <span className="text-gray-500 text-xs">Empty</span>
              )}
            </div>

            {/* Smash button — compact */}
            <button
              onClick={onSmash}
              disabled={!tokyoPlayer}
              title={tokyoPlayer ? `${tokyoPlayer.monsterName} smashes everyone outside Tokyo!` : 'No one in Tokyo'}
              className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-extrabold px-3 py-1.5 rounded-xl transition-colors active:scale-95 touch-manipulation text-sm shadow-lg shadow-red-700/30"
            >
              {tokyoPlayer ? getMonster(tokyoPlayer.monsterId).emoji : '🏙️'} SMASH!
            </button>
          </div>
        ) : (
          /* ── Full: two-panel grid ── */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-yellow-950/50 border border-yellow-500/30 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-2">
                  🏆 Current Leader
                </p>
                {leader ? (
                  <div className="flex items-center gap-3">
                    <MonsterAvatar monsterId={leader.monsterId} size="sm" />
                    <div>
                      <p className="text-white font-bold">{leader.playerName}</p>
                      <p className={`text-sm ${getMonster(leader.monsterId).textColor}`}>{leader.monsterName}</p>
                      <p className="text-yellow-300 text-sm font-semibold mt-0.5">⭐ {leader.stars} stars</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No players alive</p>
                )}
              </div>

              <div className="rounded-2xl bg-purple-950/50 border border-purple-500/30 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
                  🏙️ Tokyo City
                </p>
                {tokyoPlayer ? (
                  <div className="flex items-center gap-3">
                    <MonsterAvatar monsterId={tokyoPlayer.monsterId} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold">{tokyoPlayer.playerName}</p>
                      <p className={`text-sm ${getMonster(tokyoPlayer.monsterId).textColor}`}>{tokyoPlayer.monsterName}</p>
                      <p className="text-purple-300 text-sm font-semibold mt-0.5">❤️ {tokyoPlayer.health} HP · ⭐ {tokyoPlayer.stars}</p>
                    </div>
                    <button
                      onClick={onSmash}
                      title={`${tokyoPlayer.monsterName} smashes everyone outside Tokyo!`}
                      className="flex-shrink-0 bg-red-700 hover:bg-red-600 text-white font-extrabold px-3 py-2 rounded-xl transition-colors active:scale-95 touch-manipulation text-sm shadow-lg shadow-red-700/30"
                    >
                      {getMonster(tokyoPlayer.monsterId).emoji}<br />SMASH!
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 opacity-50 flex-1">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-400 flex items-center justify-center text-2xl">🏙️</div>
                      <p className="text-gray-400 text-sm">Tokyo is empty</p>
                    </div>
                    <button
                      disabled
                      className="flex-shrink-0 bg-red-700 opacity-30 cursor-not-allowed text-white font-extrabold px-3 py-2 rounded-xl text-sm"
                    >
                      🏙️<br />SMASH!
                    </button>
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
          </>
        )}
      </div>
    </div>
  );
}
