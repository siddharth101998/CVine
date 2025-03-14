import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";  // Example pages
import AuthForm from "./components/authform";
import ChatComponent from "./components/chat/ChatComponent";
import Bottle from "./components/bottle/bottle";
import Homepage from "./components/home/homepage";
import Dashboard from "./components/admin/dashboard";

function App() {
    return (
        <Router>  {/* Wrap everything inside BrowserRouter */}
            {/* <Navbar /> */}
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/login_register" element={<AuthForm />} />
                <Route path="/chat" element={<ChatComponent />} />
                <Route path="/bottle/:id" element={<Bottle />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
