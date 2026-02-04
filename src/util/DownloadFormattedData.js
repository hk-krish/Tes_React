import { useCalculatedTimeDifference } from "./CalculatedTimeDifference";
import { onDateFormate } from "./DateFormate";

export const generateFormattedData = (
  data,
  type,
  depositWaitingQueue,
  depositVerifactionTab,
) => {
  return data.map((item, index) => {
    const calculatedTimeDifference = useCalculatedTimeDifference();

    let userName =
      type === "depositReport"
        ? item.sender?.name
        : item.user?.endUserId || "-";
    let userId =
      type === "depositReport"
        ? item.sender?.uniqueId
        : item.user?.uniqueId || "-";

    let website =
      type === "depositReport"
        ? item.senderWebsite?.name
        : item.website?.name || "-";

    let websiteId =
      type === "depositReport"
        ? item.senderWebsite?.uniqueId
        : item.website?.uniqueId || "-";

    const formattedData = {
      "Sr No": index + 1,
      ...(type !== "depositReport" && {
        "Request Process":
          item?.reqType === "upi"
            ? "-"
            : item?.isBankReqAutoApproval === false
              ? "Auto to Manual"
              : item?.isBankReqAutoApproval === true
                ? "Move to Manual"
                : "Manual",
      }),
      ...(type === "depositReport" && {
        "Request Process":
          item?.reqType === "upi"
            ? "-"
            : item?.isBankDepositAutoApproval === true
              ? "Auto"
              : item?.isBankDepositAutoApproval === false
                ? "Auto to Manual"
                : "Manual",
      }),
      ...(type === "depositReport" && {
        "User Name": item.sender?.userName
          ? item.sender?.userName
          : item.sender?.name,
      }),
      ...(type !== "depositReport" && {
        "User Name": item.user?.userName
          ? item.user?.userName
          : item.user?.endUserId,
      }),
      "UTR ID": item?.transactionId || "-",
      "PG Transaction ID": item?.traId || "-",
      "UTR Transaction ID": item?.gatewayTraId || "-",
      ...((type === "depositReport" || depositVerifactionTab) && {
        "Change UTR Transaction ID": item?.changeGatewayTraId || "-",
      }),
      Amount: item.amount || "-",
      ...((type === "depositReport" || depositVerifactionTab) && {
        "User Amount": item?.changeAmount || "-",
      }),
      "Received Amount": item.receivedAmount || "-",
      ...(type !== "depositReport" && {
        "Transaction Process": item?.isManualDepositOrder ? "Link" : "Website",
      }),
      ...(type === "depositReport" && {
        "Transaction Process": item?.isManualOrder ? "Link" : "Website",
      }),
      Status: item.status || "-",
      "User Id": userId,
      "Website name": website || "-",
      "Website Id": websiteId || "-",
      Coin: item?.coin?.name || "-",
      "Coin Amount": item?.coin?.conversionToUSDT
        ? `${((item?.amount + item?.coinNetwork?.networkFee) / item?.coin?.conversionToUSDT).toFixed(3)}`
        : "-",
      "Coin Network": item?.coinNetwork?.name || "-",
      "Request Type": item?.reqType || "-",
      ...(depositVerifactionTab && {
        "Action By": item.actionBy?.name || "-",
      }),
      ...(type === "depositReport" && {
        "Action By": item.isPaymentGatewaySuccess
          ? "PG"
          : item.actionBy?.userType === "admin"
            ? "TES"
            : item.actionBy?.name
              ? item?.receiver?.name
              : item?.receiver?.name || "-",
        "Receiver name": item.paymentGateway?.name
          ? item.paymentGateway?.name
          : item.receiver?.name || "-",
        "Receiver Id": item.paymentGateway?.name
          ? "PG"
          : item?.receiverAccountOwnerType || "-",
        "Receiver type": item.paymentGateway?.name
          ? "PG"
          : item?.receiverAccountOwnerType || "-",
        "UPI ID":
          item.accountHistory && item.accountHistory.length > 0
            ? item.accountHistory[1]?.transferAccount?.upiId || "-"
            : item?.receiverAccount?.upiId || "-",
        "Bank Name":
          item.accountHistory && item.accountHistory.length > 0
            ? item.accountHistory[1]?.transferAccount?.bankName || "-"
            : item?.receiverAccount?.bankName || "-",
        "Account Number":
          item.accountHistory && item.accountHistory.length > 0
            ? item.accountHistory[1]?.transferAccount?.accountNum || "-"
            : item?.receiverAccount?.accountNum || "-",
        IFSC:
          item.accountHistory && item.accountHistory.length > 0
            ? item.accountHistory[1]?.transferAccount?.ifsc || "-"
            : item?.receiverAccount?.ifsc || "-",
      }),
      ...(type !== "depositReport" && {
        "Receiver name": item.created?.name
          ? item.created?.name
          : item.isManualDepositOrder
            ? "-"
            : item.paymentGateway
              ? item.paymentGateway?.name
              : "Live User" || "-",
        "Receiver Id": item.paymentGateway
          ? "PG"
          : item.created?.uniqueId
            ? item.created?.uniqueId
            : item.isManualDepositOrder
              ? "-"
              : "Live User" || "-",
        "Receiver type": item.paymentGateway
          ? "PG"
          : item?.depositAccountOwnerType || "-",
        "UPI ID": item?.receiverAccount?.upiId
          ? item?.depositAccount?.upiId
          : "-",
        "Bank Name": item?.receiverAccount?.bankName
          ? item?.depositAccount?.bankName
          : "-",
        "Account Number": item?.receiverAccount?.accountNum
          ? item?.depositAccount?.accountNum
          : "-",
        IFSC: item?.receiverAccount?.ifsc ? item?.depositAccount?.ifsc : "-",
      }),
      "Created Date":
        onDateFormate(item.createdAt, "DD-MM-YYYY hh:mm A") || "-",
      "Updated Date":
        onDateFormate(item.updatedAt, "DD-MM-YYYY hh:mm A") || "-",
      ...(type === "depositReport" && {
        "Time Differenece":
          calculatedTimeDifference(item?.createdAt, item?.updatedAt) || "-",
        Remarks: item?.remark || "-",
        Image: item?.reqType === "bank" ? item.paymentSS : "-" || "-",
      }),
      ...(type !== "depositReport" &&
        depositWaitingQueue && {
          "Waiting Time":
            onDateFormate(item?.depositWaitingTime, "DD-MM-YYYY hh:mm A") ||
            "-",
        }),
    };
    return formattedData;
  });
};

