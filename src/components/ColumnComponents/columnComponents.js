import {
  AccountBookOutlined,
  BankOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileTextOutlined,
  GlobalOutlined,
  UserAddOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { Badge, Button, Form, Input, Tag, Tooltip } from "antd";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { onDateFormate } from "../../util/DateFormate";

const handleColor = (status) => {
  if (status === "verified") {
    return "yellow";
  } else if (status === "pending") {
    return "orange";
  } else if (
    status === "submitted" ||
    status === "approved" ||
    status === "success"
  ) {
    return "green";
  } else if (
    status === "rejected" ||
    status === "failed" ||
    status === "decline"
  ) {
    return "red";
  } else {
    return "blue";
  }
};

export const agentColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  sorter,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
  isEditPermission,
  isDeletePermission,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "userId",
    key: "userId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
    sorter: (a, b) => sorter(a?.name, b?.name),
  },
  {
    title: <div className="text-center"> Agent Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Email </div>,
    dataIndex: "email",
    key: "email",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
    sorter: (a, b) => sorter(a?.email, b?.email),
  },
  {
    title: <div className="text-center"> Phone Number </div>,
    dataIndex: "phone",
    key: "phone",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Password </div>,
    dataIndex: "password",
    key: "password",
    render: (text, record) => (
      <Tooltip
        className="tooltip-pointer-right"
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Transaction Password </div>,
    dataIndex: "transactionPassword",
    key: "transactionPassword",
    render: (text, record) => (
      <Tooltip
        className="tooltip-pointer-right"
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Max Deposit Time (In Seconds) </div>,
    dataIndex: "settings",
    key: "maxDepositLimit",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.maxDepositTime} </div>
    ),
    sorter: (a, b) => a?.settings?.maxDepositTime - b?.settings?.maxDepositTime,
  },
  {
    title: <div className="text-center"> Max Withdraw Time (In Seconds) </div>,
    dataIndex: "settings",
    key: "maxDepositLimit",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.maxWithdrawTime} </div>
    ),
    sorter: (a, b) =>
      a?.settings?.maxWithdrawTime - b?.settings?.maxWithdrawTime,
  },
  {
    title: <div className="text-center"> Created Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
    sorter: (a, b) => sorter(a?.createdAt, b?.createdAt),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <>
          {isEditPermission && (
            <div style={{ display: "flex" }}>
              <Button
                title={"Bank Accounts"}
                onClick={() => showConfirm(text, "bank")}
              >
                <BankOutlined />
              </Button>
              <Button
                title={"Operator"}
                onClick={() => showConfirm(text, "operator")}
              >
                <UserAddOutlined />
              </Button>
              <Button
                title={"Websites"}
                onClick={() => showConfirm(text, "website")}
              >
                <GlobalOutlined />
              </Button>
            </div>
          )}
          <div>
            {isEditPermission && (
              <>
                <Button
                  title={
                    data.find((a) => a?._id === text)?.isBlock
                      ? "Active"
                      : "Inactive"
                  }
                  onClick={() =>
                    onStatusChange({
                      _id: text,
                      isBlock: !data.find((a) => a?._id === text)?.isBlock,
                    })
                  }
                >
                  {data?.find((a) => a?._id === text)?.isBlock ? (
                    <div style={{ color: "red" }}>
                      <EyeInvisibleOutlined size={25} />
                    </div>
                  ) : (
                    <div style={{ color: "green" }}>
                      <EyeOutlined size={25} />
                    </div>
                  )}
                </Button>

                <Button
                  title={"Edit"}
                  onClick={() => showConfirm(text, "edit")}
                >
                  <EditOutlined />
                </Button>
              </>
            )}
            {isDeletePermission && (
              <Button
                title={"Delete"}
                onClick={() => showConfirm(text, "delete")}
              >
                <div style={{ color: "red" }}>
                  <DeleteOutlined />
                </div>
              </Button>
            )}
          </div>
        </>
      ) : (
        ""
      ),
  },
];

export const userColumns = (
  page,
  pageSize,
  showConfirm,
  fetchBankAccountData,
  setVisibleBankAccount,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> User Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "endUserId",
    key: "endUserId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "website",
    key: "website",
    render: (text) => <div className="text-right-nowrap"> {text?.name} </div>,
  },
  {
    title: <div className="text-center"> Website URL </div>,
    dataIndex: "website",
    key: "website",
    render: (text) => <div className="text-right-nowrap"> {text?.url} </div>,
  },
  {
    title: <div className="text-center"> Withdraw Count </div>,
    dataIndex: "withdrawCount",
    key: "withdrawCount",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
    sorter: (a, b) => a.withdrawCount - b.withdrawCount,
  },
  {
    title: <div className="text-center"> Deposit Count </div>,
    dataIndex: "depositCount",
    key: "depositCount",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
    sorter: (a, b) => a.depositCount - b.depositCount,
  },
  {
    title: <div className="text-center"> Account Details </div>,
    dataIndex: "totalData",
    key: "totalData",
    render: (text, record) => (
      <div className="text-center">
        <Button
          style={{ color: "green", textAlign: "center", marginTop: "15px" }}
          disabled={text !== 0 ? false : true}
          onClick={() => {
            fetchBankAccountData(record?._id);
            setVisibleBankAccount(true);
          }}
        >
          <p>{text}</p>
        </Button>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record) =>
      text ? (
        <div
          style={{ marginTop: "15px", display: "flex", flexDirection: "row" }}
        >
          <Button onClick={() => showConfirm(record, "transactionReport")}>
            <FileTextOutlined />
          </Button>
        </div>
      ) : (
        ""
      ),
  },
];

export const websiteColumns = (
  props,
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
  isEditPermission,
  isDeletePermission,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "agent._id",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "userId",
    key: "userId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Merchant ID </div>,
    dataIndex: "merchantId",
    key: "merchantId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Website Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  props.location.state?.id && props.location.state?.id[0]
    ? undefined
    : {
        title: <div className="text-center"> Agent Name </div>,
        dataIndex: "agentName",
        key: "agent._id",
        render: (text) => (
          <div className="text-right-nowrap"> {text ? text : "-"} </div>
        ),
      },
  {
    title: <div className="text-center"> Website URL </div>,
    dataIndex: "url",
    key: "url",
  },
  {
    title: <div className="text-center"> Password </div>,
    dataIndex: "password",
    key: "password",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Transaction Password </div>,
    dataIndex: "transactionPassword",
    key: "transactionPassword",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Max Deposit Time (In seconds) </div>,
    dataIndex: "settings",
    key: "settings",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.maxDepositTime / 1000} </div>
    ),
  },
  {
    title: <div className="text-center"> Max Withdraw Time (In seconds) </div>,
    dataIndex: "settings",
    key: "settings",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.maxWithdrawTime / 1000} </div>
    ),
  },
  {
    title: <div className="text-center"> Deposit Amount </div>,
    dataIndex: "settings",
    key: "settings",
    render: (text) =>
      text?.depositMinAmount || text?.depositMaxAmount ? (
        <div className="text-right-nowrap">
          {text?.depositMinAmount ? text?.depositMinAmount : "-"} to{" "}
          {text?.depositMaxAmount ? text?.depositMaxAmount : "-"}
        </div>
      ) : (
        "-"
      ),
  },
  {
    title: <div className="text-center"> Withdraw Amount </div>,
    dataIndex: "settings",
    key: "settings",
    render: (text) =>
      text?.withdrawMinAmount || text?.withdrawMaxAmount ? (
        <div className="text-right-nowrap">
          {" "}
          {text?.withdrawMinAmount ? text?.withdrawMinAmount : "-"} to{" "}
          {text?.withdrawMaxAmount ? text?.withdrawMaxAmount : "-"}
        </div>
      ) : (
        "-"
      ),
  },
  {
    title: <div className="text-center"> Created Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <div
          style={{ marginTop: "8px", display: "flex", flexDirection: "row" }}
        >
          {isEditPermission && (
            <>
              <Button
                title={
                  data.find((a) => a?._id === text)?.isBlock
                    ? "Active"
                    : "Inactive"
                }
                onClick={() =>
                  onStatusChange({
                    _id: text,
                    isBlock: !data.find((a) => a?._id === text)?.isBlock,
                  })
                }
              >
                {data.find((a) => a?._id === text)?.isBlock ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <div style={{ color: "green" }}>
                    <EyeOutlined size={25} />
                  </div>
                )}
              </Button>
              <Button
                title={"Bank Accounts"}
                onClick={() => showConfirm(text, "bank")}
              >
                <BankOutlined />
              </Button>
              <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
                <EditOutlined />
              </Button>
            </>
          )}
          {isDeletePermission && (
            <Button
              title={"Delete"}
              onClick={() => showConfirm(text, "delete")}
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
          )}
        </div>
      ) : (
        ""
      ),
  },
];

export const vendorColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
  isEditPermission,
  isDeletePermission,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "userId",
    key: "userId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Vendor Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Phone </div>,
    dataIndex: "phone",
    key: "phone",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Email </div>,
    dataIndex: "email",
    key: "email",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Password </div>,
    dataIndex: "password",
    key: "password",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer", textAlign: "right" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Transaction Password </div>,
    dataIndex: "transactionPassword",
    key: "transactionPassword",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Priority </div>,
    dataIndex: "priority",
    key: "priority",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <>
          {isEditPermission && (
            <div style={{ display: "flex" }}>
              <Button
                title={"Bank Accounts"}
                onClick={() => showConfirm(text, "bank")}
              >
                <BankOutlined />
              </Button>
              <Button
                title={"Operator"}
                onClick={() => showConfirm(text, "operator")}
              >
                <UserAddOutlined />
              </Button>
              <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
                <EditOutlined />
              </Button>
            </div>
          )}
          <div>
            {isEditPermission && (
              <Button
                title={
                  data.find((a) => a?._id === text)?.isBlock
                    ? "Active"
                    : "Inactive"
                }
                onClick={() =>
                  onStatusChange({
                    _id: text,
                    isBlock: !data.find((a) => a?._id === text)?.isBlock,
                  })
                }
              >
                {data.find((a) => a?._id === text)?.isBlock ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <div style={{ color: "green" }}>
                    <EyeOutlined size={25} />
                  </div>
                )}
              </Button>
            )}
            {isDeletePermission && (
              <Button
                title={"Delete"}
                onClick={() => showConfirm(text, "delete")}
              >
                <DeleteOutlined style={{ color: "red" }} />
              </Button>
            )}
          </div>
        </>
      ) : (
        ""
      ),
  },
];

export const operatorColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
  isEditPermission,
  isDeletePermission,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "userId",
    key: "userId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Operator Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Password </div>,
    dataIndex: "password",
    key: "password",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {" "}
          {"*".repeat(text.length)}{" "}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Transaction Password </div>,
    dataIndex: "transactionPassword",
    key: "transactionPassword",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {"*".repeat(text.length)}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Entity User Type </div>,
    dataIndex: "entityUserType",
    key: "entityUserType",
  },
  {
    title: <div className="text-center"> Entity User Name </div>,
    dataIndex: "entityDetails",
    key: "entityDetails",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.name ? text?.name : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> User Type </div>,
    dataIndex: "userType",
    key: "userType",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Full Access </div>,
    dataIndex: "hasFullAccess",
    key: "hasFullAccess",
    render: (text) => (
      <div className="text-right-nowrap">{text === true ? "Yes" : "No"}</div>
    ),
  },
  {
    title: <div className="text-center"> Operator Access </div>,
    dataIndex: "operatorCanFullFill",
    key: "operatorCanFullFill",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "No"} </div>
    ),
  },
  {
    title: <div className="text-center"> Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <div
          style={{ marginTop: "8px", display: "flex", flexDirection: "row" }}
        >
          {isEditPermission && (
            <>
              <Button
                title={
                  data.find((a) => a?._id === text)?.isBlock
                    ? "Active"
                    : "Inactive"
                }
                onClick={() =>
                  onStatusChange({
                    _id: text,
                    isBlock: !data.find((a) => a?._id === text)?.isBlock,
                  })
                }
              >
                {data.find((a) => a?._id === text)?.isBlock ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <div style={{ color: "green" }}>
                    <EyeOutlined size={25} />
                  </div>
                )}
              </Button>

              <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
                <EditOutlined />
              </Button>
            </>
          )}
          {isDeletePermission && (
            <Button
              title={"Delete"}
              onClick={() => showConfirm(text, "delete")}
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
          )}
        </div>
      ) : (
        ""
      ),
  },
];

