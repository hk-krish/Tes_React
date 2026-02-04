import Auxiliary from "util/Auxiliary";
import DefaultTable from "../../../components/defaultTable/Table";
import { useEffect, useRef, useState } from "react";
import RoleService from "../../../service/RoleService";
import { RoleColumns } from "../../../components/ColumnComponents/columnComponents";
import { message } from "antd";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const title = "Role";

const Role = () => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const [searchData, setSearchData] = useState(null);
    const [loadingData, setLoadingData] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [activeStatus, setActiveStatus] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    const currentPageRef = useRef(page); // useRef to store the current page

    const fetchRoleData = async (page, pageSize) => {
        setLoadingData(true);
        await RoleService.getAllRole({
            page,
            limit: pageSize,
            search: searchData,
            activeFilter: activeStatus,
        }).then(response => {
            console.log("response===> ", response);
            setTotalItem(response?.data?.totalData[0]?.count);
            setData(response?.data?.role_data);
            setLoadingData(false);
        }).catch((err) => {
            console.log(err);
            setLoadingData(false);
            message.error(err.message);
        });
    }

    const hadleSwitchChange = () => {
        setActiveStatus(!activeStatus);
    };

    const onSearchData = (data) => {
        setPage(1);
        setPageSize(10);
        setSearchData(data);
    };

    const handleRefresh = async () => {
        setSearchData(null);
        setData([]);
        setRefresh(true);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const showConfirm = (id, type) => {
        let selectedData = data.filter((item) => item._id === id);
        if (type === "edit") {
            history.push({
                pathname: "role/editrole",
                state: {
                    editData: selectedData[0],
                    id: [id],
                },
            });
        }
    };

    const showMore = async (current, size) => {
        setPageSize(size);
    };

    const onStatusChange = async (datas) => {
        setLoadingData(true);
        await RoleService.editRole({
            _id: datas?._id,
            isActive: datas?.isActive,
        }).then(response => {
            console.log("response===> ", response);
            setLoadingData(false);
            setRefresh(true);
        }).catch((err) => {
            console.log(err);
            setLoadingData(false);
            message.error(err.message);
        });
    }

    const tableColumns = RoleColumns(
        page,
        pageSize,
        data,
        showConfirm,
        onStatusChange
    );

    const tableData = {
        refresh,
        title: title,
        columns: tableColumns,
        addNewDataUrl: `role/addrole`,
        isActive: true,
        activeFilter: activeStatus,
        isPaymentToWithWebAcc: activeStatus,
        // button: "",
        search: true,
        hadleSwitchChange: hadleSwitchChange,
        totalResults: totalItem,
        onSearchData,
        handleRefresh: handleRefresh,
        // onSelectionChange: onSelectionChange,
        showMore,
    };

    useEffect(() => {
        if (refresh) {
            fetchRoleData(page, pageSize);
            setRefresh(false);
        }
    }, [refresh]);

    useEffect(() => {
        if (!refresh) {
            fetchRoleData(page, pageSize);
        }
        currentPageRef.current = page;
    }, [page, pageSize, activeStatus, searchData]);

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
                    // selectedRowKeys={selectedRowKeys}
                    // selectedRows={selectedRows}
                />
            </Auxiliary>
        </>
    );
}

export default Role;