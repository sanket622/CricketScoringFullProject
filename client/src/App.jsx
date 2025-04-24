import { useMatch } from './context/MatchContext';
import CreateMatch from './components/CreateMatch';
import ScoreBoard from './components/ScoreBoard';
import ScoreCard from './components/ScoreCard';
import ExtrasPanel from './components/ExtrasPanel';
import DeliveryControls from './components/DeliveryControls';

function App() {
  const { matchId, setMatchId, refreshMatch } = useMatch();

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6 font-sans">
      {!matchId ? (
        <CreateMatch onCreated={setMatchId} />
      ) : (
        <>
          <button
            className="bg-yellow-400 px-4 py-2 rounded"
            onClick={refreshMatch}
          >
            🔄 Refresh Score
          </button>
          <ScoreBoard />
          <ScoreCard />
          <ExtrasPanel />
          <DeliveryControls />
        </>
      )}
    </div>
  );
}

export default App;
