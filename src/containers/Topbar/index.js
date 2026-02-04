import { LockOutlined, LogoutOutlined, SettingTwoTone } from "@ant-design/icons";
import { Drawer, Layout, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SoundOff from "../../../src/assets/image/sound-off.png";
import SoundOn from "../../../src/assets/image/sound-on.png";
import { toggleCollapsedSideNav } from "../../appRedux/actions";
import { userSignOut } from "../../appRedux/actions/Auth";
import ChangePassword from "../../components/ChangePassword";
import LogOut from "../../components/LogOut";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../constants/ThemeSetting";
import tzData from "moment-timezone/data/meta/latest.json";

const { Header } = Layout;

const Topbar = (props) => {
  const dispatch = useDispatch();
  const { navStyle } = useSelector(({ settings }) => settings);
  const navCollapsed = useSelector(({ common }) => common.navCollapsed);
  //const { handleSound } = useSelector(({ sound }) => sound);

  const width = useSelector(({ common }) => common.width);
  const [visibleModal, setVisibleModal] = useState(false);
  const [confirmModel, setConfirmModel] = useState(false);
  const [soundOn, setSoundOn] = useState(localStorage.getItem("sound"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [countryTimezoneList, setCountryTimezoneList] = useState([]);

  const onLogOut = () => {
    setConfirmModel(false);
    localStorage.removeItem("user_id");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    localStorage.removeItem("user_token");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("status");
    localStorage.removeItem("sortBy");
    dispatch(userSignOut());
    window.location.reload();
  };

  // Example function to update sound state and localStorage
  const updateSound = (value, e) => {
    e.preventDefault();
    setSoundOn(!value);
    localStorage.setItem("sound", !value);
    if (props.onSoundUpdate) {
      props.onSoundUpdate(value);
    }
  };

  const onChangeTimeZone = (e) => {
    localStorage.setItem("timezone", e);
    window.location.reload();
  }

  const getAllCountryTimezone = async () => {
    let cList = [];
    Object.values(tzData.countries).forEach(item => {
      if (!cList.some(existingItem => existingItem.value === item.zones[0])) {
        cList.push({
          key: item.abbr,
          label: item.name,
          value: item.zones[0]
        });
      }
    });

    setCountryTimezoneList(cList);
  }

  useEffect(() => {
    if(!localStorage.getItem("timezone")) localStorage.setItem("timezone", "Asia/Kolkata");
    getAllCountryTimezone();
  }, []);

  return (
    <Header>
      {navStyle === NAV_STYLE_DRAWER ||
      ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) &&
        width < TAB_SIZE) ? (
        <div className="gx-linebar gx-mr-3">
          <i
            className="gx-icon-btn icon icon-menu"
            onClick={() => {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            }}
          />
        </div>
      ) : null}
      <Link to="/" className="gx-d-block gx-d-lg-none gx-pointer">
        <img alt="" src={"/assets/images/w-logo.png"} />
      </Link>
      <ul className="gx-header-notifications gx-ml-auto">
        <div style={{ display: "flex" }}>
          {countryTimezoneList && countryTimezoneList?.length > 0 && <Tooltip title={`Timezone (${countryTimezoneList?.find(item => item.value === localStorage.getItem("timezone")).label})`}>
            <SettingTwoTone style={{ fontSize: 25, margin: 10 }} onClick={() => setIsDrawerOpen(true)} />
          </Tooltip>}
          <a
            onClick={(e) => {
              updateSound(soundOn, e);
            }}
            style={{ margin: "10px" }}
          >
            {localStorage.getItem("sound") && soundOn.toString() === "true" ? (
              <Tooltip title="Sound On">
                <img src={SoundOn} alt="Sound Off" width={26} />
              </Tooltip>
            ) : (
              <Tooltip title="Sound Off">
                <img src={SoundOff} alt="Sound Off" width={26} />
              </Tooltip>
            )}
          </a>
          <a
            onClick={() => {
              setVisibleModal(true);
            }}
            style={{ margin: "10px" }}
          >
            <LockOutlined style={{ fontSize: "25px" }} />
          </a>
          <a
            onClick={() => {
              setConfirmModel(true);
            }}
            style={{ margin: "10px" }}
          >
            <LogoutOutlined style={{ fontSize: "25px" }} />
            {/* <p>Log Out</p> */}
          </a>
        </div>
      </ul>
      <LogOut
        visibleModel={confirmModel}
        handleSubmit={onLogOut}
        handleCancel={() => {
          setConfirmModel(false);
        }}
      />
      <ChangePassword
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
      />
      <Drawer title="Timezone" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} style={{ marginRight: "-5%" }} >
        <Select
          showSearch
          placeholder="Select Country"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          options={countryTimezoneList}
          defaultValue={localStorage.getItem("timezone")}
          onChange={onChangeTimeZone}
          style={{
            margin: 20,
            width: "60%"
          }}
        />
      </Drawer>
    </Header>
  );
};

export default Topbar;
