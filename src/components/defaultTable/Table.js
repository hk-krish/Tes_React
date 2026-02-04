import {
  FileExcelOutlined,
  FileTextOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  entityActionType,
  fetchActiveTab,
  fetchEntityData,
} from "../../appRedux/actions/EntityPayment";
import { fetchActiveTransactionTypeTab } from "../../appRedux/actions/PaymentGateway";
import { MillisecondsToTime } from "../../util/MillisecondsToTime";
import AdvanceFilter from "../AdvanceFilter";
import PaymentUserDropdown from "../InputControl/PaymentUserDropdown/UserDropdown";
import UserDropdown from "../InputControl/UserDropdown/UserDropdown";
import "./table.css";

const form = React.createRef();
const FormItem = Form.Item;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};

class DefaultTable extends React.Component {
  constructor(props) {
    // console.log("props-----", props);
    super(props);
    this.state = {
      uedInfo: null,
      sortedInfo: null,
      date: null,
      selectedRowKeys: [],
      selectedRows: "",
      isModalVisible: false,
      previewVisible: false,
      filterModel: false,
      filterData: null,
      date: null,
      page: null,
      pageSize: null,
      searchData: null,
      searchText: null,
      startDate: null,
      endDate: null,
      downloadExcelCSV: false,
      selectedVendor: "Select Vendor",
      selectedAgent: "Select Agent",
      selectedStatus: "Select Status",
      selectedReqType: "Select Request",
      selectedWebsite: "Select Website",
      statusFilter: "Select Status",
      actionFilter: "Select Action",
      requestTypeFilter: "Request Type",
      transactionTypeFilter: "Transaction Type",
      website: "Website Name",
      receiverType:
        window.location.pathname === "/withdraw/report"
          ? "Sender Type"
          : "Receiver Type",
      requestType: "Request Type",
      selectedPaymnetGateway: "Select PG",
      orderType: "Transaction Process",
      bankAccount: "Select Account",
      bankProcessFilter: "Select Request Process",
      receiverName: "Select Receiver Name",
      receiverAccount: "Select Receiver Account",
      exchangeStatusFilter: "Select Status",
      activeTabKey: this.props.data.activeTabKey, // Default active tab
      isPaymentToWithWebAcc: this.props.data.isPaymentToWithWebAcc, // Assuming this is passed as a prop initially
      actionType: "Select Action",
      entityFilter: "Select Entity",
      selectUser: "Select User",
      historyStatus: "Select Status",
      currencyConversionFilter: this.props.data.currencyConversionFilter,
      currencyConversionFilterToggle:
        this.props.data.currencyConversionFilterToggle,
    };
  }

  handleCancel = () => this.setState({ previewVisible: false });

  onSearchStringChange = (event) => {
    if (event.target.value === "") {
      this.setState({ searchText: null, filterData: null });
      return;
    }
    const value = event.target.value.toLowerCase();
    const newData = this.filteredData(this.props.dataSource, value);
    this.setState({ searchText: event.target.value, filterData: newData });
  };

