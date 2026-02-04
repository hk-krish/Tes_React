import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  GlobalOutlined,
  TeamOutlined,
  ToTopOutlined,
  UserOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import {
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import Chart from "../../../components/Chart";
import CommonCardHeading from "../../../components/CommonCardHeading";
import DepositWithdrawCard from "../../../components/DashboardClientCard";
import UserDropdown from "../../../components/InputControl/UserDropdown/UserDropdown";
import ReportRow from "../../../components/ReportRow";
import DashboardService from "../../../service/DashboardService";
import WebsiteService from "../../../service/WebsiteService";
import {
  numberFormatFlotValue,
  numberFormatValue,
} from "../../../util/FormatNumberValue";
import momentT from "moment-timezone";
const isMediumScreen = window.innerWidth >= 768 && window.innerWidth < 1600;
const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

const Dashboard = () => {
  const history = useHistory();
  const [depositData, setDepositData] = useState(null);
  const [withdrawData, setWithdrawData] = useState(null);
  const [totalEntityCount, setTotalEntityCount] = useState(null);
  const [entityDepositCount, setEntityDepositCount] = useState(null);
  const [entityWithdrawCount, setEntityWithdrawCount] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [lodingWebsiteData, setLoadingWebsiteData] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectDate, setSelectDate] = useState(false);
  const [selectStartDate, setSelectStartDate] = useState(null);
  const [selectEndDate, setSelectEndDate] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [websiteDepositData, setWebsiteDepositData] = useState(null);
  const [websiteWithdrawData, setWebsiteWithdrawData] = useState(null);
  const [displayDateValue, setDisplayDateValue] = useState(null);
  const [weeklyDepositTransactionData, setWeeklyDepositTransactionData] =
    useState(null);
  const [weeklyWithdrawTransactionData, setWeeklyWithdrawTransactionData] =
    useState(null);
  const [pgTransactionData, setPgTransactionData] = useState(null);
  const [weeklyTotalDepositAmount, setWeeklyTotalDepositAmount] =
    useState(null);
  const [weeklyTotalWithdrawAmount, setWeeklyTotalWithdrawAmount] =
    useState(null);
  const [operatorData, setOperatorData] = useState(null);

  const reportFilter = [
    { name: "Today", value: "today" },
    { name: "Yesterday", value: "yesterday" },
    { name: "Weekly", value: "weekly" },
    { name: "Current Month", value: "current_month" },
    { name: "Last Month", value: "last_month" },
    { name: "Custom", value: "custom" },
  ];

  const cardData = [
    {
      icon: <UserOutlined style={{ fontSize: "25px", color: "white" }} />,
      title: "PSP",
      depositCountKey: `${entityDepositCount?.vendorDepositCount || 0}`,
      depositAmountKey: `${entityDepositCount?.vendorDepositAmount || 0}`,
      withdrawCountKey: `${entityWithdrawCount?.vendorWithdrawCount || 0}`,
      withdrawAmountKey: `${entityWithdrawCount?.vendorWithdrawAmount || 0}`,
    },
    {
      icon: <TeamOutlined style={{ fontSize: "25px", color: "white" }} />,
      title: "MERCHANT",
      depositCountKey: `${entityDepositCount?.agentDepositCount || 0}`,
      depositAmountKey: `${entityDepositCount?.agentDepositAmount || 0}`,
      withdrawCountKey: `${entityWithdrawCount?.agentWithdrawCount || 0}`,
      withdrawAmountKey: `${entityWithdrawCount?.agentWithdrawAmount || 0}`,
    },
    {
      icon: <GlobalOutlined style={{ fontSize: "25px", color: "white" }} />,
      title: "Website",
      depositCountKey: `${entityDepositCount?.websiteDepositCount || 0}`,
      depositAmountKey: `${entityDepositCount?.websiteDepositAmount || 0}`,
      withdrawCountKey: `${entityWithdrawCount?.websiteWithdrawCount || 0}`,
      withdrawAmountKey: `${entityWithdrawCount?.websiteWithdrawAmount || 0}`,
    },
    // Add entries for other cards...
  ];

  // DMW and USER Card
  const CustomCard = ({ title, value, onClick }) => (
    <Card
      style={{
        backgroundColor: title === "Total DMW" ? "green" : "red",
        cursor: title === "Total DMW" ? "pointer" : "auto",
      }}
      onClick={title === "Total DMW" ? onClick : null}
    >
      <Row gutter={[6, 6]}>
        <Col xs={12} sm={12} md={14} lg={14}>
          <Typography.Text style={{ fontSize: "20px", color: "white" }} strong>
            {title}
          </Typography.Text>
        </Col>
        <Col xs={12} sm={12} md={10} lg={10}>
          <Typography.Text
            style={{
              display: "flex",
              justifyContent: "end",
              fontSize: "16px",
              color: "white",
            }}
            strong
          >
            {title === "Total DMW" && value
              ? numberFormatFlotValue(value)
              : value
                ? numberFormatValue(value)
                : "00"}
            {/* {value ? numberFormatValue(value) : "00"} */}
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  );

  const totalDMW = useMemo(() => {
    return (
      depositData?.successDepositAmount - withdrawData?.successWithdrawAmount
    );
  });

  const fetchData = async () => {
    if (!startDate && !endDate && !selectStartDate && !selectEndDate) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      localStorage.setItem("startDate", startOfToday);
      localStorage.setItem("endDate", endOfToday);
    }
    let todayStartDate = new Date();
    todayStartDate.setHours(0, 0, 0, 0);
    let todayEndDate = new Date();
    todayEndDate.setHours(23, 59, 59, 999);
    setLoadingData(true);
    await DashboardService.getDashboard({
      timezone: timeZone,
      dateFilter: {
        start: momentT(startDate
          ? startDate
          : selectStartDate && dateValue
            ? selectStartDate
            : todayStartDate).tz(localStorage.getItem("timezone"), true),
        end: momentT(endDate
          ? endDate
          : selectEndDate && dateValue
            ? selectEndDate
            : todayEndDate).tz(localStorage.getItem("timezone"), true),
      },
    })
      .then((response) => {
        setDepositData(response.data?.sec1?.deposit);
        setWithdrawData(response.data?.sec1?.withdraw);
        setEntityDepositCount(response.data?.sec2?.allEntityDepositCount);
        setEntityWithdrawCount(response.data?.sec2?.allEntityWithdrawCount);
        setTotalEntityCount(response.data?.sec3?.entityCount);
        setOperatorData(response.data?.sec1?.operator);
        setWeeklyDepositTransactionData(
          response.data?.sec3?.weeklyPgData?.depositTransaction,
        );
        setWeeklyTotalDepositAmount(
          response.data?.sec3?.weeklyPgData?.totalDepositAmount,
        );
        setWeeklyTotalWithdrawAmount(
          response.data?.sec3?.weeklyPgData?.totalWithdrawAmount,
        );
        setWeeklyWithdrawTransactionData(
          response.data?.sec3?.weeklyPgData?.withdrawTransaction,
        );
        setPgTransactionData(response.data?.sec2?.pgData);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const websiteReport = async () => {
    if (!startDate && !endDate && !selectStartDate && !selectEndDate) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      localStorage.setItem("startDate", startOfToday);
      localStorage.setItem("endDate", endOfToday);
    }
    let todayStartDate = new Date();
    todayStartDate.setHours(0, 0, 0, 0);
    let todayEndDate = new Date();
    todayEndDate.setHours(23, 59, 59, 999);
    setLoadingWebsiteData(true);
    await WebsiteService.getWebsiteReport({
      page: 1,
      limit: 1000,
      dateFilter: {
        start: momentT(startDate
          ? startDate
          : selectStartDate && dateValue
            ? selectStartDate
            : todayStartDate).tz(localStorage.getItem("timezone"), true),
        end: momentT(endDate
          ? endDate
          : selectEndDate && dateValue
            ? selectEndDate
            : todayEndDate).tz(localStorage.getItem("timezone"), true),
      },
    })
      .then((response) => {
        // Limit the result to the first 5 records
        const limitedDataDeposit = response.data?.vendor_data?.slice(0, 5);
        let sortDataWithdraw = response.data?.vendor_data?.sort((a, b) => {
          const aAmount = a.transactions?.totalWithdrawAmount || 0;
          const bAmount = b.transactions?.totalWithdrawAmount || 0;
          return bAmount - aAmount;
        });
        const limitedDataWithdraw = sortDataWithdraw?.slice(0, 5);
        setWebsiteDepositData(limitedDataDeposit);
        setWebsiteWithdrawData(limitedDataWithdraw);
        setLoadingWebsiteData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingWebsiteData(false);
        message.error(err.message);
      });
  };
  const getSelectedDate = (selectedFilter) => {
    setSelectStartDate(null);
    setSelectEndDate(null);
    setDateValue(null);
    if (selectedFilter === "today") {
      setSelectDate(false);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      let endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      setStartDate(startOfToday);
      setEndDate(endOfToday);
      localStorage.setItem("startDate", startOfToday);
      localStorage.setItem("endDate", endOfToday);
      return;
    } else if (selectedFilter === "yesterday") {
      setSelectDate(false);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      let endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      setStartDate(yesterday);
      setEndDate(endOfYesterday);
      localStorage.setItem("startDate", yesterday);
      localStorage.setItem("endDate", endOfYesterday);
      return;
    } else if (selectedFilter === "weekly") {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      setSelectDate(false);
      setStartDate(startOfWeek);
      let endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      setEndDate(endOfToday);
      localStorage.setItem("startDate", startOfWeek);
      localStorage.setItem("endDate", endOfToday);
      return;
    } else if (selectedFilter === "current month") {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      let lastDayOfMonth = new Date();
      lastDayOfMonth.setHours(23, 59, 59, 999);
      setStartDate(firstDayOfMonth);
      setEndDate(lastDayOfMonth);
      localStorage.setItem("startDate", firstDayOfMonth);
      localStorage.setItem("endDate", lastDayOfMonth);
      setSelectDate(false);
      return;
    } else if (selectedFilter === "last month") {
      const today = new Date();
      const firstDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
        0,
        0,
        0,
      );
      const lastDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
        23,
        59,
        59,
      );
      setStartDate(firstDayOfLastMonth);
      setEndDate(lastDayOfLastMonth);
      localStorage.setItem("startDate", firstDayOfLastMonth);
      localStorage.setItem("endDate", lastDayOfLastMonth);
      setSelectDate(false);
      return;
    } else if (selectedFilter === "custom") {
      setSelectDate(true);
      return;
    }
  };

  const handleSelectStartDate = (date) => {
    localStorage.setItem("startDate", new Date(date));
    setDisplayDateValue(moment(date));
    setDateValue(null);
    setStartDate(null);
    setEndDate(null);
    setSelectStartDate(new Date(date));
  };

  const handleSelectEndDate = (date) => {
    localStorage.setItem("endDate", new Date(date));
    setDateValue(date);
    setSelectEndDate(new Date(date));
  };

  const disabledFutureDate = (current) => {
    // Get the current date
    const today = new Date();
    // Disable dates that are after the current date
    return current && current > today;
  };

  const onReportClick = (redirect, value) => {
    localStorage.setItem("status", value);
    if (redirect === "depositReport") {
      history.push("/deposit/report");
    }
    if (redirect === "depositQueue") {
      history.push("/deposit/queue");
    }
    if (redirect === "withdrawReport") {
      history.push("/withdraw/report");
    }
    if (redirect === "withdrawVerified") {
      history.push("/withdraw/queue");
    }
    if (redirect === "withdrawPending") {
      history.push("/withdraw-pending-report");
    }
    if (redirect === "viewMore" || redirect === "dmw") {
      history.push("/website-report");
    }
  };

  const handleCardClick = (data, type) => {
    const receiverType =
      data?.title === "PSP"
        ? "Vendor"
        : data?.title === "MERCHANT"
          ? "Agent"
          : data?.title;
    // Your onClick logic here
    localStorage.setItem("status", "success");
    localStorage.setItem("receiverType", receiverType);
    if (type === "deposit") {
      history.push("deposit/report");
      return;
    }
    if (type === "withdraw") {
      history.push("withdraw/report");
      return;
    }
  };

  useEffect(() => {
    fetchData();
    websiteReport();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
      websiteReport();
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if ((selectStartDate && selectEndDate) || dateValue) {
      fetchData();
      websiteReport();
    }
  }, [selectStartDate, selectEndDate]);

  return (
    <>
      <Typography.Title
        level={3}
        style={{ marginTop: "-20px", color: "#636363" }}
      >
        Dashboard
      </Typography.Title>
      <Row>
        <div
          direction="vertical"
          style={{
            cursor: "pointer",
            margin: "10px 25px 0px 32px",
          }}
        >
          <UserDropdown
            // initialValue={this.state.receiverType}
            placeholder={"Today"}
            // field={this.props.form}
            display={true}
            list={reportFilter}
            download
            onChange={(selectedValue) => {
              getSelectedDate(selectedValue.toLowerCase());
            }}
            width={200}
          />
        </div>

        {selectDate && (
          <>
            <Space direction="vertical">
              <Col style={{ marginTop: "10px" }}>
                <DatePicker
                  style={{ width: "180px" }}
                  showTime={{
                    format: "HH:mm:ss",
                    defaultValue: moment("00:00:00", "HH:mm:ss"),
                  }}
                  disabledDate={disabledFutureDate}
                  value={displayDateValue}
                  onChange={(date) => handleSelectStartDate(date)}
                  onSelect={(startDate) => handleSelectStartDate(startDate)}
                  format="DD-MM-YYYY HH:mm:ss A"
                  allowClear={false}
                />
                <Typography.Text strong style={{ margin: "0px 10px" }}>
                  to
                </Typography.Text>
                <DatePicker
                  style={{ width: "180px" }}
                  showTime={{ format: "HH:mm:ss" }}
                  disabled={!displayDateValue}
                  value={dateValue}
                  disabledDate={disabledFutureDate}
                  onChange={(date) => handleSelectEndDate(date)}
                  onSelect={(endDate) => handleSelectEndDate(endDate)}
                  format="DD-MM-YYYY HH:mm:ss A"
                  allowClear={false}
                />
              </Col>
            </Space>
          </>
        )}
      </Row>

      {loadingData ? (
        <Spin style={{ position: "fixed", top: "50%", left: "60%" }} />
      ) : (
        <>
          <Row gutter={[6, 6]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={9}>
              <CommonCardHeading
                cardType="depositCard"
                headBgColor="green"
                title="Deposit"
                iconType="fileDoneOutlined"
              >
                <ReportRow
                  icon={
                    <CheckCircleTwoTone
                      twoToneColor="#52c41a"
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Deposit Success"
                  count={depositData?.successDepositCount}
                  amount={depositData?.successDepositAmount}
                  onClick={() => onReportClick("depositReport", "success")}
                  strong={true}
                />
                <ReportRow
                  icon={
                    <WarningTwoTone
                      twoToneColor="#E4D00A"
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Deposit Pending"
                  count={depositData?.pendingDepositCount}
                  amount={depositData?.pendingDepositAmount}
                  onClick={() => onReportClick("depositQueue", "pending")}
                  strong={false}
                />
                <ReportRow
                  icon={
                    <ToTopOutlined
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Deposit Submitted"
                  count={depositData?.submittedDepositCount}
                  amount={depositData?.submittedDepositAmount}
                  onClick={() => onReportClick("depositQueue", "submitted")}
                  strong={false}
                />
                <ReportRow
                  icon={
                    <CloseCircleTwoTone
                      twoToneColor="#eb2f96"
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Deposit Decline"
                  count={depositData?.declineDepositCount}
                  amount={depositData?.declineDepositAmount}
                  onClick={() => onReportClick("depositReport", "decline")}
                  strong={false}
                />
              </CommonCardHeading>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={9}>
              <CommonCardHeading
                cardType="withdrawCard"
                headBgColor="red"
                title="Withdraw"
                iconType="fileDoneOutlined"
              >
                <ReportRow
                  icon={
                    <CheckCircleTwoTone
                      twoToneColor="#52c41a"
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Withdraw Success"
                  count={withdrawData?.successWithdrawCount}
                  amount={withdrawData?.successWithdrawAmount}
                  onClick={() => onReportClick("withdrawReport", "success")}
                  strong={true}
                />
                <ReportRow
                  icon={
                    <WarningTwoTone
                      twoToneColor="#E4D00A"
                      style={{ fontSize: "15px", padding: "5px" }}
                    />
                  }
                  title="Withdraw Pending"
                  count={withdrawData?.pendingWithdrawCount}
                  amount={withdrawData?.pendingWithdrawAmount}
                  onClick={() => onReportClick("withdrawPending", "pending")}
                  strong={false}
                />
                <ReportRow
                  icon={
                    <ToTopOutlined
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Withdraw Verified"
                  count={withdrawData?.verifiedWithdrawCount}
                  amount={withdrawData?.verifiedWithdrawAmount}
                  onClick={() => onReportClick("withdrawVerified", "verified")}
                  strong={false}
                />
                <ReportRow
                  icon={
                    <CloseCircleTwoTone
                      twoToneColor="#eb2f96"
                      style={{ fontSize: "16px", padding: "5px" }}
                    />
                  }
                  title="Withdraw Decline"
                  count={withdrawData?.declineWithdrawCount}
                  amount={withdrawData?.declineWithdrawAmount}
                  onClick={() => onReportClick("withdrawReport", "decline")}
                  strong={false}
                />
              </CommonCardHeading>
            </Col>
            {isMediumScreen ? (
              <Col sm={24} md={24} lg={24} xl={24} xxl={12}>
                <Row gutter={[6, 6]}>
                  <Col md={24} lg={12} xl={12}>
                    <CustomCard
                      title="Total DMW"
                      value={totalDMW ? totalDMW : "00"}
                      onClick={() => onReportClick("dmw")}
                    />
                  </Col>
                  <Col md={24} lg={12} xl={12}>
                    <CustomCard
                      title="Total User"
                      value={
                        totalEntityCount?.totalUser
                          ? totalEntityCount?.totalUser
                          : "00"
                      }
                    />
                  </Col>
                </Row>
              </Col>
            ) : (
              <Col xs={24} sm={24} md={24} lg={6}>
                <CustomCard
                  title="Total DMW"
                  value={totalDMW ? totalDMW : "00"}
                  onClick={() => onReportClick("dmw")}
                />
                <CustomCard
                  title="Total User"
                  value={
                    totalEntityCount?.totalUser
                      ? totalEntityCount?.totalUser
                      : "00"
                  }
                />
              </Col>
            )}

            {cardData.map((data, index) => (
              <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12} key={index}>
                <DepositWithdrawCard
                  {...data}
                  onClick={(type) => handleCardClick(data, type)}
                />
              </Col>
            ))}
          </Row>
          <Chart
            websiteDepositData={websiteDepositData}
            websiteWithdrawData={websiteWithdrawData}
            weeklyTotalDepositAmount={weeklyTotalDepositAmount}
            weeklyTotalWithdrawAmount={weeklyTotalWithdrawAmount}
            weeklyDepositTransactionData={weeklyDepositTransactionData}
            weeklyWithdrawTransactionData={weeklyWithdrawTransactionData}
            pgTransactionData={pgTransactionData}
            operatorData={operatorData}
            lodingWebsiteData={lodingWebsiteData}
          />
        </>
      )}
    </>
  );
};

export default Dashboard;
