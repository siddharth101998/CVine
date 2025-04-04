import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";  // Example page
import AuthForm from "./components/authform";
import ChatComponent from "./components/chat/ChatComponent";
import Bottle from "./components/bottle/bottle";
import Homepage from "./components/home/homepage";
import Dashboard from "./components/admin/dashboard";
import Recipe from "./components/recipe/recipe";
import { AuthProvider } from "./context/AuthContext";

// Layout component that includes the Navbar
const MainLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes without Navbar */}
                    <Route path="/" element={<AuthForm />} />
                    <Route path="/login_register" element={<AuthForm />} />

                    {/* Routes with Navbar via MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/chat" element={<ChatComponent />} />
                        <Route path="/bottle/:id" element={<Bottle />} />
                        <Route path="/homepage" element={<Homepage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/recipe" element={<Recipe />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
