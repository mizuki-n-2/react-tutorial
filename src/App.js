import { useState } from "react";

function Square({ value, onSquareClilck, isHighlight }) {
  const btnStyle = {
    backgroundColor: isHighlight ? "#ff0" : "#fff",
    cursor: "pointer",
  };

  return (
    <button className="square" onClick={onSquareClilck} style={btnStyle}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (isGameset(squares)) {
    status = "Draw...";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col;
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClilck={() => handleClick(i)}
                isHighlight={winner && winner.winLine.includes(i)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isReverse, setIsReverse] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleToggle() {
    setIsReverse(!isReverse);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    const isCurrentMove = move === currentMove;
    const coordinate =
      move === 0
        ? ""
        : calculateCurrentCoordinate(history[move - 1], squares);
    let description;
    if (isCurrentMove) {
      description = "You are at move #" + move + " " + coordinate;
    } else if (move > 0) {
      description = "Go to move #" + move + " " + coordinate;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {isCurrentMove ? (
          <div>{description}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{isReverse ? moves.reverse() : moves}</ol>
      </div>
      <div className="toggle-btn">
        <button onClick={handleToggle}>{isReverse ? "▼降順" : "▲昇順"}</button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winLine: lines[i] };
    }
  }
  return null;
}

function isGameset(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      return false;
    }
  }
  return true;
}

function calculateCurrentCoordinate(beforeSquares, currentSquares) {
  let currentSquareIndex;
  for (let i = 0; i < beforeSquares.length; i++) {
    if (beforeSquares[i] !== currentSquares[i]) {
      currentSquareIndex = i;
    }
  }
  if (currentSquareIndex === null) {
    return { row: "-", col: "-" };
  }

  const row = Math.floor(currentSquareIndex / 3);
  const col = currentSquareIndex - 3 * row;
  return "(" + (row + 1) + ", " + (col + 1) + ")";
}
