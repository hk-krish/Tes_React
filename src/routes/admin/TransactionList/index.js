import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { Button, Card, message, Tabs } from "antd";
import notify from "../../../Notification";
import { ArrowLeftOutlined } from "@ant-design/icons";
import BankAccountForm from "../../../components/BankAccountForm";
import DefaultTable from "../../../components/defaultTable/Table";
import { transactionListColumns } from "../../../components/ColumnComponents/columnComponents";
import { fetchActiveBankTab } from "../../../appRedux/actions/BankAccount";
import ImagePreviewModal from "../../../components/ImagePreviewModal";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateTransactionListReportData } from "../../../util/DownloadFormattedData";
import DepositeService from "../../../service/DepositeService";
import moment from "moment-timezone";
import TransactionReportServices from "../../../service/TransactionReportServices";

const TransactionList = (props) => {
  let title = "Transaction List Report";

  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { activeBankTab } = useSelector(({ bankAccount }) => bankAccount);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItem, setTotalItem] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [defaultActiveTab, setDefaultActiveTab] = useState("1");
  const [searchData, setSearchData] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [reset, setReset] = useState(false);
  const [selectReceiverType, setSelectReceiverType] = useState(null);
  const [receiverNames, setReceiverNames] = useState([]);
  const [selectReceiverAccounts, setSelectReceiverAccounts] = useState([]);
  const [selectReceiverName, setSelectReceiverName] = useState(null);
  const [selectReceiverAccount, setSelectReceiverAccount] = useState(null);
  const [allReceiverAccounts, setAllReceiverAccounts] = useState([]);

  const currentPageRef = useRef(page);

  const handleColor = (status) => {
    if (status === "success") {
      return "green";
    } else if (status === "pending") {
      return "yellow";
    } else if (status === "decline") {
      return "red";
    } else {
      return "blue";
    }
  };

  const fetchData = async (page, pageSize, fetchAllData = false) => {
    const getStatus = localStorage.getItem("status");
    const startDate = moment().tz("UTC").startOf("day").toDate();
    const endDate = moment().tz("UTC").endOf("day").toDate();
    setSelectReceiverType(selectReceiverType);

    const param = {
      id: props?.location?.state?.editData?._id,
      isTransactionList: true,
      page,
      limit: Number.MAX_SAFE_INTEGER,
      search: searchData || "",
      reqTypeFilter: "upi",
      dateFilter: {
        start: moment(startDate).tz(localStorage.getItem("timezone"), true),
        end: moment(endDate).tz(localStorage.getItem("timezone"), true),
      },
      receiverNameFilter: selectReceiverName,
      receiverAccountFilter: selectReceiverAccount,
      receiverTypeFiler: selectReceiverType,
      statusFilter: getStatus
        ? getStatus
        : selectedStatus === ""
          ? ""
          : selectedStatus,
    };
    setLoadingData(true);
    const reportResponse =
      await TransactionReportServices.getAllTransactionReport(param)
        .then((response) => {
          setData(response?.data?.transaction_data);
          let totalItems = response?.data?.totalData[0]?.count || 0;
          setTotalItem(totalItems);
          setLoadingData(false);
          const arr = [response?.data?.transaction_data];
          const newArr = arr[0].map((item, index) => ({
            name: item?.created?.name || item?.receiver?.name,
          }));
          const receiverAccountArray = arr[0]?.map((item) => ({
            name: item.depositAccount?.name || item.receiverAccount?.name,
          }));
          const receiverAccount = new Set(newArr.map(JSON.stringify));
          if (selectReceiverName === null) {
            const uniqueReceiverAccounts = new Set(
              receiverAccountArray.map(JSON.stringify),
            );
            setSelectReceiverAccounts(
              Array.from(uniqueReceiverAccounts, JSON.parse),
            );
            setAllReceiverAccounts(
              Array.from(uniqueReceiverAccounts, JSON.parse),
            );
          }
          setReceiverNames(Array.from(receiverAccount, JSON.parse));
          return response?.data?.transaction_data;
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });

    return reportResponse;
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRefresh = async () => {
    setSearchData(null);
    setPage(1);
    setData([]);
    setRefresh(true);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const selectedFormat = async (format) => {
    try {
      let reportData;
      if (format === "CSV" || format === "Excel") {
        setLoadingData(true);
        reportData = await fetchData(1, 1, true);
        setLoadingData(false);
      }

      if (reportData?.length !== 0) {
        if (format === "CSV") {
          downloadCSV(
            generateTransactionListReportData(reportData, "depositReport"),
            "Deposit Transaction Report",
          );
        } else if (format === "Excel") {
          downloadExcel(
            generateTransactionListReportData(reportData, "depositReport"),
            "Deposit Transaction Report",
          );
        }
      } else {
        notify.openNotificationWithIcon(
          "error",
          "Error",
          "No Data To Download.",
        );
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
      notify.openNotificationWithIcon(
        "error",
        "Error",
        "Failed to download data. Please try again.",
      );
    }
  };

  const handleChange = async (fieldName, selectedValue) => {
    localStorage.removeItem("status");
    if (fieldName === "statusFilter") {
      if (selectedValue === "All") selectedValue = "";
      setSelectedStatus(selectedValue);
      setPage(1);
      setPageSize(10);
    } else if (fieldName === "reset") {
      handleReset();
      setPage(1);
    } else if (fieldName === "receiverType") {
      localStorage.removeItem("receiverType");
      if (selectedValue === "all") {
        setSelectReceiverType(null);
      } else {
        setSelectReceiverType(selectedValue?.toLowerCase());
      }
    }
  };

  const handleSearchEvent = (event) => {
    setSearchClick(true);
    fetchData(page, pageSize);
  };

  const handleReset = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setStartDate(null);
    setEndDate(null);
    setSelectedValue(null);
    setSelectReceiverType(null);
    setSelectedStatus("");
    setSearchData(null);
    setSelectReceiverName(null);
    setSelectReceiverAccount(null);
    setData([]);
    setReset(true);
    setRefresh(true);
  };

  const handleCopyToClipboard = (text) => {
    message.success(`Text copied to clipboard: ${text}`);
  };

  const onUserSelect = (selectType, selectedName) => {
    localStorage.removeItem("status");
    setPage(1);
    setPageSize(10);
    if (selectType === "status") {
      if (selectedName === "all") {
        selectedName = "";
      }
      setSelectedStatus(selectedName?.toLowerCase());
    } else if (selectType === "reset") {
      handleReset();
    } else if (selectType === "receiverType") {
      localStorage.removeItem("receiverType");
      if (selectedName?.toLowerCase() === "all") {
        setSelectReceiverType(null);
      } else {
        setSelectReceiverType(selectedName?.toLowerCase());
      }
    } else if (selectType === "receiverName") {
      if (selectedName?.toLowerCase() === "all") {
        setSelectReceiverName(null);
      } else {
        setSelectReceiverName(selectedName);
      }
      setSelectReceiverAccount(null);
    } else if (selectType === "receiverAccount") {
      if (selectedName?.toLowerCase() === "all") {
        setSelectReceiverAccount(null);
      } else {
        setSelectReceiverAccount(selectedName);
      }
    }
  };

  useEffect(() => {
    if (data?.length) {
      if (selectReceiverName === null || selectReceiverName === "All") {
        setSelectReceiverAccounts(allReceiverAccounts);
      } else {
        const filteredAccounts = data.filter(
          (item) =>
            item?.created?.name || item?.receiver?.name === selectReceiverName,
        );
        const newValues = filteredAccounts.map((account) => ({
          name: account?.depositAccount?.name || account?.receiverAccount?.name,
          value:
            account?.depositAccount?.name || account?.receiverAccount?.name,
        }));
        var unique = [];
        var distinct = [];
        for (let i = 0; i < newValues.length; i++) {
          if (!unique[newValues[i].name]) {
            distinct.push({
              name: newValues[i].name,
              value: newValues[i].name,
            });
            unique[newValues[i].name] = 1;
          }
        }
        // const receiverAccount = new Set(newValues.map(JSON.stringify));
        // const uniqueReceiverAccounts = new Set(receiverAccount.map(JSON.stringify));
        setSelectReceiverAccounts(distinct);
      }
    }
  }, [selectReceiverName, data]);

  useEffect(() => {
    if (searchClick) {
      setSearchClick(false);
    }
  }, [searchClick]);

  const tableColumns = transactionListColumns(
    page,
    pageSize,
    handleColor,
    handleCopyToClipboard,
  );

  const tableData = {
    columns: tableColumns,
    totalResults: totalItem,
    showMore,
    refresh,
    handleRefresh,
    onSearchData,
    search: true,
    selectedFormat,
    download: [
      { name: "CSV", value: "csv" },
      { name: "Excel", value: "excel" },
    ],
    handleChangeFilter: handleChange,
    // advanceSearch:true,
    selectedStatus,
    transactionListFilter: true,
    handleSearchEvent,
    handleReset,
    onUserSelect,
    selectReceiverAccounts,
    receiverNames,
  };

  useEffect(() => {
    if (searchClick) {
      setSearchClick(false);
    }
  }, [searchClick]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
  }, [pageSize, searchData]);

  return (
    <>
      <Auxiliary>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                title={"Back"}
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => props.history.goBack()}
                style={{ marginBottom: 0, marginRight: "15px" }}
              />
              {title}
            </div>
          }
        >
          <DefaultTable
            dataSource={data}
            data={tableData}
            loadingData={loadingData}
            paginationData={{
              current: page,
              pageSize: pageSize,
              total: totalItem,
              onChange: handlePageChange,
            }}
            // selectedRowKeys={selectedRowKeys}
            // selectedRows={selectedRows}
          />
        </Card>
      </Auxiliary>
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
export default withRouter(TransactionList);
