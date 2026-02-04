import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import {
  Button,
  Form,
  Input,
  Card,
  message,
  Radio,
  Switch,
  Tabs,
  Upload,
} from "antd";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";
import {
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import CryptoService from "../../../../service/CryptoService";
import CoinsNetworksTable from "../../CoinNetworks";
import { addCoinData, setNetworkActiveTab } from "../../../../appRedux/actions";
import ServerURL from "../../../../service/ServerURL";
import { CustomFormItem } from "../../../../components/InputControl/InputForm";

const { TabPane } = Tabs;
const AddCoinDetails = (props) => {
  const title =
    props.location.pathname === "/coins/add-coin-details"
      ? "Add Coin Details"
      : "Edit Coin Details";
  const [data, setData] = useState({
    name: "",
    conversionToUSDT: "",
    isActive: true,
    logo: "",
    shortName:"",
    priority: "",
    decimalDigit: "",
    isRateAutoGenerate: false
  });
  const [oldData, setOldData] = useState(null);
  const [dataLoad, setDataLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const history = useHistory();
  const formRef = useRef();
  const [defaultActiveTabKey, setDefaultActiveTabKey] = useState("1");
  const dispatch = useDispatch();

  const uploadProps = {
    name: "image",
    action: `${ServerURL.getAPIUrl()}/upload`,
    onChange(info) {
      // console.log(info);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        const logoImageFileName = info.file.response.data.data;
        setData((prevData) => ({
          ...prevData,
          logo: logoImageFileName,
        }));
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const fetchData = async () => {
    if (props.location.pathname === "/coins/edit-coin-details") {
      await CryptoService.getSingleCoin(props.location.state.id[0])
        .then((response) => {
          setDataLoad(true);
          formRef.current.setFieldsValue({
            name: response?.data?.name,
            conversionToUSDT: response?.data?.conversionToUSDT,
            isActive: response?.data?.isActive,
            shortName:response?.data?.shortName,
            priority:response?.data?.priority,
            decimalDigit: response?.data?.decimalDigit,
            isRateAutoGenerate: response?.data?.isRateAutoGenerate
          });
          setData(response.data);
          setOldData(response.data);
          dispatch(
            addCoinData({
              coinName: response.data.name,
              coinId: response.data._id,
            }),
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setDataLoad(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async () => {
    setIsLoading(true);
    let updateData = {
      _id: data?._id,
      name: data?.name,
      conversionToUSDT: data?.conversionToUSDT,
      isActive: data?.isActive,
      shortName:data?.shortName,
      logo:data?.logo,
      priority:data?.priority,
      decimalDigit: data?.decimalDigit,
      isRateAutoGenerate: data?.isRateAutoGenerate
    };

    if (props.location.pathname === "/coins/edit-coin-details") {
      await CryptoService.editCoin(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "Coin Details has been successfully Updated",
            );
            setIsLoading(false);
            history.push("/coins");
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
      await CryptoService.addNewCoin(updateData)
        .then((response) => {
          console.log("response------------->>>", response);
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "Coin Details has been added successfully",
            );
            setIsLoading(false);
            history.push("/coins");
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

  const handleStatusChange = (e, type) => {
    setData({ ...data, [type]: e });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "conversionToUSDT") {
      setData({
        ...data,
        [name]: parseFloat(value),
      });
    } else if (name === "priority") {
      setData({
        ...data,
        [name]:parseInt(value)
      })
    } else {
      setData({ ...data, [name]: value });
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
              {title}
            </div>
          }
        >
          {props.location.pathname === "/coins/add-coin-details" ? (
            dataLoad && (
              <>
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 900 }}
                  initialValues={{ remember: true }}
                  ref={formRef}
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Coin Name"
                    name="name"
                    rules={[
                      {
                        required: data?.name === "",
                        message: "Please enter your coin name!",
                      },
                      // {
                      //   required: data?.name !== "",
                      //   pattern: new RegExp(
                      //     /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/i
                      //   ),
                      //   message: "Please enter only alphanumeric characters!",
                      // },
                    ]}
                    required
                  >
                    <Input
                      type="text"
                      placeholder="Enter Coin Name"
                      defaultValue={data?.name}
                      value={data?.name}
                      name="name"
                      id="name"
                      onChange={handleInputChange}

                    />
                  </Form.Item>
                  <Form.Item
                    label="Conversion Rate (INR)"
                    name="conversionToUSDT"
                    required={!data?.isRateAutoGenerate}
                    rules={[
                      {
                        required:
                          !data?.isRateAutoGenerate && (data?.conversionToUSDT === "" ||
                            data?.conversionToUSDT === null),
                        message: "Please enter your Currency Conversion Rate!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Currency Conversion Rate"
                      defaultValue={data?.conversionToUSDT}
                      value={data?.conversionToUSDT}
                      name="conversionToUSDT"
                      id="conversionToUSDT"
                      onChange={handleInputChange}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Short Name"
                    name="shortName"
                    required
                    rules={[
                      {
                        required: data?.shortName === "",
                        message: "Please enter your Short Name",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Short Name"
                      defaultValue={data?.shortName}
                      value={data?.shortName}
                      name="shortName"
                      id="shortName"
                      onChange={handleInputChange}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Priority"
                    name="priority"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Please enter priority number!",
                      },
                      {
                        pattern: new RegExp(/^[1-9]\d*$/),
                        message: "Priority must be positive integer greater than 0!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Priority Number"
                      defaultValue={data?.priority}
                      value={data?.priority}
                      name="priority"
                      id="priority"
                      onChange={handleInputChange}
                      // required
                      min={1}
                    />
                  </Form.Item>

                  <CustomFormItem
                    label="Decimal Roundoff Digits"
                    name="decimalDigit"
                    type="number"
                    value={data?.decimalDigit}
                    placeholder="Enter decimal roundoff digits"
                    onChange={handleInputChange}
                    min={0}
                    rules={[
                      {
                        required: true,
                        message: "Please enter decimal roundoff digits",
                      },
                      {
                        required: data?.decimalDigit !== "",
                        pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                        message: "Please enter only numerical characters",
                      },
                    ]}
                  />

                  <Form.Item
                    label="Is Rate Auto Generate"
                    name="isRateAutoGenerate"
                    style={{ marginTop: "10px" }}
                  >
                    <Switch
                      name="isRateAutoGenerate"
                      checked={data?.isRateAutoGenerate}
                      onChange={(e) => handleStatusChange(e, "isRateAutoGenerate")}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Is Active"
                    name="isActive"
                    style={{ marginTop: "10px" }}
                  >
                    <Switch
                      name="isActive"
                      checked={data?.isActive}
                      onChange={(e) => handleStatusChange(e, "isActive")}
                    />
                  </Form.Item>
                  <div
                    style={{
                      marginLeft: "22%",
                      display: "flex",
                      alignItems: "center",
                      gap: "30px",
                      marginBottom: "10px",
                    }}
                  >
                    <p>Logo Image: </p>
                    <Upload
                      maxCount={1}
                      multiple={false}
                      {...uploadProps}
                      listType="picture"
                      showUploadList={true}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </div>

                  <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                    style={{ marginLeft: "33%" }}
                  >
                    <Button
                      loading={isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      {props.location.pathname === "/coins/add-coin-details"
                        ? "Add"
                        : "Update"}
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
              </>
            )
          ) : (
            <Tabs
              defaultActiveKey="1"
              onChange={(key) => {
                setDefaultActiveTabKey(key);
                dispatch(setNetworkActiveTab(key));
              }}
            >
              <TabPane tab="Edit Coin Details" key="1">
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 900 }}
                  initialValues={{ remember: true }}
                  ref={formRef}
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Coin Name"
                    name="name"
                    rules={[
                      {
                        required: data?.name === "",
                        message: "Please enter your coin name!",
                      },
                      // {
                      //   required: data?.name !== "",
                      //   pattern: new RegExp(
                      //     /^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9 ])?[a-zA-Z0-9]*)*$/i
                      //   ),
                      //   message: "Please enter only alphanumeric characters!",
                      // },
                    ]}
                  >
                    <Input
                      disabled
                      type="text"
                      placeholder="Enter Coin Name"
                      defaultValue={data?.name}
                      value={data?.name}
                      name="name"
                      id="name"
                      onChange={handleInputChange}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Conversion Rate (INR)"
                    name="conversionToUSDT"
                    required={!data?.isRateAutoGenerate}
                    rules={[
                      {
                        required:!data?.isRateAutoGenerate && (data?.conversionToUSDT === "" || data?.conversionToUSDT === null),
                        message: "Please enter your Currency Conversion Rate!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Currency Conversion Rate (INR)"
                      defaultValue={data?.conversionToUSDT}
                      value={data?.conversionToUSDT}
                      name="conversionToUSDT"
                      id="conversionToUSDT"
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Item>

                  <Form.Item
                    label="Short Name"
                    name="shortName"
                    required
                    rules={[
                      {
                        required: data?.shortName === "",
                        message: "Please enter your Short Name",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      placeholder="Enter Short Name"
                      defaultValue={data?.shortName}
                      value={data?.shortName}
                      name="shortName"
                      id="shortName"
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Item>

                  <Form.Item
                    label="Priority"
                    name="priority"
                    required
                    rules={[
                      {
                        required: true,
                        message: "Please enter priority number!",
                      },
                      {
                        pattern: new RegExp(/^[1-9]\d*$/),
                        message: "Priority must be positive integer greater than 0!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Enter Priority Number"
                      defaultValue={data?.priority}
                      value={data?.priority}
                      name="priority"
                      id="priority"
                      onChange={handleInputChange}
                    />
                  </Form.Item>

                  <CustomFormItem
                    label="Decimal Roundoff Digits"
                    name="decimalDigit"
                    type="number"
                    value={data?.decimalDigit}
                    placeholder="Enter decimal roundoff digits"
                    onChange={handleInputChange}
                    min={0}
                    rules={[
                      {
                        required: true,
                        message: "Please enter decimal roundoff digits",
                      },
                      {
                        required: data?.decimalDigit !== "",
                        pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                        message: "Please enter only numerical characters",
                      },
                    ]}
                  />

                  <Form.Item
                    label="Is Rate Auto Generate"
                    name="isRateAutoGenerate"
                    style={{ marginTop: "10px" }}
                  >
                    <Switch
                      name="isRateAutoGenerate"
                      checked={data?.isRateAutoGenerate}
                      onChange={(e) => handleStatusChange(e, "isRateAutoGenerate")}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Is Active"
                    name="isActive"
                    style={{ marginTop: "10px" }}
                  >
                    <Switch
                      name="isActive"
                      checked={data?.isActive}
                      onChange={(e) => handleStatusChange(e, "isActive")}
                    />
                  </Form.Item>

                  <div
                    style={{
                      marginLeft: "22%",
                      display: "flex",
                      alignItems: "center",
                      gap: "30px",
                      marginBottom: "10px",
                    }}
                  >
                    <p>Logo Image: </p>
                    <Upload
                      maxCount={1}
                      multiple={false}
                      {...uploadProps}
                      listType="picture"
                      showUploadList={true}
                    >
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </div>

                  <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                    style={{ marginLeft: "33%" }}
                  >
                    <Button
                      loading={isLoading}
                      type="primary"
                      htmlType="submit"
                    >
                      {props.location.pathname === "/coins/add-coin-details"
                        ? "Add"
                        : "Update"}
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
              </TabPane>

              <TabPane tab="Network Details" key="2">
                <CoinsNetworksTable />
              </TabPane>
            </Tabs>
          )}
        </Card>
      </Auxiliary>
    </>
  );
};

export default withRouter(AddCoinDetails);
