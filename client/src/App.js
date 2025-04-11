import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/navbar";
import AuthForm from "./components/authform";
import ChatComponent from "./components/chat/ChatComponent";
import Bottle from "./components/bottle/bottle";
import Homepage from "./components/home/homepage";
import Dashboard from "./components/admin/dashboard";
import Recipe from "./components/recipe/recipe";
import { AuthProvider } from "./context/AuthContext";
import UserProfile from "./components/user/userprofile";
import WineRecommendation from "./components/chat/recommendation";
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
                    <Route path="/login_register" element={<AuthForm />} />

                    {/* Routes with Navbar via MainLayout */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Homepage />} />  {/* Landing page */}
                        <Route path="/chat" element={<ChatComponent />} />
                        <Route path="/bottle/:id" element={<Bottle />} />
                        <Route path="/homepage" element={<Homepage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/recipe" element={<Recipe />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/recommend" element={<WineRecommendation />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
