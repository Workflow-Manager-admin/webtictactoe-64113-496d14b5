import React, { useState } from "react";
import "./MainContainer.css";
import SnakeAndLadder from "./SnakeAndLadder";

/*
  PUBLIC_INTERFACE
  MainContainer: Main UI container for the WebTicTacToe game AND Snake & Ladder.
  Features:
    - Responsive header and game board
    - Light theme with specific colors
    - Game switcher for TicTacToe or SnakeAndLadder
    - Real-time update logic placeholder (move reflect instantly)
    - No authentication
*/

const BOARD_SIZE = 3;

// Utility to create an empty board
function getEmptyBoard() {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
}

/*
 * MainContainer now supports switching between Tic Tac Toe and Snake & Ladder.
 */
function MainContainer() {
  // Game selection state
  const [selectedGame, setSelectedGame] = useState("tictactoe"); // "tictactoe" | "snl"

  // Tic Tac Toe state (preserved when switching back)
  const [board, setBoard] = useState(getEmptyBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);

  // Game switcher UI
  function renderGameTabs() {
    return (
      <nav className="ttt-game-tabs" role="tablist" aria-label="Game Switcher">
        <button
          className={`ttt-tab-btn${selectedGame === "tictactoe" ? " ttt-tab-active" : ""}`}
          aria-selected={selectedGame === "tictactoe"}
          onClick={() => setSelectedGame("tictactoe")}
        >
          Tic Tac Toe
        </button>
        <button
          className={`ttt-tab-btn${selectedGame === "snl" ? " ttt-tab-active" : ""}`}
          aria-selected={selectedGame === "snl"}
          onClick={() => setSelectedGame("snl")}
        >
          Snake &amp; Ladder
        </button>
      </nav>
    );
  }

  // --- TTT game logic (untouched)
  function handleCellClick(row, col) {
    if (board[row][col] || winner) return;

    const boardCopy = board.map((rowArr) => rowArr.slice());
    boardCopy[row][col] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXIsNext((prev) => !prev);
  }

  function handleReset() {
    setBoard(getEmptyBoard());
    setXIsNext(true);
  }

  function renderCell(row, col) {
    return (
      <button
        className="ttt-cell"
        onClick={() => handleCellClick(row, col)}
        disabled={!!board[row][col] || !!winner}
        aria-label={`Cell ${row + 1}, ${col + 1}, ${
          board[row][col] ? board[row][col] : "empty"
        }`}
      >
        {board[row][col]}
      </button>
    );
  }

  function renderStatus() {
    if (winner === "draw") return "It's a draw!";
    if (winner) return `Winner: ${winner}`;
    return `Next move: ${xIsNext ? "X" : "O"}`;
  }

  function renderTicTacToeSection() {
    return (
      <section className="ttt-board-section">
        <h1 className="ttt-title" data-testid="ttt-title">
          Tic Tac Toe
        </h1>
        <div className="ttt-status" data-testid="ttt-status">
          {renderStatus()}
        </div>
        <div className="ttt-board">
          {board.map((rowArr, rowIdx) => (
            <div className="ttt-board-row" key={`row-${rowIdx}`}>
              {rowArr.map((_, colIdx) => (
                <React.Fragment key={`cell-${rowIdx}-${colIdx}`}>
                  {renderCell(rowIdx, colIdx)}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          data-testid="ttt-reset"
        >
          Reset Game
        </button>
        <div className="ttt-realtime-blurb" aria-label="real-time mock note">
          <span style={{ color: "var(--ttt-accent)" }}>Realtime: </span>
          Moves update instantly (real-time logic placeholder)
        </div>
      </section>
    );
  }

  return (
    <div className="ttt-app-container">
      <header className="ttt-header">
        <div className="ttt-header-logo">
          <span className="ttt-logo-symbol">⭕</span> WebTicTacToe
        </div>
        <div className="ttt-header-accent" />
      </header>
      <main className="ttt-main">
        {renderGameTabs()}
        {selectedGame === "tictactoe" ? renderTicTacToeSection() : (
          <section className="ttt-board-section" style={{ padding: 0, background: "unset", boxShadow: "unset" }}>
            <SnakeAndLadder />
          </section>
        )}
      </main>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * Calculate the winner of the tic-tac-toe board.
 * Returns "X", "O", "draw", or null.
 */
function calculateWinner(board) {
  // Check rows/cols/diag for winner
  for (let i = 0; i < BOARD_SIZE; i++) {
    // Rows
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    )
      return board[i][0];
    // Cols
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    )
      return board[0][i];
  }
  // Diagonals
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  )
    return board[0][0];
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  )
    return board[0][2];
  // Draw?
  if (board.flat().every((cell) => cell)) return "draw";
  return null;
}

export default MainContainer;
