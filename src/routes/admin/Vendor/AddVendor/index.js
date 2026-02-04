import {
  ArrowLeftOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Popover,
  Radio,
  Switch
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";
import { useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";
import { CustomFormItem } from "../../../../components/InputControl/InputForm";
import VendorService from "../../../../service/VendorService";
import {
  convertMillisToMinutes,
  convertMinutesToMillis,
} from "../../../../util/ConvertTime";

const AddVendor = (props) => {
  const title =
    props.location.pathname === "/vendor/editvendor"
      ? "Edit Vendor"
      : "Add Vendor";
  const [data, setData] = useState({
    name: "",
    phone: "",
    last_name: "",
    email: "",
    password: "",
    userId: "",
    transactionPassword: "",
    accountAllocation: "",
    rollBackDeposit: false,
    depositReqWaitingTime: 0,
    depositTag: "",
    accountPermission: {
      upi: false,
      bank: false,
      crypto: false,
      "digital rupee": false,
    },
    vendorAccess: {
      deposit: {
        amount: false,
        utr: false,
        accountType: false,
      },
    },
  });
  const [oldData, setOldData] = useState(null);
  const [dataLoad, setDataLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const [ipArray, setIpArray] = useState([""]);
  const [rollBackDeposit, setRollBackDeposit] = useState(false);
  const history = useHistory();
  const [currentDepositReqWaitingTime, setCurrentDepositReqWaitingTime] =
    useState(null);
  const formRef = useRef();
  const [color, setColor] = useState(""); // Default color

  const fetchData = async () => {
    if (props.location.pathname === "/vendor/editvendor") {
      await VendorService.getVendorById(props.location.state.id[0])
        .then((response) => {
          setDataLoad(true);
          setRollBackDeposit(response.data.rollBackDeposit);
          setColor(response.data.depositTagBgColorCode);
          console.log("response?.data----", response?.data);
          formRef.current.setFieldsValue({
            name: response?.data?.name,
            email: response?.data?.email,
            phone: response?.data?.phone,
            priority: response?.data?.priority,
            ip: response?.data?.ip,
            userId: response?.data?.userId,
            password: response?.data?.password,
            transactionPassword: response?.data?.transactionPassword,
            accountAllocation: response?.data?.accountAllocation,
            rollBackDeposit: response?.data?.rollBackDeposit,
            upi: response.data.accountPermission?.upi,
            bank: response.data.accountPermission?.bank,
            crypto: response.data.accountPermission?.crypto,
            "digital rupee": response.data.accountPermission?.["digital rupee"],
            depositReqWaitingTime: convertMillisToMinutes(
              response.data?.depositReqWaitingTime,
            ),
            amount: response.data.vendorAccess?.deposit?.amount,
            utr: response.data.vendorAccess?.deposit?.utr,
            depositTag: response.data.depositTag,
          });
          setIpArray(response?.data?.ip?.ip);
          setData(response.data);
          setOldData(response.data);
          setData({
            ...response.data,
            depositReqWaitingTime: convertMillisToMinutes(
              response.data?.depositReqWaitingTime,
            ),
          });
          setCurrentDepositReqWaitingTime(response.data?.depositReqWaitingTime);
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
      priority: data?.priority,
      phone: data?.phone,
      ip: ipArray,
      userId: data?.userId.toLowerCase(),
      password: data?.password,
      transactionPassword: data?.transactionPassword,
      accountAllocation: data?.accountAllocation,
      rollBackDeposit: data?.rollBackDeposit,
      accountPermission: data?.accountPermission,
      depositReqWaitingTime: convertMinutesToMillis(
        data?.depositReqWaitingTime,
      ),
      vendorAccess: data?.vendorAccess,
      depositTagBgColorCode: color,
      depositTag: data?.depositTag,
    };

    if (depositReqWaitingTimeMin === data?.depositReqWaitingTime) {
      delete updateData.depositReqWaitingTime;
    }

    if (props.location.state?.id[0]) {
      if (oldData?.priority != data?.priority) {
        updateData.priority = data?.priority;
      } else {
        delete updateData["priority"];
      }
      updateData["ip"] = { _id: data?.ip?._id, ip: ipArray };
      await VendorService.editVendor(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            history.push("/vendor");
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
      await VendorService.addVendor(updateData)
        .then((response) => {
          console.log("response------------->>>", response);
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Add",
            );
            setIsLoading(false);
            history.push("/vendor");
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

  const handleChangeComplete = (newColor) => {
    setColor(newColor.hex);
  };

  const onChangeIPInput = (e, index) => {
    let { value } = e.target;
    let newArray = ipArray;
    newArray[index] = value;
    setIpArray([...newArray]);
  };

  const handleStatusChange = (e) => {
    console.log(e, "e-->>>");
    setRollBackDeposit(e);
    setData({ ...data, rollBackDeposit: e });
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
        vendorAccess: {
          deposit: { ...data?.vendorAccess?.deposit, [name]: checked },
        },
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              Vendor
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
                label="Vendor Name"
                name="name"
                value={data?.name}
                defaultValue={data?.name}
                placeholder="Enter Vendor Name"
                onChange={handleInputChange}
                rules={[
                  { required: true, message: "Please enter your vendor name!" },
                ]}
              />
              <CustomFormItem
                label="User Name"
                name="userId"
                value={data?.userId}
                defaultValue={data?.userId}
                placeholder="Enter Vendor User Name"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter your Vendor User Name!",
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
                label="Priority Number"
                name="priority"
                value={data?.priority}
                placeholder="Enter priority number"
                onChange={handleInputChange}
                type="number"
                rules={[
                  {
                    required: true,
                    message: "Please enter your priority number",
                  },
                  {
                    required: data?.priority !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters!",
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
              <Form.Item label="Deposit Tag Color">
                <Popover
                  content={
                    <SketchPicker
                      color={color}
                      onChangeComplete={handleChangeComplete}
                    />
                  }
                  trigger="click"
                >
                  <Input
                    value={color}
                    readOnly
                    style={{
                      cursor: "pointer",
                      backgroundColor: color,
                      color: "#fff",
                    }}
                  />
                </Popover>
                <Button
                  type={"default"}
                  style={{
                    position: "absolute",
                    right: "-50px",
                  }}
                  title={"Remove"}
                  onClick={() => {
                    setColor("");
                  }}
                  icon={<CloseOutlined />}
                />
              </Form.Item>
              <CustomFormItem
                label="Deposit Tag code"
                name="depositTag"
                value={data?.depositTag}
                placeholder="Enter Deposit Tag Code"
                onChange={handleInputChange}
                style={{ textTransform: "uppercase" }}
              />
              <Form.Item
                label="Account Selection"
                name="accountAllocation"
                required
                rules={[
                  {
                    required: data?.accountAllocation === "",
                    message: "Please Choose Account Selection!",
                  },
                ]}
              >
                <Radio.Group
                  name="accountAllocation"
                  onChange={handleInputChange}
                  value={data?.accountAllocation}
                  id="accountAllocation"
                >
                  <Radio value="normal">Account Priority</Radio>
                  <Radio value="random">Random Selection</Radio>
                </Radio.Group>
              </Form.Item>

                  <Form.Item
                    label="Deposit Rollback"
                    name="rollBackDeposit"
                    style={{ marginTop: "10px" }}
                  >
                    <Switch
                      name="rollBackDeposit"
                      checked={rollBackDeposit}
                      onChange={(e) => handleStatusChange(e, rollBackDeposit)}
                    />
                  </Form.Item>

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
                          data?.accountPermission?.crypto) ||
                        false
                      }
                      onChange={handleCheckBoxChange}
                    >
                      ALL
                    </Checkbox>
                  </Form.Item>
                  <Form.Item
                    label="Select Deposit Permission"
                    style={{ marginTop: "10px" }}
                  >
                    <Checkbox
                      name="amount"
                      checked={data?.vendorAccess?.deposit?.amount || false}
                      onChange={handleCheckBoxChange}
                    >
                      Amount
                    </Checkbox>
                    <Checkbox
                      name="utr"
                      checked={data?.vendorAccess?.deposit?.utr || false}
                      onChange={handleCheckBoxChange}
                    >
                      UTR
                    </Checkbox>
                    <Checkbox
                      name="accountType"
                      checked={
                        data?.vendorAccess?.deposit?.accountType || false
                      }
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

export default withRouter(AddVendor);