  filteredData = (data, value, filterArray = []) => {
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
            ? elem[key].toString().toLowerCase().includes(value)
            : "";
        return mydata;
      });
    });
  };

  onSearch = (value) => {
    if (value === "") {
      this.setState({ filterData: null });
      return;
    }
    const newData = this.filteredData(this.props.dataSource, value);
    this.setState({ searchText: value, filterData: newData });
    if (this.props.data.SearchData) {
      this.props.data.SearchData(value);
    }
  };

  handleChange = (pagination, filters, sorter, extra) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
    if (this.props.data?.ShowMore) {
      let count = Math.ceil(this.props.dataSource.length / pagination.pageSize);
      // if (count === pagination.current) {
      // this.props.data.ShowMore(count, pagination, extra)
      // }
    }
    if (this.props.paginationData.onChange) {
      this.props.paginationData.onChange(pagination.current);
      this.setState({ page: null });
    }
  };

  onSelectionChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
    this.props.data.onSelectionChange(selectedRowKeys, selectedRows);
  };

  ShowActivity = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows });
    this.props.data.ShowActivity(selectedRowKeys, selectedRows);
  };

  // Selected Withdraw and Deposite Report Dropdown Data
  onUserSelect = (fieldName, selectedValue, selectedId) => {
    if (selectedValue === "All") {
      this.setState.selectedAgent = "Select Agent";
      this.setState.selectedVendor = "Select Vendor";
      this.setState.selectedWebsite = "Select Website";
    }
    // if(selectedValue=== undefined){
    //   this.setState.selectedAgent="all"
    // }
    if (fieldName === "vendor") {
      this.setState(
        {
          selectedVendor: selectedValue,
        },
        () => {
          this.props.data?.handleVendorSelect(selectedId);
        },
      );
    } else if (fieldName === "agent") {
      this.setState(
        {
          selectedAgent: selectedValue,
        },
        () => {
          this.props.data?.handleAgentSelect(selectedId);
        },
      );
    } else if (fieldName === "website") {
      this.setState(
        {
          selectedWebsite: selectedValue,
        },
        () => {
          this.props.data?.handleWebsiteSelect(selectedId);
        },
      );
    } else if (fieldName === "status") {
      this.setState(
        {
          selectedStatus: selectedValue,
        },
        () => {
          this.props.data?.onUserSelect("status", selectedValue.toLowerCase());
        },
      );
    } else if (fieldName === "exchangeStatusFilter") {
      this.setState(
        {
          exchangeStatusFilter: selectedValue,
        },
        () => {
          this.props.data?.onUserSelect("status", selectedValue.toLowerCase());
        },
      );
    } else if (fieldName === "reqType") {
      this.setState(
        {
          page: 1,
          selectedReqType: selectedValue,
          bankAccount: "Select Account",
        },
        () => {
          this.props.data?.onUserSelect("reqType", selectedValue.toLowerCase());
        },
      );
    } else if (fieldName === "receiverType") {
      this.setState(
        {
          receiverType: selectedValue,
        },
        () => {
          this.props.data?.onUserSelect("receiverType", selectedValue);
        },
      );
    } else if (fieldName === "allWebsiteList") {
      let newValue = selectedValue === "All" ? "all" : selectedId;
      this.setState(
        {
          website: selectedValue,
        },
        () => {
          this.props.data?.onUserSelect("allWebsiteList", newValue);
        },
      );
    } else if (fieldName === "paymentGateway") {
      let newValue = selectedValue === "All" ? "all" : selectedId;
      this.setState(
        {
          selectedPaymnetGateway: selectedValue,
        },
        () => {
          this.props.data?.onUserSelect("paymentGateway", newValue);
        },
      );
    } else if (fieldName === "bankProcessFilter") {
      this.setState(
        {
          bankProcessFilter: selectedValue,
        },
        () => {
          this.props.data?.onUserSelect(
            "bankProcessFilter",
            selectedValue.toLowerCase(),
          );
        },
      );
    } else if (fieldName === "receiverName") {
      this.setState(
        {
          receiverAccount: "Select Receiver Account",
          receiverName: selectedValue,
        },
        () => {
          this.props.data.onUserSelect("receiverName", selectedValue);
          this.props.data.onUserSelect("receiverAccount", "All");
        },
      );
    } else if (fieldName === "receiverAccount") {
      this.setState(
        {
          receiverAccount: selectedValue,
        },
        () => {
          this.props.data.onUserSelect("receiverAccount", selectedValue);
        },
      );
    } else if (fieldName === "userList") {
      this.setState(
        {
          selectUser: selectedValue,
        },
        () => {
          this.props.data.onUserSelect("userList", selectedValue);
        },
      );
    } else if (fieldName === "selectedEntityList") {
      this.setState(
        {
          entityFilter: selectedValue,
        },
        () => {
          this.props.data.onUserSelect(
            "selectedEntityList",
            selectedValue,
            selectedId,
          );
        },
      );
    } else if (fieldName === "historyModuleFilter") {
      this.setState(
        {
          actionType: selectedValue,
        },
        () => {
          this.props.data.onUserSelect("historyModuleFilter", selectedValue);
        },
      );
    }else if (fieldName === "historyStatus") {
      this.setState(
        {
          historyStatus: selectedValue,
        },
        () => {
          this.props.data.onUserSelect("historyStatus", selectedValue);
        },
      );
    }
    if (fieldName === "CSV") {
      this.setState({
        downloadExcelCSV: true,
      });
      this.props.data.selectedFormat(fieldName);
      return;
    }
    if (fieldName === "Excel") {
      this.setState({
        downloadExcelCSV: true,
      });
      this.props.data.selectedFormat(fieldName);
      return;
    }
  };

  handleChangeFilter = (fieldName, selectedValue, selectedId) => {
    if (selectedValue === "all") {
      this.setState.statusFilter = "Status";
      this.setState.requestTypeFilter = "Request Type";
    }
    if (fieldName === "statusFilter") {
      this.setState(
        {
          statusFilter: selectedValue,
        },
        () => {
          this.props.data?.handleChangeFilter(
            "statusFilter",
            selectedValue.toLowerCase(),
          );
        },
      );
    } else if (fieldName === "statusFilterPenSub") {
      this.setState(
        {
          statusFilterPenSub: selectedValue,
        },
        () => {
          this.props.data?.handleChangeFilter(
            "statusFilterPenSub",
            selectedValue.toLowerCase(),
          );
        },
      );
    } else if (fieldName === "requestTypeFilter") {
      this.setState(
        {
          requestTypeFilter: selectedValue,
        },
        () => {
          this.props.data?.handleChangeFilter(
            "requestTypeFilter",
            selectedValue,
          );
        },
      );
    }
  };

  handleFilter = (e) => {
    this.setState({ filterModel: true });
  };

  dateFormate = (date) => {
    var t = new Date(date * 1000);
    date =
      ("0" + t.getDate()).slice(-2) +
      "/" +
      ("0" + (t.getMonth() + 1)).slice(-2) +
      "/" +
      t.getFullYear();
    return date;
  };

  renderDatePicker = () => {
    return (
      <>
        <DatePicker
          onSelect={(startDate) => {
            this.handleDateFilter(startDate, "startDate", this.state.endDate);
          }}
          disabledDate={this.disabledFutureDate}
          value={this.state.startDate}
          format="DD-MM-YYYY HH:mm:ss A"
          showTime={{
            format: "HH:mm:ss",
            defaultValue: moment("00:00:00", "HH:mm:ss"),
          }}
          clearIcon={false}
        />
        <Typography.Text strong style={{ margin: "0px 5px" }}>
          to
        </Typography.Text>
        <DatePicker
          onSelect={(endDate) => {
            let autoSelectDate;
            if (
              this.state.endDate &&
              this.isToday(this.state.endDate) &&
              !this.isToday(new Date(endDate))
            ) {
              autoSelectDate = new Date(endDate);
              autoSelectDate.setHours(23, 59, 59); // Set time to 23:59:59
            } else {
              autoSelectDate = new Date(endDate);
            }
            this.handleDateFilter(endDate, "endDate", autoSelectDate);
          }}
          format="DD-MM-YYYY HH:mm:ss A"
          disabled={!this.state.startDate}
          disabledDate={this.disabledFutureDate}
          value={
            this.state.endDate
              ? moment(this.state.endDate) // Use moment to clone the date
              : null
          }
          showTime={{ format: "HH:mm:ss" }}
          clearIcon={false}
        />
      </>
    );
  };

  isToday = (someDate) => {
    const today = new Date();

    // Ensure someDate is a Date object
    if (!(someDate instanceof Date)) {
      return false;
    }

    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  handleDateFilter = (date, selectedType, selectedDate) => {
    const { advanceSearch, userWebsiteReport, autoSelectEndDate } =
      this.props.data;
    let startDate;
    let endDate;
    if (date !== null) {
      if (selectedType === "startDate") {
        startDate = new Date(date);
        this.setState({
          startDate: moment(date),
        });
      }
      if (selectedType === "endDate") {
        endDate = new Date(date);

        // if date is not Today
        if (
          this.state.endDate &&
          this.isToday(this.state.endDate) &&
          !this.isToday(endDate)
        ) {
          endDate.setHours(23, 59, 59);
        }
        this.setState({
          endDate: endDate,
        });
      }
      if (advanceSearch) {
        this.handleAdvanceSearch(
          date,
          selectedType,
          selectedDate,
          autoSelectEndDate,
        );
      } else if (userWebsiteReport) {
        this.handleWebsiteReport(date, selectedType, selectedDate);
      } else {
        this.handleDefaultFilter(date, selectedType, selectedDate);
      }
    } else {
      this.resetDates();
    }
  };

  // ----------------- ADVANCE SEARCH ----------------- //

  handleAdvanceSearch = (
    date,
    selectedType,
    selectedDate,
    autoSelectEndDate,
  ) => {
    if (autoSelectEndDate) {
      this.handleAutoSelectEndDate(date, selectedType, selectedDate);
    } else {
      this.handleManualEndDate(date, selectedType, selectedDate);
    }
  };

  setStartDate = (date) => {
    this.setState({
      startDate: new Date(date),
      date: date,
    });
  };

  setEndDate = (date) => {
    const endDate = new Date(date);
    if (
      this.state.endDate &&
      this.isToday(this.state.endDate) &&
      !this.isToday(endDate)
    ) {
      endDate.setHours(23, 59, 59); // Set time to 23:59:59 if not today
    }

    this.setState({
      endDate: endDate,
    });
  };

  handleAutoSelectEndDate = (date, selectedType, selectedDate) => {
    if (selectedType === "endDate") {
      this.setReportDateFilter(this.state.startDate, selectedDate);
      this.setEndDate(selectedDate);
    } else {
      const availableEndDate = this.state.endDate
        ? new Date(this.state.endDate)
        : new Date();
      this.setReportDateFilter(date, availableEndDate);
      this.setEndDate(availableEndDate);
    }
  };

  handleManualEndDate = (date, selectedType, selectedDate) => {
    if (selectedType === "endDate") {
      this.setReportDateFilter(this.state.startDate, selectedDate);
      this.setEndDate(selectedDate);
    } else {
      this.setReportDateFilter(date, this.state.endDate);
      this.setEndDate(this.state.endDate);
    }
  };

  // ----------------- WEBSITE REPORT ----------------- //

  handleWebsiteReport = (date, selectedType, selectedDate) => {
    if (selectedType === "endDate") {
      this.setReportDateFilter(this.state.startDate, selectedDate);
      this.setEndDate(selectedDate);
    } else {
      this.setReportDateFilter(date, this.state.endDate);
      this.setEndDate(this.state.endDate);
    }
  };

  // ----------------- DEFAULT FILTER ----------------- //

  handleDefaultFilter = (date, selectedType, selectedDate) => {
    if (selectedType === "endDate") {
      this.setDateFilter(this.state.startDate, selectedDate);
      this.setEndDate(selectedDate);
    } else {
      const availableEndDate = this.state.endDate
        ? new Date(this.state.endDate)
        : new Date();
      this.setDateFilter(date, availableEndDate);
      this.setEndDate(availableEndDate);
    }
  };

  setReportDateFilter = (startDate, endDate) => {
    this.props.data.reportDateFilter(new Date(startDate), new Date(endDate));
  };

  setDateFilter = (startDate, endDate) => {
    this.props.data.dateFilter(new Date(startDate), new Date(endDate));
  };

  resetDates = () => {
    const startDate = null;
    const endDate = null;

    if (this.props.data.advanceSearch || this.props.data.websiteReport) {
      this.props.data.reportDateFilter(startDate, endDate);
    } else {
      this.props.data.dateFilter(startDate, endDate);
    }

    this.setState({
      startDate: null,
      endDate: null,
      date: null,
    });
  };

  disabledFutureDate = (current) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to the end of today
    return current && current.toDate() > today;
  };

  currancyFormate = (data) => {
    data = data / 100;
    data = parseInt(data).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    return data;
  };

  expandedRowData = (data) => {
    return (
      <Form {...layout} name="basic">
        {this.props.data.handleExpandableData(data)}
      </Form>
    );
  };

  showModal = () => {
    this.setState({ isModalVisible: true });
  };

  handleOk = () => {
    this.setState({ isModalVisible: false });
    form.current.setFieldsValue({
      name: "",
    });
    this.props.data.handleOk();
  };

  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };

  onSearchData = (data) => {
    if (!data) {
      this.setState({
        searchData: null,
      });
      return;
    }
    if (data) {
      const searchData = data.target.value.trim();
      this.setState({
        searchData: searchData,
      });
    }
  };

  handleSwitchChange = (checked) => {
    this.setState(
      {
        isPaymentToWithWebAcc: checked,
        activeTabKey: this.props.data.activeTabKey, // Set active tab to "1" when switch changes
      },
      () => {
        this.props.data.hadleSwitchChange(checked); // Call the original handler if needed
      },
    );
  };

  handleCurrencyConversionSwitchChange = (checked) => {
    this.setState(
      {
        currencyConversionFilter: checked,
      },
      () => {
        this.props.data?.handleCurrencyConversionSwitchChange(checked);
      },
    );
  };

  handleTabChange = (key) => {
    this.setState({ activeTabKey: key });
    this.props.data.onChangePGType(key);
    if (key == 1) {
      this.props.fetchActiveTransactionTypeTab("deposit");
    } else {
      this.props.fetchActiveTransactionTypeTab("withdraw");
    }
  };

  onRefresh = () => {
    this.props.data.handleRefresh();
    this.setState({
      searchData: null,
      actionFilter: "Select Action",
      page: 1,
    });
  };

  getRowClassName = (record) => {
    if (this?.props?.data?.commissionTransactionReportTable) {
      if (
        record.transactionType === "settlement" &&
        (record.status === "completed" || record.status === "pending")
      ) {
        return "row-lime-green";
      }
      if (
        record.transactionType === "settlement" &&
        record.status === "decline"
      ) {
        return "row-light-red";
      }
    }
    // Add more conditions as needed
    return "";
  };

  depositQueueTabs = () => {
    return (
      <Tabs
        onChange={(key) => {
          this.props.data.handleTabs(key);
        }}
        defaultActiveKey="1"
        type="card"
      >
        <TabPane tab="Deposit Queue" key="1"></TabPane>
        <TabPane tab="Deposit Waiting Queue" key="2"></TabPane>
      </Tabs>
    );
  };

  setFilterState = (newState) => {
    this.setState(newState);
  };

  onReset = () => {
    this.props.data.handleReset();
    this.setState({
      selectedWebsite: "Select Website",
      selectedStatus: "Select Status",
      selectedReqType: "Select Request",
      selectedAgent: "Select Agent",
      selectedVendor: "Select Vendor",
      website: "Website Name",
      orderType: "Transaction Process",
      selectedPaymnetGateway: "Select PG",
      receiverType:
        window.location.pathname === "/withdraw/report"
          ? "Sender Type"
          : "Receiver Type",
      // date: null,
      receiverName: "Select Receiver Name",
      receiverAccount: "Select Receiver Account",
      bankProcessFilter: "Select Request Process",
      actionType: "Select Action",
      entityFilter: "Select Entity",
      selectUser: "Select User",
      historyStatus: "Select Status",
      exchangeStatusFilter: "Select Status",
      bankAccount: "Select Account",
      startDate: null,
      endDate: null,
      page: 1,
    });
    if (window.location.pathname === "/commission-summary") {
      let startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      let endOfToday = new Date();
      this.setState({
        startDate: moment(startOfToday),
        endDate: moment(endOfToday),
      });
    }
    if (window.location.pathname === "/history") {
      let startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      let endOfToday = new Date();
      this.setState({
        startDate: moment(startOfToday),
        endDate: moment(endOfToday),
      });
    }
    if (window.location.pathname === "/exchange-transactions") {
      let startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      let endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);
      this.setState({
        startDate: moment(startOfToday),
        endDate: moment(endOfToday),
      });
    }
  };

  componentDidMount() {
    localStorage.setItem("sortByV", false);
  }

  componentDidUpdate(prevProps) {
    // Check if selectedValue prop has changed
    if (
      this.props.data?.selectedValue !== prevProps.data?.selectedValue ||
      this.props.data?.selectReceiverType !== prevProps.data?.selectReceiverType
    ) {
      // console.log("selectedValue----->>>", this.props.data?.selectedValue);
      const startDate = moment(this.props.data?.startDate);
      const endDate = moment(this.props.data?.endDate);
      if (this.props.data?.selectedValue === "default") {
        this.setState({
          startDate: this.props.data?.startDate ? startDate : null,
          endDate: this.props.data?.endDate ? endDate : null,
        });
      } else {
        this.setState({
          selectedStatus: this.props.data?.selectedValue
            ? this.props.data?.selectedValue
            : this.state.selectedStatus,
          statusFilter: this.props.data?.selectedValue
            ? this.props.data?.selectedValue
            : this.state.statusFilter,
          startDate: this.props.data?.startDate ? startDate : null,
          endDate: this.props.data?.endDate ? endDate : null,
          receiverType: this.props.data?.selectReceiverType
            ? this.props.data?.selectReceiverType
            : this.state.receiverType,
          receiverName: this.props.data?.selectReceiverName
            ? this.props.data?.selectReceiverName
            : this.state.receiverName,
          receiverAccount: this.props.data?.selectReceiverAccount
            ? this.props.data?.selectReceiverAccount
            : this.state.receiverAccount,
        });
      }
      // Perform any additional actions or logic based on the new selectedValue
    }
    if (window.location.pathname !== "/payment-gateway") {
      this.props.fetchActiveTransactionTypeTab("deposit");
    }
  }
  componentWillUnmount() {
    localStorage.removeItem("status");
    localStorage.removeItem("startDate");
    localStorage.removeItem("endDate");
    localStorage.removeItem("receiverType");
  }

  render() {
    const { paginationData, isButtonEnabled, bankAccount } = this.props;

    const {
      withdrawAmount,
      depositAmount,
      withdraw,
      deposit,
      avgTimeDifference,
      websiteList,
      website,
      totalFromAmount,
      totalSenderAmount,
      transactionReport,
      advanceSearch,
      dateFilter,
      reqType,
      filterButton,
      filterButtonDepositeQueue,
      userWebSelect,
      transactionListFilter,
      userWebsiteReport,
      advanceFilterVisible,
      showSenderAndReceiverName,
    } = this.props.data;

    const calculateAmounts = (totalFromAmount, totalSenderAmount) => {
      const fromAmount = parseFloat(totalFromAmount || 0);
      const senderAmount = parseFloat(totalSenderAmount || 0);
      const totalCommissionAmount = fromAmount - senderAmount;
      const totalAmountFormatted = totalCommissionAmount.toFixed(2);
      const totalCommissionAmountColor =
        totalCommissionAmount < 0 ? "red" : "green";

      return {
        fromAmount: fromAmount.toFixed(2),
        senderAmount: senderAmount.toFixed(2),
        totalCommissionAmount: `${totalAmountFormatted}`,
        totalCommissionAmountColor,
      };
    };

    const { totalCommissionAmount, totalCommissionAmountColor } =
      calculateAmounts(totalFromAmount, totalSenderAmount);

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.onSelectionChange(selectedRowKeys, selectedRows);
      },
    };

    const rowClass = this.props.data.removeRowPadding ? "table-rows" : "";

    if (this.state.buttonAction) {
      this.onSelectionChange(
        this.state.selectedRowKeys,
        this.state.selectedRows,
      );
    }

    return (
      <div>
        {this.props.data.depositQueueTab ? (
          this.depositQueueTabs()
        ) : (
          <h1 style={{ color: "#636363", display: "flex" }}>
            {this.props.data.title}
          </h1>
        )}

        {advanceFilterVisible && (
          <AdvanceFilter
            receiverNameList={this.props.data.receiverNameList}
            senderNameList={this.props.data.senderNameList}
            handleChangeFilter={this.props.data.handleChangeFilter}
            onReset={this?.onReset}
            handleSearch={() => this.props.data.handleSearch()}
            commissionDateFilter={this.props.data.commissionDateFilter}
            extraFilterShow={this.props.data.extraFilterShow}
            actionAndTransactionFilterShow={
              this.props.data.actionAndTransactionFilterShow
            }
            disabledFutureDate={this.disabledFutureDate}
            commissionDateSelector={this.props?.data?.commissionDateFilter}
            showSenderAndReceiverName={showSenderAndReceiverName}
            page={this.state.page}
            setFilterState={this.setFilterState}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
        )}
        <div>
          {advanceSearch ||
          dateFilter ||
          reqType ||
          filterButton ||
          filterButtonDepositeQueue ||
          userWebsiteReport ||
          transactionListFilter ||
          userWebSelect ? (
            <div
              style={{
                background: "white",
                padding: transactionReport ? "0px 10px" : "10px 20px",
                margin: "10px 0",
                borderRadius: "10px",
              }}
            >
              {this.props.data?.advanceSearch ? (
                <>
                  <Collapse
                    style={{ background: "none", border: "none" }}
                    header="Advance Search"
                    expandIconPosition="end"
                    defaultActiveKey={["1"]}
                  >
                    <Panel
                      header="Advance Search"
                      key="0"
                      style={{
                        border: "none",
                        justifyContent: "end",
                      }}
                    >
                      <Row gutter={[40, 16]} style={{ marginLeft: "10px" }}>
                        <Col>
                          <UserDropdown
                            formStyle={{ margin: "0" }}
                            initialValue={this.state.selectedVendor}
                            placeholder={"Select Vendor"}
                            display={true}
                            list={this.props.data?.vendorList}
                            width={200}
                            onChange={(selectedValue, selectedId) => {
                              this.onUserSelect(
                                "vendor",
                                selectedValue,
                                selectedId,
                              );
                              this.setState({
                                page: 1,
                                bankAccount: "Select Account",
                              });
                            }}
                          />
                        </Col>
                        <Col>
                          <UserDropdown
                            formStyle={{ margin: "0" }}
                            initialValue={this.state.selectedAgent}
                            placeholder={"Select Agent"}
                            display={true}
                            list={this.props.data?.agentList}
                            width={200}
                            onChange={(selectedValue, selectedId) => {
                              this.onUserSelect(
                                "agent",
                                selectedValue,
                                selectedId,
                              );
                              this.setState({
                                page: 1,
                                bankAccount: "Select Account",
                              });
                            }}
                          />
                        </Col>
                        <Col>
                          <UserDropdown
                            formStyle={{ margin: "0" }}
                            initialValue={this.state?.selectedWebsite}
                            placeholder={"Select Website"}
                            display={true}
                            list={websiteList}
                            width={200}
                            onChange={(selectedValue, selectedId) => {
                              this.onUserSelect(
                                "website",
                                selectedValue,
                                selectedId,
                              );
                              this.setState({
                                page: 1,
                                bankAccount: "Select Account",
                              });
                            }}
                          />
                        </Col>
                        <Col>
                          <UserDropdown
                            formStyle={{ margin: "0" }}
                            initialValue={this.state.receiverType}
                            // placeholder={"Receiver Type"}
                            display={true}
                            list={this.props.data?.reqTypeData}
                            type="receiver"
                            width={170}
                            onChange={(selectedValue) => {
                              this.onUserSelect("receiverType", selectedValue);
                              this.setState({
                                page: 1,
                              });
                            }}
                          />
                        </Col>
                        <Col>
                          <UserDropdown
                            formStyle={{ margin: "0" }}
                            showSearch={true}
                            initialValue={this.state.selectedReqType}
                            placeholder={"Select Request Type"}
                            display={true}
                            list={this.props.data?.reqTypeData}
                            type="reqType"
                            width={170}
                            onChange={(selectedValue) => {
                              this.onUserSelect("reqType", selectedValue);
                              this.setState({
                                page: 1,
                                bankAccount: "Select Account",
                              });
                            }}
                          />
                        </Col>
                        {this.props.data.bankProcessFilterVisible && (
                          <Col>
                            <UserDropdown
                              formStyle={{ margin: "0" }}
                              initialValue={this.state.bankProcessFilter}
                              display={true}
                              width={190}
                              reportList={
                                window.location.pathname === "/deposit/report"
                                  ? true
                                  : false
                              }
                              type="bankProcessFilter"
                              onChange={(selectedValue) => {
                                this.onUserSelect(
                                  "bankProcessFilter",
                                  selectedValue,
                                );
                                this.setState({ page: 1 });
                              }}
                            />
                          </Col>
                        )}
                        {this.props.data.paymentData && (
                          <Col>
                            <PaymentUserDropdown
                              formStyle={{ margin: "0" }}
                              showSearch={true}
                              initialValue={this.state.selectedPaymnetGateway}
                              display={true}
                              list={this.props.data?.paymentData}
                              width={170}
                              onChange={(selectedValue, selectedId) => {
                                this.onUserSelect(
                                  "paymentGateway",
                                  selectedValue,
                                  selectedId,
                                );
                                this.setState({
                                  page: 1,
                                });
                              }}
                            />
                          </Col>
                        )}
                        {this.props.data.orderFilter ? (
                          <Col>
                            <UserDropdown
                              formStyle={{ margin: "0" }}
                              showSearch={true}
                              initialValue={this.state.orderType}
                              field={this.props.form}
                              display={true}
                              type="orderType"
                              download={
                                window.location.pathname === "/withdraw/queue"
                                  ? true
                                  : false
                              }
                              onChange={(selectedValue) => {
                                this.props.data?.onUserSelect(
                                  "orderType",
                                  selectedValue,
                                );
                                this.setState({
                                  orderType: selectedValue,
                                  page: 1,
                                });
                              }}
                              width={200}
                            />
                          </Col>
                        ) : null}
                        <Col>
                          <UserDropdown
                            formStyle={{ margin: "0" }}
                            showSearch={true}
                            initialValue={this.state.bankAccount}
                            list={bankAccount}
                            display={true}
                            download={true}
                            multipleNameShow={true}
                            onChange={(selectedValue, id) => {
                              this.props.data?.onAccountSelect(id);
                              this.setState({
                                bankAccount: selectedValue,
                                page: 1,
                              });
                            }}
                            width={200}
                          />
                        </Col>
                      </Row>
                    </Panel>
                  </Collapse>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "start",
                      marginTop: "20px",
                    }}
                  >
                    {this.props.data.reportDateFilter ? (
                      <div
                        style={{
                          margin: "0px 0px 20px",
                          display: "flex",
                        }}
                      >
                        {this.renderDatePicker()}
                      </div>
                    ) : null}

                    {this.props.data.filterButtonDepositeQueue ? (
                      <div style={{ margin: "0 20px" }}>
                        <UserDropdown
                          showSearch={true}
                          initialValue={this.state.statusFilter}
                          display={true}
                          list={this.props.data.filterButtonDepositeQueue}
                          onChange={(
                            selectedName,
                            selectedId,
                            selectedValue,
                          ) => {
                            this.props.data?.handleChangeFilter(
                              "statusFilterPenSub",
                              selectedName,
                              selectedId,
                              selectedValue,
                            );
                            this.setState({
                              statusFilter: selectedName,
                              page: 1,
                            });
                          }}
                          width={200}
                        />
                      </div>
                    ) : null}
                    {window.location.pathname === "/deposit/queue" ||
                    window.location.pathname === "/withdraw/queue" ||
                    window.location.pathname === "/deposit-auto-queue" ||
                    window.location.pathname ===
                      "/deposit-verification-queue" ||
                    window.location.pathname ===
                      "/withdraw-pending-report" ? null : (
                      <div style={{ margin: "0 25px" }}>
                        <UserDropdown
                          showSearch={true}
                          initialValue={this.state.selectedStatus}
                          placeholder={"Select Status"}
                          display={true}
                          list={this.props.data?.statusData}
                          type="status"
                          width={170}
                          onChange={(selectedValue, selectedId) => {
                            this.onUserSelect(
                              "status",
                              selectedValue,
                              selectedId,
                            );
                            this.setState({ page: 1 });
                          }}
                        />
                      </div>
                    )}

                    <div style={{ margin: "0 20px" }}>
                      <UserDropdown
                        initialValue={this.state.website}
                        placeholder={"Select Website Type"}
                        display={true}
                        list={this.props.data?.allWebsiteList}
                        type="allWebsiteList"
                        width={170}
                        onChange={(selectedValue, selectedId) => {
                          this.onUserSelect(
                            "allWebsiteList",
                            selectedValue,
                            selectedId,
                          );
                          this.setState({ page: 1 });
                        }}
                      />
                    </div>
                    <div style={{ margin: "0px 10px" }}>
                      <Button
                        style={{
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                        onClick={() => {
                          this.props.data.handleSearchEvent("search");
                        }}
                      >
                        Search
                      </Button>
                    </div>
                    <div>
                      <Button
                        // style={{ width: "65px" }}
                        type="primary"
                        onClick={() => {
                          this.props.data.onUserSelect("reset");
                          this.onReset();
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </>
              ) : null}

              {this.props.data?.transactionListFilter ? (
                <>
                  <Row gutter={[24, 24]}>
                    <Col>
                      <UserDropdown
                        formStyle={{ margin: "0 10px" }}
                        initialValue={this.state.selectedStatus}
                        placeholder={"Select Status"}
                        display={true}
                        list={this.props.data?.statusData}
                        type="transaction-status"
                        onChange={(selectedValue) => {
                          this.onUserSelect("status", selectedValue);
                          this.setState({ page: 1 });
                        }}
                        width={200}
                      />
                    </Col>
                    <Col>
                      <UserDropdown
                        formStyle={{ margin: "0 10px" }}
                        initialValue={this.state.receiverType}
                        placeholder={"Receiver Type"}
                        display={true}
                        list={this.props.data?.reqTypeData}
                        type="receiver"
                        width={170}
                        onChange={(selectedValue) => {
                          this.onUserSelect("receiverType", selectedValue);
                          this.setState({
                            page: 1,
                          });
                        }}
                      />
                    </Col>
                    <Col>
                      <UserDropdown
                        formStyle={{ margin: "0 10px" }}
                        initialValue={this.state.receiverName}
                        placeholder={"Receiver Name"}
                        display={true}
                        list={this.props?.data?.receiverNames}
                        width={200}
                        type="receiverName"
                        onChange={(selectedValue, selectedId) => {
                          this.onUserSelect("receiverName", selectedValue);
                          this.setState({
                            page: 1,
                          });
                        }}
                      />
                    </Col>
                    <Col>
                      <UserDropdown
                        formStyle={{ margin: "0 10px" }}
                        initialValue={this.state.receiverAccount}
                        placeholder={"Receiver Account"}
                        display={true}
                        list={this.props.data?.selectReceiverAccounts}
                        type="receiverAccount"
                        width={200}
                        onChange={(selectedValue) => {
                          this.onUserSelect("receiverAccount", selectedValue);
                          this.setState({
                            page: 1,
                          });
                        }}
                      />
                    </Col>
                    <div style={{ margin: "0px 10px" }}>
                      <Button
                        style={{
                          width: "80px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                        onClick={() => {
                          this.props.data.handleSearchEvent("search");
                        }}
                      >
                        Search
                      </Button>
                    </div>
                    <div style={{ cursor: "pointer" }}>
                      <Button
                        style={{ width: "65px" }}
                        onClick={() => {
                          this.props.data.onUserSelect("reset");
                          this.onReset();
                        }}
                        type="primary"
                      >
                        Reset
                      </Button>
                    </div>
                  </Row>
                </>
              ) : null}

              {this.props.data.userWebsiteReport ? (
                <Collapse
                  style={{ background: "none", border: "none" }}
                  header="Advance Search"
                  expandIconPosition="end"
                  defaultActiveKey={["1"]}
                >
                  <Panel
                    header="Advance Search"
                    key="1"
                    style={{
                      border: "none",
                      marginTop: "10px",
                      justifyContent: "end",
                      marginBottom: "-15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "start",
                      }}
                    >
                      {this.props.data.reportDateFilter ? (
                        <div
                          style={{
                            margin: "0 10px",
                            marginBottom: "10px",
                          }}
                        >
                          {this.renderDatePicker()}
                        </div>
                      ) : null}
                      {this.props.data.websiteFilter && (
                        <UserDropdown
                          formStyle={{ margin: "0 20px" }}
                          showSearch={true}
                          initialValue={this.state?.selectedWebsite}
                          placeholder={"Select Website"}
                          display={true}
                          list={websiteList}
                          width={200}
                          onChange={(selectedValue, selectedId) => {
                            this.onUserSelect(
                              "website",
                              selectedValue,
                              selectedId,
                            );
                            this.setState({ page: 1 });
                          }}
                        />
                      )}
                      {this.props.data.exchangeStatusFilter && (
                        <UserDropdown
                          formStyle={{ margin: "0 20px" }}
                          showSearch={true}
                          initialValue={this.state.exchangeStatusFilter}
                          placeholder={"Select Status"}
                          display={true}
                          type="exchangeFilter"
                          width={150}
                          onChange={(selectedValue) => {
                            this.onUserSelect(
                              "exchangeStatusFilter",
                              selectedValue,
                            );
                            this.setState({ page: 1 });
                          }}
                        />
                      )}
                      {this.props.data.exchangeRequestTypeFilter && (
                        <UserDropdown
                          formStyle={{ margin: "0 20px" }}
                          showSearch={true}
                          initialValue={this.state.selectedReqType}
                          placeholder={"Select Request Type"}
                          display={true}
                          type="exchangeRequestTypeFilter"
                          width={150}
                          onChange={(selectedValue) => {
                            this.onUserSelect("reqType", selectedValue);
                            this.setState({ page: 1 });
                          }}
                        />
                      )}

                      {this.props.data.paymentData && (
                        <div style={{ margin: "0 20px" }}>
                          <PaymentUserDropdown
                            showSearch={true}
                            initialValue={this.state.selectedPaymnetGateway}
                            display={true}
                            list={this.props.data?.paymentData}
                            width={150}
                            onChange={(selectedValue, selectedId) => {
                              this.onUserSelect(
                                "paymentGateway",
                                selectedValue,
                                selectedId,
                              );
                              this.setState({ page: 1 });
                            }}
                          />
                        </div>
                      )}
                      {this.props.data.historyFilter && (
                        <>
                          <UserDropdown
                            formStyle={{ margin: "0 20px" }}
                            showSearch={true}
                            initialValue={this.state.selectUser}
                            display={true}
                            width={130}
                            type="userList"
                            onChange={(selectedValue) => {
                              this.onUserSelect("userList", selectedValue);
                              this.setState({ page: 1 });
                            }}
                          />
                          <UserDropdown
                            formStyle={{ margin: "0 20px" }}
                            showSearch={true}
                            initialValue={this.state.entityFilter}
                            display={true}
                            list={this.props.data?.entityList}
                            width={150}
                            onChange={(selectedValue, selectedId) => {
                              this.onUserSelect(
                                "selectedEntityList",
                                selectedValue,
                                selectedId,
                              );
                              this.setState({ page: 1 });
                            }}
                          />
                          <UserDropdown
                            formStyle={{ margin: "0 20px" }}
                            showSearch={true}
                            initialValue={this.state.actionType}
                            display={true}
                            width={140}
                            type="historyModuleFilter"
                            onChange={(selectedValue) => {
                              this.onUserSelect("historyModuleFilter", selectedValue);
                              this.setState({ page: 1 });
                            }}
                          />
                          <UserDropdown
                            formStyle={{ margin: "0 20px" }}
                            showSearch={true}
                            initialValue={this.state.historyStatus}
                            display={true}
                            width={140}
                            type="historyStatus"
                            onChange={(selectedValue) => {
                              this.onUserSelect("historyStatus", selectedValue);
                              this.setState({ page: 1 });
                            }}
                          />
                        </>
                      )}
                      <div style={{ margin: "0px 10px" }}>
                        <Button
                          style={{
                            width: "70px",
                            backgroundColor: "green",
                            color: "#fff",
                          }}
                          onClick={() => {
                            this.props.data.handleSearchEvent("search");
                          }}
                          // type="primary"
                        >
                          Search
                        </Button>
                      </div>
                      <div style={{ cursor: "pointer" }}>
                        <Button
                          style={{ width: "65px" }}
                          onClick={() => {
                            this.props.data.onUserSelect("reset");
                            this.onReset();
                          }}
                          type="primary"
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              ) : null}
              <Form
                style={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <div>
                  <Row gutter={[24, 24]} justify={"end"}>
                    {this.props.data.dateFilter && (
                      <Col>{this.renderDatePicker()}</Col>
                    )}
                    {this.props.data.transactionFilter ? (
                      <Col>
                        <UserDropdown
                          formStyle={{ margin: "0 15px" }}
                          showSearch={true}
                          initialValue={this.state.transactionTypeFilter}
                          placeholder={"Select"}
                          field={this.props.form}
                          display={true}
                          list={this.props.data?.transactionFilter}
                          onChange={(selectedValue) => {
                            this.props.data?.handleChangeFilter(
                              "transactionFilter",
                              selectedValue,
                            );
                            this.setState({
                              transactionTypeFilter: selectedValue,
                              page: 1,
                            });
                          }}
                          width={200}
                        />
                      </Col>
                    ) : null}
                    {this.props.data.receiverFilter ? (
                      <Col>
                        <UserDropdown
                          showSearch={true}
                          initialValue={this.state.receiverType}
                          placeholder={"Select"}
                          field={this.props.form}
                          display={true}
                          list={this.props.data.receiverFilter}
                          onChange={(selectedValue) => {
                            this.props.data?.handleChangeFilter(
                              "receiverFilter",
                              selectedValue,
                            );
                            this.setState({
                              receiverType: selectedValue,
                              page: 1,
                            });
                          }}
                          width={200}
                        />
                      </Col>
                    ) : null}
                  </Row>
                </div>
              </Form>
            </div>
          ) : (
            <></>
          )}
        </div>
        {(withdrawAmount || depositAmount || avgTimeDifference) && (
          <div
            className="gx-p-4 gx-my-0 gx-my-2"
            style={{
              background: "white",
              borderRadius: "10px",
              display: "flex",
            }}
          >
            {withdrawAmount || depositAmount ? (
              <div>
                <Typography.Text style={{ paddingLeft: "15px" }}>
                  {withdrawAmount
                    ? `Withdraw Amount : ${
                        withdrawAmount === undefined || null
                          ? "00"
                          : withdrawAmount
                      }`
                    : `Deposit Amount : ${
                        depositAmount === undefined || null
                          ? "00"
                          : depositAmount
                      }`}
                </Typography.Text>
              </div>
            ) : null}
            {avgTimeDifference || avgTimeDifference === 0 ? (
              <div style={{ paddingLeft: "15px" }}>
                <Typography.Text>
                  Avg Time : {MillisecondsToTime(avgTimeDifference) || "00"}
                </Typography.Text>
              </div>
            ) : null}
          </div>
        )}
        {withdraw !== undefined || deposit !== undefined ? (
          <div
            className="gx-p-4 gx-my-0 gx-my-2"
            style={{
              background: "white",
              borderRadius: "10px",
            }}
          >
            <div>
              <Typography.Text style={{ paddingLeft: "15px" }}>
                {deposit ? `Deposit: ${deposit.toFixed(2)}` : "Deposit: 00"}
              </Typography.Text>
              <Typography.Text style={{ paddingLeft: "15px" }}>
                {withdraw ? `Withdraw: ${withdraw.toFixed(2)}` : "Withdraw: 00"}
              </Typography.Text>
              <Typography.Text style={{ paddingLeft: "15px" }}>
                {withdraw || deposit
                  ? `DMW: ${(deposit - withdraw).toFixed(2)}`
                  : "DMW: 00"}
              </Typography.Text>
            </div>
          </div>
        ) : null}
        {totalFromAmount !== undefined || totalSenderAmount !== undefined ? (
          <Card style={{ padding: "10px", marginBottom: "10px" }}>
            <div>
              <Typography.Text style={{ paddingLeft: "15px" }}>
                Receivable :
              </Typography.Text>
              <Typography.Text style={{ paddingLeft: "15px", color: "green" }}>
                {totalFromAmount || "00"}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text style={{ paddingLeft: "15px" }}>
                Payable :
              </Typography.Text>
              <Typography.Text style={{ paddingLeft: "15px", color: "red" }}>
                {totalSenderAmount || "00"}
              </Typography.Text>
            </div>
            <div>
              <Typography.Text style={{ paddingLeft: "15px" }}>
                Total :
              </Typography.Text>
              <Typography.Text
                style={{
                  paddingLeft: "15px",
                  color: totalCommissionAmountColor,
                }}
              >
                {totalCommissionAmount}
              </Typography.Text>
            </div>
          </Card>
        ) : null}

        <Card
          title={
            !this.props.data.setting && (
              <div className="table-header">
                <div>
                  <p style={{ margin: 0 }}>
                    Total Results:{" "}
                    {this.state.filterData
                      ? this.state.filterData.length
                      : this.props?.data?.totalResults || 0}
                  </p>
                  {this.props.data.pgTable && (
                    <Tabs
                      style={{
                        marginBottom: "-32px",
                      }}
                      defaultActiveKey="1"
                      activeKey={this.state.activeTabKey}
                      onChange={this.handleTabChange}
                    >
                      <TabPane tab="Deposit" key="1" />
                      <TabPane tab="Withdraw" key="2" />
                    </Tabs>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {this.props.data?.isSort && (
                    <div style={{ marginRight: "15px" }}>
                      <Form.Item
                        style={{ margin: "0px" }}
                        label={<div style={{ fontSize: "18px" }}>Date</div>}
                        name="sortBy"
                      >
                        <div onClick={this.props?.data?.handleChangeSortBy}>
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 512 512"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M36.8638 328.656C33.8171 331.61 32.0684 335.652 32.0024 339.895C31.9364 344.138 33.5585 348.233 36.5118 351.28L98.0478 414.704C99.531 416.254 101.313 417.488 103.286 418.331C105.259 419.174 107.382 419.609 109.528 419.609C111.673 419.609 113.797 419.174 115.77 418.331C117.743 417.488 119.525 416.254 121.008 414.704L182.56 351.28C184.091 349.787 185.308 348.002 186.137 346.031C186.967 344.06 187.393 341.942 187.39 339.804C187.388 337.665 186.956 335.549 186.122 333.579C185.287 331.61 184.066 329.829 182.531 328.339C180.996 326.85 179.178 325.684 177.184 324.91C175.19 324.135 173.062 323.768 170.924 323.831C168.786 323.893 166.683 324.383 164.738 325.273C162.793 326.162 161.046 327.432 159.6 329.008L125.52 364.112V108.368C125.52 104.125 123.834 100.055 120.834 97.0545C117.833 94.0539 113.763 92.3682 109.52 92.3682C105.276 92.3682 101.207 94.0539 98.2061 97.0545C95.2055 100.055 93.5198 104.125 93.5198 108.368V364.096L59.4878 329.008C56.5343 325.961 52.4915 324.213 48.2487 324.147C44.0059 324.081 39.9107 325.703 36.8638 328.656ZM430.08 206.768C430.08 202.525 428.394 198.455 425.394 195.454C422.393 192.454 418.323 190.768 414.08 190.768H240.448C236.204 190.768 232.135 192.454 229.134 195.454C226.134 198.455 224.448 202.525 224.448 206.768C224.448 211.012 226.134 215.081 229.134 218.082C232.135 221.082 236.204 222.768 240.448 222.768H414.08C418.323 222.768 422.393 221.082 425.394 218.082C428.394 215.081 430.08 211.012 430.08 206.768ZM380.16 305.168C380.16 300.925 378.474 296.855 375.474 293.854C372.473 290.854 368.403 289.168 364.16 289.168H240.448C236.204 289.168 232.135 290.854 229.134 293.854C226.134 296.855 224.448 300.925 224.448 305.168C224.448 309.412 226.134 313.481 229.134 316.482C232.135 319.482 236.204 321.168 240.448 321.168H364.16C368.403 321.168 372.473 319.482 375.474 316.482C378.474 313.481 380.16 309.412 380.16 305.168ZM240.448 387.632C236.204 387.632 232.135 389.318 229.134 392.318C226.134 395.319 224.448 399.389 224.448 403.632C224.448 407.876 226.134 411.945 229.134 414.946C232.135 417.946 236.204 419.632 240.448 419.632H314.24C318.483 419.632 322.553 417.946 325.554 414.946C328.554 411.945 330.24 407.876 330.24 403.632C330.24 399.389 328.554 395.319 325.554 392.318C322.553 389.318 318.483 387.632 314.24 387.632H240.448ZM464 92.3682H240.448C236.204 92.3682 232.135 94.0539 229.134 97.0545C226.134 100.055 224.448 104.125 224.448 108.368C224.448 112.612 226.134 116.681 229.134 119.682C232.135 122.682 236.204 124.368 240.448 124.368H464C468.243 124.368 472.313 122.682 475.314 119.682C478.314 116.681 480 112.612 480 108.368C480 104.125 478.314 100.055 475.314 97.0545C472.313 94.0539 468.243 92.3682 464 92.3682Z"
                              fill={
                                this.props.data?.sortBy == true
                                  ? "#000"
                                  : "#ced4da"
                              }
                            />
                          </svg>
                        </div>
                      </Form.Item>
                    </div>
                  )}
                  {this.state.currencyConversionFilterToggle && (
                    <div style={{ marginLeft: "25px", marginRight: "15px" }}>
                      <Form.Item
                        style={{ margin: "0px" }}
                        label={
                          <div style={{ fontSize: "18px" }}>Other Currency</div>
                        }
                        name="currencyConversionFilter"
                      >
                        <Switch
                          name="currencyConversionFilter"
                          key="currencyConversionFilter"
                          onChange={this.handleCurrencyConversionSwitchChange}
                          checked={this.state.currencyConversionFilter}
                        />
                      </Form.Item>
                    </div>
                  )}
                  {this.props.data?.isActive ? (
                    <div style={{ marginRight: "15px" }}>
                      <Form.Item
                        style={{ margin: "0px" }}
                        label={
                          <div style={{ fontSize: "18px" }}>
                            {this.state.isPaymentToWithWebAcc
                              ? "Active"
                              : "InActive"}
                          </div>
                        }
                        name="isPaymentToWithWebAcc"
                      >
                        <Switch
                          name="isPaymentToWithWebAcc"
                          key="isPaymentToWithWebAcc"
                          onChange={this.handleSwitchChange}
                          checked={this.state.isPaymentToWithWebAcc}
                        />
                      </Form.Item>
                    </div>
                  ) : null}
                  {this.props.data.handleRefresh ? (
                    <Tooltip title="Refresh">
                      <ReloadOutlined
                        name="CSV"
                        style={{
                          fontSize: "25px",
                          margin: "0px 10px",
                        }}
                        onClick={this.onRefresh}
                      />
                    </Tooltip>
                  ) : null}

                  {this.props.data.requestType ? (
                    <UserDropdown
                      formStyle={{ margin: "0 25px" }}
                      showSearch={true}
                      initialValue={this.state.requestType}
                      placeholder={"Select"}
                      field={this.props.form}
                      display={true}
                      list={this.props.data?.requestType}
                      onChange={(selectedValue) => {
                        this.props.data?.handleChangeFilter(
                          "requestType",
                          selectedValue,
                        );
                        this.setState({
                          requestType: selectedValue,
                          page: 1,
                        });
                      }}
                      width={200}
                    />
                  ) : null}

                  {this.props?.data?.download ? (
                    <>
                      {isButtonEnabled ? (
                        <>
                          <Spin style={{ marginTop: "5px" }} />
                        </>
                      ) : (
                        <>
                          <Button
                            className="download-excel-button"
                            style={{ marginRight: "0px" }}
                          >
                            <Tooltip
                              title={
                                isButtonEnabled
                                  ? "Download in Progress"
                                  : "Excel File"
                              }
                            >
                              <FileExcelOutlined
                                style={{ fontSize: "25px", marginTop: "5px" }}
                                onClick={(selectedValue, selectedId) =>
                                  this.onUserSelect(
                                    "Excel",
                                    selectedValue,
                                    selectedId,
                                  )
                                }
                              />
                            </Tooltip>
                          </Button>
                          <Button className="download-excel-button">
                            <Tooltip
                              title={
                                isButtonEnabled
                                  ? "Download in Progress"
                                  : "CSV File"
                              }
                            >
                              <FileTextOutlined
                                onClick={(selectedValue, selectedId) =>
                                  this.onUserSelect(
                                    "CSV",
                                    selectedValue,
                                    selectedId,
                                  )
                                }
                                style={{
                                  fontSize: "25px",
                                  margin: "15px 10px 10px",
                                }}
                              />
                            </Tooltip>
                          </Button>
                        </>
                      )}
                    </>
                  ) : null}

                  {this.props.data.transactionTypeFilter ? (
                    <Space
                      direction="vertical"
                      style={{
                        cursor: "pointer",
                        margin: "23px 18px 0px 15px",
                      }}
                    >
                      <UserDropdown
                        showSearch={true}
                        initialValue={this.state.transactionTypeFilter}
                        placeholder={"Select"}
                        field={this.props.form}
                        display={true}
                        list={this.props.data?.transactionTypeFilter}
                        onChange={(selectedValue) => {
                          this.props.data?.handleChangeFilter(
                            "transactionTypeFilter",
                            selectedValue,
                          );
                          this.setState({
                            transactionTypeFilter: selectedValue,
                            page: 1,
                          });
                        }}
                        width={200}
                      />
                    </Space>
                  ) : null}

                  {this.props.data.receiverType ? (
                    <Space
                      direction="vertical"
                      style={{
                        cursor: "pointer",
                        margin: "23px 25px 0px 20px",
                      }}
                    >
                      <UserDropdown
                        showSearch={true}
                        initialValue={this.state.receiverType}
                        placeholder={"Select"}
                        field={this.props.form}
                        display={true}
                        list={this.props.data.receiverType}
                        onChange={(selectedValue) => {
                          this.props.data?.handleChangeFilter(
                            "receiverType",
                            selectedValue,
                          );
                          this.setState({
                            receiverType: selectedValue,
                            page: 1,
                          });
                        }}
                        width={200}
                      />
                    </Space>
                  ) : null}

                  {this.props.data.actionType ? (
                    <UserDropdown
                      formStyle={{ margin: "0", marginRight: "25px" }}
                      display={true}
                      initialValue={this.state.actionFilter}
                      type="commissionActionFilter"
                      onChange={(selectedValue) => {
                        this.props.data?.handleChangeFilter(
                          "actionFilter",
                          selectedValue,
                        );
                        this.setState({
                          actionFilter: selectedValue,
                          page: 1,
                        });
                      }}
                      width={170}
                    />
                  ) : null}

                  {/* <input type="text" placeholder="Search" style={{border:"solid lightGray 1px", padding:"10px 20px"}}/> */}
                  {this.props.data.commonSearch ? (
                    <FormItem style={{ margin: "0px", padding: "0px" }}>
                      <Input
                        placeholder={"Search"}
                        onChange={this.props.data.onSearchString}
                        onSearch={this.props.data.refresh ? "" : this.onSearch}
                        value={
                          this.props.data.refresh
                            ? ""
                            : this.state.searchPending
                        }
                        allowClear
                        style={{
                          width: 300,
                          margin: "0px 17px 0px 15px",
                          padding: "10px",
                          verticalAlign: "middle",
                        }}
                      />
                    </FormItem>
                  ) : null}
                  {!this.props.data.commonSearch ? (
                    <FormItem style={{ margin: "0px", padding: "0px" }}>
                      <Input
                        placeholder={"Search"}
                        onChange={this.onSearchData}
                        // onSearch={this.props.data.refresh ? "" : this.onSearch}
                        value={
                          this.props.data.refresh
                            ? this.state.searchData
                            : this.state.searchPending
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault(); // prevent the default behavior of the Enter key
                            this.props.data.onSearchData(this.state.searchData); // call your search function
                          }
                        }}
                        // allowClear
                        style={{
                          width: website ? 390 : 350,
                          margin: "0px 20px 0px 15px",
                          padding: "10px",
                          verticalAlign: "middle",
                          position: "relative",
                        }}
                      />
                      <Button
                        // type="primary"
                        style={{
                          position: "absolute",
                          right: "22px",
                          top: "2px",
                          backgroundColor: "green",
                          color: "#fff",
                        }}
                        disabled={!this.state.searchData ? true : false}
                        onClick={() => {
                          if (this.state.searchData) {
                            const trimmedSearchData =
                              this.state.searchData.trim();
                            this.props.data.onSearchData(trimmedSearchData);
                          }
                          this.setState({ page: 1 });
                        }}
                      >
                        Search
                      </Button>
                    </FormItem>
                  ) : null}

                  <div>
                    {this.props.data.addNewDataUrl ? (
                      <FormItem
                        style={{
                          cursor: "pointer",
                          // marginLeft: "40px",
                          display: "flex",
                          margin: "0 20px 0 15px",
                        }}
                      >
                        <Link to={this.props.data.addNewDataUrl}>
                          <Button
                            style={{ margin: "0px", marginLeft: "10px" }}
                            title={"Add"}
                            type="primary"
                            onClick={() => {
                              this.props.entityActionType("normal");
                              this.props.fetchEntityData(null);
                              localStorage.setItem("addAction", "true");
                            }}
                          >
                            {window.location.pathname === "/payment-gateway"
                              ? "ADD"
                              : "Add "}

                            {window.location.pathname === "/bank"
                              ? "Account"
                              : window.location.pathname === "/payment-gateway"
                                ? ""
                                : this.props.data?.title}
                          </Button>
                        </Link>
                      </FormItem>
                    ) : null}
                  </div>

                  <div>
                    {this.props.data.saveRoleData ||
                    this.props.data.saveAllCoinData ? (
                      <FormItem
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          margin: "0 20px 0 15px",
                        }}
                      >
                        <Button
                          style={{ margin: "0px", marginLeft: "10px" }}
                          title={"Save"}
                          type="primary"
                          onClick={
                            this.props.data.saveRoleData ||
                            this.props.data.saveAllCoinData
                          }
                        >
                          Save All
                        </Button>
                      </FormItem>
                    ) : null}
                  </div>

                  <div>
                    {this.props.data.entityAddButton ? (
                      <FormItem
                        style={{
                          cursor: "pointer",
                          // marginLeft: "40px",
                          display: "flex",
                          margin: "0 20px 0 15px",
                        }}
                      >
                        <Button
                          style={{ margin: "0px", marginLeft: "10px" }}
                          title={"Add"}
                          type="primary"
                          onClick={() => this.props.data.entityGatewayModal()}
                        >
                          Add{" "}
                          {window.location.pathname === "/bank"
                            ? "Account"
                            : this.props.data?.title}
                        </Button>
                      </FormItem>
                    ) : null}
                  </div>
                </div>
              </div>
            )
          }
        >
          {this.props.data.expandable && this.props.data.isNoneSelectable ? (
            <Table
              className="gx-table-responsive"
              columns={this.props.data.columns}
              dataSource={this.state.filterData || this.props.dataSource}
              loading={this.props.loadingData}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>
                    {this.expandedRowData(record)}
                  </div>
                ),
              }}
              rowKey="_id"
            />
          ) : this.props.data.expandable ? (
            <Table
              className="gx-table-responsive"
              columns={this.props.data.columns}
              dataSource={this.state.filterData || this.props.dataSource}
              loading={this.props.loadingData}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{ margin: 0 }}>
                    {this.expandedRowData(record)}
                  </div>
                ),
              }}
              rowKey="_id"
              rowSelection={{
                type: "radio",
                ...rowSelection,
              }}
            />
          ) : this.props.data.isNoneSelectable ? (
            <Table
              className="gx-table-responsive"
              columns={this.props.data.columns}
              dataSource={this.state.filterData || this.props.dataSource}
              loading={this.props.loadingData}
              rowKey="_id"
            />
          ) : (
            <Table
              onChange={this.handleChange}
              className={`gx-table-responsive ${rowClass}`}
              columns={this.props.data.columns}
              scroll={{
                y: this.props.data.yScroll,
                x: this.props.data.xScroll,
              }}
              dataSource={this.state.filterData || this.props.dataSource}
              loading={this.props.loadingData}
              rowKey={(record) => record._id}
              rowClassName={this.getRowClassName}
              pagination={{
                defaultCurrent: 1,
                current: this.state.page || paginationData?.page,
                pageSize: paginationData?.pageSize,
                total: this.state.filterData
                  ? this.state.filterData.length
                  : paginationData?.total,
                showSizeChanger: true,
                onShowSizeChange: (current, size) => {
                  // Update the page size in your state
                  this.props.data.showMore(current, size);
                },
              }}
              // rowSelection={{
              //     type: this.props.data.selectionType ? this.props.data.selectionType : 'radio',
              //     ...rowSelection,
              // }}
              // rowSelection={{
              //     type: this.props.data.selectionType ? this.props.data.selectionType : 'radio',
              //     ...rowSelection,
              // }}
            />
          )}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeTab: state.website.activeTab,
  isButtonEnabled: state.button.isButtonEnabled, // Assuming you have a piece of state called myReduxData
  transactionTypeTab: state.paymentGateway.transactionTypeTab, // Assuming you have a piece of state called myReduxData
  bankAccount: state.bankAccount.bankAccounts, // Assuming you have a piece of state called myReduxData
});

const mapDispatchToProps = {
  fetchActiveTab,
  entityActionType,
  fetchEntityData,
  fetchActiveTransactionTypeTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultTable);
