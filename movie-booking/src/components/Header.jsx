import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Modal } from "antd";
import { UserOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "./SearchBar";
import logoutIcon from "../assets/icon/logout.png";
import avatarImg from "../assets/images/avatar.png";

const { Header } = Layout;

const AppHeader = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const username =
    user?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User";

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      setIsModalVisible(true);
    } else {
      navigate(`/${key}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/home");
    window.location.reload();
  };

  const loggedInItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "history",
      label: "My Tickets",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      key: "about",
      label: "About",
      icon: <InfoCircleOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: <span className="text-[#FF5524]">Logout</span>,
      icon: <img src={logoutIcon} alt="logout" className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <Header className="hidden md:flex items-center justify-between bg-[#1f1f1f] px-8">
        <div className="text-white font-bold text-xl">MovieBooking</div>

        <div className="w-1/2">
          <SearchBar />
        </div>

        {isLoggedIn ? (
          <Dropdown
            menu={{
              items: loggedInItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
            arrow
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-white font-medium">{username}</span>
              <Avatar src={avatarImg} />
            </div>
          </Dropdown>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/signUp")}
              className="w-[120px] h-[40px] flex items-center justify-center text-sm font-semibold text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-[120px] h-[40px] flex items-center justify-center text-sm font-semibold bg-[#FF5524] text-white rounded-full hover:bg-[#e14a1f] transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        )}
      </Header>

      <Modal
        title="Logout Confirmation"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
};

export default AppHeader;
