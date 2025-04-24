import React, { useEffect } from 'react';
import { useMatch } from '../context/MatchContext';

const Scoreboard = () => {
  const { matchData, refreshMatch } = useMatch();

  useEffect(() => {
    refreshMatch();
  }, []);

  if (!matchData) return <p>Loading match...</p>;

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between text-sm sm:text-base">
      <div>{matchData.teamA} vs {matchData.teamB}</div>
      <div>Total: {matchData.stats?.totalRuns}/{matchData.stats?.totalWickets}</div>
      <div>Overs: {matchData.events.length}</div>
      <div>Last Wicket: {matchData.events.find(e => e.isWicket)?.batsman || '-'}</div>
    </div>
  );
};

export default Scoreboard;
