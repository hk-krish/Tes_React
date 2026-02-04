import { Button, Card, Table, Typography } from "antd";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./transactionCountTable.css";

const TransactionCountTable = ({
  title,
  total,
  dataSource,
  columns,
  loadingData,
}) => {
  const history = useHistory();
  return (
    <Card className="card-overflow">
      <div className="card-text">
        <Typography.Text>Total: {total}</Typography.Text>
        <Typography.Title level={4} style={{ marginTop: "0" }}>
          {title}
        </Typography.Title>
        <Button
          type="link"
          onClick={() => history.push("/exchange-transactions")}
        >
          View More
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false} // Show only 5 records initially
        loading={loadingData}
        scroll={{ x: "max-content", y: 350 }} // Enable scrolling
      />
    </Card>
  );
};

export default TransactionCountTable;
