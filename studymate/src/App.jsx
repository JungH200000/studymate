import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Write from "./pages/Write";
import Profile from "./pages/Profile";
import ChallengeDetail from "./pages/ChallengeDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/write"
          element={
            <RequireAuth>
              <Write />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/challenge/:id"
          element={
            <RequireAuth>
              <ChallengeDetail />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
