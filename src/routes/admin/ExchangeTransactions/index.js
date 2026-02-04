import { message } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Auxiliary from "util/Auxiliary";
import AttachedTransactionReport from "../../../components/AttachedTransactionReport";
import BankDetailsModal from "../../../components/BankDetailsModal";
import { ExchangeTransactionsColumn } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import ExchangeTransactionsModal from "../../../components/ExchangeTransactionModal";
import notify from "../../../Notification";
import UserService from "../../../service/UserService";
import WebsiteService from "../../../service/WebsiteService";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateExchangeReportData } from "../../../util/DownloadFormattedData";
import { socket } from "../../../util/Socket/socketClient";
import { handleSocketEvent } from "../../../util/Socket/socketEventHandler";
import moment from "moment-timezone";
const title = "Exchange Transactions";

const ExchangeTransactions = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [openAccount, setOpenAccount] = useState();
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reset, setReset] = useState(false);
  const [searchClick, setSearchClick] = useState(false);
  const [attachedReportData, setAttachedReportData] = useState(null);
  const [attechedReportVisible, setAttachedReportVisible] = useState(null);
  const [visibleAccountDetails, setVisibleAccountDetails] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [reqTypeFilter, setReqTypeFilter] = useState(null);
  const [websiteFilter, setWebsiteFilter] = useState(null);
  const [approveVisable, setApproveVisable] = useState(false);
  const [declineVisable, setDeclineVisable] = useState(false);
  const [selectedTrnasection, setSelectedTrnasection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [request, setRequest] = useState(false);
  const [sortChanged, setSortChanged] = useState();
  const currentPageRef = useRef(page); // useRef to store the current page
  const handleOpen = (data) => {
    setOpenAccount(data?._id);
  };

  const fetchData = async (page, pageSize, fetchAllData = false) => {
    const getStatus = localStorage.getItem("status");
    const localReceiverType = localStorage.getItem("receiverType");

    let startOfToday;
    let endOfToday;
    if ((!startDate || !endDate) && !getStatus) {
      startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      localStorage.setItem("startDate", startOfToday);
      localStorage.setItem("endDate", endOfToday);
    }

    const startDate1 =
      getStatus || localReceiverType
        ? localStorage.getItem("startDate")
        : startDate || startOfToday;
    const endDate2 =
      getStatus || localReceiverType
        ? localStorage.getItem("endDate")
        : endDate || endOfToday;

    setSelectedValue(getStatus || "default");
    setStartDate(startDate1);
    setEndDate(endDate2);

    let params = {
      page,
      limit: pageSize, //20
      sortBy: localStorage.getItem("sortByV") == "true" ? true : false,
      search: searchData ? searchData : null,
      statusFilter: selectedStatus === "all" ? "" : selectedStatus || "",
      websiteFilter: websiteFilter === "all" ? "" : websiteFilter || "",
      reqTypeFilter: reqTypeFilter === "all" ? "" : reqTypeFilter || "",
      dateFilter: {
        start: moment(startDate1 || startDate).tz(localStorage.getItem("timezone"), true),
        end: moment(endDate2 || endDate).tz(localStorage.getItem("timezone"), true),
      },
    };

    setLoadingData(true);
    if (fetchAllData) {
      const allDataResponse =
        await UserService.getAllExchangeTransactions(params);
      const allData = allDataResponse?.data?.withdraw_data || [];
      setLoadingData(false);
      return allData;
    } else {
      await UserService.getAllExchangeTransactions(params)
        .then((response) => {
          console.log("response", response);
          let totalItem = response?.data?.totalData[0]
            ? response?.data?.totalData[0]?.count
            : 0;
          setTotalItem(totalItem);
          setData(response?.data?.withdraw_data);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    }
  };

  const onUpdateStatus = async (withdrawId, remark, status, password) => {
    let params = {
      withdrawId,
      remark,
      status,
      password,
    };
    if (!request) {
      setLoadingData(true);
      await UserService.editExchangeTransaction(params)
        .then((response) => {
          setIsLoading(false);
          if (response?.status === 200) {
            setApproveVisable(false);
            setDeclineVisable(false);
            setRefresh(true);
            setIsLoading(false);
            notify.openNotificationWithIcon(
              "success",
              "Success",
              "Your data has been successfully Updated",
            );
          } else {
            setIsLoading(false);
            notify.openNotificationWithIcon(
              "error",
              "Error",
              response?.message,
            );
            setLoadingData(false);
          }
        })
        .catch((err) => {
          // setRequest(true);
          setIsLoading(false);
          notify.openNotificationWithIcon("error", "Error", err?.message);
          message.error(err.message);
          setLoadingData(false);
        });
    }
  };

  const fetchAllWebsiteList = async () => {
    await WebsiteService.getAllWebsite({
      page,
      limit: Number.MAX_SAFE_INTEGER, //20,
    })
      .then((response) => {
        setWebsiteList(response.data.website_data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const calculatedTimeDifference = useMemo(() => {
    return (createdAt, updatedAt) => {
      const createdDate = new Date(createdAt);
      const updatedDate = new Date(updatedAt);

      const timeDifference = updatedDate - createdDate;
      const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3,600,000 milliseconds
      const remainingMilliseconds = timeDifference % 3600000;
      const minutes = Math.floor(remainingMilliseconds / 60000); // 1 minute = 60,000 milliseconds
      const seconds = Math.floor((remainingMilliseconds % 60000) / 1000); // 1 second = 1,000 milliseconds

      if (hours === 0) {
        return `${minutes.toString().padStart(2, "0")}m : ${seconds
          .toString()
          .padStart(2, "0")}s`;
      } else {
        return `${hours}h : ${minutes.toString().padStart(2, "0")}m : ${seconds
          .toString()
          .padStart(2, "0")}s`;
      }
    };
  }, []);

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const handleRefresh = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("receiverType");
    setSearchData(null);
    setPage(1);
    setPageSize(10);
    setData([]);
    setRefresh(true);
  };

  const handleCopyToClipboard = (text, type) => {
    if (type === "phoneNumber") {
      message.success(`Phone Number copied to clipboard: ${text}`);
    } else if (type === "PG") {
      message.success(`PG Transaction Id copied to clipboard: ${text}`);
    } else {
      message.success(`Password copied to clipboard: ${text}`);
    }
  };

  const onUserSelect = (selectType, selectedName, id) => {
    console.log("selectedName", selectedName);
    setPage(1);
    setPageSize(10);
    if (selectType === "status") {
      let status =
        selectedName === "in process"
          ? "inProcess"
          : selectedName?.toLowerCase();
      setSelectedStatus(status);
    } else if (selectType === "reqType") {
      setReqTypeFilter(selectedName);
    } else if (selectType === "reset") {
      handleReset();
    }
  };

  const handleWebsiteSelect = (websiteId) => {
    setWebsiteFilter(websiteId);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const reportDateFilter = (startDate, endDate) => {
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setPage(1);
    setPageSize(10);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setStartDate(null);
    setEndDate(null);
    setSearchData(null);
    setData([]);
    setReset(true);
    setRefresh(true);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const handleSearchEvent = () => {
    setSearchClick(true);
    setData([]);
  };

  const selectedFormat = async (format) => {
    try {
      let allData;
      if (format === "CSV" || format === "Excel") {
        setLoadingData(true);
        allData = await fetchData(1, Number.MAX_SAFE_INTEGER, true);
        setLoadingData(false);
      }

      if (format === "CSV") {
        downloadCSV(
          generateExchangeReportData(allData, "exchangeTransactions"),
          "Exchange Transactions",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generateExchangeReportData(allData, "exchangeTransactions"),
          "Exchange Transactions",
        );
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
      message.error("Failed to download data. Please try again.");
    }
  };

  const updateSocketEvent = (newData) => {
    console.log("newData----", newData);
    const currentPage = currentPageRef.current; // Access the current page from the ref
    let newSocketData = newData?.data?.[0]
      ? newData?.data?.[0]
      : newData?.data
        ? newData?.data
        : newData;

    if (
      newData === undefined ||
      newSocketData?.depositAccountOwnerType ||
      newSocketData?.withdrawAccountOwnerType !== "user"
    ) {
      // Handle the case where 'data' is undefined
      console.log("Received undefined data in 'newDepositRequest' event");
      return;
    }

    if (newData.eventType === "successWithdrawRequest" && newSocketData) {
      if (newSocketData?.liveUserReqStatus === "approved") {
        setData((prevData) =>
          prevData?.filter((item) => item?._id !== newSocketData?._id),
        );
      } else {
        setData((prevData) => {
          const newDataMatches = prevData?.some(
            (item) => item?._id === newSocketData?._id,
          );

          if (newDataMatches) {
            // If there is a match, replace the existing data item with the new data
            return prevData?.map((item) =>
              item?._id === newSocketData?._id ? newSocketData : item,
            );
          } else {
            // If there is no match, add the new data to the beginning of the array
            return [newSocketData, ...prevData];
          }
        });
      }
    } else {
      setData((prevData) => {
        const index = prevData?.findIndex((item) => item._id === newData?._id);
        if (index !== -1) {
          // If a match is found, replace the existing item
          const updatedData = [...prevData];
          updatedData[index] = newData;
          return updatedData;
        } else if (currentPage === 1) {
          // If no match is found and currentPage is 1, add the new data
          return [newData, ...prevData];
        }
        return prevData;
      });
    }
  };

  const handleChangeSortBy = () => {
    localStorage.setItem("sortByV", !sortChanged);
    setSortChanged((prev) => !prev);
  };

  useEffect(() => {
    // For Sorting Data
    let boolSortStatus = localStorage.getItem("sortByV");
    setSortChanged(boolSortStatus == "true" ? true : false);

    fetchAllWebsiteList();

    handleSocketEvent(
      "newWithdrawRequest",
      false, // Set Notifiaction False,
      updateSocketEvent,
    );

    handleSocketEvent(
      "successWithdrawRequest",
      false, // Set Notifiaction False,
      updateSocketEvent,
    );

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, []);

  useEffect(() => {
    if (searchClick) {
      fetchData(page, pageSize);
      setSearchClick(false);
    }
  }, [searchClick]);

  useEffect(() => {
    if (reset) {
      fetchData(page, pageSize);
      setReset(false);
    }
  }, [reset]);

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
  }, [page, pageSize, searchData, sortChanged]);

  const tableColumns = ExchangeTransactionsColumn(
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
  );

  const tableData = {
    refresh,
    startDate,
    endDate,
    selectedValue,
    websiteList,
    title: title,
    columns: tableColumns.filter((a) => (a ? a : undefined)),
    button: "",
    search: true,
    exchangeStatusFilter: true,
    exchangeRequestTypeFilter: true,
    websiteFilter: true,
    userWebsiteReport: true,
    totalResults: totalItem,
    download: true,
    isSort: true,
    sortBy: localStorage.getItem("sortByV") == "true" ? true : false,
    handleChangeSortBy,
    selectedFormat,
    handleReset,
    handleWebsiteSelect,
    reportDateFilter,
    handleSearchEvent,
    onUserSelect,
    showMore,
    onSearchData,
    handleRefresh,
    onSelectionChange,
  };

  return (
    <>
      <Auxiliary>
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
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
        />
      </Auxiliary>
      {visibleAccountDetails && (
        <BankDetailsModal
          visible={visibleAccountDetails}
          onClose={() => {
            setVisibleAccountDetails(false);
          }}
          modalName="Account Details"
          data={accountData}
          from="exchangeTransactions"
          setOpenAccount={setOpenAccount}
        />
      )}
      {attechedReportVisible && (
        <AttachedTransactionReport
          visibleModal={attechedReportVisible}
          selectedUserId={attachedReportData}
          onClose={() => setAttachedReportVisible(false)}
          userName={""}
          userId={""}
          userReport={true}
        />
      )}
      {(approveVisable || declineVisable) && (
        <ExchangeTransactionsModal
          visible={approveVisable ? approveVisable : declineVisable}
          onClose={() => {
            setApproveVisable(false);
            setDeclineVisable(false);
          }}
          decline={declineVisable}
          confirmLoading={isLoading}
          setConformLoading={setIsLoading}
          selectedTransectiondata={selectedTrnasection}
          onReceiveData={onUpdateStatus} // Pass the function as a prop
          request={setRequest}
        />
      )}
    </>
  );
};

export default ExchangeTransactions;
