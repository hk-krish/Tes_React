import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import {
    AutoCoinsDetailsColumns
} from "../../../../components/ColumnComponents/columnComponents";
import DefaultTable from "../../../../components/defaultTable/Table";
import CryptoService from "../../../../service/CryptoService";
import { useSelector } from "react-redux";
import notify from "../../../../Notification";

const title = "Auto Coin Config";

const AutoCoinConfig = () => {
    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [pageLimit, setPageLimit] = useState(0);
    const [page, setPage] = useState(1);
    const [totalItem, setTotalItem] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const history = useHistory();
    const { user } = useSelector(({ auth }) => auth);
    const tabPermission = user?.tabPermission && user?.tabPermission?.length > 0 && user?.tabPermission?.find(item => "/" + item.tabId.tabUrl === history.location.pathname);
    const [refresh, setRefresh] = useState(false);
    const [searchData, setSearchData] = useState(null);
    const [activeStatus, setActiveStatus] = useState(true);
    const [checkAll, setCheckAll] = useState(false);

    const fetchData = async (page, pageSize) => {
        setLoadingData(true);
        setData([]);
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
                setData(response?.data?.coin_data);
                setPageLimit(response.data.state.page_limit);
                setCheckAll(response?.data?.coin_data?.filter(item => item.isRateAutoGenerate === true).length === totalItem);
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

    const handleInputChange = (e, all) => {
        const { id, name, value, checked, type } = e.target;

        const newValue = type === 'checkbox' ? checked : value;
        if (all) {
            setData(prevData =>
                prevData.map(item => ({
                    ...item,
                    "isRateAutoGenerate": newValue
                }))
            );
        } else {
            setData(prevData =>
                prevData.map(item =>
                    item._id === id ? { ...item, [name]: newValue } : item
                )
            );
        }
    };


    const hadleSwitchChange = () => {
        setActiveStatus(!activeStatus);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const onSearchData = (data) => {
        setPage(1);
        setPageSize(10);
        setSearchData(data);
    };

    const editAllCoinDetails = async () => {
        setLoadingData(true);
        await CryptoService.editAllCoin(data)
            .then((response) => {
                if (response.status === 200 || response.status === 202) {
                    notify.openNotificationWithIcon(
                        "success",
                        "Success",
                        "Coin Details has been successfully Updated",
                    );
                    setLoadingData(false);
                } else {
                    notify.openNotificationWithIcon("error", "Error", response.message);
                    setLoadingData(false);
                    console.log(response.message);
                }
            })
            .catch((err) => {
                notify.openNotificationWithIcon("error", "Error", err.message);
                setLoadingData(false);
                console.log(err);
            });
        setRefresh(true);
    }

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

    const tableColumns = AutoCoinsDetailsColumns(
        page,
        pageSize,
        handleInputChange,
        checkAll,
        setCheckAll
    );

    const tableData = {
        refresh,
        title,
        columns: tableColumns,
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
        saveAllCoinData: tabPermission && tabPermission?.edit && editAllCoinDetails,
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
            </Auxiliary>
        </>
    );
};

export default AutoCoinConfig;
