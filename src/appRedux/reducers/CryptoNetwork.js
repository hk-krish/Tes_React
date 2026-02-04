import { ADD_COIN_DATA,SET_NETWORK_ACTIVE_TAB,SET_NETWORK_DETAILS,SET_NETWORK_TRANSACTION_TYPE } from "../../constants/ActionTypes";

const INIT_STATE = {
    coinName:"",
    coinId:""
};

const CryptoNetwork = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_COIN_DATA: {
      return {
        ...state,
        coinName:action.payload.coinName,
        coinId:action.payload.coinId
      };
    }
    case SET_NETWORK_ACTIVE_TAB : {
      return {
        ...state,
        networkActiveTab:action.payload
      }
    }
    case SET_NETWORK_DETAILS : {
      return {
        ...state,
        networkId:action.payload
      }
    }
    case SET_NETWORK_TRANSACTION_TYPE :{
      return {
        ...state,
        transactionType:action.payload
      }
    }
    default:
      return state;
  }
};

export default CryptoNetwork;
