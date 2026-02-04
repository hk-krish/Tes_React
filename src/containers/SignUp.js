import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import IntlMessages from "util/IntlMessages";
import {
  hideAuthLoader,
  hideMessage,
  showAuthLoader,
} from "../appRedux/actions/Auth";
import CircularProgress from "../components/CircularProgress";
// import SingUpService from '../service/SignupService';
import { Link } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const { loader, alertMessage, showMessage } = useSelector(({ auth }) => auth);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    userName: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setTimeout(() => {
      dispatch(hideMessage());
    }, 100);
  });

  const onFinishFailed = (errorInfo) => {
    dispatch(hideAuthLoader());
    setIsLoading(false);
    console.log("Failed:", errorInfo);
  };

  const onFinish = async () => {
    setIsLoading(true);
    // dispatch(showAuthLoader());
    // await SingUpService.SingUp({
    //     userName: data.userName,
    //     first_name: data.first_name,
    //     last_name: data.last_name,
    //     email: data.email,
    //     password: data.password,
    // })
    //     .then((response) => {
    //         if (response.status === 200) {
    //             localStorage.setItem('token', response.access)
    //             notify.openNotificationWithIcon('success', 'Success', "Signup has been successfully done");
    //             setTimeout(() => {
    //                 history.push('/signIn');
    //             }, 2000);
    //         } else if (response.status === 401) {
    //             notify.openNotificationWithIcon('error', 'Error', response.message);
    //         }
    //         setIsLoading(false)
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })
  };

  const handleSubmitData = async (e) => {
    setData({ ...data, [e.name]: e.value });
  };

  const Background =
    "https://c1.wallpaperflare.com/preview/1015/974/530/landscape-vacation-nature-adventure.jpg";

  return (
    <div
      className="gx-app-login-wrap"
      style={{ backgroundImage: `url(${Background})`, backgroundSize: "cover" }}
    >
      <div className="gx-app-login-container">
        <div className="gx-app-login-main-content">
          <div className="gx-app-logo-content">
            <div className="gx-app-logo-content-bg">
              <img
                src={
                  "https://c4.wallpaperflare.com/wallpaper/919/575/783/nature-landscape-lake-mountains-wallpaper-preview.jpg"
                }
                alt="Neature"
              />
            </div>
            <div className="gx-app-logo-wid" style={{ marginTop: "40%" }}>
              <h1>
                <IntlMessages id="app.userAuth.signUp" />
              </h1>
              <p>
                Complete the form to start your Account. Our team will be in
                touch to help you make the most of your trial.
              </p>
              <p>
                <IntlMessages id="app.userAuth.getAccount" />
              </p>
            </div>
          </div>
          <div className="gx-app-login-content">
            <Form
              initialValues={{ remember: true }}
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="gx-signin-form gx-form-row0"
            >
              <Form.Item
                rules={[
                  { required: true, message: "Please Enter your Username!" },
                ]}
                name="userName"
              >
                <Input
                  type="text"
                  placeholder="Enter Your Username"
                  onChange={(e) =>
                    handleSubmitData({
                      name: "userName",
                      value: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                // initialValue="Enter Your Name"
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
                name="first_name"
              >
                <Input
                  type="text"
                  placeholder="Enter Your Name"
                  onChange={(e) =>
                    handleSubmitData({
                      name: "first_name",
                      value: e.target.value,
                    })
                  }
                />
              </Form.Item>

              <Form.Item
                // initialValue="Enter Your Surname"
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
                name="last_name"
              >
                <Input
                  type="text"
                  placeholder="Enter Your Surname"
                  onChange={(e) =>
                    handleSubmitData({
                      name: "last_name",
                      value: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item
                // initialValue="Enter Your Email"
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
                name="email"
              >
                <Input
                  type="email"
                  placeholder="Enter Your Email"
                  onChange={(e) =>
                    handleSubmitData({ name: "email", value: e.target.value })
                  }
                />
              </Form.Item>
              <Form.Item
                // initialValue="Enter Your Password"
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
                name="password"
              >
                <Input
                  type="password"
                  placeholder="Enter Your Password"
                  onChange={(e) =>
                    handleSubmitData({
                      name: "password",
                      value: e.target.value,
                    })
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  loading={isLoading}
                  type="primary"
                  className="gx-mb-0"
                  htmlType="submit"
                >
                  <IntlMessages id="app.userAuth.signUp" />
                </Button>
              </Form.Item>
            </Form>
            <div className="gx-form-row0">
              <span style={{ fontSize: "16px" }}>
                {" "}
                Already on Admin? <Link to="/signIn">SignIn</Link>
              </span>
            </div>
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

export default SignUp;