export const depositQueueColumns = (
  page,
  pageSize,
  openAccount,
  setAccountData,
  setVisibleAccountDetails,
  setImageModalVisible,
  setImageUrl,
  handleOpen,
  handleColor,
  handleCopyToClipboard,
  depositWaitingQueue,
  showConfirm,
  setApproveVisable,
  setSelectedTrnasection,
  setDeclineVisable,
  depositVerifactionTab,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  depositVerifactionTab && {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      if (record?.isVerifyRequest) {
        return (
          <div className="text-right-nowrap">
            <div style={{ display: "flex" }}>
              <>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "green",
                    marginBottom: "0px",
                  }}
                  disabled={record?.status == "pending"}
                  onClick={() => {
                    setApproveVisable(true);
                    setSelectedTrnasection(record);
                  }}
                >
                  A{" "}
                </Button>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    marginBottom: "0px",
                  }}
                  disabled={record?.status == "pending"}
                  onClick={() => {
                    setDeclineVisable(true);
                    setSelectedTrnasection(record);
                  }}
                >
                  {" "}
                  D{" "}
                </Button>
              </>
            </div>
          </div>
        );
      } else {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    title: <div className="text-center"> Request Process </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record) => {
      if (window.location.pathname !== "/deposit-auto-queue") {
        return (
          <div className="text-right-nowrap">
            {record?.isDepositReqAutoApproval === false
              ? "Auto to Manual"
              : "Manual"}
            {record?.isDepositReqAutoAmountEqual === false && (
              <Tooltip title="Amount mismatch: move to manual">
                <img
                  alt=""
                  height="15px"
                  width="15px"
                  src={"/assets/images/warning-logo.png"}
                  style={{ marginRight: "15px", marginTop: "-2px" }}
                />
              </Tooltip>
            )}
          </div>
        );
      } else {
        return (
          <div className="text-right-nowrap">
            {" "}
            Move to Manual{" "}
            {record?.isDepositReqAutoAmountEqual === false && (
              <Tooltip title="Amount mismatch: move to manual">
                <img
                  alt=""
                  height="15px"
                  width="15px"
                  src={"/assets/images/warning-logo.png"}
                  style={{ marginRight: "15px", marginTop: "-2px" }}
                />
              </Tooltip>
            )}
          </div>
        );
      }
    },
  },
  depositVerifactionTab && {
    title: <div className="text-center"> History View </div>,
    dataIndex: "history",
    key: "history",
    render: (text, record) =>
      text && Object.keys(text).length > 0 ? (
        <div className="text-center">
          <Button
            title={"Edit"}
            onClick={() => showConfirm(text, "view")}
            style={{ color: "green", margin: "0" }}
          >
            <EyeOutlined />
          </Button>
        </div>
      ) : (
        <div className="text-center">-</div>
      ),
  },
  {
    title: <div className="text-center"> UTR Id </div>,
    dataIndex: "transactionId",
    key: "transactionId",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {record?.reqType === "crypto" ? (
          "-"
        ) : record?.reqType === "upi" ? (
          <>
            {text ? (
              <CopyToClipboard text={text.slice(0, 5)}>
                <div className="font-bold-nowrap">
                  {text}
                  {record?.upiId
                    ? `[${record?.upiId ? record?.upiId : "-"}]`
                    : ""}{" "}
                  <CopyOutlined
                    onClick={() => handleCopyToClipboard(text.slice(0, 5))}
                    className="text-black-pointer"
                  />
                </div>
              </CopyToClipboard>
            ) : (
              "-"
            )}
          </>
        ) : (
          <div className="text-right-nowrap">
            {text ? (
              <CopyToClipboard text={text}>
                <div className="font-bold-nowrap">
                  {" "}
                  {text}{" "}
                  <CopyOutlined
                    onClick={() => handleCopyToClipboard(text)}
                    className="text-black-pointer"
                  />
                </div>
              </CopyToClipboard>
            ) : (
              "-"
            )}
          </div>
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> UTR Transaction Id </div>,
    dataIndex: "gatewayTraId",
    key: "gatewayTraId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div className="font-bold-nowrap">
              {" "}
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  depositVerifactionTab && {
    title: <div className="text-center"> Change UTR Transaction ID </div>,
    dataIndex: "changeGatewayTraId",
    key: "changeGatewayTraId",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div className="font-bold-nowrap ">
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          <div className="text-center">-</div>
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div style={{ whiteSpace: "nowrap" }}>
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "user",
    key: "user",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.userName
          ? text?.userName
          : text?.endUserId
            ? text?.endUserId
            : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Id </div>,
    dataIndex: "user",
    key: "user",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.uniqueId ? text?.uniqueId : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "website",
    key: "website",
    render: (text) => (
      <div className="text-line-height">
        <div> {text?.name || "-"} </div>
        <div style={{ fontSize: "12px" }}> {text?.uniqueId || "-"} </div>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Receiver name </div>,
    dataIndex: "created",
    key: "created",
    render: (_, record) => {
      if (record?.paymentGatewayId) {
        return <div className="text-right-nowrap"> PG </div>;
      }

      if (record?.created?.name) {
        return (
          <div className="text-line-height">
            <div>{`${record?.created?.name}`}</div>
            <div
              style={{ fontSize: "12px" }}
            >{`${record?.created?.uniqueId}`}</div>
          </div>
        );
      } else {
        return <div className="text-right-nowrap"> Live User </div>;
      }
    },
  },
  {
    title: <div className="text-center"> Receiver Type </div>,
    dataIndex: "depositAccountOwnerType",
    key: "depositAccountOwnerType",
    render: (_, record) => {
      if (record.paymentGatewayId) {
        return <div className="text-right-nowrap"> PG </div>;
      }
      if (record?.depositAccountOwnerType === "website") {
        return <div className="text-right-nowrap"> Website </div>;
      } else if (record?.depositAccountOwnerType === "agent") {
        return <div className="text-right-nowrap"> Agent </div>;
      } else if (record?.depositAccountOwnerType === "vendor") {
        return <div className="text-right-nowrap"> Vendor </div>;
      } else if (record?.depositAccountOwnerType === "user") {
        return <div className="text-right-nowrap"> User </div>;
      } else if (record?.depositAccountOwnerType === "admin") {
        return <div className="text-right-nowrap"> Admin </div>;
      }
      return "";
    },
  },
  {
    title: <div className="text-center"> Payment Gateway </div>,
    dataIndex: "paymentGatewayName",
    key: "paymentGatewayName",
    render: (_, text) =>
      text?.paymentGateway?.name ? text?.paymentGateway?.name : "-",
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  depositVerifactionTab && {
    title: <div className="text-center"> User Amount </div>,
    dataIndex: "changeAmount",
    key: "changeAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Received Amount </div>,
    dataIndex: "receivedAmount",
    key: "receivedAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Coin </div>,
    dataIndex: "coinId",
    key: "coinId",
    render: (text, record) => (record?.coin ? record.coin.name : "-"),
  },
  {
    title: <div className="text-center"> Crypto Amount </div>,
    dataIndex: "conversionToUSDT",
    key: "conversionToUSDT",
    render: (text, record) =>
      record?.coin?.conversionToUSDT
        ? `${((record?.amount + record?.coinNetwork?.networkFee) / record?.coin?.conversionToUSDT).toFixed(record?.coin?.decimalDigit)}`
        : "-",
  },
  {
    title: <div className="text-center"> Coin Network </div>,
    dataIndex: "coinNetworkId",
    key: "coinNetworkId",
    render: (text, record) =>
      record?.coinNetwork ? record.coinNetwork.name : "-",
  },
  {
    title: <div className="text-center"> Transaction Process </div>,
    dataIndex: "isManualDepositOrder",
    key: "isManualDepositOrder",
    render: (text) => (
      <div className="text-right-nowrap">{text ? "Link" : "Website"}</div>
    ),
  },
  {
    title: <div className="text-center"> Account Details </div>,
    dataIndex: "depositAccount",
    key: "depositAccount",
    render: (text, record) => (
      <>
        <div
          className="eye-button"
          onClick={() => {
            setAccountData(record);
            setVisibleAccountDetails(true);
            handleOpen(record);
          }}
        >
          {record?._id == openAccount ? (
            <div style={{ color: "red" }}>
              <EyeInvisibleOutlined size={25} />
            </div>
          ) : (
            <EyeOutlined size={25} />
          )}
        </div>
        <p
          style={{
            fontSize: "12px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {record?.paymentGateway ? record.paymentGateway?.name : text?.name}
        </p>
      </>
    ),
  },
  {
    title: <div className="text-center"> Request Type </div>,
    dataIndex: "reqType",
    key: "reqType",
    render: (text) => (
      <div className="text-right-nowrap">{text ? text?.toUpperCase() : ""}</div>
    ),
  },
  (depositVerifactionTab || depositWaitingQueue) && {
    title: <div className="text-center"> Action By </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => {
      if (text) {
        return <div className="text-center"> {text?.name} </div>;
      } else {
        return <div className="text-center"> - </div>;
      }
    },
  },
  {
    title: <div className="text-center"> Image </div>,
    dataIndex: "paymentSS",
    key: "paymentSS",
    render: (text, record) =>
      text ? (
        <Button
          style={{ marginBottom: "0px" }}
          title={"Download"}
          onClick={() => {
            setImageModalVisible(true);
            setImageUrl(text);
          }}
        >
          <DownloadOutlined />
        </Button>
      ) : (
        <div style={{ textAlign: "center" }}> - </div>
      ),
  },
  {
    title: (
      <div className="text-center">
        {" "}
        Date(req creation Date, updation date){" "}
      </div>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-right-nowrap">
        <Tooltip title="Created At">
          <p style={{ margin: "0" }}>
            {text ? onDateFormate(text, "DD-MM-YYYY hh:mm:ss A") : "-"}
          </p>
        </Tooltip>
        <Tooltip title="Submission Time">
          <p style={{ margin: "0" }}>
            {text
              ? onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")
              : "-"}
          </p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    key: "status",
    dataIndex: "status",
    render: (status) => (
      <span>
        {
          <Tag color={handleColor(status)} key={status}>
            {status?.toUpperCase()}
          </Tag>
        }
      </span>
    ),
  },
  depositWaitingQueue && {
    title: <div className="text-center">Waiting Time</div>,
    dataIndex: "depositWaitingTime",
    key: "depositWaitingTime",
    render: (text, record) => (
      <div className="text-right-nowrap">
        <Tooltip title="Waiting Time">
          <p style={{ margin: "0" }}>
            {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Remark </div>,
    dataIndex: "remark",
    key: "remark",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  depositWaitingQueue && {
    title: <div className="text-center">Waiting Time</div>,
    dataIndex: "depositWaitingTime",
    key: "depositWaitingTime",
    render: (text, record) => (
      <div className="text-right-nowrap">
        <Tooltip title="Waiting Time">
          <p style={{ margin: "0" }}>
            {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
      </div>
    ),
  },
];

export const withdrawQueueColumns = (
  page,
  location,
  pageSize,
  handleColor,
  handleCopyToClipboard,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> Payment Gateway </div>,
    dataIndex: "paymentGateway",
    key: "paymentGateway",
    render: (text, record) => {
      if (record?.status === "verified" && record?.paymentGateway) {
        return (
          <>
            {" "}
            <Tooltip title="Payment Gateway">
              {" "}
              <div className="text-right-nowrap">
                <div>{record?.paymentGateway?.name}</div>{" "}
                <div style={{ fontSize: "12px" }}>
                  {" "}
                  <Tag style={{ margin: "0px" }} color="red">
                    {" "}
                    Failed
                  </Tag>
                </div>
              </div>
            </Tooltip>
          </>
        );
      } else if (record?.status === "pgInProcess" && record?.paymentGateway) {
        return <div className="text-center">{text?.name}</div>;
      } else {
        return <div className="text-center"> - </div>;
      }
    },
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div style={{ whiteSpace: "nowrap" }}>
              {" "}
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "user",
    key: "user",
    render: (text) => (
      <div className="text-center">
        {text?.userName
          ? text?.userName
          : text?.endUserId
            ? text?.endUserId
            : "-"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Id </div>,
    dataIndex: "user",
    key: "user",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.uniqueId ? text?.uniqueId : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "website",
    key: "website",
    render: (text) => (
      <div className="text-line-height">
        <div> {text?.name || "-"} </div>
        <div style={{ fontSize: "12px" }}> {text?.uniqueId || "-"} </div>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Receiver name </div>,
    dataIndex: "data",
    key: "data",
    render: (_, record) => {
      if (record?.isForLiveUser === true) {
        return location.pathname === "/withdraw-pending-report" ? (
          <div className="text-right-nowrap"> - </div>
        ) : (
          <div className="text-right-nowrap"> Live Depositer </div>
        );
      } else if (record?.status === "pgInProcess") {
        return <div className="text-right-nowrap"> PG </div>;
      } else if (record?.vendorId) {
        return (
          <div className="text-line-height">
            {" "}
            <div> {`${record?.vendor?.name}`} </div>
            <div style={{ fontSize: "12px" }}>
              {" "}
              {`${record?.vendor?.uniqueId}`}{" "}
            </div>
          </div>
        );
      } else if (record?.agentId) {
        return (
          <div className="text-line-height">
            {" "}
            <div> {`${record?.agent?.name}`} </div>{" "}
            <div
              style={{ fontSize: "12px" }}
            >{`${record?.agent?.uniqueId}`}</div>
          </div>
        );
      } else if (record?.agentId === null && record?.vendorId === null) {
        return (
          <div className="text-line-height">
            {" "}
            <div>{`${record?.website?.name}`}</div>{" "}
            <div style={{ fontSize: "12px" }}>
              {" "}
              {`${record?.website?.uniqueId}`}{" "}
            </div>{" "}
          </div>
        );
      }
      return "";
    },
  },
  {
    title: <div className="text-center"> Receiver Type </div>,
    dataIndex: "data",
    key: "data",
    render: (_, record) => {
      if (record?.isForLiveUser === true) {
        return location.pathname === "/withdraw-pending-report" ? (
          <div className="text-right-nowrap"> - </div>
        ) : (
          <div className="text-right-nowrap"> User </div>
        );
      } else if (record?.status === "pgInProcess") {
        return <div className="text-right-nowrap"> PG </div>;
      } else if (record?.vendorId) {
        return <div className="text-right-nowrap"> Vendor </div>;
      } else if (record?.agentId) {
        return <div className="text-right-nowrap"> Agent </div>;
      } else if (record?.agentId === null && record?.vendorId === null) {
        return <div className="text-right-nowrap"> Website </div>;
      }
      return "";
    },
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Transaction Process </div>,
    dataIndex: "isManualWithdrawOrder",
    key: "isManualWithdrawOrder",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? "Link" : "Website"} </div>
    ),
  },
  {
    title: <div className="text-center"> Pending Amount </div>,
    dataIndex: "pendingAmount",
    key: "pendingAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Paid Amount </div>,
    dataIndex: "paidAmount",
    key: "paidAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Account Type </div>,
    dataIndex: "reqType",
    key: "reqType",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.toUpperCase()} </div>
    ),
  },
  {
    title: <div className="text-center"> UPI ID </div>,
    dataIndex: "accountId",
    key: "bankName",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.upiId ? text?.upiId : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Bank Name </div>,
    dataIndex: "accountId",
    key: "bankName",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.bankName ? text?.bankName : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Bank Holder Name </div>,
    dataIndex: "accountId",
    key: "accName",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.accHolderName ? text?.accHolderName : "-"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Account No </div>,
    dataIndex: "accountId",
    key: "accno",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text?.accountNum ? text?.accountNum : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> IFSC </div>,
    dataIndex: "accountId",
    key: "ifsc",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.ifsc ? text?.ifsc : "-"} </div>
    ),
  },
  {
    title: (
      <div className="text-center">
        {" "}
        Date(req creation Date, updation date){" "}
      </div>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-right-nowrap">
        <Tooltip title="Created At">
          <p style={{ margin: "0px" }}>
            {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
        <Tooltip title="Updated At">
          <p style={{ margin: "0px" }}>
            {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Expired Time </div>,
    dataIndex: "expiry",
    key: "expiry",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    key: "status",
    dataIndex: "status",
    render: (status) => (
      <span>
        <Tag color={handleColor(status)} key={status}>
          {status?.toUpperCase()}
        </Tag>
      </span>
    ),
  },
];

export const depositeReportColumns = (
  page,
  pageSize,
  openAccount,
  setAccountData,
  setVisibleAccountDetails,
  handleOpen,
  setImageUrl,
  setImageModalVisible,
  calculatedTimeDifference,
  handleCopyToClipboard,
  showConfirm,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> Request Process </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {record?.isDepositReqAutoApproval
          ? "Auto"
          : record?.isDepositReqAutoApproval === false
            ? "Auto to Manual"
            : "Manual"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> UTR Id </div>,
    dataIndex: "transactionId",
    key: "transactionId",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {record?.reqType === "crypto" ? (
          "-"
        ) : record?.reqType === "upi" ? (
          text ? (
            <CopyToClipboard text={text.slice(0, 5)}>
              <div className="font-bold-nowrap">
                {" "}
                {text}{" "}
                {record?.upiId
                  ? `[${record?.upiId ? record?.upiId : "-"}]`
                  : ""}{" "}
                <CopyOutlined
                  onClick={() => handleCopyToClipboard(text.slice(0, 5))}
                  className="text-black-pointer"
                />
              </div>
            </CopyToClipboard>
          ) : (
            "-"
          )
        ) : text ? (
          <CopyToClipboard text={text}>
            <div className="font-bold-nowrap ">
              {" "}
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> UTR Transaction Id </div>,
    dataIndex: "gatewayTraId",
    key: "gatewayTraId",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div className="font-bold-nowrap ">
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Change UTR Transaction ID </div>,
    dataIndex: "changeGatewayTraId",
    key: "changeGatewayTraId",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div className="font-bold-nowrap ">
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          <div className="text-center">-</div>
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div style={{ whiteSpace: "nowrap" }}>
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text) => (
      <div className="text-center">
        {" "}
        {text?.userName ? text?.userName : text?.name ? text?.name : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Id </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text) => (
      <div className="text-right-nowrap">
        {text?.uniqueId ? text?.uniqueId : ""}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Website name </div>,
    dataIndex: "senderWebsite",
    key: "senderWebsite",
    render: (text, record) => (
      <div className="text-line-height">
        <div> {text?.name ? text?.name : "-"} </div>
        <div style={{ fontSize: "12px" }}>
          {" "}
          {text?.uniqueId ? text?.uniqueId : "-"}{" "}
        </div>{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> User Amount </div>,
    dataIndex: "changeAmount",
    key: "changeAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Received Amount </div>,
    dataIndex: "receivedAmount",
    key: "receivedAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Coin </div>,
    dataIndex: "coinId",
    key: "coinId",
    render: (text, record) => (record?.coin ? record?.coin?.name : "-"),
  },
  {
    title: <div className="text-center"> Crypto Amount </div>,
    dataIndex: "conversionToUSDT",
    key: "conversionToUSDT",
    render: (text, record) =>
      record?.coin?.conversionToUSDT
        ? `${((record?.amount + record?.coinNetwork?.networkFee) / record?.coin?.conversionToUSDT).toFixed(record?.coin?.decimalDigit)}`
        : "-",
  },
  {
    title: <div className="text-center"> Coin Network </div>,
    dataIndex: "coinNetworkId",
    key: "coinNetworkId",
    render: (text, record) =>
      record?.coinNetwork ? record?.coinNetwork?.name : "-",
  },
  {
    title: <div className="text-center"> Transaction Process </div>,
    dataIndex: "isManualOrder",
    key: "isManualOrder",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? "Link" : "Website"} </div>
    ),
  },
  {
    title: <div className="text-center"> Receiver Name </div>,
    dataIndex: "receiver",
    key: "receiver",
    render: (text, record) => {
      if (record?.paymentGateway) {
        return (
          <div className="text-right-nowrap">
            <span>PG</span>
          </div>
        );
      } else if (record?.receiverAccountOwnerType === "user") {
        if (text?.name || text?.websiteName) {
          return (
            <div className="text-right-nowrap">
              <div className="text-line-height">
                <Tooltip title="User Name">
                  <div>{text?.name ? text?.name : "-"}</div>
                </Tooltip>
                <Tooltip title="Website Name">
                  <div>{text?.websiteName ? text?.websiteName : "-"}</div>
                </Tooltip>
              </div>
            </div>
          );
        } else {
          return <div className="text-center">-</div>;
        }
      } else {
        return (
          <div className="text-right-nowrap">
            <div className="text-line-height">
              <div>{text?.name?.toUpperCase()}</div>
              <div style={{ fontSize: "12px" }}>
                {text?.uniqueId?.toUpperCase()}
              </div>
            </div>
          </div>
        );
      }
    },
  },
  {
    title: <div className="text-center"> Receiver Type </div>,
    dataIndex: "receiverAccountOwnerType",
    key: "receiverAccountOwnerType",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {record?.paymentGateway ? <span>PG</span> : text?.toUpperCase()}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Payment Gateway </div>,
    dataIndex: "paymentGateway",
    key: "paymentGateway",
    render: (text) => (
      <div className="text-right-nowrap">{text?.name ? text?.name : "-"}</div>
    ),
  },
  {
    title: <div className="text-center"> Account Type(UPI/Bank) </div>,
    dataIndex: "reqType",
    key: "reqType",
    render: (text) => (
      <div className="text-right-nowrap"> {text?.toUpperCase()} </div>
    ),
  },
  {
    title: <div className="text-center"> Action By </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => {
      if (record?.isPaymentGatewaySuccess) {
        return <div className="text-center"> PG </div>;
      } else if (text) {
        if (text?.userType === "admin") {
          return <div className="text-center"> TES </div>;
        } else {
          return <div className="text-center"> {text?.name} </div>;
        }
      } else if (record?.receiver?.name) {
        return <div className="text-center"> {record?.receiver?.name} </div>;
      } else {
        return <div className="text-center"> - </div>;
      }
    },
  },
  {
    title: <div className="text-center"> Date(Updated Date,Action Date) </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {" "}
        {record?.receiverAccountOwnerType === "user" ? (
          <Tooltip title="Updated At">
            <p style={{ margin: "0" }}>
              {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}
            </p>
          </Tooltip>
        ) : (
          <>
            <Tooltip title="Updated Date">
              <p style={{ margin: "0" }}>
                {onDateFormate(
                  record?.paymentGateway?.name === "now"
                    ? record?.depositReqCreatedAt
                    : record?.createdAt,
                  "DD-MM-YYYY hh:mm:ss A",
                )}
              </p>
            </Tooltip>
            <Tooltip title="Action Date">
              <p style={{ margin: "0" }}>
                {" "}
                {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}{" "}
              </p>
            </Tooltip>
          </>
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Time Difference </div>,
    dataIndex: "createdAt",
    key: "time_difference",
    render: (text, record) => (
      <Tooltip title="Time Difference">
        <p style={{ whiteSpace: "nowrap", margin: "0" }}>
          {calculatedTimeDifference(
            record?.paymentGateway?.name == "now"
              ? record?.depositReqCreatedAt
              : record?.createdAt,
            record?.updatedAt,
          )}
        </p>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    render: (text) =>
      text ? (
        <div>
          <p
            style={{ color: text === "success" ? "green" : "red", margin: "0" }}
          >
            {text?.toUpperCase()}
          </p>
        </div>
      ) : (
        ""
      ),
  },
  {
    title: <div className="text-center"> Receiver Account Detail </div>,
    dataIndex: "receiverAccount",
    key: "receiverAccount",
    render: (text, record) => (
      <>
        <div
          className="eye-button"
          onClick={() => {
            setAccountData(record);
            setVisibleAccountDetails(true);
            handleOpen(record);
          }}
        >
          {record?._id == openAccount ? (
            <div style={{ color: "red" }}>
              <EyeInvisibleOutlined size={25} />
            </div>
          ) : (
            <EyeOutlined size={25} />
          )}
        </div>
        <p className="text-center" style={{ fontSize: "12px" }}>
          {record?.paymentGateway
            ? record.paymentGateway?.name
            : record?.accountHistory?.length > 0
              ? record?.accountHistory[1]?.transferAccount?.name
              : text?.name}
        </p>
      </>
    ),
  },
  {
    title: <div className="text-center"> Image </div>,
    dataIndex: "paymentSS",
    key: "_id",
    render: (text, record) =>
      text ? (
        <Button
          title={"Download"}
          style={{ marginBottom: "0px" }}
          onClick={() => {
            setImageModalVisible(true);
            setImageUrl(text);
          }}
        >
          <FileImageOutlined />
        </Button>
      ) : (
        "-"
      ),
  },
  {
    title: <div className="text-center"> History View </div>,
    dataIndex: "history",
    key: "history",
    render: (text, record) =>
      text && Object.keys(text).length > 0 ? (
        <div className="text-center">
          <Button
            title={"Edit"}
            onClick={() => showConfirm(text, "view")}
            style={{ color: "green", margin: "0" }}
          >
            <EyeOutlined />
          </Button>
        </div>
      ) : (
        <div className="text-center">-</div>
      ),
  },
  {
    title: <div className="text-center"> Remark </div>,
    dataIndex: "remark",
    key: "remark",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"}</div>
    ),
  },
];

export const withdrawReportColumn = (
  page,
  pageSize,
  openAccount,
  setAccountData,
  setVisibleAccountDetails,
  handleOpen,
  calculatedTimeDifference,
  setAttachedReportData,
  setAttachedReportVisible,
  setTotalResults,
  handleCopyToClipboard,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text ? (
          <CopyToClipboard text={text}>
            <div style={{ whiteSpace: "nowrap" }}>
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "receiver",
    key: "receiver",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text.userName ? text.userName : text.name ? text?.name : ""}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Id </div>,
    dataIndex: "receiver",
    key: "receiver",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text.uniqueId ? text?.uniqueId : ""}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "senderWebsite",
    key: "senderWebsite",
    render: (text, record) => (
      <div className="text-line-height">
        <div>{text ? text?.name : ""}</div>
        <div style={{ fontSize: "12px" }}>
          {text?.uniqueId ? text?.uniqueId : "-"}
        </div>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Transaction Process </div>,
    dataIndex: "isManualOrder",
    key: "isManualOrder",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? "Link" : "Website"} </div>
    ),
  },
  {
    title: <div className="text-center"> Payment Gateway </div>,
    dataIndex: "isPaymentGatewaySuccess",
    key: "isPaymentGatewaySuccess",
    render: (text, record) => {
      if (text && record?.paymentGateway) {
        return (
          <div className="text-center"> {record?.paymentGateway?.name} </div>
        );
      } else if (!text && record?.paymentGateway) {
        return (
          <>
            {" "}
            <Tooltip title="Payment Gateway">
              {" "}
              <div style={{ whiteSpace: "nowrap", textAlign: "center" }}>
                {" "}
                <div> {record?.paymentGateway?.name} </div>
                <div style={{ fontSize: "12px" }}>
                  <Tag style={{ margin: "0px" }} color="red">
                    {" "}
                    Failed{" "}
                  </Tag>
                </div>
              </div>
            </Tooltip>{" "}
          </>
        );
      } else {
        return <div className="text-center"> - </div>;
      }
    },
  },
  {
    title: <div className="text-center"> Account Type(UPI/Bank) </div>,
    dataIndex: "reqType",
    key: "reqType",
    render: (text) => (
      <div className="text-right-nowrap">{text?.toUpperCase()}</div>
    ),
  },
  {
    title: <div className="text-center"> Sender Name </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text, record) => {
      if (record?.isPaymentGatewaySuccess) {
        return <div className="text-center"> PG </div>;
      } else {
        if (record?.receiverAccountOwnerType === "user") {
          return (
            <>
              <Tooltip title="Unique Id">
                <div>{text?.uniqueId ? text?.uniqueId : "-"}</div>{" "}
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              {" "}
              <Tooltip title="User Name">
                {" "}
                <div className="text-line-height">
                  {" "}
                  <div>{text?.name ? text?.name : "-"}</div>
                  <div style={{ fontSize: "12px" }}>
                    {" "}
                    {text?.uniqueId ? text?.uniqueId : "-"}{" "}
                  </div>
                </div>{" "}
              </Tooltip>
            </>
          );
        }
      }
    },
  },
  {
    title: <div className="text-center"> Sender Type </div>,
    dataIndex: "receiverAccountOwnerType",
    key: "receiverAccountOwnerType",
    render: (text, record) => (
      <div className="text-right-nowrap"> {text?.toUpperCase()}</div>
    ),
  },
  {
    title: <div className="text-center"> Action By </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => {
      if (record?.isPaymentGatewaySuccess) {
        return <div className="text-center"> PG </div>;
      } else if (text) {
        return <div className="text-center"> {text?.name} </div>;
      } else if (
        record?.receiverAccountOwnerType !== "user" &&
        record?.sender?.name
      ) {
        return <div className="text-center"> {record?.sender?.name} </div>;
      } else {
        return <div className="text-center"> - </div>;
      }
    },
  },
  {
    title: (
      <div className="text-center"> Date(Request Date, updation date) </div>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-right-nowrap">
        <Tooltip title="Created At">
          <p style={{ margin: "0" }}>
            {onDateFormate(
              record?.withdrawReqCreatedAt,
              "DD-MM-YYYY hh:mm:ss A",
            )}
          </p>
        </Tooltip>
        <Tooltip title="Updated At">
          <p style={{ margin: "0" }}>
            {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Time Difference </div>,
    dataIndex: "createdAt",
    key: "time_difference",
    render: (text, record) => (
      <Tooltip title="Time Difference">
        <p style={{ margin: "0px", whiteSpace: "nowrap" }}>
          {calculatedTimeDifference(
            record?.withdrawReqCreatedAt
              ? record?.withdrawReqCreatedAt
              : record?.depositReqCreatedAt,
            record.updatedAt,
          )}
        </p>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Account Detail </div>,
    dataIndex: "receiverAccount",
    key: "receiverAccount",
    render: (text, record) =>
      text ? (
        <Button
          style={{ color: "green", textAlign: "center", margin: "0" }}
          onClick={() => {
            setAccountData(record);
            handleOpen(record);
            setVisibleAccountDetails(true);
          }}
        >
          {record?._id == openAccount ? (
            <div style={{ color: "red" }}>
              <EyeInvisibleOutlined size={25} />
            </div>
          ) : (
            <EyeOutlined size={25} />
          )}
        </Button>
      ) : (
        ""
      ),
  },
  {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    render: (text) =>
      text ? (
        <div className="text-right-nowrap">
          <p
            style={{ color: text === "success" ? "green" : "red", margin: "0" }}
          >
            {text?.toUpperCase()}
          </p>
        </div>
      ) : (
        ""
      ),
  },
  {
    title: <div className="text-center"> Attached Transaction </div>,
    dataIndex: "_id",
    key: "_id",
    width: 160,
    render: (text, record) => (
      <div className="text-center">
        <Badge
          count={
            record?.attachedTransactions?.length > 1
              ? record?.attachedTransactions?.length
              : 0
          }
          style={{
            backgroundColor: "#52c41a",
            fontSize: "10px",
            width: "16px",
            height: "16px",
            lineHeight: "16px",
            borderRadius: "50%",
          }}
          offset={[-8, 8]}
          showZero={false}
        >
          <Button
            style={{ margin: "0" }}
            className="text-center"
            onClick={() => {
              setTotalResults(
                record.attachedTransactions.length > 0
                  ? record.attachedTransactions.length
                  : 0,
              );
              setAttachedReportData(record);
              setAttachedReportVisible(true);
            }}
          >
            <AccountBookOutlined size={25} />
          </Button>
        </Badge>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Remark </div>,
    dataIndex: "remark",
    key: "remark",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
];

export const vendorReportColumns = (page, pageSize) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-center">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ["ascend", "descend"],
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Total Deposit </div>,
    dataIndex: "totalDeposite",
    key: "totalDeposite",
    render: (text, record) => (
      <div className="text-center">
        {record?.transactions?.totalDepositAmount
          ? (record?.transactions?.totalDepositAmount).toFixed(2)
          : "00"}
      </div>
    ),
    sorter: (a, b) =>
      (a?.transactions?.totalDepositAmount || 0) -
      (b?.transactions?.totalDepositAmount || 0),
  },
  {
    title: <div className="text-center"> Total Withdraw </div>,
    dataIndex: "totalWithdraw",
    key: "totalWithdraw",
    render: (text, record) => (
      <div className="text-center">
        {record?.transactions?.totalWithdrawAmount
          ? (record?.transactions?.totalWithdrawAmount).toFixed(2)
          : "00"}
      </div>
    ),
    sorter: (a, b) =>
      (a?.transactions?.totalWithdrawAmount || 0) -
      (b?.transactions?.totalWithdrawAmount || 0),
  },
];

export const websiteReportColumn = (page, pageSize, redirectType) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ) /* sorter: (a, b) => sorter(a?.name, b?.name), */,
  },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ["ascend", "descend"],
    defaultSortOrder: redirectType === null ? "ascend" : "",
    render: (text) => (
      <div className="text-right-nowrap">{text ? text : "-"}</div>
    ),
  },
  {
    title: <div className="text-center"> Website Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Deposit </div>,
    dataIndex: "transactions",
    key: "totalDepositAmount",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {record?.transactions?.totalDepositAmount
          ? (record?.transactions?.totalDepositAmount).toFixed(2)
          : "00"}
      </div>
    ),
    sorter: (a, b) =>
      (a?.transactions?.totalDepositAmount || 0) -
      (b?.transactions?.totalDepositAmount || 0),
  },
  {
    title: <div className="text-center"> Withdraw </div>,
    dataIndex: "transactions",
    key: "totalWithdrawAmount",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {record?.transactions?.totalWithdrawAmount
          ? (record?.transactions?.totalWithdrawAmount).toFixed(2)
          : "00"}
      </div>
    ),
    sorter: (a, b) =>
      (a?.transactions?.totalWithdrawAmount || 0) -
      (b?.transactions?.totalWithdrawAmount || 0),
  },
  {
    title: <div className="text-center"> DMW </div>,
    dataIndex: "dmw",
    key: "dmw",
    render: (_, record) => (
      <div className="text-right-nowrap">
        {(record?.transactions?.totalDepositAmount || 0) -
        (record?.transactions?.totalWithdrawAmount || 0)
          ? (
              (record?.transactions?.totalDepositAmount || 0) -
              (record?.transactions?.totalWithdrawAmount || 0)
            ).toFixed(2)
          : "00"}
      </div>
    ),
    sorter: (a, b) =>
      (a?.transactions?.totalDepositAmount || 0) -
      (a?.transactions?.totalWithdrawAmount || 0) -
      (b?.transactions?.totalDepositAmount || 0) -
      (b?.transactions?.totalWithdrawAmount || 0),
  },
];

export const pgReportColumn = (page, pageSize) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> Payment Gateway </div>,
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a?.name?.localeCompare(b?.name),
    sortDirections: ["ascend", "descend"],
    defaultSortOrder: "ascend",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Deposit Success </div>,
    dataIndex: "transactions",
    key: "transactions",
    sorter: (a, b) =>
      (a?.transactions?.totalDepositAmount || 0) -
      (b?.transactions?.totalDepositAmount || 0),
    sortDirections: ["ascend", "descend"],
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? text?.totalDepositAmount : "0"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Deposit Count </div>,
    dataIndex: "transactions",
    key: "transactions",
    sorter: (a, b) =>
      (a?.transactions?.totalDepositCount || 0) -
      (b?.transactions?.totalDepositCount || 0),
    sortDirections: ["ascend", "descend"],
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? text?.totalDepositCount : "0"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Withdraw Success </div>,
    dataIndex: "transactions",
    key: "transactions",
    sorter: (a, b) =>
      (a?.transactions?.totalWithdrawAmount || 0) -
      (b?.transactions?.totalWithdrawAmount || 0),
    sortDirections: ["ascend", "descend"],
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? text?.totalWithdrawAmount : "0"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Withdraw Count </div>,
    dataIndex: "transactions",
    key: "transactions",
    sorter: (a, b) =>
      (a?.transactions?.totalWithdrawCount || 0) -
      (b?.transactions?.totalWithdrawCount || 0),
    sortDirections: ["ascend", "descend"],
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? text?.totalWithdrawCount : "0"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> DMW </div>,
    dataIndex: "transactions",
    key: "transactions",
    sorter: (a, b) =>
      (a?.transactions?.totalDepositAmount || 0) -
      (a?.transactions?.totalWithdrawAmount || 0) -
      ((b?.transactions?.totalDepositAmount || 0) -
        (b?.transactions?.totalWithdrawAmount || 0)),
    sortDirections: ["ascend", "descend"],
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? text?.totalDepositAmount - text?.totalWithdrawAmount : "0"}
      </div>
    ),
  },
];

export const paymentGatewayColumn = (
  page,
  pageSize,
  data,
  onStatusChange,
  showConfirm,
  isEditPermission,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "agent._id",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center">Gateway Type (Deposit/Withdraw)</div>,
    dataIndex: "transactionType",
    key: "transactionType",
    render: (text) => <div className="text-right-nowrap">{text}</div>,
  },
  {
    title: <div className="text-center"> Payment Partner </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => <div className="text-right-nowrap">{text}</div>,
  },
  {
    title: <div className="text-center"> Payment Type </div>,
    dataIndex: "paymentType",
    key: "paymentType",
    render: (text) => (
      <div className="text-right-nowrap">{text ? text.toUpperCase() : "-"}</div>
    ),
  },
  {
    title: <div className="text-center"> Priority </div>,
    dataIndex: "priority",
    key: "priority",
    render: (text) => (
      <div className="text-right-nowrap">{text ? text : "0"}</div>
    ),
  },
  {
    title: <div className="text-center"> Created Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          {isEditPermission && (
            <>
              <Button
                title={
                  data?.find((a) => a?._id === text)?.isBlock
                    ? "Inactive"
                    : "Active"
                }
                onClick={() =>
                  onStatusChange({
                    _id: text,
                    isBlock: !data?.find((a) => a?._id === text)?.isBlock,
                  })
                }
              >
                {data.find((a) => a?._id === text)?.isBlock ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <div style={{ color: "green" }}>
                    <EyeOutlined size={25} />
                  </div>
                )}
              </Button>

              <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
                <EditOutlined />
              </Button>
            </>
          )}
        </div>
      ) : (
        ""
      ),
  },
];

export const transactionReportColumn = (
  page,
  pageSize,
  setVisibleAccountDetails,
  handleOpen,
  openAccount,
  setAccountData,
  setTotalResults,
  setAttachedReportData,
  setAttachedReportVisible,
  setImageModalVisible,
  setImageUrl,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> UTR Id </div>,
    dataIndex: "transactionId",
    key: "transactionId",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Transaction ID </div>,
    dataIndex: "gatewayTraId",
    key: "gatewayTraId",
    width: 140,
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction ID </div>,
    dataIndex: "traId",
    key: "traId",
    width: 140,
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Request Type </div>,
    dataIndex: "transactionType",
    key: "transactionType",
    render: (text) => (
      <div className="text-right-nowrap"> {text.toUpperCase()} </div>
    ),
  },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "senderWebsite",
    key: "senderWebsite",
    render: (text) => (
      <p className="text-right-nowrap">{text?.name ? text?.name : "-"}</p>
    ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    width: 100,
    render: (text) => (
      <div className="text-right-nowrap"> {text?.toLocaleString("en-IN")} </div>
    ),
  },
  {
    title: <div className="text-center"> Receiver Type </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text, record) =>
      record?.transactionType === "deposit" ? (
        <p>
          {record?.receiverAccountOwnerType === "agent"
            ? record.receiverAccountOwnerType.toUpperCase()
            : record?.receiver?.userType?.toUpperCase()}
        </p>
      ) : (
        <p>{text?.userType?.toUpperCase()}</p>
      ),
  },
  {
    title: <div className="text-center"> Receiver Name </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text, record) =>
      record?.transactionType === "deposit" ? (
        <div style={{ whiteSpace: "nowrap" }}>
          {record?.receiverAccountOwnerType === "user" ? (
            <>
              <Tooltip title="User Name">
                <p>{record?.receiver?.name ? record.receiver?.name : "-"}</p>
              </Tooltip>
              <Tooltip title="Website Name">
                <p>
                  {record?.receiver?.websiteName
                    ? record.receiver?.websiteName
                    : "-"}
                </p>
              </Tooltip>
            </>
          ) : record?.receiverAccountOwnerType === "agent" ? (
            <>
              <Tooltip title="User Name">
                <p>
                  {record?.agent_receiver?.name
                    ? record.agent_receiver?.name
                    : "-"}
                </p>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="User Name">
                <p>{record.receiver?.name ? record.receiver?.name : "-"}</p>
              </Tooltip>
            </>
          )}
        </div>
      ) : (
        <div style={{ whiteSpace: "nowrap" }}>
          {text.userType === "user" ? (
            <>
              <Tooltip title="User Name">
                <p>{text?.name ? text?.name : "-"}</p>
              </Tooltip>
              <Tooltip title="Website Name">
                <p>{text?.websiteName ? text?.websiteName : "-"}</p>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip title="User Name">
                <p>{text?.name ? text?.name : "-"}</p>
              </Tooltip>
            </>
          )}
        </div>
      ),
  },
  {
    title: <div className="text-center"> Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div style={{ whiteSpace: "nowrap" }}>
        <Tooltip title="Created At">
          <p>{text ? onDateFormate(text, "DD-MM-YYYY hh:mm:ss A") : "-"}</p>
        </Tooltip>
        <Tooltip title="Submission Time">
          <p>{onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}</p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    render: (text) =>
      text ? (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ color: text === "success" ? "green" : "red" }}>
            {" "}
            {text?.toUpperCase()}{" "}
          </p>
        </div>
      ) : (
        ""
      ),
  },
  {
    title: <div className="text-center"> Account Details </div>,
    dataIndex: "receiverAccount",
    key: "receiverAccount",
    render: (text, record) =>
      text ? (
        <Button
          style={{ color: "green", textAlign: "center", marginTop: "15px" }}
          onClick={() => {
            setAccountData(record);
            setVisibleAccountDetails(true);
            handleOpen(record);
          }}
        >
          {record?._id == openAccount ? (
            <div style={{ color: "red" }}>
              <EyeInvisibleOutlined size={25} />
            </div>
          ) : (
            <EyeOutlined size={25} />
          )}
        </Button>
      ) : (
        ""
      ),
  },
  {
    title: <div className="text-center"> Attached Transaction </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record) =>
      record?.transactionType === "withdraw" &&
      record?.attachedTransactions?.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            className="text-center"
            onClick={() => {
              setTotalResults(
                record?.attachedTransactions?.length > 0
                  ? record?.attachedTransactions?.length
                  : 0,
              );
              setAttachedReportData(record);
              setAttachedReportVisible(true);
            }}
          >
            <AccountBookOutlined size={25} />
          </Button>
        </div>
      ) : (
        <div className="text-center"> - </div>
      ),
  },
  {
    title: <div className="text-center"> Image </div>,
    dataIndex: "paymentSS",
    width: 120,
    key: "_id",
    render: (text, record) =>
      text ? (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {record?.transactionType === "withdraw" ? (
            <></>
          ) : (
            <Button
              onClick={() => {
                setImageModalVisible(true);
                setImageUrl(text);
              }}
            >
              <FileImageOutlined />
            </Button>
          )}
        </div>
      ) : (
        ""
      ),
  },
];

