import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import notify from "../../Notification";
import ServerURL from "../../service/ServerURL";
import { convertAmountToWords } from "../../util/ConvertAmountToWord";

const CommissionModal = (props) => {
  const host = ServerURL.getAPIUrl();
  const {
    visible,
    onClose,
    record,
    onUpdateStatus,
    setConformLoading,
    conformLoading,
    openImageModal,
    status,
  } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState({
    commissionId: "",
    remark: "",
    paymentSS: "",
    amount: "",
    status:
      status === "approve" || status === "settle"
        ? "completed"
        : status === "decline"
          ? "decline"
          : "submitted", // When User Click Submitte Button then pass "submitted" status and if user Click approve then pass "completed" and if user Click decline then pass "decline"
    fromAmount: record?.from === "PG" ? record?.amount : record?.fromAmount,
  });
  const [imagePath, setImagePath] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [amount, setAmount] = useState(null);

  const handleApprove = async () => {
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
        setData({ ...data, paymentSS: response?.data?.data?.data });
        imageUrl = response?.data?.data?.data;
      } catch (error) {
        setConformLoading(false);
        message?.error(error?.message);
        return;
      }
    }
    // Ensure amount is always in float format with two decimal places
    const formattedAmount = parseFloat(data?.amount).toFixed(2);
    const params = {
      commissionId: data?.commissionId,
      status: data?.status,
      ...(data?.amount
        ? {
            amount: formattedAmount,
          }
        : {}),
      ...(imageUrl
        ? {
            paymentSS: imageUrl,
          }
        : {}),
      ...(data?.remark
        ? {
            remark: data?.remark,
          }
        : {}),
    };
    onUpdateStatus(params);
    setIsButtonDisabled(false);
    setFileList([]);
    setImagePath(null);
    form.resetFields();
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImagePath(fileList[0].originFileObj);
    } else {
      setImagePath(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const regex = /^\d+(\.\d{0,2})?$/;
      if (regex.test(value) || value === "") {
        setData((prevData) => ({
          ...prevData,
          amount: value,
        }));
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const onCancel = () => {
    onClose();
    setFileList([]);
    setImagePath(null);
    form.resetFields();
  };

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

  useEffect(() => {
    if (record) {
      setData({
        commissionId: record?._id,
        paymentSS: "",
        remark: "",
        amount: "",
        status:
          status === "approve" || status === "settle"
            ? "completed"
            : status === "decline"
              ? "decline"
              : "submitted", // When User Click Submitte Button then pass "submitted" status and if user Click approve then pass "completed" and if user Click decline then pass "decline"
        fromAmount: record?.from === "PG" ? record?.amount : record?.fromAmount,
      });
      setAmount(record?.from === "PG" ? record?.amount : record?.fromAmount);
    }
    setFileList([]);
    setImagePath(null);
    form.resetFields();
  }, [visible, record]);

  return (
    <Modal
      visible={visible}
      title="Settlement"
      onCancel={onCancel}
      footer={null}
    >
      <Spin spinning={conformLoading}>
        <Form
          form={form}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 24 }}
          style={{ minWidth: 300, maxWidth: 1000, padding: "0" }}
          initialValues={{ remember: true }}
          onFinish={handleApprove}
          autoComplete="off"
          labelAlign="top"
        >
          {record?.status === "pending" && (
            <>
              <Typography.Text strong style={{ fontSize: "18px" }}>
                Amount :{" "}
              </Typography.Text>
              <Typography.Text
                strong
                style={{
                  fontSize: "18px",
                  color: record?.to === "TES" ? "green" : "red",
                }}
              >
                {record?.from === "PG" ? record?.amount : record?.fromAmount}
              </Typography.Text>
              <div>
                <Typography.Text strong style={{ fontSize: "18px" }}>
                  New Settlement :{" "}
                </Typography.Text>
                <Typography.Text
                  strong
                  style={{
                    fontSize: "18px",
                    color: record?.to === "TES" ? "green" : "red",
                  }}
                >
                  {(amount - data?.amount).toFixed(2)}
                </Typography.Text>
              </div>
            </>
          )}
          {record?.status === "submitted" && (
            <>
              <div style={{ fontSize: "16px" }}>
                {`Amount : ${record?.receiveAmount}`}
              </div>
              <div style={{ fontSize: "16px" }}>
                {convertAmountToWords(record?.receiveAmount)}
              </div>
              {record?.paymentSS && (
                <Button
                  style={{ marginTop: "10px" }}
                  type="primary"
                  onClick={() => openImageModal()}
                >
                  View Image
                </Button>
              )}
            </>
          )}
          {record?.status !== "submitted" && (
            <Form.Item
              labelCol={{ span: 24 }}
              required={true}
              label="Amount"
              name="amount"
              rules={[
                {
                  required: data?.amount === "",
                  message: "Please enter Amount!",
                },
                {
                  required: data?.amount !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters!",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter Amount"
                value={data?.amount}
                name="amount"
                id="amount"
                min={0}
                step="0.01"
                onChange={handleInputChange}
              />
            </Form.Item>
          )}
          <Form.Item label="Remarks" name="remark" labelCol={{ span: 24 }}>
            <Input.TextArea
              type="text"
              placeholder="Enter Remark"
              value={data?.remark}
              name="remark"
              id="remark"
              onChange={handleInputChange}
            />
          </Form.Item>
          {record?.status === "pending" && (
            <Form.Item
              label="Payment Screenshot"
              name="paymentSS"
              labelCol={{ span: 24 }}
            >
              <Upload
                name="image"
                accept="image/*"
                fileList={fileList}
                onChange={handleFileChange}
                onRemove={() => setImagePath(null)} // Reset the imagePath on remove
                beforeUpload={beforeUpload} // Validate file type before upload
              >
                {fileList.length === 0 && (
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                )}
              </Upload>
            </Form.Item>
          )}
          <Form.Item>
            {status === "approve" || status === "decline" ? (
              <Button
                htmlType="submit"
                disabled={isButtonDisabled}
                style={{
                  backgroundColor:
                    status === "approve"
                      ? "green"
                      : status === "decline"
                        ? "red"
                        : "",
                  color: "white",
                  padding: "0 40px",
                }}
              >
                {status === "approve"
                  ? "Approve"
                  : status === "decline"
                    ? "Decline"
                    : "Submit"}
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="primary"
                disabled={isButtonDisabled}
                style={{ padding: "0 40px" }}
              >
                Settle
              </Button>
            )}
            <Button
              type={"primary"}
              disabled={isButtonDisabled}
              style={{
                color: "white",
                padding: "0 40px",
              }}
              onClick={onCancel} // Use appropriate handler based on the action
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default CommissionModal;
