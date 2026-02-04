import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { ConfirmModel } from "../../../components/ConfirmModel";
import DefaultTable from "../../../components/defaultTable/Table";
import Auxiliary from "util/Auxiliary";
import TabMasterService from "../../../service/TabMasterService";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import notify from "../../../Notification";
const title = "Tab Master";

const TabMaster = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageLimit, setPageLimit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [activeStatus, setActiveStatus] = useState(true);
  const [totalItem, setTotalItem] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const showConfirm = (id, type) => {
    let selectedData = data.filter((item) => item._id === id);
    if (type === "edit") {
      history.push({
        pathname: "tabmaster/edittabmaster",
        state: {
          editData: selectedData[0],
          id: [id],
        },
      });
    }
  };

  const handleChange = (e, record) => {
    setData(prevTabs =>
      prevTabs.map(tab =>
        tab._id === record?._id
          ? { ...tab, number: Number(e.target.value) }
          : tab
      )
    );
  }

  const saveData = async (datas) => {
    await TabMasterService.editTabmaster(datas)
    .then((response) => {
        if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
            );
            setRefresh(true);
            setLoading(false);
        } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setLoading(false);
            console.log(response.message);
        }
    })
    .catch((err) => {
        notify.openNotificationWithIcon("error", "Error", err.message);
        setLoading(false);
        console.log(err);
    });
  }

  const onStatusChange =  async (datas) => {
    await TabMasterService.editTabmaster(datas)
    .then((response) => {
        if (response.status === 200 || response.status === 202) {
            notify.openNotificationWithIcon(
                "success",
                "Success",
                "YourData has been successfully Updated",
            );
            setLoading(false);
            setRefresh(true);
          } else {
            notify.openNotificationWithIcon("error", "Error", response.message);
            setLoading(false);
            console.log(response.message);
        }
    })
    .catch((err) => {
        notify.openNotificationWithIcon("error", "Error", err.message);
        setLoading(false);
        console.log(err);
    });
  }

  const columns = [
    { title: "Tab Name", dataIndex: "tabName", key: "tabName" },
    {
      title: <div className="text-center"> Parent Tab </div>,
      dataIndex: "parentTab",
      key: "parentTab",
      render: (text) => <div className="text-center"> {text ? text.displayName : "-"} </div>,
    },
    { title: "Tab Display Name", dataIndex: "displayName", key: "displayName" },
    { title: "Tab URL", dataIndex: "tabUrl", key: "tabUrl" },
    {
      title: <div className="text-center"> Tab Number </div>,
      dataIndex: "number",
      key: "number",
      render: (text, record) => (
        <div className="text-center">
          <Form>
            <Form.Item
              name={`customInput-${record.key}`}
              rules={[
                {
                  required: text !== "",
                  pattern: new RegExp(/^0*[1-9]\d*$/),
                  message: "Please enter only numerical characters!",
                },
            ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                type="number"
                name="number"
                min={1}
                step="1"
                defaultValue={text}
                style={{ textAlign: "center", width: "50%" }}
                onChange={(e) => handleChange(e, record)}
              />
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      title: <div className="text-center">Action</div>, dataIndex: '_id', key: '_id',
      render: (text, record) =>
        text ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button title={"Edit"} onClick={() => showConfirm(text, "edit")}>
                <EditOutlined />
              </Button>
              <Button
                title={
                  data.find((a) => a?._id === text)?.isActive
                    ? "Active"
                    : "Inactive"
                }
                onClick={() =>
                  onStatusChange({
                    _id: text,
                    isActive: !data.find((a) => a?._id === text)?.isActive,
                  })
                }
              >
                {!data.find((a) => a?._id === text)?.isActive ? (
                  <div style={{ color: "red" }}>
                    <EyeInvisibleOutlined size={25} />
                  </div>
                ) : (
                  <div style={{ color: "green" }}>
                    <EyeOutlined size={25} />
                  </div>
                )}
              </Button>
              <Button
                type="primary"
                title={"SAVE"}
                onClick={() => saveData({
                  _id: text,
                  number: data?.find((a) => a?._id === text)?.number,
                })}
                disabled={data?.find((a) => a?._id === text)?.number < 1}
              >
                SAVE
              </Button>
            </div>
          </>
        ) : (
          ""
        ),
    }
  ];

  const onSearchData = (data) => {
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

  const hadleSwitchChange = () => {
    setActiveStatus(!activeStatus);
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const fetchTabmasterData = async () => {
    setLoading(true);
    await TabMasterService.getAllTabmaster({
      page,
      limit: pageSize,
      search: searchData ? searchData : null,
      activeFilter: activeStatus,
    }).then(response => {
      console.log("response===> ", response);
      setTotalItem(response?.data?.totalData[0]?.count || 0);
      setData(response?.data?.tabmaster_data);
      setPageLimit(response?.data?.state?.page_limit);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
      message.error(err.message);
    });
  }

  useEffect(() => {
    if (!refresh) {
      fetchTabmasterData();
    }
  }, [page, pageSize, searchData, activeStatus]);

  useEffect(() => {
    if (refresh) {
      fetchTabmasterData();
      setRefresh(false);
    }
  }, [refresh]);

  const tableData = {
    refresh,
    title: title,
    columns: columns,
    addNewDataUrl: `tabmaster/addtabmaster`,
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

  return (
    <>
      <Auxiliary>
        <DefaultTable
          dataSource={data}
          data={tableData}
          loadingData={loading}
          paginationData={{
            current: page,
            pageSize: pageSize,
            total: totalItem,
            onChange: handlePageChange,
          }}
        // pagination={true}
        // selectedRowKeys={selectedRowKeys}
        // selectedRows={selectedRows}
        />
        {/* {visible_confirm_model ? (
          <ConfirmModel
            actionData={actionData}
            visibleModel={visiblemodel}
            visible={visibleModel}
          />
        ) : null} */}
      </Auxiliary>
    </>
  );
};

export default TabMaster;
