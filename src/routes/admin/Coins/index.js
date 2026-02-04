import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import {
  CoinsDetailsColumns,
  vendorColumns,
} from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import VendorService from "../../../service/VendorService";
import { onDateFormate } from "../../../util/DateFormate";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CryptoService from "../../../service/CryptoService";
import { useDispatch, useSelector } from "react-redux";
import { addCoinData } from "../../../appRedux/actions/CryptoNetwork";
const title = "Coins Details";

const CoinsTable = () => {
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
  const { user } = useSelector(({ auth }) => auth);
  const tabPermission = user?.tabPermission && user?.tabPermission?.length > 0 && user?.tabPermission?.find(item => "/"+item.tabId.tabUrl === history.location.pathname);
  const [refresh, setRefresh] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState([]);
  const [activeStatus, setActiveStatus] = useState(true);
  const dispatch = useDispatch();
  // change date formate  - bhadresh
  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await CryptoService.getAllCoins({
      page,
      limit: pageSize, //20
      search: searchData ? searchData : null,
      activeFilter: activeStatus,
    })
      .then((response) => {
        let totalItem = response?.data?.totalData[0]
          ? response?.data?.totalData[0]?.count
          : 0;
        setTotalItem(totalItem);
        // let newData = data.concat(response.data.vendor_data);
        setData(response?.data?.coin_data);
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
        pathname: "coins/edit-coin-details",
        state: {
          editData: selectedData[0],
          id: [id],
        },
      });
    } else if (type === "networks") {
      dispatch(addCoinData({ coinName: selectedData[0].name, coinId: id }));
      history.push({
        pathname: "coins/networks",
        state: {
          editData: selectedData[0],
          id: [id],
          name: selectedData[0].name,
        },
      });
    }
  };

  const handleDelete = async (key, row) => {
    setLoadingData(true);
    await CryptoService.deleteVendorById(key[0])
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
    await CryptoService.editCoin(datas)
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

  const tableColumns = CoinsDetailsColumns(
    page,
    pageSize,
    data,
    showConfirm,
    onStatusChange,
    handleTogglePassword,
    isPasswordRevealed,
    handleCopyToClipboard,
    hadleSwitchChange,
    tabPermission && tabPermission?.edit,
  );

  const tableData = {
    refresh,
    title: title,
    columns: tableColumns,
    addNewDataUrl: tabPermission && tabPermission?.add && `coins/add-coin-details`,
    isActive: true,
    activeFilter: activeStatus,
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

export default CoinsTable;
