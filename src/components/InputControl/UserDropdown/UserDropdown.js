import { Form, Select } from "antd";
import React, { PureComponent } from "react";

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
    let selectedData;
    if (this.props.multipleNameShow) {
      // if data in same name available then data filter with _id
      selectedData = this.state.options.find((data) => data?._id === value);
    } else {
      selectedData = this.state.options.find((data) => data?.name === value);
    }
    if (this.props.onChange) {
      this.props.onChange(
        selectedData?.name,
        selectedData?._id,
        selectedData?.value,
      );
    }
  };

  componentDidMount() {
    if (this.props?.type === "status") {
      let options = [
        { name: "All", id: "" },
        { name: "success", value: "success" },
        { name: "decline", value: "decline" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "exchangeRequestTypeFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "UPI", value: "upi" },
        { name: "BANK", value: "bank" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "exchangeFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "In Process", value: "In Process" },
        { name: "Verify", value: "Verify" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "commissionActionFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "Pending", value: "Pending" },
        { name: "Submitted", value: "Submitted" },
        { name: "Completed", value: "Completed" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "commissionStatusFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "Submitted", value: "Submitted" },
        { name: "Completed", value: "Completed" },
        { name: "Decline", value: "Decline" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "commissionTransactionTypeFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "settlement", value: "settlement" },
        { name: "commission", value: "commission" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "userList") {
      let options = [
        { name: "All", id: "" },
        { name: "Vendor", value: "vendor" },
        { name: "Agent", value: "agnet" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "historyModuleFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "Vendor", value: "vendor" },
        { name: "Agent", value: "agnet" },
        { name: "Website", value: "website" },
        { name: "BankAccount", value: "BankAccount" },
        { name: "Operator", value: "Operator" },
        { name: "Setting", value: "Setting" },
        { name: "Coin", value: "Coin" },
        { name: "PG", value: "PG" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "historyStatus") {
      let options = [
        { name: "All", id: "" },
        { name: "Created", value: "Created" },
        { name: "Updated", value: "Updated" },
        { name: "Deleted", value: "Deleted" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "commissionReceiverTypeFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "TES", value: "TES" },
        { name: "Vendor", value: "Vendor" },
        { name: "Website", value: "Website" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "commissionSenderTypeFilter") {
      let options = [
        { name: "All", id: "" },
        { name: "TES", value: "TES" },
        { name: "PG", value: "PG" },
        { name: "Vendor", value: "Vendor" },
        { name: "Website", value: "Website" },
      ];
      this.setState({ options: options });
    } else if (this.props?.type === "transaction-status") {
      let options = [
        { name: "All", id: "" },
        { name: "Success", value: "success" },
        { name: "Decline", value: "decline" },
        { name: "Pending", value: "pending" },
        { name: "Submitted", value: "submitted" },
      ];
      this.setState({ options: options });
    } else if (
      this.props.type === "requestTypeFilter" ||
      this.props.type === "reqType"
    ) {
      let options = [
        { name: "All", id: "" },
        { name: "UPI", value: "upi" },
        { name: "BANK", value: "bank" },
        { name: "CRYPTO", value: "crypto" },
        { name: "DIGITAL RUPEE", value: "digital rupee" },
        { name: "EWALLET", value: "ewallet" },
      ];
      this.setState({ options: options });
    } else if (this.props.type === "vendor") {
      let options = [{ name: "All", id: "" }];
      this.setState({ options: options });
    } else if (this.props.type === "agent") {
      let options = [{ name: "All", id: "" }];
      this.setState({ options: options });
    } else if (this.props.type === "receiver") {
      let options = [
        { name: "All", value: "" },
        { name: "Vendor", value: "vendor" },
        { name: "Agent", value: "agent" },
        { name: "Website", value: "website" },
        { name: "User", value: "user" },
      ];
      this.setState({ options: options });
    } else if (this?.props?.type === "orderType") {
      let options = [];
      if (this.props.download) {
        options = [
          { name: "Website", value: "website" },
          { name: "Link", value: "link" },
        ];
      } else {
        options = [
          { name: "All", value: "all" },
          { name: "Website", value: "website" },
          { name: "Link", value: "link" },
        ];
      }
      this.setState({ options: options });
    } else if (this.props.type === "bankProcessFilter") {
      let options = [];
      if (this.props.reportList) {
        options = [
          { name: "All", value: "all" },
          { name: "Auto", value: "auto" },
          { name: "Manual", value: "manual" },
          { name: "Auto to Manual", value: "autoToManual" },
        ];
      } else {
        options = [
          { name: "All", value: "all" },
          { name: "Manual", value: "manual" },
          { name: "Auto to Manual", value: "autoToManual" },
        ];
      }
      this.setState({ options: options });
    } else {
      let options = [];
      options = this.props.download
        ? this.props.list
        : this.state.allUserRecord.concat(this.props?.list);
      this.setState({ options: options });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list !== this.props.list) {
      if (this.props?.type === "status") {
        let options = [
          { name: "All", id: "" },
          { name: "Success", value: "success" },
          { name: "Decline", value: "decline" },
        ];
        this.setState({ options: options });
      } else if (this.props?.type === "commissionStatusFilter") {
        let options = [
          { name: "All", id: "" },
          { name: "completed", value: "completed" },
          { name: "pending", value: "pending" },
        ];
        this.setState({ options: options });
      } else if (this.props?.type === "commissionTransactionTypeFilter") {
        let options = [
          { name: "All", id: "" },
          { name: "settlement", value: "settlement" },
          { name: "commission", value: "commission" },
        ];
        this.setState({ options: options });
      } else if (this.props?.type === "commissionReceiverTypeFilter") {
        let options = [
          { name: "All", id: "" },
          { name: "TES", value: "TES" },
          { name: "Vendor", value: "Vendor" },
          { name: "Website", value: "Website" },
        ];
        this.setState({ options: options });
      } else if (this.props?.type === "commissionSenderTypeFilter") {
        let options = [
          { name: "All", id: "" },
          { name: "TES", value: "TES" },
          { name: "PG", value: "PG" },
          { name: "Vendor", value: "Vendor" },
          { name: "Website", value: "Website" },
        ];
        this.setState({ options: options });
      } else if (this.props?.type === "transaction-status") {
        let options = [
          { name: "All", id: "" },
          { name: "Success", value: "success" },
          { name: "Decline", value: "decline" },
          { name: "Pending", value: "pending" },
          { name: "Submitted", value: "submitted" },
        ];
        this.setState({ options: options });
      } else if (this.props.type === "reqType") {
        let options = [
          { name: "All", id: "" },
          { name: "UPI", value: "upi" },
          { name: "BANK", value: "bank" },
        ];
        this.setState({ options: options });
      } else if (this.props.type === "receiver") {
        let options = [
          { name: "All", value: "" },
          { name: "Vendor", value: "vendor" },
          { name: "Agent", value: "agent" },
          { name: "User", value: "user" },
        ];
        this.setState({ options: options });
      } else {
        let options = [];
        options = this.props.download
          ? this.props.list
          : this.state.allUserRecord.concat(this.props?.list);
        this.setState({ options: options });
      }
    }
  }
  render() {
    return (
      <Form.Item style={{ ...this.props.formStyle, cursor: "pointer" }}>
        <Select
          name="userSelect"
          style={{ width: this.props?.width, cursor: "pointer" }}
          placeholder={this.props?.placeholder}
          value={this.state.selectedAccount}
          // defaultValue={this.props?.initialValue}
          showSearch={this.props?.showSearch ? true : false}
          onSelect={(value) => this.handleChange(value)}
          onDeselect={(value) => this.handleChange(value)}
          disabled={this.props.disabled}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {this.state.options &&
            this.state.options.map((data) => (
              <Option
                value={this.props.multipleNameShow ? data?._id : data?.name}
                key={data?._id}
              >
                {data?.name}
              </Option>
            ))}
        </Select>
      </Form.Item>
    );
  }
}
