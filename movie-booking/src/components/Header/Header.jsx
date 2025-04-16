import React, { useState } from "react";
import { Layout, Avatar, Dropdown, Modal } from "antd";
import { UserOutlined, InfoCircleOutlined, SettingOutlined, CaretDownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../../components/SearchBar/SearchBar";
import logoutIcon from "../../assets/icon/logout.png";
import avatarImg from "../../assets/images/avatar.png";
import ticketIcon from "../../assets/icon/ticket.svg";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import vnFlag from "../../assets/icon/vietnam.svg";
import enFlag from "../../assets/icon/eng.png";
const { Header } = Layout;

const AppHeader = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

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
    // navigate("/");
    navigate("/home", { replace: true });
    // window.location.reload();
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
      key: "settings",
      label: t("settings"),
      icon: <SettingOutlined className={iconClass} />,
    },
    {
      key: "about",
      label: t("about"),
      icon: <InfoCircleOutlined className={iconClass} />,
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
  const currentLang = i18n.language;
  const toggleLang = currentLang === "vi" ? "en" : "vi";
  const langAssets = {
    vi: {
      label: "VIE",
      icon: vnFlag,
    },
    en: {
      label: "ENG",
      icon: enFlag,
    },
  };
  return (
    <>
      <Header className="hidden md:flex items-center justify-between bg-[#1f1f1f] px-5 py-10">
        <div
          className="flex flex-cols justify-center items-center text-white font-bold text-xl cursor-pointer"
          onClick={() => navigate('/home')}
        >
          <img src={logo} alt="logo" className="w-full h-[50px] mr-2" />


        </div>

        <div className="w-1/2">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <Dropdown
            trigger={["hover"]} 
            menu={{
              items: [
                {
                  key: toggleLang,
                  label: (
                    <div className="flex items-center gap-2">
                      <img
                        src={langAssets[toggleLang].icon}
                        alt={toggleLang}
                        className="w-5 h-5"
                      />
                      {langAssets[toggleLang].label}
                    </div>
                  ),
                  onClick: () => i18n.changeLanguage(toggleLang),
                },
              ],
            }}
            placement="bottom"
            arrow
          >
            <div className="px-3 py-1 rounded-full bg-[#1f1f1f] text-white text-sm cursor-pointer flex items-center gap-2">
              <img
                src={langAssets[currentLang].icon}
                alt={currentLang}
                className="w-5 h-5"
              />
              <span>{langAssets[currentLang].label}</span>
              <CaretDownOutlined className="text-white text-sm" />
            </div>
          </Dropdown>


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
                {t("signUp")}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-[120px] h-[40px] flex items-center justify-center text-sm font-semibold bg-[#FF5524] text-white rounded-full hover:bg-[#e14a1f] transition-all duration-300"
              >
                {t("signIn")}
              </button>
            </div>
          )}
        </div>

      </Header>

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
