import { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom/cjs/react-router-dom.min"
import Auxiliary from "util/Auxiliary";
import DefaultTable from "../../../components/defaultTable/Table";
import RoleDetailService from "../../../service/RoleDetailService";
import { message } from "antd";

const RoleDetails = (props) => {
    const [data, setData] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const history = useHistory();
    const [searchData, setSearchData] = useState(null);

    const onSearchData = (data) => {
        setSearchData(data);
    };

    const handleRefresh = async () => {
        setSearchData(null);
        setData([]);
        setRefresh(true);
    };

    const editRoleDetails = async () => {
        let updateData = {
            data,
            roleId: props?.location?.state?.id[0]
        }
        setLoading(true);
        await RoleDetailService.EditRoleDetail(updateData)
            .then(response => {
                console.log("response===> ", response);
                setLoading(false);
                history.push("/role");
            }).catch((err) => {
                console.log(err);
                setLoading(false);
                message.error(err.message);
            });
    }

    const onCheckBoxChange = (e, type, record) => {
        const updatedData = data?.map(item => {
            if (item._id === record._id) {
                if (type === "all") {
                    return {
                        ...item,
                        view: e.target.checked,
                        add: e.target.checked,
                        edit: e.target.checked,
                        delete: e.target.checked,
                        isActive: e.target.checked
                    }
                } else {
                    return {
                        ...item,
                        [type]: e.target.checked
                    };
                }
            }
            return item;
        });
        setData(updatedData);
    };

    const columns = [
        {
            title: <div className="text-center"> Sr. No. </div>,
            dataIndex: "_id",
            key: "srNo",
            render: (text, record, index) => (
                <div className="text-right-nowrap">
                    {index + 1}
                </div>
            ),
        },
        {
            title: <div className="text-center"> Parent Tab </div>,
            dataIndex: "parentId",
            key: "parentId",
            render: (text, record) => <div className="text-center"> {text ? record?.parentTab?.displayName : "-"} </div>,
        },
        { title: "Tab Name", dataIndex: "tabName", key: "tabName" },
        { title: "Tab Display Name", dataIndex: "displayName", key: "displayName" },
        { title: "Tab URL", dataIndex: "tabUrl", key: "tabUrl" },
        {
            title: "View",
            dataIndex: "view",
            key: "view",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {record?.hasView ?
                        <input
                            type={"checkbox"}
                            checked={text}
                            onChange={(e) => onCheckBoxChange(e, "view", record)}
                        /> :
                        <div className="text-right-nowrap">
                            NA
                        </div>}
                </div>
            ),
        },
        {
            title: "Add",
            dataIndex: "add",
            key: "add",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {record?.hasAdd ?
                        <input
                            type={"checkbox"}
                            checked={text}
                            onChange={(e) => onCheckBoxChange(e, "add", record)}
                        /> :
                        <div className="text-right-nowrap">
                            NA
                        </div>}
                </div>
            ),
        },
        {
            title: "Edit",
            dataIndex: "edit",
            key: "edit",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {record?.hasEdit ?
                        <input
                            type={"checkbox"}
                            checked={text}
                            onChange={(e) => onCheckBoxChange(e, "edit", record)}
                        /> :
                        <div className="text-right-nowrap">
                            NA
                        </div>}
                </div>
            ),
        },
        {
            title: "Delete",
            dataIndex: "delete",
            key: "delete",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    {record?.hasDelete ?
                        <input
                            type={"checkbox"}
                            checked={text}
                            onChange={(e) => onCheckBoxChange(e, "delete", record)}
                        /> :
                        <div className="text-right-nowrap">
                            NA
                        </div>}
                </div>
            ),
        },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <input
                        type={"checkbox"}
                        checked={text}
                        onChange={(e) => onCheckBoxChange(e, "isActive", record)}
                    />
                </div>
            ),
        },
        {
            title: "All",
            dataIndex: "_id",
            key: "_id",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <input
                        type={"checkbox"}
                        checked={record?.view && record?.add && record?.edit && record?.delete && record?.isActive}
                        onChange={(e) => onCheckBoxChange(e, "all", record)}
                    />
                </div>
            ),
        },
        // {
        //     title: 'Action', dataIndex: '_id', key: '_id', render: text => text ? <div style={{ display: "flex", flexDirection: "row" }}>
        //         <Button onClick={() => showConfirm(text, 'edit')}><EditOutlined />Edit</Button>
        //         <Button onClick={() => showConfirm(text, 'delete')}><DeleteOutlined />Delete</Button>
        //     </div> : "", sorter: (a, b) => sorter(a.isActive, b.isActive)
        // },
        // { title: 'UpdatedAt', dataIndex: 'updatedAt', key: 'updatedAt', render: text => new Date(text).toLocaleString('en-GB'), sorter: (a, b) => sorter(a.updatedAt, b.updatedAt) },
    ];

    const tableData = {
        refresh,
        columns: columns,
        totalResults: totalItem,
        onSearchData,
        handleRefresh: handleRefresh,
        saveRoleData: editRoleDetails
    };

    const fetchRoleDetailData = async () => {
        setLoading(true);
        await RoleDetailService.getRoleDetailById({
            roleId: props?.location?.state?.id[0],
            search: searchData ? searchData : null,
        })
            .then(response => {
                console.log("response===> ", response);
                setTotalItem(response?.data?.length);
                setPageSize(response?.data?.length);
                setLoading(false);
                setData(response?.data);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
                message.error(err.message);
            });
    }

    useEffect(() => {
        if (refresh) {
            fetchRoleDetailData();
            setRefresh(false);
        }
    }, [refresh]);

    useEffect(() => {
        fetchRoleDetailData();
    }, [searchData])

    return (
        <>
            <Auxiliary>
                <DefaultTable
                    dataSource={data}
                    data={tableData}
                    loadingData={loading}
                    paginationData={{
                        current: 1,
                        pageSize: pageSize,
                        total: totalItem,
                    }}
                // pagination={true}
                // selectedRowKeys={selectedRowKeys}
                // selectedRows={selectedRows}
                />
            </Auxiliary>
        </>
    );
}

export default withRouter(RoleDetails);