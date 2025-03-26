import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";  // Example pages
import AuthForm from "./components/authform";
import ChatComponent from "./components/chat/ChatComponent";
import Bottle from "./components/bottle/bottle";
import Homepage from "./components/home/homepage";
import Dashboard from "./components/admin/dashboard";
import { AuthProvider } from "./context/AuthContext";
import Recipe from "./components/recipe/recipe";

function App() {
    return (
        <AuthProvider>
            <Router>  {/* Wrap everything inside BrowserRouter */}
                {/* <Navbar /> */}
                <Routes>
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/login_register" element={<AuthForm />} />
                    <Route path="/chat" element={<ChatComponent />} />
                    <Route path="/bottle/:id" element={<Bottle />} />
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/recipe" element={<Recipe />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
