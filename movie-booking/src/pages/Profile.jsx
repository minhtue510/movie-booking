import React, { useState } from "react";
import { UserOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import logoutIcon from "../assets/icon/logout.png";
import avatar from "../assets/images/avatar.png";

const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => {
        setIsModalOpen(false);
        console.log("User logged out");
    };
    const handleCancel = () => setIsModalOpen(false);

    return (
        <div className="bg-black min-h-screen text-white pb-16 relative flex flex-col items-center">
            <h1 className="text-xl pt-10 pb-10">My Profile</h1>
            <div className="w-24 h-24 rounded-full overflow-hidden">
                <img src={avatar} alt="User Profile" className="w-full h-full object-cover" />
            </div>
            <p className="mt-8 text-lg">User Name</p>

            <div className="mt-8 w-full max-w-sm space-y-2">
                <MenuItem icon={<UserOutlined />} title="Account" subtitle={"Edit Profile\nChange Password"} />
                <MenuItem icon={<SettingOutlined />} title="Settings" subtitle={"Themes\nPermissions"} />
                <MenuItem icon={<InfoCircleOutlined />} title="About" subtitle={"About Movies\nMore"} />
                <MenuItemLogout icon={<img src={logoutIcon} alt="Logout" className="w-5 h-5" />} title="Logout" onClick={showModal} />
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#5A5959]/40 flex items-center justify-center" onClick={handleCancel}>
                    <div className="bg-black text-white rounded-lg w-[90%] max-w-[360px] text-center pt-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto">?</div>
                        <p className="mt-4 text-lg font-semibold">Are you sure you want to log out?</p>
                        <div className="w-full mt-6 border-t border-gray-500 flex">
                            <button onClick={handleCancel} className="flex-1 py-3 text-red-500 font-semibold border-r border-gray-500">Cancel</button>
                            <button onClick={handleOk} className="flex-1 py-3 text-orange-600 font-semibold">OK</button>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
};

const MenuItem = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-4 px-4 py-4 hover:bg-gray-800 cursor-pointer transition">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
            <p className="text-white font-semibold">{title}</p>
            <p className="text-gray-400 text-sm whitespace-pre-line leading-tight">{subtitle}</p>
        </div>
        <span className="text-white text-4xl self-center h-15">›</span>
    </div>
);

const MenuItemLogout = ({ icon, title, onClick }) => (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 cursor-pointer transition" onClick={onClick}>
        <div className="text-2xl">{icon}</div>
        <p className="text-orange-500 font-semibold flex-1">{title}</p>
        <span className="text-orange-500 text-4xl">
            ›
        </span>
    </div>
);

export default Profile;
