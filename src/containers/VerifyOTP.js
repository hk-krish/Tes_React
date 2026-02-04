import React, { useEffect, useState } from "react";
import { Button, Form, Alert, Input, Divider, Card, message } from "antd";
import notify from "../Notification";
import "./Auth.css";
import { OTPverification } from "../hooks/AuthHooks";
import { useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSignInSuccess, hideMessage } from "../appRedux/actions/Auth";

const FormItem = Form.Item;
const Meta = Card.Meta;

const VerifyOTP = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signinUserOtp } = OTPverification();
  const { loader, alertMessage, showMessage, authUser } = useSelector(
    ({ auth }) => auth,
  );
  const [otpData, setOtpData] = useState("");

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        dispatch(hideMessage());
      }, 100);
    }
    if (authUser !== null) {
      history.push("/");
    }
  }, []);

  const handleSubmit = () => {
    setError("");
    // e.preventDefault();
    setSubmitted(true);
    verifyOTP();
  };

  const verifyOTP = async () => {
    setLoadingData(true);
    signinUserOtp({
      variables: {
        otp: otpData,
        email: props.location.state.email,
      },
    })
      .then((res) => {
        if (res.error) {
          setLoadingData(false);
          console.log(res.error.message);
          notify.openNotificationWithIcon("error", "Fail", res.error.message);
        } else {
          setLoadingData(false);
          console.log(res);
          if (res.data.verifyOtp.status_code === 200) {
            dispatch(userSignInSuccess(res));
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "Signin has been successfully done",
            );
            window.localStorage.setItem("auth_token", res.data.verifyOtp.token);
            history.push("/");
          } else {
            notify.openNotificationWithIcon(
              "error",
              "Fail",
              "User not authorized",
            );
          }
        }
      })
      .catch((error) => {
        console.error("Error ", error);
      });
    setLoadingData(false);
    setSubmitted(false);
  };

  const handleCancel = () => {
    history.replace("/");
  };

  return (
    <div
      className="gx-login-container auth-bg"
      style={{ backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
    >
      <div className="gx-login-content">
        <Form
          onFinish={handleSubmit}
          className="gx-login-form gx-form-row0"
          layout="vertical"
        >
          <div className="gx-login-header gx-text-center">
            <h1 className="gx-login-title" style={{ textAlign: "left" }}>
              <span>2-Step Verification</span>
            </h1>
          </div>
          {error && (
            <FormItem>
              <Alert message={error} type="error" closable />
            </FormItem>
          )}
          <FormItem>
            <FormItem label="ENTER YOUR VERIFICATION CODE">
              <Input
                onChange={(e) => setOtpData(e.target.value)}
                size="small"
              />
            </FormItem>
          </FormItem>
          <Divider />
          <Card
            style={{ marginTop: 16 }}
            bordered={false}
            bodyStyle={{ padding: 0 }}
          >
            <Meta
              description={`Open your email to check your verification code so that we know it's you.`}
            />
          </Card>
          <FormItem className="gx-text-center">
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingData}
              size="large"
            >
              Verify
            </Button>
            <Button
              htmlType="button"
              disabled={loadingData}
              size="large"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </FormItem>
        </Form>
      </div>
      {loader ? <div className="gx-loader-view"></div> : null}
      {showMessage ? message.error(alertMessage.toString()) : null}
    </div>
  );
};

export default withRouter(VerifyOTP);
