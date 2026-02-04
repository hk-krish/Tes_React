import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import UserProfile from "./UserProfile";
import "../Auth.css";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from "../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const SubMenu = Menu.SubMenu;

const SidebarContent = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { navStyle, themeType } = useSelector(({ settings }) => settings);
  const pathname = useSelector(({ common }) => common.pathname);
  const { user } = useSelector(({ auth }) => auth);
  const [selectedKeys, setSelectedKeys] = useState("");
  const [openKeys, setOpenKeys] = useState("");
  // const [commonPageVisible, setCommonPageVisible] = useState(false);
  let commonPageVisible;

  const getNoHeaderClass = (navStyle) => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return "gx-no-header-notifications";
    }
    return "";
  };

  useEffect(() => {
    const checkFirstChildTab = user?.tabmasterData?.filter(item => item.isActive)
    if (checkFirstChildTab && checkFirstChildTab.length > 0 && !checkFirstChildTab[0]?.tabUrl) {
      setOpenKeys(checkFirstChildTab[0]?._id)
    }
    setSelectedKeys(pathname?.slice(1));
  }, [pathname])

  return (
    <>
      <SidebarLogo
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div
        className="gx-sidebar-content side-bar-scroll"
        style={{ height: "90%", width: "105%" }}
      >
        <div
          className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}
        >
          <UserProfile />
        </div>
        <CustomScrollbars style={{ height: "80%", overflow: "auto" }}>
          <Menu
            openKeys={openKeys}
            onOpenChange={(e) => setOpenKeys(e)}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            {user?.userType === "admin" || user?.userType === "sub admin" ? user?.tabmasterData?.map(item =>
              item.isActive && (
                item.children && item.children.length > 0 ? (
                  <SubMenu
                    key={item._id}
                    title={
                      <Link to="#" onClick={(e) => e.preventDefault()}>
                        <span>
                          <i className="icon icon-user" />
                          <span>{item.displayName}</span>
                        </span>
                      </Link>
                    }
                  >
                    {item.children.map(item2 =>
                      item2.isActive &&
                      <Menu.Item key={item2._id} style={{ textTransform: "capitalize", width: "350px", marginLeft: "-20px" }}>
                        <Link to={item2.hasView ? "/" + item2.tabUrl : "/erropage"} style={selectedKeys === item2.tabUrl ? { color: "#fa8c15" } : { color: "inherit" }}>
                          <i className="icon icon-user" />
                          <span>{item2.displayName}</span>
                        </Link>
                      </Menu.Item>
                    )}
                  </SubMenu>
                ) :
                  <Menu.Item key={item._id} style={{ textTransform: "capitalize" }}>
                    <Link to={item.hasView ? "/" + item.tabUrl : "/erropage"} style={selectedKeys === item.tabUrl ? { color: "#fa8c15" } : { color: "inherit" }}>
                      <i className="icon icon-user" />
                      <span>{item.displayName}</span>
                    </Link>
                  </Menu.Item>
              )
            ) :
              <>
                <Menu.Item key="dashboard">
                  <Link to="/dashboard">
                    <i className="icon icon-user" />
                    <span>Dashboard</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="tabmaster">
                  <Link to="/tabmaster">
                    <i className="icon icon-user" />
                    <span>Tab Master</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="roles">
                  <Link to="/role">
                    <i className="icon icon-user" />
                    <span>Roles</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="agents">
                  <Link to="/agents">
                    <i className="icon icon-user" />
                    <span>Agents</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="user">
                  <Link to="/user">
                    <i className="icon icon-user" />
                    <span>Users</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="websites">
                  <Link to="/website">
                    <i className="icon icon-user" />
                    <span>Websites</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="vendor">
                  <Link to="/vendor">
                    <i className="icon icon-user" />
                    <span>Vendor</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="operator">
                  <Link to="/operator">
                    <i className="icon icon-user" />
                    <span>Operator</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="commonpage">
                  <Link to="/commonpage">
                    <i className="icon icon-user" />
                    <span>Common Page</span>
                  </Link>
                </Menu.Item>

                <Menu.Item key="deposit/queue">
                  <Link to="/deposit/queue">
                    <i className="icon icon-user" />
                    <span>Deposit Queue</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="deposit-auto-queue">
                  <Link to="/deposit-auto-queue">
                    <i className="icon icon-user" />
                    <span>Deposit Auto Queue</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="withdraw/queue">
                  <Link to="/withdraw/queue">
                    <i className="icon icon-user" />
                    <span>Withdraw Queue</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="withdraw-pending-report">
                  <Link to="/withdraw-pending-report">
                    <i className="icon icon-user" />
                    <span>Withdraw Pending Report</span>
                  </Link>
                </Menu.Item>

                <SubMenu
                  title={
                    <Link to="#" onClick={(e) => e.preventDefault()}>
                      <span>
                        <i className="icon icon-user" />
                        <span>Reports</span>
                      </span>
                    </Link>
                  }
                >
                  <Menu.Item key="deposit/report">
                    <Link to="/deposit/report">
                      <i className="icon icon-user" />
                      <span>Deposit Reports</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="withdraw/report">
                    <Link to="/withdraw/report">
                      <i className="icon icon-user" />
                      <span>Withdraw Reports</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="vendor/report">
                    <Link to="/vendor/report">
                      <i className="icon icon-user" />
                      <span>Vendor Reports</span>
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="website-report">
                    <Link to="/website-report">
                      <i className="icon icon-user" />
                      <span>Website Reports</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="commission">
                    <Link to="/commission-summary">
                      <i className="icon icon-user" />
                      <span>Commission Summary</span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="daily-commission-reports">
                    <Link to="/daily-commission-reports">
                      <i className="icon icon-user" />
                      <span>Daily Commission Reports</span>
                    </Link>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item key="payment-gateway">
                  <Link to="/payment-gateway">
                    <i className="icon icon-user" />
                    <span>Payment Gateway</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="transaction-list">
                  <Link to="/transaction-list">
                    <i className="icon icon-user" />
                    <span>Transaction List</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="coins-table">
                  <Link to="/coins">
                    <i className="icon icon-user" />
                    <span>Coins</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="settings">
                  <Link to="/settings">
                    <i className="icon icon-user" />
                    <span>Settings</span>
                  </Link>
                </Menu.Item>
              </>
            }
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

export default React.memo(SidebarContent);
