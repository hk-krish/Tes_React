import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import CommossionService from "../../service/CommissionService";
import { downloadCSV, downloadExcel } from "../../util/CSVandExcelDownload";
import { dailyCommissionColumns } from "../ColumnComponents/columnComponents";
import ImagePreviewModal from "../ImagePreviewModal";
import DefaultTable from "../defaultTable/Table";
import { onDateFormate } from "../../util/DateFormate";
import moment from "moment-timezone";

const CommissionTransactionReport = ({
  visible,
  commissionRecord,
  onClose,
  currencyConversionFilter,
}) => {
  let title = "Commission Transaction Report";
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItem, setTotalItem] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [transactionTypeFilter, setTransactionTypeFilter] = useState("");

  const fetchData = async (
    page,
    pageSize,
    commissionRecord,
    fetchAllData = false,
  ) => {
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

    setSelectedValue("default");
    setStartDate(startDate1);
    setEndDate(endDate2);

    setLoadingData(true);
    let params = {
      page,
      limit: pageSize,
      fromId: commissionRecord?.fromId,
      toId: commissionRecord?.toId,
      search: searchData || null,
      statusFilter: statusFilter === "all" ? "" : statusFilter,
      transactionTypeFilter:
        transactionTypeFilter === "all" ? "" : transactionTypeFilter,
      dateFilter: {
        start: moment(startDate1 || startDate).tz(localStorage.getItem("timezone"), true),
        end: moment(endDate2 || endDate).tz(localStorage.getItem("timezone"), true),
      },
      currencyConversionFilter
    };
    try {
      if (fetchAllData) {
        const allDataResponse =
          await CommossionService.getDailyCommissionReport(params);
        const allData = allDataResponse?.data?.daily_commission_data || [];
        setLoadingData(false);
        return allData;
      } else {
        await CommossionService.getDailyCommissionReport(params)
          .then((response) => {
            console.log("response", response.data);
            let totalItems = response?.data?.totalData
              ? response?.data?.totalData
              : 0;
            setTotalItem(totalItems);
            setData(response?.data?.daily_commission_data);
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

  const commissionDateFilter = (startDate, endDate) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const handleChangeFilter = (type, name, id) => {
    if (type === "commissionStatusFilter") {
      setStatusFilter(name.toLowerCase());
    } else if (type === "commissionTransactionTypeFilter") {
      setTransactionTypeFilter(name.toLowerCase());
    } else if (type === "handleReset") {
      handleReset();
    }
  };

  const handleReset = () => {
    setPage(1);
    setPageSize(10);
    setStatusFilter(null);
    setStartDate(null);
    setEndDate(null);
    setTransactionTypeFilter(null);
    setData([]);
    setRefresh(true);
  };

  const handleRefresh = async () => {
    setPage(1);
    setPageSize(10);
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const generateFormattedData = (data) => {
    return data.map((item, index) => {
      let receiverName =
        item.from === "PG"
          ? item?.transactionType === "settlement"
            ? "TES"
            : item?.website?.name
          : item?.payment_gateway
            ? item?.payment_gateway?.name
            : item?.toId === "admin"
              ? "TES"
              : item?.fromId === "admin"
                ? item?.toId?.name
                : "-";

      const formattedData = {
        "Sr No": index + 1,
        "Created At":
          onDateFormate(item?.createdAt, "DD-MM-YYYY hh:mm A") || "-",
        Status: item.status || "-",
        "Transaction Type": item.transactionType || "-",
        "Sender name": item.from === "TES" ? "TES" : item.fromData?.name || "-",
        "Receiver Name": receiverName,
        "Deposit Amount": item.depositAmount || "00",
        "Deposit Commission Amount": item.depositCommissionAmount || "00",
        "Withdraw Amount": item.withdrawAmount || "00",
        "Withdraw Commission Amount": item.withdrawCommissionAmount || "00",
        DMW: item.dmw || "00",
        "Total Commission": item.totalCommission || "00",
        Amount: item.toAmount || "00",
        Image: item.paymentSS || "-",
        Remarks: item.remark || "-",
      };
      return formattedData;
    });
  };

  const selectedFormat = async (format) => {
    try {
      let allData;
      if (format === "CSV" || format === "Excel") {
        setLoadingData(true);
        allData = await fetchData(
          page,
          Number.MAX_SAFE_INTEGER,
          commissionRecord,
          true,
        );
        setLoadingData(false);
      }

      if (format === "CSV") {
        downloadCSV(
          generateFormattedData(allData),
          "Commission Transaction Report",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generateFormattedData(allData),
          "Commission Transaction Report",
        );
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
      message.error("Failed to download data. Please try again.");
    }
  };

  const handleSearch = () => {
    setPage(1);
    setPageSize(10);
    setSearchClick(true);
    setData([]);
  };

  useEffect(() => {
    if (visible) {
      fetchData(page, pageSize, commissionRecord);
    }
  }, [visible, page, pageSize, searchData]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize, commissionRecord);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (searchClick) {
      fetchData(page, pageSize, commissionRecord);
      setSearchClick(false);
    }
  }, [searchClick]);

  const tableColumns = dailyCommissionColumns(
    page,
    pageSize,
    setImageModalVisible,
    setImageUrl,
  );
  const tableData = {
    title: title,
    columns: tableColumns,
    refresh,
    startDate,
    endDate,
    selectedValue,
    totalResults: totalItem,
    search: true,
    showSenderAndReceiverName: commissionRecord,
    removeRowPadding: true,
    transactionType: true,
    download: true,
    advanceFilterVisible: true,
    extraFilterShow: true,
    actionAndTransactionFilterShow: true,
    commissionTransactionReportTable: true,
    handleChangeFilter,
    showMore,
    handleReset,
    handleSearch,
    onSearchData,
    handleRefresh,
    selectedFormat,
    commissionDateFilter,
  };

  return (
    <>
      <Modal
        closable={true}
        onCancel={() => {
          onClose();
          setPage(1);
          setPageSize(10);
        }}
        visible={visible}
        destroyOnClose={true}
        footer={null}
        width={"90%"}
        centered={true}
        zIndex={999}
      >
        <DefaultTable
          dataSource={data}
          data={tableData}
          loadingData={loadingData}
          // pagination={true}
          paginationData={{
            current: page,
            pageSize: pageSize,
            total: totalItem,
            onChange: handlePageChange,
          }}
        />
        <ImagePreviewModal
          visible={imageModalVisible}
          onClose={() => {
            setImageModalVisible(false);
          }}
          data={imageUrl}
        />
      </Modal>
    </>
  );
};

export default CommissionTransactionReport;
