import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Button } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";

export class ConfirmModel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visibleModel,
    };
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
      loadingButton: false,
    });

    this.props.visible();
  };
  handleSubmit = (e) => {
    this.setState({
      visible: false,
      loadingButton: false,
    });
    if (this.props.actionData.action) {
      this.props.actionData.action();
    }

    this.props.visible();
  };
  showConfirm = () => {
    return (
      <Modal
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        visible={this.props.visibleModel}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        destroyOnClose={true}
        footer={
          this.props.okButton
            ? [
                <Button key="back" type="primary" onClick={this.handleCancel}>
                  Ok
                </Button>,
              ]
            : [
                <Button key="back" onClick={this.handleCancel}>
                  No
                </Button>,
                <Button key="submit" type="primary" onClick={this.handleSubmit}>
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
            {this.props.actionData.message}
          </h3>
        </div>
      </Modal>
    );
  };
  render() {
    return this.showConfirm();
  }
}

export default withRouter(ConfirmModel);
