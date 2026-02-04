import { Descriptions, Modal, Table, Typography } from "antd";
import React from "react";

const HistoryModal = ({ modalName, visible, onClose, historyData }) => {
  const { header, status, data, to } = historyData;

  console.log("historyData---------", historyData);

  const onCloseModal = () => {
    onClose();
  };

  const renderContent = () => {
    if (status === "updated" && data) {

      const columns = [
        {
          title: "Field",
          dataIndex: "field",
          key: "field",
          render: (text) => <div> {text} </div>,
        },
        {
          title: "Old Value",
          dataIndex: "oldValue",
          key: "oldValue",
          render: (text) => <div> {text} </div>,
        },
        {
          title: "New Value",
          dataIndex: "newValue",
          key: "newValue",
          render: (text) => <div> {text} </div>,
        },
      ];

      return (
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {status === "updated" && (
            <Typography.Title level={5}>
              {header}
            </Typography.Title>
          )}
          <Table dataSource={data} columns={columns} pagination={false} />
        </div>
      );
    } else if (status === "created") {
      return (
        <>
          <Descriptions
            title={header}
            bordered
            column={1} // Set the number of columns
          >
            <Descriptions.Item
              label={data[0]?.label}
              labelStyle={{ fontWeight: "bold" }}
            >
              {data[0]?.value}
            </Descriptions.Item>
            <Descriptions.Item
              label={data[1]?.label}
              labelStyle={{ fontWeight: "bold" }}
            >
              {data[1]?.value}
            </Descriptions.Item>
            {to?.transactionType && (
              <Descriptions.Item
                label="Transaction Type"
                labelStyle={{ fontWeight: "bold" }}
              >
                {to?.transactionType}
              </Descriptions.Item>
            )}
            {to?.password && (
              <Descriptions.Item
                label="Password"
                labelStyle={{ fontWeight: "bold" }}
              >
                {to?.password}
              </Descriptions.Item>
            )}
            {to?.transactionPassword && (
              <Descriptions.Item
                label="Transaction Password"
                labelStyle={{ fontWeight: "bold" }}
              >
                {to?.transactionPassword}
              </Descriptions.Item>
            )}
          </Descriptions>
        </>
      );
    } else if (status === "deleted") {
      return (
        <>
          <Descriptions title={header} />
        </>
      );
    }
    return null;
  };

  return (
    <>
      <Modal
        title={modalName}
        visible={visible}
        onCancel={onCloseModal}
        footer={null}
        width={"60%"}
      >
        {renderContent()}
      </Modal>
    </>
  );
};
export default HistoryModal;
