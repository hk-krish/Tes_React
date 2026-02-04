import { ADD_COIN_DATA,SET_NETWORK_ACTIVE_TAB,SET_NETWORK_DETAILS,SET_NETWORK_TRANSACTION_TYPE } from "../../constants/ActionTypes";

export const addCoinData = (data) => {
    return {
        type:ADD_COIN_DATA,
        payload:data
    }
}

export const setNetworkActiveTab = (data) => {
    return {
        type:SET_NETWORK_ACTIVE_TAB,
        payload:data
    }
}

export const setNetworkDetails = (data) => {
    return {
        type:SET_NETWORK_DETAILS,
        payload:data
    }
}

export const setNetworkTransactionType = (data) => {
    return {
        type:SET_NETWORK_TRANSACTION_TYPE,
        payload:data
    }
}