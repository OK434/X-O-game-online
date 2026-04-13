import { Routes, Route } from "react-router-dom";
import Home from "./componts/Home";
import Login from "./componts/login";
import CreateAccount from "./componts/CreateAccount";
import GamePlay from "./componts/GamePlay";
import Profile from "./componts/Profile";
import Scoreboard from "./componts/Scoreboard";
function App() {
   return (
    <Routes>
      <Route >
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<GamePlay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/SingIn" element={<CreateAccount />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Route>
    </Routes>
  );
}

export default App;
