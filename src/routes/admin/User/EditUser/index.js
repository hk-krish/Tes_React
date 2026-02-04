import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { Button, Form, Card, message, Switch } from "antd";
import notify from "../../../../Notification";
import CircularProgress from "../../../../components/CircularProgress";
import UserService from "../../../../service/UserService";
import { ArrowLeftOutlined } from "@ant-design/icons";

const EditUser = (props) => {
  const title =
    props.location.pathname === "/user/edituser" ? "Edit User" : "Add User";
  const [data, setData] = useState({
    isBlock: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const history = useHistory();
  const formRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (props.location.pathname === "/user/edituser") {
      await UserService.GetUserById(props.location.state.id[0])
        .then((response) => {
          formRef.current.setFieldsValue({
            isBlock: response.data.isBlock,
          });
          setData(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onFinish = async () => {
    setIsLoading(true);
    let updateData = {
      _id: data._id,
      isBlock: data.isBlock,
    };

    if (props.location.state?.id[0]) {
      await UserService.editUser(updateData)
        .then((response) => {
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Updated",
            );
            setIsLoading(false);
            history.push("/user");
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
      await UserService.EditUser(updateData)
        .then((response) => {
          console.log("response>>>", response);
          if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "YourData has been successfully Add",
            );
            setIsLoading(false);
            history.push("/user");
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
          {data && (
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 900 }}
              initialValues={{ remember: true }}
              ref={formRef}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item label="Is Block" name="isOn">
                <Switch
                  name="isOn"
                  checked={data.isBlock}
                  onChange={() => setData({ ...data, isBlock: !data.isBlock })}
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

export default withRouter(EditUser);
