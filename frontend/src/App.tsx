import Home from "./pages/Home";
import ConnectFour from "./pages/ConnectFour";
import TicTacToe from "./pages/TicTacToe";
import DotsAndBoxes from "./pages/DotsAndBoxes";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Games from "./pages/Games";
import Navbar from "./components/Navbar";
import GameLobby from "./pages/GameLobby";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useUserData } from "./contexts/userDataContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const userData = useUserData();
  useEffect(() => {
    if (localStorage.getItem("idToken")) {
      console.log("Setting idToken from localStorage");
      userData.setUserData({ idToken: localStorage.getItem("idToken") });
    } else {
      userData.setUserData({ idToken: null });
    }
  }, []);
  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/connect-four/:gameId" element={<ConnectFour />} />
        <Route path="/tic-tac-toe" element={<TicTacToe />} />
        <Route path="/dotsandboxes" element={<DotsAndBoxes />} />
        <Route path="/account" element={<Account />} />
        <Route path="/games" element={<Games />} />
        <Route path="/game/:gameId" element={<GameLobby />} />
      </Routes>
    </Router>
  );
}

export default App;
