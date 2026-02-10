import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/SignupPage";
import ChatPage from "./pages/chat/ChatPage";
import FriendsPage from "./pages/friends/FriendsPage";
import ChatHome from "./pages/chat/ChatHome";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat/:friendId" element={<ChatPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/chat" element={<ChatHome />} />

      </Routes>
    </BrowserRouter>
  );
}
