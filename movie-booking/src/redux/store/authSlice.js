import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
            localStorage.removeItem("accessToken");
        },
        getUserFromToken(state) {
            const token = localStorage.getItem("accessToken");
            if (token) {
                const decoded = jwtDecode(token);
                state.user = decoded;
            }
        },
    },
});

export const { setUser, logoutUser, getUserFromToken  } = authSlice.actions;

export const fetchUserFromToken = () => (dispatch) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        try {
            const userData = jwtDecode(token);
            const userId = userData["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
            dispatch(setUser({ ...userData, userId }));
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
        }
    }
};



export default authSlice.reducer; 
