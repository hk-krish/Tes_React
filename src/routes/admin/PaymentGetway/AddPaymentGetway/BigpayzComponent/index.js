import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";
import { Checkbox, Form } from "antd";
const Bigpayz = ({ bigpayzKeys, handleInputBigpayzKeysChange }) => {
    return (
        <>
            <CustomFormItem
                label="API URL"
                name="apiUrl"
                value={bigpayzKeys?.apiUrl}
                placeholder="Enter API Url"
                onChange={handleInputBigpayzKeysChange}
                rules={[{ required: true, message: "Please enter api url" }]}
            />
            <CustomFormItem
                label="Merchant ID"
                name="merchantId"
                value={bigpayzKeys?.merchantId}
                placeholder="Enter Merchant ID"
                onChange={handleInputBigpayzKeysChange}
                rules={[{ required: true, message: "Please enter merchant id" }]}
            />
            <CustomFormItem
                label="API Key"
                name="apiKey"
                value={bigpayzKeys?.apiKey}
                placeholder="Enter API key"
                onChange={handleInputBigpayzKeysChange}
                rules={[{ required: true, message: "Please enter api key" }]}
            />
            <Form.Item
                label="Payment Options"
                style={{ marginTop: "10px" }}
            >
                <Checkbox
                    name="qr"
                    checked={bigpayzKeys?.paymentOptions?.qr}
                    onChange={handleInputBigpayzKeysChange}
                >
                    QR
                </Checkbox>
                <Checkbox
                    name="bank"
                    checked={bigpayzKeys?.paymentOptions?.bank}
                    onChange={handleInputBigpayzKeysChange}
                >
                    BANK
                </Checkbox>
            </Form.Item>
        </>
    );
};
export default Bigpayz;