import { WEBSITE_ACTION_TYPE } from "../../constants/ActionTypes";

export const websiteActionType = (data) => {
  return {
    type: WEBSITE_ACTION_TYPE,
    payload: data,
  };
};
