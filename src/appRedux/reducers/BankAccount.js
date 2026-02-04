import { ACTIVE_BANK_TAB, BANK_ACCOUNT } from "../../constants/ActionTypes";

const INIT_STATE = {
  activeBankTab: "1",
  bankAccounts: [],
};

const BankAccountReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ACTIVE_BANK_TAB: {
      return {
        ...state,
        activeBankTab: action.payload,
      };
    }

    case BANK_ACCOUNT: {
      return {
        ...state,
        bankAccounts: action.payload,
      };
    }
    default:
      return state;
  }
};

export default BankAccountReducer;
