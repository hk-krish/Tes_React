import React from "react";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";
import { Form, Select } from "antd";
const { Option } = Select

const Payulink = ({ websiteList, payulinkKeys, handleInputPayulinkKeysChange }) => {
    return payulinkKeys.map((item, index) => {
        return (
            <div key={index}>
                <Form.Item
                    label="Select Website"
                    name={`websiteId`+index}
                    rules={[{ required: true, message: "Please select website!" }]}
                >
                    <Select
                        placeholder="Select Website"
                        onSelect={(e) => handleInputPayulinkKeysChange(index, "websiteId", e)}
                        onDeselect={(e) => handleInputPayulinkKeysChange(index, "websiteId", e)}
                        defaultValue={{ value: item?.websiteId }}
                    >
                        {websiteList?.map((data) => (
                            <Option value={data?._id} key={data?.name}>
                                {data?.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <CustomFormItem
                    label="Api Key"
                    name={`apiKey`+index}
                    value={item?.apiKey}
                    placeholder="Enter Api Key"
                    onChange={(e) => handleInputPayulinkKeysChange(index, "apiKey", e.target.value)}
                    rules={[{ required: true, message: "Please enter api key!" }]}
                />
            </div>
        )
    });
};

export default Payulink;