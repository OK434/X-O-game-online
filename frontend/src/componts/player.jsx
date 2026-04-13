import { useState } from "react";
export default function Player({ name, symbol, isActive }) {

  return (
    <>

      <li className={`
  flex items-center justify-center
  gap-2
  w-1/2
  p-2
  rounded-md
  border-2
  font-bold
  transition
  ${isActive
          ? "border-yellow-400 text-yellow-300 animate-pulse"
          : "border-transparent text-[#e1dec7]"
        }
`}>

        <span className="uppercase truncate">
          {name}
        </span>

        <span>
          {symbol}
        </span>

      </li>
    </>
  );
}
