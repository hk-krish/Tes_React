import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Fpay = ({ fpayKeys, handleInputFPayKeysChange }) => {
  return (
    <>
      <CustomFormItem
        label="User Name"
        name="userName"
        value={fpayKeys?.userName}
        placeholder="Enter User Name"
        onChange={handleInputFPayKeysChange}
        rules={[{ required: true, message: "Please enter User name!" }]}
      />
      <CustomFormItem
        label="API Key"
        name="apiKey"
        value={fpayKeys?.apiKey}
        placeholder="Enter API Key"
        onChange={handleInputFPayKeysChange}
        rules={[{ required: true, message: "Please enter API key!" }]}
      />
      {/* <CustomFormItem
        label="Auth Key"
        name="authKey"
        value={fpayKeys?.authKey}
        placeholder="Enter Auth Key"
        onChange={handleInputFPayKeysChange}
        rules={[{ required: true, message: "Please enter Auth key!" }]}
      /> */}
      <CustomFormItem
        label="Secret Key"
        name="secretKey"
        value={fpayKeys?.secretKey}
        placeholder="Enter Secrete Key"
        onChange={handleInputFPayKeysChange}
        rules={[{ required: true, message: "Please enter Secrete key!" }]}
      />
    </>
  );
};

export default Fpay;
