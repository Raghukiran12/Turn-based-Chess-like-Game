// src/components/PayerSetup/playerSetUp.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const PlayerSetup = () => {
  const [pawns, setPawns] = useState({ P1: '', P2: '', P3: '', H1: '', H2: '' });
  const [isWaiting, setIsWaiting] = useState(false);
  const navigate = useNavigate();
  const { player } = useParams();
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:4000');
    
    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'WAITING_FOR_OPPONENT') {
        setIsWaiting(true);
      } else if (data.type === 'START_GAME') {
        navigate('/game', { state: { pawns: data.pawns, player, currentPlayer: data.currentPlayer } });
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => websocket.close();
  }, [navigate, player]);

  const handleSubmit = () => {
    if (ws && player) {
      ws.send(JSON.stringify({ type: 'SETUP', player, pawns }));
      setIsWaiting(true);
    } else {
      console.error('WebSocket not connected or player not selected');
    }
  };

  return (
    <div>
      <h1>Turn-based Chess-like Game</h1>
      <h2>Player {player}</h2>
      <div>
        {Object.keys(pawns).map((pawn) => (
          <div key={pawn}>
            <label>{pawn}</label>
            <input
              type="number"
              value={pawns[pawn]}
              onChange={(e) => setPawns({ ...pawns, [pawn]: e.target.value })}
            />
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
      {isWaiting && <p>Waiting for Opponent...</p>}
    </div>
  );
};

export default PlayerSetup;