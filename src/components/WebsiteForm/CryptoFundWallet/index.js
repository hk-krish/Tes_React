import { message } from "antd";
import React, { useEffect, useState } from "react";
import Auxiliary from "util/Auxiliary";
import { CryptoFundWalletColumns } from "../../ColumnComponents/columnComponents";
import DefaultTable from "../../defaultTable/Table";
import CryptoFundWalletService from "../../../service/CryptoFundWalletService";
import AddCryptoFundWalletModal from "./AddCryptoFundWalletModal";
import CryptoService from "../../../service/CryptoService";

const CryptoFundWallet = (props) => {
    const [data, setData] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [pageLimit, setPageLimit] = useState(0);
    const [page, setPage] = useState(1);
    const [totalItem, setTotalItem] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [refresh, setRefresh] = useState(false);
    const [searchData, setSearchData] = useState(null);
    const [activeStatus, setActiveStatus] = useState(true);
    const [isEditData, setIsEditData] = useState(null);
    const [isFundWalletModalVisible, setIsFundWalletModalVisible] = useState(false);
    const [coinData, setCoinData] = useState(null);

    const fetchData = async (page, pageSize) => {
        setLoadingData(true);
        await CryptoFundWalletService.getAllCryptoFundWallet({
            websiteId: props?.id,
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
                setData(response?.data?.crypto_wallet_data);
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

    const showConfirm = (record, type) => {
        if (type === "edit") {
            setIsEditData(record);
            setIsFundWalletModalVisible(true);
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const onSearchData = (data) => {
        setPage(1);
        setPageSize(10);
        setSearchData(data);
    };


    const entityGatewayModal = () => {
        setIsEditData(null);
        setIsFundWalletModalVisible(true);
    };

    const onStatusChange = async (datas) => {
        setLoadingData(true);
        await CryptoFundWalletService.editCryptoFundWallet(datas)
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

    const tableColumns = CryptoFundWalletColumns(
        page,
        pageSize,
        data,
        showConfirm,
        onStatusChange
    );

    const tableData = {
        title: "Crypto Fund Wallet",
        refresh,
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
        entityAddButton: true,
        entityGatewayModal
    };

    const fetchCoinData = async () => {
        setLoadingData(true);
        await CryptoService.getAllCoins({
            page: 1,
            limit: Number.MAX_SAFE_INTEGER,
            activeFilter: true,
        }).then(response => {
            console.log("response===> ", response);
            setCoinData(response?.data?.coin_data);
        }).catch((err) => {
            console.error(err.message)
        });
        setLoadingData(false);
    }

    useEffect(() => {
        fetchCoinData();
    }, []);

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
                {!loadingData &&
                    <AddCryptoFundWalletModal
                        websiteId={props?.id}
                        coinData={coinData}
                        isEditData={isEditData}
                        visible={isFundWalletModalVisible}
                        setIsFundWalletModalVisible={setIsFundWalletModalVisible}
                        setRefresh={setRefresh}
                    />}
            </Auxiliary>
        </>
    );
};

export default CryptoFundWallet;