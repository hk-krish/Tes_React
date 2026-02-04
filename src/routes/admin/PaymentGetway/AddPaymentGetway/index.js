import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Switch, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../../../Notification";
import { fetchActiveTransactionTypeTab } from "../../../../appRedux/actions/PaymentGateway";
import CircularProgress from "../../../../components/CircularProgress";
import { CustomFormItem } from "../../../../components/InputControl/InputForm";
import PaymentGetway from "../../../../service/PaymentService";
import I20pay from "./I20payComponent";
import Paycials from "./PaycialsComponent";
import TPPayIn from "./TPPayInComponent";
import Bigpayz from "./BigpayzComponent";
import Fasterypay from "./FasterpayComponent";
import DYPay from "./DYPayComponent";
import Fpay from "./FpayComponent";
import Payulink from "./PayulinkComponent";
import WebsiteService from "../../../../service/WebsiteService";
import Todaypay from "./TodaypayComponent";
import Zingpay from "./ZingpayComponent";
import Nippy from "./NippyComponent";
import Ezpay from "./EzpayComponent";
import Pradhee from "./PradheeComponent";

const { Option } = Select;

const AddPaymentGetway = (props) => {
  const title =
    props.location.pathname === "/payment-gateway/editpaymentgetway"
      ? "Edit Payment Gateway"
      : "Add Payment Gateway";
  const transactionType = props?.location?.state?.transactionType;
  const formRef = useRef();
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const [data, setData] = useState({
    name: "",
    paymentType: "",
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
  });
  const [isBlock, setIsBlock] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [wizPayKeys, setWizPayKeys] = useState({
    hashKey: "",
    mobileNumber: "",
    wizPayName: "",
    secretKey: "",
  });
  const [paycialsKeys, setPaycialsKeys] = useState({
    clientId: "",
    mobileNumber: "",
  });
  const [tpPayInKeys, setTPPayInKeys] = useState({
    clientId: "",
    apiKey: "",
    salt: "",
    totalDays: 0,
  });
  const [bigpayzKeys, setBigpayzKeys] = useState({
    apiUrl: "",
    merchantId: "",
    apiKey: "",
    paymentOptions: {
      qr: false,
      bank: false
    }
  })
  const [fasterpayKeys, setFasterpayKeys] = useState({
    accountId: "",
    accountKey: "",
    walletCode: "",
  });
  const [dypayKeys, setDYPayKeys] = useState({
    merchantNo: "",
    merchantSecretKey: "",
  });
  const [fpayKeys, setFPayKeys] = useState({
    apiKey: "",
    // authKey: "",
    secretKey: "",
    userName: "",
  });
  const [websiteList, setWebsiteList] = useState([]);
  const [payulinkKeys, setPayulinkKeys] = useState([]);
  const [todaypayKeys, setTodaypayKeys] = useState({
    merchantId: "",
    merchantSecretKey: "",
  });
  const [zingpayKeys, setZingpayKeys] = useState({
    apiKey: "",
    appSecretKey: "",
    appSignatureKey: ""
  });
  const [nippyKeys, setNippyKeys] = useState({
    merchantId: "",
    authToken: ""
  });
  const [ezpayKeys, setEzpayKeys] = useState({
    merchantCode: "",
    merchantKey: ""
  });
  const [pradheeKeys, setPradheeKeys] = useState({
    apiKey: "",
    clientId: "",
    salt: "",
    ...(transactionType === "withdraw" && {
      paymentMode: ""
    })
  });

  const excludedKeys = [
    "name",
    "priority",
    "paymentType",
    "isActive",
    "depositTransactionLimit",
    "transactionType",
    "withdrawTransactionLimit",
    "min",
    "max",
    "isBlock",
    "pgId",
    "modifiedBy",
    "createdBy",
    "createdAt",
    "updatedAt",
    "wizpay",
    "paycials",
    "bigpayz",
    "_id",
    "__v",
    "totalDays",
    "tpPayIn",
    "fasterpay",
    "dypay jazzcash",
    "dypay easypaisha",
    "fPay",
    "payulink",
    "todaypay jazzcash",
    "todaypay easypaisa",
    "zingpay",
    "nippy",
    "ezpay",
    "pradhee"
  ];
  const extraKey = [
    "name",
    "pgId",
    "isActive",
    "modifiedBy",
    "createdBy",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  const fetchData = async () => {
    if (props.location.pathname === "/payment-gateway/editpaymentgetway") {
      setDataLoad(true);
      await PaymentGetway.getPaymentGetwayById(props.location.state?.id[0])
        .then(async (response) => {
          console.log("response------>>>", response);
          setIsBlock(!response.data?.isBlock);
          setDataLoad(false);
          setData(response.data);
          let formattedData = {};
          if (response.data?.transactionType === "deposit") {
            formattedData = {
              name: response?.data?.name,
              priority: response?.data?.priority,
              paymentType: response?.data?.paymentType,
              isBlock: response?.data?.isBlock,
              min: response?.data?.depositTransactionLimit?.min,
              max: response?.data?.depositTransactionLimit?.max,
            };
          } else {
            formattedData = {
              name: response?.data?.name,
              priority: response?.data?.priority,
              paymentType: response?.data?.paymentType,
              isBlock: response?.data?.isBlock,
              min: response?.data?.withdrawTransactionLimit?.min,
              max: response?.data?.withdrawTransactionLimit?.max,
            };
          }
          formRef.current.setFieldsValue(formattedData);

          // Dynamically add other keys and their values to the formatted data
          Object.keys(response?.data).forEach((key) => {
            if (!formattedData.hasOwnProperty(key)) {
              formattedData[key] = response?.data[key];
            }
          });
          // Update the form with the formatted data
          formRef.current.setFieldsValue(formattedData);
          // For i20pay
          if (response?.data?.wizpay) {
            formRef.current.setFieldsValue({
              hashKey: response?.data?.wizpay?.hashKey,
              mobileNumber: response?.data?.wizpay?.mobileNumber,
              wizPayName: response?.data?.wizpay?.name,
              secretKey: response?.data?.wizpay?.secretKey,
            });
            setWizPayKeys({
              hashKey: response?.data?.wizpay?.hashKey,
              mobileNumber: response?.data?.wizpay?.mobileNumber,
              wizPayName: response?.data?.wizpay?.name,
              secretKey: response?.data?.wizpay?.secretKey,
            });
          }

          // For paycials
          if (response?.data?.paycials) {
            formRef.current.setFieldsValue({
              clientId: response?.data?.paycials?.clientId,
              mobileNumber: response?.data?.paycials?.mobileNumber,
              encryptionKey: response?.data?.paycials?.encryptionKey,
            });
            setPaycialsKeys({
              clientId: response?.data?.paycials?.clientId,
              mobileNumber: response?.data?.paycials?.mobileNumber,
              encryptionKey: response?.data?.paycials?.encryptionKey,
            });
          }

          if (response?.data?.tpPayIn) {
            formRef.current.setFieldsValue({
              clientId: response?.data?.tpPayIn?.clientId,
              apiKey: response?.data?.tpPayIn?.apiKey,
              salt: response?.data?.tpPayIn?.salt,
              totalDays: response?.data?.tpPayIn?.totalDays,
            });
            setTPPayInKeys({
              clientId: response?.data?.tpPayIn?.clientId,
              apiKey: response?.data?.tpPayIn?.apiKey,
              salt: response?.data?.tpPayIn?.salt,
              totalDays: response?.data?.tpPayIn?.totalDays,
            });
          }

          if (response?.data?.bigpayz) {
            formRef.current.setFieldsValue({
              apiUrl: response?.data?.bigpayz?.apiUrl,
              merchantId: response?.data?.bigpayz?.merchantId,
              apiKey: response?.data?.bigpayz?.apiKey,
              paymentOptions: response?.data?.bigpayz?.paymentOptions,
            });
            setBigpayzKeys({
              apiUrl: response?.data?.bigpayz?.apiUrl,
              merchantId: response?.data?.bigpayz?.merchantId,
              apiKey: response?.data?.bigpayz?.apiKey,
              paymentOptions: response?.data?.bigpayz?.paymentOptions,
            });
          }

          // For Fasterpay
          if (response?.data?.fasterpay) {
            formRef.current.setFieldsValue({
              accountId: response?.data?.fasterpay?.accountId,
              accountKey: response?.data?.fasterpay?.accountKey,
              walletCode: response?.data?.fasterpay?.walletCode,
            });
            setFasterpayKeys({
              accountId: response?.data?.fasterpay?.accountId,
              accountKey: response?.data?.fasterpay?.accountKey,
              walletCode: response?.data?.fasterpay?.walletCode,
            });
          }

          // For DYPay
          if (
            response?.data?.["dypay jazzcash"] ||
            response?.data?.["dypay easypaisha"]
          ) {
            formRef.current.setFieldsValue({
              ...(response?.data?.["dypay easypaisha"] && {
                bankCode: response?.data?.[response?.data?.name]?.bankCode,
              }),
              merchantNo: response?.data?.[response?.data?.name]?.merchantNo,
              merchantSecretKey:
                response?.data?.[response?.data?.name]?.merchantSecretKey,
            });
            setDYPayKeys({
              ...(response?.data?.["dypay easypaisha"] && {
                bankCode: response?.data?.[response?.data?.name]?.bankCode,
              }),
              merchantNo: response?.data?.[response?.data?.name]?.merchantNo,
              merchantSecretKey:
                response?.data?.[response?.data?.name]?.merchantSecretKey,
            });
          }

          // For FPay
          if (response?.data?.fPay) {
            formRef.current.setFieldsValue({
              apiKey: response?.data?.fPay?.apiKey,
              // authKey: response?.data?.fPay?.authKey,
              secretKey: response?.data?.fPay?.secretKey,
              userName: response?.data?.fPay?.userName,
            });
            setFPayKeys({
              apiKey: response?.data?.fPay?.apiKey,
              // authKey: response?.data?.fPay?.authKey,
              secretKey: response?.data?.fPay?.secretKey,
              userName: response?.data?.fPay?.userName,
            });
          }

          // For Payulink
          if (response?.data?.payulink) {
            await WebsiteService.getAllWebsite({
              page: 1,
              limit: Number.MAX_SAFE_INTEGER, //100
            })
              .then((response) => {
                setWebsiteList(response.data?.website_data);
              })
              .catch((err) => {
                console.log(err);
                message.error(err.message);
              });

            response?.data?.payulink.forEach((item, index) => {
              formRef.current.setFieldsValue({
                [`websiteId${index}`]: item.websiteId,
                [`apiKey${index}`]: item.apiKey
              });
            })
            setPayulinkKeys(response?.data?.payulink);
          }

          // For Todaypay
          if (response?.data?.["todaypay jazzcash"] || response?.data?.["todaypay easypaisa"]) {
            formRef.current.setFieldsValue({
              merchantId: response?.data?.[response?.data?.name]?.merchantId,
              merchantSecretKey: response?.data?.[response?.data?.name]?.merchantSecretKey
            });
            setTodaypayKeys({
              merchantId: response?.data?.[response?.data?.name]?.merchantId,
              merchantSecretKey: response?.data?.[response?.data?.name]?.merchantSecretKey
            });
          }

          // For Zingpay
          if (response?.data?.zingpay) {
            formRef.current.setFieldsValue({
              apiKey: response?.data?.zingpay?.apiKey,
              appSecretKey: response?.data?.zingpay?.appSecretKey,
              appSignatureKey: response?.data?.zingpay?.appSignatureKey
            });
            setZingpayKeys({
              apiKey: response?.data?.zingpay?.apiKey,
              appSecretKey: response?.data?.zingpay?.appSecretKey,
              appSignatureKey: response?.data?.zingpay?.appSignatureKey
            });
          }

          // For Nippy
          if (response?.data?.nippy) {
            formRef.current.setFieldsValue({
              merchantId: response?.data?.nippy?.merchantId,
              authToken: response?.data?.nippy?.authToken,
            });
            setNippyKeys({
              merchantId: response?.data?.nippy?.merchantId,
              authToken: response?.data?.nippy?.authToken,
            });
          }

          // For Ezpay
          if (response?.data?.ezpay) {
            formRef.current.setFieldsValue({
              merchantCode: response?.data?.ezpay?.merchantCode,
              merchantKey: response?.data?.ezpay?.merchantKey,
            });
            setEzpayKeys({
              merchantCode: response?.data?.ezpay?.merchantCode,
              merchantKey: response?.data?.ezpay?.merchantKey,
            });
          }

          // For Pradhee
          if (response?.data?.pradhee) {
            formRef.current.setFieldsValue({
              apiKey: response?.data?.pradhee?.apiKey,
              clientId: response?.data?.pradhee?.clientId,
              salt: response?.data?.pradhee?.salt,
              ...(transactionType === "withdraw" && {
                paymentMode: response?.data?.pradhee?.paymentMode,
              })
            });
            setPradheeKeys({
              apiKey: response?.data?.pradhee?.apiKey,
              clientId: response?.data?.pradhee?.clientId,
              salt: response?.data?.pradhee?.salt,
              ...(transactionType === "withdraw" && {
                paymentMode: response?.data?.pradhee?.paymentMode,
              })
            });
          }

          // Dynamically set additional required fields and remove other fields
          const additionalFieldsArray = Object.keys(formattedData)
            .filter((key) => !excludedKeys.includes(key))
            .map((key) => (
              <Form.Item label={key} name={key} key={key}>
                <Input
                  type="text"
                  name={key}
                  placeholder={`Enter ${key}`}
                  onChange={(e) => handleInputChange(e)}
                />
              </Form.Item>
            ));

          setAdditionalFields(additionalFieldsArray);
        })
        .catch((err) => {
          setDataLoad(false);
          console.log(err);
        });
    }
  };

  const onFinish = async () => {
    setIsLoading(true);

    let updateData = {
      ...data,
      _id: data?._id,
      paymentType: data?.paymentType,
      priority: data?.priority,
      isBlock: data?.isBlock,
      ...(data?.name === "wizpay"
        ? {
            wizpay: {
              hashKey: wizPayKeys?.hashKey,
              mobileNumber: wizPayKeys?.mobileNumber,
              name: wizPayKeys?.wizpay,
              secretKey: wizPayKeys?.secretKey,
            },
          }
        : {}),
      ...(data?.name === "paycials"
        ? {
            paycials: {
              clientId: paycialsKeys?.clientId,
              mobileNumber: paycialsKeys?.mobileNumber,
              encryptionKey: paycialsKeys?.encryptionKey,
            },
          }
        : {}),
      ...(data?.name === "tp payin"
        ? {
            tpPayIn: {
              clientId: tpPayInKeys?.clientId,
              apiKey: tpPayInKeys?.apiKey,
              salt: tpPayInKeys?.salt,
              totalDays: tpPayInKeys?.totalDays,
            },
          }
        : {}),
      ...(data?.name === "bigpayz"
        ? {
          bigpayz: {
              apiUrl: bigpayzKeys?.apiUrl,
              merchantId: bigpayzKeys?.merchantId,
              apiKey: bigpayzKeys?.apiKey,
              paymentOptions: bigpayzKeys?.paymentOptions,
            },
          }
        : {}),
      ...(data?.name === "fasterpay"
        ? {
            fasterpay: {
              accountId: fasterpayKeys?.accountId,
              accountKey: fasterpayKeys?.accountKey,
              walletCode: fasterpayKeys?.walletCode,
            },
          }
        : {}),
      ...(data?.name === "dypay jazzcash" || data?.name === "dypay easypaisha"
        ? {
            [data?.name]: {
              ...(data?.name === "dypay easypaisha" && {
                bankCode: dypayKeys?.bankCode,
              }),
              merchantNo: dypayKeys?.merchantNo,
              merchantSecretKey: dypayKeys?.merchantSecretKey,
            },
          }
        : {}),
      ...(data?.name === "fPay"
        ? {
            fPay: {
              apiKey: fpayKeys?.apiKey,
              // authKey: fpayKeys?.authKey,
              secretKey: fpayKeys?.secretKey,
              userName: fpayKeys?.userName,
            },
          }
        : {}),
      ...(data?.name === "payulink"
        ? {
          payulink: payulinkKeys,
        }
        : {}),
      ...((data?.name === "todaypay jazzcash" || data?.name === "todaypay easypaisa")
        ? {
          [data?.name]: {
            merchantId: todaypayKeys?.merchantId,
            merchantSecretKey: todaypayKeys?.merchantSecretKey,
          },
        }
        : {}),
      ...(data?.name === "zingpay"
        ? {
          zingpay: {
            apiKey: zingpayKeys?.apiKey,
            appSecretKey: zingpayKeys?.appSecretKey,
            appSignatureKey: zingpayKeys?.appSignatureKey,
          },
        }
        : {}),
      ...(data?.name === "nippy"
        ? {
          nippy: {
            merchantId: nippyKeys?.merchantId,
            authToken: nippyKeys?.authToken
          },
        }
        : {}),
      ...(data?.name === "ezpay"
        ? {
          ezpay: {
            merchantCode: ezpayKeys?.merchantCode,
            merchantKey: ezpayKeys?.merchantKey
          },
        }
        : {}),
      ...(data?.name === "pradhee"
        ? {
          pradhee: {
            apiKey: pradheeKeys?.apiKey,
            clientId: pradheeKeys?.clientId,
            salt: pradheeKeys?.salt,
            ...(transactionType === "withdraw" && {
              paymentMode: pradheeKeys?.paymentMode
            })
          },
        }
        : {})
    };

    // Filter out unwanted keys
    updateData = Object.keys(updateData)
      .filter((key) => !extraKey.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {});

    setIsLoading(false);

    if (props.location.state?.id[0]) {
      await PaymentGetway.editPaymentGetway(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            dispatch(
              fetchActiveTransactionTypeTab(response?.data?.transactionType),
            );
            props.history.goBack();
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

    // Check if the changed input belongs to the additional fields
    const isAdditionalField = excludedKeys.includes(name);

    if (isAdditionalField) {
      // If it's an additional field, update only the changed field in the state
      setAdditionalFields((prevAdditionalFields) => {
        const updatedFields = prevAdditionalFields.map((field) => {
          if (field.key === name) {
            return React.cloneElement(field, {
              children: (
                <Input
                  type="text"
                  name={name}
                  placeholder={`Enter ${name}`}
                  value={value}
                  onChange={(e) => handleInputChange(e)}
                />
              ),
            });
          }
          return field;
        });
        return updatedFields;
      });
    }
    // Update the state for the main fields
    setData((prevData) => ({ ...prevData, [name]: value }));
    // setData({ ...data, [name]: value });
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "max" || name === "min") {
      if (data?.transactionType === "deposit") {
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

  const handleIsActiveChange = (e) => {
    setIsBlock(e);
    setData({ ...data, isBlock: !e });
  };

  const handleChangePaymentType = (e) => {
    setData({ ...data, paymentType: e });
  };

  const handleInputwizPayKeysChange = (e) => {
    let { name, value } = e.target;
    setWizPayKeys({ ...wizPayKeys, [name]: value });
  };

  const handleInputPaycialsKeysChange = (e) => {
    let { name, value } = e.target;
    setPaycialsKeys({ ...paycialsKeys, [name]: value });
  };

  const handleInputTPPayInKeysChange = (e) => {
    let { name, value } = e.target;
    setTPPayInKeys({ ...tpPayInKeys, [name]: value });
  };

  const handleInputBigpayzKeysChange = (e) => {
    let { type, name, value, checked } = e.target;

    if (type === "checkbox") {
      setBigpayzKeys((prevState) => ({
        ...prevState,
        paymentOptions: {
          ...prevState.paymentOptions,
          [name]: checked,
        },
      }));
    } else {
      setBigpayzKeys((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleInputFasterpayKeysChange = (e) => {
    let { name, value } = e.target;
    setFasterpayKeys({ ...fasterpayKeys, [name]: value });
  };

  const handleInputDYPayKeysChange = (e) => {
    let { name, value } = e.target;
    setDYPayKeys({ ...dypayKeys, [name]: value });
  };

  const handleInputFPayKeysChange = (e) => {
    let { name, value } = e.target;
    setFPayKeys({ ...fpayKeys, [name]: value });
  };

  const handleInputPayulinkKeysChange = (index, name, value) => {
    setPayulinkKeys(prevData =>
      prevData.map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      )
    );
  };

  const handleInputTodaypayKeysChange = (e) => {
    let { name, value } = e.target;
    setTodaypayKeys({ ...todaypayKeys, [name]: value });
  };

  const handleInputZingpayKeysChange = (e) => {
    let { name, value } = e.target;
    setZingpayKeys({ ...zingpayKeys, [name]: value });
  };

  const handleInputNippyKeysChange = (e) => {
    let { name, value } = e.target;
    setNippyKeys({ ...nippyKeys, [name]: value });
  };

  const handleInputEzpayKeysChange = (e) => {
    let { name, value } = e.target;
    setEzpayKeys({ ...ezpayKeys, [name]: value });
  };

  const handleInputPradheeKeysChange = (e) => {
    let { name, value } = e.target;
    setPradheeKeys({ ...pradheeKeys, [name]: value });
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
              {title}
            </div>
          }
        >
          {!dataLoad && (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 900 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
              ref={formRef}
            >
              <CustomFormItem
                label="Payment Partner"
                name="name"
                value={data?.name}
                placeholder="Enter Payment Partner Name"
                onChange={handleInputChange}
                disabled={true}
                rules={[
                  {
                    required: true,
                    message: "Please enter your  payment partner name!",
                  },
                ]}
              />
              <Form.Item
                label="Payment Type"
                name="paymentType"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Enter Payment Type"
                  onSelect={(e) => handleChangePaymentType(e)}
                  onDeselect={(e) => handleChangePaymentType(e)}
                  name="paymentType"
                  value={data?.paymentType}
                >
                  <Option value={"upi"} key={"upi"}>
                    UPI
                  </Option>
                  <Option value={"RTGS"} key={"RTGS"}>
                    RTGS
                  </Option>
                  <Option value={"NEFT"} key={"NEFT"}>
                    NEFT
                  </Option>
                  <Option value={"IMPS"} key={"IMPS"}>
                    IMPS
                  </Option>
                  <Option value={"EWALLET"} key={"EWALLET"}>
                    EWALLET
                  </Option>
                </Select>
              </Form.Item>
              <CustomFormItem
                label="Priority Number"
                name="priority"
                type="number"
                value={data?.priority}
                placeholder="Enter priority number"
                min={1}
                onChange={handleInputChange}
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

              {data.name === "wizPay" && (
                <I20pay
                  wizPayKeys={wizPayKeys}
                  handleInputwizPayKeysChange={handleInputwizPayKeysChange}
                />
              )}

              {data.name === "paycials" && (
                <Paycials
                  paycialsKeys={paycialsKeys}
                  handleInputPaycialsKeysChange={handleInputPaycialsKeysChange}
                />
              )}

              {data.name === "tp payin" && (
                <TPPayIn
                  tpPayInKeys={tpPayInKeys}
                  handleInputTPPayInKeysChange={handleInputTPPayInKeysChange}
                />
              )}

              {data.name === "bigpayz" && (
                <Bigpayz
                  bigpayzKeys={bigpayzKeys}
                  handleInputBigpayzKeysChange={handleInputBigpayzKeysChange}
                />
              )}

              {data.name === "fasterpay" && (
                <Fasterypay
                  fasterpayKeys={fasterpayKeys}
                  handleInputFasterpayKeysChange={
                    handleInputFasterpayKeysChange
                  }
                />
              )}

              {(data.name === "dypay jazzcash" ||
                data.name === "dypay easypaisha") && (
                <DYPay
                  dypayKeys={dypayKeys}
                  handleInputDYPayKeysChange={handleInputDYPayKeysChange}
                />
              )}
              {data.name === "fPay" && (
                <Fpay
                  fpayKeys={fpayKeys}
                  handleInputFPayKeysChange={handleInputFPayKeysChange}
                />
              )}
              {data.name === "payulink" && (
                <Payulink
                  websiteList={websiteList}
                  payulinkKeys={payulinkKeys}
                  handleInputPayulinkKeysChange={handleInputPayulinkKeysChange}
                />
              )}
              {(data.name === "todaypay jazzcash" || data.name === "todaypay easypaisa") && (
                <Todaypay
                  todaypayKeys={todaypayKeys}
                  handleInputTodaypayKeysChange={handleInputTodaypayKeysChange}
                />
              )}
              {(data.name === "zingpay") && (
                <Zingpay
                  zingpayKeys={zingpayKeys}
                  handleInputZingpayKeysChange={handleInputZingpayKeysChange}
                />
              )}
              {(data.name === "nippy") && (
                <Nippy
                  nippyKeys={nippyKeys}
                  handleInputNippyKeysChange={handleInputNippyKeysChange}
                />
              )}
              {(data.name === "ezpay") && (
                <Ezpay
                  ezpayKeys={ezpayKeys}
                  handleInputEzpayKeysChange={handleInputEzpayKeysChange}
                />
              )}
              {(data.name === "pradhee") && (
                <Pradhee
                  transactionType={transactionType}
                  pradheeKeys={pradheeKeys}
                  handleInputPradheeKeysChange={handleInputPradheeKeysChange}
                />
              )}

              {additionalFields}
              {data?.transactionType === "deposit" ? (
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
                    Deposit
                  </span>
                  <CustomFormItem
                    label="Min Transaction Limit"
                    name="min"
                    min={0}
                    type="number"
                    value={data?.depositTransactionLimit?.min}
                    placeholder="Enter deposit minimum transaction amount"
                    onChange={handleChange}
                    rules={[
                      {
                        required: data?.depositTransactionLimit.min === "",
                        message: "Please enter your deposit minimum limi",
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
                          if (!value || !getFieldValue("max")) {
                            return Promise.resolve();
                          }
                          if (
                            parseFloat(value) <=
                            parseFloat(getFieldValue("max"))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Minimum limit must be smaller than or equal to the maximum limit",
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
                    placeholder="Enter deposit minimum transaction amount"
                    onChange={handleChange}
                    rules={[
                      {
                        required: data?.depositTransactionLimit.max === "",
                        message: "Please enter your Deposit maximum limit",
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
                            parseFloat(value) >=
                            parseFloat(getFieldValue("min"))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Maximum limit must be greater than or equal to the minimum limit",
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                </div>
              ) : (
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
                  <CustomFormItem
                    label="Min Transaction Limit"
                    name="min"
                    min={0}
                    type="number"
                    value={data?.withdrawTransactionLimit?.min}
                    placeholder="Enter withdraw minimum transaction amount"
                    onChange={handleChange}
                    rules={[
                      {
                        required: data?.withdrawTransactionLimit?.min === "",
                        message: "Please enter your withdraw minimum limit",
                      },
                      {
                        required: data?.withdrawTransactionLimit?.min !== "",
                        pattern: new RegExp(
                          /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
                        ),
                        message: "Please enter only numerical characters",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue("max")) {
                            return Promise.resolve();
                          }
                          if (
                            parseFloat(value) <=
                            parseFloat(getFieldValue("max"))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Minimum limit must be smaller than or equal to the maximum limit",
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
                    placeholder="Enter withdraw minimum transaction amount"
                    onChange={handleChange}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your withdraw maximum limit",
                      },
                      {
                        required: data?.withdrawTransactionLimit?.max !== "",
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
                            parseFloat(value) >=
                            parseFloat(getFieldValue("min"))
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Maximum limit must be greater than or equal to the minimum limit",
                            ),
                          );
                        },
                      }),
                    ]}
                  />
                </div>
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

export default withRouter(AddPaymentGetway);