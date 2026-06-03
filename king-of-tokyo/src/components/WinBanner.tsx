import type { Player } from '../types/game';
import { getMonster } from '../constants/monsters';
import MonsterAvatar from './MonsterAvatar';

interface WinBannerProps {
  winner: Player;
  onPlayAgain: () => void;
  onContinue: () => void;
}

export default function WinBanner({ winner, onPlayAgain, onContinue }: WinBannerProps) {
  const monster = getMonster(winner.monsterId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`rounded-3xl border-2 ${monster.borderColor} ${monster.bgColor} p-8 sm:p-12 text-center max-w-sm w-full shadow-2xl`}>
        {/* Celebration emoji */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>

        <MonsterAvatar monsterId={winner.monsterId} size="lg" />

        <h2 className="text-3xl font-extrabold text-white mt-4 mb-1">
          {winner.playerName} Wins!
        </h2>
        <p className={`text-lg font-semibold ${monster.textColor} mb-2`}>
          {winner.monsterName}
        </p>
        <p className="text-yellow-300 text-xl font-bold mb-6">
          ⭐ {winner.stars} Stars — King of Tokyo!
        </p>

        <button
          onClick={onContinue}
          className="w-full bg-white/10 hover:bg-white/20 text-white font-bold text-base py-3 rounded-2xl transition-all active:scale-95 touch-manipulation mb-3 border border-white/20"
        >
          ▶️ Continue Game
        </button>

        <button
          onClick={onPlayAgain}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold text-lg py-4 rounded-2xl transition-all active:scale-95 touch-manipulation shadow-lg shadow-yellow-400/30"
        >
          🔄 Play Again
        </button>
      </div>
    </div>
  );
}
