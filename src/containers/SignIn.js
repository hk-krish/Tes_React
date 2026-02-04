import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Input, message, Checkbox, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IntlMessages from "util/IntlMessages";
import notify from "../Notification";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import {
  hideAuthLoader,
  hideMessage,
  showAuthLoader,
  userSignInSuccess,
  userSignInDataSuccess,
} from "../appRedux/actions/Auth";
import CircularProgress from "../components/CircularProgress";
import AuthService from "../service/AuthService";

const SignIn = () => {
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setData((preValue) => {
      return {
        ...preValue,
        [name]: value?.trim(),
      };
    });
  };

  const onFinishFailed = (errorInfo) => {
    dispatch(hideAuthLoader());
    setIsLoading(false);
  };

  const onChange = () => {
    if (checked === false) {
      setChecked(true);
      const stringifyData = JSON.stringify(data);
      localStorage.setItem("admin-cred", stringifyData);
    } else {
      localStorage.removeItem("admin-cred");
      setChecked(false);
    }
  };

  const onFinish = async (values) => {
    try {
      if (!mountedRef.current) return;
      setIsLoading(true);
      dispatch(showAuthLoader());
      if (checked === true) {
        const stringifyData = JSON.stringify(data);
        localStorage.setItem("admin-cred", stringifyData);
      }
      await AuthService.SignIn({
        userId: values.email,
        password: values.password,
        userType: "admin",
      })
        .then((success) => {
          if (!mountedRef.current) return;
          console.log("Login success data:", success.data);
          if (success.status === 200) {
            localStorage.setItem("user_token", success.data.token);
            localStorage.setItem("user", JSON.stringify(success.data));
            // if (!localStorage.getItem("sound")) {
            //   localStorage.setItem("sound", true);
            // }
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "Signin has been successfully done",
            );
            dispatch(userSignInSuccess(success));
            dispatch(userSignInDataSuccess(success.data));
            dispatch(hideMessage());
            setIsLoading(false);
            if(success?.data?.tabmasterData) {
              const firstPage = success?.data?.tabmasterData?.filter(item => item.isActive);
              if(firstPage && firstPage.length > 0) {
                history.push(firstPage[0].hasView ? "/" + (firstPage[0]?.tabUrl === "" ? (firstPage[1]?.tabUrl || "") : firstPage[0]?.tabUrl) : "/erropage");
              } else {
                history.push("/erropage");
              }
            } else {
              history.push("/dashboard");
            }
          } else {
            if (!mountedRef.current) return;
            setIsLoading(false);
            dispatch(hideMessage());
            notify.openNotificationWithIcon("error", "Error", success.message);
          }
        })
        .catch((err) => {
          if (!mountedRef.current) return;
          notify.openNotificationWithIcon(
            "error",
            "Fail",
            "Incorrect Password",
          );
          dispatch(hideMessage());
          message.error("error", "Fail", "User not authorized");
          console.log(err);
          setIsLoading(false);
        });
    } catch (error) {
      if (!mountedRef.current) return;
      dispatch(hideMessage());
      setIsLoading(false);
      console.log("---->>", error);
      notify.openNotificationWithIcon("error", "Error", error);
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     dispatch(hideMessage());
  //   }, 100);
  // });

  useEffect(() => {
    const objectString = localStorage.getItem("admin-cred");
    if (objectString) {
      const data2 = JSON.parse(objectString);
      setData(data2);
      setChecked(true);
    }
  }, []);

  // const Background =
  //   "https://c1.wallpaperflare.com/preview/1015/974/530/landscape-vacation-nature-adventure.jpg";

  return (
    <div
      className="gx-app-login-wrap"
      style={{
        //  backgroundImage: `url(${Background})`,
        backgroundColor: "rgb(4 74 143)",
        backgroundSize: "cover",
      }}
    >
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div style={{ padding: "35px 35px 20px", width: "100%" }}>
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              TES
            </Typography.Title>
            <Form
              fields={[
                {
                  name: ["email"],
                  value: data.email,
                },
                {
                  name: ["password"],
                  value: data.password,
                },
              ]}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "The input is not valid User Name !",
                  },
                ]}
                name="email"
              >
                <label style={{ fontSize: "20px" }}>User Name</label>

                <Input
                  style={{ marginTop: "10PX" }}
                  placeholder="User Name"
                  name="email"
                  onChange={handelChange}
                  value={data?.email}
                />
              </Form.Item>
              <Form.Item
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
                name="password"
              >
                <label style={{ fontSize: "20px" }}>Password</label>
                <Input.Password
                  style={{ marginTop: "10PX" }}
                  type="password"
                  placeholder="Password"
                  value={data?.password}
                  name="password"
                  onChange={handelChange}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <div className="gx-form-row0">
                  <Checkbox onChange={onChange} checked={checked} />
                  <span> Remember Me</span>
                </div>
                <Button
                  loading={isLoading}
                  block
                  type="primary"
                  className="gx-mb-0 gx-mt-2"
                  style={{
                    backgroundColor: "rgb(4 74 143)",
                    color: "white",
                    fontSize: "20px",
                    height: "50px",
                  }}
                  htmlType="submit"
                >
                  <IntlMessages id="app.userAuth.signIn" />
                </Button>
              </Form.Item>
            </Form>
          </div>
          {loader ? (
            <div className="gx-loader-view">
              <CircularProgress />
            </div>
          ) : null}
          {showMessage ? message.error(alertMessage.toString()) : null}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
