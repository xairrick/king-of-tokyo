import { useGameState } from './hooks/useGameState';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';
import PlayerCard from './components/PlayerCard';
import WinBanner from './components/WinBanner';

export default function App() {
  const {
    state,
    startGame,
    newGame,
    continueGame,
    revivePlayer,
    updatePlayer,
    adjustHealth,
    adjustStars,
    claimTokyo,
    leaveTokyo,
    getLeader,
    getTokyoPlayer,
    buildSetupPlayers,
  } = useGameState();

  const leader = getLeader();
  const tokyoPlayer = getTokyoPlayer();
  const tokyoOccupied = tokyoPlayer !== null;

  // Find winner player object for the banner
  const winner = state.winnerId
    ? state.players.find((p) => p.id === state.winnerId) ?? null
    : null;

  if (state.phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
        <SetupScreen onStart={startGame} buildSetupPlayers={buildSetupPlayers} />
      </div>
    );
  }

  // Calculate number of columns based on player count
  const gridCols =
    state.playerCount <= 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : state.playerCount === 3
      ? 'grid-cols-1 sm:grid-cols-3'
      : state.playerCount === 4
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <Dashboard
        players={state.players}
        leader={leader}
        tokyoPlayer={tokyoPlayer}
        onNewGame={newGame}
      />

      <main className={`grid ${gridCols} gap-4 px-4 sm:px-6 pb-8 max-w-7xl mx-auto`}>
        {state.players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            onUpdatePlayer={updatePlayer}
            onAdjustHealth={adjustHealth}
            onAdjustStars={adjustStars}
            onClaimTokyo={claimTokyo}
            onLeaveTokyo={leaveTokyo}
            onRevive={revivePlayer}
            tokyoOccupied={tokyoOccupied && !player.inTokyo}
          />
        ))}
      </main>

      {state.phase === 'won' && winner && (
        <WinBanner winner={winner} onPlayAgain={newGame} onContinue={continueGame} />
      )}
    </div>
  );
}
