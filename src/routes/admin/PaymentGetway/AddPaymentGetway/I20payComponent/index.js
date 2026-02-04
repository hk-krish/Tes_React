import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const I20pay = ({ wizPayKeys, handleInputwizPayKeysChange }) => {
  return (
    <>
      <CustomFormItem
        label="Hash Key"
        name="hashKey"
        value={wizPayKeys?.hashKey}
        placeholder="Enter Client Id"
        onChange={handleInputwizPayKeysChange}
        rules={[{ required: true, message: "Please enter your Hash Key" }]}
      />
      <CustomFormItem
        label="Mobile Number"
        name="mobileNumber"
        type="number"
        value={wizPayKeys?.mobileNumber}
        placeholder="Enter Mobile Number"
        onChange={handleInputwizPayKeysChange}
        rules={[{ required: true, message: "Please enter your Mobile Number" }]}
      />
      <CustomFormItem
        label="Wizpay Name"
        name="wizPayName"
        value={wizPayKeys?.wizPayName}
        placeholder="Enter Wizpay name"
        onChange={handleInputwizPayKeysChange}
        rules={[{ required: true, message: "Please enter your Wizpay Name" }]}
      />
      <CustomFormItem
        label="Secret Key"
        name="secretKey"
        value={wizPayKeys?.secretKey}
        placeholder="Enter Secret Key"
        onChange={handleInputwizPayKeysChange}
        rules={[{ required: true, message: "Please enter your secretKey" }]}
      />
    </>
  );
};

export default I20pay;
