import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { agentColumns } from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import AgentService from "../../../service/AgentService";
import { useSelector } from "react-redux";
const title = "Agent";

const UserList = () => {
  const history = useHistory();
  const { user } = useSelector(({ auth }) => auth);
  console.log("Agent page - user data:", user);
  console.log("Agent page - tabmasterData:", user?.tabmasterData);
  
  // Find the current tab permission based on the current path
  const currentTab = user?.tabmasterData?.find(item => 
    item.isActive && (
      item.tabUrl === history.location.pathname.slice(1) ||
      item.tabUrl === history.location.pathname.replace('/', '') ||
      item.tabUrl === 'agent' // fallback for agent page
    )
  );
  console.log("Agent page - currentTab:", currentTab);
  
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [visible_confirm_model, setVisible_confirm_model] = useState(false);
  const [visiblemodel, setVisiblemodel] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [actionData, setActionData] = useState({
    message: "",
    action: "",
  });
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [activeStatus, setActiveStatus] = useState(true);
  const [revealedPasswords, setRevealedPasswords] = useState([]);

  const sorter = (v1, v2) => {
    return (
      (v1 === null) - (v2 === null) ||
      (isFinite(v1) && isFinite(v2) ? v1 - v2 : v1.toString().localeCompare(v2))
    );
  };

  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await AgentService.getAllAgent({
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
        setData(response?.data?.agent_data);
        // setPageLimit(response?.data?.state?.page_limit);
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

  const visibleModel = () => {
    setVisiblemodel(!visiblemodel);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const hadleSwitchChange = () => {
    setActiveStatus(!activeStatus);
  };

  const handleRefresh = async () => {
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
    // await fetchData(pagination);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const onStatusChange = async (datas) => {
    setLoadingData(true);
    await AgentService.editAgent(datas)
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
  const showConfirm = (id, type) => {
    let selectedData = data.filter((item) => item?._id === id);
    if (type === "delete") {
      setVisiblemodel(true);
      setVisible_confirm_model(true);
      setActionData({
        message: "Do you want to Delete selected Agent?",
        action: (e) => handleDelete([id], selectedData[0]),
      });
    } else if (type === "edit") {
      history.push({
        pathname: "agents/editagent",
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
          type: "agents",
        },
      });
    } else if (type === "website") {
      history.push({
        pathname: "website",
        state: {
          id: [id],
          name: data.find((a) => a?._id === id)?.name,
        },
      });
    } else if (type === "operator") {
      history.push({
        pathname: "operator",
        state: {
          editData: selectedData[0],
          id: [id],
          name: selectedData[0].name,
          type: "agent",
        },
      });
    }
  };

  const handleDelete = async (key, row) => {
    setLoadingData(true);
    await AgentService.deleteAgent(key[0])
      .then((result) => {
        setLoadingData(false);
        let datas = data.filter((item, i) => item?._id !== key[0]);
        setData(datas);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, searchData, activeStatus]);

  const tableColumns = agentColumns(
    page,
    pageSize,
    data,
    showConfirm,
    sorter,
    onStatusChange,
    handleTogglePassword,
    isPasswordRevealed,
    handleCopyToClipboard,
    currentTab && currentTab?.edit || true, // fallback for debugging
    currentTab && currentTab?.delete || true, // fallback for debugging
  );

  const tableData = {
    refresh,
    title: title,
    isActive: true,
    columns: tableColumns.filter((a) => (a ? a : undefined)),
    isPaymentToWithWebAcc: activeStatus,
    addNewDataUrl: currentTab && currentTab?.add && `agents/addagent`,
    button: "",
    search: true,
    totalResults: totalItem,
    hadleSwitchChange: hadleSwitchChange,
    showMore,
    onSearchData,
    handleRefresh: handleRefresh,
    onSelectionChange: onSelectionChange,
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

export default UserList;
