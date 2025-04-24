import React, { useState } from 'react';
import { API } from '../api';
import { useMatch } from '../context/MatchContext';

const CreateMatch = ({ onCreated }) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [overs, setOvers] = useState(20);

  const { setMatchId, refreshMatch } = useMatch();

  const create = async () => {
    const res = await API.post('/create', { teamA, teamB, overs });
    alert('Match created');
    const id = res.data.match._id;
    setMatchId(id);
    refreshMatch();
    if (onCreated) onCreated(id);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h2 className="font-semibold text-lg mb-2">Create Match</h2>
      <input placeholder="Team A" value={teamA} onChange={(e) => setTeamA(e.target.value)} className="border p-1 m-1" />
      <input placeholder="Team B" value={teamB} onChange={(e) => setTeamB(e.target.value)} className="border p-1 m-1" />
      <input type="number" value={overs} onChange={(e) => setOvers(+e.target.value)} className="border p-1 m-1 w-20" />
      <button onClick={create} className="bg-green-500 text-white px-4 py-1 rounded">Create</button>
    </div>
  );
};

export default CreateMatch;
