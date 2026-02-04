import { Button, Card, Form, Input, message, Radio } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Auxiliary from "util/Auxiliary";
import notify from "../../../Notification";
import CircularProgress from "../../../components/CircularProgress";
import { currencyConfigurationColumn, paymentMethodOrderColumn } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import SettingsService from "../../../service/SettingsService";
import { CustomFormItem } from "../../../components/InputControl/InputForm";
import {
  CheckSquareFilled,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import AuthService from "../../../service/AuthService";

const Settings = (props) => {
  let title = "Settings";

  const [data, setData] = useState(null);
  const [deposit, setDeposit] = useState(null);
  const [withdraw, setWithdraw] = useState(null);
  const [priorityConfigurationData, setPriorityConfigurationData] = useState([]);
  const [currencyConfigurationData, setCurrencyConfigurationData] = useState([]);
  const [transactionPassword, setTransactionPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage, user } = useSelector(
    ({ auth }) => auth,
  );
  const formRef = useRef();
  const history = useHistory();
  const tabPermission =
    user?.tabPermission &&
    user?.tabPermission?.length > 0 &&
    user?.tabPermission?.find(item => "/" + item.tabId.tabUrl === history.location.pathname);

  const handleChange = (e, record, type) => {
    setPriorityConfigurationData((prevData) =>
      prevData?.map((item) => {
        if (item.paymentMethod === record.paymentMethod) {
          if (type === "priority") {
          return { ...item, priority: parseInt(e.target.value) };
        }
          if (type === "redirectUrl") {
            return { ...item, redirectUrl: e.target.value };
          }
        }
        return item;
      }),
    );
  };

  const handleCurrencyChange = (e, record) => {
    setCurrencyConfigurationData((prevData) =>
      prevData?.map((item) => {
        if (item.name === record.name) {
          return { ...item, conversionRate: parseFloat(e.target.value) };
        }
        return item;
      }),
    );
  };

  const handleInputTransactionPasswordChange = (e) => {
    let { name, value } = e.target;
    setTransactionPassword(value);
  };

  const onStatusChange = async (datas) => {
    setPriorityConfigurationData((prevData) =>
      prevData?.map((item) => {
        if (item.priority === datas.priority) {
          return { ...item, isActive: !datas.isActive };
        }
        return item;
      }),
    );
  };

  const paymentMethodOrderTableColumns = paymentMethodOrderColumn(handleChange, onStatusChange);

  const paymentMethodOrderTableData = {
    columns: paymentMethodOrderTableColumns,
    setting: true,
  };

  const currencyTableColumns = currencyConfigurationColumn(handleCurrencyChange);

  const currencyTableData = {
    columns: currencyTableColumns,
    setting: true,
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    await SettingsService.getSettings()
      .then((response) => {
        console.log(response?.data);
        setPriorityConfigurationData(response?.data?.paymentMethodOrder?.sort((a, b) => a?.priority - b?.priority));
        setCurrencyConfigurationData(response?.data?.currency);
        setData(response.data);
        setDeposit(response?.data?.deposit);
        setWithdraw(response?.data?.withdraw);
        formRef.current.setFieldsValue({
          depositMinimumAmount: response?.data?.deposit?.min,
          depositMaximumAmount: response?.data?.deposit?.max,
          withdrawMinimumAmount: response?.data?.withdraw?.min,
          withdrawMaximumAmount: response?.data?.withdraw?.max,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        message.error(err.message);
      });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    // Convert the value to a number or keep it as a string if invalid
    const numericValue =
      !isNaN(parseFloat(value)) && isFinite(value) ? parseInt(value) : value;

    if (name === "depositMinimumAmount" || name === "depositMaximumAmount") {
      setDeposit((prev) => ({
        ...prev,
        [name === "depositMinimumAmount" ? "min" : "max"]: numericValue,
      }));
    } else if (
      name === "withdrawMinimumAmount" ||
      name === "withdrawMaximumAmount"
    ) {
      setWithdraw((prev) => ({
        ...prev,
        [name === "withdrawMinimumAmount" ? "min" : "max"]: numericValue,
      }));
    } else {
      setData({
        ...data,
        [name]: numericValue,
      });
    }
  };

  const validatePriority = () => {
    const priorities = priorityConfigurationData?.map((item) => item.priority);
    if (!priorities || priorities.length === 0) {
      message.error("No priorities found.");
      return false;
    }
    if (
      priorities.some(
        (item) =>
          typeof item !== "number" || item < 1 || !Number.isInteger(item),
      )
    ) {
      message.error("Invalid priority.");
      return false;
    }

    const uniquePriorities = new Set(priorities);
    if (priorities.length !== uniquePriorities.size) {
      message.error("Priority already exists.");
      return false;
    }

    return true;
  };

  const onFinish = async () => {
    let priorityExists = validatePriority();
    if (priorityExists) {
      setIsLoading(true);
      let params = {
        _id: data?._id,
        deposit,
        withdraw,
        depositDeclineCount: data?.depositDeclineCount,
        withdrawDeclineCount: data?.withdrawDeclineCount,
        depositAllowCount: data?.depositAllowCount,
        withdrawAllowCount: data?.withdrawAllowCount,
        maxWithdrawPossible: data?.maxWithdrawPossible,
        numberofDigits: data?.numberofDigits,
        type: data?.type,
        paymentMethodOrder: priorityConfigurationData.sort((a, b) => a?.paymentMethod.localeCompare(b?.paymentMethod)),
        currency: currencyConfigurationData
      };
      console.log(params);
      await SettingsService.editSettings(params)
        .then((response) => {
          setPriorityConfigurationData(response?.data?.paymentMethodOrder?.sort((a, b) => a?.priority - b?.priority));
          setCurrencyConfigurationData(response?.data?.currency);
          setData(response.data);
          setIsLoading(false);
          notify.openNotificationWithIcon(
            "success",
            "Success",
            "Your setting has been updated successfully.",
          );
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          message.error(err.message);
        });
    }
  };

  const onFinishTransactionPassword = async () => {
    let params = {
      _id: user?._id,
      transactionPassword,
    };
    await AuthService.editAdmin(params)
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          setIsLoading(false);
          notify.openNotificationWithIcon(
            "success",
            "Success",
            "Your transaction password has been successfully Updated",
          );
        } else {
          notify.openNotificationWithIcon("error", "Error", response.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        notify.openNotificationWithIcon("error", "Error", err);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Auxiliary>
        <Card title={title}>
          {data !== null && (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 900 }}
              initialValues={data}
              ref={formRef}
              onFinish={onFinish}
              autoComplete="off"
            >
              <div
                style={{
                  border: "solid lightGray 1px",
                  padding: "20px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    boxShadow:
                      "rgba(10, 10, 23, 1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    padding: "7px",
                    borderRadius: "5px",
                  }}
                >
                  User Configuration
                </span>
                <Form.Item
                  label="Deposit Allow Count"
                  name="depositAllowCount"
                  rules={[
                    {
                      required: data?.depositAllowCount === "",
                      message:
                        "Please enter deposit allow count only numerical characters",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder={"Enter Deposit Allow Count"}
                    value={data?.depositAllowCount}
                    name="depositAllowCount"
                    id="depositAllowCount"
                    min="0"
                    step="1"
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Withdraw Allow Count"
                  name="withdrawAllowCount"
                  rules={[
                    {
                      required: data?.withdrawAllowCount === "",
                      message:
                        "Please enter Withdraw allow count only numerical characters",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder={"Enter Withdraw Allow Count"}
                    value={data?.withdrawAllowCount}
                    name="withdrawAllowCount"
                    id="withdrawAllowCount"
                    min="0"
                    step="1"
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Max Withdraw Possible"
                  name="maxWithdrawPossible"
                  rules={[
                    {
                      required: data?.maxWithdrawPossible === "",
                      message:
                        "Please enter Max Withdraw Possible only numerical characters",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder={"e.g. 1000" + data?.maxWithdrawPossible}
                    value={data?.maxWithdrawPossible}
                    name="maxWithdrawPossible"
                    id="maxWithdrawPossible"
                    min="0"
                    step="1"
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <CustomFormItem
                  label="Deposit Decline Count"
                  name="depositDeclineCount"
                  value={data?.depositDeclineCount}
                  placeholder="Enter Deposit Decline Count"
                  onChange={handleInputChange}
                  type="number"
                  rules={[
                    {
                      required: data?.depositDeclineCount === "",
                      message:
                        "Please enter Deposit Decline Count only numerical characters",
                    },
                  ]}
                />
                <CustomFormItem
                  label="Withdraw Decline Count"
                  name="withdrawDeclineCount"
                  value={data?.withdrawDeclineCount}
                  placeholder="Enter Withdraw Decline Count"
                  onChange={handleInputChange}
                  type="number"
                  rules={[
                    {
                      required: data?.withdrawDeclineCount === "",
                      message:
                        "Please enter Withdraw Decline Count only numerical characters",
                    },
                  ]}
                />
                <div
                  style={{
                    border: "solid lightGray 1px",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      boxShadow:
                        "rgba(10, 10, 23, 1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                      padding: "7px",
                      borderRadius: "5px",
                    }}
                  >
                    Deposit
                  </span>
                  <CustomFormItem
                    label="Minimum Deposit Amount"
                    name="depositMinimumAmount"
                    value={deposit?.min}
                    placeholder="Enter Minimum Deposit Amount"
                    onChange={handleInputChange}
                    type="number"
                    rules={[
                      {
                        required: deposit?.min === "",
                        message:
                          "Please enter Minimum Deposit Amount only numerical characters",
                      },
                    ]}
                  />
                  <CustomFormItem
                    label="Maximum Deposit Amount"
                    name="depositMaximumAmount"
                    value={deposit?.max}
                    placeholder="Enter Maximum Deposit Amount"
                    onChange={handleInputChange}
                    type="number"
                    rules={[
                      {
                        required: deposit?.max === "",
                        message:
                          "Please enter Maximum Deposit Amount only numerical characters",
                      },
                    ]}
                  />
                </div>
                <div
                  style={{
                    border: "solid lightGray 1px",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      boxShadow:
                        "rgba(10, 10, 23, 1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                      padding: "7px",
                      borderRadius: "5px",
                    }}
                  >
                    Withdraw
                  </span>
                  <CustomFormItem
                    label="Minimum Withdraw Amount"
                    name="withdrawMinimumAmount"
                    value={withdraw?.min}
                    placeholder="Enter Minimum Withdraw Amount"
                    onChange={handleInputChange}
                    type="number"
                    rules={[
                      {
                        required: withdraw?.min === "",
                        message:
                          "Please enter Minimum Withdraw Amount only numerical characters",
                      },
                    ]}
                  />
                  <CustomFormItem
                    label="Maximum Withdraw Amount"
                    name="withdrawMaximumAmount"
                    value={withdraw?.max}
                    placeholder="Enter Maximum Withdraw Amount"
                    onChange={handleInputChange}
                    type="number"
                    rules={[
                      {
                        required: withdraw?.max === "",
                        message:
                          "Please enter Maximum Withdraw Amount only numerical characters",
                      },
                    ]}
                  />
                </div>
              </div>
              <div
                style={{
                  border: "solid lightGray 1px",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    boxShadow:
                      "rgba(10, 10, 23, 1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    padding: "7px",
                    borderRadius: "5px",
                  }}
                >
                  UTR ID Configuration
                </span>
                <Form.Item
                  style={{ marginTop: "15px" }}
                  label="Number of Digits"
                  name="numberofDigits"
                  rules={[
                    {
                      required: data?.numberofDigits === "",
                      message: "Please enter number of digits",
                    },
                    {
                      required: data?.numberofDigits !== "",
                      pattern: new RegExp(/^0*[1-9]\d*$/),
                      message: "Please enter number greater than 0",
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Enter Number of Digits"
                    value={data?.numberofDigits}
                    name="numberofDigits"
                    id="numberofDigits"
                    step="1"
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item
                  label="Type"
                  name="type"
                  required
                  rules={[
                    {
                      required: data?.type === "",
                      message: "Please Choose Type!",
                    },
                  ]}
                >
                  <Radio.Group
                    name="type"
                    onChange={handleInputChange}
                    value={data?.type}
                    id="type"
                  >
                    <Radio value="numeric">Numeric</Radio>
                    <Radio value="alphanumeric">Alpha-Numeric</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div
                style={{
                  border: "solid lightGray 1px",
                  padding: "20px",
                  borderRadius: "10px",
                  marginTop: "10px"
                }}
              >
                <span
                  style={{
                    boxShadow:
                      "rgba(10, 10, 23, 1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    padding: "7px",
                    borderRadius: "5px",
                  }}
                >
                  Currency Configuration
                </span>
                <Auxiliary>
                    <DefaultTable
                      dataSource={currencyConfigurationData}
                      data={currencyTableData}
                    />
                  </Auxiliary>
              </div>
              <div
                style={{
                  border: "solid lightGray 1px",
                  padding: "20px",
                  marginTop: "20px",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    boxShadow:
                      "rgba(10, 10, 23, 1) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
                    padding: "7px",
                    borderRadius: "5px",
                    marginBottom: "10px",
                  }}
                >
                  Payment Method Configuration
                </span>
                {!isLoading && (
                  <Auxiliary>
                    <DefaultTable
                      dataSource={priorityConfigurationData}
                      data={paymentMethodOrderTableData}
                    />
                  </Auxiliary>
                )}
              </div>
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                initialValues={data}
                onFinish={onFinishTransactionPassword}
                autoComplete="off"
                style={{marginTop: 20}}
              >
                <Form.Item
                  label="Transaction Password"
                  name="transactionPassword"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your transaction password",
                    },
                    {
                      validator: (_, value) => {
                        if (value && /\s/.test(value)) {
                          return Promise.reject(
                            "Transaction password cannot contain spaces",
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <div style={{ display: "flex" }}>
                    <Input.Password
                      value={transactionPassword}
                      type="password"
                      placeholder="Enter Transction Password"
                      name="transactionPassword"
                      onChange={handleInputTransactionPasswordChange}
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                    <Button
                      htmlType="submit"
                      type="primary"
                      style={{
                        margin: "0 -50px 0 16px",
                      }}
                      icon={<CheckSquareFilled />}
                    />
                  </div>
                </Form.Item>
              </Form>
              {tabPermission && tabPermission?.edit && (
                <Form.Item
                  wrapperCol={{ offset: 8, span: 16 }}
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginRight: "70px",
                    marginTop: "10px",
                  }}
                >
                  <Button loading={isLoading} type="primary" htmlType="submit">
                    {"Save"}
                  </Button>
                </Form.Item>
              )}

              {loader ? (
                <div className="gx-loader-view">
                  <CircularProgress />
                </div>
              ) : null}
              {showMessage ? message.error(alertMessage.toString()) : null}
            </Form>
          )}
        </Card>
      </Auxiliary>
    </>
  );
};
export default withRouter(Settings);
