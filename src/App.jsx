import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Write from "./pages/Write";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
