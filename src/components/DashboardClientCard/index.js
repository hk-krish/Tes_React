// DepositWithdrawCard.jsx
import React from "react";
import { Card, Row, Col, Typography } from "antd";
import {
  numberFormatFlotValue,
  numberFormatValue,
} from "../../util/FormatNumberValue";

const DepositWithdrawCard = ({
  icon,
  title,
  depositCountKey,
  depositAmountKey,
  withdrawCountKey,
  withdrawAmountKey,
  entityDepositCount,
  entityWithdrawCount,
  onClick,
  //   numberFormat,
}) => {
  const handleDepositClick = () => {
    if (onClick) {
      onClick("deposit");
    }
  };

  const handleWithdrawClick = () => {
    if (onClick) {
      onClick("withdraw");
    }
  };

  return (
    <Card
      headStyle={{ backgroundColor: "rgb(4 74 143)" }}
      title={
        <Row gutter={[6, 6]} align={"middle"}>
          <Col md={2} lg={2} xl={3}>
            {icon}
          </Col>
          <Col md={8} lg={10} xl={11}>
            <Typography.Text
              style={{ fontSize: "20px", color: "white" }}
              strong
            >
              {title}
            </Typography.Text>
          </Col>
          <Col md={14} lg={12} xl={10} style={{ textAlign: "right" }}>
            <Typography.Text style={{ color: "white" }} strong>
              (D/W)
            </Typography.Text>
          </Col>
        </Row>
      }
    >
      <Row
        gutter={[6, 6]}
        onClick={handleDepositClick}
        style={{ cursor: "pointer" }}
      >
        <Col xs={10} sm={8} md={8} lg={8} xl={10}>
          <Typography.Text style={{ fontSize: "16px" }}>
            Total Deposit
          </Typography.Text>
        </Col>
        <Col xs={5} sm={8} md={8} lg={7} xl={6}>
          <Typography.Text style={{ fontSize: "16px" }}>
            ({depositCountKey ? numberFormatValue(depositCountKey) : "00"})
          </Typography.Text>
        </Col>
        <Col
          xs={9}
          sm={8}
          md={8}
          lg={9}
          xl={8}
          style={{ justifyContent: "end", display: "flex" }}
        >
          <Typography.Text style={{ fontSize: "16px" }}>
            {depositAmountKey ? numberFormatFlotValue(depositAmountKey) : "00"}
          </Typography.Text>
        </Col>
      </Row>
      <Row
        gutter={[6, 6]}
        onClick={handleWithdrawClick}
        style={{ cursor: "pointer" }}
      >
        <Col xs={10} sm={8} md={8} lg={8} xl={10}>
          <Typography.Text style={{ fontSize: "16px" }}>
            Total Withdraw
          </Typography.Text>
        </Col>
        <Col xs={5} sm={8} md={8} lg={7} xl={6}>
          <Typography.Text style={{ fontSize: "16px" }}>
            ({withdrawCountKey ? numberFormatValue(withdrawCountKey) : "00"})
          </Typography.Text>
        </Col>
        <Col
          xs={9}
          sm={8}
          md={8}
          lg={9}
          xl={8}
          style={{ justifyContent: "end", display: "flex" }}
        >
          <Typography.Text style={{ fontSize: "16px" }}>
            {withdrawAmountKey
              ? numberFormatFlotValue(withdrawAmountKey)
              : "00"}
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};

export default DepositWithdrawCard;
