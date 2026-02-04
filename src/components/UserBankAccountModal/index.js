import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import DefaultTable from "../defaultTable/Table";

const UserBankAccount = ({
  loadingData,
  modalName,
  visible,
  onClose,
  data,
}) => {
  const [userBankAccount, setUserBankAccount] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [searchData, setSearchData] = useState({
    searchText: null,
    filterData: null,
  });

  const onSearchString = (event) => {
    if (event.target.value === "") {
      setSearchData({ searchText: null, filterData: null });
      return;
    }
    const value = event.target.value?.toLowerCase();
    // console.log("value------>>>", value)
    let trimValue = value.trim();
    const newData = filteredData(data, trimValue);
    setSearchData({ ...searchData, searchText: value.trim() });
    setSearchData({ ...searchData, filterData: newData });
  };
  const filteredData = (data, value, filterArray = []) => {
    const myFilteredNewData = data.filter((a) => {
      Object.entries(a).map(([k, v]) => {
        if (typeof a[k] == "object" && k && v) {
          Object.entries(a[k]).map(([ck, cv]) => {
            if (!a[ck] && v && k && cv) {
              a[k + "-" + ck] = cv;
            }
          });
        }
      });
      return a;
    });
    return myFilteredNewData.filter((elem) => {
      return Object.keys(elem).some((key) => {
        const isAvailable =
          filterArray.length > 0 ? key.includes(filterArray) : true;
        const mydata =
          isAvailable && elem[key] != null
            ? elem[key]?.toString().toLowerCase().includes(value)
            : "";
        return mydata;
      });
    });
  };

  const handleRefresh = () => {
    setSearchData({ filterData: null, searchText: null });
    setRefresh(true);
    setUserBankAccount([]);
  };

  useEffect(() => {
    setUserBankAccount(data);
  }, [data]);

  useEffect(() => {
    if (refresh) {
      setUserBankAccount(data);
      setRefresh(false);
    }
  }, [refresh]);

  const columns = [
    {
      title: () => <div style={{ textAlign: "right" }}>Sr. No.</div>,
      dataIndex: "_id",
      key: "srNo",
      render: (text) => (
        <div style={{ textAlign: "right" }}>
          {data.findIndex((a) => a._id == text) + 1}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (text ? text.toUpperCase() : "-"),
    },
    {
      title: "UPI ID",
      dataIndex: "upiId",
      key: "upiId",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Account Number",
      dataIndex: "accountNum",
      key: "accountNum",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "Bank Holder Name",
      dataIndex: "accHolderName",
      key: "accHolderName",
      render: (text) => (text ? text : "-"),
    },
    {
      title: "IFSC",
      dataIndex: "ifsc",
      key: "ifsc",
      render: (text) => (text ? text : "-"),
    },
  ];

  const tableData = {
    refresh,
    title: modalName,
    columns: columns,
    onSearchString,
    commonSearch: true,
    totalResults: searchData?.filterData
      ? searchData.filterData?.length
      : userBankAccount?.length,
    handleRefresh,
  };

  return (
    <Modal
      id="BankDetailsModel"
      visible={visible}
      footer={null}
      width={"95%"}
      onCancel={() => {
        onClose();
      }}
    >
      <DefaultTable
        dataSource={searchData.filterData || userBankAccount}
        data={tableData}
        loadingData={loadingData}
        pagination={true}
      />
    </Modal>
  );
};

export default UserBankAccount;
