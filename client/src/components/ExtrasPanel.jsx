import React, { useState } from 'react';
import { API } from '../api';
import { useMatch } from '../context/MatchContext';

const options = ['wide', 'noball', 'bye', 'legbye', 'overthrow'];

const ExtrasPanel = () => {
  const [selected, setSelected] = useState([]);
  const [runs, setRuns] = useState(0);
  const [isWicket, setIsWicket] = useState(false);
  const [batsman, setBatsman] = useState('');
  const [bowler, setBowler] = useState('');
  const { matchId, refreshMatch } = useMatch();

  const toggle = (type) => {
    setSelected((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const sendEvent = async () => {
    if (!batsman || !bowler) {
      alert('Please enter both batsman and bowler names.');
      return;
    }

    const event = {
      type: selected.join('_') || 'normal',
      runs,
      extras: {
        wide: selected.includes('wide') ? runs : 0,
        noBall: selected.includes('noball') ? 1 : 0,
        bye: selected.includes('bye') ? runs : 0,
        legBye: selected.includes('legbye') ? runs : 0,
        overthrow: selected.includes('overthrow') ? runs : 0
      },
      batsman,
      bowler,
      isWicket
    };

    try {
      await API.post('/event', { matchId, event });
      alert('Delivery submitted');
      refreshMatch();
      // reset
      setSelected([]);
      setRuns(0);
      setIsWicket(false);
    } catch (err) {
      console.error(err);
      alert('Error adding event');
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-3">
      <h2 className="text-lg font-semibold mb-2">Extras</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`px-4 py-1 border rounded-full ${
              selected.includes(opt) ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => toggle(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <label>
          Batsman:
          <input
            type="text"
            className="border p-1 w-full"
            value={batsman}
            onChange={(e) => setBatsman(e.target.value)}
          />
        </label>
        <label>
          Bowler:
          <input
            type="text"
            className="border p-1 w-full"
            value={bowler}
            onChange={(e) => setBowler(e.target.value)}
          />
        </label>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <label>Runs:</label>
        <input
          type="number"
          min="0"
          className="border p-1 w-20"
          value={runs}
          onChange={(e) => setRuns(Number(e.target.value))}
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={isWicket}
            onChange={(e) => setIsWicket(e.target.checked)}
          />
          Wicket
        </label>
      </div>

      <button
        onClick={sendEvent}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default ExtrasPanel;
