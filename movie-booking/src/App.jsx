import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import MovieDetail from "./pages/MovieDetail";
import Booking from "./pages/Booking";
import TicketsHistory from "./pages/TicketsHistory";

const AppContent = () => {
  const location = useLocation();
  const hideBottomNav = ["/movie/", "/booking/", "/tickets"].some(path => location.pathname.includes(path));
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:movieId" element={<Booking />} />
        <Route path="/history" element={<TicketsHistory />} />
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
