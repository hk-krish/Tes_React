import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { operatorColumns } from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import OperatorService from "../../../service/OperatorService";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";

const Operator = (props) => {
  let title =
    props.location.state?.type === "vendor"
      ? "Operator (Vendor Name : " + props.location.state?.name + ")"
      : props.location.state?.type === "agent"
        ? "Operator (Agent Name : " + props.location.state?.name + ")"
        : "Operator";
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
  console.log("Operator page - user data:", user);
  console.log("Operator page - tabmasterData:", user?.tabmasterData);
  
  // Find the current tab permission based on the current path
  const currentTab = user?.tabmasterData?.find(item => 
    item.isActive && (
      item.tabUrl === history.location.pathname.slice(1) ||
      item.tabUrl === history.location.pathname.replace('/', '') ||
      item.tabUrl === 'operator' // fallback for operator page
    )
  );
  console.log("Operator page - currentTab:", currentTab);
  
  const [refresh, setRefresh] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [revealedPasswords, setRevealedPasswords] = useState([]);
  const [activeStatus, setActiveStatus] = useState(true);

  const fetchData = async (page, pageSize) => {
    localStorage.setItem("type", props.location.state?.type);
    localStorage.setItem("name", props.location.state?.name);
    localStorage.setItem("id", props.location.state?.id[0]);
    setLoadingData(true);
    if (props.location.state?.id[0]) {
      await OperatorService.getAllOperator({
        page,
        limit: pageSize, //20
        search: searchData ? searchData : null,
        activeFilter: activeStatus,
        entityIdFilter: props.location.state?.id[0],
      })
        .then((response) => {
          console.log("response", response.data);
          let totalItem = response?.data?.totalData || 0;
          setTotalItem(totalItem);
          setData(response.data?.operator_data);
          setPageLimit(response.data.state.page_limit);
          setLoadingData(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    } else {
      await OperatorService.getAllOperator({
        page,
        limit: pageSize, //20
        search: searchData ? searchData : null,
        activeFilter: activeStatus,
      })
        .then((response) => {
          console.log("response", response.data);
          let totalItem = response?.data?.totalData || 0;
          setTotalItem(totalItem);
          // let newData = data.concat(response.data.vendor_data);
          setData(response.data?.operator_data);
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
        pathname: "operator/editoperator",
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
    }
  };

  const handleDelete = async (key, row) => {
    setLoadingData(true);
    await OperatorService.deleteOperatorById(key[0])
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

  const onStatusChange = async (datas) => {
    setLoadingData(true);
    await OperatorService.editOperator(datas)
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

  const visibleModel = () => {
    setVisiblemodel(!visiblemodel);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
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

  const tableColumns = operatorColumns(
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
    title: title,
    refresh,
    columns: tableColumns,
    addNewDataUrl: currentTab?.add && `operator/addoperator`,
    isActive: true,
    isPaymentToWithWebAcc: activeStatus,
    button: "",
    backButton: "",
    hadleSwitchChange: hadleSwitchChange,
    backUrl:
      props.location.state?.type === "websites"
        ? "websites"
        : props.location.state?.type === "vendor"
          ? "vendor"
          : "agents",
    search: true,
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

export default Operator;
