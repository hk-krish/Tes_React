import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import UserService from "../../../service/UserService";
import AuthLogic from "../../../util/AuthLogic";
import { Button, Form, Input, Card, message } from "antd";
import notify from "../../../Notification";
import CircularProgress from "../../../components/CircularProgress";

const UserProfile = (props) => {
  const title = "Your Profile";
  const [data, setData] = useState({
    userName: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const history = useHistory();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let userId = await AuthLogic.GetUser();
    if (props.location.pathname === "/users/editUser") {
      await UserService.GetUserById(props.location.state.id[0])
        .then((response) => {
          setData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await UserService.GetUserById(userId?.user_id)
        .then((response) => {
          setData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onFinish = async () => {
    setIsLoading(true);
    let updateData = {
      id: data.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      userName: data.userName,
    };

    await UserService.UpdateUser(updateData)
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          notify.openNotificationWithIcon(
            "success",
            "Success",
            "YourData has been successfully Updated",
          );
          setIsLoading(false);
          history.push("/users");
        } else {
          notify.openNotificationWithIcon("error", "Error", response.message);
          setIsLoading(false);
          console.log(response.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <Auxiliary>
        <Card title={title}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 900 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="User Name"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                type="text"
                placeholder="input placeholder"
                value={data?.userName}
                name="userName"
                id="userName"
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              label="First Name"
              rules={[
                {
                  pattern: /^[a-zA-Z]{2,30}$/,
                  message: `Please enter valid Name!`,
                },
                {
                  required: true,
                  message: "Please Enter your Name!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="input placeholder"
                value={data?.first_name}
                name="first_name"
                id="first_name"
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Surname!",
                },
                {
                  pattern: /^[a-zA-Z]{2,30}$/,
                  message: `Please enter valid Surname!`,
                },
              ]}
            >
              <Input
                type="text"
                placeholder="input placeholder"
                value={data?.last_name}
                name="last_name"
                id="last_name"
                onChange={handleInputChange}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Email!",
                },
                {
                  type: "email",
                  message: "Please enter valid Email!",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="input placeholder"
                value={data?.email}
                name="email"
                id="email"
                onChange={handleInputChange}
                disabled
              />
            </Form.Item>
            <Form.Item
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please Enter your Password!",
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{7,30}$/,
                  message: `Please enter valid Password!`,
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="input placeholder"
                value={data?.password}
                name="Password"
                id="Password"
                onChange={handleInputChange}
                disabled={
                  props.location.pathname === "/users/editUser" ? true : false
                }
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{ offset: 8, span: 16 }}
              style={{ marginLeft: "33%" }}
            >
              <Button loading={isLoading} type="primary" htmlType="submit">
                Update
              </Button>
              <Button
                style={{ padding: "0 25px" }}
                type="primary"
                onClick={() => {
                  history.push("/users");
                }}
              >
                Back
              </Button>
            </Form.Item>

            {loader ? (
              <div className="gx-loader-view">
                <CircularProgress />
              </div>
            ) : null}
            {showMessage ? message.error(alertMessage.toString()) : null}
          </Form>
        </Card>
      </Auxiliary>
    </>
  );
};

export default withRouter(UserProfile);
