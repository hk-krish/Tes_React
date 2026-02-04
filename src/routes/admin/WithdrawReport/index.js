import { message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { disableButton } from "../../../appRedux/actions";
import AttachedTransactionReport from "../../../components/AttachedTransactionReport";
import BankDetailsModal from "../../../components/BankDetailsModal";
import { withdrawReportColumn } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import AgentService from "../../../service/AgentService";
import PaymentGetway from "../../../service/PaymentService";
import VendorService from "../../../service/VendorService";
import WebsiteService from "../../../service/WebsiteService";
import WithdrawService from "../../../service/WithdrawService";
import { socket } from "../../../util/Socket/socketClient";
import moment from "moment";
import { bankAccountAPI } from "../../../util/CommonAPI";
const title = "Withdraw Reports";

const WithdrawReport = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [visibleAccountDetails, setVisibleAccountDetails] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [vendorList, setVendorList] = useState(null);
  const [agentList, setAgentList] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedReqType, setSelectedReqType] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [openAccount, setOpenAccount] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectReceiverType, setSelectReceiverType] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [attachedReportData, setAttachedReportData] = useState(null);
  const [attechedReportVisible, setAttachedReportVisible] = useState(null);
  const [allWebsiteList, setAllWebsiteList] = useState(null);
  const [websiteFilter, setWebsiteFilter] = useState(null);
  const [downloadExcelCSV, setDownloadExcelCSV] = useState(false);
  const [searchClick, setSearchClick] = useState(false);
  const [reset, setReset] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [avgTimeDifference, setAvgTimeDifference] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState(null);
  const [currencyConversionFilter, setCurrencyConversionFilter] =
    useState(false);
  const [entityId, setEntityId] = useState(null);
  const [accountFilter, setAccountFilter] = useState(null);

  const handleOpen = (data) => {
    setOpenAccount(data?._id);
  };

  const fetchData = async (page, pageSize, fetchAllData = false) => {
    const getStatus = localStorage.getItem("status");
    const localReceiverType = localStorage.getItem("receiverType");
    setSelectReceiverType(localReceiverType || selectReceiverType);

    let startOfToday;
    let endOfToday;
    if ((!startDate || !endDate) && !getStatus) {
      startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      endOfToday = new Date();
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
      limit: pageSize, //20,
      entityFilter: selectedIds[0] ? selectedIds : null,
      search: searchData || null,
      receiverTypeFiler: localReceiverType
        ? localReceiverType?.toLowerCase()
        : selectReceiverType === "all"
          ? ""
          : selectReceiverType,
      statusFilter: getStatus
        ? getStatus
        : selectedStatus === "all"
          ? ""
          : selectedStatus,
      reqTypeFilter: selectedReqType === "all" ? "" : selectedReqType,
      ...(orderTypeFilter
        ? { manualOrderFilter: orderTypeFilter === "Link" ? true : false }
        : {}),
      ...((startDate && endDate) || (startDate1 && endDate2)
        ? {
            dateFilter: {
              start: moment(startDate1 || startDate).tz(
                localStorage.getItem("timezone"),
                true,
              ),
              end: moment(endDate2 || endDate).tz(
                localStorage.getItem("timezone"),
                true,
              ),
            },
          }
        : {}),
      allWebsiteFilter: websiteFilter === "all" ? "" : websiteFilter,
      paymentGatewayFilter: paymentFilter === "all" ? "" : paymentFilter,
      currencyConversionFilter,
      accountFilter,
    };
    setLoadingData(true);
    try {
      if (fetchAllData) {
        const allDataResponse =
          await WithdrawService.getWithdrawReportByFilter(params);
        const allData = allDataResponse?.data?.transaction_data || [];
        setLoadingData(false);
        return allData;
      } else {
        const response =
          await WithdrawService.getWithdrawReportByFilter(params);
        const totalItems = response?.data?.totalData[0]?.count || 0;
        setTotalItem(totalItems);
        setData(response?.data?.transaction_data);
        setAvgTimeDifference(response?.data?.stats[0]?.avgTimeDifference);
        setWithdrawAmount(response?.data?.stats[0]?.totalWithdrawAmount);
        setLoadingData(false);
      }
    } catch (error) {
      setLoadingData(false);
      message?.error(error?.message);
    }
  };

  const fetchVendorList = async () => {
    await VendorService.getAllVendor({
      page: 1,
      limit: 5000, //20
    })
      .then((response) => {
        setVendorList(response?.data?.vendor_data);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const fetchAgentList = async () => {
    await AgentService.getAllAgent({
      page: 1,
      limit: 5000, //20
    })
      .then((response) => {
        setAgentList(response?.data?.agent_data);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const fetchWebsiteList = async () => {
    await WebsiteService.getAllWebsite({
      page,
      limit: Number.MAX_SAFE_INTEGER, //20,
      agentIdFilter: selectedAgentId ? selectedAgentId : null,
    })
      .then((response) => {
        let newResponseData = [];

        response.data.website_data.forEach((item, index) => {
          item.agentName = item?.agent?.name;
          newResponseData.push(item);
        });
        setWebsiteList(newResponseData);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const fetchAllWebsiteList = async () => {
    await WebsiteService.getAllWebsite({
      page,
      limit: Number.MAX_SAFE_INTEGER, //20,
    })
      .then((response) => {
        let newResponseData = [];

        response.data.website_data.forEach((item, index) => {
          item.agentName = item?.agent?.name;
          newResponseData.push(item);
        });
        setAllWebsiteList(newResponseData);
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };

  const fetchPaymentData = async () => {
    await PaymentGetway.getAllPaymentGetway({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => {
        let temp = response?.data?.paymentPartner_data?.filter(
          (item) => item?.transactionType === "withdraw",
        );
        setPaymentData(temp);
      })
      .catch((err) => {
        console.log(err);
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

  const handleCopyToClipboard = (text) => {
    message.success(`Password copied to clipboard: ${text}`);
  };

  const combineSelections = () => {
    const selections = [];
    if (selectedVendorId) selections.push(selectedVendorId);
    if (selectedAgentId) selections.push(selectedAgentId);
    if (selectedWebsiteId) selections.push(selectedWebsiteId);
    return selections;
  };

  const onUserSelect = (selectType, selectedName) => {
    localStorage.removeItem("status");
    setPage(1);
    setPageSize(10);
    if (selectType === "status") {
      setSelectedStatus(selectedName?.toLowerCase());
    } else if (selectType === "reset") {
      handleReset();
    } else if (selectType === "receiverType") {
      localStorage.removeItem("receiverType");
      setSelectReceiverType(selectedName?.toLowerCase());
    } else if (selectType === "allWebsiteList") {
      setWebsiteFilter(selectedName);
    } else if (selectType === "paymentGateway") {
      setPaymentFilter(selectedName);
    } else if (selectType === "orderType") {
      let value = selectedName === "All" ? null : selectedName;
      setOrderTypeFilter(value);
    } else {
      setSelectedReqType(selectedName);
      setAccountFilter(null);
    }
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handleVendorSelect = (vendorId) => {
    setSelectedVendorId(vendorId);
    setEntityId(vendorId);
    setAccountFilter(null);
  };

  const handleAgentSelect = (agentId) => {
    if (agentId === undefined) {
      setSelectedAgentId("");
    } else {
      setSelectedAgentId(agentId);
      setEntityId(agentId);
      setAccountFilter(null);
    }
  };

  // Similar function for handling website selection
  const handleWebsiteSelect = (websiteId) => {
    setSelectedWebsiteId(websiteId);
    setEntityId(websiteId);
    setAccountFilter(null);
  };

  // Account Filter Handle
  const onAccountSelect = (accountId) => {
    setAccountFilter(accountId);
  };

  const selectedFormat = async (format) => {
    localStorage.setItem("DownloadFormat", format);
    localStorage.setItem("ReportType", "withdrawReport");
    try {
      const getStatus = localStorage.getItem("status");
      const localReceiverType = localStorage.getItem("receiverType");
      setSelectReceiverType(localReceiverType || selectReceiverType);

      let startOfToday;
      let endOfToday;
      if ((!startDate || !endDate) && !getStatus) {
        startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        endOfToday = new Date();
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

      const params = {
        type: "withdrawReport",
        auth: {
          authorization: localStorage.getItem("user_token"),
        },
        payload: {
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          reportTypeFilter: "withdraw",
          entityFilter: selectedIds[0] ? selectedIds : null,
          search: searchData || null,
          receiverTypeFiler: localReceiverType
            ? localReceiverType?.toLowerCase()
            : selectReceiverType === "all"
              ? ""
              : selectReceiverType,
          statusFilter: getStatus
            ? getStatus
            : selectedStatus === "all"
              ? ""
              : selectedStatus,
          reqTypeFilter: selectedReqType === "all" ? "" : selectedReqType,
          paymentGatewayFilter: paymentFilter === "all" ? "" : paymentFilter,
          allWebsiteFilter: websiteFilter === "all" ? "" : websiteFilter,
          ...(orderTypeFilter
            ? { manualOrderFilter: orderTypeFilter === "Link" ? true : false }
            : {}),
          ...((startDate && endDate) || (startDate1 && endDate2)
            ? {
                dateFilter: {
                  start: moment(startDate1 || startDate).tz(
                    localStorage.getItem("timezone"),
                    true,
                  ),
                  end: moment(endDate2 || endDate).tz(
                    localStorage.getItem("timezone"),
                    true,
                  ),
                },
              }
            : {}),
          ...(getStatus === "success" || getStatus === "decline"
            ? {
                transactionTypeFilter:
                  getStatus === "success" || getStatus === "decline"
                    ? "withdraw"
                    : "",
              }
            : {}),
          currencyConversionFilter,
          accountFilter,
        },
      };
      socket.emit("excel_data_request", params);
      message.info("Withdraw Report Download in progress...");
      dispatch(disableButton(true));
    } catch (err) {
      console.error(err);
      // setLoadingData(false);
      message.error("Failed to download data. Please try again.");
    }
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
    setSelectedWebsiteId(null);
    setSelectedValue(null);
    setSelectedVendorId(null);
    setSelectedAgentId(null);
    setSelectedStatus(null);
    setSelectReceiverType(null);
    setWebsiteFilter(null);
    setSelectedIds([]);
    setSearchData(null);
    setSelectedReqType(null);
    setPaymentFilter(null);
    setOrderTypeFilter(null);
    setAccountFilter(null);
    setData([]);
    setReset(true);
  };

  const handleSearchEvent = (event) => {
    const selections = combineSelections();
    setSelectedIds(selections);
    setSearchClick(true);
    if (selectedIds.length > 0 || websiteFilter !== "") {
      fetchData(page, pageSize);
    }
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  useEffect(() => {
    if (searchClick) {
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
    fetchVendorList();
    fetchAgentList();
    fetchWebsiteList();
    fetchAllWebsiteList();
    fetchPaymentData();
    bankAccountAPI("withdraw", selectedReqType, entityId);
  }, []);

  useEffect(() => {
    setPage(1);
    setPageSize(10);
    const selections = combineSelections();
    setSelectedIds(selections);
  }, [selectedVendorId, selectedAgentId, selectedWebsiteId]);

  useEffect(() => {
    setPage(1);
    setPageSize(10);
    dispatch(bankAccountAPI("withdraw", selectedReqType, entityId));
  }, [entityId, selectedReqType]);

  useEffect(() => {
    if (selectedAgentId || selectedAgentId === "") {
      fetchWebsiteList();
    }
  }, [selectedAgentId]);

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
  }, [page, pageSize, searchData, currencyConversionFilter]);

  const tableColumns = withdrawReportColumn(
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
  );

  const tableData = {
    websiteList,
    vendorList,
    agentList,
    selectedValue,
    selectReceiverType,
    startDate,
    endDate,
    withdrawAmount,
    refresh,
    paymentData,
    avgTimeDifference,
    title: title,
    columns: tableColumns,
    search: true,
    advanceSearch: true,
    totalResults: totalItem,
    download: true,
    downloadExcelCSV,
    allWebsiteList,
    orderFilter: true,
    onSearchData,
    showMore,
    handleVendorSelect,
    handleAgentSelect,
    handleWebsiteSelect,
    reportDateFilter,
    handleSearchEvent,
    onUserSelect,
    selectedFormat,
    handleRefresh,
    handleReset,
    onSelectionChange,
    onAccountSelect,
    currencyConversionFilter: currencyConversionFilter,
    currencyConversionFilterToggle: true,
    handleCurrencyConversionSwitchChange: (e) => setCurrencyConversionFilter(e),
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
      <BankDetailsModal
        visible={visibleAccountDetails}
        onClose={() => {
          setVisibleAccountDetails(false);
        }}
        modalName="Account Details"
        data={accountData}
        from="withdraw"
        setOpenAccount={setOpenAccount}
      />
      <AttachedTransactionReport
        visibleModal={attechedReportVisible}
        selectedUserId={attachedReportData}
        onClose={() => setAttachedReportVisible(false)}
        userName={""}
        userId={""}
        withdrawReport={true}
      />
    </>
  );
};

export default withRouter(WithdrawReport);
