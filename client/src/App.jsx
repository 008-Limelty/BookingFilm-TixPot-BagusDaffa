import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import Profile from './pages/Profile';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<div className="flex items-center justify-center min-h-screen bg-background text-white">404 - Not Found</div>} />
            </Routes>
        </Router>
    );
}

export default App;
