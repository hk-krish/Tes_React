import React, { PureComponent } from "react";
import { Form, Radio } from "antd";

export default class InputRadio extends PureComponent {
  handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    return (
      <Form.Item
        name={this.props.name}
        label={this.props.label}
        style={this.props.display ? { display: "none" } : ""}
        rules={[
          {
            required: this.props.required ? true : false,
            message: this.props.requiredMessage,
          },
        ]}
      >
        <Radio.Group
          onSelect={(e) => this.handleChange(e)}
          onDeselect={(e) => this.handleChange(e)}
          disabled={this.props.disabled}
        >
          <Radio value={true}>True</Radio>
          <Radio value={false}>False</Radio>
        </Radio.Group>
      </Form.Item>
    );
  }
}