export const generateWithdrawReportFormattedData = (data, type) => {
  return data.map((item, index) => {
    const calculatedTimeDifference = useCalculatedTimeDifference();
    const formattedData = {
      "Sr No": index + 1,
      "PG Transaction ID": item?.traId || "-",
      "User Name": item?.receiver?.userName
        ? item?.receiver?.userName
        : item?.receiver?.name || "-",
      "User ID": item?.receiver?.uniqueId || "-",
      "Website name": item.receiver?.websiteName || "-",
      "Website Id": item.senderWebsite?.uniqueId || "-",
      Amount: item.amount || "-",
      "Transaction Process": item?.isManualOrder ? "Link" : "Website",
      "Payment Gateway":
        item?.isPaymentGatewaySuccess && item?.paymentGateway
          ? item?.paymentGateway?.name
          : !item?.isPaymentGatewaySuccess && item?.paymentGateway
            ? item?.paymentGateway?.name
            : "-",
      "Payment Gateway Status":
        !item?.isPaymentGatewaySuccess && item?.paymentGateway ? "Failed" : "-",
      "Account Type(UPI/Bank)": item.reqType || "-",
      "Sender Name": item?.sender?.name,
      "Sender Id": item?.sender?.uniqueId,
      "Sender Website Name":
        item?.receiverAccountOwnerType === "user"
          ? item?.sender?.websiteName
          : "-",
      "Sender Type": item.receiverAccountOwnerType,
      "Action By": item?.isPaymentGatewaySuccess
        ? "PG"
        : item.actionBy
          ? item.actionBy?.name
          : item?.sender?.name,
      "Receiver Account Type": item?.receiverAccount?.type || "-",
      "Receiver UPI ID": item?.receiverAccount?.upiId || "-",
      "Receiver Bank Name": item?.receiverAccount?.bankName || "-",
      "Receiver Bank Holder Name": item?.receiverAccount?.accHolderName || "-",
      "Receiver Account No": item?.receiverAccount?.accountNum || "-",
      "Receiver IFSC": item?.receiverAccount?.ifsc || "-",
      "Sender Account Type": item?.senderAccount?.type || "-",
      "Sender UPI ID": item?.senderAccount?.upiId || "-",
      "Sender Bank Name": item?.senderAccount?.bankName || "-",
      "Sender Bank Holder Name": item?.senderAccount?.accHolderName || "-",
      "Sender Account No": item?.senderAccount?.accountNum || "-",
      "Sender IFSC": item?.senderAccount?.ifsc || "-",
      "Created Date":
        onDateFormate(item.createdAt, "DD-MM-YYYY hh:mm A") || "-",
      "Updated Date":
        onDateFormate(item.updatedAt, "DD-MM-YYYY hh:mm A") || "-",
      "Time Difference":
        calculatedTimeDifference(
          item?.withdrawReqCreatedAt
            ? item?.withdrawReqCreatedAt
            : item?.depositReqCreatedAt,
          item.updatedAt,
        ) || "-",
      Status: item.status || "-",
      Remarks: item?.remark || "-",
    };

    return formattedData;
  });
};

