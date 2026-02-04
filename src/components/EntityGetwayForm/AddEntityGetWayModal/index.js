import { Button, Form, Modal, Select, Spin, Switch, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { fetchEntityData } from "../../../appRedux/actions/EntityPayment";
import notify from "../../../Notification";
import EntityGetway from "../../../service/EntityGetWay";
import CircularProgress from "../../CircularProgress";
import { CustomFormItem } from "../../InputControl/InputForm";

const { Option } = Select;

const AddEntityGetWayModal = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const { actionType, entityData } = useSelector(
    ({ entityPayment }) => entityPayment,
  );
  const { paymentGatewayList, transactionType } = useSelector(
    ({ paymentGateway }) => paymentGateway,
  );
  const [data, setData] = useState({
    transactionType,
    entityType: "website",
    entityId:
      actionType !== "add-entityGateway" || actionType !== "edit-entityGateway"
        ? props?.websiteId
        : "",
    paymentGateWayId: "",
    priority: "",
    isBlock: false,
    withdrawTransactionLimit: {
      max: 0,
      min: 0,
    },
    depositTransactionLimit: {
      max: 0,
      min: 0,
    },
    minimumSuccessfulTransactionCount: 0,
    minimumTotalTransactionAmount: 0,
    depositReqEatTime: "0",
    commission: "0",
    tesCommission: "0",
    isRecommended: false,
    howToDepositUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);
  const [isBlock, setIsBlock] = useState(false);
  const [selectedPaymentData, setSelectedPaymentData] = useState(false);
  const [paymnetGatewayFilterList, setPaymnetGatewayFilterList] =
    useState(null);

  const fetchData = async (entityData) => {
    if (
      props.location.pathname === "/websites/editwebsite" &&
      actionType === "edit-entityGateway"
    ) {
      setDataLoad(true);
      const response = await EntityGetway.getEntityGetwayById(entityData?._id);
      if (response?.status === 200) {
        setIsBlock(!response?.data?.isBlock);
        let paymentData = paymentGatewayList?.filter(
          (a) => a?._id === response?.data?.paymentGateWayId,
        );
        setSelectedPaymentData(paymentData);

        let formattedData = {};
        const depositReqEatTime =
          response?.data?.depositReqEatTime?.replace(" min", "") || "0";

        if (response.data?.transactionType === "deposit") {
          formattedData = {
            transactionType,
            entityId: response?.data?.entityId,
            priority: response?.data?.priority,
            paymentGateWayId: response?.data?.paymentGateWayId,
            isBlock: response?.data?.isBlock,
            min: response?.data?.depositTransactionLimit?.min,
            max: response?.data?.depositTransactionLimit?.max,
            minimumSuccessfulTransactionCount:
              response?.data?.minimumSuccessfulTransactionCount || 0,
            minimumTotalTransactionAmount:
              response?.data?.minimumTotalTransactionAmount || 0,
            depositReqEatTime: depositReqEatTime,
            commission: response?.data?.commission,
            tesCommission: response?.data?.tesCommission,
            isRecommended: response?.data?.isRecommended,
            howToDepositUrl: response?.data?.howToDepositUrl,
          };
        } else {
          formattedData = {
            transactionType,
            entityId: response?.data?.entityId,
            priority: response?.data?.priority,
            paymentGateWayId: response?.data?.paymentGateWayId,
            isBlock: response?.data?.isBlock,
            min: response?.data?.withdrawTransactionLimit?.min,
            max: response?.data?.withdrawTransactionLimit?.max,
            commission: response?.data?.commission,
            tesCommission: response?.data?.tesCommission,
          };
        }

        form?.setFieldsValue(formattedData);

        setData(response?.data);

        setDataLoad(false);
      } else {
        message.error(response?.error);
      }
    }
  };
  const onFinish = async () => {
    setIsLoading(true);
    const formattedDepositReqEatTime =
      data.depositReqEatTime === "0" ? "0 min" : data.depositReqEatTime;
    let updateData = {};
    if (data?.transactionType === "deposit") {
      updateData = {
        _id: data?._id,
        entityType: data?.entityType,
        entityId: data?.entityId,
        paymentGateWayId: data?.paymentGateWayId,
        priority: data?.priority,
        isBlock: data?.isBlock,
        depositTransactionLimit: {
          max: data?.depositTransactionLimit?.max,
          min: data?.depositTransactionLimit?.min,
        },
        minimumSuccessfulTransactionCount:
          data.minimumSuccessfulTransactionCount,
        minimumTotalTransactionAmount: data.minimumTotalTransactionAmount,
        transactionType: data?.transactionType,
        depositReqEatTime: formattedDepositReqEatTime,
        commission: data?.commission,
        tesCommission: data?.tesCommission,
        isRecommended: data?.isRecommended,
        howToDepositUrl: data?.howToDepositUrl,
      };
    } else {
      updateData = {
        _id: data?._id,
        entityType: data?.entityType,
        entityId: data?.entityId,
        paymentGateWayId: data?.paymentGateWayId,
        priority: data?.priority,
        isBlock: data?.isBlock,
        withdrawTransactionLimit: {
          max: data?.withdrawTransactionLimit?.max,
          min: data?.withdrawTransactionLimit?.min,
        },
        transactionType,
        commission: data?.commission,
        tesCommission: data?.tesCommission,
      };
    }

    if (actionType === "edit-entityGateway") {
      await EntityGetway.editEntityGetway(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            form.resetFields();
            props?.onClose();
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setIsLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      delete updateData?._id;
      await EntityGetway.addEntityGetway(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            form.resetFields();
            props?.onClose();
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setIsLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "max" || name === "min") {
      if (data?.transactionType == "deposit") {
        setData({
          ...data,
          depositTransactionLimit: {
            ...data?.depositTransactionLimit,
            [name]: parseInt(value),
          },
        });
      } else {
        setData({
          ...data,
          withdrawTransactionLimit: {
            ...data?.withdrawTransactionLimit,
            [name]: parseInt(value),
          },
        });
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleEatTime = (e) => {
    let { name, value } = e.target;
    if (name === "depositReqEatTime") {
      let newValue = value + " min";
      setData({
        ...data,
        depositReqEatTime: newValue,
      });
    }
  };

  const handlePaymentChange = (e) => {
    let paymentData = paymnetGatewayFilterList?.filter((a) => a?._id === e);

    setSelectedPaymentData(paymentData);

    if (paymentData[0].transactionType === "deposit") {
      form?.setFieldValue("min", paymentData[0]?.depositTransactionLimit?.min);
      form?.setFieldValue("max", paymentData[0]?.depositTransactionLimit?.max);
      setData({
        ...data,
        paymentGateWayId: e,
        depositTransactionLimit: {
          min: paymentData[0]?.depositTransactionLimit?.min,
          max: paymentData[0]?.depositTransactionLimit?.max,
        },
        transactionType: paymentData[0]?.transactionType,
      });
    }

    if (paymentData[0].transactionType === "withdraw") {
      form?.setFieldValue("min", paymentData[0]?.withdrawTransactionLimit?.min);
      form?.setFieldValue("max", paymentData[0]?.withdrawTransactionLimit?.max);
      setData({
        ...data,
        paymentGateWayId: e,
        withdrawTransactionLimit: {
          min: paymentData[0]?.withdrawTransactionLimit?.min,
          max: paymentData[0]?.withdrawTransactionLimit?.max,
        },
        transactionType: paymentData[0]?.transactionType,
      });
    }
  };

  const handleIsActiveChange = (e) => {
    setIsBlock(e);
    setData({ ...data, isBlock: !e });
  };

  useEffect(() => {
    if (entityData) {
      fetchData(entityData);
    } else {
      form.resetFields();
    }
  }, [entityData, actionType]);

  useEffect(() => {
    if (transactionType) {
      let paymnetGateway = paymentGatewayList?.filter(
        (a) => a?.transactionType === transactionType,
      );
      setPaymnetGatewayFilterList(paymnetGateway);
    }
  }, [transactionType]);

  return (
    <>
      <Auxiliary>
        <Modal
          visible={props?.visible}
          title="Add Payment Gateway"
          footer={null}
          width={"55%"}
          onCancel={() => {
            props?.onClose();
            dispatch(fetchEntityData(null));
            if (actionType === "add-entityGateway") {
              form.resetFields();
            }
          }}
        >
          {dataLoad ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.7)", // Adjust background color and opacity as needed
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000, // Ensure the loading overlay is above the form
              }}
            >
              <Spin size="small" />
            </div>
          ) : (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 800 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                style={{ marginTop: "15px" }}
                label="Select Payment Gateway"
                name="paymentGateWayId"
                rules={[
                  {
                    required: true,
                    message: "Please select Payment Getwey!",
                  },
                ]}
              >
                <Select
                  placeholder="Select Payment Gatewey"
                  onSelect={(e) => handlePaymentChange(e)}
                  onDeselect={(e) => handlePaymentChange(e)}
                  defaultValue={{ name: data?.type, value: data?.type }}
                  disabled={actionType === "edit-entityGateway"}
                  name="paymentGateWayId"
                  id="paymentGateWayId"
                >
                  {paymnetGatewayFilterList?.map((data) => (
                    <Option value={data?._id} key={data?.name}>
                      {data?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <CustomFormItem
                label="Priority Number"
                name="priority"
                type="number"
                value={data?.priority}
                placeholder="Enter priority number"
                onChange={handleInputChange}
                min={1}
                rules={[
                  {
                    required: true,
                    message: "Please enter your priority number",
                  },
                  {
                    required: data?.priority !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                ]}
              />
              <CustomFormItem
                label="PG Commission"
                name="commission"
                type="number"
                value={data?.commission}
                placeholder="Enter commission"
                onChange={handleInputChange}
                min={0}
                step="0.01"
                rules={[
                  {
                    required: data?.commission === "",
                    message: "Please enter your commission",
                  },
                  {
                    required: data?.commission !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                ]}
              />
              <CustomFormItem
                label="PG+TES Commission"
                name="tesCommission"
                type="number"
                value={data?.tesCommission}
                placeholder="Enter PG+TES commission"
                onChange={handleInputChange}
                min={0}
                step="0.01"
                rules={[
                  {
                    required: data?.tesCommission === "",
                    message: "Please enter your TES commission",
                  },
                  {
                    required: data?.tesCommission !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                ]}
              />
              {data?.transactionType == "deposit" ? (
                <>
                  <CustomFormItem
                    label="Min Transaction Limit"
                    name="min"
                    min={0}
                    type="number"
                    value={data?.depositTransactionLimit?.min}
                    placeholder="Enter deposit minimum transaction amount"
                    onChange={handleInputChange}
                    rules={[
                      {
                        required: data?.depositTransactionLimit.min === "",
                        message: "Please enter your withdraw minimum limit",
                      },
                      {
                        required: data?.depositTransactionLimit.min !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            parseFloat(value) >=
                              selectedPaymentData[0]?.depositTransactionLimit
                                ?.min &&
                            parseFloat(value) <=
                              selectedPaymentData[0]?.depositTransactionLimit
                                ?.max
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              // "Minimum limit must be smaller than or equal to the PG maximum limit"
                              `Minimum limit should be between ${selectedPaymentData[0]?.depositTransactionLimit?.min} - ${selectedPaymentData[0]?.depositTransactionLimit?.max}`,
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                  <CustomFormItem
                    label="Max Transaction Limit"
                    name="max"
                    type="number"
                    min={0}
                    value={data?.depositTransactionLimit?.max}
                    placeholder="Enter deposit maximum transaction amount"
                    onChange={handleInputChange}
                    rules={[
                      {
                        required: data?.depositTransactionLimit.max === "",
                        message: "Please enter your withdraw maximum limit",
                      },
                      {
                        required: data?.depositTransactionLimit.max !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue("min")) {
                            return Promise.resolve();
                          }
                          if (
                            parseFloat(value) <=
                              selectedPaymentData[0]?.depositTransactionLimit
                                ?.max &&
                            parseFloat(value) >=
                              data?.depositTransactionLimit?.min
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              `Maximum limit should be between ${data.depositTransactionLimit?.min} - ${selectedPaymentData[0]?.depositTransactionLimit?.max}`,
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                  <CustomFormItem
                    label="Minimum Successful Transaction"
                    name="minimumSuccessfulTransactionCount"
                    type="number"
                    value={data?.minimumSuccessfulTransactionCount}
                    placeholder="Enter Minimum Successful Transactions Count"
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    rules={[
                      {
                        required:
                          data?.minimumSuccessfulTransactionCount === "",
                        message:
                          "Please enter your minimum successfull transactions count",
                      },
                      {
                        required:
                          data?.minimumSuccessfulTransactionCount !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      {
                        required: !(
                          data?.minimumSuccessfulTransactionCount < 0
                        ),
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "The number should not be less than 0",
                      },
                    ]}
                  />
                  <CustomFormItem
                    label="Minimum Total Transaction Amount"
                    name="minimumTotalTransactionAmount"
                    type="number"
                    value={data?.minimumTotalTransactionAmount}
                    placeholder="Enter Amount of Minimum Successfull Transactions"
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                    rules={[
                      {
                        required: data?.minimumTotalTransactionAmount === "",
                        message:
                          "Please enter your minimum total transaction amount",
                      },
                      {
                        required: data?.minimumTotalTransactionAmount !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      {
                        required: !(data?.minimumTotalTransactionAmount < 0),
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "The number should not be less than 0",
                      },
                    ]}
                  />
                </>
              ) : (
                <>
                  <CustomFormItem
                    label="Min Transaction Limit"
                    name="min"
                    min={0}
                    type="number"
                    value={data?.withdrawTransactionLimit?.min}
                    placeholder="Enter withdraw minimum transaction amount"
                    onChange={handleInputChange}
                    rules={[
                      {
                        required: data?.withdrawTransactionLimit.min === "",
                        message: "Please enter your withdraw minimum limit",
                      },
                      {
                        required: data?.withdrawTransactionLimit.min !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            parseFloat(value) >=
                              selectedPaymentData[0]?.withdrawTransactionLimit
                                ?.min &&
                            parseFloat(value) <=
                              selectedPaymentData[0]?.withdrawTransactionLimit
                                ?.max
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              // "Minimum limit must be smaller than or equal to the PG maximum limit"
                              `Minimum limit should be between ${selectedPaymentData[0]?.withdrawTransactionLimit?.min} - ${selectedPaymentData[0]?.withdrawTransactionLimit?.max}`,
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                  <CustomFormItem
                    label="Max Transaction Limit"
                    name="max"
                    type="number"
                    min={0}
                    value={data?.withdrawTransactionLimit?.max}
                    placeholder="Enter withdraw maximum transaction amount"
                    onChange={handleInputChange}
                    rules={[
                      {
                        required: data?.withdrawTransactionLimit.max === "",
                        message: "Please enter your withdraw maximum limit",
                      },
                      {
                        required: data?.withdrawTransactionLimit.max !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue("min")) {
                            return Promise.resolve();
                          }
                          if (
                            parseFloat(value) <=
                              selectedPaymentData[0]?.withdrawTransactionLimit
                                ?.max &&
                            parseFloat(value) >=
                              data.withdrawTransactionLimit?.min
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              `Maximum limit should be between ${data.withdrawTransactionLimit?.min} - ${selectedPaymentData[0]?.withdrawTransactionLimit?.max}`,
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                </>
              )}
              {data?.transactionType === "deposit" && (
                <>
                  <CustomFormItem
                    label="Average time(min)"
                    name="depositReqEatTime"
                    type="number"
                    value={data?.depositReqEatTime}
                    placeholder="Enter Average Time(min)"
                    onChange={handleEatTime}
                    min="0"
                    step="1"
                    rules={[
                      {
                        required: data?.depositReqEatTime === "",
                        message: "Please enter your Average time",
                      },
                      {
                        required: data?.depositReqEatTime !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                    ]}
                  />
                  <CustomFormItem
                    label="Video Link"
                    name="howToDepositUrl"
                    value={data?.howToDepositUrl}
                    placeholder="Enter Video Link"
                    onChange={handleInputChange}
                  />
                  <Form.Item label="is-Recommended" name="isRecommended">
                    <Switch
                      name="isRecommended"
                      checked={data?.isRecommended}
                      onChange={(e) =>
                        handleInputChange({
                          target: { name: "isRecommended", value: e },
                        })
                      }
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item label="Is Active" name="isBlock">
                <Switch
                  name="isBlock"
                  key="isBlock"
                  checked={isBlock}
                  onChange={(e) => {
                    handleIsActiveChange(e, "isBlock");
                  }}
                />
              </Form.Item>
              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                style={{ marginLeft: "33%" }}
              >
                <Button loading={isLoading} type="primary" htmlType="submit">
                  {actionType === "edit-entityGateway" ? "Update" : "ADD"}
                </Button>
                <Button
                  style={{ padding: "0 25px" }}
                  type="primary"
                  onClick={() => {
                    props?.onClose();
                    dispatch(fetchEntityData(null));
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </Form.Item>

              {loader ? (
                <div className="gx-loader-view">
                  <CircularProgress />
                </div>
              ) : null}
              {showMessage ? message.error(alertMessage.toString()) : null}
            </Form>
          )}
        </Modal>
      </Auxiliary>
    </>
  );
};

export default withRouter(AddEntityGetWayModal);
