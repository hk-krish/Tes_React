import { message } from "antd";
import React, { useEffect, useState } from "react";
import Auxiliary from "util/Auxiliary";
import DefaultTable from "../../../components/defaultTable/Table";
import PaymentGetway from "../../../service/PaymentService";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generatePGReportData, generateWebsiteReportData } from "../../../util/DownloadFormattedData";
import { pgReportColumn } from "../../../components/ColumnComponents/columnComponents";
import moment from "moment-timezone";

const title = "Payment Gatway Reports";

const PaymentGatewayReport = () => {
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
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
      limit: pageSize,
      search: searchData || null,
      dateFilter: {
        start: moment(startDate1 || startDate).tz(localStorage.getItem("timezone"), true),
        end: moment(endDate2 || endDate).tz(localStorage.getItem("timezone"), true),
      },
      paymentGatewayFilter: paymentFilter === "all" ? "" : paymentFilter,
      websiteFilter: selectedWebsiteId === "all" ? "" : selectedWebsiteId,
      currencyConversionFilter
    };
    setLoadingData(true);
    try {
      if (fetchAllData) {
        const allDataResponse =
          await PaymentGetway.getAllPaymentGatewayReport(params);
        const allData = allDataResponse?.data?.payment_gateway_data || [];
        setLoadingData(false);
        return allData;
      } else {
        const response = await PaymentGetway.getAllPaymentGatewayReport(params);
        console.log("response---->>>", response);
        const totalItems = response?.data?.totalData[0]?.count || 0;
        setTotalItem(totalItems);
        setData(response?.data?.payment_gateway_data);
        setLoadingData(false);
      }
    } catch (error) {
      setLoadingData(false);
      message?.error(error?.message);
    }
  };

  const handleWebsiteSelect = (websiteId) => {
    setSelectedWebsiteId(websiteId);
  };

  const handleRefresh = async () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("receiverType");
    setPage(1);
    setPageSize(10);
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

  const onUserSelect = (selectType, selectedName) => {
    setPage(1);
    setPageSize(10);
    if (selectType === "paymentGateway") {
      setPaymentFilter(selectedName);
    } else if (selectType === "reset") {
      handleReset();
    }
    setData([]);
  };

  const handleSearchEvent = () => {
    setSearchClick(true);
    setData([]);
  };

  const showMore = async (curreqnt, size) => {
    setPageSize(size);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
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
        allData = await fetchData(1, Number.MAX_SAFE_INTEGER, true);
        setLoadingData(false);
      }

      if (format === "CSV") {
        downloadCSV(
          generatePGReportData(allData, "PGReport"),
          "Payment Gateway Report",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generatePGReportData(allData, "PGReport"),
          "Payment Gateway Report",
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
    setPageSize(10);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh, currencyConversionFilter]);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [searchData, currencyConversionFilter]);

  useEffect(() => {
    if (searchClick) {
      fetchData(page, pageSize);
      setSearchClick(false);
    }
  }, [searchClick, currencyConversionFilter]);

  const tableColumns = pgReportColumn(page, pageSize);

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
    userWebsiteReport: true,
    // paymentData,
    showMore,
    onSearchData,
    handleRefresh,
    handleReset,
    selectedFormat,
    reportDateFilter,
    handleSearchEvent,
    handleWebsiteSelect,
    onUserSelect,
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

export default PaymentGatewayReport;
