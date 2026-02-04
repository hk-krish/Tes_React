import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";
import AgentService from "../../../../service/AgentService";
import OperatorService from "../../../../service/OperatorService";
import VendorService from "../../../../service/VendorService";
import WebsiteService from "../../../../service/WebsiteService";
import "./AddOperator.css";
import { CustomFormItem } from "../../../../components/InputControl/InputForm";

const { Option } = Select;

const compareArrays = (a, b) => {
  a = a.sort();
  b = b.sort();
  return JSON.stringify(a) === JSON.stringify(b);
};

const AddOperator = (props) => {
  console.log("props ==> ",props);
  
  const location = useLocation();
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const defaultOperatorAccess = {
    deposit: {
      read: false,
      action: false,
      amount: false,
      utr: false,
      accountType: false,
    },
    withdraw: {
      read: false,
      action: false,
    },
    reports: {
      deposit: false,
      withdraw: false,
      entity: false,
      website: false,
      pg: false,
    },
  };
  const title =
    props.location.pathname === "/operator/editoperator"
      ? "Edit Operator"
      : "Add Operator";
  const history = useHistory();
  const [form] = Form.useForm();
  const [status, setStatus] = useState(false);
  const [data, setData] = useState({
    name: "",
    password: "",
    userId: "",
    transactionPassword: "",
    entityUserType: "",
    entityId: "",
    accountIds: [],
    websiteIds: [],
    operatorCanFullFill: "",
    hasFullAccess: status,
    rollBackDeposit: false,
    account: {
      read: false,
    },
  });
  const localEntityId = localStorage.getItem("id");
  const [agentData, setAgentData] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [dataLoad, setDataLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [venodrLoading, setVendorLoading] = useState(false);
  const [loadindBankData, setLoadingBankData] = useState(false);
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState(null);
  const [bankAccountList, setBankAccountList] = useState(null);
  const [entityUserType, setEntityUserType] = useState(null);
  const [entityId, setEntityId] = useState(null);
  const [rollBackDeposit, setRollBackDeposit] = useState(false);
  const [account, setAccount] = useState(false);
  const [emptyAccountIds, setEmptyAccountIds] = useState(false);
  const [operatorAccess, setOperatorAccess] = useState(defaultOperatorAccess);
  const [isAllBank, setIsAllBank] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSelectdata();
    if (
      (localStorage.getItem("type") === "undefined" &&
        localStorage.getItem("id") === "undefined") ||
      location.state
    ) {
      return;
    } else {
      setData({
        ...data,
        entityUserType: localStorage.getItem("type"),
      });
    }
  }, []);

  useEffect(() => {
    fetchWebsiteData();
    if (props.location.pathname === "/operator/editoperator") {
      form.setFieldsValue({
        entityUserType: data.entityUserType,
      });
    }
    if ("id" in localStorage && localStorage.getItem("id") !== "undefined") {
      setEntityId(localEntityId);
    }
  }, [data.entityUserType, data?.entityId]);

  useEffect(() => {
    if (entityId) {
      fetchBankAccount(entityId, entityUserType);
      if (props.location.pathname === "/operator/editoperator") {
        form.setFieldsValue({
          accountIds: data.accountIds,
          websiteIds: data.websiteIds,
        });
      }
    }
  }, [entityId, entityUserType, props?.location?.state?.editData]);

  const fetchData = async () => {
    setDataLoad(true);
    if (props.location.pathname === "/operator/editoperator") {
      setDataLoad(true);
      const operatorData = props?.location?.state?.editData;
      console.log(operatorData, "operatorData");
      const accountData = props?.location?.state?.editData?.accounts;
      const websiteData = props?.location?.state?.editData?.websites;
      setStatus(operatorData?.hasFullAccess);
      setRollBackDeposit(operatorData?.rollBackDeposit);
      // setEntityId(agentData);
      setBankAccountList(accountData);
      setWebsiteData(websiteData);
      // setEntityUserType(operatorData?.entityUserType);
      fetchBankAccount(operatorData?.entityId, operatorData?.entityUserType);
      setAccount(operatorData?.account?.read);

      const canFullFill = operatorData?.operatorCanFullFill;
      form.setFieldsValue({
        name: operatorData?.name,
        userId: operatorData?.userId,
        password: operatorData?.password,
        transactionPassword: operatorData?.transactionPassword,
        entityUserType: operatorData?.entityUserType,
        entityId: operatorData?.entityId,
        accountIds: operatorData?.accountIds,
        websiteIds: operatorData?.websiteIds,
        hasFullAccess: operatorData?.hasFullAccess,
        operatorCanFullFill: canFullFill,
        rollBackDeposit: operatorData?.rollBackDeposit,
      });
      setEntityUserType(operatorData?.entityUserType);
      setOperatorAccess(operatorData?.operatorAccess);
      setData(operatorData);
    } else {
      setDataLoad(true);
    }
  };

  const fetchSelectdata = async () => {
    setAgentLoading(true);
    await AgentService.getAllAgent({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER, //10
    })
      .then((response) => {
        console.log("response.....", response);
        setAgentLoading(false);
        setAgentData(response.data?.agent_data);
      })
      .catch((err) => {
        console.log(err);
        setAgentLoading(false);
        message.error(err.message);
      });
    await VendorService.getAllVendor({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => {
        setVendorData(response.data?.vendor_data);
        setVendorLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setVendorLoading(false);
        message.error(err.message);
      });
  };

  const fetchWebsiteData = async () => {
    if (data.entityUserType === "agent") {
      const localStorageAgentId =
        localStorage.getItem("id") !== "undefined"
          ? localStorage.getItem("id")
          : null;
      setWebsiteLoading(true);
      await WebsiteService.getAllWebsite({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER, //20,
        agentIdFilter: localStorageAgentId || data?.entityId,
      })
        .then((response) => {
          let newResponseData = [];

          response.data?.website_data?.forEach((item, index) => {
            item.agentName = item?.agent?.name;
            newResponseData.push(item);
          });

          setWebsiteData(newResponseData);
          setWebsiteLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setWebsiteLoading(false);
          message.error(err.message);
        });
    }
  };

  const handleChange = (e) => {
    setEntityUserType(e);
    setData({ ...data, entityUserType: e });
  };

  const handleSelectType = (e) => {
    if (data?.entityId) {
      if (data?.entityId !== e) {
        setEmptyAccountIds(true);
        form.setFieldsValue({
          accountIds: [],
          websiteIds: [],
        });
      }
    }
    setEntityId(e);
    setData({ ...data, entityId: e });
  };

  useEffect(() => {
    if (emptyAccountIds) {
      setData({ ...data, accountIds: [], websiteIds: [] });
      setEmptyAccountIds(false);
    }
  }, [emptyAccountIds]);

  const handleSelectBank = (selectedValue) => {
    // Check if the selected value is already in the array
    const isAlreadySelected = data.accountIds.includes(selectedValue);
    // If selected value is not in the array, add it; otherwise, remove it
    const updatedAccountIds = isAlreadySelected
      ? data.accountIds.filter((id) => id !== selectedValue)
      : [...data.accountIds, selectedValue];
    form.setFieldsValue({
      accountIds: updatedAccountIds,
    });
    setData({ ...data, accountIds: updatedAccountIds });
    setIsAllBank(
      compareArrays(
        updatedAccountIds,
        bankAccountList?.map((account) => account?._id),
      ),
    );
  };

  const handleSelectAllBank = (e) => {
    const newIsAllBank = !isAllBank;
    setIsAllBank(newIsAllBank);
    const allAccountIds = newIsAllBank
      ? bankAccountList?.map((account) => account?._id)
      : [];
    setData({
      ...data,
      accountIds: allAccountIds,
    });
    form.setFieldsValue({
      accountIds: allAccountIds,
    });
  };

  const handleSelectWebsite = (selectedValue) => {
    const isAlreadySelected = data.websiteIds.includes(selectedValue);

    // If selected value is not in the array, add it; otherwise, remove it
    const updatedAccountIds = isAlreadySelected
      ? data.websiteIds.filter((id) => id !== selectedValue)
      : [...data.websiteIds, selectedValue];

    setData({ ...data, websiteIds: updatedAccountIds });
  };

  const handleOptionChange = (option, key, value = undefined) => {
    setOperatorAccess((prevOption) => {
      const operatorAccess = {
        ...prevOption,
        [option]: {
          ...prevOption?.[option],
          [key]: value === undefined ? !prevOption?.[option]?.[key] : value,
        },
      };
      setData((prevData) => ({
        ...prevData,
        operatorAccess,
      }));
      return operatorAccess;
    });
  };

  const handleStatusChange = (e) => {
    const newStatus = !status;
    setStatus(newStatus);
    let fullOperatorAccess = { ...defaultOperatorAccess };
    if (newStatus) {
      _.forEach(fullOperatorAccess, (value, key) => {
        _.forEach(value, (option, index) => {
          fullOperatorAccess[key][index] = true;
        });
      });
    }
    setIsAllBank(true);
    setOperatorAccess(fullOperatorAccess);
    setAccount(true);
    setRollBackDeposit(true);
    if (e) {
      const allAccountIds = bankAccountList?.map((account) => account?._id);
      const allWebsiteIds = websiteData?.map((account) => account?._id);
      setData({
        ...data,
        accountIds: allAccountIds,
        websiteIds: allWebsiteIds,
        account: { read: true },
      });
      form.setFieldsValue({
        accountIds: allAccountIds,
        websiteIds: allWebsiteIds,
      });
    } else {
      setAccount(false);
      setRollBackDeposit(false);
      setIsAllBank(false);
      setData({
        ...data,
        account: { read: false },
      });
    }
  };

  const onFinish = async () => {
    setLoading(true);
    let fullOperatorAccess = { ...operatorAccess };
    _.forEach(fullOperatorAccess, (value, key) => {
      _.forEach(value, (option, index) => {
        if (
          entityUserType === "vendor" &&
          key === "reports" &&
          ["website", "pg"].includes(index)
        ) {
          fullOperatorAccess[key][index] = false;
        } else if (
          entityUserType === "agent" &&
          key === "reports" &&
          ["entity"].includes(index)
        ) {
          fullOperatorAccess[key][index] = false;
        }
      });
    });
    let operatorFullfill =
      operatorAccess.deposit.read && operatorAccess.withdraw.read
        ? "both"
        : operatorAccess.deposit.read
          ? "deposit"
          : operatorAccess.withdraw.read
            ? "withdraw"
            : null;
    let updateData = {
      _id: data?._id,
      name: data?.name,
      entityUserType: data?.entityUserType,
      userId: data?.userId.toLowerCase(),
      password: data?.password,
      transactionPassword: data?.transactionPassword,
      entityId: entityId || data?.entityId,
      accountIds: data?.accountIds,
      websiteIds: data?.websiteIds,
      hasFullAccess: status,
      rollBackDeposit: data?.rollBackDeposit,
      operatorAccess: fullOperatorAccess,
      operatorCanFullFill: operatorFullfill, // this key handle for socket please ask to BE devloper after remove this
      account: data?.account,
    };
    if (props.location.state?.id[0]) {
      await OperatorService.editOperator(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setLoading(false);
            history.push("/operator");
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          notify.openNotificationWithIcon("error", "Error", err.message);
          setLoading(false);
          console.log(err);
        });
    } else {
      delete updateData._id;
      await OperatorService.addOperator(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Add",
            );
            setLoading(false);
            history.push("/operator");
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setLoading(false);
            console.log(response.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const handleRollbackDeposit = (e) => {
    console.log(e, "e-->>>");
    setRollBackDeposit(e);
    setData({ ...data, rollBackDeposit: e });
  };

  const handleAccount = (e) => {
    setAccount(e);
    setData({ ...data, account: { read: e } });
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

  const fetchBankAccount = async (entityId, entityUserType) => {
    setLoadingBankData(true);
    if (data.entityUserType === "website" || entityUserType === "website") {
      await WebsiteService.getAccountByWebsiteId({
        websiteId: data.entityId ? data.entityId : entityId,
      })
        .then((response) => {
          setBankAccountList(response?.data?.response);
          setLoadingBankData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingBankData(false);
          message.error(err.message);
        });
    } else if (
      data.entityUserType === "vendor" ||
      entityUserType === "vendor"
    ) {
      await VendorService.getAccountByVendorId({
        vendorId: data.entityId ? data.entityId : entityId,
      })
        .then((response) => {
          setBankAccountList(response?.data?.response);
          setLoadingBankData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingBankData(false);
          message.error(err.message);
        });
    } else if (data.entityUserType === "agent" || entityUserType === "agent") {
      await AgentService.getAccountByAgentId({
        agentId: data.entityId ? data.entityId : entityId,
      })
        .then((response) => {
          setBankAccountList(response?.data?.response);
          setLoadingBankData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingBankData(false);
          message.error(err.message);
        });
    }
  };

  const permissionGroups = [
    {
      label: "Select Deposit Permission",
      key: "deposit",
      options: [
        { label: "Queue View", value: "read", disableOn: "action" },
        { label: "Queue Action", value: "action", dependent: "read" },
        { label: "Amount", value: "amount" },
        { label: "UTR", value: "utr" },
        { label: "Request Type", value: "accountType" },
      ],
    },
    {
      label: "Select Withdraw Permission",
      key: "withdraw",
      options: [
        { label: "Queue View", value: "read", disableOn: "action" },
        { label: "Queue Action", value: "action", dependent: "read" },
      ],
    },
    {
      label: "Select Report Permission",
      key: "reports",
      options: [
        { label: "Deposit", value: "deposit" },
        { label: "Withdraw", value: "withdraw" },
        { label: "Entity", value: "entity", condition: "vendor" },
        { label: "Website", value: "website", condition: "agent" },
        { label: "PG", value: "pg", condition: "agent" },
      ],
    },
  ];

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
              {title}
            </div>
          }
        >
          {dataLoad && (
            <div>
              {loadindBankData ||
                (loading && (
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
                ))}
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 900, position: "relative" }}
                initialValues={{ remember: true }}
                // ref={formRef}
                form={form}
                onFinish={onFinish}
                autoComplete="off"
              >
                <Form.Item
                  label="Select Type"
                  name="entityUserType"
                  rules={[
                    {
                      required: data?.entityUserType ? false : true,
                      message: "Please select Type!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Type (agent/vendor)"
                    onSelect={(e) => handleChange(e)}
                    onDeselect={(e) => handleChange(e)}
                    disabled={
                      window.location.pathname === "/operator/editoperator"
                    }
                    defaultValue={{
                      label: data?.entityUserType,
                      value: data?.entityUserType,
                    }}
                  >
                    <Option value={"vendor"} key={"Vendor"}>
                      Vendor
                    </Option>
                    <Option value={"agent"} key={"Agent"}>
                      Agent
                    </Option>
                  </Select>
                </Form.Item>

                {(data?.entityUserType ||
                  window.location.pathname === "/operator/editoperator") && (
                  <Form.Item
                    label={`Select ${data?.entityUserType}`}
                    name="entityId"
                    rules={[
                      {
                        required: data?.entityUserType ? false : true,
                        message: `Please select ${data?.entityUserType}!`,
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select"
                      onSelect={(e) => handleSelectType(e)}
                      onDeselect={(e) => handleSelectType(e)}
                      disabled={
                        window.location.pathname === "/operator/editoperator"
                      }
                      defaultValue={{
                        value: data?.entityId || localStorage.getItem("id"),
                        label:
                          data?.entityId ||
                          localStorage.getItem("name") === "undefined"
                            ? "Select"
                            : localStorage.getItem("name"),
                      }}
                    >
                      {data?.entityUserType === "agent"
                        ? agentData?.map((data) => (
                            <Select.Option value={data?._id} key={data?._id}>
                              {data?.name}
                            </Select.Option>
                          ))
                        : vendorData?.map((data) => (
                            <Select.Option value={data?._id} key={data?._id}>
                              {data?.name}
                            </Select.Option>
                          ))}
                    </Select>
                  </Form.Item>
                )}
                <Form.Item
                  label="Select Bank Account"
                  name="accountIds"
                  className="select-checkbox"
                  rules={[
                    status
                      ? {
                          required: false,
                        }
                      : {
                          required: true,
                          message: `Please select bank account!`,
                        },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Bank Account"
                    onSelect={(e) => handleSelectBank(e)}
                    onDeselect={(e) => handleSelectBank(e)}
                    value={data.accountIds}
                    disabled={status || data?.entityUserType === ""}
                    dropdownRender={(menu) =>
                      loadindBankData ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "8px",
                          }}
                        >
                          <Spin size="small" />
                        </div>
                      ) : (
                        menu
                      )
                    }
                  >
                    {bankAccountList?.map((data) => {
                      return (
                        <Select.Option value={data?._id} key={data?._id}>
                          {data?.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                  <Checkbox
                    name="operatorCanFullFill"
                    checked={isAllBank}
                    onChange={handleSelectAllBank}
                    disabled={status}
                  />
                </Form.Item>
                {data?.entityUserType === "agent" ? (
                  <Form.Item label={`Website`} name="websiteIds">
                    <Select
                      mode="multiple"
                      placeholder="Select Website Account"
                      onSelect={(e) => handleSelectWebsite(e)}
                      onDeselect={(e) => handleSelectWebsite(e)}
                      disabled={status || data?.entityUserType === ""}
                      dropdownRender={(menu) =>
                        websiteLoading ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: "8px",
                            }}
                          >
                            <Spin size="small" />
                          </div>
                        ) : (
                          menu
                        )
                      }
                    >
                      {websiteData?.map((data) => (
                        <Select.Option value={data?._id} key={data?._id}>
                          {data?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : null}
                <CustomFormItem
                  label="Operator Name"
                  name="name"
                  value={data?.name}
                  defaultValue={data?.name}
                  placeholder="Enter Operator name"
                  onChange={handleInputChange}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your operator name!",
                    },
                  ]}
                />
                <CustomFormItem
                  label="User Name"
                  name="userId"
                  value={data?.userId}
                  defaultValue={data?.userId}
                  placeholder="Enter operator User Name"
                  onChange={handleInputChange}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your operator User Name!",
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
                <Form.Item
                  label="Full Access"
                  name="hasFullAccess"
                  style={{ marginTop: "10px" }}
                >
                  <Switch
                    name="hasFullAccess"
                    checked={status}
                    onChange={(e) => handleStatusChange(e)}
                  />
                </Form.Item>
                {permissionGroups.map((group) => (
                  <Form.Item
                    key={group.key}
                    label={group.label}
                    style={{ marginTop: "10px" }}
                  >
                    {group.options.map((option) => {
                      // Conditional rendering based on entityUserType
                      if (
                        option.condition &&
                        option.condition !== entityUserType
                      ) {
                        return null;
                      }

                      return (
                        <Checkbox
                          key={option.value}
                          checked={operatorAccess?.[group.key]?.[option.value]}
                          onChange={() => {
                            handleOptionChange(group.key, option.value);
                            if (option.dependent) {
                              handleOptionChange(
                                group.key,
                                option.dependent,
                                true,
                              );
                            }
                          }}
                          disabled={
                            status ||
                            (option.disableOn &&
                              operatorAccess?.[group.key]?.[option.disableOn])
                          }
                        >
                          {option.label}
                        </Checkbox>
                      );
                    })}
                  </Form.Item>
                ))}

                <Form.Item
                  label="Deposit Rollback"
                  name="rollBackDeposit"
                  style={{ marginTop: "10px" }}
                >
                  <Switch
                    name="rollBackDeposit"
                    checked={rollBackDeposit}
                    onChange={(e) => handleRollbackDeposit(e, rollBackDeposit)}
                  />
                </Form.Item>

                <Form.Item
                  label="Account View"
                  name="account"
                  style={{ marginTop: "10px" }}
                >
                  <Switch
                    name="account"
                    checked={account}
                    onChange={(e) => handleAccount(e, account)}
                  />
                </Form.Item>

                <Form.Item
                  wrapperCol={{ offset: 8, span: 16 }}
                  style={{ marginLeft: "33%" }}
                >
                  <Button loading={loading} type="primary" htmlType="submit">
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
            </div>
          )}
        </Card>
      </Auxiliary>
    </>
  );
};

export default withRouter(AddOperator);
