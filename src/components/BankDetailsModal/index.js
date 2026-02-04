import { Button, Divider, Modal, Tabs } from "antd";
import Title from "antd/lib/typography/Title";
// import Title from "antd/lib/skeleton/Title";
import React, { useState } from "react";
const { TabPane } = Tabs;

const AccountDetails = ({
  account,
  copyData,
  receiverAccountOwnerType,
  data,
  exchangeTransactions,
  from,
}) => {
  if (!account) return <p>No Data</p>;

  let {
    type,
    upiId,
    bankName,
    accountNum,
    ifsc,
    name,
    cryptoWalletAddress,
    address,
    accHolderName,
    bankBranchName,
    bankCode,
    cardNo,
    phoneNumber,
    walletCode,
    isUpiUrl,
    upiUrl
  } = account;

  if (isUpiUrl) {
    const urlParams = new URLSearchParams(upiUrl.split('?')[1]);
    upiId = urlParams.get('pa');
  }

  if (type) copyData.Account_Type = type;
  if (upiId) copyData.upiId = upiId;
  if (bankName) copyData.Bank_Name = bankName;
  if (accountNum) copyData.Account_Number = accountNum;
  if (ifsc) copyData.Ifsc = ifsc;
  if (name) copyData.Name = name;
  if (cryptoWalletAddress) copyData.walletAddress = cryptoWalletAddress;
  if (address) copyData.randomCryptoAccount = address;
  if (accHolderName) copyData.accHolderName = accHolderName;
  if (bankBranchName) copyData.bankBranchName = bankBranchName;
  if (bankCode) copyData.bankCode = bankCode;
  if (cardNo) copyData.cardNo = cardNo;
  if (accHolderName) copyData.accHolderName = accHolderName;
  if (phoneNumber) copyData.phoneNumber = phoneNumber;
  if (walletCode) copyData.walletCode = walletCode;

  return (
    <>
      <p>
        <span style={{ fontWeight: "bold" }}>Account Type: </span>
        {receiverAccountOwnerType === "pg"
          ? `Payment Gateway (${name})`
          : type || "-"}
      </p>
      {type === "upi" && (
        <p>
          <span style={{ fontWeight: "bold" }}>UPI ID: </span>
          {upiId || "-"}
        </p>
      )}
      {type === "bank" && (
        <>
          <p>
            <span style={{ fontWeight: "bold" }}>Bank Name: </span>
            {bankName || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Account Number: </span>
            {accountNum || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>IFSC: </span>
            {ifsc || "-"}
          </p>
          {cardNo && (
            <>
              <p>
                <span style={{ fontWeight: "bold" }}>
                  Account Holder Name:{" "}
                </span>
                {accHolderName || "-"}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Branch Name: </span>
                {bankBranchName || "-"}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Bank Code: </span>
                {bankCode || "-"}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Card Number: </span>
                {cardNo || "-"}
              </p>
            </>
          )}
        </>
      )}
      {type === "crypto" && (
        <>
          <p>
            <span style={{ fontWeight: "bold" }}>Wallet Name: </span>
            {name || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Wallet Address: </span>
            {cryptoWalletAddress || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Random Wallet Address: </span>
            {address || "-"}
          </p>
        </>
      )}
      {exchangeTransactions && (
        <>
          <p>
            <span style={{ fontWeight: "bold" }}>User Name: </span>
            {!from ? data?.user?.userName : data?.receiver?.userName || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Contact: </span>
            {data?.phoneNumber || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Email: </span>
            {data?.email || "-"}
          </p>
        </>
      )}
      {type === "ewallet" && (
        <>
          <p>
            <span style={{ fontWeight: "bold" }}>Account Holder Number: </span>
            {accHolderName || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Phone Number: </span>
            {phoneNumber || "-"}
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>Wallet Code: </span>
            {walletCode || "-"}
          </p>
        </>
      )}
    </>
  );
};

const CryptoDetails = ({ coin, coinNetwork, copyData }) => {
  if (coin?.name) copyData.coinName = coin.name;
  if (coin?.conversionToUSDT) copyData.conversionToUSDT = coin.conversionToUSDT;
  if (coinNetwork?.name) copyData.networkName = coinNetwork.name;
  if (coinNetwork?.networkFee) copyData.networkFee = coinNetwork.networkFee;

  return (
    <>
      <p>
        <span style={{ fontWeight: "bold" }}>Coin Name: </span>
        {coin?.name || "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Conversion Rate: </span>
        {coin?.conversionToUSDT ? `₹ ${coin.conversionToUSDT}` : "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Network Name: </span>
        {coinNetwork?.name || "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Network Fee: </span>
        {coinNetwork?.networkFee ? `₹ ${coinNetwork.networkFee}` : "-"}
      </p>
    </>
  );
};

const BankDetailsModal = ({
  visible,
  onClose,
  modalName,
  data,
  from,
  setOpenAccount,
}) => {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const copyData = {};
  const handleOpenAccount = () => {
    if (setOpenAccount) {
      setOpenAccount("");
    }
  };

  const handleOk = () => {
    onClose();
    setActiveTabKey("1");
    handleOpenAccount();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(copyData));
  };

  const renderWithdrawTabs = () => (
    <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
      <TabPane tab="Receiver Account" key="1">
        <AccountDetails account={data?.receiverAccount} copyData={copyData} />
      </TabPane>
      <TabPane tab="Sender Account" key="2">
        <AccountDetails
          account={
            data?.receiverAccountOwnerType === "pg"
              ? data?.paymentGateway
              : data?.senderAccount
          }
          copyData={copyData}
          receiverAccountOwnerType={data?.receiverAccountOwnerType}
        />
      </TabPane>
    </Tabs>
  );

  const renderDepositDetails = () => (
    <>
      {data?.paymentGateway ? (
        <p>
          <span style={{ fontWeight: "bold" }}>Account Type: </span>
          <>Payment Gateway({data?.paymentGateway?.name})</>
        </p>
      ) : data?.receiverAccount?.type === "crypto" ? (
        <>
            <AccountDetails account={{ ...data?.receiverAccount, ...data?.randomCryptoAccount }} copyData={copyData} />
          <CryptoDetails
            coin={data?.coin}
            coinNetwork={data?.coinNetwork}
            copyData={copyData}
          />
        </>
      ) : data?.accountHistory?.length > 0 ? (
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="Previous Account" key="1">
            <AccountDetails
              account={data?.accountHistory[0]?.previousAccount}
              copyData={copyData}
            />
          </TabPane>
          <TabPane tab="Transfer Account" key="2">
            <AccountDetails
              account={data?.accountHistory[1]?.transferAccount}
              copyData={copyData}
            />
          </TabPane>
        </Tabs>
      ) : (
        <AccountDetails account={data?.receiverAccount} copyData={copyData} />
      )}
    </>
  );

  const renderDepositQueue = () => (
    <>
      {data?.paymentGatewayId ? (
        <p>
          <span style={{ fontWeight: "bold" }}>Account Type: </span>
          <>Payment Gateway({data?.paymentGateway?.name})</>
        </p>
      ) : (
          <AccountDetails account={{ ...data?.depositAccount, ...data?.randomCryptoAccount }} copyData={copyData} />
      )}
      {!data?.paymentGateway && data?.reqType === "crypto" && (
        <CryptoDetails
          coin={data?.coin}
          coinNetwork={data?.coinNetwork}
          copyData={copyData}
        />
      )}
    </>
  );

  const renderExchangeTransactions = () => (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <Title level={5}>Withdrawer</Title>
        <Divider />
        <AccountDetails
          account={data?.accountId}
          copyData={copyData}
          data={data}
          exchangeTransactions
        />
      </div>
      <div style={{ width: "50%" }}>
        <Title level={5}>Depositer</Title>
        <Divider />
        <>
          {data?.attachedTransactions?.map((transaction, index) => (
            <React.Fragment key={index}>
              <p>
                <span style={{ fontWeight: "bold" }}>User Name: </span>
                {transaction?.user?.userName || "-"}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Contact: </span>
                {transaction?.phoneNumber || "-"}
              </p>
              <p>
                <span style={{ fontWeight: "bold" }}>Email: </span>
                {transaction?.email || "-"}
              </p>
              {data?.attachedTransactions?.length > 1 && <Divider />}
            </React.Fragment>
          ))}
        </>
      </div>
    </div>
  );

  const renderUserDepositDetails = () => (
    <div>
      <p>
        <span style={{ fontWeight: "bold" }}>User Name: </span>
        {data?.sender?.userName || "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Contact: </span>
        {data?.senderPhoneNumber || "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Email: </span>
        {data?.senderEmail || "-"}
      </p>
    </div>
  );

  const renderUserWithdrawDetails = () => (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <Title level={5}>Withdrawer</Title>
        <Divider />
        <AccountDetails
          account={data?.receiverAccount}
          copyData={copyData}
          data={data}
          exchangeTransactions
          from={from}
        />
      </div>
      <div style={{ width: "50%" }}>
        <Title level={5}>Depositer</Title>
        <Divider />
        {data?.attachedTransactions?.map((transaction, index) => (
          <React.Fragment key={index}>
            <p>
              <span style={{ fontWeight: "bold" }}>User Name: </span>
              {transaction?.sender?.userName || "-"}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Contact: </span>
              {transaction?.senderPhoneNumber || "-"}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Email: </span>
              {transaction?.senderEmail || "-"}
            </p>
            {data?.attachedTransactions?.length > 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderAttachedTransactionDetails = () => (
    <>
      <p>
        <span style={{ fontWeight: "bold" }}>User Name: </span>
        {window.location.pathname === "/withdraw/report"
          ? data?.receiver?.userName
          : data?.user?.userName || "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Contact: </span>
        {data?.phoneNumber || "-"}
      </p>
      <p>
        <span style={{ fontWeight: "bold" }}>Email: </span>
        {data?.email || "-"}
      </p>
    </>
  );

  const renderContent = () => {
    if (from === "withdraw" && data?.receiverAccountOwnerType !== "user") {
      return renderWithdrawTabs();
    }
    if (from === "withdraw" && data?.receiverAccountOwnerType === "user") {
      return renderUserWithdrawDetails();
    }
    if (from === "deposit" && data?.receiverAccountOwnerType !== "user") {
      return renderDepositDetails();
    }
    if (from === "deposit" && data?.receiverAccountOwnerType === "user") {
      return renderUserDepositDetails();
    }
    if (from === "depositQueue") {
      return renderDepositQueue();
    }
    if (from === "exchangeTransactions") {
      return renderExchangeTransactions();
    }
    if (from === "attachedTransactionReport") {
      return renderAttachedTransactionDetails();
    }
    return null;
  };

  return (
    <Modal
      id="BankDetailsModel"
      title={modalName}
      visible={visible}
      footer={[
        <Button key="copy" type="primary" onClick={handleCopyToClipboard}>
          Copy to clipboard
        </Button>,
        <Button key="ok" type="primary" onClick={handleOk}>
          OK
        </Button>,
      ]}
      onCancel={handleOk}
    >
      {renderContent()}
    </Modal>
  );
};

export default BankDetailsModal;
