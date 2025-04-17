import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Search from "./pages/Search/Search";
import Tickets from "./pages/Tickets/Tickets";
import Profile from "./pages/Profile/Profile";
import BottomNav from "./components/BottomNav/BottomNav";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Booking from "./pages/Booking/Booking";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import SignUp from "./pages/SignUp/SignUp";
import Login from "./pages/Login/Login";
import TicketDetail from "./pages/TicketDetail/TicketDetail";
import PaymentCallback from "./components/PaymentCallback/PaymentCallback";
import Account from "./pages/Account/Account";
import About from "./pages/About/About";
import Setting from "./pages/Setting/Setting";
import { useDispatch } from "react-redux";
import { fetchUserFromToken, logoutUser } from "./redux/store/authSlice";
import { jwtDecode } from "jwt-decode";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { App as CapacitorApp } from '@capacitor/app';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  };

  const hideBottomNav = ["/movie/", "/booking/", "/tickets", "/signup", "/login", "/"].some(path =>
    location.pathname.includes(path)
  );

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    if (isMobileDevice()) {
      const currentPath = location.pathname;
  
      if (!token && currentPath !== "/signup" && currentPath !== "/login") {
        navigate("/login");
        window.location.reload();
      }
    } else {
      if (token) {
        try {
          dispatch(fetchUserFromToken());
        } catch (error) {
          console.error("Lỗi khi fetch user từ token:", error);
        }
      }
    }
  }, [dispatch, navigate, location.pathname]);
  

useEffect(() => {
  const handleDeepLink = (event) => {
    const url = event.url;
    if (url?.startsWith('myapp://')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const success = urlParams.get('success');
      const message = urlParams.get('message');
      const orderId = urlParams.get('orderId');
      const movieId = urlParams.get('movieId');
      navigate(`/tickets/ticket/${orderId}`);
    }
  };

  CapacitorApp.addListener('appUrlOpen', handleDeepLink);

}, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tickets/ticket/:orderId" element={<PrivateRoute><Tickets /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/booking/:movieId" element={<Booking />} />
        <Route path="/history" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
        <Route path="/history/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
        <Route path="/payment-callback" element={<PrivateRoute><PaymentCallback /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/setting" element={<Setting />} />
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
