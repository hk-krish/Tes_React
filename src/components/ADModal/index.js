import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  message,
  Modal,
  Spin,
  Typography,
  Upload,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import notify from "../../Notification";
import ServerURL from "../../service/ServerURL";
import { convertAmountToWords } from "../../util/ConvertAmountToWord";
import { onDateFormate } from "../../util/DateFormate";
import { validationRules } from "../../util/ValidationRules";
import ActionButton from "./actionButton";
const ADModal = (props) => {
  const {
    visible,
    onClose,
    selectedTransectiondata,
    decline,
    deposit,
    confirmLoading,
    setConformLoading,
  } = props;
  const { user } = useSelector(({ auth }) => auth);
  const host = ServerURL.getAPIUrl();

  const [data, setData] = useState({
    remarks: "",
    password: "",
    utrId: "",
    amount: null,
    paymentSS: null,
  });
  const [amountWord, setAmountWord] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [amountColor, setAmountColor] = useState("red");
  const [hasError, setHasError] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imagePath, setImagePath] = useState(null);
  const [initialValues, setInitialValues] = useState({
    utrId: "",
    amount: null,
  });
  const [isAmountChanged, setIsAmountChanged] = useState(false);
  const [isUtrIdChanged, setIsUtrIdChanged] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [amountError, setAmountError] = useState("");

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleInputUTRChange = (e) => {
    let { name, value } = e.target;
    if (name === "utrId" && value !== "" && /[^a-zA-Z0-9]/.test(value)) {
      setHasError(true);
    } else {
      setData({
        ...data,
        [name]: value,
      });
      setHasError(false);
    }
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImagePath(fileList[0].originFileObj);
      setIsImage(true);
    } else {
      setIsImage(false);
      setImagePath(null);
    }
  };

  const handleAction = async (status, isVerifyRequest = false) => {
    const { remarks, password, utrId, amount } = data;
    let imageUrl = "";

    setConformLoading(true);
    setIsButtonDisabled(true);

    if (imagePath) {
      const formData = new FormData();
      formData.append("image", imagePath);
      try {
        const response = await axios.post(`${host}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = response?.data?.data?.data;
        setData({ ...data, paymentSS: imageUrl });
      } catch (error) {
        setConformLoading(false);
        message.error(error?.message);
        setIsButtonDisabled(false);
        return;
      }
    }

    props.onReceiveData(
      remarks,
      password,
      utrId,
      parseInt(amount),
      imageUrl,
      selectedTransectiondata?._id,
      selectedTransectiondata?.withdrawAccount?._id ||
        selectedTransectiondata?.depositAccount?._id,
      status,
      isVerifyRequest,
    );

    setIsButtonDisabled(false);
  };

  // Usage
  const handleApprove = () => handleAction("success", false);
  const handleDecline = () => handleAction("decline", false);
  const handleRequest = () => handleAction("success", true);

  const beforeUpload = (file) => {
    const isImage =
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg";
    if (!isImage) {
      notify.openNotificationWithIcon(
        "error",
        "Erorr",
        "You can only upload PNG, JPG, or JPEG files!",
      );
      return Upload.LIST_IGNORE;
    }

    const isLt500KB = file.size / 1024 < 500;
    if (!isLt500KB) {
      notify.openNotificationWithIcon(
        "error",
        "Error",
        "Image must be smaller than 500KB!",
      );
      return Upload.LIST_IGNORE;
    }
    // setImagePath(file);
    return false; // Prevent automatic upload
  };

  const renderAmountDetails = () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <b>Amount:</b>{" "}
        <Typography.Text
          strong
          style={{ fontSize: "25px", color: amountColor }}
        >
          {selectedTransectiondata?.amount}
        </Typography.Text>
      </div>
      <Typography.Text strong style={{ fontSize: "18px", color: "red" }}>
        {amountWord ? convertAmountToWords(amountWord) : ""}
      </Typography.Text>
      <span>
        <b>Date:</b>{" "}
        {onDateFormate(
          selectedTransectiondata?.updatedAt,
          "DD-MM-YYYY hh:mm A",
        )}
      </span>
      <span>
        <b>{"PG Transaction ID:"}</b>
        {selectedTransectiondata?.traId}
      </span>
      {deposit &&
        selectedTransectiondata?.transactionId &&
        selectedTransectiondata?.reqType !== "crypto" && (
          <span>
            <b>UTR ID:</b> {selectedTransectiondata?.transactionId}{" "}
            {selectedTransectiondata?.upiId
              ? `[${selectedTransectiondata?.upiId}]`
              : ""}
          </span>
        )}
      {deposit && selectedTransectiondata?.reqType === "crypto" && (
        <div>
          <b>Crypto Value: </b>{" "}
          <Typography.Text strong style={{ color: amountColor }}>
            {selectedTransectiondata?.coin?.conversionToUSDT
              ? `${((selectedTransectiondata?.amount + selectedTransectiondata?.coinNetwork?.networkFee) / selectedTransectiondata?.conversionToUSDT).toFixed(6)} ${selectedTransectiondata?.coin?.name}`
              : ""}
          </Typography.Text>
        </div>
      )}
    </div>
  );

  const renderUploadSection = () => (
    <Form.Item
      label="Payment Screenshot"
      name="paymentSS"
      labelCol={{ span: 24 }}
      valuePropName="fileList"
      getValueFromEvent={(e) => e?.fileList}
      rules={[
        {
          required: isAmountChanged || isUtrIdChanged,
          validator: (_, value) => {
            if (value && value.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error("Please upload a payment screenshot!"),
            );
          },
        },
      ]}
    >
      <Upload
        name="image"
        accept="image/*"
        fileList={fileList}
        onChange={handleFileChange}
        onRemove={() => setImagePath(null)}
        beforeUpload={beforeUpload}
      >
        {fileList.length === 0 && (
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        )}
      </Upload>
    </Form.Item>
  );

  // Monitor changes in utrId and amount fields
  const handleFormChange = () => {
    const currentValues = form.getFieldsValue(["utrId", "amount"]);
    const hasChangedUtrId = currentValues.utrId !== initialValues.utrId;
    const hasChangedAmount =
      parseInt(currentValues.amount) !== initialValues.amount;
    // Update individual states
    if (!user?.operatorAccess?.deposit?.utr) {
      setIsUtrIdChanged(hasChangedUtrId);
    }

    if (!user?.operatorAccess?.deposit?.amount) {
      setIsAmountChanged(hasChangedAmount);
    }
  };

  const handleAmountChange = (e) => {
    // Update the amount in the state
    const { value } = e.target;

    setData({
      ...data,
      amount: value,
    });
    // Check if the amount exceeds the limit
    if (
      user?.userType === "operator" &&
      selectedTransectiondata?.amount &&
      parseFloat(value) > selectedTransectiondata?.amount
    ) {
      setAmountError(`Amount cannot exceed ${selectedTransectiondata.amount}`);
    } else if (parseFloat(value) <= 0) {
      setAmountError(`Amount must be greater than 0`);
    } else {
      setAmountError(""); // Clear error when valid
    }
  };

  useEffect(() => {
    form.resetFields();
    setIsImage(false);
    setData({
      remarks: "",
      password: "",
      utrId: "",
      paymentSS: "",
    });
    let finalUtr = selectedTransectiondata?.changeGatewayTraId
      ? selectedTransectiondata?.changeGatewayTraId
      : selectedTransectiondata?.gatewayTraId;
    setConformLoading(false);
    setAmountWord(selectedTransectiondata?.amount);
    if (
      selectedTransectiondata?.gatewayTraId ||
      selectedTransectiondata?.amount
    ) {
      form.setFieldsValue({
        utrId: finalUtr,
        amount: selectedTransectiondata?.amount,
      });
      setData({
        ...data,
        utrId: finalUtr,
        amount: selectedTransectiondata?.amount,
      });
    }
    setInitialValues({
      utrId: form.getFieldValue("utrId"),
      amount: form.getFieldValue("amount"),
    });
  }, [visible]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setAmountColor((prevColor) => (prevColor === "red" ? "green" : "red"));
    }, 300); // Adjust the interval as needed

    return () => clearInterval(blinkInterval);
  }, [amountWord]);

  return (
    <>
      <Modal
        style={{ marginTop: "-30px" }}
        width={850}
        visible={visible}
        confirmLoading={confirmLoading}
        footer={[
          <Button key="ok" type="primary" onClick={onClose}>
            Cancel
          </Button>,
        ]}
        onCancel={onClose}
      >
        <Spin spinning={confirmLoading}>
          <Card style={{ border: "none", marginBottom: "0px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Form
                form={form}
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 24 }}
                style={{
                  minWidth: 300,
                  maxWidth: 1000,
                  padding: "0 20px 0 0",
                }}
                onValuesChange={handleFormChange}
                initialValues={{ remember: true }}
                autoComplete="off"
                labelAlign="top"
              >
                <Form.Item
                  required={decline ? true : false}
                  label="Remarks"
                  name="remarks"
                  labelCol={{ span: 24 }}
                  rules={
                    decline
                      ? [
                          {
                            required: data?.remarks === "",
                            message:
                              "Please enter your remarks when declining!",
                          },
                        ]
                      : undefined // No rule when decline is false
                  }
                >
                  <Input.TextArea
                    type="text"
                    placeholder="Enter Remark"
                    value={data?.remarks}
                    name="remarks"
                    id="remarks"
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  labelCol={{ span: 24 }}
                  rules={validationRules.password}
                >
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={data?.password}
                    name="password"
                    autoComplete="off"
                    id="password"
                    onChange={handleInputChange}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                {selectedTransectiondata?.reqType !== "digital rupee" && (
                  <Form.Item
                    required
                    label={
                      selectedTransectiondata?.reqType === "crypto"
                        ? "Crypto Transaction Hash ID"
                        : "UTR Transaction ID"
                    }
                    name="utrId"
                    labelCol={{ span: 24 }}
                    validateStatus={hasError ? "error" : ""}
                    help={hasError ? "Special characters are not allowed" : ""}
                    rules={[
                      {
                        required: data?.utrId === "",
                        message: "Please enter UTR transaction Id!",
                      },
                      {
                        pattern: /^[a-zA-Z0-9]/,
                        message: "Special characters are not allowed",
                      },
                      {
                        validator: (_, value) => {
                          // Custom validator to check for special characters
                          if (!/^[a-zA-Z0-9]/.test(value)) {
                            return Promise.reject(
                              "Special characters are not allowed",
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                      type="utrId"
                      placeholder={
                        selectedTransectiondata?.reqType === "crypto"
                          ? "Enter Crypto Transaction Hash ID"
                          : "Enter UTR Transaction ID"
                      }
                      value={data?.utrId}
                      name="utrId"
                      id="utrId"
                      autoComplete="off"
                      onChange={handleInputUTRChange}
                      onKeyPress={(e) => {
                        // Check if the pressed key is a letter or a number
                        const isAlphanumeric = /^[a-zA-Z0-9]/.test(e.key);

                        // If the pressed key is not alphanumeric, prevent the input
                        if (!isAlphanumeric) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Prevent the default paste behavior
                        e.preventDefault();

                        // Get the pasted data and remove spaces
                        const pastedData = e.clipboardData
                          .getData("text/plain")
                          .replace(/\s/g, "");

                        // Check if the pasted data contains special characters
                        if (/[^a-zA-Z0-9]/.test(pastedData)) {
                          // Set the error state
                          setHasError(true);
                        } else {
                          // Reset the error state if no special characters are found
                          setHasError(false);
                        }

                        // Update the state directly
                        setData({
                          ...data,
                          utrId: pastedData,
                        });

                        // Use Form's setValue to update the input field value
                        form.setFieldsValue({
                          utrId: pastedData,
                        });
                      }}
                    />
                  </Form.Item>
                )}
                {!decline && (
                  <Form.Item
                    label="Amount"
                    name="amount"
                    labelCol={{ span: 24 }}
                    {...(user?.userType === "operator" && {
                      validateStatus: amountError ? "error" : "",
                      help: amountError,
                    })}
                  >
                    <Input
                      style={{ width: "100%" }}
                      type="number"
                      placeholder="Enter amount"
                      value={data?.amount}
                      min={1}
                      name="amount"
                      autoComplete="off"
                      onChange={handleAmountChange}
                    />
                  </Form.Item>
                )}
                {(isAmountChanged || isUtrIdChanged) &&
                  !decline &&
                  renderUploadSection()}
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <ActionButton
                    decline={decline}
                    hasError={hasError}
                    isButtonDisabled={isButtonDisabled}
                    data={data}
                    selectedTransectiondata={selectedTransectiondata}
                    handleApprove={handleApprove}
                    handleDecline={handleDecline}
                    userType={user?.userType}
                    isAmountChanged={isAmountChanged}
                    isUtrIdChanged={isUtrIdChanged}
                    isImage={isImage}
                    amountError={amountError}
                    form={form}
                  />
                </div>
                {renderAmountDetails()}
              </Form>
              {deposit && (
                <div>
                  {selectedTransectiondata?.paymentSS !== null ? (
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "auto",
                      }}
                    >
                      <Image
                        preview={false}
                        src={
                          selectedTransectiondata?.paymentSS
                            ? selectedTransectiondata?.paymentSS
                            : "No Image"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundSize: "cover",
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default ADModal;
