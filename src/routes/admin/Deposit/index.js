import { message } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import ADModal from "../../../components/ADModal";
import BankDetailsModal from "../../../components/BankDetailsModal";
import { depositQueueColumns } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import DepositVerificationModal from "../../../components/DepositVerificationModal";
import ImagePreviewModal from "../../../components/ImagePreviewModal";
import notify from "../../../Notification";
import AgentService from "../../../service/AgentService";
import DepositeService from "../../../service/DepositeService";
import PaymentGetway from "../../../service/PaymentService";
import VendorService from "../../../service/VendorService";
import WebsiteService from "../../../service/WebsiteService";
import { bankAccountAPI } from "../../../util/CommonAPI";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateFormattedData } from "../../../util/DownloadFormattedData";
import { socket } from "../../../util/Socket/socketClient";
import { handleSocketEvent } from "../../../util/Socket/socketEventHandler";

const Deposit = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [openAccount, setOpenAccount] = useState();
  const [status, setStatus] = useState("submitted");
  const [allWebsiteList, setAllWebsiteList] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [vendorList, setVendorList] = useState(null);
  const [agentList, setAgentList] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [selectReceiverType, setSelectReceiverType] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [websiteFilter, setWebsiteFilter] = useState(null);
  const [reset, setReset] = useState(false);
  const [searchClick, setSearchClick] = useState(false);
  const [selectedReqType, setSelectedReqType] = useState(null);
  const [visibleAccountDetails, setVisibleAccountDetails] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [bankProcessFilter, setBankProcessFilter] = useState(
    window.location.pathname === "/deposit-auto-queue" ? "auto" : null,
  );
  const [paymentData, setPaymentData] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [depositWaitingQueue, setDepositWaitingQueue] = useState(false);
  const [sortChanged, setSortChanged] = useState(false);
  const [title, setTitle] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(null);
  const [historyModalData, setHistoryModalData] = useState(null);
  const [approveVisable, setApproveVisable] = useState(false);
  const [declineVisable, setDeclineVisable] = useState(false);
  const [selectedTrnasection, setSelectedTrnasection] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccountData, setSelectedAccountData] = useState();
  const [currencyConversionFilter, setCurrencyConversionFilter] =
    useState(false);
  const [entityId, setEntityId] = useState(null);
  const [accountFilter, setAccountFilter] = useState(null);

  const currentPageRef = useRef(page); // useRef to store the current page
  const currentQueueTabRef = useRef(depositWaitingQueue); // useRef to store the current tab
  const historyFilter =
    window.location.pathname === "/deposit-verification-queue" ? true : false;

  const depositVerifactionTab =
    window.location.pathname === "/deposit-verification-queue";
  const depositAutoQueueTab =
    window.location.pathname === "/deposit-auto-queue";

  const handleColor = (status) => {
    if (status === "pending") {
      return "yellow";
    } else {
      return "blue";
    }
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

    const startDate1 = getStatus
      ? localStorage.getItem("startDate")
      : startDate || startOfToday;
    const endDate2 = getStatus
      ? localStorage.getItem("endDate")
      : endDate || endOfToday;

    setSelectedValue(getStatus || status);
    setStartDate(startDate1);
    setEndDate(endDate2);

    let params = {
      page,
      limit: pageSize, //20,
      sortBy: localStorage.getItem("sortByV") == "true" ? true : false,
      reportTypeFilter: "deposit",
      entityFilter: selectedIds[0] ? selectedIds : null,
      search: searchData || null,
      statusFilter: getStatus ? getStatus : status === "all" ? "" : status,
      reqTypeFilter: selectedReqType === "all" ? "" : selectedReqType,
      historyFilter: historyFilter, // For Deposit Verifaction Queue
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
      ...(orderTypeFilter
        ? { manualDepositFilter: orderTypeFilter === "Link" ? true : false }
        : {}),
      ...(bankProcessFilter ? { bankAutoReqFilter: bankProcessFilter } : {}),
      depositWaitingQueueFilter: depositWaitingQueue, //this filter is for deposit waiting queue
      currencyConversionFilter,
      accountFilter,
    };
    setLoadingData(true);
    try {
      if (fetchAllData) {
        const allDataResponse =
          await DepositeService.getDepositeRequestByFilter(params);
        const allData = allDataResponse?.data?.deposit_data || [];
        setLoadingData(false);
        return allData;
      } else {
        await DepositeService.getDepositeRequestByFilter(params)
          .then((response) => {
            setData(response?.data?.deposit_data);
            let totalItems = response?.data?.totalData[0]
              ? response?.data?.totalData[0]?.count
              : 0;
            setTotalItem(totalItems);
            setLoadingData(false);
          })
          .catch((err) => {
            console.log(err);
            setLoadingData(false);
            message.error(err.message);
          });
      }
    } catch (error) {
      setLoadingData(false);
      message?.error(error?.message);
    }
  };

  const fetchPaymentData = async () => {
    await PaymentGetway.getAllPaymentGetway({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
    })
      .then((response) => {
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

  const onUpdateStatus = async (
    remarks,
    password,
    utrId,
    verifyAmount,
    imageUrl,
    index,
    selectedAccount,
    status,
    isVerifyRequest,
  ) => {
    // const gatewayTraId =
    // selectedTrnasection?.gatewayTraId === utrId ? null : utrId;  //same utr id validation be side implement so not need this for now
    const accountId =
      selectedAccount === selectedAccountData ? null : selectedAccountData;
    const amount =
      selectedTrnasection?.amount === verifyAmount ? null : verifyAmount;
    let params = {
      depositId: index,
      remark: remarks,
      password: password,
      gatewayTraId:
        selectedTrnasection?.reqType === "digital rupee" ? null : utrId,
      isVerifyRequest,
      ...(accountId
        ? {
            accountId,
          }
        : {}),
      ...(imageUrl
        ? {
            paymentVerificationSS: imageUrl,
          }
        : {}),
      traStatus: status,
      ...(amount
        ? {
            amount,
          }
        : {}),
    };
    setLoadingData(true);
    await DepositeService.editDepositReportStatus(params)
      .then((response) => {
        setIsLoading(false);
        if (response?.status === 200) {
          setApproveVisable(false);
          setDeclineVisable(false);
          setIsLoading(false);
          setRefresh(true);
          notify.openNotificationWithIcon(
            "success",
            "Success",
            "Your data has been successfully Updated",
          );
          setLoadingData(false);
        } else {
          setIsLoading(false);
          notify.openNotificationWithIcon("error", "Error", response?.message);
          setLoadingData(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        notify.openNotificationWithIcon("error", "Error", err?.message);
        message.error(err.message);
        setLoadingData(false);
      });
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

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const handleRefresh = async () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handleChange = async (fieldName, selectedValue) => {
    localStorage.removeItem("status");
    if (fieldName === "statusFilter") {
      setPage(1);
      setPageSize(10);
    } else if (fieldName === "statusFilterPenSub") {
      setPage(1);
      setPageSize(10);
      setStatus(selectedValue.toLowerCase());
    }
  };

  const selectedFormat = async (format) => {
    try {
      let allData;
      if (format === "CSV" || format === "Excel") {
        setLoadingData(true);
        allData = await fetchData(page, Number.MAX_SAFE_INTEGER, true);
        setLoadingData(false);
      }

      if (format === "CSV") {
        downloadCSV(
          generateFormattedData(
            allData,
            "depositQueue",
            depositWaitingQueue,
            depositVerifactionTab,
          ),
          "Deposit Queue",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generateFormattedData(
            allData,
            "depositQueue",
            depositWaitingQueue,
            depositVerifactionTab,
          ),
          "Deposit Queue",
        );
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
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

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
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
    if (selectType === "reset") {
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
    setSelectedValue(null);
    setSelectedVendorId(null);
    setSelectedAgentId(null);
    setSelectReceiverType(null);
    setWebsiteFilter(null);
    setPaymentFilter(null);
    setStatus("submitted");
    setOrderTypeFilter(null);
    setSelectedIds([]);
    setSelectedReqType(null);
    setSearchData(null);
    setData([]);
    setAccountFilter(null);
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

  // Helper function to check if an item exists
  const doesItemExist = (dataArray, id) =>
    dataArray?.some((item) => item?._id === id);

  // Helper function to replace or add items
  const updateOrAddItem = (prevData, newItem, currentPage) => {
    const itemExists = doesItemExist(prevData, newItem?._id);
    if (itemExists) {
      // Replace the existing item
      return prevData.map((item) =>
        item?._id === newItem?._id ? newItem : item,
      );
    } else {
      // Add the item to the beginning if on page 1
      return currentPage === 1 ? [newItem, ...prevData] : prevData;
    }
  };

  // Helper function to remove an item
  const removeItem = (prevData, id) =>
    prevData?.filter((item) => item?._id !== id);

  const updateSocketEvent = (newData) => {
    console.log("newData=====>>>", newData);
    const currentPage = currentPageRef.current; // Access the current page from the ref
    const currentWaitingQueueTab = currentQueueTabRef.current; // Access the current page from the ref
    const isDepositVerifyRequest = newData?.data?.[0]?.isDepositVerifyRequest;
    const isEventDepositRequest = newData.eventType === "verifyDepositRequest";
    const isSuccessDepositRequest =
      newData?.eventType === "successDepositRequest";
    const isDepositVerificationPage =
      window.location.pathname === "/deposit-verification-queue";
    const isVerifyRequest = newData?.isVerifyRequest;
    const isWaitingQueueRequest = newData?.isDepositWaitingQueue;
    const isAutoApproval = newData?.isDepositReqAutoApproval;
    const isAutoApprovalPage =
      window.location.pathname === "/deposit-auto-queue";
    const isDepositQueuePage = window.location.pathname === "/deposit/queue";
    const isDepositManualOrder = newData?.isManualDepositOrder;

    if (newData === undefined) {
      // Handle the case where 'data' is undefined
      console.log("Received undefined data in 'newDepositRequest' event");
      return;
    }

    if (
      isDepositVerificationPage &&
      !isEventDepositRequest &&
      !isVerifyRequest
    ) {
      return;
    }

    if (
      currentWaitingQueueTab &&
      isDepositManualOrder &&
      !isWaitingQueueRequest
    ) {
      return;
    }

    // Handle Deposit Verify Queue page logic
    if (isEventDepositRequest) {
      const newDataItem = newData?.data?.[0];
      if (isDepositVerificationPage) {
        setData((prevData) => {
          if (isDepositVerifyRequest) {
            // Use `updateOrAddItem` to update or add the item
            return updateOrAddItem(prevData, newDataItem, currentPage);
          } else if (currentPage === 1) {
            // Use `removeItem` to remove the item
            return removeItem(prevData, newDataItem?._id);
          }
          return prevData;
        });
      } else {
        setData((prevData) => removeItem(prevData, newDataItem?._id));
      }
      return;
    }

    if (isSuccessDepositRequest) {
      setData((prevData) => removeItem(prevData, newData?.data?.depositId));
      return;
    }

    // Handle isDepositWaitingQueue request in deosit waiting Queue
    if (currentWaitingQueueTab) {
      if (isWaitingQueueRequest) {
        setData((prevData) => {
          return updateOrAddItem(prevData, newData, currentPage);
        });
      } else {
        setData((prevData) => {
          return removeItem(prevData, newData?._id);
        });
      }
      return;
    }

    // Handle auto-approval logic
    if (isAutoApprovalPage) {
      if (isAutoApproval) {
        setData((prevData) => {
          return updateOrAddItem(prevData, newData, currentPage);
        });
      } else {
        setData((prevData) => {
          return removeItem(prevData, newData?._id);
        });
      }
      return;
    }

    if (currentPage === 1 && isDepositQueuePage) {
      if (isAutoApproval || isWaitingQueueRequest) {
        setData((prevData) => {
          return removeItem(prevData, newData?._id);
        });
        return;
      }
      if (isDepositManualOrder) {
        setData(
          (prevData) => updateOrAddItem(prevData, newData, currentPage), // Use helper function to handle the logic
        );
        return;
      } else {
        setData((prevData) => {
          return [newData, ...prevData];
        });
        return;
      }
    }

    // Case: General Update or Add
    setData((prevData) => {
      const dataIndex = prevData?.findIndex(
        (item) => item?._id === newData?._id,
      );

      if (dataIndex !== -1) {
        // Replace existing item
        const updatedData = [...prevData];
        updatedData[dataIndex] = newData;
        return updatedData;
      } else if(currentPage === 1) return localStorage.getItem("sortByV") == "true" ? [...prevData, newData] : [newData, ...prevData];
      else if(currentPage !== 1) return localStorage.getItem("sortByV") == "true" ? [...prevData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)), newData] : [newData, ...prevData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))];
      else return prevData;
    });
  };

  const handleOpen = (data) => {
    setOpenAccount(data?._id);
  };

  const handleCopyToClipboard = (text) => {
    message.success(`Text copied to clipboard: ${text}`);
  };

  const handleChangeSortBy = () => {
    localStorage.setItem("sortByV", !sortChanged);
    setSortChanged((prev) => !prev);
  };

  // For deposit verifaction history modal open
  const showConfirm = (data, type) => {
    if (type === "view") {
      setHistoryModalVisible(true);
      setHistoryModalData(data);
    }
  };

  const depositQueueStatusFilter = [
    { name: "pending", value: "pending" },
    { name: "submitted", value: "submitted" },
  ];

  const handleTabs = (tabs) => {
    setData([]);
    if (tabs === "2") {
      setDepositWaitingQueue(true);
      currentQueueTabRef.current = true;
      setRefresh(true);
    } else {
      currentQueueTabRef.current = false;
      setRefresh(true);
      setDepositWaitingQueue(false);
    }
  };

  useEffect(() => { 
    setTitle(
      depositVerifactionTab
        ? "Deposit Verifiction Queue"
        : depositAutoQueueTab
          ? "Deposit Auto Queue"
          : "Deposit Queue",
    );

    handleSocketEvent(
      "newDepositRequest",
      false, // Set Notifiaction False,
      updateSocketEvent,
    );

    handleSocketEvent(
      "successDepositRequest",
      false, // Set Notifiaction False,
      updateSocketEvent,
    );

    handleSocketEvent(
      "depositWaitingQueue",
      false, // Set Notifiaction False,
      updateSocketEvent,
    );

    handleSocketEvent(
      "verifyDepositRequest",
      false, // Set Notifiaction False,
      updateSocketEvent,
    );

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, []);

  useEffect(() => {
    // For Sorting Data
    let boolSortStatus = localStorage.getItem("sortByV");
    setSortChanged(boolSortStatus == "true" ? true : false);

    fetchVendorList();
    fetchAgentList();
    fetchWebsiteList();
    fetchAllWebsiteList();
    fetchPaymentData();
    bankAccountAPI("deposit", selectedReqType, entityId);
  }, []);

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
    currentPageRef.current = page;
  }, [page, pageSize, searchData, sortChanged, currencyConversionFilter]);

  const tableColumns = depositQueueColumns(
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
  );

  const tableData = {
    websiteList,
    vendorList,
    agentList,
    refresh,
    selectedValue,
    startDate,
    endDate,
    showMore,
    onSearchData,
    title,
    columns: tableColumns?.filter((a) => (a ? a : undefined)),
    search: true,
    advanceSearch: true,
    orderFilter: true,
    bankProcessFilterVisible:
      depositAutoQueueTab || depositVerifactionTab ? false : true,
    totalResults: totalItem,
    allWebsiteList,
    paymentData,
    depositQueueTab: window.location.pathname === "/deposit/queue",
    selectedFormat,
    onUserSelect,
    reportDateFilter,
    isSort: true,
    sortBy: localStorage.getItem("sortByV") == "true" ? true : false,
    handleChangeSortBy,
    handleRefresh,
    handleReset,
    handleSearchEvent,
    handleVendorSelect,
    handleAgentSelect,
    handleWebsiteSelect,
    onSelectionChange: onSelectionChange,
    handleChangeFilter: handleChange,
    handleTabs,
    onAccountSelect,
    filterButtonDepositeQueue: depositVerifactionTab
      ? false
      : depositQueueStatusFilter,
    download: [
      { name: "CSV", value: "csv" },
      { name: "Excel", value: "excel" },
    ],
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
        <BankDetailsModal
          visible={visibleAccountDetails}
          onClose={() => {
            setVisibleAccountDetails(false);
          }}
          modalName="Account Details"
          data={accountData}
          from="depositQueue"
          setOpenAccount={setOpenAccount}
        />
        <ImagePreviewModal
          visible={imageModalVisible}
          onClose={() => {
            setImageModalVisible(false);
          }}
          data={imageUrl}
        />
      </Auxiliary>
      {(approveVisable || declineVisable) && (
        <ADModal
          visible={approveVisable || declineVisable}
          onClose={() => {
            setApproveVisable(false);
            setDeclineVisable(false);
          }}
          decline={declineVisable}
          confirmLoading={isLoading}
          setConformLoading={setIsLoading}
          selectedTransectiondata={selectedTrnasection}
          onReceiveData={onUpdateStatus} // Pass the function as a prop
          deposit
        />
      )}
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
          isDepositReport={
            window.location.pathname === "/deposit-verification-queue"
          }
        />
      )}
    </>
  );
};

export default withRouter(Deposit);
