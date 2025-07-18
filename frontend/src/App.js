import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { TubelightNavBar } from './components/ui/TubelightNavBar';
import Profile from './pages/Profile';

import ProfileStatus from './pages/ProfileStatus';
import Signup from './pages/Signup';
import AllStudents from './pages/AllStudents';
import AnimatedSquaresBackground from './components/AnimatedSquaresBackground';
import { SquaresDemo } from "./components/SquaresDemo";

function Landing() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#060606] pt-24 overflow-hidden">
      <SquaresDemo />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* <h1 className="text-6xl font-extrabold mb-6 text-white text-center tracking-tight drop-shadow-lg">
          Welcome to Student Portal
        </h1>
        <p className="text-2xl text-center max-w-2xl text-white/90 font-medium mb-2">
          Easily manage your profiles and pay fees online.<br />
          <span className="text-blue-400 font-bold">Fast, secure, and hassle free.</span>
        </p> */}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <TubelightNavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/students" element={<AllStudents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-status" element={<ProfileStatus />} />
        <Route path="/signup" element={<Signup />} />
        {/* Catch-all route LAST if you want a 404 page */}
        {/* <Route path="*" element={<div className="text-white">404 Not Found</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;