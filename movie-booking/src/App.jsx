import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";

const AppContent = () => {
  const location = useLocation();
  const hideBottomNav = ["/movie/", "/booking/"].some(path => location.pathname.includes(path));

  

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/user" element={<Profile />} />
        <Route path="/booking/:movieId" element={<Booking />} />
      </Routes>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
