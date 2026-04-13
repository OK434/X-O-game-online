import { useState } from "react";


export default function GameBoard({ onSelectA, board }) {

  // const [gameboard, setgameBoards] = useState(initialGameBoard);
  // function handelS(rowIndex, colIndex) {
  //   setgameBoards((prevGameBoard) => {
  //     const ub = [...prevGameBoard.map((iniArry) => [...iniArry])];
  //     ub[rowIndex][colIndex] = activePlayer;
  //     return ub;
  //   });
  //   onSelectA()
  // }
  return (
    <div className="
  grid grid-cols-3
  gap-4 sm:gap-6
">

      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onSelectA(rowIndex, colIndex)}
            className="
          w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28
          bg-[#aca788]
          text-[#3f3b00]
          text-4xl sm:text-5xl
          font-bold
          flex items-center justify-center
          rounded-md
          font-[Caprasimo]
          transition
          hover:bg-[#f8c031]
          active:scale-95
        "
          >
            {cell}
          </button>
        ))
      )}

    </div>
  );
}
