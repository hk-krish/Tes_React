import { Button, Card, Form, Input, Modal, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { convertAmountToWords } from "../../util/ConvertAmountToWord";
import { onDateFormate } from "../../util/DateFormate";

const ExchangeTransactionsModal = (props) => {
  const {
    visible,
    onClose,
    selectedTransectiondata,
    decline,
    request,
    confirmLoading,
    setConformLoading,
  } = props;
  const [data, setData] = useState({
    remark: "",
    password: "",
  });
  const [amountWord, setAmountWord] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [amountColor, setAmountColor] = useState("red");
  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    request(false);
    let { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleApprove = () => {
    setIsButtonDisabled(true);
    const { remark, password } = data;
    setConformLoading(true);
    props.onReceiveData(
      selectedTransectiondata?._id,
      remark,
      "success",
      password,
    );
    setIsButtonDisabled(false);
  };

  const handleDecline = () => {
    setIsButtonDisabled(true);
    const { remark, password } = data;
    setConformLoading(true);
    props.onReceiveData(
      selectedTransectiondata?._id,
      remark,
      "decline",
      password,
    );
    setIsButtonDisabled(false);
  };

  useEffect(() => {
    form.resetFields();
    setData({
      remark: "",
      password: "",
    });
    setAmountWord(selectedTransectiondata?.amount);
    request(false);
    setConformLoading(false);
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
                initialValues={{ remember: true }}
                autoComplete="off"
                labelAlign="top"
              >
                <Form.Item
                  required={decline ? true : false}
                  label="Remark"
                  name="remark"
                  labelCol={{ span: 24 }}
                  rules={
                    decline
                      ? [
                          {
                            required: data?.remark === "",
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
                    value={data?.remark}
                    name="remark"
                    id="remark"
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  labelCol={{ span: 24 }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password!",
                    },
                  ]}
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

                <div style={{ display: "flex", justifyContent: "end" }}>
                  <>
                    <Button
                      style={{
                        color: "white",
                        padding: "0 40px",
                        backgroundColor: decline ? "red" : "green",
                      }}
                      disabled={
                        isButtonDisabled ||
                        data?.password === "" ||
                        (decline && data.remark === "")
                      }
                      onClick={decline ? handleDecline : handleApprove}
                    >
                      {decline ? "Decline" : "Approve"}
                    </Button>
                  </>
                </div>

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
                  <Typography.Text
                    strong
                    style={{ fontSize: "18px", color: "red" }}
                  >
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
                </div>
              </Form>
            </div>
          </Card>
        </Spin>
      </Modal>
    </>
  );
};
export default ExchangeTransactionsModal;
