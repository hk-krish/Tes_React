import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Switch,
  Tabs,
  message,
  Select,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";
import { CustomFormItem } from "../../../../components/InputControl/InputForm";
import AgentService from "../../../../service/AgentService";
import {
  convertMillisToMinutes,
  convertMinutesToMillis,
} from "../../../../util/ConvertTime";

const AddAgent = (props) => {
  const [rollBackDeposit, setRollBackDeposit] = useState(false);
  const [isManualOrder, setIsManualOrder] = useState(false);
  const title =
    props.location.pathname === "/agents/editagent"
      ? "Edit agent"
      : "Add agent";
  const [data, setData] = useState({
    name: "",
    phone: "",
    last_name: "",
    email: "",
    settings: {
      maxWithdrawTime: 0,
      maxDepositTime: 0,
    },
    maxWithdrawTime: 0,
    maxDepositTime: 0,
    password: "",
    transactionPassword: "",
    userId: "",
    rollBackDeposit: false,
    isManualOrder: false,
    accountPermission: {
      upi: false,
      bank: false,
      crypto: false,
      "digital rupee": false,
    },
    agentAccess: {
      deposit: {
        amount: false,
        utr: false,
        accountType: false,
      },
    },
    depositReqWaitingTime: 0,
    currency: "INR",
  });

  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const [ipArray, setIpArray] = useState([""]);
  const [dataLoad, setDataLoad] = useState(false);
  const history = useHistory();
  const formRef = useRef();
  const [currentDepositReqWaitingTime, setCurrentDepositReqWaitingTime] =
    useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const switchItems = [
    { label: "Deposit Rollback", name: "rollBackDeposit" },
    { label: "Manual Order Access", name: "isManualOrder" },
  ];

  const renderSwitchItem = (item) => (
    <Form.Item key={item.name} label={item.label} name={item.name}>
      <Switch
        name={item.name}
        checked={data[item.name]}
        onChange={(e) => handleStatusChange(e, item.name)}
      />
    </Form.Item>
  );

  const fetchData = async () => {
    if (props.location.pathname === "/agents/editagent") {
      await AgentService.getAgentById(props.location.state.id[0])
        .then((response) => {
          console.log(response, "edit---res");
          setDataLoad(true);
          setRollBackDeposit(response.data?.rollBackDeposit);
          setIsManualOrder(response.data?.isManualOrder);
          formRef.current.setFieldsValue({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            maxWithdrawTime: response.data.settings.maxWithdrawTime,
            maxDepositTime: response.data.settings.maxDepositTime,
            password: response.data.password,
            userId: response.data.userId,
            transactionPassword: response.data.transactionPassword,
            rollBackDeposit: response.data.rollBackDeposit,
            isManualOrder: response.data.isManualOrder,
            upi: response.data.accountPermission?.upi,
            bank: response.data.accountPermission?.bank,
            crypto: response.data.accountPermission?.crypto,
            "digital rupee": response.data.accountPermission?.["digital rupee"],
            currency: response.data.currency,
            amount: response.data.agentAccess?.deposit?.amount,
            utr: response.data.agentAccess?.deposit?.utr,
            depositReqWaitingTime: convertMillisToMinutes(
              response.data?.depositReqWaitingTime || 0,
            ),
          });
          setIpArray(response?.data?.ip?.ip);
          // setData(response.data);
          setCurrentDepositReqWaitingTime(response.data?.depositReqWaitingTime);
          setData({
            ...response.data,
            depositReqWaitingTime: convertMillisToMinutes(
              response.data?.depositReqWaitingTime,
            ),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setDataLoad(true);
    }
  };

  const onFinish = async () => {
    let depositReqWaitingTimeMin = convertMillisToMinutes(
      currentDepositReqWaitingTime,
    );

    setIsLoading(true);
    let updateData = {
      _id: data?._id,
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
      settings: data?.settings,
      ip: ipArray,
      password: data?.password,
      userId: data?.userId.toLowerCase(),
      transactionPassword: data?.transactionPassword,
      rollBackDeposit: rollBackDeposit,
      isManualOrder: isManualOrder,
      accountPermission: data?.accountPermission,
      agentAccess: data?.agentAccess,
      currency: data?.currency,
      depositReqWaitingTime: convertMinutesToMillis(
        data?.depositReqWaitingTime || 0,
      ),
    };

    if (props.location.state?.id[0]) {
      if (depositReqWaitingTimeMin === data?.depositReqWaitingTime) {
        delete updateData.depositReqWaitingTime;
      }
      updateData["ip"] = { _id: data?.ip?._id, ip: ipArray };
      await AgentService.editAgent(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            history.push("/agents");
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setIsLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          notify.openNotificationWithIcon("error", "Error", err.message);
          setIsLoading(false);
          console.log(err);
        });
    } else {
      delete updateData._id;
      await AgentService.addAgent(updateData)
        .then((response) => {
          console.log("response>>>", response);
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Add",
            );
            setIsLoading(false);
            history.push("/agents");
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setIsLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const onChangeIPInput = (e, index) => {
    let { value } = e.target;
    let newArray = ipArray;
    newArray[index] = value;
    setIpArray([...newArray]);
  };

  const handleStatusChange = (e, type) => {
    console.log(e, "e-->>>");
    if (type === "rollBackDeposit") {
      setRollBackDeposit(e);
      setData({ ...data, rollBackDeposit: e });
    } else if (type === "isManualOrder") {
      setIsManualOrder(e);
      setData({ ...data, isManualOrder: e });
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "maxWithdrawTime" || name === "maxDepositTime") {
      setData({
        ...data,
        settings: { ...data.settings, [name]: parseInt(value) },
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleCheckBoxChange = (e) => {
    let { name, checked } = e.target;
    if (name === "all") {
      setData({
        ...data,
        accountPermission: {
          upi: checked,
          bank: checked,
          crypto: checked,
          "digital rupee": checked,
        },
      });
    } else if (
      name === "upi" ||
      name === "bank" ||
      name === "crypto" ||
      name === "digital rupee"
    ) {
      setData({
        ...data,
        accountPermission: { ...data.accountPermission, [name]: checked },
      });
    } else {
      setData({
        ...data,
        agentAccess: {
          deposit: { ...data?.agentAccess?.deposit, [name]: checked },
        },
      });
    }
  };

  return (
    <>
      <Auxiliary>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                title={"Back"}
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => props.history.goBack()}
                style={{ marginBottom: 0, marginRight: "15px" }}
              />
              Agent
            </div>
          }
        >
          {dataLoad && (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 900 }}
              initialValues={{ remember: true }}
              ref={formRef}
              onFinish={onFinish}
              autoComplete="off"
            >
              <CustomFormItem
                label="Name"
                name="name"
                value={data?.name}
                defaultValue={data?.name}
                placeholder="Enter name"
                onChange={handleInputChange}
                rules={[{ required: true, message: "Please enter your name!" }]}
              />
              <CustomFormItem
                label="User Name"
                name="userId"
                value={data?.userId}
                defaultValue={data?.userId}
                placeholder="Enter Agent User Name"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter your agent user name!",
                  },
                ]}
              />
              <CustomFormItem
                label="Email"
                name="email"
                value={data?.email}
                defaultValue={data?.email}
                placeholder="Enter email"
                onChange={handleInputChange}
                rules={[
                  { required: true, message: "Please enter your email id!" },
                  {
                    required: data?.email !== "",
                    type: "email",
                    pattern: new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i),
                    message: "Please enter valid email id format!",
                  },
                ]}
              />
              <CustomFormItem
                label="Phone"
                name="phone"
                value={data?.phone}
                defaultValue={data?.phone}
                placeholder="Enter phone number"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter your phone number!",
                  },
                  {
                    required: data?.phone !== "",
                    pattern: new RegExp(/^[7-9]\d{9}$/i),
                    message:
                      "Please enter your valid phone number minimum 10 numerical characters!",
                  },
                ]}
              />
              <CustomFormItem
                label="Password"
                name="password"
                value={data?.password}
                placeholder="Enter password"
                onChange={handleInputChange}
                type="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long.",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+$/,
                    message:
                      "Password must include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.",
                  },
                ]}
              />
              <CustomFormItem
                label="Transaction Password"
                name="transactionPassword"
                value={data?.transactionPassword}
                placeholder="Enter Transaction password"
                onChange={handleInputChange}
                type="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your Transaction password!",
                  },
                ]}
              />
              <CustomFormItem
                label="Deposit Waiting Queue(min)"
                name="depositReqWaitingTime"
                value={data?.depositReqWaitingTime}
                placeholder="Enter Deposit Waiting Queue"
                onChange={handleInputChange}
                type="number"
                min="0"
                rules={[
                  {
                    required: true,
                    message: "Please enter deposit waiting queue(min)!",
                  },
                  {
                    validator: (_, value) => {
                      if (value < 0) {
                        return Promise.reject(
                          new Error("Negative values are not allowed!"),
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              />
              <CustomFormItem
                label="Maximum Deposit Time (in Seconds)"
                name="maxDepositTime"
                value={data?.settings?.maxDepositTime}
                placeholder="Enter max deposit time"
                onChange={handleInputChange}
                type="number"
                min="0"
                step="1"
                rules={[
                  {
                    required: true,
                    message: "Please enter maximum deposit time!",
                  },
                  {
                    required: data?.settings?.maxDepositTime != "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters!",
                  },
                ]}
              />
              <CustomFormItem
                label="Maximum Withdraw Time (in Seconds)"
                name="maxWithdrawTime"
                value={data?.settings?.maxWithdrawTime}
                placeholder="Enter max withdraw time"
                onChange={handleInputChange}
                type="number"
                min="0"
                step="1"
                rules={[
                  {
                    required: true,
                    message: "Please enter your maximum withdraw time!",
                  },
                  {
                    required: data?.settings?.maxWithdrawTime !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters!",
                  },
                ]}
              />
              {ipArray?.map((item, index) => {
                return (
                  <Form.Item
                    key={index}
                    label={"IP " + (index + 1)}
                    name={"ip" + (index + 1)}
                  >
                    <Input
                      type="text"
                      placeholder={"Enter IP " + (index + 1) + " address"}
                      defaultValue={item}
                      value={item}
                      name={"ip" + (index + 1)}
                      id={"ip" + (index + 1)}
                      onChange={(e) => onChangeIPInput(e, index)}
                    />
                    {index != 0 && (
                      <Button
                        onClick={() => {
                          setIpArray([
                            ...ipArray?.filter((a, i) => i != index),
                          ]);
                        }}
                        title={"Delete IP " + (index + 1)}
                        icon={<DeleteOutlined />}
                        style={{ position: "absolute", marginLeft: "10px" }}
                      ></Button>
                    )}
                    {ipArray?.length == index + 1 && (
                      <Button
                        type={"default"}
                        style={{
                          position: "absolute",
                          right: index != 0 ? "-90px" : "-50px",
                        }}
                        title={"Add New IP Address"}
                        onClick={() => {
                          setIpArray([...ipArray, ""]);
                        }}
                        icon={<PlusOutlined />}
                      ></Button>
                    )}
                  </Form.Item>
                );
              })}

                  {switchItems.map(renderSwitchItem)}

                  <Form.Item
                    label="Select Account Permission"
                    style={{ marginTop: "10px" }}
                  >
                    <Checkbox
                      name="upi"
                      checked={data?.accountPermission?.upi || false}
                      onChange={handleCheckBoxChange}
                    >
                      UPI
                    </Checkbox>
                    <Checkbox
                      name="bank"
                      checked={data?.accountPermission?.bank || false}
                      onChange={handleCheckBoxChange}
                    >
                      BANK
                    </Checkbox>
                    <Checkbox
                      name="crypto"
                      checked={data?.accountPermission?.crypto || false}
                      onChange={handleCheckBoxChange}
                    >
                      CRYPTO
                    </Checkbox>
                    <Checkbox
                      name="digital rupee"
                      checked={
                        data?.accountPermission?.["digital rupee"] || false
                      }
                      onChange={handleCheckBoxChange}
                    >
                      DIGITAL RUPEE
                    </Checkbox>
                    <Checkbox
                      name="all"
                      checked={
                        (data?.accountPermission?.upi &&
                          data?.accountPermission?.bank &&
                          data?.accountPermission?.crypto &&
                          data?.accountPermission?.["digital rupee"]) ||
                        false
                      }
                      onChange={handleCheckBoxChange}
                    >
                      ALL
                    </Checkbox>
                  </Form.Item>
                  <Form.Item label="Currency" name="currency">
                    <Select
                      onSelect={(e) =>
                        handleInputChange({
                          target: { name: "currency", value: e },
                        })
                      }
                      name="currency"
                      value={data?.currency}
                    >
                      <Select.Option value={"INR"} key={"INR"}>
                        INR
                      </Select.Option>
                      <Select.Option value={"BDT"} key={"BDT"}>
                        BDT
                      </Select.Option>
                      <Select.Option value={"PKR"} key={"PKR"}>
                        PKR
                      </Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Select Deposit Permission"
                    style={{ marginTop: "10px" }}
                  >
                    <Checkbox
                      name="amount"
                      checked={data?.agentAccess?.deposit?.amount || false}
                      onChange={handleCheckBoxChange}
                    >
                      Amount
                    </Checkbox>
                    <Checkbox
                      name="utr"
                      checked={data?.agentAccess?.deposit?.utr || false}
                      onChange={handleCheckBoxChange}
                    >
                      UTR
                    </Checkbox>
                    <Checkbox
                      name="accountType"
                      checked={data?.agentAccess?.deposit?.accountType || false}
                      onChange={handleCheckBoxChange}
                    >
                      Request Type
                    </Checkbox>
                  </Form.Item>

                  <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                    style={{ marginLeft: "33%" }}
                  >
                    <Button
                      loading={isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      {props.location.state?.id[0] ? "Update" : "ADD"}
                    </Button>
                    <Button
                      style={{ padding: "0 25px" }}
                      type="primary"
                      onClick={() => {
                        props.history.goBack();
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
        </Card>
      </Auxiliary>
    </>
  );
};

export default withRouter(AddAgent);
