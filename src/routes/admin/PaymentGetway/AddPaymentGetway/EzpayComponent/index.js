import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Ezpay = ({ ezpayKeys, handleInputEzpayKeysChange }) => {

    return (
        <>
            <CustomFormItem
                label="Merchant Code"
                name="merchantCode"
                value={ezpayKeys?.merchantCode}
                placeholder="Enter Merchant Code"
                onChange={handleInputEzpayKeysChange}
                rules={[{ required: true, message: "Please enter merchant code!" }]}
            />
            <CustomFormItem
                label="Merchant Key"
                name="merchantKey"
                value={ezpayKeys?.merchantKey}
                placeholder="Enter Merchant Key"
                onChange={handleInputEzpayKeysChange}
                rules={[{ required: true, message: "Please enter merchant key!" }]}
            />
        </>
    );
};

export default Ezpay;