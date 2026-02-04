import {
  FETCH_ASSIGN_VENDOR_DATA,
  FETCH_VENDOR_DATA,
} from "../../constants/ActionTypes";

export const fetchVendorData = (data) => {
  return {
    type: FETCH_VENDOR_DATA,
    payload: data,
  };
};

export const fetchAssignVendorData = (data) => {
  return {
    type: FETCH_ASSIGN_VENDOR_DATA,
    payload: data,
  };
};
