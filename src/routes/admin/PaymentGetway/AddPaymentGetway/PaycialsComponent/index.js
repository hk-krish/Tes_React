import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Paycials = ({ paycialsKeys, handleInputPaycialsKeysChange }) => {
  return (
    <>
      <CustomFormItem
        label="Client Id"
        name="clientId"
        value={paycialsKeys?.clientId}
        placeholder="Enter Client Id"
        onChange={handleInputPaycialsKeysChange}
        rules={[{ required: true, message: "Please enter your Client Id" }]}
      />
      <CustomFormItem
        label="Encryption"
        name="encryptionKey"
        value={paycialsKeys?.encryptionKey}
        placeholder="Enter encryption key"
        onChange={handleInputPaycialsKeysChange}
        rules={[
          { required: true, message: "Please enter your encryption key" },
        ]}
      />
      <CustomFormItem
        label="Mobile Number"
        name="mobileNumber"
        type="number"
        value={paycialsKeys?.mobileNumber}
        placeholder="Enter Mobile Number"
        onChange={handleInputPaycialsKeysChange}
        rules={[{ required: true, message: "Please enter your Mobile Number" }]}
      />
    </>
  );
};

export default Paycials;
