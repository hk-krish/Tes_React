import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { Form, Input, message, Radio, Switch, Modal } from "antd";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";
import CryptoService from "../../../../service/CryptoService";
import { CustomFormItem } from "../../../../components/InputControl/InputForm";

const AddNetworkCoinModal = (props) => {
  const title =
    props?.location?.pathname === "/coins/networks/add-network-details"
      ? "Add Coin Network Details"
      : "Edit Coin Network Details";
  const [data, setData] = useState({
    name: "",
    networkFee: "",
    coinId: "",
    priority:null,
    isActive: true,
    regex: ""
  });
  const [oldData, setOldData] = useState(null);
  const [dataLoad, setDataLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const coinDetails = useSelector((state) => state.cryptoNetworkDetails);
  const [form] = Form.useForm();

  const fetchData = async () => {
    if (props?.networkDetails?._id) {
      await CryptoService.getSingleNetworkDetails(props?.networkDetails._id)
        .then((response) => {
          setDataLoad(true);
          form.setFieldsValue({
            name: response?.data?.[0]?.name,
            networkFee: response?.data?.[0]?.networkFee,
            coinId: response?.data?.[0]?.coinId,
            isActive: response?.data?.[0]?.isActive,
            priority:response?.data?.[0]?.priority,
            regex: response?.data?.[0]?.regex
          });
          setData(response?.data?.[0]);
          setOldData(response?.data?.[0]);
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
  }, [props?.networkDetails]);

  useEffect(() => {
    setData((prevData) => ({ ...prevData, coinId: coinDetails.coinId }));
  }, [coinDetails]);

  useEffect(() => {
    form.resetFields(["name","networkFee","priority"])
  },[props.visible])

  const onFinish = async () => {
    setIsLoading(true);
    form.validateFields().then(async () => {
      let updateData = {
        _id: data?._id,
        name: data?.name,
        networkFee: parseFloat(data?.networkFee),
        isActive: data?.isActive,
        coinId: data?.coinId,
        priority: data?.priority,
        regex: data?.regex
      };
      if (coinDetails.transactionType === "edit") {
        await CryptoService.editCoinNetwork(updateData)
          .then((response) => {
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "Coin Details has been successfully Updated",
              );
              props.onClose();
              setIsLoading(false);
            } else {
              notify.openNotificationWithIcon("error", "Error", response.message);
              setIsLoading(false);
            }
          })
          .catch((err) => {
            notify.openNotificationWithIcon("error", "Error", err.message);
            setIsLoading(false);
            console.log(err);
          });
      } else {
        delete updateData._id;
        await CryptoService.addCoinNetwork(updateData)
          .then((response) => {
            console.log("response------------->>>", response);
            if (response.status === 200 || response.status === 202) {
              notify.openNotificationWithIcon(
                "success",
                "Success",
                "Coin Network Details has been added successfully",
              );
              setIsLoading(false);
              props.onClose();
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
    }).catch((err) => console.log(err.errorFields[0].errors[0]));
    
  };

  const handleStatusChange = (e) => {
    console.log(e, "e-->>>");
    setData({ ...data, isActive: e });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "conversionToUSDT" || name === "minimumDepositAmount") {
      setData({
        ...data,
        [name]: parseFloat(value),
      });
    } else if (name === "priority") {
      setData({
        ...data,
        [name]: parseInt(value),
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  return (
    <Modal
      title={`${coinDetails.transactionType === "edit" ? `Edit ${coinDetails.coinName}-${data.name}`: `Add ${coinDetails.coinName}`}  Network`}
      visible={props.visible}
      destroyOnClose={true}
      onCancel={() => {
        setData({ name: "", networkFee: "", coinId: "", isActive: true, priority:null });
        form.resetFields(["name", "networkFee","priority"]);
        props.onClose();
      }}
      onOk={onFinish}
      afterClose={() => {
        setData({ name: "", networkFee: "", coinId: "", isActive: true, priority:null });
      }}
    >
      {dataLoad && (
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900, marginTop: "25px" }}
          initialValues={{ remember: true }}
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Network Name"
            name="name"
            rules={[
              {
                required: data?.name === "" || data?.name?.length === 0,
                message: "Please enter your coin Network name!",
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Enter Coin Network Name"
              defaultValue={data?.name}
              value={data?.name}
              name="name"
              id="name"
              onChange={handleInputChange}
              disabled={coinDetails.transactionType === "edit"}
            />
          </Form.Item>
          <Form.Item
            label="Network Fee (INR)"
            name="networkFee"
            required
            rules={[
              {
                required: data?.networkFee === "" || data?.networkFee === NaN,
                message: "Please enter your Network Fee!",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter Network Fee Rate"
              defaultValue={data?.networkFee}
              value={data?.networkFee}
              name="networkFee"
              id="networkFee"
              onChange={handleInputChange}
            />
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            required
            rules={[
              {
                required:
                  data?.priority === null ||
                  data?.priority === NaN ||
                  data?.priority === "",
                message: "Please enter priority number",
              },
              {
                required: data?.priority !== "",
                pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                message: "Please enter only numerical characters",
              },
            ]}
          >
            <Input
              type="number"
              placeholder="Enter Priority Number"
              value={data?.priority}
              name="priority"
              id="priority"
              onChange={handleInputChange}
              required
              min={1}
            />
          </Form.Item>
          
          <CustomFormItem
            label="Regex"
            name="regex"
            value={data?.regex}
            placeholder="Enter Network Regex"
            onChange={handleInputChange}
            rules={[{ required: true, message: "Please enter network regex!" }]}
          />

          <Form.Item
            label="Is Active"
            name="isActive"
            style={{ marginTop: "10px" }}
          >
            <Switch
              name="isActive"
              checked={data?.isActive}
              onChange={(e) => handleStatusChange(e)}
            />
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
  );
};

export default withRouter(AddNetworkCoinModal);
