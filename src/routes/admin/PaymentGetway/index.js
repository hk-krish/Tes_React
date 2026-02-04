import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { paymentGatewayColumn } from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import PaymentGetway from "../../../service/PaymentService";
import { useSelector } from "react-redux";

const PaymentGetwayList = (props) => {
  const title = "Payment Gateway";
  const history = useHistory();
  const { user } = useSelector(({ auth }) => auth);
  const tabPermission = user?.tabPermission && user?.tabPermission?.length > 0 && user?.tabPermission?.find(item => "/"+item.tabId.tabUrl === history.location.pathname);
  const { transactionTypeTab } = useSelector(
    ({ paymentGateway }) => paymentGateway,
  );
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visible_confirm_model, setVisible_confirm_model] = useState(false);
  const [visiblemodel, setVisiblemodel] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [activeStatus, setActiveStatus] = useState(true);
  const [actionData, setActionData] = useState({
    message: "",
    action: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState(transactionTypeTab);

  const fetchData = async () => {
    setLoadingData(true);
    await PaymentGetway.getAllPaymentGetway({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      search: searchData,
      activeFilter: activeStatus,
      transactionTypeFilter,
    })
      .then((response) => {
        console.log("response", response.data);
        setData(response?.data?.paymentPartner_data);
        setTotalItem(response?.data?.totalData);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  const onStatusChange = async (datas) => {
    setLoadingData(true);
    await PaymentGetway.editPaymentGetway(datas)
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

  const visibleModel = () => {
    setVisiblemodel(!visiblemodel);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const showConfirm = (id, type) => {
    let selectedData = data.filter((item) => item._id === id);
    if (type === "edit") {
      history.push({
        pathname: "payment-gateway/editpaymentgetway",
        state: {
          editData: selectedData[0],
          id: [id],
          transactionType: selectedData[0].transactionType
        },
      });
    }
  };

  const onChangePGType = (key) => {
    let type = key === "1" ? "deposit" : "withdraw";
    setTransactionTypeFilter(type);
  };

  useEffect(() => {
    if (refresh) {
      fetchData();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    fetchData();
  }, [activeStatus, transactionTypeFilter]);

  useEffect(() => {
    if (searchData) {
      fetchData();
    }
  }, [searchData]);

  const tableColumns = paymentGatewayColumn(
    page,
    pageSize,
    data,
    onStatusChange,
    showConfirm,
    tabPermission && tabPermission?.edit,
  );

  const tableData = {
    refresh,
    title: title,
    columns: tableColumns.filter((a) => (a ? a : undefined)),
    isActive: true,
    isPaymentToWithWebAcc: activeStatus,
    search: true,
    pgTable: true,
    totalResults: totalItem,
    activeTabKey: transactionTypeTab === "deposit" ? "1" : "2",
    hadleSwitchChange: hadleSwitchChange,
    showMore,
    onSearchData,
    onChangePGType,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
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
            pageSize: 100,
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

export default withRouter(PaymentGetwayList);
