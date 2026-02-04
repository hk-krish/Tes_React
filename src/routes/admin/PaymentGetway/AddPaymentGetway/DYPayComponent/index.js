import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const DYPay = ({ dypayKeys, handleInputDYPayKeysChange }) => {
    return (
        <>
            {dypayKeys?.bankCode && <CustomFormItem
                label="Bank Code"
                name="bankCode"
                value={dypayKeys?.bankCode}
                placeholder="Enter Bank Code"
                onChange={handleInputDYPayKeysChange}
                rules={[{ required: true, message: "Please enter bank code!" }]}
            />}
            <CustomFormItem
                label="Merchant Number"
                name="merchantNo"
                value={dypayKeys?.merchantNo}
                placeholder="Enter Merchant Number"
                onChange={handleInputDYPayKeysChange}
                rules={[{ required: true, message: "Please enter merchant number!" }]}
            />
            <CustomFormItem
                label="Merchant Secret Key"
                name="merchantSecretKey"
                value={dypayKeys?.merchantSecretKey}
                placeholder="Enter Merchant Secret Key"
                onChange={handleInputDYPayKeysChange}
                rules={[{ required: true, message: "Please enter merchant secret key!" }]}
            />
        </>
    );
};

export default DYPay;