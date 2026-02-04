import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { vendorColumns } from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import VendorService from "../../../service/VendorService";
import { onDateFormate } from "../../../util/DateFormate";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";

const title = "Vendor";

const Vendor = () => {
  const { user } = useSelector(({ auth }) => auth);
  console.log("Vendor page - user data:", user);
  console.log("Vendor page - tabmasterData:", user?.tabmasterData);
  
  // Find the current tab permission based on the current path
  const currentTab = user?.tabmasterData?.find(item => 
    item.isActive && (
      item.tabUrl === history.location.pathname.slice(1) ||
      item.tabUrl === history.location.pathname.replace('/', '') ||
      item.tabUrl === 'vendor' // fallback for vendor page
    )
  );
  console.log("Vendor page - currentTab:", currentTab);
  
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visible_confirm_model, setVisible_confirm_model] = useState(false);
  const [visiblemodel, setVisiblemodel] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [pageLimit, setPageLimit] = useState(0);
  const [actionData, setActionData] = useState({
    message: "",
    action: "",
  });
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const history = useHistory();
  const tabPermission = user?.tabPermission && user?.tabPermission?.length > 0 && user?.tabPermission?.find(item => "/"+item.tabId.tabUrl === history.location.pathname);
  const [refresh, setRefresh] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState([]);
  const [activeStatus, setActiveStatus] = useState(true);

  // change date formate  - bhadresh
  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await VendorService.getAllVendor({
      page,
      limit: pageSize, //20
      search: searchData ? searchData : null,
      activeFilter: activeStatus,
    })
      .then((response) => {
        console.log("response", response.data);
        let totalItem = response?.data?.totalData[0]
          ? response?.data?.totalData[0]?.count
          : 0;
        setTotalItem(totalItem);
        // let newData = data.concat(response.data.vendor_data);
        setData(response.data?.vendor_data);
        setPageLimit(response.data.state.page_limit);
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
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const hadleSwitchChange = () => {
    setActiveStatus(!activeStatus);
  };

  const showConfirm = (id, type) => {
    let selectedData = data.filter((item) => item._id === id);
    if (type === "delete") {
      setVisiblemodel(true);
      setVisible_confirm_model(true);
      setActionData({
        message:
          'Are you sure you want to Delete "' + selectedData?.[0].name + '"?',
        action: (e) => handleDelete([id], selectedData[0]),
      });
    } else if (type === "edit") {
      history.push({
        pathname: "vendor/editvendor",
        state: {
          editData: selectedData[0],
          id: [id],
        },
      });
    } else if (type === "bank") {
      history.push({
        pathname: "bank",
        state: {
          editData: selectedData[0],
          id: [id],
          name: selectedData[0].name,
          type: "vendor",
        },
      });
    } else if (type === "operator") {
      history.push({
        pathname: "operator",
        state: {
          editData: selectedData[0],
          id: [id],
          name: selectedData[0].name,
          type: "vendor",
        },
      });
    }
  };

  const handleDelete = async (key, row) => {
    setLoadingData(true);
    await VendorService.deleteVendor(key[0])
      .then((result) => {
        setLoadingData(false);
        let datas = data.filter((item, i) => item._id !== key[0]);
        setData(datas);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const visibleModel = () => {
    setVisiblemodel(!visiblemodel);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const onStatusChange = async (datas) => {
    setLoadingData(true);
    await VendorService.editVendor(datas)
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          setLoadingData(false);
          fetchData(page, pageSize);
        } else {
          setLoadingData(false);
        }
      })
      .catch((err) => {
        setLoadingData(false);
      });
  };

  const handleTogglePassword = (userId) => {
    setRevealedPasswords((prevRevealedPasswords) => {
      if (prevRevealedPasswords.includes(userId)) {
        return prevRevealedPasswords.filter((id) => id !== userId);
      } else {
        return [...prevRevealedPasswords, userId];
      }
    });
  };

  const isPasswordRevealed = (userId) => revealedPasswords.includes(userId);

  const handleCopyToClipboard = (text) => {
    message.success(`Password copied to clipboard: ${text}`);
  };

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
  }, [page, pageSize, searchData, activeStatus]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  const tableColumns = vendorColumns(
    page,
    pageSize,
    data,
    showConfirm,
    onStatusChange,
    handleTogglePassword,
    isPasswordRevealed,
    handleCopyToClipboard,
    currentTab?.edit || true, // fallback for debugging
    currentTab?.delete || true, // fallback for debugging
  );

  const tableData = {
    refresh,
    title: title,
    columns: tableColumns,
    addNewDataUrl: currentTab?.add && `vendor/addvendor`,
    isActive: true,
    isPaymentToWithWebAcc: activeStatus,
    button: "",
    search: true,
    hadleSwitchChange: hadleSwitchChange,
    totalResults: totalItem,
    onSearchData,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
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
        {visible_confirm_model ? (
          <ConfirmModel
            actionData={actionData}
            visibleModel={visiblemodel}
            visible={visibleModel}
          />
        ) : null}
      </Auxiliary>
    </>
  );
};

export default Vendor;
