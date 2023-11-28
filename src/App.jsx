import { useState } from "react";
import "./App.css";
import Square from "./components/Square";
import confetti from "canvas-confetti";
import { TURNS, WINNER_COMBS } from "./constants";

const checkWinner = (boardToCheck) => {
  // se revisan todas las combinaciones ganadoras
  for (const combo of WINNER_COMBS) {
    const [a, b, c] = combo;
    if (
      boardToCheck[a] && //primero se examina si en la posicion a existe algo
      boardToCheck[a] === boardToCheck[b] &&
      boardToCheck[a] === boardToCheck[c]
    ) {
      return boardToCheck[a];
    }
  }
  return null;
};

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((Square) => Square != null);
  };

  const updateBoard = (index) => {
    //no actuliza la posición si ya tiene algo
    if (board[index] || winner) return;

    //actualizar el tablero
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    //cambia el turno del jugador
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    //guardar partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", newTurn);

    //revisar si existe ganador
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false); // empate
    }
  };
  return (
    <main className="board">
      <h1>Tree in line</h1>
      <button onClick={resetGame}>Reinicio del juego</button>
      <section className="game">
        {board.map((_, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {board[index]}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      {winner != null && (
        <section className="winner">
          <div className="text">
            <h2>{winner === false ? "Empate" : "ganador" + winner}</h2>
            <header className="win">
              {winner && <Square>{winner}</Square>}
            </header>

            <footer>
              <button onClick={resetGame}>Volver a jugar</button>
            </footer>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
