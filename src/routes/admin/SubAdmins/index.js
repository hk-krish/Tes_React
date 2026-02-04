import Auxiliary from "util/Auxiliary";
import DefaultTable from "../../../components/defaultTable/Table";
import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import SubAdminService from "../../../service/SubAdminService";
import { SubAdminColumns } from "../../../components/ColumnComponents/columnComponents";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

let title = "Sub-Admins";

const SubAdmins = () => {
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [activeStatus, setActiveStatus] = useState(true);
    const [searchData, setSearchData] = useState(null);
    const [totalItem, setTotalItem] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const history = useHistory();
    const currentPageRef = useRef(page); // useRef to store the current page
    const [revealedPasswords, setRevealedPasswords] = useState([]);

    const handleRefresh = async () => {
        setSearchData(null);
        setData([]);
        setRefresh(true);
    };

    const showConfirm = (id, type) => {
        let selectedData = data.filter((item) => item._id === id);
        if (type === "edit") {
            history.push({
                pathname: "sub-admins/editSubAdmin",
                state: {
                    editData: selectedData[0],
                    id: [id],
                },
            });
        }
    };

    const onStatusChange = async (datas) => {
        setLoadingData(true);
        await SubAdminService.editSubAdmin(datas)
            .then((response) => {
                if (response.status === 200 || response.status === 202) {
                    setLoadingData(false);
                    fetchSubAdminsData(page, pageSize);
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

    const showMore = async (current, size) => {
        setPageSize(size);
    };

    const hadleSwitchChange = () => {
        setActiveStatus(!activeStatus);
    };

    const onSearchData = (data) => {
        setPage(1);
        setPageSize(10);
        setSearchData(data);
    };

    const tableColumns = SubAdminColumns(
        page,
        pageSize,
        data,
        showConfirm,
        onStatusChange,
        handleTogglePassword,
        isPasswordRevealed,
        handleCopyToClipboard,
    );

    const tableData = {
        refresh,
        title: title,
        columns: tableColumns,
        addNewDataUrl: `sub-admins/addSubAdmin`,
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

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const fetchSubAdminsData = async (page, pageSize) => {
        setLoadingData(true);
        await SubAdminService.getAllSubAdmins({
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

    useEffect(() => {
        if (refresh) {
            fetchSubAdminsData(page, pageSize);
            setRefresh(false);
        }
    }, [refresh]);

    useEffect(() => {
        if (!refresh) {
            fetchSubAdminsData(page, pageSize);
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
                />
            </Auxiliary>
        </>
    );
}

export default SubAdmins;