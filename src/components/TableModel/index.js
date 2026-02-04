import {
  AccountBookOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Button, Modal, Tooltip, message } from "antd";
import React, { useEffect, useState } from "react";
import UserService from "../../service/UserService";
import { onDateFormate } from "../../util/DateFormate";
import AttachedTransactionReport from "../AttachedTransactionReport";
import BankDetailsModal from "../BankDetailsModal";
import ImagePreviewModal from "../ImagePreviewModal";
import DefaultTable from "../defaultTable/Table";
import moment from "moment-timezone";

const TableModal = (props) => {
  let title = "Transaction Report";
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [pageLimit, setPageLimit] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [visibleAccountDetails, setVisibleAccountDetails] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [attechedReportVisible, setAttachedReportVisible] = useState(null);
  const [attachedReportData, setAttachedReportData] = useState(null);
  const [openAccount, setOpenAccount] = useState();
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchData, setSearchData] = useState(null);
  const [transactionType, setTransactionType] = useState(null);
  const [receiverType, setReceiverType] = useState([]);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reqType, setReqType] = useState(null);

  const handleOpen = (data) => {
    setOpenAccount(data?._id);
  };

  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await UserService.GetAllTransactionReportsData({
      page,
      limit: pageSize, //20
      userId: props.seletectedUserId._id,
      search: searchData ? searchData : null,
      transactionTypeFilter: transactionType
        ? transactionType === "all"
          ? ""
          : transactionType
        : null,
      entityFilter: receiverType[0] ? receiverType : null,
      reqTypeFilter: reqType === "all" ? "" : reqType,
      ...(startDate && endDate
        ? { dateFilter: { start: moment(startDate).tz(localStorage.getItem("timezone"), true), end: moment(endDate).tz(localStorage.getItem("timezone"), true) } }
        : {}),
    })
      .then((response) => {
        console.log("response", response.data);
        let totalItems = response?.data?.totalData[0]
          ? response?.data?.totalData[0]?.count
          : 0;
        setTotalItem(totalItems);
        setData(response.data.user_transaction_data);
        setPageLimit(response.data.state.page_limit);
        setLoadingData(false);
      })
      .catch((err) => {
        // console.log(err)
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };
  const handleRefresh = async () => {
    setSearchData(null);
    setTransactionType(null);
    setReceiverType([]);
    setPage(1);
    setData([]);
    setRefresh(true);
    setStartDate(null);
    setEndDate(null);
    setReqType(null);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const handleChangeFilter = (fieldName, selectedValue) => {
    if (fieldName === "transactionFilter") {
      setPage(1);
      setPageSize(10);
      setTransactionType(selectedValue.toLowerCase());
    } else if (fieldName === "receiverFilter") {
      if (selectedValue === "All") {
        setReceiverType([]);
      } else {
        setReceiverType([selectedValue.toLowerCase()]);
      }
      setPage(1);
      setPageSize(10);
    }
    setData([]);
  };

  const dateFilter = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setData([]);
    setRefresh(true);
  };

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    setData([]);
    props.seletectedUserId && fetchData(page, pageSize);
  }, [
    props.seletectedUserId,
    page,
    pageSize,
    searchData,
    receiverType,
    transactionType,
  ]);

  const columns = [
    {
      title: () => <div style={{ textAlign: "left" }}>Sr. No.</div>,
      dataIndex: "_id",
      key: "srNo",
      width: 70,
      render: (text, record, index) => (
        <div style={{ textAlign: "left" }}>
          {`${((page - 1) * pageSize + index + 1).toString().padStart(2, "0")}`}
        </div>
      ),
    },
    {
      title: () => "UTR Id",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 140,
      render: (text) => (text ? text : "-"),
    },
    {
      title: () => "Transaction ID",
      dataIndex: "gatewayTraId",
      key: "gatewayTraId",
      width: 140,
      render: (text) => (text ? text : "-"),
    },
    {
      title: () => "PG Transaction ID",
      dataIndex: "traId",
      key: "traId",
      width: 140,
      render: (text) => (text ? text : "-"),
    },
    {
      title: () => <div style={{ whiteSpace: "nowrap" }}>Request Type</div>,
      width: 120,
      dataIndex: "transactionType",
      key: "transactionType",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>{text.toUpperCase()}</div>
      ),
    },
    {
      title: () => <div style={{ whiteSpace: "nowrap" }}>Website Name</div>,
      dataIndex: "senderWebsite",
      key: "senderWebsite",
      width: 140,
      render: (text) => (
        <p style={{ whiteSpace: "nowrap" }}>{text?.name ? text?.name : "-"}</p>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 100,
      render: (text) => text?.toLocaleString("en-IN"),
    },
    {
      title: () => <div style={{ whiteSpace: "nowrap" }}>Receiver Type</div>,
      dataIndex: "sender",
      key: "sender",
      width: 120,
      render: (text, record) => {
        // Reguler Flow

        // record.transactionType === "deposit" ? (
        //   <p>
        //     {record.receiverAccountOwnerType === "agent"
        //       ? record.receiverAccountOwnerType.toUpperCase()
        //       : record?.receiver?.userType?.toUpperCase()}
        //   </p>
        // ) : (
        //   <p>{text?.userType?.toUpperCase()}</p>
        // ),

        // Handle for some time
        if (record.transactionType === "deposit") {
          if (record.receiverAccountOwnerType === "agent") {
            return <p>{record.receiverAccountOwnerType.toUpperCase()}</p>;
          } else {
            const firstTwoWords = record?.receiver?.uniqueId
              ?.split(" ")
              ?.slice(0, 2)
              ?.join(" ")
              ?.substring(0, 2);
            if (firstTwoWords.toUpperCase() === "AG") {
              return "AGENT";
            } else if (firstTwoWords.toUpperCase() === "VE") {
              return "VENDOR";
            }
            // return <p>{record?.receiver?.userType?.toUpperCase()}</p>;
          }
        } else {
          const firstTwoWords = text?.uniqueId
            ?.split(" ")
            ?.slice(0, 2)
            ?.join(" ")
            ?.substring(0, 2);
          if (firstTwoWords.toUpperCase() === "AG") {
            return "AGENT";
          } else if (firstTwoWords.toUpperCase() === "VE") {
            return "VENDOR";
          }
        }
      },
    },
    {
      title: () => <div style={{ whiteSpace: "nowrap" }}>Receiver Name</div>,
      dataIndex: "sender",
      key: "sender",
      width: 140,
      render: (text, record) =>
        record.transactionType === "deposit" ? (
          <div style={{ whiteSpace: "nowrap" }}>
            {record.receiverAccountOwnerType === "user" ? (
              <>
                <Tooltip title="User Name">
                  <p>{record.receiver?.name ? record.receiver?.name : "-"}</p>
                </Tooltip>
                <Tooltip title="Website Name">
                  <p>
                    {record.receiver?.websiteName
                      ? record.receiver?.websiteName
                      : "-"}
                  </p>
                </Tooltip>
              </>
            ) : record.receiverAccountOwnerType === "agent" ? (
              <>
                <Tooltip title="User Name">
                  <p>
                    {record.agent_receiver?.name
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
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (text) =>
        text ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p
              style={{
                color: text === "success" ? "green" : "red",
              }}
            >
              {text?.toUpperCase()}
            </p>
          </div>
        ) : (
          ""
        ),
    },
    {
      title: () => <div style={{ whiteSpace: "nowrap" }}>Account Details</div>,
      dataIndex: "receiverAccount",
      key: "receiverAccount",
      width: 140,
      render: (text, record) =>
        text ? (
          <Button
            style={{
              color: "green",
              textAlign: "center",
              marginTop: "15px",
            }}
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
      title: () => (
        <div style={{ whiteSpace: "nowrap" }}>Attached Transaction</div>
      ),
      dataIndex: "_id",
      key: "_id",
      width: 160,
      render: (text, record) =>
        record?.transactionType === "withdraw" &&
        record.attachedTransactions.length > 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{
                textAlign: "center",
              }}
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
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>-</div>
        ),
    },
    {
      title: "Image",
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

  // use common column components

  // const tableColumns = transactionReportColumn(
  //   page,
  //   pageSize,
  //   setVisibleAccountDetails,
  //   handleOpen,
  //   openAccount,
  //   setAccountData,
  //   setTotalResults,
  //   setAttachedReportData,
  //   setAttachedReportVisible,
  //   setImageModalVisible,
  //   setImageUrl
  // );

  const tableData = {
    refresh,
    title: title,
    columns: columns,
    // columns: tableColumns,
    search: true,
    startDate,
    endDate,
    totalResults: totalItem,
    transactionReport: true,
    dateFilter,
    onSearchData,
    showMore,
    handleChangeFilter,
    handleRefresh,
    onSelectionChange,

    yScroll: "300px",
    transactionFilter: [
      { name: "Deposit", value: "deposit" },
      { name: "Withdraw", value: "withdraw" },
    ],
    receiverFilter: [
      { name: "User", value: "user" },
      { name: "Vendor", value: "vendor" },
      { name: "Agent", value: "agent" },
      { name: "Website", value: "website" },
    ],
  };

  return (
    <>
      <Modal
        title={
          <p style={{ fontWeight: 400 }}>
            {props.seletectedUserId?.endUserId} [
            {props.seletectedUserId?.uniqueId}]
          </p>
        }
        closable={true}
        onCancel={() => {
          props.setSeletectedUserId(null);
          setPage(1);
          setPageLimit(10);
          setReceiverType([]);
          setTransactionType(null);
        }}
        visible={props.visibleModal}
        destroyOnClose={true}
        footer={null}
        width={"95%"}
        centered={true}
        style={{
          flexGrow: 0,
          marginTop: "2%",
          marginBottom: "2%",
          alignSelf: "center",
          justifyContent: "center",
        }}
        zIndex={999}
      >
        <div style={{ marginTop: "-15px" }}>
          <DefaultTable
            dataSource={data}
            data={tableData}
            loadingData={loadingData}
            pagination={true}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            paginationData={{
              current: page,
              pageSize: pageSize,
              total: totalItem,
              onChange: handlePageChange,
            }}
          />
        </div>
      </Modal>
      <BankDetailsModal
        visible={visibleAccountDetails}
        onClose={() => {
          setVisibleAccountDetails(false);
        }}
        modalName="Account Details"
        data={accountData}
        from="user"
        setOpenAccount={setOpenAccount}
      />
      <AttachedTransactionReport
        visibleModal={attechedReportVisible}
        selectedUserId={attachedReportData}
        totalResults={totalResults}
        onClose={() => setAttachedReportVisible(false)}
        userName={props.seletectedUserId?.endUserId}
        userId={props.seletectedUserId?.uniqueId}
        withdrawReport={false}
      />
      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => {
          setImageModalVisible(false);
        }}
        data={imageUrl}
      />
    </>
  );
};

export default TableModal;
