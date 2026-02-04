import { Layout } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import notify from "../../Notification";
import { disableButton, updateWindowWidth } from "../../appRedux/actions";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
} from "../../constants/ThemeSetting";
import App from "../../routes/index";
import { downloadOrUpdateExcel } from "../../util/CSVandExcelDownload";
import {
  generateFormattedData,
  generateWithdrawReportFormattedData,
} from "../../util/DownloadFormattedData";
import {
  handleSocketEvent,
  handleSocketEvent2,
  handleSocketEvent3,
} from "../../util/Socket/socketEventHandler";
import { footerText } from "../../util/config";
import AboveHeader from "../Topbar/AboveHeader/index";
import BelowHeader from "../Topbar/BelowHeader/index";
import HorizontalDark from "../Topbar/HorizontalDark/index";
import HorizontalDefault from "../Topbar/HorizontalDefault/index";
import InsideHeader from "../Topbar/InsideHeader/index";
import NoHeaderNotification from "../Topbar/NoHeaderNotification/index";
import Topbar from "../Topbar/index";
import AppSidebar from "./AppSidebar";
import { depositSound, socket } from "../../util/Socket/socketClient";

const { Content, Footer } = Layout;

const HorizontalDefaultMemoized = React.memo(HorizontalDefault);
const HorizontalDarkMemoized = React.memo(HorizontalDark);
const InsideHeaderMemoized = React.memo(InsideHeader);
const AboveHeaderMemoized = React.memo(AboveHeader);
const BelowHeaderMemoized = React.memo(BelowHeader);
const TopbarMemoized = React.memo(Topbar);
const NoHeaderNotificationMemoized = React.memo(NoHeaderNotification);

const getContainerClass = (navStyle) => {
  switch (navStyle) {
    case NAV_STYLE_DARK_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_DEFAULT_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_BELOW_HEADER:
      return "gx-container-wrap";
    case NAV_STYLE_ABOVE_HEADER:
      return "gx-container-wrap";
    default:
      return "";
  }
};

const getNavStyles = (navStyle, handleSoundUpdate) => {
  switch (navStyle) {
    case NAV_STYLE_DEFAULT_HORIZONTAL:
      return <HorizontalDefaultMemoized />;
    case NAV_STYLE_DARK_HORIZONTAL:
      return <HorizontalDarkMemoized />;
    case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
      return <InsideHeaderMemoized />;
    case NAV_STYLE_ABOVE_HEADER:
      return <AboveHeaderMemoized />;
    case NAV_STYLE_BELOW_HEADER:
      return <BelowHeaderMemoized />;
    case NAV_STYLE_FIXED:
      return <TopbarMemoized onSoundUpdate={handleSoundUpdate} />;
    case NAV_STYLE_DRAWER:
      return <TopbarMemoized onSoundUpdate={handleSoundUpdate} />;
    case NAV_STYLE_MINI_SIDEBAR:
      return <TopbarMemoized onSoundUpdate={handleSoundUpdate} />;
    case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
      return <NoHeaderNotificationMemoized />;
    case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
      return <NoHeaderNotificationMemoized />;
    default:
      return null;
  }
};