export const attachedTransactionReportColumn = (
  page,
  pageSize,
  withdrawReport,
  userReport,
  calculatedTimeDifference,
  handleAccountDetailsClick,
  setVisibleAccountDetails,
  setAccountData,
  handleOpen,
  openAccount,
) =>
  [
    {
      title: <div className="text-center"> Sr. No. </div>,
      dataIndex: "_id",
      key: "srNo",
      width: 80,
      render: (text, record, index) => (
        <div style={{ textAlign: "center" }}>{`${(
          (page - 1) * pageSize +
          index +
          1
        )
          .toString()
          .padStart(2, "0")}`}</div>
      ),
    },
    {
      title: <div className="text-center"> PG Transaction Id </div>,
      dataIndex: "traId",
      key: "traId",
      width: 140,
      render: (text) => (text ? text : "-"),
    },
    ...(withdrawReport === true
      ? [
          {
            title: <div className="text-center"> User Name </div>,
            dataIndex: "receiver",
            key: "receiver",
            width: 150,
            render: (text, record) =>
              record?.receiverAccountOwnerType === "user"
                ? record?.sender?.name
                : text?.name,
          },
          {
            title: <div className="text-center"> User Id </div>,
            dataIndex: "receiver",
            key: "receiver",
            width: 140,
            render: (text, record) =>
              record?.receiverAccountOwnerType === "user"
                ? record?.sender?.uniqueId
                : text?.uniqueId,
          },
          {
            title: <div className="text-center"> Time Difference </div>,
            dataIndex: "createdAt",
            key: "time_difference",
            width: 150,
            render: (text, record) => (
              <Tooltip title="Time Difference">
                <div style={{ whiteSpace: "nowrap" }}>
                  {calculatedTimeDifference(
                    record?.withdrawReqCreatedAt
                      ? record?.withdrawReqCreatedAt
                      : record?.depositReqCreatedAt,
                    record.updatedAt,
                  )}
                </div>
              </Tooltip>
            ),
          },
        ]
      : []),
    ...(userReport !== true
      ? [
          {
            title: <div className="text-center"> Sender Type </div>,
            dataIndex: "sender",
            key: "sender",
            width: 120,
            render: (text) =>
              text?.userType ? text.userType?.toUpperCase() : "-",
          },
          {
            title: <div className="text-center"> Sender Name </div>,
            dataIndex: "sender",
            key: "sender",
            width: 180,
            render: (text, record) => (
              <div className="text-center">
                {text.userType === "user" ? (
                  <>
                    <Tooltip title="User Name">
                      <div>{text?.userName ? text?.userName : "-"}</div>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="User Name">
                      <div>{text?.name ? text?.name : "-"}</div>
                    </Tooltip>
                  </>
                )}
              </div>
            ),
          },
          {
            title: <div className="text-center"> Website Name </div>,
            dataIndex: "senderWebsite",
            key: "senderWebsite",
            width: 120,
            render: (text) => <div className="text-center">{text?.name}</div>,
          },
        ]
      : // Exchange Transactions Column
        [
          {
            title: <div className="text-center"> Sender Name </div>,
            dataIndex: "user",
            key: "user",
            width: 180,
            render: (text, record) => (
              <div className="text-line-height">
                <div>{text ? text?.userName : ""}</div>
                <div style={{ fontSize: "12px" }}>
                  {text?.uniqueId ? text?.uniqueId : "-"}
                </div>
              </div>
            ),
          },
          {
            title: <div className="text-center"> Website Name </div>,
            dataIndex: "website",
            key: "website",
            width: 120,
            render: (text) => (
              <div className="text-line-height">
                <div>{text ? text?.name : ""}</div>
                <div style={{ fontSize: "12px" }}>
                  {text?.uniqueId ? text?.uniqueId : "-"}
                </div>
              </div>
            ),
          },
        ]),
    {
      title: <div className="text-center"> Amount </div>,
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text) => text?.toLocaleString("en-IN"),
    },
    {
      title: (
        <div className="text-center">
          {" "}
          Date(req creation Date, updation date){" "}
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: (text, record) => (
        <div style={{ whiteSpace: "nowrap" }}>
          <Tooltip title="Created At">
            <p>
              {userReport
                ? onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")
                : onDateFormate(
                    record?.depositReqCreatedAt,
                    "DD-MM-YYYY hh:mm:ss A",
                  )}
            </p>
          </Tooltip>
          <Tooltip title="Updated At">
            <p>{onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}</p>
          </Tooltip>
        </div>
      ),
    },
    {
      title: <div className="text-center"> Status </div>,
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) =>
        text ? (
          <div className="text-center">
            <p style={{ color: handleColor(text) }}>{text?.toUpperCase()}</p>
          </div>
        ) : (
          ""
        ),
    },
    ...(userReport
      ? [
          {
            title: <div className="text-center"> Account Details </div>,
            dataIndex: "attachedTransactions",
            key: "attachedTransactions",
            width: 120,
            render: (text, record) => (
              <Button
                style={{ color: "green", textAlign: "center", margin: "0" }}
                onClick={() => {
                  setAccountData(record);
                  handleOpen(record);
                  setVisibleAccountDetails(true);
                }}
              >
                {record?._id == openAccount ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <EyeOutlined size={25} />
                )}
              </Button>
            ),
          },
        ]
      : [
          {
            title: <div className="text-center"> Account Details </div>,
            dataIndex: "receiverAccount",
            key: "receiverAccount",
            width: 120,
            render: (text, record) =>
              text ? (
                <Button
                  style={{ color: "green", textAlign: "right" }}
                  onClick={() => handleAccountDetailsClick(record)}
                >
                  <EyeOutlined size={25} />
                </Button>
              ) : (
                <div className="text-center">-</div>
              ),
          },
        ]),
    {
      title: <div className="text-center"> Download </div>,
      dataIndex: "paymentSS",
      key: "_id",
      width: 120,
      render: (text, record) =>
        record.transactionType !== "withdraw" ? (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <a href={text} target={"_blank"} rel="noreferrer">
              <Button style={{ marginBottom: "0px" }}>
                <FileImageOutlined />
              </Button>
            </a>
          </div>
        ) : (
          "-"
        ),
    },
  ].filter(Boolean);

