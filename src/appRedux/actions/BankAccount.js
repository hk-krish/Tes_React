import { ACTIVE_BANK_TAB, BANK_ACCOUNT } from "../../constants/ActionTypes";

export const fetchActiveBankTab = (data) => {
  return {
    type: ACTIVE_BANK_TAB,
    payload: data,
  };
};

export const fetchBankAccount = (data) => {
  return {
    type: BANK_ACCOUNT,
    payload: data,
  };
};
