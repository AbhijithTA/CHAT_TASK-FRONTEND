import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useSelector } from "react-redux";
import Chat from "./pages/Chat";

function App() {
  const { user } = useSelector((state) => state.auth);
  return (
    <Routes>
      <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
