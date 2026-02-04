import React from "react";
import { Card, Col, Row, Spin, Typography } from "antd";
import { useHistory } from "react-router-dom";
import { FileDoneOutlined } from "@ant-design/icons";

const CommonCardHeading = ({
  cardType,
  headBgColor,
  title,
  actionText,
  actionEvent,
  children,
  lodingWebsiteData,
  weeklyTotalDepositAmount,
  weeklyTotalWithdrawAmount,
}) => {
  const history = useHistory();
  const weeklyStartAndEndDate = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    let endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    localStorage.setItem("startDate", startOfWeek);
    localStorage.setItem("endDate", endOfToday);
  };

  const handleClickEvent = (actionEvent, value) => {
    localStorage.setItem("status", "success");
    localStorage.setItem("reqType", value);
    if (actionEvent === "websiteReport") {
      history.push("/website-report");
    }
    if (actionEvent === "depositReport") {
      if (value === "Deposit Analysis(Weekly)") {
        weeklyStartAndEndDate();
      }
      history.push("/deposit/report");
    }
    if (actionEvent === "withdrawReport") {
      if (value === "Withdraw Analysis(Weekly)") {
        weeklyStartAndEndDate();
      }
      history.push("/withdraw/report");
    }
    if (actionEvent === "pgReport") {
      history.push("/payment-gateway-report");
    }
  };
  return (
    <Card
      headStyle={{ backgroundColor: headBgColor }}
      title={
        cardType === "chartCard" ? (
          <Row>
            <Col span={12}>
              <Typography.Text strong style={{ color: "#ffff" }}>
                {title}
              </Typography.Text>
            </Col>
            <Col
              span={12}
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Typography.Text
                strong
                style={{ color: "#ffff", cursor: "pointer", fontSize: "13px" }}
                onClick={() => handleClickEvent(actionEvent, title)}
              >
                {actionText}
              </Typography.Text>
            </Col>
          </Row>
        ) : cardType === "analysisCard" ? (
          <Row justify="space-between" align="middle">
            <Col xs={24} sm={12} md={10}>
              <Typography.Text style={{ color: "#ffff" }} strong>
                {title}
              </Typography.Text>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Typography.Text style={{ color: "#ffff" }} strong>
                Total Amount :-{" "}
                {title === "Deposit Analysis(Weekly)"
                  ? weeklyTotalDepositAmount
                  : weeklyTotalWithdrawAmount}
              </Typography.Text>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={6}
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Typography.Text
                strong
                style={{ color: "#ffff", cursor: "pointer", fontSize: "13px" }}
                onClick={() => handleClickEvent(actionEvent, title)}
              >
                {actionText}
              </Typography.Text>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col span={2}>
              <FileDoneOutlined style={{ fontSize: "30px", color: "white" }} />
            </Col>
            <Col span={22}>
              <Typography.Text
                style={{ fontSize: "20px", color: "white" }}
                strong
              >
                {title}
              </Typography.Text>
            </Col>
          </Row>
        )
      }
    >
      {cardType === "chartCard" && lodingWebsiteData ? (
        <Spin
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: "300px",
          }}
        />
      ) : (
        children
      )}
    </Card>
  );
};

export default CommonCardHeading;
