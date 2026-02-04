import { message } from "antd";
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { withdrawQueueColumns } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import AgentService from "../../../service/AgentService";
import PaymentGetway from "../../../service/PaymentService";
import VendorService from "../../../service/VendorService";
import WebsiteService from "../../../service/WebsiteService";
import WithdrawService from "../../../service/WithdrawService";
import { bankAccountAPI } from "../../../util/CommonAPI";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateWithdrawQueueFormattedData } from "../../../util/DownloadFormattedData";
import { socket } from "../../../util/Socket/socketClient";
import { handleSocketEvent } from "../../../util/Socket/socketEventHandler";

const Withdraw = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visiblemodel, setVisiblemodel] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("verified");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [vendorList, setVendorList] = useState(null);
  const [agentList, setAgentList] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [allWebsiteList, setAllWebsiteList] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const [reset, setReset] = useState(false);
  const [websiteFilter, setWebsiteFilter] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedReqType, setSelectedReqType] = useState(null);
  const [selectReceiverType, setSelectReceiverType] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState(null);
  const currentPageRef = useRef(page); // useRef to store the current page
  const [sortChanged, setSortChanged] = useState();
  const [currencyConversionFilter, setCurrencyConversionFilter] =
    useState(false);
  const [entityId, setEntityId] = useState(null);
  const [accountFilter, setAccountFilter] = useState(null);

  useEffect(() => {
    let boolSortStatus = localStorage.getItem("sortBy");
    setSortChanged(boolSortStatus == "true" ? true : false);
  }, []);

  const handleColor = (status) => {
    if (status === "verified") {
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

    const startDate1 =
      getStatus || localReceiverType
        ? localStorage.getItem("startDate")
        : startDate || startOfToday;
    const endDate2 =
      getStatus || localReceiverType
        ? localStorage.getItem("endDate")
        : endDate || endOfToday;

    setSelectedValue(getStatus || status);
    setStartDate(startDate1);
    setEndDate(endDate2);

    let params = {
      page,
      limit: pageSize, //20,
      sortBy: localStorage.getItem("sortBy") == "true" ? true : false,
      entityFilter: selectedIds[0] ? selectedIds : null,
      search: searchData || null,
      receiverTypeFiler: localReceiverType
        ? localReceiverType?.toLowerCase()
        : selectReceiverType === "all"
          ? ""
          : selectReceiverType,

      statusFilter:
        location.pathname === "/withdraw-pending-report"
          ? "pending"
          : status === "all"
            ? "verified"
            : status,
      reqTypeFilter: selectedReqType === "all" ? "" : selectedReqType,
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
        ? {
            manualWithdrawOrderFilter:
              orderTypeFilter === "Link" ? true : false,
          }
        : {}),
      currencyConversionFilter,
      accountFilter,
    };
    setLoadingData(true);
    try {
      if (fetchAllData) {
        const allDataResponse =
          await WithdrawService.getWithdrawRequestByFilter(params);
        const allData = allDataResponse?.data?.withdraw_data || [];
        setLoadingData(false);
        return allData;
      } else {
        const response =
          await WithdrawService.getWithdrawRequestByFilter(params);
        const totalItems = response?.data?.totalData[0]?.count || 0;
        setTotalItem(totalItems);
        setData(response?.data?.withdraw_data);
        setLoadingData(false);
      }
    } catch (error) {
      setLoadingData(false);
      message?.error(error?.message);
    }
  };

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
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
        setLoadingData(false);
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

  const handleRefresh = async () => {
    localStorage.removeItem("statusDepQue");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setSearchData(null);
    setData([]);
    setRefresh(true);
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

  const handleChange = async (
    fieldName,
    selectedName,
    selectedId,
    selectedValue,
  ) => {
    localStorage.removeItem("status");
    if (fieldName === "statusFilter") {
      setPage(1);
      setPageSize(10);
    } else if (fieldName === "statusFilterPenSub") {
      setPage(1);
      setPageSize(10);
      setStatus(selectedValue);
    }
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
          generateWithdrawQueueFormattedData(allData, "withdrawQueue"),
          "Withdraw Queue",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generateWithdrawQueueFormattedData(allData, "withdrawQueue"),
          "Withdraw Queue",
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

  const handleSearchEvent = (event) => {
    const selections = combineSelections();
    setSelectedIds(selections);
    setSearchClick(true);
    if (selectedIds.length > 0 || websiteFilter !== "") {
      fetchData(page, pageSize);
    }
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handleReset = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setStartDate(null);
    setEndDate(null);
    setSelectedWebsiteId(null);
    setSelectedValue(null);
    setSelectReceiverType(null);
    setStatus("verified");
    setOrderTypeFilter(null);
    setWebsiteFilter(null);
    setSelectedVendorId(null);
    setSelectedAgentId(null);
    setSelectedIds([]);
    setSelectedReqType(null);
    setPaymentFilter(null);
    setSearchData(null);
    setAccountFilter(null);
    setData([]);
    setReset(true);
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

  const updateSocketEvent = (newData) => {
    const currentPage = currentPageRef.current; // Access the current page from the ref

    if (newData === undefined) {
      // Handle the case where 'data' is undefined
      console.log("Received undefined data in 'newDepositRequest' event");
      return;
    }
    if (newData) {
      if (
        moment(newData?.createdAt).tz(localStorage.getItem("timezone"), true) >=
        moment.tz(localStorage.getItem("timezone"))
      ) {
        return;
      }
      if (location.pathname === "/withdraw/queue") {
        if (newData.status === "pending") {
          return;
        } else if (newData.status === "verified") {
          setData((prevData) => {
            const matchData = prevData.some(
              (item) => item?._id === newData?._id,
            );
            if (matchData) {
              if (localStorage.getItem("sortBy") == "true") {
                return prevData
                  .map((item) => (item?._id === newData._id ? newData : item))
                  .sort(
                    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                  );
              }
              return prevData.map((item) =>
                item?._id === newData._id ? newData : item,
              );
            } else {
              if (currentPage === 1) {
                return localStorage.getItem("sortBy") == "true"
                  ? [...prevData, newData]
                  : [newData, ...prevData];
              } else {
                return localStorage.getItem("sortBy") == "true"
                  ? prevData.sort(
                      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                    )
                  : prevData;
              }
            }
          });
        } else if (newData.eventType === "successWithdrawRequest") {
          setData((prevData) =>
            prevData.filter((item) => item._id !== newData.data?.withdrawId),
          );
        } else {
          return;
        }
        return;
      } else if (location.pathname === "/withdraw-pending-report") {
        if (newData.status === "pending") {
          if (
            !data.some((item) => item._id === newData._id) &&
            currentPage === 1
          ) {
            // If it's not a duplicate, add it to the state
            setData((prevData) => [newData, ...prevData]);
          }
          return;
        } else {
          setData((prevData) =>
            prevData.filter((item) => item._id !== newData._id),
          );
          return;
        }
      } else {
        console.log("----->>>");
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCopyToClipboard = (text) => {
    message.success(`Text copied to clipboard: ${text}`);
  };

  const handleChangeSortBy = () => {
    localStorage.setItem("sortBy", !sortChanged);
    setSortChanged((prev) => !prev);
  };

  useEffect(() => {
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
    fetchVendorList();
    fetchAgentList();
    fetchWebsiteList();
    fetchAllWebsiteList();
    fetchPaymentData();
    dispatch(bankAccountAPI("withdraw", selectedReqType, entityId));
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
    setPage(1);
    setPageSize(10);
    dispatch(bankAccountAPI("withdraw", selectedReqType, entityId));
  }, [entityId, selectedReqType]);

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
    currentPageRef.current = page;
  }, [page, pageSize, searchData, sortChanged, currencyConversionFilter]);

  const tableColumns = withdrawQueueColumns(
    page,
    location,
    pageSize,
    handleColor,
    handleCopyToClipboard,
  );

  const tableData = {
    websiteList,
    vendorList,
    agentList,
    withdrawAmount,
    refresh,
    selectedValue:
      selectedValue === "pgInProcess" ? "PGInProcess" : selectedValue,
    startDate,
    endDate,
    title:
      location.pathname === "/withdraw-pending-report"
        ? "Withdraw Pending Report"
        : "Withdraw Queue",
    columns: tableColumns,
    isSort: true,
    sortBy: sortChanged,
    handleChangeSortBy,
    download: true,
    search: true,
    totalResults: totalItem,
    statusRadio: status,
    advanceSearch: true,
    allWebsiteList,
    showMore,
    onSearchData,
    onUserSelect,
    selectedFormat,
    advanceSearch: true,
    autoSelectEndDate: true,
    orderFilter: true,
    reportDateFilter,
    handleRefresh,
    handleReset,
    handleSearchEvent,
    onSelectionChange,
    handleChangeFilter: handleChange,
    handleVendorSelect,
    handleAgentSelect,
    handleWebsiteSelect,
    onAccountSelect,
    paymentData,
    totalAmount:
      location.pathname !== "/withdraw-pending-report"
        ? totalAmount?.totalVerifiedAmount
        : totalAmount?.totalPendingAmount,

    filterButtonDepositeQueue:
      location.pathname !== "/withdraw-pending-report"
        ? [
            { name: "verified", value: "verified" },
            { name: "PGInProcess", value: "pgInProcess" },
          ]
        : null,
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
    </>
  );
};

export default withRouter(Withdraw);
