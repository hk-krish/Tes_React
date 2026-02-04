import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../Notification";
import {
  entityActionType,
  fetchActiveTab,
  fetchEntityData,
} from "../../appRedux/actions/EntityPayment";
import EntityGetway from "../../service/EntityGetWay";
import { websitePGColumns } from "../ColumnComponents/columnComponents";
import DefaultTable from "../defaultTable/Table";
import AddEntityGetWayModal from "./AddEntityGetWayModal";

const EntityGateWayTable = (props) => {
  const title = "Payment GateWay";
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItem, setTotalItem] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [addEntityGatewayModal, setAddEntityGatewayModal] = useState(false);
  const [priority, setPriority] = useState(null);
  const [changedValues, setChangedValues] = useState({});
  const [isValidInput, setIsValidInput] = useState(true); // Step 1

  const fetchData = async (id, transactionType) => {
    setLoadingData(true);
    await EntityGetway.getAllEntityGetway({
      page: 1,
      limit: Number.MAX_SAFE_INTEGER,
      entityFilter: id,
      search: searchData,
      transactionTypeFilter: transactionType,
    })
      .then((response) => {
        console.log("response=====>>>", response);
        setTotalItem(response?.data?.totalData);
        setData(response?.data?.paymentPartner_data);
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
    await EntityGetway.editEntityGetway(datas)
      .then((response) => {
        if (response.status === 200 || response.status === 202) {
          setLoadingData(false);
          setRefresh(true);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const saveData = async (id, type) => {
    let selectedData = data.filter((item) => item._id === id);
    if (type === "edit") {
      if (props.transactionType === "deposit") {
        dispatch(fetchActiveTab("2"));
      } else {
        dispatch(fetchActiveTab("3"));
      }
      dispatch(entityActionType("edit-entityGateway"));
      dispatch(fetchEntityData(selectedData[0]));
      setAddEntityGatewayModal(true);
    } else if (type === "add") {
      const valueToSave = changedValues[id];

      // Prepare the data object to be sent to the API
      const data = {
        _id: id, // Assuming _id is required for the editEntityGetway API
        priority: valueToSave?.priority,
        commission: valueToSave?.commission,
        entityId: selectedData[0]?.entityId?._id,
        transactionType: props?.transactionType,
        tesCommission: valueToSave?.tesCommission,
      };

      // Remove the saved row from changedValues state
      setChangedValues((prevValues) => {
        const { [id]: deletedValue, ...remainingValues } = prevValues;
        return remainingValues;
      });
      try {
        setLoadingData(true);
        const response = await EntityGetway.editEntityGetway(data);
        if (response?.status === 200) {
          setLoadingData(false);
          setRefresh(true);
        } else {
          setRefresh(true);
          setLoadingData(false);
          notify.openNotificationWithIcon("error", "Error", response.message);
        }
      } catch (error) {
        setLoadingData(false);
        message.error(error);
      }
    }
  };

  const entityGatewayModal = () => {
    dispatch(entityActionType("add-entityGateway"));
    setAddEntityGatewayModal(true);
  };

  const handleChange = (e, record) => {
    const { name, value } = e.target;
    setPriority(value);

    // Update the state for the specific row
    setChangedValues((prevValues) => ({
      ...prevValues,
      [record._id]: {
        ...prevValues[record._id],
        [name]: value,
      },
    }));
    if (name === "priority") {
      // Check if the entered value is greater than 0 and update the validity state
      setIsValidInput(Number(value) > 0);
    } else {
      setIsValidInput(Number(value) >= 0);
    }
  };

  useEffect(() => {
    if (refresh) {
      setData([]);
      fetchData(props?.id, props?.transactionType);
      setRefresh(false);
    }
  }, [refresh, props?.transactionType]);

  useEffect(() => {
    if (props?.id) {
      fetchData(props?.id, props?.transactionType);
    }
  }, [props?.id, props?.transactionType]);

  useEffect(() => {
    if (props?.id && searchData) {
      fetchData(props?.id, props?.transactionType);
    }
  }, [searchData]);

  const tableColumns = websitePGColumns(
    page,
    pageSize,
    data,
    handleChange,
    onStatusChange,
    saveData,
    changedValues,
    isValidInput,
  );

  const tableData = {
    refresh,
    website: true,
    title: title,
    columns: tableColumns,
    button: "",
    search: true,
    entityAddButton: true,
    backButton: props.location.state?.name ? true : false,
    backUrl: props.location.state?.name ? "agents" : undefined,
    totalResults: totalItem,
    entityGatewayModal,
    showMore,
    onSearchData,
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
        <AddEntityGetWayModal
          visible={addEntityGatewayModal}
          onClose={() => {
            setAddEntityGatewayModal(false);
            setRefresh(true);
          }}
          websiteId={props?.id}
        />
      </Auxiliary>
    </>
  );
};

export default withRouter(EntityGateWayTable);