export const depositTransactionColumns = (
  page,
  pageSize,
  calculatedTimeDifference,
  handleCopyToClipboard,
  setImageModalVisible,
  setImageUrl,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> UTR Id </div>,
    dataIndex: "transactionId",
    key: "transactionId",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {" "}
        {record?.reqType === "upi" ? (
          text ? (
            <CopyToClipboard text={text}>
              <div className="font-bold-nowrap">
                {" "}
                {text}{" "}
                {record?.upiId
                  ? `[${record?.upiId ? record?.upiId : "-"}]`
                  : ""}{" "}
                <CopyOutlined
                  onClick={() => handleCopyToClipboard(text)}
                  className="text-black-pointer"
                />
              </div>
            </CopyToClipboard>
          ) : (
            "-"
          )
        ) : (
          <div style={{ textAlign: "right" }}>
            {text ? (
              <CopyToClipboard text={text}>
                <div className="font-bold-nowrap">
                  {" "}
                  {text}{" "}
                  <CopyOutlined
                    onClick={() => handleCopyToClipboard(text)}
                    className="text-black-pointer"
                  />
                </div>
              </CopyToClipboard>
            ) : (
              "-"
            )}
          </div>
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center"> UTR Transaction Id </div>,
    dataIndex: "gatewayTraId",
    key: "gatewayTraId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div className="font-bold-nowrap">
              {" "}
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? text?.toUpperCase() : "-"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text) => (
      <div className="text-right-nowrap"> {text.name ? text?.name : ""} </div>
    ),
  },
  {
    title: <div className="text-center"> User Id </div>,
    dataIndex: "sender",
    key: "sender",
    render: (text) => (
      <div className="text-right-nowrap">
        {text.uniqueId ? text?.uniqueId : ""}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Website name </div>,
    dataIndex: "senderWebsite",
    key: "senderWebsite",
    render: (text, record) => (
      <div className="text-line-height">
        <div> {text?.name ? text?.name : "-"} </div>
        <div style={{ fontSize: "12px" }}>
          {" "}
          {text.uniqueId ? text?.uniqueId : "-"}{" "}
        </div>{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text.toFixed(2) : "00"} </div>
    ),
  },
  {
    title: <div className="text-center"> Transaction Process </div>,
    dataIndex: "isManualOrder",
    key: "isManualOrder",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? "Manual" : "Auto"} </div>
    ),
  },
  {
    title: <div className="text-center"> Action By </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => (
      <div className="text-right-nowrap">
        {" "}
        {text ? text?.name : record?.receiver?.name}{" "}
      </div>
    ),
  },
  {
    title: (
      <div className="text-center">
        {" "}
        Date(req creation Date, updation date){" "}
      </div>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-right-nowrap">
        <Tooltip title="Created At">
          <p style={{ margin: "0px" }}>
            {onDateFormate(
              record?.depositReqCreatedAt,
              "DD-MM-YYYY hh:mm:ss A",
            )}
          </p>
        </Tooltip>
        <Tooltip title="Updated At">
          <p style={{ margin: "0px" }}>
            {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Time Difference </div>,
    dataIndex: "createdAt",
    key: "time_difference",
    render: (text, record) => (
      <Tooltip title="Time Difference">
        <div className="text-right-nowrap">
          {calculatedTimeDifference(
            record?.depositReqCreatedAt,
            record?.updatedAt,
          )}
        </div>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Image </div>,
    dataIndex: "paymentSS",
    key: "paymentSS",
    render: (text, record) =>
      text ? (
        <Button
          style={{ marginBottom: "0px" }}
          title={"Download"}
          onClick={() => {
            setImageModalVisible(true);
            setImageUrl(text);
          }}
        >
          <DownloadOutlined />
        </Button>
      ) : (
        <div className="text-center"> - </div>
      ),
  },
  {
    title: <div className="text-center"> Remark </div>,
    dataIndex: "remark",
    key: "remark",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
];

export const websitePGColumns = (
  page,
  pageSize,
  data,
  handleChange,
  onStatusChange,
  saveData,
  changedValues,
  isValidInput,
) => [
  {
    title: () => <div className="text-center">Sr. No.</div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record, index) => (
      <div className="text-center">
        {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}
      </div>
    ),
  },
  {
    title: <div className="text-right-nowrap">Website Name</div>,
    dataIndex: "entityId",
    key: "entityId",
    render: (text) => (
      <div className="text-right-nowrap">{text ? text?.name : "-"}</div>
    ),
  },
  {
    title: <div className="text-center">Gateway Type (Deposit/Withdraw)</div>,
    dataIndex: "transactionType",
    key: "transactionType",
    render: (text) => <div className="text-right-nowrap">{text}</div>,
  },
  {
    title: <div className="text-right-nowrap">Payment Gateway</div>,
    dataIndex: "paymentGateWayId",
    key: "paymentGateWayId",
    render: (text) => <div className="text-right-nowrap">{text?.name}</div>,
  },
  {
    title: <div className="text-center">PG+TES Commission</div>,
    dataIndex: "tesCommission",
    key: "tesCommission",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[{ required: true, message: "Please input a value!" }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="tesCommission"
              min={0}
              step="0.01"
              defaultValue={text}
              style={{ textAlign: "center", width: "50%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: <div className="text-center">PG Commission</div>,
    dataIndex: "commission",
    key: "commission",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[{ required: true, message: "Please input a value!" }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="commission"
              min={0}
              step="0.01"
              defaultValue={text}
              style={{ textAlign: "center", width: "50%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: <div className="text-center">Priority Number</div>,
    dataIndex: "priority",
    key: "priority",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[
              {
                required: true,
                message: "Please input a value!",
              },
              {
                validator: (_, value) =>
                  value && value < 1
                    ? Promise.reject("Value must be at least 1!")
                    : Promise.resolve(),
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="priority"
              min={1}
              defaultValue={text}
              style={{ textAlign: "center", width: "40%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: () => <div className="text-center">{"Created Date"}</div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm A")}
      </div>
    ),
  },
  {
    title: () => <div className="text-center">Action</div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            title={
              data.find((a) => a?._id === text)?.isBlock ? "Inactive" : "Active"
            }
            onClick={() =>
              onStatusChange({
                _id: text,
                isBlock: !data.find((a) => a?._id === text)?.isBlock,
              })
            }
          >
            {data.find((a) => a?._id === text)?.isBlock ? (
              <div style={{ color: "red" }}>
                <EyeInvisibleOutlined size={25} />
              </div>
            ) : (
              <div style={{ color: "green" }}>
                <EyeOutlined size={25} />
              </div>
            )}
          </Button>
          <Button title={"Edit"} onClick={() => saveData(text, "edit")}>
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            title={"SAVE"}
            onClick={() => saveData(text, "add")}
            disabled={!changedValues[text] || !isValidInput}
          >
            SAVE
          </Button>
        </div>
      ) : (
        ""
      ),
  },
];

export const transactionListColumns = (
  page,
  pageSize,
  handleColor,
  handleCopyToClipboard,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-center">
        {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Date </div>,
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (text, record) => (
      <center>
        <div className="text-center" style={{ width: "200px" }}>
          <Tooltip title="Updated At">
            <p style={{ margin: "0px" }}>
              {text
                ? onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")
                : "-"}
            </p>
          </Tooltip>
        </div>
      </center>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {text ? (
          <CopyToClipboard text={text}>
            <div style={{ whiteSpace: "nowrap" }}>
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text)}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: <div className="text-center">Receiver Account</div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        {record?.receiverAccount?.name
          ? record?.receiverAccount?.name
          : record?.depositAccount?.name
            ? record?.depositAccount?.name
            : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Receiver Type </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        {record?.receiver?.userType
          ? record?.receiver?.userType
          : record?.depositAccount?.owner
            ? record?.depositAccount?.owner
            : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Receiver Name </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        {record?.receiver?.name
          ? record?.receiver?.name
          : record?.created?.name
            ? record?.created?.name
            : "-"}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (
      <div className="text-center"> {text ? text.toFixed(2) : "00"} </div>
    ),
  },
  {
    title: <div className="text-center"> Received Amount </div>,
    dataIndex: "receivedAmount",
    key: "receivedAmount",
    render: (text) => (
      <div className="text-center"> {text ? text.toFixed(2) : "00"} </div>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    key: "status",
    dataIndex: "status",
    render: (status) => (
      <span>
        <center>
          <Tag color={handleColor(status)} key={status}>
            {status ? status?.toUpperCase() : "-"}
          </Tag>
        </center>
      </span>
    ),
  },
];

export const commissionColumns = (
  page,
  pageSize,
  handleChange,
  handleColor,
  handleCommissionTransactionReport,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-center">
        {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "fromData",
    key: "fromData",
    render: (text, record) =>
      record?.fromId === "admin" ? (
        <div className="text-line-height">
          <div> {record.toData?.name || "-"} </div>
          <div style={{ fontSize: "12px" }}> {record?.toId || "-"} </div>
        </div>
      ) : record?.from === "PG" ? (
        <div className="text-center"> {record?.fromData?.name || "-"} </div>
      ) : text?.name ? (
        <div className="text-line-height">
          <div> {text?.name || "-"} </div>
          <div style={{ fontSize: "12px" }}> {record?.fromId || "-"} </div>
        </div>
      ) : (
        <div className="text-center"> {record?.fromId || "-"} </div>
      ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text, record) => (
      <div
        className="text-center"
        style={{ color: record?.to === "TES" ? "green" : "red" }}
      >
        {record?.from === "PG"
          ? text
          : record?.to === "TES"
            ? record?.fromAmount
            : text || "00"}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Transaction Report </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record) => (
      <div className="text-center">
        <Button
          style={{ margin: "0" }}
          className="text-center"
          onClick={() => handleCommissionTransactionReport(record)}
        >
          <AccountBookOutlined size={25} />
        </Button>
      </div>
    ),
  },
  {
    title: <div className="text-center">Action</div>,
    dataIndex: "status",
    key: "status",
    render: (text, record) => (
      <div className="text-center">
        {text === "pending" && record?.from === "TES" ? (
          <Button
            type="primary"
            style={{ margin: "0" }}
            title={"Settle"}
            onClick={() => handleChange(record, "pending")}
          >
            Settle
          </Button>
        ) : text === "submitted" && record?.to === "TES" ? (
          <>
            <Button
              style={{
                backgroundColor: "green",
                color: "white",
                margin: "0",
                marginRight: "5px",
              }}
              title={"Approve"}
              onClick={() => handleChange(record, "approve")}
            >
              A
            </Button>
            <Button
              danger
              style={{ backgroundColor: "red", color: "white", margin: "0" }}
              title={"Decline"}
              onClick={() => handleChange(record, "decline")}
            >
              D
            </Button>
          </>
        ) : text === "pending" &&
          (record?.from === "PG" || record?.to === "PG") ? (
          <Button
            type="primary"
            style={{ margin: "0" }}
            title={"Settle"}
            onClick={() => handleChange(record, "settle")}
          >
            Settle
          </Button>
        ) : text !== "pending" ? (
          <Tag color={handleColor(text)} key={text}>
            {text?.toUpperCase()}
          </Tag>
        ) : (
          "-"
        )}
      </div>
    ),
  },
];

export const websiteAssignVendorColumns = (
  page,
  pageSize,
  data,
  handleChange,
  saveData,
  changedValues,
  isValidInput,
) => [
  {
    title: () => <div className="text-center">Sr. No.</div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record, index) => (
      <div className="text-center">
        {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}
      </div>
    ),
  },
  {
    title: <div className="text-center">Vendor Name</div>,
    dataIndex: "vendor",
    key: "vendor",
    render: (text) => (
      <div className="text-right-nowrap">{text ? text?.name : "-"}</div>
    ),
  },
  {
    title: <div className="text-center">Vendor+TES Commission</div>,
    dataIndex: "vendorCommission",
    key: "vendorCommission",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[
              {
                required: true,
                message: "Please enter vendor commission!",
              },
              {
                pattern: new RegExp(/^\d+(\.\d+)?$/),
                message: "Vendor commission must be a non-negative number!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="vendorCommission"
              min={0}
              max={100}
              step="0.01"
              defaultValue={text}
              style={{ textAlign: "center", width: "50%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: <div className="text-center">TES Commission</div>,
    dataIndex: "tesCommission",
    key: "tesCommission",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[
              {
                required: true,
                message: "Please enter tes commission!",
              },
              {
                pattern: new RegExp(/^\d+(\.\d+)?$/),
                message: "Tes commission must be a non-negative number!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="tesCommission"
              min={0}
              max={100}
              step="0.01"
              defaultValue={text}
              style={{ textAlign: "center", width: "50%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: <div className="text-center">Priority Number</div>,
    dataIndex: "priority",
    key: "priority",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[
              {
                required: true,
                message: "Please enter priority number!",
              },
              {
                pattern: new RegExp(/^[1-9]\d*$/),
                message: "Priority must be positive integer greater than 0!",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="priority"
              min={0}
              defaultValue={text}
              style={{ textAlign: "center", width: "40%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: () => <div className="text-center">{"Created Date"}</div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm A")}
      </div>
    ),
  },
  {
    title: () => <div className="text-center">Action</div>,
    dataIndex: "vendorId",
    key: "vendorId",
    render: (text, record) => (
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button title={"Edit"} onClick={() => saveData(text, "edit")}>
          <EditOutlined />
        </Button>
        <Button title={"Delete"} onClick={() => saveData(text, "delete")}>
          <DeleteOutlined style={{ color: "red" }} />
        </Button>
        <Button
          type="primary"
          title={"SAVE"}
          onClick={() => saveData(text, "add")}
          disabled={!changedValues[text] || !isValidInput[text]}
        >
          SAVE
        </Button>
      </div>
    ),
  },
];

export const dailyCommissionColumns = (
  page,
  pageSize,
  setImageModalVisible,
  setImageUrl,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    width: 80,
    render: (text, record, index) => (
      <div className="text-center">
        {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: () => <div className="text-center">{"Created Date"}</div>,
    dataIndex: "createdAt",
    key: "createdAt",
    width: 140,
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (text) => (
      <div className="text-center"> {text ? text?.toUpperCase() : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Transaction Type </div>,
    dataIndex: "transactionType",
    key: "transactionType",
    width: 130,
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "toData",
    key: "toData",
    width: 120,
    render: (text, record) => {
      if (record?.from === "PG") {
        if (record?.transactionType === "settlement") {
          return <div className="text-center"> TES </div>;
        } else {
          return (
            <div className="text-line-height">
              <div> {record?.website?.name || "-"} </div>
              <div style={{ fontSize: "12px" }}>
                {record?.website?.uniqueId || "-"}
              </div>
            </div>
          );
        }
      } else if (record?.payment_gateway) {
        return (
          <div className="text-center">
            {" "}
            {record?.payment_gateway?.name || "-"}{" "}
          </div>
        );
      } else {
        if (record?.from === "user") {
          return <div className="text-center"> User </div>;
        } else if (record?.toId === "admin") {
          return (
            <div className="text-line-height">
              <div> {record?.fromData?.name || "-"} </div>
              <div style={{ fontSize: "12px" }}>
                {record?.fromData?.uniqueId || "-"}
              </div>
            </div>
          );
        } else if (record?.fromId === "admin") {
          return (
            <div className="text-line-height">
              <div> {record?.toData?.name || "-"} </div>
              <div style={{ fontSize: "12px" }}>
                {record?.toData?.uniqueId || "-"}
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-line-height">
              <div> {record?.fromData?.name || "-"} </div>
              <div style={{ fontSize: "12px" }}>
                {record?.fromData?.uniqueId || "-"}
              </div>
            </div>
          );
        }
      }
    },
  },
  {
    title: <div className="text-center"> Deposit Amount </div>,
    dataIndex: "depositAmount",
    key: "depositAmount",
    width: 120,
    render: (text) => <div className="text-center"> {text ? text : "00"} </div>,
  },
  {
    title: <div className="text-center"> Deposit Commission Amount </div>,
    dataIndex: "depositCommissionAmount",
    key: "depositCommissionAmount",
    width: 220,
    render: (text, record) => {
      console.log("record-----", record);
      const depositCommission = record?.depositCommission
        ? `${parseFloat(record.depositCommission).toFixed(2).replace(/\.00$/, "")}%`
        : null;

      let isPercentageNotVisible =
        (record?.from === "TES" && record?.to === "vendor") ||
        (record?.from === "vendor" && record?.to === "TES");
      console.log("------->>", isPercentageNotVisible);

      return (
        <div className="text-center">
          {text ? text : "00"}{" "}
          {depositCommission && !isPercentageNotVisible && (
            <span style={{ color: "grey", fontSize: "12px" }}>
              ({depositCommission})
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: <div className="text-center"> Withdraw Amount </div>,
    dataIndex: "withdrawAmount",
    key: "withdrawAmount",
    width: 140,
    render: (text) => <div className="text-center"> {text ? text : "00"} </div>,
  },
  {
    title: <div className="text-center"> Withdraw Commission Amount </div>,
    dataIndex: "withdrawCommissionAmount",
    key: "withdrawCommissionAmount",
    width: 220,
    render: (text, record) => {
      const withdrawCommission = record?.withdrawCommission
        ? `${parseFloat(record.withdrawCommission).toFixed(2).replace(/\.00$/, "")}%`
        : null;
      let isPercentageNotVisible =
        (record?.from === "TES" && record?.to === "vendor") ||
        (record?.from === "vendor" && record?.to === "TES");

      return (
        <div className="text-center">
          {text ? text : "00"}{" "}
          {withdrawCommission && !isPercentageNotVisible && (
            <span style={{ color: "grey", fontSize: "12px" }}>
              ({withdrawCommission})
            </span>
          )}
        </div>
      );
    },
  },
  {
    title: <div className="text-center"> DMW </div>,
    dataIndex: "dmw",
    key: "dmw",
    width: 80,
    render: (text) => <div className="text-center"> {text ? text : "00"} </div>,
  },
  {
    title: <div className="text-center"> Total Commission </div>,
    dataIndex: "totalCommission",
    key: "totalCommission",
    width: 140,
    render: (text) => <div className="text-center"> {text ? text : "00"} </div>,
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "toAmount",
    key: "toAmount",
    width: 140,
    render: (text, record) => {
      // Convert the text to a number and format it to 2 decimal places
      const formattedAmount = text ? parseFloat(text).toFixed(2) : "00.00";

      return (
        <div
          className="text-center"
          style={{
            color:
              record?.transactionType === "settlement"
                ? ""
                : record?.to === "TES"
                  ? "green"
                  : "red",
          }}
        >
          {formattedAmount}
        </div>
      );
    },
  },
  {
    title: <div className="text-center"> Image </div>,
    dataIndex: "paymentSS",
    key: "paymentSS",
    width: 140,
    render: (text, record) =>
      text ? (
        <Button
          style={{ marginBottom: "0px" }}
          title={"Download"}
          onClick={() => {
            setImageModalVisible(true);
            setImageUrl(text);
          }}
        >
          <DownloadOutlined />
        </Button>
      ) : (
        <div className="text-center"> - </div>
      ),
  },
  {
    title: <div className="text-center"> Remarks </div>,
    dataIndex: "remark",
    key: "remark",
    width: 140,
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
];

export const paymentMethodOrderColumn = (handleChange, onStatusChange) => [
  {
    title: <div className="text-center">Payment Method</div>,
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    render: (text) => <div className="text-center">{text ? text : "-"}</div>,
  },
  // {
  //   title: <div className="text-center">Deposit Video Link</div>,
  //   dataIndex: "redirectUrl",
  //   key: "redirectUrl",
  //   render: (text, record) => (
  //     <div className="text-center">
  //       <Form>
  //         <Form.Item
  //           name={`customInput-${record.priority}`}
  //           style={{ marginBottom: 0 }}
  //         >
  //           <Input
  //             type="text"
  //             name={`customInput-${record.priority}`}
  //             defaultValue={text}
  //             style={{ textAlign: "center" }}
  //             onChange={(e) => handleChange(e, record, "redirectUrl")}
  //           />
  //         </Form.Item>
  //       </Form>
  //     </div>
  //   ),
  // },
  {
    title: <div className="text-center">Priority Number</div>,
    dataIndex: "priority",
    key: "priority",
    render: (text, record) => (
      <div style={{ textAlign: "center" }}>
        <Form>
          <Form.Item
            name={`customInput-${record.priority}`}
            rules={[
              {
                required: true,
                message: "Please input a value!",
              },
              {
                validator: (_, value) =>
                  value && value < 1
                    ? Promise.reject("Value must be at least 1!")
                    : Promise.resolve(),
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="text"
              // placeholder="Enter value"
              name="priority"
              defaultValue={text}
              style={{ textAlign: "center", width: "40%" }}
              onChange={(e) => handleChange(e, record, "priority")}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: <div className="text-center">Action</div>,
    dataIndex: "isActive",
    key: "isActive",
    render: (text, record) => (
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Button
          title={text ? "Inactive" : "Active"}
          onClick={() =>
            onStatusChange({
              priority: record?.priority,
              isActive: text,
            })
          }
        >
          {text == false ? (
            <div style={{ color: "red" }}>
              <EyeInvisibleOutlined size={25} />
            </div>
          ) : (
            <div style={{ color: "green" }}>
              <EyeOutlined size={25} />
            </div>
          )}
        </Button>
      </div>
    ),
  },
];

export const CoinsDetailsColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
  hadleSwitchChange,
  isEditPermission,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <div>
        {" "}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "30%",
            gap: "15px",
            width: "max-content",
          }}
        >
          <img
            width={40}
            height={40}
            src={record?.logo ? record?.logo : "/assets/images/coinlogo.png"}
          />
          <span>{text}</span>
        </div>{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Short Name </div>,
    dataIndex: "shortName",
    key: "shortName",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Conversion Amount (INR) </div>,
    dataIndex: "conversionToUSDT",
    key: "conversionToUSDT",
    render: (text) => (
      <div className="text-center"> {text ? `₹ ${text}` : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Priority </div>,
    dataIndex: "priority",
    key: "priority",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Date(Created Date,Updated Date) </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        <>
          <Tooltip title="Created At">
            <p style={{ margin: "0" }}>
              {onDateFormate(record?.createdAt, "DD-MM-YYYY hh:mm:ss A")}
            </p>
          </Tooltip>
          <Tooltip title="Submission Time">
            <p style={{ margin: "0" }}>
              {" "}
              {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}{" "}
            </p>
          </Tooltip>
        </>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isEditPermission && (
              <>
                <Button
                  title={"Edit"}
                  onClick={() => showConfirm(text, "edit")}
                >
                  <EditOutlined />
                </Button>
                <Button
                  title={
                    data.find((a) => a?._id === text)?.isActive
                      ? "Active"
                      : "Inactive"
                  }
                  onClick={() =>
                    onStatusChange({
                      _id: text,
                      isActive: !data.find((a) => a?._id === text)?.isActive,
                    })
                  }
                >
                  {!data.find((a) => a?._id === text)?.isActive ? (
                    <div style={{ color: "red" }}>
                      <EyeInvisibleOutlined size={25} />
                    </div>
                  ) : (
                    <div style={{ color: "green" }}>
                      <EyeOutlined size={25} />
                    </div>
                  )}
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        ""
      ),
  },
];

export const AutoCoinsDetailsColumns = (
  page,
  pageSize,
  handleInputChange,
  checkAll,
  setCheckAll,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text, record) => (
      <div>
        {" "}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "30%",
            gap: "15px",
            width: "max-content",
          }}
        >
          <img
            width={40}
            height={40}
            src={record?.logo ? record?.logo : "/assets/images/coinlogo.png"}
          />
          <span>{text}</span>
        </div>{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Conversion Amount (INR) </div>,
    dataIndex: "conversionToUSDT",
    key: "conversionToUSDT",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            id={record._id}
            rules={[{ required: true, message: "Please input a value!" }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              id={record?._id}
              type="number"
              name="conversionToUSDT"
              min={0}
              max={100}
              step="0.01"
              defaultValue={text}
              disabled={record?.isRateAutoGenerate ? true : false}
              style={{ textAlign: "center", width: "50%" }}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
  {
    title: (
      <div className="text-center">
        {" "}
        Is Auto{" "}
        <input
          id="isRateAutoGenerateAll"
          name="isRateAutoGenerateAll"
          type={"checkbox"}
          checked={false || checkAll}
          onChange={(e) => {
            handleInputChange(e, "all");
            setCheckAll(e.target.checked);
          }}
        />{" "}
      </div>
    ),
    dataIndex: "isRateAutoGenerate",
    key: "isRateAutoGenerate",
    render: (text, record) => (
      <div className="text-center">
        <input
          id={record?._id}
          name="isRateAutoGenerate"
          type={"checkbox"}
          checked={text || false}
          onChange={(e) => handleInputChange(e)}
        />
      </div>
    ),
  },
  {
    title: <div className="text-center"> Date(Created Date,Updated Date) </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        <>
          <Tooltip title="Created At">
            <p style={{ margin: "0" }}>
              {onDateFormate(record?.createdAt, "DD-MM-YYYY hh:mm:ss A")}
            </p>
          </Tooltip>
          <Tooltip title="Submission Time">
            <p style={{ margin: "0" }}>
              {" "}
              {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}{" "}
            </p>
          </Tooltip>
        </>
      </div>
    ),
  },
];

export const CoinNetworkColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => <div className="text-center"> {text} </div>,
  },
  {
    title: <div className="text-center"> Network Fee (INR) </div>,
    dataIndex: "networkFee",
    key: "networkFee",
    render: (text) => (
      <div className="text-center"> {text ? `₹ ${text}` : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Priority </div>,
    dataIndex: "priority",
    key: "priority",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  // {
  //   title: <div className="text-center"> Coin Type </div>,
  //   dataIndex: "coin-logo",
  //   key: "coin-logo",
  //   render: (text) => <div className="text-right-nowrap"> <img src="./logo192.png" width={"20px"} height={"20px"}/> </div>,
  // },
  // {
  //   title: <div className="text-center"> Minimum Deposit Amount </div>,
  //   dataIndex: "minimumDepositAmount",
  //   key: "minimumDepositAmount",
  //   render: (text) => <div className="text-center"> {text} </div>,
  // },
  // {
  //   title: () => <div style={{ textAlign: "center" }}>Set Active</div>,
  //   dataIndex: "isActive",
  //   key: "isActive",
  //   render: (text, record) =>
  //     <div
  //         style={{
  //           marginTop: "8px",
  //           display: "flex",
  //           flexDirection: "row",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <Button
  //           title={
  //             text ? "Inactive" : "Active"
  //           }
  //           onClick={() => onStatusChange({
  //               priority: record?.priority,
  //               isActive: text
  //             })
  //           }
  //         >
  //           {
  //             text == false ? (
  //               <div style={{ color: "red" }}>
  //                 <EyeInvisibleOutlined size={25} />
  //               </div>
  //             ) : (
  //               <div style={{ color: "green" }}>
  //                 <EyeOutlined size={25} />
  //               </div>
  //             )
  //           }
  //         </Button>
  //       </div>
  // },
  {
    title: <div className="text-center"> Date(Created Date,Updated Date) </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        <>
          <Tooltip title="Created At">
            <p style={{ margin: "0" }}>
              {onDateFormate(record?.createdAt, "DD-MM-YYYY hh:mm:ss A")}
            </p>
          </Tooltip>
          <Tooltip title="Submission Time">
            <p style={{ margin: "0" }}>
              {" "}
              {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}{" "}
            </p>
          </Tooltip>
        </>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
              <EditOutlined />
            </Button>
            <Button
              title={
                data.find((a) => a?._id === text)?.isActive //! Change this to isActive
                  ? "Active"
                  : "Inactive"
              }
              onClick={() =>
                onStatusChange({
                  _id: text,
                  isActive: !data.find((a) => a?._id === text)?.isActive,
                  coinId: data.find((a) => a?._id === text)?.coinId,
                })
              }
            >
              {!data.find((a) => a?._id === text)?.isActive ? (
                <div style={{ color: "red" }}>
                  <EyeInvisibleOutlined size={25} />
                </div>
              ) : (
                <div style={{ color: "green" }}>
                  <EyeOutlined size={25} />
                </div>
              )}
            </Button>
          </div>
        </>
      ) : (
        ""
      ),
  },
];

export const RoleColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Date(Created Date,Updated Date) </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        <>
          <Tooltip title="Created At">
            <p style={{ margin: "0" }}>
              {onDateFormate(record?.createdAt, "DD-MM-YYYY hh:mm:ss A")}
            </p>
          </Tooltip>
          <Tooltip title="Submission Time">
            <p style={{ margin: "0" }}>
              {" "}
              {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}{" "}
            </p>
          </Tooltip>
        </>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
              <EditOutlined />
            </Button>
            <Button
              title={
                data.find((a) => a?._id === text)?.isActive
                  ? "Active"
                  : "Inactive"
              }
              onClick={() =>
                onStatusChange({
                  _id: text,
                  isActive: !data.find((a) => a?._id === text)?.isActive,
                })
              }
            >
              {!data.find((a) => a?._id === text)?.isActive ? (
                <div style={{ color: "red" }}>
                  <EyeInvisibleOutlined size={25} />
                </div>
              ) : (
                <div style={{ color: "green" }}>
                  <EyeOutlined size={25} />
                </div>
              )}
            </Button>
          </div>
        </>
      ) : (
        ""
      ),
  },
];

export const SubAdminColumns = (
  page,
  pageSize,
  data,
  showConfirm,
  onStatusChange,
  handleTogglePassword,
  isPasswordRevealed,
  handleCopyToClipboard,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "userId",
    key: "userId",
    render: (text) => <div className="text-right-nowrap"> {text} </div>,
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Sub Admin Id </div>,
    dataIndex: "uniqueId",
    key: "uniqueId",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Password </div>,
    dataIndex: "password",
    key: "password",
    render: (text, record) => (
      <Tooltip
        style={{ cursor: "pointer" }}
        title={
          isPasswordRevealed(record.userId) ? (
            <CopyToClipboard
              text={text}
              onCopy={() => handleCopyToClipboard(text)}
            >
              <p style={{ userSelect: "none" }}>
                {text}
                <CopyOutlined />
              </p>
            </CopyToClipboard>
          ) : (
            "Show Password"
          )
        }
      >
        <span
          className="show-password"
          onClick={() => handleTogglePassword(record.userId)}
        >
          {" "}
          {"*".repeat(text?.length)}{" "}
        </span>
      </Tooltip>
    ),
  },
  {
    title: <div className="text-center"> Role </div>,
    dataIndex: "role",
    key: "role",
    render: (text) => (
      <div className="text-right-nowrap"> {text ? text.name : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Date </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text) =>
      text ? (
        <div
          style={{ marginTop: "8px", display: "flex", flexDirection: "row" }}
        >
          <Button
            title={
              data.find((a) => a?._id === text)?.isActive
                ? "Active"
                : "Inactive"
            }
            onClick={() =>
              onStatusChange({
                _id: text,
                isActive: !data.find((a) => a?._id === text)?.isActive,
              })
            }
          >
            {data.find((a) => a?._id === text)?.isActive ? (
              <div style={{ color: "green" }}>
                <EyeOutlined size={25} />
              </div>
            ) : (
              <div style={{ color: "red" }}>
                <EyeInvisibleOutlined size={25} />
              </div>
            )}
          </Button>
          <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
            <EditOutlined />
          </Button>
        </div>
      ) : (
        ""
      ),
  },
];

export const ExchangeTransactionsColumn = (
  page,
  pageSize,
  openAccount,
  setApproveVisable,
  setDeclineVisable,
  setSelectedTrnasection,
  setAccountData,
  setVisibleAccountDetails,
  handleOpen,
  calculatedTimeDifference,
  setAttachedReportData,
  setAttachedReportVisible,
  handleCopyToClipboard,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      if (
        record?.liveUserReqStatus === "pending" ||
        record?.liveUserReqStatus === "cancelled"
      ) {
        return (
          <div>
            <div className="text-center">
              <Tag color="yellow">VERIFY</Tag>
            </div>
            <div style={{ display: "flex" }}>
              <>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "green",
                    marginBottom: "0px",
                  }}
                  disabled={record?.status == "pending"}
                  onClick={() => {
                    setApproveVisable(true);
                    setSelectedTrnasection(record);
                  }}
                >
                  A{" "}
                </Button>
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "red",
                    marginBottom: "0px",
                  }}
                  disabled={record?.status == "pending"}
                  onClick={() => {
                    setDeclineVisable(true);
                    setSelectedTrnasection(record);
                  }}
                >
                  {" "}
                  D{" "}
                </Button>
              </>
            </div>
          </div>
        );
      } else {
        return (
          <div className="text-center">
            <Tag color="blue">
              {text === "verified" ? "INPROCESS" : text?.toUpperCase()}
            </Tag>
          </div>
        );
      }
    },
  },
  {
    title: <div className="text-center"> Account Detail </div>,
    dataIndex: "accountId",
    key: "accountId",
    render: (text, record) =>
      text ? (
        <div className="text-center">
          <Button
            style={{ color: "green", textAlign: "center", margin: "0" }}
            onClick={() => {
              setAccountData(record);
              handleOpen(record);
              setVisibleAccountDetails(true);
            }}
          >
            {record?._id == openAccount ? (
              <div style={{ color: "red" }}>
                <EyeInvisibleOutlined size={25} />
              </div>
            ) : (
              <EyeOutlined size={25} />
            )}
          </Button>
        </div>
      ) : (
        ""
      ),
  },
  {
    title: <div className="text-center"> Attached Transaction </div>,
    dataIndex: "_id",
    key: "_id",
    width: 160,
    render: (text, record) => (
      <div className="text-center">
        <Badge
          count={
            record?.attachedTransactions?.length > 1
              ? record?.attachedTransactions?.length
              : 0
          }
          style={{
            backgroundColor: "#52c41a",
            fontSize: "10px",
            width: "16px",
            height: "16px",
            lineHeight: "16px",
            borderRadius: "50%",
          }}
          offset={[-8, 8]}
          showZero={false}
        >
          <Button
            style={{ margin: "0" }}
            className="text-center"
            onClick={() => {
              setAttachedReportData(record);
              setAttachedReportVisible(true);
            }}
          >
            <AccountBookOutlined size={25} />
          </Button>
        </Badge>
      </div>
    ),
  },
  {
    title: <div className="text-center"> PG Transaction Id </div>,
    dataIndex: "traId",
    key: "traId",
    render: (text) => (
      <div className="text-right-nowrap">
        {" "}
        {text ? (
          <CopyToClipboard text={text}>
            <div style={{ whiteSpace: "nowrap" }}>
              {text}{" "}
              <CopyOutlined
                onClick={() => handleCopyToClipboard(text, "PG")}
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        ) : (
          "-"
        )}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> User Name </div>,
    dataIndex: "user",
    key: "user",
    render: (text) => (
      <div className="text-line-height">
        <div>{text ? text?.userName : ""}</div>
        <div style={{ fontSize: "12px" }}>
          {text?.uniqueId ? text?.uniqueId : "-"}
        </div>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Contact Number </div>,
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (text) => (
      <CopyToClipboard text={text}>
        <div className="text-center">
          {" "}
          {text ? text : "-"}
          <CopyOutlined
            onClick={() => handleCopyToClipboard(text, "phoneNumber")}
            className="text-black-pointer"
          />
        </div>
      </CopyToClipboard>
    ),
  },
  // {
  //   title: <div className="text-center"> Email </div>,
  //   dataIndex: "email",
  //   key: "email",
  //   render: (text) => (
  //     <div className="text-center"> {text ? text : "-"} </div>
  //   ),
  // },
  {
    title: <div className="text-center"> Website Name </div>,
    dataIndex: "website",
    key: "website",
    render: (text, record) => (
      <div className="text-line-height">
        <div>{text ? text?.name : ""}</div>
        <div style={{ fontSize: "12px" }}>
          {text?.uniqueId ? text?.uniqueId : "-"}
        </div>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Paid Amount </div>,
    dataIndex: "paidAmount",
    key: "paidAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Pending Amount </div>,
    dataIndex: "pendingAmount",
    key: "pendingAmount",
    render: (text) => (text ? text?.toFixed(2) : "00"),
  },
  {
    title: <div className="text-center"> Account Type(UPI/Bank) </div>,
    dataIndex: "reqType",
    key: "reqType",
    render: (text) => (
      <div className="text-center">{text?.toUpperCase() || "-"}</div>
    ),
  },
  {
    title: <div className="text-center"> Sender Name </div>,
    dataIndex: "attachedTransactions",
    key: "attachedTransactions",
    render: (text, record) => {
      if (record?.attachedTransactions?.length === 1) {
        return (
          <div className="text-line-height">
            <div>{text ? text[0]?.user?.userName : "-"}</div>
            <div style={{ fontSize: "12px" }}>
              {text[0]?.user?.uniqueId ? text?.[0]?.user?.uniqueId : "-"}
            </div>
          </div>
        );
      } else {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    title: <div className="text-center"> Sender Contact </div>,
    dataIndex: "attachedTransactions",
    key: "attachedTransactions",
    render: (text, record) => {
      if (record?.attachedTransactions?.length === 1) {
        return (
          <CopyToClipboard text={text?.[0]?.phoneNumber}>
            <div className="text-center">
              {" "}
              {text?.[0]?.phoneNumber || "-"}
              <CopyOutlined
                onClick={() =>
                  handleCopyToClipboard(text?.[0]?.phoneNumber, "phoneNumber")
                }
                className="text-black-pointer"
              />
            </div>
          </CopyToClipboard>
        );
      } else {
        return <div className="text-center">-</div>;
      }
    },
  },
  {
    title: (
      <div className="text-center">
        {" "}
        Date(req creation Date, updation date){" "}
      </div>
    ),
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        <Tooltip title="Created At">
          <p style={{ margin: "0" }}>
            {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
        <Tooltip title="Updated At">
          <p style={{ margin: "0" }}>
            {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Time Difference </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <Tooltip title="Time Difference">
        <p style={{ margin: "0px", whiteSpace: "nowrap" }}>
          {calculatedTimeDifference(
            text ? text : record?.updatedAt,
            record.updatedAt,
          )}
        </p>
      </Tooltip>
    ),
  },
];

export const historyColumns = (
  page,
  pageSize,
  visiblemodel,
  historyData,
  onHistoryModalOpen,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-center">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Date </div>,
    dataIndex: "date",
    key: "date",
    render: (text) => (
      <div className="text-right-nowrap">
        {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "action",
    key: "action",
    render: (text) => <div className="text-center"> {text} </div>,
  },
  {
    title: <div className="text-center"> Action By </div>,
    dataIndex: "actionBy",
    key: "actionBy",
    render: (text) => <div className="text-center"> {text} </div>,
  },
  {
    title: <div className="text-center"> Status </div>,
    dataIndex: "status",
    key: "status",
    render: (text) => (
      <div className="text-center">
        {" "}
        <Tag
          style={{ margin: "0px" }}
          color={
            text === "created" ? "green" : text === "updated" ? "yellow" : "red"
          }
        >
          {text ? text?.toUpperCase() : "-"}
        </Tag>{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Activity Details </div>,
    dataIndex: "description",
    key: "description",
    render: (text, record) => (
      <div className="text-center">
        <Button
          style={{ margin: 0 }}
          title={visiblemodel ? "Active" : "Inactive"}
          onClick={() => onHistoryModalOpen(record)}
        >
          {record?._id == historyData?._id ? (
            <div style={{ color: "red" }}>
              <EyeInvisibleOutlined size={25} />
            </div>
          ) : (
            <div style={{ color: "green" }}>
              <EyeOutlined size={25} />
            </div>
          )}
        </Button>
      </div>
    ),
  },
];

export const CryptoFundWalletColumns = (
  page,

  pageSize,

  data,

  showConfirm,

  onStatusChange,
) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-right-nowrap">
        {" "}
        {`${((page - 1) * pageSize + index + 1)
          .toString()
          .padStart(2, "0")}`}{" "}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Name </div>,
    dataIndex: "name",
    key: "name",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Coin </div>,
    dataIndex: "coinDetails",
    key: "coinDetails",
    render: (text) => (
      <div className="text-center"> {text ? text?.name : "-"} </div>
    ),
  },
  {
    title: <div className="text-center"> Address </div>,
    dataIndex: "address",
    key: "address",
    render: (text) => <div className="text-center"> {text ? text : "-"} </div>,
  },
  {
    title: <div className="text-center"> Date(Created Date,Updated Date) </div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        {" "}
        <>
          <Tooltip title="Created At">
            <p style={{ margin: "0" }}>
              {onDateFormate(record?.createdAt, "DD-MM-YYYY hh:mm:ss A")}
            </p>
          </Tooltip>
          <Tooltip title="Updated At">
            <p style={{ margin: "0" }}>
              {" "}
              {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}{" "}
            </p>
          </Tooltip>
        </>
      </div>
    ),
  },
  {
    title: <div className="text-center"> Action </div>,
    dataIndex: "_id",
    key: "_id",
    render: (text, record) =>
      text ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <>
              <Button
                title={"Edit"}
                onClick={() => showConfirm(record, "edit")}
              >
                <EditOutlined />
              </Button>
              <Button
                title={
                  data.find((a) => a?._id === text)?.isActive
                    ? "Active"
                    : "Inactive"
                }
                onClick={() =>
                  onStatusChange({
                    _id: text,
                    isActive: !data.find((a) => a?._id === text)?.isActive,
                  })
                }
              >
                {!data.find((a) => a?._id === text)?.isActive ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <div style={{ color: "green" }}>
                    <EyeOutlined size={25} />
                  </div>
                )}
              </Button>
            </>
          </div>
        </>
      ) : (
        ""
      ),
  },
];
export const currencyConfigurationColumn = (handleChange) => [
  {
    title: <div className="text-center">Currency</div>,
    dataIndex: "name",
    key: "name",
    render: (text) => <div className="text-center">{text ? text : "-"}</div>,
  },
  {
    title: <div className="text-center">Conversion Rate</div>,
    dataIndex: "conversionRate",
    key: "conversionRate",
    render: (text, record) => (
      <div className="text-center">
        <Form>
          <Form.Item
            name={`customInput-${record.key}`}
            rules={[{ required: true, message: "Please input a value!" }]}
            style={{ marginBottom: 0 }}
          >
            <Input
              type="number"
              name="conversionRate"
              min={1}
              step="0.01"
              defaultValue={text}
              style={{ textAlign: "center", width: "50%" }}
              onChange={(e) => handleChange(e, record)}
            />
          </Form.Item>
        </Form>
      </div>
    ),
  },
];

export const ExchangeTransactionsCountColumn = (page, pageSize, data) => [
  {
    title: <div className="text-center"> Sr. No. </div>,
    dataIndex: "_id",
    key: "srNo",
    render: (text, record, index) => (
      <div className="text-center">{`${((page - 1) * pageSize + index + 1)
        .toString()
        .padStart(2, "0")}`}</div>
    ),
  },
  {
    title: <div className="text-center">Date</div>,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => (
      <div className="text-center">
        <Tooltip title="Created At">
          <p style={{ margin: "0" }}>{onDateFormate(text, "DD-MM-YYYY")}</p>
        </Tooltip>
        {/* <Tooltip title="Updated At">
          <p style={{ margin: "0" }}>
            {onDateFormate(record?.updatedAt, "DD-MM-YYYY hh:mm:ss A")}
          </p>
        </Tooltip> */}
      </div>
    ),
  },
  {
    title: <div className="text-center"> Count </div>,
    dataIndex: "count",
    key: "count",
    render: (text) => <div className="text-center">{text ? text : "00"}</div>,
  },
  {
    title: <div className="text-center"> Amount </div>,
    dataIndex: "amount",
    key: "amount",
    render: (text) => (
      <div className="text-center">{text ? text?.toFixed(2) : "00"}</div>
    ),
  },
];
