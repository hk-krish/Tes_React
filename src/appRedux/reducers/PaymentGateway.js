import {
  FETCH_PAYMENT_GATEWAY,
  FETCH_TRANSACTION_TYPE,
  FETCH_TRANSACTION_TYPE_TAB,
} from "../../constants/ActionTypes";

const INIT_STATE = {
  paymentGatewayList: null,
  transactionType: null,
  transactionTypeTab: "deposit",
};

const paymentGatewayReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_PAYMENT_GATEWAY: {
      return {
        ...state,
        paymentGatewayList: action.payload,
      };
    }
    case FETCH_TRANSACTION_TYPE: {
      return {
        ...state,
        transactionType: action.payload,
      };
    }
    case FETCH_TRANSACTION_TYPE_TAB: {
      return {
        ...state,
        transactionTypeTab: action.payload,
      };
    }
    default:
      return state;
  }
};

export default paymentGatewayReducer;
