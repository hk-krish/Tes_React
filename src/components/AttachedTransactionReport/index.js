import { Modal } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import BankDetailsModal from "../BankDetailsModal";
import { attachedTransactionReportColumn } from "../ColumnComponents/columnComponents";
import DefaultTable from "../defaultTable/Table";

const AttachedTransactionReport = ({
  selectedUserId,
  onClose,
  visibleModal,
  userName,
  userId,
  totalResults,
  withdrawReport,
  userReport,
}) => {
  let title = "Attached Transaction Report";
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visibleAccountDetails, setVisibleAccountDetails] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openAccount, setOpenAccount] = useState();
  const [searchData, setSearchData] = useState({
    searchText: null,
    filterData: null,
  });


  const handleOpen = (data) => {
    setOpenAccount(data?._id);
  };

  const handleRefresh = async () => {
    setData([]);
    setRefresh(true);
  };

  const handleAccountDetailsClick = useCallback((record) => {
    setAccountData(record);
    setVisibleAccountDetails(true);
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onSearchString = (event) => {
    if (event.target.value === "") {
      setSearchData({ searchText: null, filterData: null });
      return;
    }
    const value = event.target.value?.toLowerCase();
    let trimValue = value.trim();
    const newData = filteredData(data, trimValue);
    setSearchData({ ...searchData, searchText: event.target.value });
    setSearchData({ ...searchData, filterData: newData });
  };
  const filteredData = (data, value, filterArray = []) => {
    const myFilteredNewData = data.filter((a) => {
      Object.entries(a).map(([k, v]) => {
        if (typeof a[k] == "object" && k && v) {
          Object.entries(a[k]).map(([ck, cv]) => {
            if (!a[ck] && v && k && cv) {
              a[k + "-" + ck] = cv;
            }
          });
        }
      });
      return a;
    });
    return myFilteredNewData.filter((elem) => {
      return Object.keys(elem).some((key) => {
        const isAvailable =
          filterArray.length > 0 ? key.includes(filterArray) : true;
        const mydata =
          isAvailable && elem[key] != null
            ? elem[key]?.toString().toLowerCase().includes(value)
            : "";
        return mydata;
      });
    });
  };

  useEffect(() => {
    setData(selectedUserId?.attachedTransactions);
  }, [selectedUserId]);

  useEffect(() => {
    if (refresh) {
      setLoadingData(true);
      setData(selectedUserId?.attachedTransactions);
      setRefresh(false);
      setLoadingData(false);
    }
  }, [refresh]);

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

  const tableColumns = attachedTransactionReportColumn(
    page,
    pageSize,
    withdrawReport,
    userReport,
    calculatedTimeDifference,
    handleAccountDetailsClick,
    setVisibleAccountDetails,
    setAccountData,
    handleOpen,
    openAccount,
  );

  const tableData = {
    refresh,
    totalResults: searchData?.filterData
      ? searchData?.filterData?.length
      : data?.length,
    title: title,
    columns: tableColumns,
    search: true,
    handleRefresh,
    onSearchString,
    commonSearch: true,
    yScroll: "300px",
    xScroll: "300px",
  };

  return (
    <>
      <Modal
        title={
          userName && userId ? (
            <div>
              {userName} [{userId}]
            </div>
          ) : null
        }
        closable={true}
        onCancel={() => {
          onClose();
        }}
        visible={visibleModal}
        destroyOnClose={true}
        footer={null}
        width={"90%"}
        centered={true}
        zIndex={999}
      >
        <div style={{ overflowX: "auto", overflowY: "auto" }}>
          <DefaultTable
            dataSource={searchData.filterData || data}
            data={tableData}
            loadingData={loadingData}
            // pagination={true}
            paginationData={{
              current: page,
              pageSize: pageSize,
              // total: totalItem,
              onChange: handlePageChange,
            }}
          />
        </div>
      </Modal>
      <BankDetailsModal
        visible={visibleAccountDetails}
        onClose={() => {
          setVisibleAccountDetails(false);
        }}
        modalName="Account Details"
        data={accountData}
        from="attachedTransactionReport"
      />
    </>
  );
};

export default AttachedTransactionReport;
