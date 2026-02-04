import React from "react";
import { withRouter } from "react-router-dom";
import { Modal, Button } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";

const LogoutModal = (props) => {
  return (
    <Modal
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      visible={props.visibleModel}
      onOk={props.handleSubmit}
      onCancel={props.handleCancel}
      destroyOnClose={true}
      footer={
        props.okButton
          ? [
              <Button key="back" type="primary" onClick={props.handleCancel}>
                Ok
              </Button>,
            ]
          : [
              <Button key="back" onClick={props.handleCancel}>
                No
              </Button>,
              <Button key="submit" type="primary" onClick={props.handleSubmit}>
                Yes
              </Button>,
            ]
      }
    >
      <div
        style={{
          width: "100%",
          alignSelf: "center",
          justifySelf: "center",
          borderRadius: "10px",
          flex: 1,
          marginTop: "25px",
          marginLeft: "45%",
        }}
      >
        <QuestionCircleTwoTone
          twoToneColor="#fa8c16"
          style={{ fontSize: "40px" }}
        />
      </div>
      <div style={{ marginTop: "25px", alignSelf: "center" }}>
        <h3 style={{ textAlign: "center" }}>
          {"Are you sure you want to log out?"}
        </h3>
      </div>
    </Modal>
  );
};
export default withRouter(LogoutModal);
