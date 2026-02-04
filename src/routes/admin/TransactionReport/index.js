import { message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { disableButton } from "../../../appRedux/actions";
import BankDetailsModal from "../../../components/BankDetailsModal";
import { depositeReportColumns } from "../../../components/ColumnComponents/columnComponents";
import ImagePreviewModal from "../../../components/ImagePreviewModal";
import DefaultTable from "../../../components/defaultTable/Table";
import AgentService from "../../../service/AgentService";
import TransactionReportServices from "../../../service/TransactionReportServices";
import VendorService from "../../../service/VendorService";
import WebsiteService from "../../../service/WebsiteService";
import AuthLogic from "../../../util/AuthLogic";
import { socket } from "../../../util/Socket/socketClient";
import PaymentGetway from "../../../service/PaymentService";
import DepositVerificationModal from "../../../components/DepositVerificationModal";
import moment from "moment-timezone";
import { bankAccountAPI } from "../../../util/CommonAPI";
const title = "Deposit Reports";

const TransactionReport = () => {
  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState(null);
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [visibleAccountDetails, setVisibleAccountDetails] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [vendorList, setVendorList] = useState(null);
  const [agentList, setAgentList] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [selectedReqType, setSelectedReqType] = useState(null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reset, setReset] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openAccount, setOpenAccount] = useState();
  const [searchData, setSearchData] = useState(null);
  const [selectReceiverType, setSelectReceiverType] = useState(null);
  const [allWebsiteList, setAllWebsiteList] = useState(null);
  const [websiteFilter, setWebsiteFilter] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const [avgTimeDifference, setAvgTimeDifference] = useState(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState(null);
  const [bankProcessFilter, setBankProcessFilter] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);
  const [currencyConversionFilter, setCurrencyConversionFilter] = useState(false);
  const [accountFilter, setAccountFilter] = useState(null);
  const [entityId, setEntityId] = useState(null);

  const handleOpen = (data) => {
    setOpenAccount(data?._id);
  };

  const fetchData = useMemo(
    () =>
      async (page, pageSize, fetchAllData = false) => {
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
          reportTypeFilter: "deposit",
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
          websiteFilter: websiteFilter === "all" ? "" : websiteFilter,
          paymentGatewayFilter: paymentFilter === "all" ? "" : paymentFilter,
          ...(bankProcessFilter
            ? { bankAutoReqFilter: bankProcessFilter }
            : {}),
          currencyConversionFilter,
          accountFilter,
        };
        setLoadingData(true);
        try {
          if (fetchAllData) {
            const allDataResponse =
              await TransactionReportServices.getAllTransactionReport(params);
            const allData = allDataResponse?.data?.transaction_data || [];
            setLoadingData(false);
            return allData;
          } else {
            const response =
              await TransactionReportServices.getAllTransactionReport(params);
            console.log("response----->>>", response);
            const totalItems = response?.data?.totalData[0]?.count || 0;
            setTotalItem(totalItems);
            setData(response?.data?.transaction_data);
            setAvgTimeDifference(response?.data?.stats[0]?.avgTimeDifference);
            setDepositAmount(response?.data?.stats[0]?.totalDepositAmount);
            setLoadingData(false);
          }
        } catch (error) {
          setLoadingData(false);
          message?.error(error?.message);
        }
      },
  );

  const fetchPaymentData = async () => {
    await PaymentGetway.getAllPaymentGetway({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => {
        console.log(
          "response of payment gateway list ===========>>>>",
          response.data,
        );
        let temp = response?.data?.paymentPartner_data?.filter(
          (item) => item?.transactionType === "deposit",
        );
        setPaymentData(temp);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const fetchVendorList = async () => {
    await VendorService.getAllVendor({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER, //20
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
      limit: Number.MAX_SAFE_INTEGER, //20
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

  const handleRefresh = async () => {
    setSearchData(null);
    setData([]);
    setRefresh(true);
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

  const handleCopyToClipboard = (text) => {
    message.success(`Password copied to clipboard: ${text}`);
  };

  // Combine individual selections into a single array
  const combineSelections = () => {
    const selections = [];
    if (selectedVendorId) selections.push(selectedVendorId);
    if (selectedAgentId) selections.push(selectedAgentId);
    if (selectedWebsiteId) selections.push(selectedWebsiteId);
    return selections;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const reportDateFilter = (startDate, endDate) => {
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setPage(1);
    setPageSize(10);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const selectedFormat = async (format) => {
    localStorage.setItem("DownloadFormat", format);
    localStorage.setItem("ReportType", "depositReport");
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
        type: "depositReport",
        auth: {
          authorization: AuthLogic.GetToken(),
        },
        payload: {
          page: 1,
          limit: Number.MAX_SAFE_INTEGER,
          isAdmin: true,
          reportTypeFilter: "deposit",
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
          websiteFilter: websiteFilter === "all" ? "" : websiteFilter,
          ...(bankProcessFilter
            ? { bankAutoReqFilter: bankProcessFilter }
            : {}),
          currencyConversionFilter,
          accountFilter,
        },
      };
      // You need to define userId here
      socket.emit("excel_data_request", params);
      message.info("Deposit Report Download in progress...");
      dispatch(disableButton(true));
    } catch (err) {
      console.error(err);
      message.error("Failed to download data. Please try again.");
    }
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const onUserSelect = (selectType, selectedName) => {
    localStorage.removeItem("status");
    // setSelectedValue(null);
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
    } else if (selectType === "orderType") {
      let value = selectedName === "All" ? null : selectedName;
      setOrderTypeFilter(value);
    } else if (selectType === "bankProcessFilter") {
      let value =
        selectedName === "all"
          ? null
          : selectedName === "auto to manual"
            ? "autoToManual"
            : selectedName;
      setBankProcessFilter(value);
    } else if (selectType === "paymentGateway") {
      setPaymentFilter(selectedName);
    } else {
      setSelectedReqType(selectedName);
      setAccountFilter(null);
    }
  };

  const handleReset = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setStartDate(null);
    setEndDate(null);
    setSelectedWebsiteId(null);
    setSelectedStatus(null);
    setSelectedValue(null);
    setSelectReceiverType(null);
    setSelectedStatus(null);
    setSelectedVendorId(null);
    setSelectedAgentId(null);
    setPaymentFilter(null);
    setWebsiteFilter(null);
    setSelectedIds([]);
    setSearchData(null);
    setSelectedReqType(null);
    setOrderTypeFilter(null);
    setBankProcessFilter(null);
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

  // For deposit verifaction history modal open
  const showConfirm = (data, type) => {
    if (type === "view") {
      setHistoryModalVisible(true);
      setHistoryModalData(data);
    }
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
    bankAccountAPI("deposit", selectedReqType, entityId);
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
    dispatch(bankAccountAPI("deposit", selectedReqType, entityId));
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

  const tableColumns = depositeReportColumns(
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
  );

  const tableData = {
    websiteList,
    vendorList,
    agentList,
    selectReceiverType,
    selectedValue,
    startDate,
    endDate,
    depositAmount,
    refresh,
    avgTimeDifference,
    title: title,
    search: true,
    advanceSearch: true,
    columns: tableColumns,
    download: true,
    downloadExcelCSV: false,
    totalResults: totalItem,
    allWebsiteList,
    orderFilter: true,
    bankProcessFilterVisible: true,
    paymentData,
    showMore,
    onSearchData,
    handleSearchEvent,
    onUserSelect,
    reportDateFilter,
    selectedFormat,
    handleVendorSelect,
    handleAgentSelect,
    handleWebsiteSelect,
    handleRefresh,
    handleReset,
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
          refresh={setRefresh}
        />
      </Auxiliary>
      <BankDetailsModal
        visible={visibleAccountDetails}
        onClose={() => {
          setVisibleAccountDetails(false);
        }}
        modalName="Account Details"
        data={accountData}
        from="deposit"
        setOpenAccount={setOpenAccount}
      />
      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => {
          setImageModalVisible(false);
        }}
        data={imageUrl}
      />
      {historyModalVisible && (
        <DepositVerificationModal
          visible={historyModalVisible}
          data={historyModalData}
          modalName={"History"}
          onClose={() => setHistoryModalVisible(false)}
          isDepositReport={true}
        />
      )}
    </>
  );
};

export default withRouter(TransactionReport);
