import Home from "./pages/Home";
import ConnectFour from "./pages/ConnectFour";
import TicTacToe from "./pages/TicTacToe";
import DotsAndBoxes from "./pages/DotsAndBoxes";

import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connect-four" element={<ConnectFour />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/dotsandboxes" element={<DotsAndBoxes />} />
      </Routes>
    </Router>
  );
}

export default App;
