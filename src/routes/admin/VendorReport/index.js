import { message } from "antd";
import React, { useEffect, useState } from "react";
import Auxiliary from "util/Auxiliary";
import { vendorReportColumns } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import VendorService from "../../../service/VendorService";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import moment from "moment-timezone";

const title = "Vendor Report";

const VendorReport = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(100);
  const [searchData, setSearchData] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState([]);

  const fetchVendorData = async (page, pageSize, fetchAllData = false) => {
    setLoadingData(true);
    let params = {
      page,
      limit: pageSize, //20
      search: searchData ? searchData : null,
      ...(startDate && endDate
        ? { dateFilter: { start: moment(startDate).tz(localStorage.getItem("timezone"), true), end: moment(endDate).tz(localStorage.getItem("timezone"), true) } }
        : {}),
    };
    try {
      if (fetchAllData) {
        const allDataResponse = await VendorService.getVendorReport(params);
        const allData = allDataResponse?.data?.vendor_data || [];
        setLoadingData(false);
        return allData;
      } else {
        await VendorService.getVendorReport(params)
          .then((response) => {
            console.log("response", response.data);
            let totalItems = response?.data?.totalData[0]
              ? response?.data?.totalData[0]?.count
              : 0;
            setTotalItem(totalItems);
            let sortingData = response.data?.vendor_data?.sort((a, b) => {
              return a?.name.localeCompare(b?.name);
            });
            setData(sortingData);
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

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const handleRefresh = async () => {
    setStartDate(null);
    setEndDate(null);
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const dateFilter = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
    setData([]);
    setRefresh(true);
  };

  useEffect(() => {
    fetchVendorData(page, pageSize);
  }, [page, pageSize, searchData]);

  useEffect(() => {
    if (refresh) {
      fetchVendorData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  const generateFormattedData = (data) => {
    return data.map((item, index) => ({
      "Sr No": index + 1,
      Name: item.name || "-",
      "Total Diposit": item.transactions?.totalDepositAmount || 0,
      "Total Withdraw": item.transactions?.totalWithdrawAmount || 0,
    }));
  };

  const selectedFormat = async (format) => {
    try {
      let allData;
      if (format === "CSV" || format === "Excel") {
        setLoadingData(true);
        allData = await fetchVendorData(page, Number.MAX_SAFE_INTEGER, true);
        setLoadingData(false);
      }

      if (format === "CSV") {
        downloadCSV(generateFormattedData(allData), "Vendor Report");
      } else if (format === "Excel") {
        downloadExcel(generateFormattedData(allData), "Vendor Report");
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
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

  const tableColumns = vendorReportColumns(page, pageSize);

  const tableData = {
    title: title,
    columns: tableColumns,
    button: "",
    search: true,
    refresh,
    onSearchData,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
    dateFilter,
    totalResults: totalItem,
    selectedFormat,
    download: [
      { name: "CSV", value: "csv" },
      { name: "Excel", value: "excel" },
    ],
    showMore,
  };

  return (
    <>
      <Auxiliary>
        <DefaultTable
          // menu={menu}
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

export default VendorReport;
