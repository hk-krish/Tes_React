import React, { PureComponent } from "react";
import { Form, Switch } from "antd";
import "./InputSwitch.css";

class InputSwitch extends PureComponent {
  state = {
    isDefaultChecked: "",
    checked: false,
    initialValue: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.initialValue !== prevState.checked) {
      const newState = {
        ...prevState,
        checked: nextProps.initialValue,
      };
      return newState;
    } else return null;
  }

  componentDidMount() {
    this.setState({ checked: this.props.initialValue });
  }

  getCheckBoxColor() {
    if (this.props.color === "red") {
      return "cbxRedLabel";
    } else {
      return "cbxBlueLabel";
    }
  }

  handleChange = (e) => {
    // this.setState({ checked: e.target.checked });
    if (this.props.onChange) {
      // let data = this.props.data
      // data[this.props.name] = e
      this.props.onChange(this.props.name, e);
    }
  };

  render() {
    return (
      (this.props.initialValue === "true" ||
        this.props.initialValue === "false") && (
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
          <Switch
            defaultChecked={this.props.initialValue === "true" ? true : false}
            onChange={this.handleChange}
          />
        </Form.Item>
      )
    );
  }
}

export default InputSwitch;
