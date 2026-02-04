import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import notify from "../../Notification";
import { fetchAssignVendorData } from "../../appRedux/actions";
import {
  entityActionType,
  fetchActiveTab,
} from "../../appRedux/actions/EntityPayment";
import CommossionService from "../../service/CommissionService";
import { websiteAssignVendorColumns } from "../ColumnComponents/columnComponents";
import DefaultTable from "../defaultTable/Table";
import AddWebsiteAssignVendorModal from "./AddWebsiteAssignVendorModal";

const WebsiteAssignVendor = (props) => {
  const title = `Vendor ${props?.VendorType}`;
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
  const [websiteAssignVendorModal, setWebsiteAssignVendorModal] =
    useState(false);
  const [priority, setPriority] = useState(null);
  const [changedValues, setChangedValues] = useState({});
  const [isValidInput, setIsValidInput] = useState(true);
  const [originalValues, setOriginalValues] = useState({});

  const fetchData = async (id, VendorType) => {
    setLoadingData(true);
    await CommossionService.getAssignVendor({
      websiteId: id,
      transactionType: VendorType,
    })
      .then((response) => {
        console.log("response=====>>>", response);
        setTotalItem(response?.data?.totalData);
        setData(response?.data?.website_vendor_data);
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const saveData = async (id, type) => {
    console.log("id-----", id);

    let selectedData = data.filter((item) => item.vendorId === id);
    if (type === "edit") {
      if (props.VendorType === "deposit") {
        dispatch(fetchActiveTab("4"));
      } else {
        dispatch(fetchActiveTab("5"));
      }
      dispatch(entityActionType("edit-assignVendor"));
      dispatch(fetchAssignVendorData(selectedData[0]));
      setWebsiteAssignVendorModal(true);
    } else if (type === "delete") {
      let data = {
        transactionType: props?.VendorType,
        vendorId: id,
        websiteId: props?.id,
        isActive: false,
      };
      console.log("data------", data);
      try {
        setLoadingData(true);
        const response = await CommossionService.editCommission(data);
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
      // Remove the saved row from changedValues state
      setChangedValues((prevValues) => {
        const { [id]: deletedValue, ...remainingValues } = prevValues;
        return remainingValues;
      });
    } else if (type === "add") {
      const valueToSave = changedValues[id];

      // Prepare the data object to be sent to the API
      const dataToSave = {};
      for (const key in valueToSave) {
        if (valueToSave[key] !== originalValues[id][key]) {
          dataToSave[key] = valueToSave[key];
        }
      }

      const data = {
        transactionType: props?.VendorType,
        websiteId: props?.id,
        ...dataToSave,
        vendorId: id,
      };
      try {
        setLoadingData(true);
        const response = await CommossionService.editCommission(data);
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
    dispatch(entityActionType("add-assignVendor"));
    setWebsiteAssignVendorModal(true);
  };

  const countChanges = (oValue, cValue) => {
    let changes = 0;

    for (let key in oValue) {
      if (oValue.hasOwnProperty(key)) {
        if (cValue[key] !== undefined && JSON.stringify(oValue[key]) !== JSON.stringify(cValue[key])) {
          changes++;
        }
      }
    }

    for (let key in cValue) {
      if (cValue.hasOwnProperty(key) && oValue[key] === undefined) {
        changes++;
      }
    }

    return changes < 1 ? false : true;
  }

  const checkValues = (obj) => {
    let errorCount = 0;
    for (let key in obj) {
      if (key === "priority") {
        if (Number(obj[key]) < 1) errorCount = errorCount + 1;
        if (!Number.isInteger(Number(obj[key]))) errorCount = errorCount + 1;
      } else {
        if (parseFloat(obj[key]) < 0) {
          errorCount = errorCount + 1;
        }
      }
    }

    return errorCount < 1 ? true : false;
  }

  const handleChange = (e, record) => {
    const { name, value } = e.target;
    setPriority(value);

    let oValues = originalValues;

    // Save the original value if not already saved
    if (!originalValues[record.vendorId]) {
      oValues = {
        ...originalValues,
        [record.vendorId]: {
          ...record,
        }
      }
      setOriginalValues((prevValues) => ({
        ...prevValues,
        [record.vendorId]: {
          ...record,
        },
      }));
    }

    let cValues = {
      ...changedValues,
      [record.vendorId]: {
        ...changedValues[record?.vendorId],
        [name]: name === "priority" ? Number(value) : value,
      },
    }

    // Update the state for the specific row
    setChangedValues(cValues);

    // Check if the entered value is valid for the specific row
    setIsValidInput((prevValid) => ({
      ...prevValid,
      [record.vendorId]: countChanges(oValues[record.vendorId], cValues[record.vendorId]) === true ? checkValues(cValues[record.vendorId]) : false,
    }));
  };

  useEffect(() => {
    if (refresh) {
      setData([]);
      fetchData(props?.id, props?.VendorType);
      setRefresh(false);
    }
  }, [refresh, props?.VendorType]);

  useEffect(() => {
    if (props?.id) {
      fetchData(props?.id, props?.VendorType);
    }
  }, [props?.id, props?.VendorType]);

  useEffect(() => {
    if (props?.id && searchData) {
      fetchData(props?.id, props?.VendorType);
    }
  }, [searchData]);

  const tableColumns = websiteAssignVendorColumns(
    page,
    pageSize,
    data,
    handleChange,
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
        <AddWebsiteAssignVendorModal
          visible={websiteAssignVendorModal}
          onClose={() => {
            setWebsiteAssignVendorModal(false);
            setRefresh(true);
          }}
          websiteId={props?.id}
        />
      </Auxiliary>
    </>
  );
};

export default withRouter(WebsiteAssignVendor);