export const generateWithdrawQueueFormattedData = (data, type) => {
  return data.map((item, index) => {
    const formattedData = {
      "Sr No": index + 1,
      "Payment Gateway":
        item?.status === "verified" && item?.paymentGateway
          ? item?.paymentGateway?.name
          : "-",
      "Payment Gateway Status":
        item?.status === "verified" && item?.paymentGateway ? "Failed" : "-",
      "PG Transaction ID": item?.traId || "-",
      "User Name": item.user?.userName
        ? item.user?.userName
        : item?.user?.endUserId || "-",
      "User ID": item?.user?.uniqueId || "-",
      "Website name": item?.website?.name || "-",
      "Website Id": item?.website?.uniqueId || "-",
      "Receiver Name":
        item?.isForLiveUser &&
        window.location.pathname === "/withdraw-pending-report"
          ? "-"
          : item?.isForLiveUser
            ? "Live Depositor"
            : item?.vendorId
              ? item?.vendor?.name
              : item?.agentId
                ? item?.agent?.name
                : item?.agentId === null && item.vendorId === null
                  ? item?.website?.name
                  : "",
      "Receiver Id":
        item?.isForLiveUser &&
        window.location.pathname === "/withdraw-pending-report"
          ? "-"
          : item?.isForLiveUser
            ? "Live Depositor"
            : item?.vendorId
              ? item?.vendor?.uniqueId
              : item?.agentId
                ? item?.agent?.uniqueId
                : item?.agentId === null && item.vendorId === null
                  ? item?.website?.uniqueId
                  : "",
      "Receiver Type":
        item?.isForLiveUser &&
        window.location.pathname === "/withdraw-pending-report"
          ? "-"
          : item?.isForLiveUser
            ? "Live Depositor"
            : item?.status === "pgInProcess"
              ? "PG"
              : item?.vendorId
                ? "Vendor"
                : item?.agentId
                  ? "Agent"
                  : item?.agentId === null && item?.vendorId === null
                    ? "Website"
                    : "-",
      Amount: item.amount || "-",
      "Pending Amount": item?.pendingAmount || "00",
      "Paid Amount": item?.paidAmount || "00",
      "Transaction Process": item?.isManualWithdrawOrder ? "Link" : "Website",
      "Account Type": item?.reqType || "-",
      "UPI ID": item?.accountId?.upiId || "-",
      "Bank Name": item?.accountId?.bankName || "-",
      "Account No": item?.accountId?.accountNum || "-",
      IFSC: item?.accountId?.ifsc || "-",
      "Created Date":
        onDateFormate(item.createdAt, "DD-MM-YYYY hh:mm A") || "-",
      "Updated Date":
        onDateFormate(item.updatedAt, "DD-MM-YYYY hh:mm A") || "-",
      "Expired Time": onDateFormate(item.expiry, "DD-MM-YYYY hh:mm A") || "-",
      Status: item.status || "-",
    };

    return formattedData;
  });
};

export const generateWebsiteReportData = (data) => {
  return data.map((item, index) => {
    const formattedData = {
      "Sr No": index + 1,
      "Website Name": item.name,
      "Website Id": item.uniqueId,
      "Deposite Success": item?.transactions?.totalDepositAmount
        ? (item?.transactions?.totalDepositAmount).toFixed(2)
        : "00",
      "Withdraw Success": item?.transactions?.totalWithdrawAmount
        ? (item?.transactions?.totalWithdrawAmount).toFixed(2)
        : "00",
      DMW:
        item?.transactions?.totalDepositAmount ||
        item?.transactions?.totalWithdrawAmount
          ? (
              item?.transactions?.totalDepositAmount -
              item?.transactions?.totalWithdrawAmount
            ).toFixed(2)
          : "00",
    };
    return formattedData;
  });
};

