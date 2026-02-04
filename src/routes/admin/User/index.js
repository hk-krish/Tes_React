import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { userColumns } from "../../../components/ColumnComponents/columnComponents";
import TableModal from "../../../components/TableModel";
import UserBankAccount from "../../../components/UserBankAccountModal";
import DefaultTable from "../../../components/defaultTable/Table";
import UserService from "../../../service/UserService";
const title = "Users";

const UserList = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [seletectedUserId, setSeletectedUserId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedUserWebsite, setSelectedUserWebsite] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [visibleAccountDetails, setVisibleBankAccount] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const [searchData, setSearchData] = useState(null);

  const onUserSelect = (selectType, selectedName, selectedId) => {
    // status ? setStatus(false) : setStatus(true); // just to call the fetchData funtion even if the selectedVendorData is same.
    let selectedData = selectedId === undefined ? "" : selectedId;
    if (selectType === "website") {
      setSelectedUserWebsite(selectedData);
      setRefresh(true);
      // alert(selectedData)
    }
    // setData([]);
  };

  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await UserService.GetAllUserData({
      page,
      limit: pageSize, //20
      websiteFilter: selectedUserWebsite === "All" ? "" : selectedUserWebsite,
      search: searchData ? searchData : "",
    })
      .then((response) => {
        console.log("response", response.data);
        let totalItem = response?.data?.totalData[0]
          ? response?.data?.totalData[0]?.count
          : 0;
        setTotalItem(totalItem);
        setData(response?.data?.user_data);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const fetchBankAccountData = async (id) => {
    setLoadingData(true);
    await UserService.GetAllBankAccountDetails(id)
      .then((response) => {
        console.log("response", response.data);
        setUserAccount(response.data?.response);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const onSelectionChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const handleRefresh = async () => {
    setPage(1);
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };
  const showConfirm = (record, type) => {
    if (type === "transactionReport") {
      setSeletectedUserId(record);
    }
  };

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, searchData]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  const tableColumns = userColumns(
    page,
    pageSize,
    showConfirm,
    fetchBankAccountData,
    setVisibleBankAccount,
  );

  const tableData = {
    title: title,
    columns: tableColumns?.filter((a) => (a ? a : undefined)),
    search: true,
    totalResults: totalItem,
    refresh,
    onSearchData,
    onUserSelect,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
    showMore,
  };

  return (
    <>
      <TableModal
        visibleModal={seletectedUserId ? true : false}
        seletectedUserId={seletectedUserId}
        setSeletectedUserId={setSeletectedUserId}
      />
      <UserBankAccount
        visible={visibleAccountDetails}
        modalName="User Bank Details"
        onClose={() => setVisibleBankAccount(false)}
        data={userAccount}
        loadingData={loadingData}
      />
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

export default withRouter(UserList);
