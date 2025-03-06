import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";  // Example pages
import AuthForm from "./components/authform";

function App() {
    return (
        <Router>  {/* Wrap everything inside BrowserRouter */}
            <Navbar />
            <Routes>
                <Route path="/" element={<AuthForm />} />
                <Route path="/login_register" element={<AuthForm />} />

            </Routes>
        </Router>
    );
}

export default App;
