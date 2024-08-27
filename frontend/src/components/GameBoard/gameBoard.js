import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './gameBoard.css';

const GameBoard = () => {
  const [board, setBoard] = useState(Array(5).fill(null).map(() => Array(5).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('A');
  const [selectedPawn, setSelectedPawn] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { pawns } = location.state;
      initializeBoard(pawns);
    }
  }, [location.state]);

  const initializeBoard = (pawns) => {
    let newBoard = Array(5).fill(null).map(() => Array(5).fill(null));
    pawns.A.forEach((pawn, index) => {
      newBoard[0][index] = `A-${pawn.type}`;
    });
    pawns.B.forEach((pawn, index) => {
      newBoard[4][index] = `B-${pawn.type}`;
    });
    setBoard(newBoard);
  };

  const handlePawnClick = (row, col) => {
    const pawn = board[row][col];
    if (pawn && pawn.startsWith(currentPlayer)) {
      setSelectedPawn({ pawn, row, col });
    }
  };

  const getPossibleMoves = (pawn) => {
    const [player, type] = pawn.split('-');
    switch (type[0]) {
      case 'P':
        return ['L', 'R', 'F', 'B'];
      case 'H':
        if (type[1] === '1') {
          return ['L', 'R', 'F', 'B'];
        } else if (type[1] === '2') {
          return ['FL', 'FR', 'BL', 'BR'];
        }
        break;
      default:
        return [];
    }
  };

  const isValidMove = (fromRow, fromCol, toRow, toCol, moveType) => {
    if (toRow < 0 || toRow > 4 || toCol < 0 || toCol > 4) {
      return false;
    }

    const targetPawn = board[toRow][toCol];
    if (targetPawn && targetPawn.startsWith(currentPlayer)) {
      return false;
    }

    switch (moveType) {
      case 'L':
        return fromCol - toCol === 1 && fromRow === toRow;
      case 'R':
        return toCol - fromCol === 1 && fromRow === toRow;
      case 'F':
        return currentPlayer === 'A' ? toRow - fromRow === 1 && fromCol === toCol : fromRow - toRow === 1 && fromCol === toCol;
      case 'B':
        return currentPlayer === 'A' ? fromRow - toRow === 1 && fromCol === toCol : toRow - fromRow === 1 && fromCol === toCol;
      case 'FL':
        return (currentPlayer === 'A' ? toRow - fromRow === 1 : fromRow - toRow === 1) && fromCol - toCol === 1;
      case 'FR':
        return (currentPlayer === 'A' ? toRow - fromRow === 1 : fromRow - toRow === 1) && toCol - fromCol === 1;
      case 'BL':
        return (currentPlayer === 'A' ? fromRow - toRow === 1 : toRow - fromRow === 1) && fromCol - toCol === 1;
      case 'BR':
        return (currentPlayer === 'A' ? fromRow - toRow === 1 : toRow - fromRow === 1) && toCol - fromCol === 1;
      default:
        return false;
    }
  };

  const handleMove = (move) => {
    if (!selectedPawn) return;

    const { row: fromRow, col: fromCol, pawn } = selectedPawn;
    let toRow = fromRow;
    let toCol = fromCol;

    switch (move) {
      case 'L': toCol--; break;
      case 'R': toCol++; break;
      case 'F': currentPlayer === 'A' ? toRow++ : toRow--; break;
      case 'B': currentPlayer === 'A' ? toRow-- : toRow++; break;
      case 'FL': currentPlayer === 'A' ? toRow++ : toRow--; toCol--; break;
      case 'FR': currentPlayer === 'A' ? toRow++ : toRow--; toCol++; break;
      case 'BL': currentPlayer === 'A' ? toRow-- : toRow++; toCol--; break;
      case 'BR': currentPlayer === 'A' ? toRow-- : toRow++; toCol++; break;
    }

    if (isValidMove(fromRow, fromCol, toRow, toCol, move)) {
      const newBoard = [...board];
      newBoard[toRow][toCol] = pawn;
      newBoard[fromRow][fromCol] = null;
      setBoard(newBoard);
      setMoveHistory([...moveHistory, `${pawn}: ${move}`]);
      setSelectedPawn(null);
      setCurrentPlayer(currentPlayer === 'A' ? 'B' : 'A');
      checkWinCondition(newBoard);
    } else {
      setGameStatus(`Invalid move. Player ${currentPlayer}, please try again.`);
    }
  };

  const checkWinCondition = (currentBoard) => {
    const hasPlayerAPawns = currentBoard.some(row => row.some(cell => cell && cell.startsWith('A')));
    const hasPlayerBPawns = currentBoard.some(row => row.some(cell => cell && cell.startsWith('B')));

    if (!hasPlayerAPawns) {
      setGameStatus('Player B wins!');
    } else if (!hasPlayerBPawns) {
      setGameStatus('Player A wins!');
    }
  };

  return (
    <div className="game-board">
      <h1>Advanced Chess-like Game</h1>
      {gameStatus && <div className="game-status">{gameStatus}</div>}
      <div className="current-player">Current Player: {currentPlayer}</div>
      <div className="board" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 60px)' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell ? 'occupied' : ''} ${selectedPawn && selectedPawn.row === rowIndex && selectedPawn.col === colIndex ? 'selected' : ''}`}
              onClick={() => handlePawnClick(rowIndex, colIndex)}
              style={{ width: '60px', height: '60px', border: '1px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      {selectedPawn && (
        <div className="move-options">
          <div>Selected: {selectedPawn.pawn}</div>
          <div className="possible-moves">
            {getPossibleMoves(selectedPawn.pawn).map(move => (
              <button key={move} onClick={() => handleMove(move)}>{move}</button>
            ))}
          </div>
        </div>
      )}
      <div className="move-history">
        <h3>Move History</h3>
        <ul>
          {moveHistory.map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;