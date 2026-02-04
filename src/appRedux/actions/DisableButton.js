import { ENABLE_BUTTON } from "../../constants/ActionTypes";

export const disableButton = (action) => {
  return {
    type: ENABLE_BUTTON,
    payload: action,
  };
};
