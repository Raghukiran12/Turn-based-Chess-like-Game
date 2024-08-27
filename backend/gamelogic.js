import React, { useState, useEffect } from 'react';
import socket from '../socket';

const GameStatus = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    socket.on('updateStatus', (newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      socket.off('updateStatus');
    };
  }, []);

  return (
    <div className="game-status">
      <h2>Status: {status}</h2>
    </div>
  );
};

export default GameStatus;
