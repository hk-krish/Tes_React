// ReportRow.js
import { Row, Col, Typography } from "antd";
import {
  numberFormatFlotValue,
  numberFormatValue,
} from "../../util/FormatNumberValue";

const ReportRow = ({ icon, title, count, amount, onClick, strong }) => {
  return (
    <Row gutter={[6, 6]} onClick={onClick} style={{ cursor: "pointer" }}>
      <Col xs={10} sm={9} md={8} lg={8} xl={10}>
        {icon}
        <Typography.Text strong={strong} style={{ fontSize: "16px" }}>
          {title}
        </Typography.Text>
      </Col>
      <Col xs={5} sm={7} md={8} lg={7} xl={6}>
        <Typography.Text strong={strong} style={{ fontSize: "16px" }}>
          ({count ? numberFormatValue(count) : "00"})
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
        <Typography.Text strong={strong} style={{ fontSize: "16px" }}>
          {amount ? numberFormatFlotValue(amount) : "00"}
        </Typography.Text>
      </Col>
    </Row>
  );
};
export default ReportRow;
