import React, { createContext, useContext, useState } from 'react';
import { API } from '../api';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
  const [matchId, setMatchId] = useState(null);
  const [matchData, setMatchData] = useState(null);

  const refreshMatch = async () => {
    if (!matchId) return;
    const res = await API.get(`/${matchId}`);
    setMatchData(res.data);
  };

  return (
    <MatchContext.Provider value={{ matchId, setMatchId, matchData, refreshMatch }}>
      {children}
    </MatchContext.Provider>
  );
};
