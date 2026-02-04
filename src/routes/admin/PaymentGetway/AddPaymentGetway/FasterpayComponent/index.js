import React from "react";
import { Form, Select } from "antd";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Fasterypay = ({ fasterpayKeys, handleInputFasterpayKeysChange }) => {
    const walletCodeOptions = ["bkash", "rocket", "upay", "nagad", "okwallet", "tappay", "surecash"];
    return (
        <>
            <CustomFormItem
                label="Account ID"
                name="accountId"
                value={fasterpayKeys?.apiUrl}
                placeholder="Enter API Url"
                onChange={handleInputFasterpayKeysChange}
                rules={[{ required: true, message: "Please enter account id!" }]}
            />
            <CustomFormItem
                label="Account Key"
                name="accountKey"
                value={fasterpayKeys?.merchantId}
                placeholder="Enter Merchant ID"
                onChange={handleInputFasterpayKeysChange}
                rules={[{ required: true, message: "Please enter account key!" }]}
            />
            <Form.Item
                label="Wallet Code"
                name="walletCode"
                rules={[{ required: true }]}
            >
                <Select
                    name="walletCode"
                    placeholder="Select wallet code"
                    onSelect={(e) => handleInputFasterpayKeysChange({ target: { name: "walletCode", value: e } })}
                    value={fasterpayKeys?.walletCode}
                >
                    {walletCodeOptions.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                </Select>
            </Form.Item>
        </>
    );
};

export default Fasterypay;