const MainApp = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { navStyle } = useSelector(({ settings }) => settings);
  const { user } = useSelector(({ auth }) => auth);
  let streamedData = [];
  let streamingEnded = false;

  const val = useRef({
    value: localStorage.getItem("sound"),
  });

  const handleSoundUpdate = (value) => {
    val.current = { ...val.current, value: !value };
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      dispatch(updateWindowWidth(window.innerWidth));
    });
  }, [dispatch]);

  const Button = ({ redirectUrl }) => {
    const handleClick = () => {
      // console.log("Button clicked");
      history.push(redirectUrl);
    };
    return <a onClick={handleClick}>Click Here</a>;
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("joinRoom", { userId: user?._id });
    });
    socket.emit("joinRoom", { userId: user?._id });

    handleSocketEvent(
      "newDepositRequest",
      true,
      (newData) => {
        if (newData) {
          if (val.current.value === true) {
            depositSound.play();
            console.log("Sound played");
          }
          const message = (
            <div>
              You have new deposit request of Rs{" "}
              <strong>
                {newData?.depositAccount?.isUniqueTransaction
                  ? newData?.receivedAmount
                  : newData?.amount}
              </strong>{" "}
              from <strong>{newData?.user?.endUserId} </strong>{" "}
              <Button redirectUrl="/deposit/queue" />
            </div>
          );
          return message;
        }
      },
      handleSoundUpdate,
    );

    handleSocketEvent(
      "newWithdrawRequest",
      true,
      (newData) => {
        if (newData) {
          if (val.current.value === true) {
            depositSound.play();
            console.log("Sound played");
          }
          const message = (
            <div>
              You have new{" "}
              {newData?.status === "verified"
                ? "Withdraw Verified Requestd"
                : "Withdraw Pending Requestd"}{" "}
              of Rs <strong>{newData?.amount}</strong> from{" "}
              <strong>{newData?.user?.endUserId}</strong>{" "}
              <Button
                redirectUrl={
                  newData?.status === "verified"
                    ? "/withdraw/queue"
                    : "/withdraw-pending-report"
                }
              />
            </div>
          );
          return message;
        }
      },
      handleSoundUpdate,
    );
    handleSocketEvent(
      "verifyDepositRequest",
      true,
      (newData) => {
        if (newData) {
          if (val.current.value === true) {
            depositSound.play();
          }
          const message = (
            <div>
              You have a request in deposit verification queue{" "}
              <span style={{ fontWeight: "bold" }}>
                {newData?.data?.[0]?.traId}{" "}
              </span>
              <Button redirectUrl={"/deposit-verification-queue"} />
            </div>
          );
          return message;
        }
      },
      handleSoundUpdate,
    );

    handleSocketEvent3(
      "commissionStatusChange",
      (newData) => {
        if (newData) {
          const message = (
            <div>
              {newData[1]?.status === "decline"
                ? "Settlement request declined "
                : newData[1]?.status === "completed"
                  ? "Settlement request approved "
                  : "New settlement request "}
              of Rs <strong>{newData[0]?.receiveAmount}</strong>
              {newData[0]?.status === "submitted" ? " from " : " by "}
              <strong>
                {newData[0]?.status === "submitted"
                  ? newData[0]?.fromData?.name
                  : newData[0]?.toData?.name}{" "}
              </strong>
              <Button redirectUrl="/commission-summary" />
            </div>
          );
          notify.openNotification(message);
          if (val.current.value === true) {
            depositSound.play();
          }
          return message;
        }
      },
      handleSoundUpdate,
    );

    handleSocketEvent2("streaming", (newData) => {
      console.log("download Starting...");
      if (newData?.streamingState?.statePage) {
        streamedData = [...streamedData, ...newData?.data?.transaction_data];
      }
    });

    handleSocketEvent2("stream-end", (newData) => {
      dispatch(disableButton(false));
      if (newData?.finish) {
        streamingEnded = true;
        let downloadFormet = localStorage.getItem("DownloadFormat");
        let reportType = localStorage.getItem("ReportType");
        if (downloadFormet === "Excel") {
          if (reportType === "depositReport") {
            downloadOrUpdateExcel(
              generateFormattedData(streamedData, "depositReport"),
              "Deposit Report",
            );
          } else if (reportType === "withdrawReport") {
            downloadOrUpdateExcel(
              generateWithdrawReportFormattedData(
                streamedData,
                "withdrawReport",
              ),
              "Withdraw Report",
            );
          }
          notify.successNotification(
            "Download complete",
            `Your ${
              reportType === "depositReport"
                ? "Deposit Report"
                : reportType === "withdrawReport"
                  ? "Withdraw Report"
                  : "-"
            } is download complete!`,
          );
          dispatch(disableButton(false));
          localStorage.removeItem("DownloadFormat");
          localStorage.removeItem("ReportType");
          streamedData = [];
        } else {
          if (reportType === "depositReport") {
            downloadOrUpdateExcel(
              generateFormattedData(streamedData, "depositReport"),
              "Deposit Report",
            );
          } else if (reportType === "withdrawReport") {
            downloadOrUpdateExcel(
              generateWithdrawReportFormattedData(
                streamedData,
                "withdrawReport",
              ),
              "Withdraw Report",
            );
          }
          localStorage.removeItem("DownloadFormat");
          localStorage.removeItem("ReportType");
          streamedData = [];
        }
      }
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Layout className="gx-app-layout">
      <AppSidebar navStyle={navStyle} />
      <Layout>
        {getNavStyles(navStyle, handleSoundUpdate)}
        <Content
          className={`gx-layout-content ${getContainerClass(navStyle)} `}
        >
          <App match={match} />
          {/* <Footer>
            <div className="gx-layout-footer-content">{footerText}</div>
          </Footer> */}
        </Content>
      </Layout>
      {/* <Customizer /> */}
    </Layout>
  );
};
export default MainApp;
