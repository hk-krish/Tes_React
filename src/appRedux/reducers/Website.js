import {
  FETCH_ASSIGN_VENDOR_DATA,
  FETCH_VENDOR_DATA,
  WEBSITE_ACTION_TYPE,
} from "../../constants/ActionTypes";

const INIT_STATE = {
  addEditAction: true,
  fetchVendorData: null,
  fetchAssignVendorData: null,
};

const websiteReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case WEBSITE_ACTION_TYPE: {
      return {
        ...state,
        addEditAction: action.payload,
      };
    }
    case FETCH_VENDOR_DATA: {
      return {
        ...state,
        fetchVendorData: action.payload,
      };
    }
    case FETCH_ASSIGN_VENDOR_DATA: {
      return {
        ...state,
        fetchAssignVendorData: action.payload,
      };
    }
    default:
      return state;
  }
};

export default websiteReducer;
