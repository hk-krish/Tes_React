import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { fetchActiveTab } from "../../../appRedux/actions/EntityPayment";
import { websiteColumns } from "../../../components/ColumnComponents/columnComponents";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import WebsiteService from "../../../service/WebsiteService";

const WebsiteList = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector(({ auth }) => auth);
  console.log("Website page - user data:", user);
  console.log("Website page - tabmasterData:", user?.tabmasterData);
  
  // Find the current tab permission based on the current path
  const currentTab = user?.tabmasterData?.find(item => 
    item.isActive && (
      item.tabUrl === history.location.pathname.slice(1) ||
      item.tabUrl === history.location.pathname.replace('/', '') ||
      item.tabUrl === 'website' // fallback for website page
    )
  );
  console.log("Website page - currentTab:", currentTab);
  
  const title =
    props.location.state?.name && props.location.state?.name
      ? "Website (Agent Name : " + props.location.state?.name + ")"
      : "Website";
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
  const [revealedPasswords, setRevealedPasswords] = useState([]);
  const [activeStatus, setActiveStatus] = useState(true);

  const fetchData = async (page, pageSize) => {
    setLoadingData(true);
    await WebsiteService.getAllWebsite({
      page,
      limit: pageSize, //20,
      agentIdFilter:
        props.location.state?.id && props.location.state?.id[0]
          ? props.location.state?.id[0]
          : "",
      search: searchData ? searchData : null,
      activeFilter: activeStatus,
    })
      .then((response) => {
        console.log("response", response.data);
        let newResponseData = [];

        response.data.website_data.forEach((item, index) => {
          item.agentName = item?.agent?.name;
          newResponseData.push(item);
        });
        // let newData = data.concat(newResponseData);
        let totalItem = response?.data?.totalData[0]
          ? response?.data?.totalData[0]?.count
          : 0;
        setTotalItem(totalItem);
        setData(newResponseData);
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
      dispatch(fetchActiveTab("1"));
      localStorage.setItem("addAction", "false");
      history.push({
        pathname: "websites/editwebsite",
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
          type: "websites",
        },
      });
    }
  };

  const handleDelete = async (key, row) => {
    setLoadingData(true);
    await WebsiteService.deleteWebsite(key[0])
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

  const visibleModel = () => {
    setVisiblemodel(!visiblemodel);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onStatusChange = async (datas) => {
    setLoadingData(true);
    await WebsiteService.editWebsite(datas)
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

  const hadleSwitchChange = () => {
    setActiveStatus(!activeStatus);
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
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    fetchData(page, pageSize);
  }, [page, pageSize, searchData, activeStatus]);

  const tableColumns = websiteColumns(
    props,
    page,
    pageSize,
    data,
    showConfirm,
    onStatusChange,
    handleTogglePassword,
    isPasswordRevealed,
    handleCopyToClipboard,
    currentTab && currentTab?.edit || true, // fallback for debugging
    currentTab && currentTab?.delete || true, // fallback for debugging
  );

  const tableData = {
    refresh,
    website: true,
    title: title,
    isActive: true,
    isPaymentToWithWebAcc: activeStatus,
    columns: tableColumns.filter((a) => (a ? a : undefined)),
    addNewDataUrl: currentTab && currentTab?.add && `websites/addwebsite`,
    button: "",
    search: true,
    backButton: props.location.state?.name ? true : false,
    backUrl: props.location.state?.name ? "agents" : undefined,
    totalResults: totalItem,
    showMore,
    onSearchData,
    hadleSwitchChange,
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

export default withRouter(WebsiteList);
