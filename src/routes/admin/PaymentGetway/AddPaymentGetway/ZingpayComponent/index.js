import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Zingpay = ({ zingpayKeys, handleInputZingpayKeysChange }) => {
    return (
        <>
            <CustomFormItem
                label="API Key"
                name="apiKey"
                value={zingpayKeys?.apiKey}
                placeholder="Enter API Key"
                onChange={handleInputZingpayKeysChange}
                rules={[{ required: true, message: "Please enter api key!" }]}
            />
            <CustomFormItem
                label="Secret Key"
                name="appSecretKey"
                value={zingpayKeys?.appSecretKey}
                placeholder="Enter App Secret Key"
                onChange={handleInputZingpayKeysChange}
                rules={[{ required: true, message: "Please enter app secret key!" }]}
            />
            <CustomFormItem
                label="Signature Key"
                name="appSignatureKey"
                value={zingpayKeys?.appSignatureKey}
                placeholder="Enter App Signature Key"
                onChange={handleInputZingpayKeysChange}
                rules={[{ required: true, message: "Please enter app signature key!" }]}
            />
        </>
    );
};

export default Zingpay;