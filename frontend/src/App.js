// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayerSetup from './components/PayerSetup/playerSetUp';
import GameBoard from './components/GameBoard/gameBoard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup/:player" element={<PlayerSetup />} />
        <Route path="/game" element={<GameBoard />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Turn-based Chess-like Game</h1>
      <p>Select your player and set up the game:</p>
      <a href="/setup/A">Play as Player A</a><br />
      <a href="/setup/B">Play as Player B</a>
    </div>
  );
};

export default App;