export const generatePGReportData = (data) => {
  return data.map((item, index) => {
    const formattedData = {
      "Sr No": index + 1,
      "Website Name": item.name,
      "Deposite Success": item?.transactions?.totalDepositAmount
        ? (item?.transactions?.totalDepositAmount).toFixed(2)
        : "00",
      "Deposit Count": item?.transactions?.totalDepositCount
        ? (item?.transactions?.totalDepositCount).toFixed(2)
        : "00",
      "Withdraw Success": item?.transactions?.totalWithdrawAmount
        ? (item?.transactions?.totalWithdrawAmount).toFixed(2)
        : "00",
      "Withdraw Count": item?.transactions?.totalWithdrawCount
        ? (item?.transactions?.totalWithdrawCount).toFixed(2)
        : "00",
      DMW:
        item?.transactions?.totalDepositAmount ||
        item?.transactions?.totalWithdrawAmount
          ? (
              item?.transactions?.totalDepositAmount -
              item?.transactions?.totalWithdrawAmount
            ).toFixed(2)
          : "00",
    };
    return formattedData;
  });
};
export const generateTransactionListReportData = (data) => {
  return data.map((item, index) => {
    const formattedData = {
      "Sr No": index + 1,
      Date: onDateFormate(item.createdAt, "DD-MM-YYYY hh:mm A") || "-",
      "PG Transaction ID": item?.traId || "-",
      "Receiver Account":
        item?.receiverAccount?.name || item?.depositAccount?.name || "-",
      "Receiver Type":
        item?.receiver?.userType || item?.depositAccount?.owner || "-",
      "Receiver Name": item?.receiver?.name || item?.created?.name || "-",
      Amount: item?.amount || "-",
      "Received Amount": item?.receivedAmount || "-",
      Status: item?.status || "-",
    };

    return formattedData;
  });
};

export const generateExchangeReportData = (data) => {
  return data.map((item, index) => {
    const formattedData = {
      "Sr No": index + 1,
      Status: item?.status || "-",
      "PG Transaction ID": item?.traId || "-",
      "User Name": item?.user?.userName || "-",
      "User ID": item?.user?.uniqueId || "-",
      "Contact Number": item?.phoneNumber || "-",
      Email: item?.email || "-",
      "Website Name": item?.website?.name || "-",
      "Website ID": item?.website?.uniqueId || "-",
      Amount: item?.amount || "-",
      "Account Type(UPI/Bank)": item?.reqType || "-",
      "Sender Name":
        item?.attachedTransactions?.length === 1
          ? item?.attachedTransactions[0]?.user?.userName
          : "-",
      "Sender ID":
        item?.attachedTransactions?.length === 1
          ? item?.attachedTransactions[0]?.user?.uniqueId
          : "-",
      "Sender Type": item?.attachedTransactions[0]?.user?.userType || "-",
      "Sender Contact":
        item?.attachedTransactions?.length === 1
          ? item?.attachedTransactions[0]?.phoneNumber
          : "-",
      "Sender Email":
        item?.attachedTransactions?.length === 1
          ? item?.attachedTransactions[0]?.email
          : "-",
      Date: onDateFormate(item.createdAt, "DD-MM-YYYY hh:mm A") || "-",
    };

    return formattedData;
  });
};

export const generateHistoryData = (data) => {
  return data.map((item, index) => {
    // Format the `data` array into a single column as a string
    let createDataColumn = item?.data
      ? item.data
          .map((dataItem) => `${dataItem.label}: ${dataItem.value}`)
          .join(", ")
      : "-";
    let updateDataColumn = item?.data
      ? item.data
          .map(
            (dataItem) =>
              `${dataItem.field}: (Old: ${dataItem.oldValue || "-"} → New: ${
                dataItem.newValue || "-"
              })`,
          )
          .join(", ")
      : "-";

    const dataColumn =
      item?.status === "created" ? createDataColumn : updateDataColumn;
    const formattedData = {
      "Sr No": index + 1,
      Date: onDateFormate(item.date, "DD-MM-YYYY hh:mm A") || "-",
      Action: item?.action || "",
      "Action By": item?.actionBy || "-",
      Status: item?.status || "-",
      Title: item?.header || "-",
      "Activity Details": dataColumn, // Add the data column
    };
    return formattedData;
  });
};

//  Amount And Count Show in Excel
// export const generateFormattedData = (data, type) => {
//   // Group data by amount and calculate count
//   const groupedData = data.reduce((acc, item) => {
//     const amount = item.amount || "Others"; // Handle undefined or missing amounts
//     if (!acc[amount]) {
//       acc[amount] = { Amount: amount, Count: 0 }; // Initialize group
//     }
//     acc[amount].Count += 1; // Increment count for this amount
//     return acc;
//   }, {});

//   // Convert grouped data into an array format
//   const formattedData = Object.values(groupedData);
//   return formattedData;
// };