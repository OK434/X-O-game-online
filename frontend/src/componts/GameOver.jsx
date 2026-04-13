export default function GameOver({ winner }) {
  return (
    <div className="
      absolute inset-0
      flex flex-col items-center justify-center
      bg-[rgba(40,38,23,0.95)]
      text-center
    ">

      <h2 className="text-4xl text-yellow-300 mb-4">
        Game Over
      </h2>

      <p className="text-xl text-white mb-6">
        {winner === "draw"
          ? "It's a Draw 🤝"
          : `${winner} Wins 🎉`}
      </p>

    </div>
  );
}