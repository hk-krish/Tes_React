import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Select, Switch, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "../CircularProgress";
import { CustomFormItem } from "../InputControl/InputForm";
import { validationRules } from "../../util/ValidationRules";

const { Option } = Select;

const WebsiteForm = (props) => {
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const formRef = useRef();
  const [data, setData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    url: "",
    maxDepositTime: 0,
    maxWithdrawTime: 0,
    settings: {
      maxDepositTime: 0,
      maxWithdrawTime: 0,
      isPaymentToWebAcc: false,
      isWithdrawVerifyBalance: false,
      isPaymentToWithWebAcc: false,
      isUPIPaymentSSUpload: false,
      depositMinAmount: 1,
      depositMaxAmount: 100000,
      withdrawMinAmount: 1,
      withdrawMaxAmount: 100000,
      withdrawFlowType: "tier1",
      isPgEnableForWithdraw: false,
      requireQrForLargeDeposits: false,
      showUpiApps: true,
      depositUpiFlowType: "tier1",
      isLiveUserReq: false,
      paymentTypeOptions: {
        upi: true,
        bank: true,
        crypto: true,
        "digital rupee": true,
      },
      redirection: {
        depositSuccessUrl: "",
        depositDeclineUrl: "",
        withdrawSuccessUrl: "",
        withdrawDeclineUrl: "",
      },
      isCryptoAutoVerification: false,
    },
    userId: "",
    password: "",
    transactionPassword: "",
    backendUrl: "",
    tesDepositCommission: "0",
    tesWithdrawCommission: "0",
    liveUserReqDepositCommission: "0",
    liveUserReqWithdrawCommission: "0",
    currency: "INR",
  });
  const [ipArray, setIpArray] = useState([""]);
  const [status, setStatus] = useState(false);
  const [isPgEnableForWithdraw, setIsPgEnableForWithdraw] = useState(false);
  const [isPgEnableForDeposit, setIsPgEnableForDeposit] = useState(false);
  const [requireQrForLargeDeposits, setRequireQrForLargeDeposits] =
    useState(false);
  const [isPaymentToWithWebAcc, setIsPaymentToWithWebAcc] = useState(false);
  const [isWithdrawVerifyBalance, setIsWithdrawVerifyBalance] = useState(false);
  const [showUpiApps, setShowUpiApps] = useState(true);
  const [isLiveUserRequest, setIsLiveUserRequest] = useState(false);
  const [isIpValidate, setIsIpValidate] = useState(false);
  const [isUpiPaymentSSUpload, setIsUpiPaymentSSUpload] = useState(false);

  const onSubmit = async () => {
    let updateData = {
      _id: data?._id,
      name: data?.name,
      url: data?.url,
      settings: data?.settings,
      agentId: data?.agentId,
      ip: ipArray,
      userId: data?.userId,
      password: data?.password,
      transactionPassword: data?.transactionPassword,
      backendUrl: data?.backendUrl,
      tesDepositCommission: data?.tesDepositCommission,
      tesWithdrawCommission: data?.tesWithdrawCommission,
      liveUserReqDepositCommission: data?.liveUserReqDepositCommission,
      liveUserReqWithdrawCommission: data?.liveUserReqWithdrawCommission,
      currency: data?.currency,
    };
    if (props?.props?.location?.state?.id[0]) {
      delete updateData?.agentId;
      updateData["ip"] = { _id: data?.ip?._id, ip: ipArray };
      updateData.settings.isPaymentToWebAcc = status;
      updateData.settings.isPaymentToWithWebAcc = isPaymentToWithWebAcc;
      updateData.settings.withdrawFlowType = isPgEnableForWithdraw
        ? "tier1"
        : "tier2";
      updateData.settings.isWithdrawVerifyBalance = isWithdrawVerifyBalance;
      updateData.settings.withdrawFlowType = isPgEnableForWithdraw
        ? "tier1"
        : "tier2";
      updateData.settings.isPgEnableForWithdraw = isPgEnableForWithdraw;
      updateData.settings.requireQrForLargeDeposits = requireQrForLargeDeposits;
      updateData.settings.showUpiApps = showUpiApps;
      updateData.settings.isIpValidate = isIpValidate;
      updateData.settings.isLiveUserReq = isLiveUserRequest;
      updateData.settings.isUpiPaymentSSUpload = isUpiPaymentSSUpload;
    }
    console.log("updateData-----", updateData);
    props.onFinish(updateData, "websiteForm");
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "maxWithdrawTime" || name === "maxDepositTime") {
      setData({
        ...data,
        settings: { ...data?.settings, [name]: parseInt(value) * 1000 },
      });
    } else if (name === "depositMinAmount" || name === "depositMaxAmount") {
      setData({
        ...data,
        settings: { ...data?.settings, [name]: parseInt(value) },
      });
    } else if (name === "withdrawMinAmount" || name === "withdrawMaxAmount") {
      setData({
        ...data,
        settings: { ...data?.settings, [name]: parseInt(value) },
      });
    } else if (
      name === "depositSuccessUrl" ||
      name === "depositDeclineUrl" ||
      name === "withdrawSuccessUrl" ||
      name === "withdrawDeclineUrl"
    ) {
      setData({
        ...data,
        settings: {
          ...data?.settings,
          redirection: { ...data?.settings?.redirection, [name]: value },
        },
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const fetchData = (responseData) => {
    if (window.location?.pathname === "/websites/editwebsite") {
      setStatus(responseData?.settings?.isPaymentToWebAcc);
      setIsWithdrawVerifyBalance(
        responseData?.settings?.isWithdrawVerifyBalance,
      );
      setIsPaymentToWithWebAcc(responseData?.settings?.isPaymentToWithWebAcc);
      setIsPgEnableForWithdraw(responseData?.settings?.isPgEnableForWithdraw);
      setIsPgEnableForDeposit(responseData?.settings?.isPgEnableForDeposit);
      setRequireQrForLargeDeposits(
        responseData?.settings?.requireQrForLargeDeposits,
      );
      setIsIpValidate(responseData?.settings?.isIpValidate);
      setShowUpiApps(responseData?.settings?.showUpiApps);
      setIsUpiPaymentSSUpload(responseData?.settings?.isUpiPaymentSSUpload);
      setIsLiveUserRequest(responseData?.settings?.isLiveUserReq);
      formRef?.current?.setFieldsValue({
        name: responseData?.name,
        url: responseData?.url,
        maxDepositTime: responseData?.settings?.maxDepositTime / 1000,
        maxWithdrawTime: responseData?.settings?.maxWithdrawTime / 1000,
        depositMinAmount: responseData?.settings?.depositMinAmount,
        depositMaxAmount: responseData?.settings?.depositMaxAmount,
        withdrawMinAmount: responseData?.settings?.withdrawMinAmount,
        withdrawMaxAmount: responseData?.settings?.withdrawMaxAmount,
        isPaymentToWebAcc: responseData?.settings?.isPaymentToWebAcc,
        isWithdrawVerifyBalance:
          responseData?.settings?.isWithdrawVerifyBalance,
        isPaymentToWithWebAcc: responseData?.settings?.isPaymentToWithWebAcc,
        agentId:
          props?.agentData?.filter(
            (agent) => agent._id === responseData?.agentId,
          )[0]?.name || "",
        userId: responseData.userId,
        password: responseData.password,
        transactionPassword: responseData?.transactionPassword,
        backendUrl: responseData.backendUrl,
        depositSuccessUrl:
          responseData.settings?.redirection?.depositSuccessUrl,
        depositDeclineUrl:
          responseData.settings?.redirection?.depositDeclineUrl,
        withdrawSuccessUrl:
          responseData.settings?.redirection?.withdrawSuccessUrl,
        withdrawDeclineUrl:
          responseData.settings?.redirection?.withdrawDeclineUrl,
        depositUpiFlowType: responseData?.settings?.depositUpiFlowType,
        withdrawFlowType: responseData?.settings?.isPgEnableForWithdraw
          ? "tier1"
          : "tier2",
        upi: responseData?.settings?.paymentTypeOptions?.upi,
        bank: responseData?.settings?.paymentTypeOptions?.bank,
        crypto: responseData?.settings?.paymentTypeOptions?.crypto,
        "digital rupee":
          responseData?.settings?.paymentTypeOptions?.["digital rupee"],
        tesDepositCommission: responseData?.tesDepositCommission,
        tesWithdrawCommission: responseData?.tesWithdrawCommission,
        liveUserReqDepositCommission:
          responseData?.liveUserReqDepositCommission,
        liveUserReqWithdrawCommission:
          responseData?.liveUserReqWithdrawCommission,
        currency: responseData?.currency,
      });

      setData(responseData);
      setIpArray(responseData?.ip?.ip);
    }
  };

  const handleChangeDepositRequest = (e) => {
    setData({
      ...data,
      settings: { ...data?.settings, depositUpiFlowType: e },
    });
  };

  const handleStatusChange = (e, from) => {
    if (from === "isPaymentToWithWebAcc") {
      setIsPaymentToWithWebAcc(e);
      setData({
        ...data,
        settings: { ...data?.settings, isPaymentToWithWebAcc: e },
      });
    }
    if (from === "isWithdrawVerifyBalance") {
      setIsWithdrawVerifyBalance(e);
      setData({
        ...data,
        settings: { ...data?.settings, isWithdrawVerifyBalance: e },
      });
    }
    if (from === "isPaymentToWebAcc") {
      setStatus(e);
      setData({
        ...data,
        settings: { ...data?.settings, isPaymentToWebAcc: e },
      });
    }
    if (from === "isPgEnableForWithdraw") {
      setIsPgEnableForWithdraw(e);
      setData({
        ...data,
        settings: {
          ...data?.settings,
          isPgEnableForWithdraw: e,
          withdrawFlowType: e === true ? "tier1" : "tier2",
        },
      });
    }
    if (from === "isPgEnableForDeposit") {
      setIsPgEnableForDeposit(e);
      setData({
        ...data,
        settings: { ...data?.settings, isPgEnableForDeposit: e },
      });
    }
    if (from === "requireQrForLargeDeposits") {
      setRequireQrForLargeDeposits(e);
      setData({
        ...data,
        settings: { ...data?.settings, requireQrForLargeDeposits: e },
      });
    }
    if (from === "showUpiApps") {
      setShowUpiApps(e);
      setData({
        ...data,
        settings: { ...data?.settings, showUpiApps: e },
      });
    }
    if (from === "isIpValidate") {
      setIsIpValidate(e);
      setData({
        ...data,
        settings: { ...data?.settings, isIpValidate: e },
      });
    }
    if (from === "isLiveUserReq") {
      setIsLiveUserRequest(e);
      setData({
        ...data,
        settings: { ...data?.settings, isLiveUserReq: e },
      });
    }
    if (from === "isCryptoAutoVerification") {
      setData({
        ...data,
        settings: { ...data?.settings, isCryptoAutoVerification: e },
      });
    }
    if (from === "isUpiPaymentSSUpload") {
      setIsUpiPaymentSSUpload(e);
      setData({
        ...data,
        settings: { ...data?.settings, isUpiPaymentSSUpload: e },
      });
    }
  };

  const handleChange = (e) => {
    setData({ ...data, agentId: e });
  };

  const onChangeIPInput = (e, index) => {
    let { value } = e.target;
    let newArray = ipArray;
    newArray[index] = value;
    setIpArray([...newArray]);
  };

  const switchItems = [
    { label: "Web Withdraw", name: "isPaymentToWithWebAcc" },
    { label: "Withdraw Verify Balance", name: "isWithdrawVerifyBalance" },
    { label: "Web Deposit", name: "isPaymentToWebAcc" },
    { label: "Payment Gateway for Withdraw", name: "isPgEnableForWithdraw" },
    { label: "Payment Gateway for Deposit", name: "isPgEnableForDeposit" },
    { label: "Show UPI Apps", name: "showUpiApps" },
    {
      label: "Show QR for payments over 2000",
      name: "requireQrForLargeDeposits",
    },
    { label: "Ip Validation", name: "isIpValidate" },
    {
      label: "P2P Transaction",
      name: "isLiveUserReq",
    },
    data?.settings?.paymentTypeOptions?.crypto && {
      label: "Auto Crypto Verification",
      name: "isCryptoAutoVerification",
    },
    {
      label: "UPI PaymentSS Upload",
      name: "isUpiPaymentSSUpload",
    },
  ].filter(Boolean);

  const renderSwitchItem = (item) => (
    <Form.Item key={item.name} label={item.label} name={item.name}>
      <Switch
        name={item.name}
        checked={data.settings[item.name]}
        onChange={(e) => handleStatusChange(e, item.name)}
      />
    </Form.Item>
  );

  const handlePaymentTypeChecked = (e) => {
    const { name, checked } = e.target;

    const isUncheckingCrypto = name === "crypto" && !checked;

    const updatedPaymentTypeOptions =
      name === "all"
        ? {
            upi: checked,
            bank: checked,
            crypto: checked,
            "digital rupee": checked,
          }
        : {
            ...data?.settings?.paymentTypeOptions,
            [name]: checked,
          };

    setData((prevData) => ({
      ...prevData,
      settings: {
        ...prevData?.settings,
        isCryptoAutoVerification: isUncheckingCrypto
          ? false
          : prevData?.settings?.isCryptoAutoVerification,
        paymentTypeOptions: updatedPaymentTypeOptions,
      },
    }));
  };

  const paymentTypeOption = [
    { label: "UPI", name: "upi" },
    { label: "Bank", name: "bank" },
    { label: "Crypto", name: "crypto" },
    { label: "Digital Rupee", name: "digital rupee" },
    { label: "All", name: "all" },
  ];

  const renderPaymentTypeCheckbox = (item) => {
    return (
      <Checkbox
        name={item.name}
        checked={
          item.name === "all"
            ? data?.settings?.paymentTypeOptions?.upi &&
              data?.settings?.paymentTypeOptions?.bank &&
              data?.settings?.paymentTypeOptions?.crypto &&
              data?.settings?.paymentTypeOptions?.["digital rupee"]
            : data?.settings?.paymentTypeOptions?.[item.name] || false
        }
        onChange={handlePaymentTypeChecked}
      >
        {item.label}
      </Checkbox>
    );
  };

  useEffect(() => {
    if (props?.responseData) {
      fetchData(props?.responseData);
    }
  }, [props?.responseData]);

  return (
    <>
      {!props?.dataLoad && (
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900 }}
          initialValues={{
            remember: true,
            depositMinAmount: data?.settings?.depositMinAmount || 1, // Set a default value if not available
            depositMaxAmount: data?.settings?.depositMaxAmount || 100000,
            withdrawMinAmount: data?.settings?.withdrawMinAmount || 1,
            withdrawMaxAmount: data?.settings?.withdrawMaxAmount || 100000,
            tesDepositCommission: data?.tesDepositCommission || 0,
            tesWithdrawCommission: data?.tesWithdrawCommission || 0,
            liveUserReqDepositCommission:
              data?.liveUserReqDepositCommission || 0,
            liveUserReqWithdrawCommission:
              data?.liveUserReqWithdrawCommission || 0,
            depositUpiFlowType:
              data?.settings?.depositUpiFlowType === "tier1"
                ? "Verify Submit"
                : "Direct Submit",
            withdrawFlowType:
              data?.settings?.withdrawFlowType === "tier2"
                ? "Direct Request"
                : "PG Request",
          }}
          onFinish={onSubmit}
          autoComplete="off"
          ref={formRef}
        >
          {props?.props?.location?.pathname !== "/websites/editwebsite" && (
            <Form.Item
              label="Select Agent"
              name="agentId"
              rules={[{ required: true, message: "Please select agent!" }]}
            >
              <Select
                placeholder="Select agent"
                onSelect={(e) => handleChange(e)}
                onDeselect={(e) => handleChange(e)}
                defaultValue={{ name: data?.type, value: data?.type }}
              >
                {props?.agentData?.map((data) => (
                  <Option value={data?._id} key={data?.name}>
                    {data?.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <CustomFormItem
            label="Website Name"
            name="name"
            value={data?.name}
            placeholder="Enter Website Name"
            onChange={handleInputChange}
            rules={validationRules.websiteName}
          />
          <CustomFormItem
            label="User Name"
            name="userId"
            value={data?.userId}
            placeholder="Enter Website User Name"
            onChange={handleInputChange}
            rules={validationRules.userName}
          />
          <CustomFormItem
            label="Password"
            name="password"
            value={data?.password}
            placeholder="Enter password"
            onChange={handleInputChange}
            type="password"
            rules={validationRules.userPassword}
          />
          <CustomFormItem
            label="Transaction Password"
            name="transactionPassword"
            value={data?.transactionPassword}
            placeholder="Enter Transaction password"
            onChange={handleInputChange}
            type="password"
            rules={validationRules.transactionPassword}
          />
          <CustomFormItem
            label="URL"
            name="url"
            value={data?.url}
            placeholder="Enter URL"
            onChange={handleInputChange}
            rules={validationRules.url}
          />
          <CustomFormItem
            label="Backend URL"
            name="backendUrl"
            value={data?.backendUrl}
            placeholder="Enter Backend URL"
            onChange={handleInputChange}
            rules={validationRules.backendUrl}
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
            rules={validationRules.maximumDepositTime}
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
            rules={validationRules.maximumWithdrawTime}
          />
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
              Deposit
            </span>
            <CustomFormItem
              label="Minimum Deposit Amount"
              name="depositMinAmount"
              value={data?.settings?.depositMinAmount}
              placeholder="Enter max withdraw time"
              onChange={handleInputChange}
              type="number"
              min="0"
              step="1"
              rules={[
                {
                  required: true,
                  message: "Please enter your minimum withdraw time!",
                },
                {
                  required: data?.settings?.depositMinAmount !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value &&
                      Number(value) > Number(getFieldValue("depositMaxAmount"))
                    ) {
                      return Promise.reject(
                        new Error(
                          "Minimum amount cannot be greater then Maximun amount",
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
            <CustomFormItem
              label="Maximum Deposit Amount"
              name="depositMaxAmount"
              value={data?.settings?.depositMaxAmount}
              placeholder="Enter Maximum deposit amount"
              onChange={handleInputChange}
              type="number"
              min="0"
              step="1"
              rules={[
                {
                  required: true,
                  message: "Please enter your maximum deposit amount!",
                },
                {
                  required: data?.settings?.depositMaxAmount !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value &&
                      Number(value) < Number(getFieldValue("depositMinAmount"))
                    ) {
                      return Promise.reject(
                        new Error(
                          "Maximum amount cannot be less than Minimum amount",
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </div>
          <div
            style={{
              border: "solid lightGray 1px",
              padding: "20px",
              borderRadius: "10px",
              margin: "20px 0px",
            }}
          >
            <span
              style={{
                margin: "10px 0px",
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
              name="withdrawMinAmount"
              value={data?.settings?.withdrawMinAmount}
              placeholder="Enter Minimum withdraw amount"
              onChange={handleInputChange}
              type="number"
              min="0"
              step="1"
              style={{ marginTop: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter your minimum withdraw Amount!",
                },
                {
                  required: data?.settings?.withdrawMinAmount !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value &&
                      Number(value) > Number(getFieldValue("withdrawMinAmount"))
                    ) {
                      return Promise.reject(
                        new Error(
                          "Minimum amount cannot be greater then Maximun amount",
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
            <CustomFormItem
              label="Maximum Withdraw Amount"
              name="withdrawMaxAmount"
              value={data?.settings?.withdrawMaxAmount}
              placeholder="Enter Maximum Withdraw amount"
              onChange={handleInputChange}
              type="number"
              min="0"
              step="1"
              rules={[
                {
                  required: true,
                  message: "Please enter your maximum Withdraw amount!",
                },
                {
                  required: data?.settings?.withdrawMaxAmount !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value &&
                      Number(value) < Number(getFieldValue("depositMinAmount"))
                    ) {
                      return Promise.reject(
                        new Error(
                          "Maximum amount cannot be less than Minimum amount",
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </div>
          <CustomFormItem
            label="Deposit Success URL"
            name="depositSuccessUrl"
            value={data?.settings?.redirection?.depositSuccessUrl}
            placeholder="Enter Deposit Success URL"
            onChange={handleInputChange}
            rules={validationRules.depositSuccessUrl}
          />
          <CustomFormItem
            label="Deposit Decline URL"
            name="depositDeclineUrl"
            value={data?.settings?.redirection?.depositDeclineUrl}
            placeholder="Enter Deposit Decline URL"
            onChange={handleInputChange}
            rules={validationRules.depositDeclineUrl}
          />
          <Form.Item
            label="Deposit Request Type"
            name="depositUpiFlowType"
            rules={[{ required: true }]}
          >
            <Select
              onSelect={(e) => handleChangeDepositRequest(e)}
              onDeselect={(e) => handleChangeDepositRequest(e)}
              name="depositUpiFlowType"
              value={data?.settings?.depositUpiFlowType}
            >
              <Option value={"tier1"} key={"tier1"}>
                Verify Submit
              </Option>
              <Option value={"tier2"} key={"tier2"}>
                Direct Submit
              </Option>
            </Select>
          </Form.Item>
          <CustomFormItem
            label="Withdraw Success URL"
            name="withdrawSuccessUrl"
            value={data?.settings?.redirection?.withdrawSuccessUrl}
            placeholder="Enter Withdraw Success URL"
            onChange={handleInputChange}
            rules={validationRules.withdrawSuccessUrl}
          />
          <CustomFormItem
            label="Withdraw Decline URL"
            name="withdrawDeclineUrl"
            value={data?.settings?.redirection?.withdrawDeclineUrl}
            placeholder="Enter Withdraw Decline URL"
            onChange={handleInputChange}
            rules={validationRules.withdrawDeclineUrl}
          />
          <CustomFormItem
            label="Deposit Exch Commission"
            name="liveUserReqDepositCommission"
            value={data?.liveUserReqDepositCommission}
            placeholder="Enter Deposit Exch Commission"
            onChange={handleInputChange}
            type="number"
            min={0}
            step="0.01"
            rules={validationRules.depositExchCommission}
          />
          <CustomFormItem
            label="Withdraw Exch Commission"
            name="liveUserReqWithdrawCommission"
            value={data?.liveUserReqWithdrawCommission}
            placeholder="Enter Withdraw Exch Commission"
            onChange={handleInputChange}
            type="number"
            min={0}
            step="0.01"
            rules={validationRules.withdrawExchCommission}
          />
          <CustomFormItem
            label="Deposit TES Commission"
            name="tesDepositCommission"
            value={data?.tesDepositCommission}
            placeholder="Enter Deposit TES Commission"
            onChange={handleInputChange}
            type="number"
            min={0}
            step="0.01"
            rules={validationRules.depositTESCommission}
          />
          <CustomFormItem
            label="Withdraw TES Commission"
            name="tesWithdrawCommission"
            value={data?.tesWithdrawCommission}
            placeholder="Enter Withdraw TES Commission"
            onChange={handleInputChange}
            type="number"
            min={0}
            step="0.01"
            rules={validationRules.withdrawTESCommission}
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
                      setIpArray([...ipArray?.filter((a, i) => i !== index)]);
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
                      right: index !== 0 ? "-90px" : "-50px",
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

          <Form.Item label="Select Request Type" style={{ marginTop: "10px" }}>
            {paymentTypeOption.map(renderPaymentTypeCheckbox)}
          </Form.Item>

          <Form.Item label="Currency" name="currency">
            <Select
              onSelect={(e) =>
                handleInputChange({ target: { name: "currency", value: e } })
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
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ marginLeft: "33%" }}
          >
            <Button loading={props?.isLoading} type="primary" htmlType="submit">
              {props?.props?.location?.state?.id[0] ? "Update" : "ADD"}
            </Button>
            <Button
              style={{ padding: "0 25px" }}
              type="primary"
              onClick={() => {
                props?.props?.history.goBack();
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
    </>
  );
};

export default WebsiteForm;
