import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Tickets from "./pages/Tickets/Tickets";
import Profile from "./pages/Profile/Profile";
import BottomNav from "./components/BottomNav";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Booking from "./pages/Booking/Booking";
import TicketsHistory from "./pages/TicketsHistory/TicketsHistory";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import TicketDetail from "./pages/TicketDetail/TicketDetail";
const AppContent = () => {
  const location = useLocation();
  const hideBottomNav = ["/movie/", "/booking/", "/tickets", "/signup", "/login", "/"].some(path => location.pathname.includes(path));
  return (

    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking/:movieId" element={<Booking />} />
        <Route path="/history" element={<TicketsHistory />} />
        <Route path="/ticket/:id" element={<TicketDetail />} />
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
