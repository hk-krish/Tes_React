import { Button, Form, Modal, Select, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../../Notification";
import { fetchEntityData } from "../../../appRedux/actions/EntityPayment";
import CommossionService from "../../../service/CommissionService";
import CircularProgress from "../../CircularProgress";
import { CustomFormItem } from "../../InputControl/InputForm";

const { Option } = Select;

const AddWebsiteAssignVendorModal = (props) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const { actionType } = useSelector(({ entityPayment }) => entityPayment);
  const { transactionType } = useSelector(
    ({ paymentGateway }) => paymentGateway,
  );
  const { fetchAssignVendorData } = useSelector(({ website }) => website);
  const { fetchVendorData } = useSelector(({ website }) => website);
  const [data, setData] = useState({
    transactionType,
    websiteId: props?.websiteId,
    vendorId: "",
    priority: "",
    tesCommission: "",
    vendorCommission: "",
    // isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoad, setDataLoad] = useState(false);

  const fetchData = async (fetchAssignVendorData) => {
    if (
      props.location.pathname === "/websites/editwebsite" &&
      actionType === "edit-assignVendor"
    ) {
      setDataLoad(true);
      const response = await CommossionService.getAssignVendorById(
        props?.websiteId,
        fetchAssignVendorData?.vendorId,
        transactionType,
      );
      console.log("response---", response);
      if (response?.status === 200) {
        let formattedData = {
          vendorId: response?.data?.vendorId,
          priority: response?.data?.priority,
          vendorCommission: response?.data?.vendorCommission,
          tesCommission: response?.data?.tesCommission,
        };

        form?.setFieldsValue(formattedData);
        setData({
          transactionType,
          websiteId: props?.websiteId,
          vendorId: response?.data?.vendorId,
          priority: response?.data?.priority,
          tesCommission: response?.data?.tesCommission,
          vendorCommission: response?.data?.vendorCommission,
        });
        setDataLoad(false);
      } else {
        message.error(response?.error);
      }
    }
  };
  const onFinish = async () => {
    setIsLoading(true);
    let updateData = { ...data };

    console.log("updatedata--------", updateData);
    if (actionType === "edit-assignVendor") {
      await CommossionService.editCommission(updateData)
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
      await CommossionService.addCommission(updateData)
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

    setData({ ...data, [name]: value });
  };

  const handleVendorSelect = (e) => {
    setData({ ...data, vendorId: e });
  };

  useEffect(() => {
    if (fetchAssignVendorData) {
      fetchData(fetchAssignVendorData);
    } else {
      form.resetFields();
    }
  }, [fetchAssignVendorData, actionType]);

  return (
    <>
      <Auxiliary>
        <Modal
          visible={props?.visible}
          title={`Add ${transactionType} vendor`}
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
                label="Select Vendor"
                name="vendorId"
                rules={[
                  {
                    required: true,
                    message: "Please select vendor!",
                  },
                ]}
              >
                <Select
                  placeholder="Select vendor"
                  onSelect={(e) => handleVendorSelect(e)}
                  onDeselect={(e) => handleVendorSelect(e)}
                  disabled={actionType === "edit-assignVendor"}
                  name="vendorId"
                  id="vendorId"
                >
                  {fetchVendorData?.map((data) => (
                    <Option value={data?._id} key={data?.name}>
                      {data?.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <CustomFormItem
                label="Vendor+TES Commission"
                name="vendorCommission"
                type="number"
                value={data?.vendorCommission}
                placeholder="Enter Vendor+TES commission"
                onChange={handleInputChange}
                min={0}
                step="0.01"
                rules={[
                  {
                    required: data?.vendorCommission === "",
                    message: "Please enter your vendor+tes commission",
                  },
                  {
                    required: data?.vendorCommission !== "",
                    pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
                    message: "Please enter only numerical characters",
                  },
                ]}
              />
              <CustomFormItem
                label="TES Commission"
                name="tesCommission"
                type="number"
                value={data?.tesCommission}
                placeholder="Enter TES commission"
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
              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                style={{ marginLeft: "33%" }}
              >
                <Button loading={isLoading} type="primary" htmlType="submit">
                  {actionType === "edit-assignVendor" ? "Update" : "ADD"}
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

export default withRouter(AddWebsiteAssignVendorModal);
