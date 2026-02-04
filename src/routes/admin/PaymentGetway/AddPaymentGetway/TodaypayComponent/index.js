import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Todaypay = ({ todaypayKeys, handleInputTodaypayKeysChange }) => {
  return (
    <>
      <CustomFormItem
        label="Merchant ID"
        name="merchantId"
        value={todaypayKeys?.merchantId}
        placeholder="Enter Merchant ID"
        onChange={handleInputTodaypayKeysChange}
        rules={[{ required: true, message: "Please enter Merchant ID!" }]}
      />
      <CustomFormItem
        label="API Key"
        name="merchantSecretKey"
        value={todaypayKeys?.merchantSecretKey}
        placeholder="Enter API Key"
        onChange={handleInputTodaypayKeysChange}
        rules={[{ required: true, message: "Please enter API key!" }]}
      />
    </>
  );
};

export default Todaypay;
