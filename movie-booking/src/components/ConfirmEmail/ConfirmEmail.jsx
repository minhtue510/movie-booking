import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const message = queryParams.get("message");

    const handleRedirect = () => {
        if (status === "success") {
            navigate("/login", {
                state: {
                    emailVerificationStatus: status,
                    emailVerificationMessage: decodeURIComponent(message),
                },
            });
        } else {
            navigate("/signup", {
                state: {
                    emailVerificationStatus: status,
                    emailVerificationMessage: decodeURIComponent(message),
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
            <div className="text-center">
                {status === "success" ? (
                    <div>
                        <h1 className="text-3xl font-semibold text-green-500">{decodeURIComponent(message)}</h1>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-semibold text-red-500">{decodeURIComponent(message)}</h1>
                    </div>
                )}
                <button
                    onClick={handleRedirect}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-[#4D1C09] to-[#FFD980] rounded-xl text-lg font-semibold cursor-pointer"
                >
                    {status === "success" ? "Đăng nhập" : "Gửi lại"}
                </button>
            </div>
        </div>
    );
};

export default ConfirmEmail;