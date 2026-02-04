import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Auxiliary from "util/Auxiliary";
import notify from "../../../Notification";
import { commissionColumns } from "../../../components/ColumnComponents/columnComponents";
import CommissionModal from "../../../components/CommissionModal";
import CommissionTransactionReport from "../../../components/CommissionTransactionReport";
import ImagePreviewModal from "../../../components/ImagePreviewModal";
import DefaultTable from "../../../components/defaultTable/Table";
import CommossionService from "../../../service/CommissionService";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { handleSocketEvent3 } from "../../../util/Socket/socketEventHandler";

const title = "Commission Summary";

const CommissionReport = () => {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [visibleCommissionModal, setVisibleCommissionModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [conformLoading, setConformLoading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchClick, setSearchClick] = useState(false);
  const [status, setStatus] = useState(null);
  const [totalFromAmount, setTotalFromAmount] = useState(null);
  const [totalSenderAmount, setTotalSenderAmount] = useState(null);
  const [commissionAttachedReportVisible, setCommissionAttachedReportVisible] =
    useState(false);
  const [commissionAttachedReportData, setCommissionAttachedReportData] =
    useState(null);
  const currentPageRef = useRef(page); // useRef to store the current page
  const [currencyConversionFilter, setCurrencyConversionFilter] = useState(false);

  const handleColor = (status) => {
    if (status === "completed") {
      return "green";
    } else if (status === "pending") {
      return "yellow";
    } else if (status === "decline") {
      return "red";
    } else if (status === "submitted") {
      return "blue";
    }
  };

  const fetchData = async (page, pageSize, fetchAllData = false) => {
    setLoadingData(true);
    let params = {
      page,
      limit: pageSize, //20
      search: searchData || null,
      statusFilter: statusFilter === "all" ? "" : statusFilter,
      currencyConversionFilter
    };
    try {
      if (fetchAllData) {
        const allDataResponse = await CommossionService.getCommission(params);
        const allData = allDataResponse?.data?.logs_request_data || [];
        setLoadingData(false);
        return allData;
      } else {
        await CommossionService.getCommission(params)
          .then((response) => {
            console.log("response", response.data);
            let totalItems = response?.data?.totalData
              ? response?.data?.totalData
              : 0;
            setTotalItem(totalItems);
            setTotalFromAmount(
              response.data?.receiveAmount?.toFixed(2) || "00",
            );
            setTotalSenderAmount(response.data?.sendAmount?.toFixed(2) || "00");
            setData(response?.data?.logs_request_data);
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

  const handleRefresh = async () => {
    setPage(1);
    setPageSize(10);
    setStatusFilter(null);
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const generateFormattedData = (data) => {
    return data.map((item, index) => ({
      "Sr No": index + 1,
      Name:
        item.fromId === "admin"
          ? item.toData?.name
          : item?.from === "PG"
            ? item?.fromData?.name
            : item.fromData?.name || "-",
      Id:
        item?.fromId === "admin"
          ? item?.toId
          : item?.from === "PG"
            ? "-"
            : item.fromId || "-",
      Amount: item?.to === "TES" ? item?.fromAmount : item?.amount || "00",
      "Transaction Report": item.transactionType || "-",
      Action: item.status || "-",
    }));
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
        downloadCSV(generateFormattedData(allData), "Commission Report");
      } else if (format === "Excel") {
        downloadExcel(generateFormattedData(allData), "Commission Report");
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
      message.error("Failed to download data. Please try again.");
    }
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handleChange = (record, status) => {
    setStatus(status);
    setVisibleCommissionModal(true);
    setRecord(record);
  };

  const onUpdateStatus = async (data) => {
    setLoadingData(true);
    try {
      await CommossionService.editAdminCommission(data)
        .then((response) => {
          console.log("response", response.data);
          if (response.status === 404) {
            setConformLoading(false);
            setLoadingData(false);
            return notify.openNotificationWithIcon(
              "error",
              "Error",
              response?.message,
            );
          } else {
            setRefresh(true);
            setConformLoading(false);
            setLoadingData(false);
            setVisibleCommissionModal(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    } catch (error) {
      setLoadingData(false);
      message?.error(error?.message);
    }
  };

  const handleSearch = () => {
    setSearchClick(true);
    setData([]);
  };

  const handleChangeFilter = (type, name) => {
    if (type === "actionFilter") {
      setStatusFilter(name.toLowerCase());
    }
  };

  const handleCommissionTransactionReport = (record) => {
    setCommissionAttachedReportData(record);
    setCommissionAttachedReportVisible(true);
  };

  const updateSocketEvent = (newData) => {
    let data = newData[0];
    const currentPage = currentPageRef.current; // Access the current page from the ref
    if (data) {
      setData((prevData) => {
        const newDataMatches = prevData?.some(
          (item) => item?._id === data?._id,
        );
        if (newDataMatches) {
          // If there is a match, replace the existing data item with the new data
          return prevData?.map((item) =>
            item?._id === data?._id ? data : item,
          );
        } else {
          if (currentPage === 1) {
            // If there is no match, add the new data to the beginning of the array
            return [data, ...prevData];
          } else {
            return prevData;
          }
        }
      });
    }
  };

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
  }, [page, pageSize, searchData, statusFilter, currencyConversionFilter]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (searchClick) {
      fetchData(page, pageSize);
      setSearchClick(false);
    }
  }, [searchClick]);

  useEffect(() => {
    handleSocketEvent3("commissionStatusChange", updateSocketEvent);
  }, []);

  const tableColumns = commissionColumns(
    page,
    pageSize,
    handleChange,
    handleColor,
    handleCommissionTransactionReport,
  );

  const tableData = {
    title: title,
    columns: tableColumns,
    button: "",
    refresh,
    totalFromAmount,
    totalSenderAmount,
    // actionType: true,
    commissionTable: true,
    totalResults: totalItem,
    download: [
      { name: "CSV", value: "csv" },
      { name: "Excel", value: "excel" },
    ],
    showMore,
    handleSearch,
    onSearchData,
    handleRefresh,
    selectedFormat,
    handleChangeFilter,
    currencyConversionFilter: currencyConversionFilter,
    currencyConversionFilterToggle: true,
    handleCurrencyConversionSwitchChange : (e) => setCurrencyConversionFilter(e)
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
        />
        <CommissionModal
          visible={visibleCommissionModal}
          onClose={() => {
            setVisibleCommissionModal(false);
          }}
          status={status}
          openImageModal={() => {
            setImageModalVisible(true);
            setImageUrl(record?.paymentSS);
          }}
          record={record}
          onUpdateStatus={onUpdateStatus}
          setConformLoading={setConformLoading}
          conformLoading={conformLoading}
        />
        <ImagePreviewModal
          visible={imageModalVisible}
          onClose={() => {
            setImageModalVisible(false);
          }}
          data={imageUrl}
        />
        {commissionAttachedReportVisible && (
          <CommissionTransactionReport
            visible={commissionAttachedReportVisible}
            commissionRecord={commissionAttachedReportData}
            onClose={() => {
              setCommissionAttachedReportVisible(false);
              setCommissionAttachedReportData(null);
            }}
            currencyConversionFilter={currencyConversionFilter}
          />
        )}
      </Auxiliary>
    </>
  );
};

export default CommissionReport;
