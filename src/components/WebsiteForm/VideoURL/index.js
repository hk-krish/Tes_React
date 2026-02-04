import { Button, Form, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "../../CircularProgress";
import { CustomFormItem } from "../../InputControl/InputForm";

const VideoURL = (props) => {
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const formRef = useRef();
  const [data, setData] = useState({
    _id: "",
    howToDepositUrl: {
      upi: "",
      bank: "",
      crypto: "",
      digitalRupee: "",
      // auto: "",
    },
  });

  const onSubmit = async () => {
    let updateData = {
      _id: data?._id,
      howToDepositUrl: data?.howToDepositUrl,
    };
    props.onFinish(updateData, "websiteForm");
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setData({
      ...data,
      howToDepositUrl: { ...data?.howToDepositUrl, [name]: value },
    });
  };

  const fetchData = (responseData) => {
    if (window.location?.pathname === "/websites/editwebsite") {
      formRef?.current?.setFieldsValue({
        upi: responseData?.howToDepositUrl?.upi,
        bank: responseData?.howToDepositUrl?.bank,
        crypto: responseData?.howToDepositUrl?.crypto,
        digitalRupee: responseData?.howToDepositUrl?.digitalRupee,
        // auto: responseData?.howToDepositUrl?.auto,
      });
      setData({
        _id: responseData?._id,
        howToDepositUrl: responseData?.howToDepositUrl,
      });
    }
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
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          autoComplete="off"
          ref={formRef}
        >
          <CustomFormItem
            label="UPI"
            name="upi"
            value={data?.howToDepositUrl?.upi}
            placeholder="ENTER UPI VIDEO LINK"
            onChange={handleInputChange}
          />
          <CustomFormItem
            label="BANK"
            name="bank"
            value={data?.howToDepositUrl?.bank}
            placeholder="ENTER BANK VIDEO LINK"
            onChange={handleInputChange}
          />
          <CustomFormItem
            label="CRYPTO"
            name="crypto"
            value={data?.howToDepositUrl?.crypto}
            placeholder="ENTER CRYPTO VIDEO LINK"
            onChange={handleInputChange}
          />
          <CustomFormItem
            label="DIGITAL RUPEE"
            name="digitalRupee"
            value={data?.howToDepositUrl?.digitalRupee}
            placeholder="ENTER DIGITAL RUPEE VIDEO LINK"
            onChange={handleInputChange}
          />
          {/* <CustomFormItem
            label="AUTO"
            name="auto"
            value={data?.howToDepositUrl?.auto}
            placeholder="ENTER AUTO VIDEO LINK"
            onChange={handleInputChange}
          /> */}
          <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ marginLeft: "33%" }}
          >
            <Button loading={props?.isLoading} type="primary" htmlType="submit">
              {"Update"}
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
            <div className="gx-lo`ader-view">
              <CircularProgress />
            </div>
          ) : null}
          {showMessage ? message.error(alertMessage.toString()) : null}
        </Form>
      )}
    </>
  );
};

export default VideoURL;
