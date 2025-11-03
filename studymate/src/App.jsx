import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Login from './pages/Login';
import Signup from './pages/Register';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Write from './pages/Write';
import Profile from './pages/Profile';
import OtherProfile from './pages/OtherProfile';
import ChallengeDetail from './pages/ChallengeDetail';
import FollowerList from './pages/FollowerList';
import FollowingList from './pages/FollowingList';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/users/:id/followers" element={<FollowerList />} />
                <Route path="/users/:id/followings" element={<FollowingList />} />
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
                    path="/profile/:id"
                    element={
                        <RequireAuth>
                            <OtherProfile />
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
