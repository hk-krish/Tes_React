import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import Auxiliary from "util/Auxiliary";
import { Button, Card, message, Tabs } from "antd";
import notify from "../../../Notification";
import { ArrowLeftOutlined } from "@ant-design/icons";
import BankAccountForm from "../../../components/BankAccountForm";
import DefaultTable from "../../../components/defaultTable/Table";
import { depositTransactionColumns } from "../../../components/ColumnComponents/columnComponents";
import TransactionReportService from "../../../service/TransactionReportServices";
import { fetchActiveBankTab } from "../../../appRedux/actions/BankAccount";
import ImagePreviewModal from "../../../components/ImagePreviewModal";
import { downloadCSV, downloadExcel } from "../../../util/CSVandExcelDownload";
import { generateFormattedData } from "../../../util/DownloadFormattedData";

const { TabPane } = Tabs;

const AddBankList = (props) => {
  let title = "";
  if (props?.location?.pathname === "/bank/editbank") {
    title = "Edit Bank Account";
  } else {
    title = "Add Bank Account";
  }
  if (localStorage.getItem("type") === "websites") {
    title += ` (Website: ${
      props?.location?.state?.accHolderName || localStorage.getItem("name")
    })`;
  }
  if (localStorage.getItem("type") === "vendor") {
    title += ` (vendor: ${
      props?.location?.state?.accHolderName || localStorage.getItem("name")
    })`;
  }
  if (localStorage.getItem("type") === "agents") {
    if (
      props?.location?.state?.name ||
      (localStorage.getItem("name") &&
        localStorage.getItem("name") !== "undefined")
    ) {
      title += ` (Agent: ${
        props?.location?.state?.name || localStorage.getItem("name")
      })`;
    }
  }

  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(false);
  const { activeBankTab } = useSelector(({ bankAccount }) => bankAccount);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalItem, setTotalItem] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [defaultActiveTab, setDefaultActiveTab] = useState("1");
  const [searchData, setSearchData] = useState(null);
  const [searchClick, setSearchClick] = useState(false);

  const currentPageRef = useRef(page);

  const fetchData = async (fetchAllData = false) => {
    const param = {
      id: props?.location?.state?.editData?._id,
      page,
      limit: pageSize,
      search: searchData || null,
    };

    if (fetchAllData === true) {
      param.limit = Number.MAX_SAFE_INTEGER;
      const reportResponse =
        await TransactionReportService.getDailyTransactionById(param)
          .then((response) => {
            const allData = response?.data?.todayTransactionData || [];
            return allData;
          })
          .catch((err) => {
            console.log(err);
            message.error(err.message);
          });

      return reportResponse;
    } else {
      await TransactionReportService.getDailyTransactionById(param)
        .then((response) => {
          if (response.status === 200) {
            let totalItem = response?.data?.totalData[0]
              ? response?.data?.totalData[0]?.count
              : 0;
            setTotalItem(totalItem);
            setData(response?.data?.todayTransactionData);
            setLoadingData(false);
          } else {
            setLoadingData(false);
            notify.openNotificationWithIcon(
              "error",
              "Error",
              response?.message,
            );
          }
        })
        .catch((err) => {
          console.log(err);
          setLoadingData(false);
          message.error(err.message);
        });
    }
  };

  const showMore = async (current, size) => {
    setPageSize(size);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCopyToClipboard = (text) => {
    message.success(`Text copied to clipboard: ${text}`);
  };

  const calculatedTimeDifference = useMemo(() => {
    return (createdAt, updatedAt) => {
      const createdDate = new Date(createdAt);
      const updatedDate = new Date(updatedAt);

      const timeDifference = updatedDate - createdDate;
      const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3,600,000 milliseconds
      const remainingMilliseconds = timeDifference % 3600000;
      const minutes = Math.floor(remainingMilliseconds / 60000); // 1 minute = 60,000 milliseconds
      const seconds = Math.floor((remainingMilliseconds % 60000) / 1000); // 1 second = 1,000 milliseconds

      if (hours === 0) {
        return `${minutes.toString().padStart(2, "0")}m : ${seconds
          .toString()
          .padStart(2, "0")}s`;
      } else {
        return `${hours}h : ${minutes.toString().padStart(2, "0")}m : ${seconds
          .toString()
          .padStart(2, "0")}s`;
      }
    };
  }, []);

  const handleRefresh = async () => {
    setSearchData(null);
    setData([]);
    setRefresh(true);
  };

  const onSearchData = (data) => {
    setPage(1);
    setPageSize(10);
    setSearchData(data);
  };

  const selectedFormat = async (format) => {
    try {
      let reportData;
      if (format === "CSV" || format === "Excel") {
        setLoadingData(true);
        reportData = await fetchData(true);
        setLoadingData(false);
      }

      if (reportData.length !== 0) {
        if (format === "CSV") {
          downloadCSV(
            generateFormattedData(reportData, "depositReport"),
            "Deposit Transaction Report",
          );
        } else if (format === "Excel") {
          downloadExcel(
            generateFormattedData(reportData, "depositReport"),
            "Deposit Transaction Report",
          );
        }
      } else {
        notify.openNotificationWithIcon(
          "error",
          "Error",
          "No Data To Download.",
        );
      }
    } catch (err) {
      console.error(err);
      setLoadingData(false);
      notify.openNotificationWithIcon(
        "error",
        "Error",
        "Failed to download data. Please try again.",
      );
    }
  };

  const tableColumns = depositTransactionColumns(
    page,
    pageSize,
    calculatedTimeDifference,
    handleCopyToClipboard,
    setImageModalVisible,
    setImageUrl,
  );

  const tableData = {
    columns: tableColumns,
    totalResults: totalItem,
    showMore,
    refresh,
    handleRefresh,
    onSearchData,
    search: true,
    selectedFormat,
    download: [
      { name: "CSV", value: "csv" },
      { name: "Excel", value: "excel" },
    ],
  };

  useEffect(() => {
    if (searchClick) {
      setSearchClick(false);
    }
  }, [searchClick]);

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (props?.location?.state?.editData?.type === "upi") {
      if (!refresh) {
        fetchData(page, pageSize);
      }
      currentPageRef.current = page;
    }
  }, [page, pageSize, searchData]);

  useEffect(() => {
    setDefaultActiveTab("1");
    dispatch(fetchActiveBankTab("1"));
  }, []);

  return (
    <>
      <Auxiliary>
        <Card
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                title={"Back"}
                type="primary"
                icon={<ArrowLeftOutlined />}
                onClick={() => props.history.goBack()}
                style={{ marginBottom: 0, marginRight: "15px" }}
              />
              {title}
            </div>
          }
        >
          <BankAccountForm props={props} />
        </Card>
      </Auxiliary>
      <ImagePreviewModal
        visible={imageModalVisible}
        onClose={() => {
          setImageModalVisible(false);
        }}
        data={imageUrl}
      />
    </>
  );
};
export default withRouter(AddBankList);
