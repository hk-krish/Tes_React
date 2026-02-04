import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { Button, Form, Input, Card, message, Select, Switch } from "antd";
import CircularProgress from "../../../components/CircularProgress";
import WebsiteService from "../../../service/WebsiteService";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const { Option } = Select;

const CommonPage = () => {
  let title = "Common Page";
  const [websiteList, setWebsiteList] = useState([]);
  const history = useHistory();
  const { loader, alertMessage, showMessage, user } = useSelector(({ auth }) => auth);
  const tabPermission = user?.tabPermission && user?.tabPermission?.length > 0 && user?.tabPermission?.find(item => "/"+item.tabId.tabUrl === history.location.pathname);
  const [type, setType] = useState(null);
  const [iframe_key, setIframe_key] = useState(0);
  const [loaderButton, setLoaderButton] = useState({
    deposit: false,
    withdraw: false,
  });
  const [url, setUrl] = useState(null);
  const formRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
  };

  const handleClick = (type) => {
    setType(type);
    formRef.current.submit();
  };

  const handleFinish = async () => {
    let body = formRef.current.getFieldsValue();
    if (type === "withdraw") {
      setType(null);
      setLoaderButton({ ...loaderButton, withdraw: true });
      await WebsiteService.withdraw(body)
        .then((response) => {
          setUrl(response?.data);
          setType("withdraw");
          setLoaderButton({ ...loaderButton, withdraw: false });
        })
        .catch((err) => {
          setType("withdraw");
          console.log(err);
          message.error(err.message);
          setLoaderButton({ ...loaderButton, withdraw: false });
        });
    } else {
      setType(null);
      setLoaderButton({ ...loaderButton, deposit: true });
      await WebsiteService.deposit(body)
        .then((response) => {
          setUrl(response?.data);
          setType("deposit");
          setLoaderButton({ ...loaderButton, deposit: false });
        })
        .catch((err) => {
          console.log(err);
          setType("deposit");
          message.error(err.message);
          setLoaderButton(false);
          setLoaderButton({ ...loaderButton, deposit: false });
        });
    }
  };

  return (
    <Auxiliary>
      <Card title={title}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900 }}
          ref={formRef}
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Website"
            name="merchantId"
            rules={[{ required: true, message: "Please select website!" }]}
          >
            <Select placeholder="Select Website">
              {websiteList.map((data, i) => {
                return (
                  <Option value={data.merchantId} key={i}>
                    {data.url}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="End User ID"
            name="userId"
            rules={[{ required: true, message: "Please enter end user id!" }]}
          >
            <Input
              type="text"
              placeholder="Enter End User ID"
              name="userId"
              id="userId"
            />
          </Form.Item>
          {tabPermission && tabPermission?.add && <Form.Item
            wrapperCol={{ offset: 8, span: 16 }}
            style={{ marginLeft: "33%" }}
          >
            <Button
              type="primary"
              onClick={() => handleClick("deposit")}
              htmlType="button"
              loading={loaderButton.deposit}
            >
              Deposit
            </Button>
            <Button
              type="primary"
              onClick={() => handleClick("withdraw")}
              htmlType="button"
              loading={loaderButton.withdraw}
            >
              WithDraw
            </Button>
          </Form.Item>}

          {loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
          {showMessage ? message.error(alertMessage.toString()) : null}
        </Form>
        {type && url && (
          <iframe
            name="myIframe"
            id="myIfr"
            // key={iframe_key}
            width={"100%"}
            height={"500px"}
            src={url}
          />
        )}
      </Card>
    </Auxiliary>
  );
};

export default withRouter(CommonPage);
