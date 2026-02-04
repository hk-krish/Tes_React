import { Button, Form, Input, message, Select, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import notify from "../../Notification";
import CircularProgress from "../../components/CircularProgress";
import AgentService from "../../service/AgentService";
import CryptoService from "../../service/CryptoService";
import VendorService from "../../service/VendorService";
import WebsiteService from "../../service/WebsiteService";
import { CustomFormItem } from "../InputControl/InputForm";

const { Option } = Select;

const BankAccountForm = (props) => {
  const [isUniqueTransactionStatus, setIsUniqueTransactionStatus] =
    useState(false);
  const [data, setData] = useState({
    type: "bank",
    setLimit: 0,
    upiId: "",
    upiUrl: "",
    name: "",
    priorityNumber: 1,
    accHolderName: "",
    bankName: "",
    ifsc: "",
    accountNum: "",
    maxlimit: 0,
    minlimit: 0,
    totalWithLimit: 0,
    minWithdrawLimit: 0,
    maxWithdrawLimit: 0,
    dailyTraCountLimit: 5000,
    usedTraCountLimit: 0,
    limitType: "noLimit",
    withdrawLimitType: "noLimit",
    depositReqMode: "manual",
    minimumSuccessfulTransactionCount: 0,
    minimumTotalTransactionAmount: 0,
    isUniqueTransaction: false,
    depositReqEatTime: "0",
    cryptoWalletCoin: "",
    cryptoWalletNetwork: "",
    cryptoWalletAddress: "",
    digitalRupeeWalletUrl: "",
    isRecommended: false,
    isUpiUrl: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const [status, setStatus] = useState(true);
  const [changeDepositLimit, setChangeDepositLimit] = useState(false);
  const [changeWithdrawLimit, setChangeWithdrawLimit] = useState(false);
  const [changeDailyTraCountLimit, setChangeDailyTraCountLimit] =
    useState(false);
  const [coinOptions, setCoinOptions] = useState([]);
  const [networkOptions, setNetworkOptions] = useState([]);
  const [coinsList, setCoinsList] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const history = useHistory();
  const formRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    if (props?.props?.location?.pathname === "/bank/editbank") {
      setStatus(props?.props?.location?.state?.editData?.isOn);
      setIsUniqueTransactionStatus(
        props?.props?.location?.state?.editData?.isUniqueTransaction,
      );
      const depositReqEatTime =
        props?.props?.location?.state?.editData?.depositReqEatTime?.replace(
          " min",
          "",
        ) || "0";
      formRef.current.setFieldsValue({
        ...props?.props?.location?.state?.editData,
        minlimit:
          props?.props?.location?.state?.editData.singleTransactionLimit?.min,
        maxlimit:
          props?.props?.location?.state?.editData.singleTransactionLimit?.max,
        minWithdrawLimit:
          props?.props?.location?.state?.editData.singleWithdrawTransactionLimit
            ?.min,
        maxWithdrawLimit:
          props?.props?.location?.state?.editData.singleWithdrawTransactionLimit
            ?.max,
        dailyTraCountLimit:
          props?.props?.location?.state?.editData.settings?.dailyTraCountLimit,
        depositReqEatTime: depositReqEatTime,
        cryptoWalletCoin:
          props?.props?.location?.state?.editData?.cryptoWalletCoin?._id,
        cryptoWalletNetwork:
          props?.props?.location?.state?.editData?.cryptoWalletNetwork?._id,
      });
      setData({
        ...props?.props?.location?.state?.editData,
        minlimit:
          props?.props?.location?.state?.editData.singleTransactionLimit?.min,
        maxlimit:
          props?.props?.location?.state?.editData.singleTransactionLimit?.max,
        minWithdrawLimit:
          props?.props?.location?.state?.editData.singleWithdrawTransactionLimit
            ?.min,
        maxWithdrawLimit:
          props?.props?.location?.state?.editData.singleWithdrawTransactionLimit
            ?.max,
        depositReqEatTime:
          props?.props?.location?.state?.editData?.depositReqEatTime,
        usedTraCountLimit:
          props?.props?.location?.state?.editData?.settings?.usedTraCountLimit,
      });
    }
  };
  const onFinish = async () => {
    setIsLoading(true);
    const formattedDepositReqEatTime =
      data.depositReqEatTime === "0" ? "0 min" : data.depositReqEatTime;
    let updateData;
    if (data.type === "upi") {
      updateData = {
        _id: data?._id,
        upiId: data?.upiId,
        upiUrl: data?.upiUrl,
        // "priorityNumber": data.priorityNumber,
        setLimit: data?.setLimit,
        name: data?.name,
        type: "upi",
        isOn: status,
        limitType: data?.limitType,
        withdrawLimitType: data?.withdrawLimitType,
        depositReqMode: data?.depositReqMode,
        singleTransactionLimit: {
          max: data?.maxlimit,
          min: data?.minlimit,
        },
        totalWithLimit: data?.totalWithLimit,
        singleWithdrawTransactionLimit: {
          max: data?.maxWithdrawLimit,
          min: data?.minWithdrawLimit,
        },
        settings: {
          dailyTraCountLimit: data?.dailyTraCountLimit,
          usedTraCountLimit: data?.usedTraCountLimit,
        },
        minimumSuccessfulTransactionCount:
          data?.minimumSuccessfulTransactionCount,
        minimumTotalTransactionAmount: data?.minimumTotalTransactionAmount,
        isUniqueTransaction: isUniqueTransactionStatus,
        depositReqEatTime: formattedDepositReqEatTime,
        isRecommended: data?.isRecommended,
        isUpiUrl: data?.isUpiUrl
      };
    } else if (data.type === "bank") {
      updateData = {
        _id: data?._id,
        bankName: data?.bankName,
        accHolderName: data?.accHolderName,
        name: data?.name,
        accountNum: String(data.accountNum),
        ifsc: data?.ifsc,
        // "isActive": true,
        // "priorityNumber": data.priorityNumber,
        setLimit: data?.setLimit,
        isOn: status,
        limitType: data?.limitType,
        withdrawLimitType: data?.withdrawLimitType,
        depositReqMode: data?.depositReqMode,
        type: "bank",
        singleTransactionLimit: {
          max: data?.maxlimit,
          min: data?.minlimit,
        },
        totalWithLimit: data?.totalWithLimit,
        singleWithdrawTransactionLimit: {
          max: data?.maxWithdrawLimit,
          min: data?.minWithdrawLimit,
        },
        settings: {
          dailyTraCountLimit: data?.dailyTraCountLimit,
          usedTraCountLimit: data?.usedTraCountLimit,
        },
        minimumSuccessfulTransactionCount:
          data?.minimumSuccessfulTransactionCount,
        minimumTotalTransactionAmount: data?.minimumTotalTransactionAmount,
        isUniqueTransaction: isUniqueTransactionStatus,
        depositReqEatTime: formattedDepositReqEatTime,
        isRecommended: data?.isRecommended,
      };
    } else if (data.type === "crypto") {
      updateData = {
        _id: data?._id,
        name: data?.name,
        cryptoWalletCoin: data?.cryptoWalletCoin._id || data?.cryptoWalletCoin,
        cryptoWalletNetwork:
          data?.cryptoWalletNetwork._id || data?.cryptoWalletNetwork,
        cryptoWalletAddress: data?.cryptoWalletAddress,
        isOn: status,
        type: "crypto",
        isUniqueTransaction: isUniqueTransactionStatus,
        singleTransactionLimit: {
          min: data?.minlimit,
          max: data?.maxlimit,
        },
        setLimit: data?.setLimit,
        limitType: data?.limitType,
      };
    } else if (data.type === "digital rupee") {
      updateData = {
        _id: data?._id,
        name: data?.name,
        digitalRupeeWalletUrl: data?.digitalRupeeWalletUrl,
        isOn: status,
        type: "digital rupee",
        settings: {
          dailyTraCountLimit: data?.dailyTraCountLimit,
          usedTraCountLimit: data?.usedTraCountLimit,
        },
        minimumSuccessfulTransactionCount:
          data?.minimumSuccessfulTransactionCount,
        minimumTotalTransactionAmount: data?.minimumTotalTransactionAmount,
        depositReqEatTime: formattedDepositReqEatTime,
        isUniqueTransaction: isUniqueTransactionStatus,
        singleTransactionLimit: {
          min: data?.minlimit,
          max: data?.maxlimit,
        },
        setLimit: data?.setLimit,
        limitType: data?.limitType,
        isRecommended: data?.isRecommended,
      };
    }
    updateData = {
      ...updateData,
      ...(["upi", "bank", "digital rupee"].includes(updateData.type) && {
        isOfflinePaymentMode: data?.isOfflinePaymentMode,
        optionalName: data?.optionalName
      })
    }
    if (props?.props?.location?.state?.id[0]) {
      updateData.isOn = status;
      if (
        props?.props?.location?.state?.editData?.priorityNumber !=
        data.priorityNumber
      ) {
        updateData.priorityNumber = data.priorityNumber;
      }
      if (changeDepositLimit) {
        updateData.setLimit = data.setLimit;
      }
      if (changeWithdrawLimit) {
        updateData.totalWithLimit = data.totalWithLimit;
      } else {
        delete updateData.totalWithLimit;
      }
      if (!changeDailyTraCountLimit) {
        delete updateData.settings;
      }

      if (props?.props?.location?.state.type === "agents") {
        await AgentService.editAccountById(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "Your Data has been successfully Updated",
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              history.goBack();
            } else {
              notify.openNotificationWithIcon(
                "error",
                "Error",
                response.message,
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              console.log(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setChangeDailyTraCountLimit(false);
          });
      } else if (props?.props?.location?.state.type === "vendor") {
        if (
          props?.props?.location?.state?.editData?.priorityNumber !=
          data.priorityNumber
        ) {
          updateData.priorityNumber = data.priorityNumber;
        }
        await VendorService.editVendorBankAccountById(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              history.goBack();
            } else {
              notify.openNotificationWithIcon(
                "error",
                "Error",
                response.message,
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              console.log(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setChangeDailyTraCountLimit(false);
          });
      } else {
        if (
          props?.props?.location?.state?.editData?.priorityNumber !=
          data.priorityNumber
        ) {
          updateData.priorityNumber = data.priorityNumber;
        }
        await WebsiteService.editWebsiteAccountById(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              history.goBack();
            } else {
              notify.openNotificationWithIcon(
                "error",
                "Error",
                response.message,
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              console.log(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setChangeDailyTraCountLimit(false);
          });
      }
      setChangeDepositLimit(false);
      setChangeWithdrawLimit(false);
    } else {
      delete updateData._id;
      let type = localStorage.getItem("type");
      if (
        props?.props?.location?.state?.editData?.priorityNumber !=
        data.priorityNumber
      ) {
        updateData.priorityNumber = data.priorityNumber;
      }
      let id = localStorage.getItem("id");
      if (type === "agents") {
        updateData.agentId = id;
        await AgentService.addAccount(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              history.goBack();
            } else {
              notify.openNotificationWithIcon(
                "error",
                "Error",
                response.message,
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              console.log(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setChangeDailyTraCountLimit(false);
          });
      } else if (type === "vendor") {
        updateData.vendorId = id;
        await VendorService.addVendorBankAccountorUpi(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              history.goBack();
            } else {
              notify.openNotificationWithIcon(
                "error",
                "Error",
                response.message,
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              console.log(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setChangeDailyTraCountLimit(false);
          });
      } else {
        updateData.websiteId = id;
        await WebsiteService.addWebsiteAccount(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
              );
              setIsLoading(false);
              setChangeDailyTraCountLimit(false);
              history.goBack();
            } else {
              notify.openNotificationWithIcon(
                "error",
                "Error",
                response.message,
              );
              setIsLoading(false);
              console.log(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
            setChangeDailyTraCountLimit(false);
          });
      }
    }
  };

  useEffect(() => {
    if (data.type === "crypto") {
      getAllCoinDetails();
    }
  }, [data.type]);

  useEffect(() => {
    if (data.cryptoWalletCoin !== "" && data.type === "crypto") {
      getSelectedCoinNetworks();
    }
  }, [data.cryptoWalletCoin, data.type]);

  const getAllCoinDetails = async () => {
    const params = {
      limit: Number.MAX_SAFE_INTEGER,
      page: 1,
      activeFilter: true,
    };
    await CryptoService.getAllCoins(params).then((response) => {
      if (
        response?.data?.totalData[0]?.count ||
        response?.data?.coin_data.length
      ) {
        setCoinsList(response?.data?.coin_data);
        // const defaultSelectedCoin = coinsList.find((coin) => coin._id === data?.cryptoWalletCoin);
        // console.log("default Selected coin",data)
        const optionsList = response.data?.coin_data?.map((coin) => (
          <Option value={coin?._id} key={coin?._id}>
            {coin?.name}
          </Option>
        ));
        setCoinOptions(optionsList);
      }
    });
  };

  const getSelectedCoinNetworks = async () => {
    const params = {
      limit: Number.MAX_SAFE_INTEGER,
      page: 1,
      activeFilter: true,
      id:
        selectedCoin?._id ||
        data?.cryptoWalletCoin?._id ||
        data?.cryptoWalletCoin,
    };
    await CryptoService.getCoinNetworksById(params.id).then((response) => {
      const networkOptions = response?.data?.map((network) => (
        <Option value={network?._id} key={network?._id}>
          {network?.name}
        </Option>
      ));
      setNetworkOptions(networkOptions);
    });
  };
  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "maxWithdrawTime" || name === "maxDepositTime") {
      setData({
        ...data,
        settings: { ...data.settings, [name]: parseInt(value) },
      });
    } else if (name === "setLimit") {
      setChangeDepositLimit(true);
      setData({
        ...data,
        [name]: parseInt(value),
      });
    } else if (name === "totalWithLimit") {
      setChangeWithdrawLimit(true);
      setData({
        ...data,
        [name]: parseInt(value),
      });
    } else if (name === "accountNum") {
      setData({
        ...data,
        [name]: value.replace(/\D/g, ""),
      });
    } else if (name === "depositReqEatTime") {
      let newValue = value + " min";
      setData({
        ...data,
        depositReqEatTime: newValue,
      });
    } else if (name === "cryptoWalletAddress") {
      setData({
        ...data,
        cryptoWalletAddress: value,
      });
    } else {
      setData({
        ...data,
        [name]:
          !isNaN(parseFloat(value)) && isFinite(value)
            ? parseInt(value)
            : value,
      });
    }
  };

  const handleChange = (e) => {
    setData({ ...data, type: e });
  };
  const handleChangeLimit = (e) => {
    setData({ ...data, limitType: e });
  };
  const handleChangeWithdrawLimit = (e) => {
    setData({ ...data, withdrawLimitType: e });
  };
  const handleChangeDepositType = (e) => {
    setData({ ...data, depositReqMode: e });
  };
  const handleChangeCoin = (e) => {
    setData({ ...data, cryptoWalletCoin: e });
    const selectedCoin = coinsList.find((coin) => coin._id == e);
    setSelectedCoin(selectedCoin);
  };

  const handleChangeNetwork = (e) => {
    setData({ ...data, cryptoWalletNetwork: e });
    formRef.current.setFieldsValue({
      cryptoWalletNetwork: e,
    });
    setSelectedNetwork(e);
  };

  const handleDailyTraCountLimitChange = (e) => {
    let { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      dailyTraCountLimit: value,
    }));
    setChangeDailyTraCountLimit(true);
  };

  const customValidator = (rule, value, callback) => {
    console.log("value----", value);
    if (value && value < data.minlimit) {
      callback(
        "Please enter transaction maximum limit more than transaction minimum limit!",
      );
    } else {
      callback();
    }
  };

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 900 }}
        initialValues={data}
        ref={formRef}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
          <Select
            placeholder="Enter placeholder"
            onSelect={(e) => handleChange(e)}
            onDeselect={(e) => handleChange(e)}
            defaultValue={{ name: data?.type, value: data?.type }}
            disabled={
              props?.props?.location?.pathname === "/bank/editbank"
                ? true
                : false
            }
          >
            <Option value={"upi"} key={"UPI"}>
              UPI
            </Option>
            <Option value={"bank"} key={"Bank"}>
              Bank
            </Option>
            <Option value={"crypto"} key={"Crypto"}>
              Crypto
            </Option>
            <Option value={"digital rupee"} key={"digital rupee"}>
              DIGITAL RUPEE
            </Option>
          </Select>
        </Form.Item>
        <CustomFormItem
          label="Display Name"
          name="name"
          value={data?.name}
          placeholder="Enter Display name"
          onChange={handleInputChange}
          rules={[{ required: true, message: "Please enter your name!" }]}
        />
        {["upi", "bank", "digital rupee"].includes(data?.type) && (
          <CustomFormItem
            label="Optional Name"
            name="optionalName"
            value={data?.optionalName}
            placeholder="Enter Optional name"
            onChange={handleInputChange}
          />
        )}
        {data?.type == "crypto" && (
          <>
            <CustomFormItem
              label="Wallet Address"
              name="cryptoWalletAddress"
              value={data?.cryptoWalletAddress}
              placeholder="Enter Wallet Address"
              onChange={handleInputChange}
              rules={[
                {
                  required: true,
                  message: "Please enter your wallet address!",
                },
              ]}
            />
            <Form.Item
              label="Coin"
              name="cryptoWalletCoin"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Type of Coin"
                onSelect={(e) => handleChangeCoin(e)}
                onDeselect={(e) => handleChangeCoin(e)}
                defaultValue={{
                  name: "No Coin Selected",
                  value: "No Coin Selected",
                }}
              >
                {coinOptions}
              </Select>
            </Form.Item>

            {data.cryptoWalletCoin !== "" && (
              <Form.Item
                label="Network"
                name="cryptoWalletNetwork"
                rules={[{ required: true }]}
              >
                <Select
                  key={data?.cryptoWalletNetwork}
                  placeholder="Select Type of Coin Network"
                  onSelect={(e) => handleChangeNetwork(e)}
                  onDeselect={(e) => handleChangeNetwork(e)}
                >
                  {networkOptions}
                </Select>
              </Form.Item>
            )}
          </>
        )}

        {data.type === "upi" ? (
          <>
            <Form.Item label="is-UPI-Url" name="isUpiUrl">
              <Switch
                name="isUpiUrl"
                checked={data?.isUpiUrl}
                onChange={(e) =>
                  setData(prevData => ({
                    ...prevData,
                    isUpiUrl: e,
                  }))
                }
              />
            </Form.Item>
            {data?.isUpiUrl ? <CustomFormItem
              label="UPI URL"
              name="upiUrl"
              value={data?.upiUrl}
              placeholder="Enter your UPI URL"
              onChange={handleInputChange}
              rules={[
                {
                  required: true,
                  message: "Please enter your UPI URL!",
                },
              ]}
            /> : <CustomFormItem
              label="UPI ID"
              name="upiId"
              value={data?.upiId}
              placeholder="Enter your UPI ID"
              onChange={handleInputChange}
              rules={[
                {
                  required: true,
                  message: "Please enter your UPI ID!",
                },
              ]}
            />}
          </>
        ) : (
          data.type === "bank" && (
            <>
              <CustomFormItem
                label="Bank Name"
                name="bankName"
                value={data?.bankName}
                placeholder="Enter bank name"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter Bank Name!",
                  },
                ]}
              />
              <CustomFormItem
                label="Account Holder Name"
                name="accHolderName"
                value={data?.accHolderName}
                placeholder="Enter account holder name"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter your bank holder name!",
                  },
                ]}
              />
              <CustomFormItem
                className="remove-updown-arrow"
                label="Account Number"
                name="accountNum"
                value={data?.accountNum}
                placeholder="Enter account number"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter your bank account number!",
                  },
                  {
                    required: data?.accountNum !== "",
                    pattern: new RegExp(/^[a-zA-Z0-9]{9,18}$/),
                    message:
                      "Please enter minimum 9 and maximum 18 alphanumeric characters!",
                  },
                ]}
              />
              <CustomFormItem
                label="IFSC"
                name="ifsc"
                value={data?.ifsc}
                placeholder="Enter IFSC"
                onChange={handleInputChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter your bank IFSC code!",
                  },
                  {
                    required: data.ifsc !== "",
                    pattern: new RegExp(
                      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/i,
                    ),
                    message:
                      "IFSC code must have at least 4 alphanumeric characters!",
                  },
                ]}
              />
            </>
          )
        )}
        {data.type === "digital rupee" && (
          <>
            <CustomFormItem
              label="Wallet URL"
              name="digitalRupeeWalletUrl"
              value={data?.digitalRupeeWalletUrl}
              placeholder="Enter Digital Rupee Wallet URL"
              onChange={handleInputChange}
              rules={[
                {
                  required: true,
                  message: "Please enter your digital rupee wallet url",
                },
                {
                  required: data?.digitalRupeeWalletUrl !== "",
                  pattern: new RegExp(
                    /^DigitalRupee:\/\/pay\?(?=.*pa=[^&]+)(?=.*pn=[^&]+)(?=.*mode=[^&]+)(?=.*orgid=[^&]+)/,
                  ),
                  message: "Invalid Digital Rupee Wallet Url!",
                },
              ]}
            />
          </>
        )}
        <CustomFormItem
          label="Priority Number"
          name="priorityNumber"
          type="number"
          value={data?.priorityNumber}
          placeholder="Enter priority number"
          onChange={handleInputChange}
          min={1}
          rules={[
            {
              required: true,
              message: "Please enter your priority number",
            },
            {
              required: data?.priorityNumber !== "",
              pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
              message: "Please enter only numerical characters",
            },
          ]}
        />
        {data.type !== "crypto" && (
          <>
            {" "}
            {data.type !== "digital rupee" && (
              <Form.Item label="Deposit Type" name="depositReqMode">
                <Select
                  onSelect={(e) => handleChangeDepositType(e)}
                  onDeselect={(e) => handleChangeDepositType(e)}
                  name="depositReqMode"
                  value={data?.depositReqMode}
                >
                  <Option value={"manual"} key={"manual"}>
                    Manual
                  </Option>
                  <Option value={"auto"} key={"auto"}>
                    Auto
                  </Option>
                </Select>
              </Form.Item>
            )}
            <CustomFormItem
              label="Daily Transaction Count Limit"
              name="dailyTraCountLimit"
              type="number"
              value={data?.dailyTraCountLimit}
              placeholder="Enter Daily Transaction Count Limit"
              onChange={handleDailyTraCountLimitChange}
              min={1}
              rules={[
                {
                  required: true,
                  message: "Please enter your daily transaction limit",
                },
                {
                  required: data?.dailyTraCountLimit !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters",
                },
              ]}
            />
          </>
        )}
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
          <Form.Item
            label="Deposit Limit schedule"
            name="limitType"
            rules={[{ required: true }]}
          >
            <Select
              placeholder="Enter placeholder"
              onSelect={(e) => handleChangeLimit(e)}
              onDeselect={(e) => handleChangeLimit(e)}
              name="limitType"
              value={data?.limitType}
              // defaultValue={data?.limitType || "noLimit"}
            >
              <Option value={"daily"} key={"daily"}>
                Daily
              </Option>
              <Option value={"noLimit"} key={"noLimit"}>
                No Limit
              </Option>
            </Select>
          </Form.Item>
          <CustomFormItem
            label="Account Limit"
            name="setLimit"
            type="number"
            value={data?.setLimit}
            placeholder="Enter Account Limit"
            onChange={handleInputChange}
            min="0"
            step="1"
            rules={[
              {
                required: true,
                message: "Please enter your deposit limit",
              },
              {
                required: data?.setLimit !== "",
                pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                message: "Please enter only numerical characters",
              },
            ]}
          />
          <CustomFormItem
            label={
              data.type !== "crypto" ? "Minimum Amount" : "Minimum Amount (INR)"
            }
            name="minlimit"
            type="number"
            value={data?.minlimit}
            placeholder="Enter Minimum Amount"
            onChange={handleInputChange}
            min="0"
            step="1"
            rules={[
              {
                required: data?.minlimit === "",
                message: "Please enter your transaction minimum limit",
              },
              {
                required: data?.minlimit !== "",
                pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                message: "Please enter only numerical characters",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    data.type !== "crypto" &&
                    Number(value) > Number(getFieldValue("setLimit"))
                  ) {
                    return Promise.reject(
                      new Error("Minimum limit cannot exceed deposit limit"),
                    );
                  }
                  //   if (value && Number(value) > Number(getFieldValue('maxlimit'))) {
                  //     return Promise.reject(
                  //       new Error('Minimum limit cannot exceed maximum limit')
                  //     );
                  //   }
                  return Promise.resolve();
                },
              }),
            ]}
          />
          <CustomFormItem
            label={
              data.type !== "crypto" ? "Maximum Amount" : "Maximum Amount (INR)"
            }
            name="maxlimit"
            type="number"
            value={data?.maxlimit}
            placeholder="Enter Maximum Amount"
            onChange={handleInputChange}
            min="0"
            step="1"
            rules={[
              {
                required: true,
                message: "Please enter your transaction maximum limit",
              },
              {
                required: data?.maxlimit !== "",
                pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                message: "Please enter only numerical characters",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    Number(value) < Number(getFieldValue("minlimit"))
                  ) {
                    return Promise.reject(
                      new Error(
                        "Maximum limit cannot be less than minimum limit",
                      ),
                    );
                  }
                  if (
                    value &&
                    data.type !== "crypto" &&
                    Number(value) > Number(getFieldValue("setLimit"))
                  ) {
                    return Promise.reject(
                      new Error("Maximum limit cannot exceed deposit limit"),
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          />
          {data.type !== "crypto" && (
            <>
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
                    required: true,
                    message:
                      "Please enter your minimum successfull transactions count",
                  },
                  {
                    required: data?.minimumSuccessfulTransactionCount !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                  {
                    required: !(data?.minimumSuccessfulTransactionCount < 0),
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
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
                    required: true,
                    message:
                      "Please enter your minimum total transaction amount",
                  },
                  {
                    required: data?.minimumTotalTransactionAmount !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                  {
                    required: !(data?.minimumTotalTransactionAmount < 0),
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "The number should not be less than 0",
                  },
                ]}
              />
              <CustomFormItem
                label="Average time(min)"
                name="depositReqEatTime"
                type="number"
                value={data?.depositReqEatTime}
                placeholder="Enter Average Time(min)"
                onChange={handleInputChange}
                min="0"
                step="1"
                rules={[
                  {
                    required: data?.depositReqEatTime === "",
                    message: "Please enter your Average time",
                  },
                  {
                    required: data?.depositReqEatTime !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                ]}
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
        </div>

        {data?.type !== "crypto" && data?.type !== "digital rupee" && (
          <div
            style={{
              border: "solid lightgray 1px",
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
              }}
            >
              Withdraw
            </span>
            <Form.Item
              label="Withdraw Limit schedule"
              name="withdrawLimitType"
              rules={[{ required: true }]}
            >
              <Select
                onSelect={(e) => handleChangeWithdrawLimit(e)}
                onDeselect={(e) => handleChangeWithdrawLimit(e)}
                name="withdrawLimitType"
                defaultValue="Daily"
                value={data?.withdrawLimitType}
              >
                <Option value={"daily"} key={"daily"}>
                  Daily
                </Option>
                <Option value={"noLimit"} key={"noLimit"}>
                  No Limit
                </Option>
              </Select>
            </Form.Item>
            <CustomFormItem
              label="Account Limit"
              name="totalWithLimit"
              type="number"
              value={data?.totalWithLimit}
              placeholder="Enter Account Limit"
              onChange={handleInputChange}
              min="0"
              step="1"
              rules={[
                {
                  required: data?.totalWithLimit === "",
                  message: "Please enter your Withdraw limit",
                },
                {
                  required: data?.totalWithLimit !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters",
                },
              ]}
            />
            <CustomFormItem
              label="Minimum Amount"
              name="minWithdrawLimit"
              type="number"
              value={data?.minWithdrawLimit}
              placeholder="Enter Minimum Amount"
              onChange={handleInputChange}
              min="0"
              step="1"
              rules={[
                {
                  required: data?.minWithdrawLimit === "",
                  message: "Please enter your withdraw minimum limit",
                },
                {
                  required: data?.minWithdrawLimit !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value &&
                      Number(value) > Number(getFieldValue("totalWithLimit"))
                    ) {
                      return Promise.reject(
                        new Error("Minimum limit cannot exceed withdraw limit"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />

            <CustomFormItem
              label="Maximum Amount"
              name="maxWithdrawLimit"
              type="number"
              value={data?.maxWithdrawLimit}
              placeholder="Enter Maximum Amount"
              onChange={handleInputChange}
              min="0"
              step="1"
              rules={[
                {
                  required: data?.maxWithdrawLimit === "",
                  message: "Please enter your withdraw maximum limit",
                },
                {
                  required: data?.maxWithdrawLimit !== "",
                  pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                  message: "Please enter only numerical characters",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      value &&
                      Number(value) < Number(getFieldValue("minWithdrawLimit"))
                    ) {
                      return Promise.reject(
                        new Error(
                          "Maximum limit cannot be less than minimum limit",
                        ),
                      );
                    }
                    if (
                      value &&
                      Number(value) > Number(getFieldValue("totalWithLimit"))
                    ) {
                      return Promise.reject(
                        new Error("Maximum limit cannot exceed withdraw limit"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            />
          </div>
        )}
        <Form.Item label="is-Active" name="isOn" style={{ marginTop: "10px" }}>
          <Switch
            name="isOn"
            checked={status}
            onChange={() => setStatus(!status)}
          />
        </Form.Item>
        {data && data?.type !== "bank" && data?.type !== "crypto" && (
          <Form.Item label="Unique-transaction" name="isUniqueTransaction">
            <Switch
              name="isUniqueTransaction"
              checked={isUniqueTransactionStatus}
              onChange={() =>
                setIsUniqueTransactionStatus(!isUniqueTransactionStatus)
              }
            />
          </Form.Item>
        )}
        {["upi", "bank", "digital rupee"].includes(data?.type) && (
          <Form.Item label="Offline Payment" name="isOfflinePaymentMode" style={{ marginTop: "10px" }}>
            <Switch
              name="isOfflinePaymentMode"
              checked={data?.isOfflinePaymentMode}
              onChange={() => setData((prevData) => ({
                ...prevData,
                isOfflinePaymentMode: !data?.isOfflinePaymentMode
              }))}
            />
          </Form.Item>
        )}
        
        <Form.Item
          wrapperCol={{ offset: 8, span: 16 }}
          style={{ marginLeft: "33%" }}
        >
          <Button loading={isLoading} type="primary" htmlType="submit">
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
    </>
  );
};
export default BankAccountForm;
