import { Dropdown } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import vnFlag from "../../assets/icon/vietnam.svg";
import enFlag from "../../assets/icon/eng.png";
import { useTranslation } from "react-i18next";

const ChangeLanguage = () => {
    const { t, i18n } = useTranslation();
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
    )
};
export default ChangeLanguage;