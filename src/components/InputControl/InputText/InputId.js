import React, { PureComponent } from "react";
import { Form, Input } from "antd";

class InputId extends PureComponent {
  render() {
    return (
      <Form.Item
        name={this.props.name}
        label={this.props.label}
        style={this.props.display ? "" : { display: "none" }}
        rules={[
          {
            required: false,
          },
        ]}
        initialValue={this.props.value}
      >
        <Input initialvalue={this.props.value} />
      </Form.Item>
    );
  }
}

export default InputId;
