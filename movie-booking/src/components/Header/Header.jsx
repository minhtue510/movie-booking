import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Modal } from "antd";
import { UserOutlined} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../../components/SearchBar/SearchBar";
import logoutIcon from "../../assets/icon/logout.png";
import avatarImg from "../../assets/images/avatar.png";
import ticketIcon from "../../assets/icon/ticket.svg";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import ChangeLanguage from "../ChangeLanguage/ChangeLanguage";
const { Header } = Layout;

const AppHeader = () => {
  const [query, setQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isSignUpPage = location.pathname === "/signup";
  const isConfirmEmail = location.pathname === "/confirm-email";
  const isDashboard = location.pathname === "/dashboard";
  const isEditMovies= location.pathname === "/dashboard/edit-movies";
  const isAddMovies= location.pathname === "/dashboard/add-movies";

  
  const { t } = useTranslation();

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
    localStorage.removeItem("refreshToken");

    navigate("/");
    window.location.reload();
  };
  const iconClass = "w-4 h-4 mr-4";
  const loggedInItems = [
    {
      key: "profile",
      label: t("profile.title"),
      icon: <UserOutlined className={iconClass} />,
    },
    {
      key: "history",
      label: t("myTickets"),
      icon: <img src={ticketIcon} alt="ticket" className={iconClass} />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: <span className="text-[#FF5524]">{t('logout.label')}</span>,
      icon: <img src={logoutIcon} alt="logout" className={iconClass} />,
    },
  ];
 
  return (
    <>
    {!isDashboard && !isEditMovies && !isAddMovies &&(
      <Header className="hidden md:flex w-full z-50 flex items-center justify-between bg-[#1f1f1f] px-10 py-10 shadow-md h-[72px] fixed top ">
        <div
          className="flex flex-cols justify-center items-center text-white font-bold text-xl cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src={logo} alt="logo" className="w-full h-[50px] mr-2" />
        </div>

        {!isSignUpPage && !isLoginPage && !isConfirmEmail && !isDashboard && !isEditMovies && !isAddMovies &&(
          <div className="w-1/2 ">
            <SearchBar
              query={query}
              onSearchChange={(value) => {
                 setQuery(value);
                navigate(`/search?query=${value}`);
              }}
            />
          </div>
        )}


        <div className="flex items-center gap-4">
         <ChangeLanguage/>


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
                onClick={() => navigate("/signup")}
                className="w-[120px] h-[40px] flex items-center justify-center text-sm font-semibold text-white border border-white rounded-full hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
              >
                {t("signUp")}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-[120px] h-[40px] flex items-center justify-center text-sm font-semibold bg-[#FF5524] text-white rounded-full hover:bg-[#e14a1f] transition-all duration-300 cursor-pointer"
              >
                {t("signIn")}
              </button>
            </div>
          )}
        </div>

      </Header>
    )}
      <Modal
        title={t('logout.confirmTitle')}
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okText={t('logout.ok')}
        cancelText={t('logout.cancel')}
      >
        <p>{t('logout.confirmMessage')}</p>
      </Modal>
    </>
    
  );
};

export default AppHeader;
