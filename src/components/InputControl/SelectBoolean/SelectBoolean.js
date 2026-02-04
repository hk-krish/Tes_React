import React, { PureComponent } from "react";
import { Form, Select } from "antd";

const { Option } = Select;

export default class SelectBoolean extends PureComponent {
  handleChange = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e);
      // console.log(e.target.value)
    }
  };

  render() {
    return (
      <Form.Item
        name={this.props.name}
        label={this.props.label}
        style={this.props.display ? "" : { display: "none" }}
        rules={[
          {
            required: this.props.required ? true : false,
            message: this.props.requiredMessage,
          },
        ]}
      >
        <Select
          placeholder={this.props.placeholder}
          initialValue={this.props.initialValue}
          showSearch={this.props.showSearch ? true : false}
          onSelect={(e) => this.handleChange(e)}
          onDeselect={(e) => this.handleChange(e)}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().startsWith(input.toLowerCase())
          }
        >
          <Option value={true} key={true}>
            Percentage off
          </Option>
          <Option value={false} key={false}>
            Amount off
          </Option>
        </Select>
      </Form.Item>
    );
  }
}
