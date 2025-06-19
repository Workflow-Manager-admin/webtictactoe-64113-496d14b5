import React, { useState } from "react";
import "./SnakeAndLadder.css";

/**
 * SnakeAndLadder component for a basic 2-player game.
 * Features:
 *  - 10x10 grid (100 cells)
 *  - Predefined snakes and ladders
 *  - 2 players, alternate turns (rolls 1-6), first to reach 100 wins
 *  - Modern color theme, responsive design
 *  - Light, minimal, no backend
 */

// Snakes (from -> to) and Ladders (from -> to)
const snakes = {
  99: 7,
  92: 35,
  89: 53,
  74: 16,
  64: 60,
  62: 19,
  49: 11,
  46: 25,
  16: 6,
};
const ladders = {
  2: 38,
  7: 14,
  8: 31,
  15: 26,
  21: 82,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  78: 98,
  87: 94,
};


function getCellClass(idx) {
  // Alternate background for rows
  const row = Math.floor((idx - 1) / 10);
  return row % 2 === 0 ? "snl-cell snl-primary-row" : "snl-cell snl-secondary-row";
}

// PUBLIC_INTERFACE
function SnakeAndLadder() {
  // Player positions start at cell #1 (bottom-left)
  const [positions, setPositions] = useState([1, 1]);
  const [activePlayer, setActivePlayer] = useState(0); // 0 or 1
  const [dice, setDice] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  function rollDice() {
    if (gameOver) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);

    setTimeout(() => {
      movePlayer(roll);
    }, 500); // Small delay for UI effect
  }

  function movePlayer(roll) {
    const newPositions = [...positions];
    let currentPos = newPositions[activePlayer] + roll;
    if (currentPos > 100) currentPos = newPositions[activePlayer]; // Can't move past 100

    // Handle snakes or ladders
    if (snakes[currentPos]) {
      currentPos = snakes[currentPos];
    } else if (ladders[currentPos]) {
      currentPos = ladders[currentPos];
    }

    newPositions[activePlayer] = currentPos;
    setPositions(newPositions);

    if (currentPos === 100) {
      setGameOver(true);
    } else {
      setActivePlayer(p => 1 - p); // Switch player
    }
  }

  function renderCell(idx) {
    // idx: cell number (1-100)
    let content = null;
    // Show ladder
    if (ladders[idx]) {
      content = <span className="snl-ladder">🪜</span>;
    }
    // Show snake
    if (snakes[idx]) {
      content = <span className="snl-snake">🐍</span>;
    }
    // Show player(s)
    let playerSpan = null;
    if (positions[0] === idx && positions[1] === idx) {
      playerSpan = (
        <span className="snl-both-player">
          <span className="snl-player snl-player1">A</span>
          <span className="snl-player snl-player2">B</span>
        </span>
      );
    } else if (positions[0] === idx) {
      playerSpan = <span className="snl-player snl-player1" title="Player A">A</span>;
    } else if (positions[1] === idx) {
      playerSpan = <span className="snl-player snl-player2" title="Player B">B</span>;
    }
    return (
      <div className={getCellClass(idx)} key={idx} data-cell={idx}>
        <span className="snl-cell-number">{idx}</span>
        {content}
        {playerSpan}
      </div>
    );
  }

  function renderBoard() {
    // 10 rows of 10, numbers "snake" back and forth
    let cells = [];
    for (let row = 9; row >= 0; row--) {
      let rowCells = [];
      if (row % 2 === 0) {
        // left to right
        for (let col = 0; col < 10; col++) {
          let idx = row * 10 + col + 1;
          rowCells.push(renderCell(idx));
        }
      } else {
        // right to left
        for (let col = 9; col >= 0; col--) {
          let idx = row * 10 + col + 1;
          rowCells.push(renderCell(idx));
        }
      }
      cells.push(
        <div className="snl-board-row" key={`row-${row}`}>
          {rowCells}
        </div>
      );
    }
    return <div className="snl-board">{cells}</div>;
  }

  function getStatus() {
    if (gameOver) return `Player ${activePlayer === 0 ? "A" : "B"} wins!`;
    return `Player ${activePlayer === 0 ? "A" : "B"}'s turn${dice !== null ? ` (rolled ${dice})` : ""}`;
  }

  function handleReset() {
    setPositions([1, 1]);
    setActivePlayer(0);
    setGameOver(false);
    setDice(null);
  }

  return (
    <div className="snl-main">
      <h1 className="snl-title">Snake &amp; Ladder</h1>
      <div className="snl-status">{getStatus()}</div>
      {renderBoard()}
      <button
        className="snl-btn"
        onClick={rollDice}
        disabled={gameOver}
        data-testid="snl-roll"
        aria-label="roll dice"
      >
        {gameOver ? "Game Over" : "Roll Dice"}
      </button>
      <button className="snl-btn snl-reset-btn" onClick={handleReset} aria-label="reset game">
        Reset Game
      </button>
      <div className="snl-legend">
        <span><span className="snl-player snl-player1">A</span> = Player A</span>
        <span><span className="snl-player snl-player2">B</span> = Player B</span>
        <span><span className="snl-ladder">🪜</span> = Ladder</span>
        <span><span className="snl-snake">🐍</span> = Snake</span>
      </div>
    </div>
  );
}

export default SnakeAndLadder;
