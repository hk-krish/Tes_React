import { message } from "antd";
import React, { useEffect, useState } from "react";
import Auxiliary from "util/Auxiliary";
import { historyColumns } from "../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../components/defaultTable/Table";
import HistoryModal from "../../../components/HistoryModal";
import AgentService from "../../../service/AgentService";
import HistoryService from "../../../service/HistoryService";
import VendorService from "../../../service/VendorService";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateHistoryData } from "../../../util/DownloadFormattedData";

const title = "History";

const History = () => {
  const [data, setData] = useState([]);
  const [visibleModel, setVisibleModel] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [pageLimit, setPageLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [searchClick, setSearchClick] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [entityList, setEntityList] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [status, setStatus] = useState("");

  const fetchData = async (page, pageSize, fetchAllData = false) => {
    setLoadingData(true);
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

    let params = {
      page,
      limit: pageSize, //20
      search: searchData ? searchData : "", //20
      entityFilter: selectedEntity ? selectedEntity : "",
      moduleFilter: selectedModule ? selectedModule : "",
      statusFilter: status === "all" ? "" : status,
      dateFilter: {
        start: startDate1 || startDate,
        end: endDate2 || endDate,
      },
    };
    if (fetchAllData) {
      const allDataResponse = await HistoryService.getHistory(params);
      const allData = allDataResponse?.data?.history_data || [];
      setLoadingData(false);
      return allData;
    } else {
      await HistoryService.getHistory(params)
        .then((response) => {
          console.log("response", response.data);
          let totalItem = response?.data?.totalData
            ? response?.data?.totalData
            : 0;
          setTotalItem(totalItem);
          setData(response.data?.history_data);
          setPageLimit(response.data.state.page_limit);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    }
  };

  const fetchEntityUserList = async (entity) => {
    if (entity === "All") {
      setEntityList([]);
    } else if (entity === "Agent") {
      await AgentService.getAllAgent({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER, //20
      })
        .then((response) => {
          setEntityList(response?.data?.agent_data);
        })
        .catch((err) => {
          console.log(err);
          message.error(err.message);
        });
    } else if (entity === "Vendor") {
      await VendorService.getAllVendor({
        page: 1,
        limit: Number.MAX_SAFE_INTEGER, //20
      })
        .then((response) => {
          setEntityList(response?.data?.vendor_data);
        })
        .catch((err) => {
          console.log(err);
          message.error(err.message);
        });
    }
  };

  const handleRefresh = async () => {
    setPage(1);
    setPageLimit(10);
    setSearchData(null);
    setRefresh(true);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const onHistoryModalOpen = async (record) => {
    setHistoryData(record);
    setVisibleModel(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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

  const handleReset = () => {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    setStartDate(null);
    setEndDate(null);
    setSelectedEntity(null);
    setSelectedModule(null);
    setSearchData(null);
    setStatus("")
    setData([]);
    setRefresh(true);
  };

  const onUserSelect = (selectType, selectedName, id) => {
    setPage(1);
    setPageSize(10);
    if (selectType === "userList") {
      setSelectedUser(selectedName);
    } else if (selectType === "historyModuleFilter") {
      setSelectedModule(selectedName.toLowerCase());
    } else if (selectType === "selectedEntityList") {
      setSelectedEntity(id);
    }else if (selectType === "historyStatus") {
      setStatus(selectedName.toLowerCase());
    } else if (selectType === "reset") {
      handleReset();
      setData([]);
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
          generateHistoryData(allData, "historyReport"),
          "History Report",
        );
      } else if (format === "Excel") {
        downloadExcel(
          generateHistoryData(allData, "historyReport"),
          "History Report",
        );
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
      message.error("Failed to download data. Please try again.");
    }
  };

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
  }, [page, pageSize, searchData]);

  useEffect(() => {
    if (selectedUser) {
      fetchEntityUserList(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (searchClick) {
      fetchData(page, pageSize);
      setSearchClick(false);
    }
  }, [searchClick]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  const tableColumns = historyColumns(
    page,
    pageSize,
    visibleModel,
    historyData,
    onHistoryModalOpen,
  );

  const tableData = {
    refresh,
    startDate,
    endDate,
    selectedValue,
    entityList,
    title: title,
    columns: tableColumns,
    search: true,
    totalResults: totalItem,
    historyFilter: true,
    userWebsiteReport: true,
    download: true,
    selectedFormat,
    handleSearchEvent,
    onSearchData,
    onUserSelect,
    reportDateFilter,
    handleReset,
    handleRefresh,
    showMore,
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
        />
        {visibleModel && (
          <HistoryModal
            modalName="History Data"
            visible={visibleModel}
            historyData={historyData}
            onClose={() => {
              setVisibleModel(false);
              setHistoryData(null);
            }}
          />
        )}
      </Auxiliary>
    </>
  );
};

export default History;
