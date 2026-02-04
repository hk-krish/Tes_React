import {
  FETCH_PAYMENT_GATEWAY,
  FETCH_TRANSACTION_TYPE,
  FETCH_TRANSACTION_TYPE_TAB,
} from "../../constants/ActionTypes";

export const fetchPaymentGateway = (data) => {
  return {
    type: FETCH_PAYMENT_GATEWAY,
    payload: data,
  };
};

export const fetchTransactionType = (data) => {
  return {
    type: FETCH_TRANSACTION_TYPE,
    payload: data,
  };
};

export const fetchActiveTransactionTypeTab = (data) => {
  return {
    type: FETCH_TRANSACTION_TYPE_TAB,
    payload: data,
  };
};
