import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import {
  CoinNetworkColumns
} from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import CryptoService from "../../../service/CryptoService";
import { useDispatch, useSelector } from "react-redux";
import {
  setNetworkTransactionType,
} from "../../../appRedux/actions/CryptoNetwork";
import AddNetworkCoinModal from "./AddCoinNetworkModal";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";

const CoinsNetworksTable = (props) => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isNetworkModalVisible, setIsNetworkModalVisible] = useState(false);
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
  const [refresh, setRefresh] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState([]);
  const [activeStatus, setActiveStatus] = useState(true);
  const [selectedNetworkDetails, setSelectedNetworkDetails] = useState(null);
  const dispatch = useDispatch();
  const coinDetails = useSelector((state) => state.cryptoNetworkDetails);
  const title = `Coins Network Details (${coinDetails?.coinName ? coinDetails?.coinName : ""})`;

  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await CryptoService.getAllCoinNetworks({
      coinId: coinDetails.coinId,
      page,
      limit: pageSize,
      search: searchData,
      activeFilter: activeStatus,
    })
      .then((response) => {
      let totalItem = response?.data?.totalData[0]
          ? response?.data?.totalData[0]?.count
          : 0;
        setTotalItem(totalItem);
        setData(response?.data?.network_data);
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
    if (type === "edit") {
      entityGatewayModal();
      setSelectedNetworkDetails(selectedData[0]);
      dispatch(setNetworkTransactionType("edit"));
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
    await CryptoService.editCoinNetwork(datas)
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

  const isPasswordRevealed = (userId) => revealedPasswords.includes(userId);

  const handleCopyToClipboard = (text) => {
    message.success(`Password copied to clipboard: ${text}`);
  };

  const entityGatewayModal = () => {
    dispatch(setNetworkTransactionType("add"));
    setIsNetworkModalVisible(true);
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

  const tableColumns = CoinNetworkColumns(
    page,
    pageSize,
    data,
    showConfirm,
    onStatusChange,
    isPasswordRevealed,
    handleCopyToClipboard,
    hadleSwitchChange,
  );

  const tableData = {
    refresh,
    title: title,
    columns: tableColumns,
    isActive: true,
    statusFilter: activeStatus,
    button: "",
    search: true,
    hadleSwitchChange: hadleSwitchChange,
    isPaymentToWithWebAcc: activeStatus,
    totalResults: totalItem,
    onSearchData,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
    showMore,
    entityAddButton: true,
    entityGatewayModal,
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
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
        />
        <AddNetworkCoinModal
          visible={isNetworkModalVisible}
          networkDetails={selectedNetworkDetails}
          onClose={() => {
            setIsNetworkModalVisible(false);
            setRefresh(true);
            setSelectedNetworkDetails(null);
          }}
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

export default withRouter(CoinsNetworksTable);
