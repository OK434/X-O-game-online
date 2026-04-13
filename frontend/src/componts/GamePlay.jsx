import Player from "./player";
import GameBoard from "./GameBoard";
import Log from "./LOG.JSX";
import { useState, useEffect, useRef } from "react";
import GameOver from "./GameOver";
import { useNavigate } from "react-router-dom";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export default function GamePlay() {
  const [userIn, setUserIn] = useState(null);
  const [mySymbol, setMySymbol] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("X");
  const [gameTurn, setGameTurns] = useState([]);
  const [status, setStatus] = useState("connecting");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [winner, setWinner] = useState(null);
  const navigator = useNavigate();
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");

  // 🟢 fetch user
  useEffect(() => {
    if (!token) return;

    fetch(`/api/users/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setUserIn(data))
      .catch(console.error);
  }, [token]);

  // 🟢 WebSocket
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:1231");

    socketRef.current.onopen = () => {
      socketRef.current.send(JSON.stringify({
        type: "join",
        token: token,
      }));

      socketRef.current.send(JSON.stringify({
        type: "find_game",
      }));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "waiting") {
        setStatus("waiting");
      }

      if (data.type === "start") {
        setMySymbol(data.symbol);
        setCurrentTurn("X");
        setStatus("playing");
        setPlayer2Name(data.opponentName);

        // reset game
        setGameTurns([]);
        setWinner(null);
      }

      if (data.type === "move") {
        setGameTurns((prev) => [
          {
            square: data.square,
            player: data.player,
          },
          ...prev,
        ]);

        setCurrentTurn((prev) => (prev === "X" ? "O" : "X"));
      }

      if (data.type === "gameOver") {
        setWinner(data.winner);
        setTimeout(() => {
          socketRef.current?.close();
          navigator("/");
        }, 2000);

      }

      if (data.type === "opponentLeft") {
        setStatus("waiting");
        alert("Opponent left");
      }
    };

    return () => socketRef.current.close();
  }, [token]);

  const activePlayer = currentTurn;

  // 🟢 build board
  let gameboard = [...initialGameBoard.map((row) => [...row])];

  for (const turn of gameTurn) {
    const { square, player } = turn;
    const { row, col } = square;
    gameboard[row][col] = player;
  }

  // 🟢 click (server controls everything 🔥)
  function handlSelectPl(rowIndex, colIndex) {
    socketRef.current.send(
      JSON.stringify({
        type: "move",
        square: { row: rowIndex, col: colIndex },
      })
    );
  }
  function restartGame() {
    navigator("/");
  }

  return (
    <main className="
      min-h-screen w-full
      flex flex-col items-center
      p-4 sm:p-8
      text-[#ebe7ef]
    ">

      {/* 🟢 Container */}
      <div className="
        w-full max-w-3xl
        mt-6
        p-6 sm:p-8
        rounded-lg
        bg-gradient-to-b from-[#383624] to-[#282617]
        shadow-[0_0_20px_rgba(0,0,0,0.5)]
        relative
      ">

        {/* 🟢 Players */}
        <ol className="flex justify-center items-center gap-4 sm:gap-8 mb-4">

          {mySymbol === "X" ? (
            <>
              <Player
                name={userIn?.userName}
                symbol="X"
                isActive={activePlayer === "X"}
              />
              <Player
                name={player2Name}
                symbol="O"
                isActive={activePlayer === "O"}
              />
            </>
          ) : (
            <>
              <Player
                name={player2Name}
                symbol="X"
                isActive={activePlayer === "X"}
              />
              <Player
                name={userIn?.userName}
                symbol="O"
                isActive={activePlayer === "O"}
              />
            </>
          )}

        </ol>

        {/* 🎮 Turn */}
        {status === "playing" && !winner && (
          <p className="text-center text-yellow-300">
            {currentTurn === mySymbol ? "Your Turn 🎮" : "Opponent Turn ⏳"}
          </p>
        )}

        {/* ⏳ Waiting */}
        {status === "waiting" && (
          <div className="flex flex-col items-center mt-6 gap-3">
            <div className="
              w-10 h-10
              border-4 border-[#f6e35a]
              border-t-transparent
              rounded-full
              animate-spin
            "></div>
            <p>Waiting for opponent...</p>
          </div>
        )}


        {winner && <GameOver winner={winner}  />}

        {/* 🟢 Board */}
        <div className="flex justify-center mt-8">
          <GameBoard onSelectA={handlSelectPl} board={gameboard} />
        </div>

      </div>

      {/* 🟢 Log*/}
      <div className="w-full max-w-md mt-6 text-center text-[#3f3b00]">
        <Log turns={gameTurn} />
      </div>

    </main>
  );
}