import React from 'react';
import { useMatch } from '../context/MatchContext';

const ScoreCard = () => {
  const { matchData } = useMatch();

  if (!matchData) return <p>Loading...</p>;

  // Use Object.entries to handle plain objects
  const batsmen = Object.entries(matchData.stats?.batsman || {});
  const bowlers = Object.entries(matchData.stats?.bowler || {});

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Batsmen */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Batsmen</h2>
        <div className="space-y-1">
          {batsmen.map(([name, stats]) => (
            <p key={name}>
              {name} — {stats.runs} ({stats.balls})
            </p>
          ))}
        </div>
      </div>

      {/* Bowlers */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Bowlers</h2>
        <div className="space-y-1">
          {bowlers.map(([name, stats]) => {
            const overs = Math.floor(stats.ballsBowled / 6);
            const balls = stats.ballsBowled % 6;
            return (
              <p key={name}>
                {name} — {overs}.{balls}-0-{stats.runsConceded}-0
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
