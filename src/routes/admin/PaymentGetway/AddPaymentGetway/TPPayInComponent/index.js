import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const TPPayIn = ({ tpPayInKeys, handleInputTPPayInKeysChange }) => {
    return (
        <>
            <CustomFormItem
                label="Client Id"
                name="clientId"
                value={tpPayInKeys?.clientId}
                placeholder="Enter Client Id"
                onChange={handleInputTPPayInKeysChange}
                rules={[{ required: true, message: "Please enter client id" }]}
            />
            <CustomFormItem
                label="API Key"
                name="apiKey"
                value={tpPayInKeys?.apiKey}
                placeholder="Enter API Key"
                onChange={handleInputTPPayInKeysChange}
                rules={[{ required: true, message: "Please enter api key" }]}
            />
            <CustomFormItem
                label="Salt"
                name="salt"
                value={tpPayInKeys?.salt}
                placeholder="Enter salt"
                onChange={handleInputTPPayInKeysChange}
                rules={[{ required: true, message: "Please enter salt" }]}
            />
            <CustomFormItem
                label="Total days"
                name="totalDays"
                min={1}
                type="number"
                value={tpPayInKeys?.totalDays}
                placeholder="Enter total days"
                onChange={handleInputTPPayInKeysChange}
                rules={[
                    {
                        required: tpPayInKeys?.totalDays === "",
                        message: "Please enter total days"
                    },
                    {
                        required: tpPayInKeys?.totalDays !== "",
                        pattern: new RegExp(
                            /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/,
                        ),
                        message: "Please enter only numerical characters",
                    }
                ]}
            />
        </>
    );
};

export default TPPayIn;