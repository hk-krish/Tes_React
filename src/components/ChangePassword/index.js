import React, { useRef, useState } from "react";
import { message, Button, Modal, Card, Form, Input } from "antd";
import { useSelector } from "react-redux";
import CircularProgress from "../CircularProgress";
import notify from "../../../src/Notification";
import AuthService from "../../service/AuthService";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
// import bcrypt from 'bcryptjs';

const ChangePassword = (props) => {
  let title = "Change Password";

  const [data, setData] = useState({
    oldpassword: "",
    password: "",
    cpassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { loader, alertMessage, user, showMessage } = useSelector(
    ({ auth }) => auth,
  );
  const formRef = useRef();
  const onFinish = async () => {
    // if (data?.oldpassword !== user.password) {
    //   notify.openNotificationWithIcon(
    //     "error",
    //     "Error",
    //     "Your old password is not matched!"
    //   );
    //   return;
    // }
    setIsLoading(true);
    const updateData = {
      _id: user._id,
      oldPassword: data?.oldpassword,
      newPassword: data?.password,
    };

    await AuthService.editAdmin(updateData)
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          setIsLoading(false);
          window.localStorage.setItem(
            "user",
            JSON.stringify({ ...user, password: data.password }),
          );
          // dispatch(userSignInDataSuccess({ ...user, password: data.password }))
          setData({
            oldpassword: "",
            password: "",
            cpassword: "",
          });
          formRef.current.setFieldsValue({
            oldpassword: "",
            password: "",
            cpassword: "",
          });

          notify.openNotificationWithIcon(
            "success",
            "Success",
            "Your password has been successfully Updated",
          );

          //update cred in localStorage
          const oldCred = window.localStorage.getItem("admin-cred");
          if (oldCred) {
            const stringData = JSON.parse(oldCred);
            const newCred = {
              email: stringData.email,
              password: data.password,
            };
            const stringifyData = JSON.stringify(newCred);
            localStorage.setItem("admin-cred", stringifyData);
          }
          // props.setSelectedKeys(props.selectedKeys)
          props.setVisibleModal(false);
        } else {
          notify.openNotificationWithIcon("error", "Error", response.message);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        notify.openNotificationWithIcon("error", "Error", err);
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    setData({
      ...data,
      [name]:
        !isNaN(parseFloat(value)) && isFinite(value) ? parseInt(value) : value,
    });
  };

  return (
    <Modal
      title={null}
      closable={false}
      onCancel={() => {
        setData({
          oldpassword: "",
          password: "",
          cpassword: "",
        });

        props.setVisibleModal(false);
      }}
      visible={props.visibleModal}
      destroyOnClose={true}
      footer={null}
    >
      <Card title={title} style={{ marginBottom: "0px" }}>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 900 }}
          initialValues={data}
          ref={formRef}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Old Password"
            name="oldpassword"
            rules={[
              {
                required: data?.oldpassword === "",
                message: "Please enter your old password!",
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter Old Password"
              value={data?.oldpassword}
              name="oldpassword"
              id="oldpassword"
              onChange={handleInputChange}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          {/* <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: data?.password === "",
                message: "Please enter your new password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters long.",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+$/,
                message:
                  "Password must include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.",
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter New Password"
              value={data.password}
              name="password"
              id="password"
              onChange={handleInputChange}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item> */}
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: data?.password === "",
                message: "Please enter your new password!",
              },
              {
                validator: (rule, value) => {
                  if (value.length < 6) {
                    return Promise.reject(
                      "Password must be at least 6 characters long and include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.",
                    );
                  }
                  if (
                    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+$/.test(
                      value,
                    )
                  ) {
                    return Promise.reject(
                      "Password must include 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.",
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter New Password"
              value={data.password}
              name="password"
              id="password"
              onChange={handleInputChange}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="cpassword"
            rules={[
              {
                required: data.cpassword === "",
                message: "Please enter your confirm password!",
              },
              {
                validator: (rule, value) => {
                  if (value && value !== data?.password) {
                    return Promise.reject(
                      "New password and confirm password are not match!",
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter Confirm Password"
              value={data.cpassword}
              name="cpassword"
              id="cpassword"
              onChange={handleInputChange}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{ offset: 16, span: 16 }}
            style={{ marginLeft: "20%" }}
          >
            <Button loading={isLoading} type="primary" htmlType="submit">
              {"Update"}
            </Button>
            <Button
              style={{ padding: "0 25px" }}
              type="primary"
              onClick={() => {
                setData({
                  oldpassword: "",
                  password: "",
                  cpassword: "",
                });
                props.setVisibleModal(false);
              }}
            >
              Close
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
    </Modal>
  );
};

export default ChangePassword;
