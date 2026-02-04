import { DownloadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import DefaultTable from "../../../../components/defaultTable/Table";
import UserService from "../../../../service/UserService";
import { onDateFormate } from "../../../../util/DateFormate";
const title = "Transaction Report List";

const TransactionList = (props) => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visible_confirm_model, setVisible_confirm_model] = useState(false);
  const [visiblemodel, setVisiblemodel] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [pageLimit, setPageLimit] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionData, setActionData] = useState({
    message: "",
    action: "",
  });
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();

  const columns = [
    {
      title: () => <div style={{ textAlign: "right" }}>Sr. No.</div>,
      dataIndex: "_id",
      key: "srNo",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {data.findIndex((a) => a._id == text) + 1}
        </div>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (text) => <div style={{ whiteSpace: "nowrap" }}>{text}</div>,
    },
    // { title: 'Sender Unique ID', dataIndex: 'sender', key: 'sender', render: text => text?.uniqueId },
    {
      title: "Sender Name",
      dataIndex: "senderWebsite",
      key: "senderWebsite",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>{text?.name}</div>
      ),
    },
    {
      title: "Website URL",
      dataIndex: "senderWebsite",
      key: "senderWebsite",
      render: (text) => <div style={{ whiteSpace: "nowrap" }}>{text?.url}</div>,
    },
    {
      title: () => <div style={{ textAlign: "right" }}>Amount</div>,
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {text?.toLocaleString("en-IN")}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "reqType",
      key: "reqType",
      render: (text) => <div>{text?.toUpperCase()}</div>,
    },
    {
      title: "Receiver Type",
      dataIndex: "receiverAccountOwnerType",
      key: "receiverAccountOwnerType",
      render: (text) => <div>{text?.toUpperCase()}</div>,
    },
    {
      title: "UPI ID",
      dataIndex: "receiverAccount",
      key: "bankName",
      render: (text) => (text?.upiId ? text?.upiId : "-"),
    },
    {
      title: "Bank Name",
      dataIndex: "receiverAccount",
      key: "bankName",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>{text?.bankName}</div>
      ),
    },
    {
      title: "Bank Holder Name",
      dataIndex: "receiverAccount",
      key: "accName",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>{text?.accHolderName}</div>
      ),
    },
    {
      title: () => <div style={{ textAlign: "right" }}>Account No.</div>,
      dataIndex: "receiverAccount",
      key: "accno",
      render: (text) => (
        <div style={{ textAlign: "right" }}>{text?.accountNum}</div>
      ),
    },
    {
      title: "IFSC",
      dataIndex: "receiverAccount",
      key: "ifsc",
      render: (text) => text?.ifsc,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (
        <div style={{ whiteSpace: "nowrap" }}>
          {onDateFormate(text, "DD-MM-YYYY hh:mm:ss A")}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) =>
        text ? (
          <div
            style={{
              display: "flex",
              marginTop: "15px",
              flexDirection: "row",
              color:
                text === "success"
                  ? "green"
                  : text === "decline"
                    ? "red"
                    : null,
            }}
          >
            <a>{text?.toUpperCase()}</a>
          </div>
        ) : (
          ""
        ),
    },
    {
      title: "Download",
      dataIndex: "paymentSS",
      key: "_id",
      render: (text) =>
        text ? (
          <div
            style={{ display: "flex", marginTop: "15px", flexDirection: "row" }}
          >
            <a href={text}>
              <Button>
                <DownloadOutlined />
              </Button>
            </a>
          </div>
        ) : (
          ""
        ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (pagenumber) => {
    setLoadingData(true);
    await UserService.GetAllTransactionReportsData({
      userId: props.location.state?.id[0],
      page: pagenumber ? pagenumber : currentPage,
      limit: 5000, //20
    })
      .then((response) => {
        console.log("response", response.data);
        let newData = data.concat(response.data.user_transaction_data);
        setData(newData);
        setPageLimit(response.data?.state?.page_limit);
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

  useEffect(() => {
    if (refresh) {
      fetchData();
      setRefresh(false);
    }
  }, [refresh]);

  const handleRefresh = async () => {
    setData([]);
    setRefresh(true);
  };

  const ShowMore = async (pagination) => {
    await fetchData(pagination);
  };

  const tableData = {
    title: title,
    columns: columns,
    // addNewDataUrl: `user/edituser`,
    // button: 'ADD',
    back: "",
    backUrl: "/user",
    search: true,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
    ShowMore: ShowMore,
  };

  const showConfirm = (id, type) => {
    let selectedData = data.filter((item) => item._id === id);
    if (type === "delete") {
      setVisiblemodel(true);
      setVisible_confirm_model(true);
      setActionData({
        message: "Do you want to Delete selected User?",
        action: (e) => handleDelete([id], selectedData[0]),
      });
    } else if (type === "edit") {
      history.push({
        pathname: "user/edituser",
        state: {
          editData: selectedData[0],
          id: [id],
        },
      });
    } else if (type === "bank") {
      history.push({
        pathname: "bank",
        state: {
          editData: selectedData[0],
          id: [id],
          name: selectedData[0].name,
          type: "user",
        },
      });
    }
  };

  const handleDelete = async (key, row) => {
    setLoadingData(true);
    await UserService.deleteAgentById(key[0])
      .then((result) => {
        setLoadingData(false);
        let datas = data.filter((item, i) => item._id !== key[0]);
        setData(datas);
      })
      .catch((err) => {
        // console.log(err)
        setLoadingData(false);
        message.error(err.message);
      });
  };

  return (
    <>
      <Auxiliary>
        <DefaultTable
          dataSource={data}
          data={tableData}
          loadingData={loadingData}
          pagination={true}
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
        />
      </Auxiliary>
    </>
  );
};

export default withRouter(TransactionList);
