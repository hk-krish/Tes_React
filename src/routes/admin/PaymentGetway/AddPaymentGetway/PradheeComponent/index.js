import { Form, Select } from "antd";
import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Pradhee = ({ transactionType, pradheeKeys, handleInputPradheeKeysChange }) => {
    return (
        <>
            <CustomFormItem
                label="API Key"
                name="apiKey"
                value={pradheeKeys?.apiKey}
                placeholder="Enter API Key"
                onChange={handleInputPradheeKeysChange}
                rules={[{ required: true, message: "Please enter api key!" }]}
            />
            <CustomFormItem
                label="Client Id"
                name="clientId"
                value={pradheeKeys?.clientId}
                placeholder="Enter Client Id"
                onChange={handleInputPradheeKeysChange}
                rules={[{ required: true, message: "Please enter client id!" }]}
            />
            <CustomFormItem
                label="Salt"
                name="salt"
                value={pradheeKeys?.salt}
                placeholder="Enter Salt"
                onChange={handleInputPradheeKeysChange}
                rules={[{ required: true, message: "Please enter salt!" }]}
            />
            {transactionType === "withdraw" &&
                <Form.Item
                    label="Payment Mode"
                    name="paymentMode"
                    rules={[{ required: true }]}
                >
                    <Select
                        name="paymentMode"
                        placeholder="Select Payment Mode"
                        onSelect={(e) => handleInputPradheeKeysChange({ target: { name: "paymentMode", value: e } })}
                        value={pradheeKeys?.walletCode}
                    >
                        {["IMPS", "NEFT", "RTGS"].map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                    </Select>
                </Form.Item>
            }
        </>
    );
};

export default Pradhee;