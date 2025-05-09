import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        const userRole = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (allowedRoles.includes(userRole)) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    } catch (err) {
        console.error("Lỗi khi giải mã token:", err);
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;