import { Button, Card, Col, Collapse, DatePicker, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import UserDropdown from "../InputControl/UserDropdown/UserDropdown";
import moment from "moment";
import "./AdvanceFilter.css";

const AdvanceFilter = (props) => {
  const [initialValue, setInitialValue] = useState({
    page: props?.page,
    statusFilter: "Select Status",
    transactionTypeFilter: "Transaction Type",
    startDate: props.startDate,
    endDate: props.endDate,
    date: null,
  });

  const handleReset = () => {
    setInitialValue({
      page: props?.page,
      statusFilter: "Select Status",
      transactionTypeFilter: "Transaction Type",
      startDate: null,
      endDate: null,
    });
    props.onReset();
    props?.setFilterState({ page: 1 });
    props.handleChangeFilter("handleReset");
  };

  const handleSearch = () => {
    props?.handleSearch();
    props?.setFilterState({ page: 1 });
  };

  const isToday = (someDate) => {
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

  const commissionDateSelector = (date, selectedType, selectedDate) => {
    let startDate;
    let endDate;

    if (date !== null) {
      setInitialValue({ ...initialValue, page: 1 });

      if (selectedType === "startDate") {
        startDate = new Date(date);
        setInitialValue((prev) => ({
          ...prev,
          startDate: startDate,
        }));
      }
      if (selectedType === "endDate") {
        endDate = new Date(date);

        if (
          initialValue?.endDate &&
          isToday(initialValue.endDate) &&
          !isToday(endDate)
        ) {
          // Set the time to 23:59:59 if not today
          endDate.setHours(23, 59, 59);
        }

        setInitialValue((prev) => ({
          ...prev,
          endDate: endDate,
        }));
        props.commissionDateFilter(
          new Date(initialValue.startDate),
          new Date(selectedDate),
        );
      } else {
        let availableEndDate = initialValue.endDate
          ? new Date(initialValue.endDate)
          : new Date();
        props.commissionDateFilter(new Date(date), new Date(availableEndDate));
        setInitialValue((prev) => ({
          ...prev,
          endDate: availableEndDate,
        }));
        return;
      }
    } else {
      let startDate = null;
      let endDate = null;
      props.commissionDateFilter(startDate, endDate);
      setInitialValue({
        ...initialValue,
        startDate: null,
        endDate: null,
        date: null,
      });
    }
  };

  const renderSenderAndReceiverName = () => {
    const { showSenderAndReceiverName } = props;
    if (!showSenderAndReceiverName) return null;

    const { to, from, fromData, toData } = showSenderAndReceiverName;
    const isToTES = to === "TES";
    const senderName = isToTES ? fromData?.name : toData?.name;
    const showUniqueId = from !== "PG";
    const uniqueId = isToTES ? fromData?.uniqueId : toData?.uniqueId;

    return (
      <p style={{ fontSize: "18px", margin: "0" }}>
        TES - {senderName}
        {showUniqueId && ` (${uniqueId})`}
      </p>
    );
  };

  useEffect(() => {
    if (props?.startDate || props?.endDate) {
      setInitialValue({
        ...initialValue,
        startDate: props?.startDate,
        endDate: props?.endDate,
      });
    }
  }, [props?.startDate, props?.endDate]);

  return (
    <>
      {renderSenderAndReceiverName()}
      <Card className="ant-card-body" style={{ marginBottom: "10px" }}>
        <Row gutter={[24, 16]}>
          {props?.actionAndTransactionFilterShow && (
            <>
              <Col style={{ margin: "0 10px" }}>
                <UserDropdown
                  initialValue={initialValue.statusFilter}
                  display={true}
                  type="commissionStatusFilter"
                  onChange={(selectedValue) => {
                    props.handleChangeFilter(
                      "commissionStatusFilter",
                      selectedValue,
                    );
                    setInitialValue({
                      ...initialValue,
                      statusFilter: selectedValue,
                    });
                  }}
                  width={170}
                />
              </Col>
              <Col style={{ margin: "0 10px" }}>
                <UserDropdown
                  initialValue={initialValue.transactionTypeFilter}
                  display={true}
                  type="commissionTransactionTypeFilter"
                  onChange={(selectedValue) => {
                    props.handleChangeFilter(
                      "commissionTransactionTypeFilter",
                      selectedValue,
                    );
                    setInitialValue({
                      ...initialValue,
                      transactionTypeFilter: selectedValue,
                    });
                  }}
                  width={170}
                />
              </Col>
            </>
          )}
          {!props.extraFilterShow && (
            <Col style={{ margin: "0 10px" }}>
              <Button
                style={{
                  backgroundColor: "green",
                  color: "#fff",
                }}
                onClick={() => handleSearch()}
              >
                Search
              </Button>
              <Button type="primary" onClick={() => handleReset()}>
                Reset
              </Button>
            </Col>
          )}

          {props.extraFilterShow && (
            <>
              <Col>
                <DatePicker
                  onSelect={(startDate) => {
                    commissionDateSelector(
                      startDate,
                      "startDate",
                      initialValue?.endDate,
                    );
                  }}
                  disabledDate={props?.disabledFutureDate}
                  value={
                    initialValue.startDate
                      ? moment(initialValue.startDate) // Use moment to clone the date
                      : null
                  }
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
                    let date;
                    if (!isToday(new Date(endDate))) {
                      date = new Date(endDate);
                      date.setHours(23, 59, 59); // Set time to 23:59:59
                    } else {
                      date = new Date(endDate);
                    }
                    commissionDateSelector(endDate, "endDate", date);
                  }}
                  disabledDate={props.disabledFutureDate}
                  value={
                    initialValue.endDate
                      ? moment(initialValue.endDate) // Use moment to clone the date
                      : null
                  }
                  format="DD-MM-YYYY HH:mm:ss A"
                  showTime={{ format: "HH:mm:ss" }}
                  clearIcon={false}
                />
              </Col>
              <Col>
                <Button
                  style={{
                    backgroundColor: "green",
                    color: "#fff",
                  }}
                  onClick={() => handleSearch()}
                >
                  Search
                </Button>
                <Button type="primary" onClick={() => handleReset()}>
                  Reset
                </Button>
              </Col>
            </>
          )}
        </Row>
      </Card>
    </>
  );
};

export default AdvanceFilter;
