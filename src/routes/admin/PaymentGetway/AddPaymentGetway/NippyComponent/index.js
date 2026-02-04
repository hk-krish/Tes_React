import { CustomFormItem } from "../../../../../components/InputControl/InputForm";

const Nippy = ({ nippyKeys, handleInputNippyKeysChange }) => {

    return (
        <>
            <CustomFormItem
                label="Merchant ID"
                name="merchantId"
                value={nippyKeys?.merchantId}
                placeholder="Enter Merchant ID"
                onChange={handleInputNippyKeysChange}
                rules={[{ required: true, message: "Please enter merchant id!" }]}
            />
            <CustomFormItem
                label="Auth Token"
                name="authToken"
                value={nippyKeys?.authToken}
                placeholder="Enter Auth Token"
                onChange={handleInputNippyKeysChange}
                rules={[{ required: true, message: "Please enter auth token!" }]}
            />
        </>
    );
};

export default Nippy;