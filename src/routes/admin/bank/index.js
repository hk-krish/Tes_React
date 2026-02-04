import { message, Button, Card, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  PushpinOutlined,
  DeleteOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { withRouter, useHistory } from "react-router-dom";
import DefaultTable from "../../../components/defaultTable/Table";
import Auxiliary from "util/Auxiliary";
import WebsiteService from "../../../service/WebsiteService";
import AgentService from "../../../service/AgentService";
import VendorService from "../../../service/VendorService";
import { onDateFormate } from "../../../util/DateFormate";
import ConfirmModel from "../../../components/ConfirmModel";
import CopyToClipboard from "react-copy-to-clipboard";
let title = "Bank Details";

const BankList = (props) => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [totalItem, setTotalItem] = useState(null);
  const [requestType, setRequestType] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeStatus, setActiveStatus] = useState(true);
  const [visible_confirm_model, setVisible_confirm_model] = useState(false);
  const [visiblemodel, setVisiblemodel] = useState(false);
  const [actionData, setActionData] = useState({
    message: "",
    action: "",
  });

  useEffect(() => {
    title = (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Button
            title={"Back"}
            type="primary"
            icon={<ArrowLeftOutlined />}
            onClick={() => props.history.goBack()}
            style={{ marginTop: 10 }}
          />
          <span>Bank Details </span>
        </div>
        <div>
          {props.location.state?.type === "agents" &&
          localStorage.getItem("type") === "agents" ? (
            <span>
              {"("}Agent Name:{" "}
              {props.location.state?.name ||
              (localStorage.getItem("name") &&
                localStorage.getItem("name") !== "undefined")
                ? props.location.state?.name || localStorage.getItem("name")
                : ""}
              {")"}
            </span>
          ) : (
            ""
          )}
        </div>

        {props.location.state?.type === "websites" &&
        localStorage.getItem("type") === "websites" ? (
          <span style={{ marginLeft: "5px" }}>
            {"("}Website:{" "}
            {props.location.state?.name ||
            (localStorage.getItem("name") &&
              localStorage.getItem("name") !== "undefined")
              ? props.location.state?.name || localStorage.getItem("name")
              : ""}
            {")"}
          </span>
        ) : (
          ""
        )}
        {props.location.state?.type === "vendor" &&
        localStorage.getItem("type") === "vendor" ? (
          <span style={{ marginLeft: "5px" }}>
            {"("}Vendor:{" "}
            {props.location.state?.name ||
            (localStorage.getItem("name") &&
              localStorage.getItem("name") !== "undefined")
              ? props.location.state?.name || localStorage.getItem("name")
              : ""}
            {")"}
          </span>
        ) : (
          ""
        )}
      </div>
    );
  }, [loadingData]);

  const onStatusChange = async (datas) => {
    setLoadingData(true);
    await VendorService.editVendorBankAccountById(datas)
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          setLoadingData(false);
          fetchData(page, pageSize);
        } else {
          setLoadingData(false);
        }
      })
      .catch((err) => {
        setLoadingData(false);
      });
  };

  const showConfirm = (id, type) => {
    let selectedData = data?.filter((item) => item._id === id);
    if (type === "delete") {
      setVisiblemodel(true);
      setVisible_confirm_model(true);
      setActionData({
        message:
          'Are you sure you want to Delete "' + selectedData?.[0].name + '"?',
        action: (e) => handleDelete(id),
      });
    } else if (type === "edit") {
      history.push({
        pathname: "bank/editbank",
        state: {
          editData: selectedData[0],
          id: [id],
          name: selectedData[0]?.name,
          type: props.location.state?.type,
        },
      });
    }
  };

  const visibleModel = () => {
    setVisiblemodel(!visiblemodel);
  };

  const handleDelete = async (id) => {
    setLoadingData(true);
    const serviceMap = {
      websites: WebsiteService.deleteWebsiteById,
      vendor: VendorService.deleteVendorById,
      agents: AgentService.deleteAgentById, // Fixed typo from "agnet" to "agent"
    };
    const deleteService = serviceMap[props.location.state?.type];
    if (deleteService) {
      try {
        const response = await deleteService(id);
        // Check response status
        if (response.status === 200 || response.status === 202) {
          setLoadingData(false);
        }
      } catch (err) {
        setLoadingData(false);
      }
    } else {
      setLoadingData(false);
    }

    fetchData(page, pageSize);
  };

  const fetchData = async (page, pageSize) => {
    localStorage.setItem("type", props.location.state?.type);
    localStorage.setItem("name", props.location.state?.name);
    localStorage.setItem("id", props.location.state?.id[0]);

    setLoadingData(true);
    if (props.location.state?.type === "websites") {
      await WebsiteService.getAccountByWebsiteId({
        page,
        limit: pageSize,
        websiteId: props.location.state?.id[0],
        search: searchData,
        activeFilter: activeStatus,
        bankAccountFilter: requestType === "all" ? null : requestType,
      })
        .then((response) => {
          console.log("response", response.data);
          let totalItem = response?.data?.totalData
            ? response?.data?.totalData
            : 0;
          setTotalItem(totalItem);
          setData(response?.data?.response);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    } else if (props.location.state?.type === "vendor") {
      await VendorService.getAccountByVendorId({
        page,
        limit: pageSize,
        vendorId: props.location.state?.id[0],
        search: searchData,
        activeFilter: activeStatus,
        bankAccountFilter: requestType === "all" ? null : requestType,
      })
        .then((response) => {
          console.log("response", response.data);
          let totalItem = response?.data?.totalData
            ? response?.data?.totalData
            : 0;
          setTotalItem(totalItem);
          setData(response?.data?.response);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    } else {
      await AgentService.getAccountByAgentId({
        page: page,
        limit: pageSize,
        agentId: props.location.state?.id[0],
        search: searchData,
        bankAccountFilter: requestType === "all" ? null : requestType,
        activeFilter: activeStatus,
      })
        .then((response) => {
          console.log("response", response.data);
          let totalItem = response?.data?.totalData
            ? response?.data?.totalData
            : 0;
          setTotalItem(totalItem);
          setData(response?.data?.response);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    }
  };

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRefresh = async () => {
    setSearchData(null);
    setRequestType(null);
    setRefresh(true);
    setData([]);
  };

  const onSearchData = (data) => {
    setSearchData(data);
  };
  const hadleSwitchChange = () => {
    setActiveStatus(!activeStatus);
  };

  const handleChangeFilter = (fieldName, selectedValue) => {
    if (fieldName === "requestType") {
      setRequestType(selectedValue.toLowerCase());
    }
    setData([]);
  };

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, activeStatus]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if ((searchData, requestType)) {
      fetchData(page, pageSize);
    }
  }, [searchData, requestType]);
  
  const handleCopyToClipboard = (text) => {
    message.success(`Text copied to clipboard: ${text}`);
  };

  const columns = [
    {
      title: () => <div style={{ textAlign: "right" }}>Sr. No.</div>,
      dataIndex: "_id",
      key: "index",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {data.findIndex((a) => a?._id === text) + 1}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>{text ? text : "-"}</div>
      ),
    },
    {
      title: "Holder Name",
      dataIndex: "accHolderName",
      key: "accHolderName",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>{text ? text : "-"}</div>
      ),
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      render: (text, record) =>
        record?.type === "crypto" ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "15px",
              width: "max-content",
            }}
          >
            <img
              width={30}
              height={30}
              src={
                record?.cryptoWalletCoin?.logo
                  ? record?.cryptoWalletCoin?.logo
                  : "/assets/images/coinlogo.png"
              }
            />
            <span>{record?.cryptoWalletCoin?.name}</span>
          </div>
        ) : (
          <div style={{ whiteSpace: "nowrap" }}>{text ? text : "-"}</div>
        ),
    },
    {
      title: "Account No.",
      dataIndex: "accountNum",
      key: "accountNum",
      render: (text, record) =>
        text || record?.cryptoWalletAddress
          ? text || record?.cryptoWalletAddress
          : "-",
    },
    {
      title: "IFSC",
      dataIndex: "ifsc",
      key: "ifsc",
      render: (text, record) =>
        record?.type === "crypto"
          ? record?.cryptoWalletNetwork?.name
            ? record?.cryptoWalletNetwork?.name
            : "-"
          : text
            ? text
            : "-",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => text?.toUpperCase(),
    },
    {
      title: "UPI ID",
      dataIndex: "upiId",
      key: "upiId",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "UPI Url",
      dataIndex: "upiUrl",
      key: "upiUrl",
      render: (text) => (text ? (
        <CopyToClipboard text={text}>
          <div className="font-bold-nowrap">
            {new URLSearchParams(text.split('?')[1]).get("pa")}
            <CopyOutlined
              style={{marginLeft: 5}}
              onClick={() => handleCopyToClipboard(text)}
              className="text-black-pointer"
            />
          </div>
        </CopyToClipboard>
      ) : (
        "-"
      )),
    },
    {
      title: "Digital Rupee Wallet",
      dataIndex: "digitalRupeeWalletUrl",
      key: "digitalRupeeWalletUrl",
      render: (text) => (text ? text.split("pa=")[1]?.split("&")[0] : "-"),
    },
    // { title: 'Account Type', dataIndex: 'owner', key: 'owner' },
    {
      title: () => <div style={{ textAlign: "right" }}> {"Priority No."}</div>,
      dataIndex: "priorityNumber",
      key: "priorityNumber",
      render: (text, record) => (
        <div style={{ textAlign: "right" }}>
          {text?.toLocaleString("en-IN")}
        </div>
      ),
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>
          {"Daily Transaction Count Limit"}
        </div>
      ),
      dataIndex: "settings",
      key: "settings",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {text?.dailyTraCountLimit || "-"}
        </div>
      ),
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>{"User Transaction Count"}</div>
      ),
      dataIndex: "settings",
      key: "settings",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {text?.usedTraCountLimit || "0"}
        </div>
      ),
    },
    {
      title: () => <div style={{ textAlign: "right" }}>{"Deposit Limit"}</div>,
      dataIndex: "setLimit",
      key: "setLimit",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {text?.toLocaleString("en-IN") || "-"}
        </div>
      ),
    },
    {
      title: () => <div style={{ textAlign: "right" }}>Account Limit</div>,
      dataIndex: "singleTransactionLimit",
      key: "minmax",
      render: (text) => (
        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
          {(text?.min).toLocaleString("en-IN") +
            " to " +
            (text?.max).toLocaleString("en-IN")}
        </div>
      ),
    },
    {
      title: () => <div style={{ textAlign: "right" }}>{"Receive Amount"}</div>,
      dataIndex: "depositReceiveAmount",
      key: "depositReceiveAmount",
      render: (text) => (text ? text?.toFixed(2) : "00"),
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>Daily Received Deposit Amount</div>
      ),
      dataIndex: "limitType",
      key: "limitType",
      render: (text, record) => {
        if (text === "daily") {
          return (
            <div style={{ textAlign: "right" }}>
              {record?.depositDailySuccessAmount}
            </div>
          );
        } else {
          return <div style={{ textAlign: "right" }}>-</div>;
        }
      },
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>{"Deposit Queue Amount"}</div>
      ),
      dataIndex: "depositQueueAmount",
      key: "depositQueueAmount",
      render: (text) => (text ? text?.toFixed(2) : "00"),
    },
    {
      title: () => <div style={{ textAlign: "right" }}>{"Withdraw Limit"}</div>,
      dataIndex: "totalWithLimit",
      key: "totalWithLimit",
      render: (text, record) => (
        <div style={{ textAlign: "right" }}>
          {record?.type !== "crypto" ? text?.toLocaleString("en-IN") : "-"}
        </div>
      ),
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>Withdraw Account Limit</div>
      ),
      dataIndex: "singleWithdrawTransactionLimit",
      key: "minmax",
      render: (text) => (
        <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
          {(text?.min).toLocaleString("en-IN") +
            " to " +
            (text?.max).toLocaleString("en-IN")}
        </div>
      ),
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>{"Transferred Amount"}</div>
      ),
      dataIndex: "withdrawReceiveAmount",
      key: "withdrawReceiveAmount",
      render: (text) => (text ? text : 0),
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>
          Daily Withdraw Transferred Amount
        </div>
      ),
      dataIndex: "limitType",
      key: "limitType",
      render: (text, record) => {
        if (text === "daily" && record.type !== "crypto") {
          return (
            <div style={{ textAlign: "right" }}>
              {record?.withdrawDailySuccessAmount}
            </div>
          );
        } else {
          return <div style={{ textAlign: "right" }}>-</div>;
        }
      },
    },
    {
      title: () => (
        <div style={{ textAlign: "right" }}>{"Withdraw Queue Amount"}</div>
      ),
      dataIndex: "withdrawQueueAmount",
      key: "withdrawQueueAmount",
      render: (text) => (text ? text : 0),
    },
    {
      title: () => <div>{"Date(Created Date,Updated Date)"}</div>,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => (
        <div className="text-right-nowrap">
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
      title: <div className="text-center">Action</div>,
      dataIndex: "_id",
      key: "_id",
      render: (text) =>
        text ? (
          <div
            style={{
              display: "flex",
              paddingTop: "15px",
              flexDirection: "row",
            }}
          >
            <Button
              title={
                data.find((a) => a?._id === text)?.isOn ? "Active" : "Inactive"
              }
              onClick={() =>
                onStatusChange({
                  _id: text,
                  isOn: !data.find((a) => a?._id === text)?.isOn,
                })
              }
            >
              {data.find((a) => a?._id === text)?.isOn ? (
                <div style={{ color: "green" }}>
                  <EyeOutlined size={25} />
                </div>
              ) : (
                <div style={{ color: "red" }}>
                  <EyeInvisibleOutlined size={25} />
                </div>
              )}
            </Button>
            <Button title="Edit" onClick={() => showConfirm(text, "edit")}>
              <EditOutlined />
            </Button>
            <Button
              title={
                data.find((a) => a?._id === text)?.isPinned
                  ? "Pinned"
                  : "Unpinned"
              }
              onClick={() =>
                onStatusChange({
                  _id: text,
                  isPinned: !data.find((a) => a?._id === text)?.isPinned,
                })
              }
            >
              {data.find((a) => a?._id === text)?.isPinned ? (
                <div style={{ color: "green" }}>
                  <PushpinOutlined />
                </div>
              ) : (
                <div style={{ color: "red" }}>
                  <PushpinOutlined />
                </div>
              )}
            </Button>
            <Button
              title={"Delete"}
              onClick={() => showConfirm(text, "delete")}
            >
              <DeleteOutlined style={{ color: "red" }} />
            </Button>
          </div>
        ) : (
          ""
        ),
    },
  ];

  const tableData = {
    refresh,
    title: title,
    columns: columns,
    addNewDataUrl: `bank/addbank`,
    button: "",
    search: true,
    totalResults: totalItem,
    showMore,
    isActive: true,
    isPaymentToWithWebAcc: activeStatus,
    onSearchData,
    hadleSwitchChange,
    handleRefresh,
    handleChangeFilter,
    onSelectionChange,
    backButton: "",
    backUrl:
      props.location.state?.type === "websites"
        ? "websites"
        : props.location.state?.type === "vendor"
          ? "vendor"
          : "agents",
    requestType: [
      { name: "UPI", value: "upi" },
      { name: "BANK", value: "bank" },
      { name: "CRYPTO", value: "crypto" },
      { name: "DIGITAL RUPEE", value: "digital rupee" },
    ],
  };

  return (
    <>
      <Auxiliary>
        <DefaultTable
          // menu={menu}
          dataSource={data}
          data={tableData}
          loadingData={loadingData}
          paginationData={{
            current: page,
            pageSize: pageSize,
            total: totalItem,
            onChange: handlePageChange,
          }}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
        />
        {visible_confirm_model ? (
          <ConfirmModel
            actionData={actionData}
            visibleModel={visiblemodel}
            visible={visibleModel}
          />
        ) : null}
      </Auxiliary>
    </>
  );
};

export default withRouter(BankList);
