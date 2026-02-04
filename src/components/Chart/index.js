import { Col, Divider, Row } from "antd";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CommonCardHeading from "../CommonCardHeading";
import { MillisecondsToTime } from "../../util/MillisecondsToTime";

const dayMapping = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
};

const Chart = ({
  websiteDepositData,
  websiteWithdrawData,
  pgTransactionData,
  weeklyDepositTransactionData,
  weeklyWithdrawTransactionData,
  weeklyTotalWithdrawAmount,
  weeklyTotalDepositAmount,
  operatorData,
  lodingWebsiteData,
}) => {
  // Flatten the data for the chart
  const pgTransaction = pgTransactionData?.map((item) => ({
    name: item._id,
    depositAmount: item.transactions?.depositAmount,
    withdrawAmount: -item.transactions?.withdrawAmount, // Withdrawals as negative values
  }));

  // Transform the data to include day names:
  const weeklyDepositTransaction = weeklyDepositTransactionData?.map(
    (item) => ({
      name: dayMapping[item.day], // Map day number to day name
      totalDepositAmount: item.totalDepositAmount,
      totalDepositCount: item.totalDepositCount,
    }),
  );

  // Transform the data to include day names:
  const weeklyWithdrawTransaction = weeklyWithdrawTransactionData?.map(
    (item) => ({
      name: dayMapping[item.day], // Map day number to day name
      totalWithdrawCount: item.totalWithdrawCount,
      totalWithdrawAmount: item.totalWithdrawAmount,
    }),
  );

  const renderBarChart = (
    cardType,
    title,
    dataKey,
    name,
    color,
    actionEvent,
  ) => {
    let data =
      title === "Withdraw Count" || title === "Withdraw Amount"
        ? websiteWithdrawData
        : websiteDepositData;

    return (
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <CommonCardHeading
          cardType={cardType}
          headBgColor="rgb(4 74 143)"
          title={title}
          actionText="View Report"
          actionEvent={actionEvent}
          weeklyTotalDepositAmount={weeklyTotalDepositAmount}
          weeklyTotalWithdrawAmount={weeklyTotalWithdrawAmount}
          lodingWebsiteData={lodingWebsiteData}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar name={name} dataKey={dataKey} fill={color} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CommonCardHeading>
      </Col>
    );
  };

  const renderAnalysisBarChart = (
    cardType,
    title,
    dataKey,
    name,
    color,
    actionEvent,
  ) => {
    let data =
      title === "Deposit Analysis(Weekly)"
        ? weeklyDepositTransaction
        : weeklyWithdrawTransaction;

    return (
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <CommonCardHeading
          cardType={cardType}
          headBgColor="rgb(4 74 143)"
          title={title}
          actionText="View Report"
          actionEvent={actionEvent}
          weeklyTotalDepositAmount={weeklyTotalDepositAmount}
          weeklyTotalWithdrawAmount={weeklyTotalWithdrawAmount}
          lodingWebsiteData={lodingWebsiteData}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip
                content={(props) =>
                  renderTooltipContentForAnalysis(props, title)
                }
              />
              <Bar name={name} dataKey={dataKey} fill={color} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </CommonCardHeading>
      </Col>
    );
  };

  const renderTooltipContentForAnalysis = ({ payload, label }, title) => {
    if (payload && payload.length) {
      const {
        totalDepositCount,
        totalDepositAmount,
        totalWithdrawCount,
        totalWithdrawAmount,
      } = payload[0].payload; // Access the payload of the first item, which contains your custom data

      return (
        <div className="tooltip-container">
          {title === "Deposit Analysis(Weekly)" ? (
            <>
              <p className="tooltip-payload">{`Deposit Count: ${totalDepositCount}`}</p>
              <p className="tooltip-payload">{`Deposit Amount: ₹${totalDepositAmount}`}</p>
            </>
          ) : (
            <>
              <p className="tooltip-payload">{`Withdraw Count: ${totalWithdrawCount}`}</p>
              <p className="tooltip-payload">{`Withdraw Amount: ₹${totalWithdrawAmount}`}</p>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  const renderTooltipContent = (payload) => {
    return (
      <div className="tooltip-container">
        {payload?.payload?.map((entry, index) => (
          <div key={index}>
            <p className="tooltip-payload">{entry?.payload?.name}</p>
            <p
              style={{
                color: entry.value >= 0 ? "green" : "red",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              <span
                style={{
                  color: entry.value >= 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                DMW Amount:{" "}
              </span>
              {new Intl.NumberFormat().format(entry.value)}
            </p>
            <p className="tooltip-payload">
              <span>Deposit: </span>
              {new Intl.NumberFormat().format(
                entry.payload?.transactions?.totalDepositAmount,
              )}
            </p>
            <p className="tooltip-payload">
              <span>Withdraw: </span>
              {new Intl.NumberFormat().format(
                entry.payload?.transactions?.totalWithdrawAmount,
              )}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderTooltipContentPG = ({ payload, label }) => {
    if (payload && payload.length) {
      const depositAmount =
        payload.find((item) => item.dataKey === "depositAmount")?.value || 0;
      const withdrawAmount =
        payload.find((item) => item.dataKey === "withdrawAmount")?.value || 0;
      const totalDmw = depositAmount - Math.abs(withdrawAmount); // Calculate Deposit minus Withdraw (dmw)

      return (
        <div className="tooltip-container">
          <p className="tooltip-payload">{`Deposit: ₹${depositAmount}`}</p>
          <p className="tooltip-payload">{`Withdraw: ₹${Math.abs(withdrawAmount)}`}</p>{" "}
          {/* Show withdraw as positive */}
          <p
            className="tooltip-payload"
            style={{
              color: totalDmw < 0 ? "red" : "green", // Check if totalDmw is negative or positive
            }}
          >{`Total DMW : ₹${totalDmw}`}</p>
        </div>
      );
    }

    return null;
  };

  const renderTooltipContentOperator = ({ payload, label }) => {
    if (payload && payload.length) {
      const data = payload[0].payload; // Access the payload of the first item, which contains your custom data

      return (
        <div className="tooltip-container">
          <p className="tooltip-payload-deposit">{`Deposit Count: ${data.depositCount}`}</p>
          <p className="tooltip-payload-deposit">{`Deposit Amount: ₹${data.depositAmount}`}</p>
          <p className="tooltip-payload-deposit">{`Deposit AVG Time: ${MillisecondsToTime(data.depositAverageTimeDifference)}`}</p>
          {/* <hr style={{ color: "white", }} /> */}
          <Divider style={{ borderColor: "#fff" }} />
          <p className="tooltip-payload-withdraw">{`Withdraw Count: ${data.withdrawCount}`}</p>
          <p className="tooltip-payload-withdraw">{`Withdraw Amount: ₹${data.withdrawAmount}`}</p>
          <p className="tooltip-payload-withdraw">{`Withdraw AVG Time: ${MillisecondsToTime(data.withdrawAverageTimeDifference)}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <Row gutter={[8, 8]}>
        {renderBarChart(
          "chartCard",
          "Deposit Count",
          "transactions.totalDepositCount",
          "Deposit Count",
          "green",
          "depositReport",
        )}

        {renderBarChart(
          "chartCard",
          "Deposit Amount",
          "transactions.totalDepositAmount",
          "Deposit Amount",
          "green",
          "depositReport",
        )}

        {renderBarChart(
          "chartCard",
          "Withdraw Count",
          "transactions.totalWithdrawCount",
          "Withdraw Count",
          "red",
          "withdrawReport",
        )}

        {renderBarChart(
          "chartCard",
          "Withdraw Amount",
          "transactions.totalWithdrawAmount",
          "Withdraw Amount",
          "red",
          "withdrawReport",
        )}
      </Row>

      <Row gutter={[8, 8]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <CommonCardHeading
            cardType="chartCard"
            headBgColor="rgb(4 74 143)"
            title="DMW Amount"
            actionText="View Report"
            actionEvent="websiteReport"
            lodingWebsiteData={lodingWebsiteData}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                data={websiteDepositData}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" />
                <YAxis />
                <Tooltip
                  labelStyle={{ fontWeight: "bold" }}
                  content={renderTooltipContent}
                />
                <ReferenceLine y={0} stroke="#000" />
                <Bar
                  name="DMW Amount"
                  dataKey="transactions.dmwAmount"
                  stackId="count"
                  barSize={30}
                >
                  {websiteDepositData?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry?.transactions?.dmwAmount >= 0 ? "green" : "red"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CommonCardHeading>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <CommonCardHeading
            cardType="chartCard"
            headBgColor="rgb(4 74 143)"
            title={"Payment Gateway Report"}
            actionText="View Report"
            actionEvent="pgReport"
            lodingWebsiteData={lodingWebsiteData}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                data={pgTransaction}
                stackOffset="sign"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" />
                <YAxis />
                <Tooltip
                  labelStyle={{ fontWeight: "bold" }}
                  content={renderTooltipContentPG}
                />
                <ReferenceLine y={0} stroke="#000" />
                <Bar
                  name="Deposit"
                  dataKey="depositAmount"
                  fill="green"
                  barSize={30}
                  stackId="a"
                />
                <Bar
                  name="Withdraw"
                  dataKey="withdrawAmount"
                  fill="red"
                  barSize={30}
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          </CommonCardHeading>
        </Col>

        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <CommonCardHeading
            cardType="chartCard"
            headBgColor="rgb(4 74 143)"
            title="Operator Analysis"
            actionText=""
            actionEvent=""
            lodingWebsiteData={lodingWebsiteData}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                data={operatorData}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" />
                <YAxis />
                <Tooltip
                  labelStyle={{ fontWeight: "bold" }}
                  content={renderTooltipContentOperator}
                />
                <Bar
                  name="Deposit Amount"
                  dataKey="depositCount"
                  barSize={20}
                  fill="green"
                />
                <Bar
                  name="Withdraw Amount"
                  dataKey="withdrawCount"
                  barSize={20}
                  fill="red"
                />
              </BarChart>
            </ResponsiveContainer>
          </CommonCardHeading>
        </Col>

        {renderAnalysisBarChart(
          "analysisCard",
          "Deposit Analysis(Weekly)",
          "totalDepositAmount",
          "Deposit Amount",
          "green",
          "depositReport",
        )}

        {renderAnalysisBarChart(
          "analysisCard",
          "Withdraw Analysis(Weekly)",
          "totalWithdrawAmount",
          "Withdraw Amount",
          "red",
          "withdrawReport",
        )}
      </Row>
    </>
  );
};

export default Chart;
