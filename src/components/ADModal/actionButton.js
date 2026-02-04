import { Button } from "antd";
import React from "react";

const ActionButton = ({
  decline,
  hasError,
  isButtonDisabled,
  data,
  selectedTransectiondata,
  handleApprove,
  handleDecline,
  userType,
  isAmountChanged,
  isUtrIdChanged,
  isImage,
  amountError,
  form,
}) => {
  // Helper function for common validations
  const hasFormErrors = () =>
    hasError ||
    amountError ||
    isButtonDisabled ||
    form.getFieldsError().some((field) => field.errors.length > 0);

  const isChangeAmountOrUTR = () =>
    (isAmountChanged || isUtrIdChanged) && !isImage;

  const isDataInvalid = () => {
    const isCryptoOrDigitalRupee =
      selectedTransectiondata?.reqType === "crypto" ||
      selectedTransectiondata?.reqType === "digital rupee";
    return (
      data?.password === "" || (!isCryptoOrDigitalRupee && data?.utrId === "")
    );
  };

  // Common disabled condition logic
  const isDisabledApprove =
    hasFormErrors() || isDataInvalid() || isChangeAmountOrUTR();

  const isDisabldeDecline =
    hasFormErrors() ||
    data?.password === "" ||
    data?.utrId === "" ||
    data?.remarks === "";

  // Determine button properties dynamically
  const buttonProps = {
    type: decline ? undefined : "primary",
    style: {
      backgroundColor: decline ? "red" : undefined,
      color: "white",
      padding: "0 40px",
    },
    disabled: decline ? isDisabldeDecline : isDisabledApprove,
    onClick: decline ? handleDecline : handleApprove,
    text: decline ? "Decline" : "Approve",
  };

  return (
    <Button
      type={buttonProps.type}
      style={buttonProps.style}
      disabled={buttonProps.disabled}
      onClick={buttonProps.onClick}
    >
      {buttonProps.text}
    </Button>
  );
};

export default ActionButton;
