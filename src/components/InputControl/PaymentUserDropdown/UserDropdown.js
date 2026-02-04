import React, { PureComponent } from "react";
import { Form, Select } from "antd";

const { Option } = Select;

export default class UserDropdown extends PureComponent {
  constructor() {
    super();
    const allUserRecord = [
      {
        name: "All",
        id: "all_users",
      },
    ];
    this.state = {
      allUserRecord,
    };
  }

  handleChange = (value) => {
    const selectedData = this.state.options.find(
      (data) => data?.name === value,
    );
    if (this.props.onChange) {
      this.props.onChange(selectedData?.name, selectedData?._id);
    }
  };

  componentDidMount() {
    let options = [];
    options = this.state.allUserRecord.concat(this.props?.list);
    this.setState({ options: options });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list) {
      let options = [];
      options = this.state.allUserRecord.concat(this.props?.list);
      this.setState({ options: options });
    }
  }
  render() {
    return (
      <Form.Item style={{ ...this.props.formStyle, cursor: "pointer" }}>
        <Select
          name="userSelect"
          style={{ width: this.props?.width }}
          placeholder={this.props?.placeholder}
          value={this.props?.initialValue}
          showSearch={this.props?.showSearch ? true : false}
          onSelect={(value) => this.handleChange(value)}
          onDeselect={(value) => this.handleChange(value)}
        >
          {this.state.options &&
            this.state.options.map((data) => (
              <Option value={data?.name} key={data?.name}>
                {data?.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
    );
  }
}
