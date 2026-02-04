import { Card, message } from "antd";
import React, { useEffect, useState } from "react";
import Auxiliary from "util/Auxiliary";
import { ExchangeTransactionsCountColumn } from "../../../components/ColumnComponents/columnComponents";
import TransactionCountTable from "../../../components/TransactionCountTable";
import UserService from "../../../service/UserService";
import "./exchangeTransactions.css";

const ExchangeTransactions = () => {
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [depositData, setDepositData] = useState(null);
  const [withdrawData, setWithdrawData] = useState(null);
  const [totalDepositData, setTotalDepositData] = useState(null);
  const [totalWithdrawData, setTotalWithdrawData] = useState(null);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    setLoadingData(true);
    await UserService.getExchangeTransactionCount()
      .then((response) => {
        let totalDepositData = response?.data?.totalDepositData;
        let totalWithdrawData = response?.data?.totalWithdrawData; 
        setTotalDepositData(totalDepositData);
        setTotalWithdrawData(totalWithdrawData);
        setDepositData(response?.data?.depositData);
        setWithdrawData(response?.data?.withdrawData);
        setLoadingData(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingData(false);
        message.error(err.message);
      });
  };

  useEffect(() => {
    if (refresh) {
      fetchData(page, pageSize);
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (!refresh) {
      fetchData(page, pageSize);
    }
  }, [page, pageSize]);

  const tableColumns = ExchangeTransactionsCountColumn(page, pageSize);

  return (
    <>
      <Auxiliary>
        <h1 style={{ color: "#636363", display: "flex" }}>Transaction</h1>
        <Card>
          <div className="transaction-container">
            <TransactionCountTable
              title="Deposit"
              total={totalDepositData}
              dataSource={depositData}
              columns={tableColumns}
              loadingData={loadingData}
            />
            <TransactionCountTable
              title="Withdraw"
              total={totalWithdrawData}
              dataSource={withdrawData}
              columns={tableColumns}
              loadingData={loadingData}
            />
          </div>
        </Card>
      </Auxiliary>
    </>
  );
};

export default ExchangeTransactions;
