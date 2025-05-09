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
import PublicRoute from "./components/PublicRoute/PublicRoute"; 
import { App as CapacitorApp } from '@capacitor/app';
import { getUserFromToken } from './redux/store/authSlice';
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMovies from "./pages/Dashboard/AddMovies";
import EditMovies from "./pages/Dashboard/EditMovies";
import NotFound from "./pages/NotFound/NotFound";
import EditProfile from "./pages/Dashboard/EditMovies";
import { AuthUser } from "./services/AuthUser";
import ConfirmEmail from "./components/ConfirmEmail/ConfirmEmail";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import AppHeader from "./components/Header/Header";
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isDashboard = location.pathname.startsWith("/dashboard");
  const hideBottomNav = ["/movie/", "/booking/", "/tickets", "/signup", "/login", "/"].some(path =>
    location.pathname.includes(path)
  );
useEffect(() => {
    const handleRoleRedirect = async () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                const userRole = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

                if ((userRole === "Admin" || userRole === "Staff") && location.pathname === "/") {
                    navigate("/dashboard"); 
                }
            } catch (err) {
                console.error("Lỗi khi giải mã token:", err);
            }
        }
    };

    handleRoleRedirect();
}, [navigate, location.pathname]);

  useEffect(() => {
    dispatch(getUserFromToken());
  }, []);
  
  useEffect(() => {
    const handleTokenRefresh = async () => {
      try {
        const { accessToken, refreshToken: newRefreshToken } = await AuthUser.refreshToken();
  
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);
  
          const decodedNew = jwtDecode(accessToken);
          const expTime = new Date(decodedNew.exp * 1000).toLocaleString();
  
          scheduleTokenRefresh(decodedNew.exp);
        }
      } catch (error) {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          AuthUser.logout(); 
          navigate("/"); 
        }
      }
    };

 
    const scheduleTokenRefresh = (expTime) => {
      const currentTimeMs = Date.now();
      const expTimeMs = expTime * 1000;
      const refreshBeforeMs = 60 * 1000; 
      const delay = expTimeMs - currentTimeMs - refreshBeforeMs;
  
      if (delay > 0) {
        setTimeout(() => {
          handleTokenRefresh();
        }, delay);
      } else {
        handleTokenRefresh();
      }
    };
  
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                scheduleTokenRefresh(decoded.exp);
            } catch (err) {
                handleTokenRefresh(); 
            }
        } else {
            handleTokenRefresh(); 
        }
    } else {
      const allowedPaths = ["/confirm-email", "/reset-password"];
      if (!allowedPaths.includes(location.pathname)) {
        AuthUser.logout();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/"); 
    }
    }
}, []);

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
    <div className={`relative ${!isDashboard ? "sm:pt-[0px] md:pt-[72px]" : ""}`}>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path="/movies/:movieId" element={<MovieDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/tickets/ticket/:orderId" element={<PrivateRoute allowedRoles={["User"]}><Tickets /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute allowedRoles={["User"]}><Profile /></PrivateRoute>} />
        <Route path="/booking/:movieId" element={<Booking />} />
        <Route path="/history" element={<PrivateRoute allowedRoles={["User"]}><OrderHistory /></PrivateRoute>} />
        <Route path="/history/:id" element={<PrivateRoute allowedRoles={["User"]}><TicketDetail /></PrivateRoute>} />
        <Route path="/payment-callback" element={<PrivateRoute allowedRoles={["User"]}><PaymentCallback /></PrivateRoute>} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/account" element={<PrivateRoute allowedRoles={["User"]}><Account /></PrivateRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<PrivateRoute allowedRoles={["Admin", "Staff"]}><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/add-movies" element={<PrivateRoute allowedRoles={["Admin" , "Staff"]}><AddMovies /></PrivateRoute>} />
        <Route path="/dashboard/edit-movies" element={<PrivateRoute allowedRoles={["Admin", "Staff"]}><EditMovies /></PrivateRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppHeader/>
      <AppContent/>
    </Router>
  );
};

export default App;
