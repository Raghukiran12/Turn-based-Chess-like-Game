// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let players = { A: null, B: null };
let currentPlayer = 'A';

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'SETUP') {
      const player = data.player;
      players[player] = data.pawns;

      if (players.A && players.B) {
        // Both players have submitted their pawn setup
        const sortedPawnsA = sortPawns(players.A);
        const sortedPawnsB = sortPawns(players.B);

        wss.clients.forEach((client) => {
          client.send(JSON.stringify({
            type: 'START_GAME',
            pawns: { 
              A: sortedPawnsA,
              B: sortedPawnsB
            },
            currentPlayer
          }));
        });
      } else {
        // Waiting for the other player
        ws.send(JSON.stringify({ type: 'WAITING_FOR_OPPONENT' }));
      }
    }
  });
});

function sortPawns(pawns) {
  return Object.entries(pawns)
    .sort(([, a], [, b]) => a - b)
    .map(([key, value]) => ({ type: key, value: parseInt(value) }));
}

app.use(express.static('public'));

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});