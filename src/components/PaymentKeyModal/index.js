import { Button, Modal, Typography } from "antd";
import React from "react";

const PaymentKeyModal = (props) => {
  const { visible, onClose, modalName, data, from } = props;
  const handelOpenAccount = () => {
    if (props?.setOpenAccount) {
      props?.setOpenAccount("");
    }
  };
  return (
    <>
      <Modal
        title={modalName}
        visible={visible}
        footer={[
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              onClose();
              handelOpenAccount();
            }}
          >
            OK
          </Button>,
        ]}
        onCancel={() => {
          onClose();
          handelOpenAccount();
        }}
      >
        {data?.map((item, index) => (
          <div key={index}>
            <Typography.Text>{item}</Typography.Text>
          </div>
        ))}
      </Modal>
    </>
  );
};
export default PaymentKeyModal;
