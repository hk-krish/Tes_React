import { message } from "antd";
import React, { useEffect, useState } from "react";
import Auxiliary from "util/Auxiliary";
import { websiteReportColumn } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import WebsiteService from "../../../service/WebsiteService";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateWebsiteReportData } from "../../../util/DownloadFormattedData";
import moment from "moment-timezone";

const title = "Website Reports";

const WebsiteReport = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(100);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [reset, setReset] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deposit, setdeposit] = useState(null);
  const [withdraw, setwithdraw] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const redirectType = localStorage.getItem("status");
  const [currencyConversionFilter, setCurrencyConversionFilter] = useState(false);

  const fetchData = async (page, pageSize, fetchAllData = false) => {
    const getStatus = localStorage.getItem("status");
    const localReceiverType = localStorage.getItem("receiverType");

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
      search: searchData || null,
      websiteFilter: selectedWebsiteId === "all" ? "" : selectedWebsiteId,
      dateFilter: {
        start: moment(startDate1 || startDate).tz(localStorage.getItem("timezone"), true),
        end: moment(endDate2 || endDate).tz(localStorage.getItem("timezone"), true),
      },
      currencyConversionFilter
    };

    setLoadingData(true);
    try {
      if (fetchAllData) {
        const allDataResponse = await WebsiteService.getWebsiteReport(params);
        const allData = allDataResponse?.data?.vendor_data || [];
        setLoadingData(false);
        return allData;
      } else {
        const response = await WebsiteService.getWebsiteReport(params);
        const totalItems = response?.data?.totalData[0]?.count || 0;
        setTotalItem(totalItems);
        if (
          localStorage.getItem("status") === "Deposit Count" ||
          localStorage.getItem("status") === "Deposit Amount"
        ) {
          let sortDataDeposit = response.data?.vendor_data?.sort((a, b) => {
            const aAmount = a.transactions?.totalDepositAmount || 0;
            const bAmount = b.transactions?.totalDepositAmount || 0;
            return bAmount - aAmount;
          });
          setData(sortDataDeposit);
        } else if (
          localStorage.getItem("status") === "Withdraw Count" ||
          localStorage.getItem("status") === "Withdraw Amount"
        ) {
          let sortDataWithdraw = response.data?.vendor_data?.sort((a, b) => {
            const aAmount = a.transactions?.totalWithdrawAmount || 0;
            const bAmount = b.transactions?.totalWithdrawAmount || 0;
            return bAmount - aAmount;
          });
          setData(sortDataWithdraw);
        } else if (localStorage.getItem("status") === "DMW Amount") {
          let sortDataDMW = response.data?.vendor_data?.sort((a, b) => {
            const aAmount = a.transactions?.dmwAmount || 0;
            const bAmount = b.transactions?.dmwAmount || 0;
            // If both values are negative or both positive, sort based on absolute value
            // Check if both values are negative
            if (aAmount < 0 && bAmount < 0) {
              return bAmount - aAmount; // Sort negative values from highest to lowest
            } else if (aAmount >= 0 && bAmount >= 0) {
              return bAmount - aAmount; // Sort positive values from highest to lowest
            } else {
              // One value is negative and the other is positive, prioritize negative value
              return aAmount < 0 ? -1 : 1;
            }
          });
          setData(sortDataDMW);
        } else {
          setData(response?.data?.vendor_data);
        }
        setdeposit(response?.data?.totalDepositSuccessAmount);
        setwithdraw(response?.data?.totalWithdrawSuccessAmount);
        setLoadingData(false);
      }
    } catch (error) {
      setLoadingData(false);
      message?.error(error?.message);
    }
  };

  const fetchWebsiteList = async () => {
    await WebsiteService.getAllWebsite({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER, //20,
      //agentIdFilter: selectedAgentId ? selectedAgentId : null,
    })
      .then((response) => {
        //let newResponseData = [];
        setWebsiteList(response.data?.website_data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  useEffect(() => {
    fetchWebsiteList();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh, currencyConversionFilter]);

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
  }, [page, searchData, currencyConversionFilter]);

  useEffect(() => {
    setPage(1);
    setPageSize(100);
    const selections = combineSelections();
    setSelectedIds(selections);
  }, [selectedWebsiteId, currencyConversionFilter]);

  const handleWebsiteSelect = (websiteId) => {
    setSelectedWebsiteId(websiteId);
  };

  const handleRefresh = async () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("receiverType");
    setPage(1);
    setPageSize(100);
    setData([]);
    setSearchData(null);
    setRefresh(true);
  };

  const handleReset = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setStartDate(null);
    setEndDate(null);
    setSelectedWebsiteId(null);
    setSearchData(null);
    setData([]);
    setReset(true);
    setRefresh(true);
  };

  const onUserSelect = (selectType, selectedName, selectedId) => {
    localStorage.removeItem("status");
    setSelectedValue(null);
    setPage(1);
    setPageSize(100);
    if (selectType === "reset") {
      handleReset();
    }
    setData([]);
  };

  const handleSearchEvent = (event) => {
    const selections = combineSelections();
    setSelectedIds(selections);
    setSearchClick(true);
    fetchData(page, pageSize);
    setData([]);
  };

  const combineSelections = () => {
    const selections = [];
    if (selectedWebsiteId) selections.push(selectedWebsiteId);
    return selections;
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(100);
    setSearchData(data);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
          generateWebsiteReportData(allData, "websiteReport"),
          "Website Report",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generateWebsiteReportData(allData, "websiteReport"),
          "Website Report",
        );
      }
    } catch (err) {
      setLoadingData(false);
      message.error("Failed to download data. Please try again.");
    }
  };

  const reportDateFilter = (startDate, endDate) => {
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setPage(1);
    setPageSize(100);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    if (searchClick) {
      setSearchClick(false);
    }
    if (selectedIds.length > 0) {
      fetchData(page, pageSize);
    }
  }, [searchClick]);

  const tableColumns = websiteReportColumn(page, pageSize, redirectType);

  const tableData = {
    refresh,
    websiteList,
    title: title,
    columns: tableColumns,
    totalResults: totalItem,
    search: true,
    download: true,
    startDate,
    endDate,
    selectedValue,
    showMore,
    onSearchData,
    handleRefresh,
    handleReset,
    selectedFormat,
    userWebsiteReport: true,
    websiteFilter: true,
    reportDateFilter,
    handleSearchEvent,
    handleWebsiteSelect,
    onUserSelect,
    deposit,
    withdraw,
    currencyConversionFilter: currencyConversionFilter,
    currencyConversionFilterToggle: true,
    handleCurrencyConversionSwitchChange : (e) => setCurrencyConversionFilter(e)
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
            pageSize: 100,
            total: totalItem,
            onChange: handlePageChange,
          }}
          refresh={setRefresh}
        />
      </Auxiliary>
    </>
  );
};

export default WebsiteReport;
