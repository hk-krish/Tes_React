import { ENABLE_BUTTON } from "../../constants/ActionTypes";

const INIT_STATE = {
  isButtonEnabled: false,
};

const disableButtonReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ENABLE_BUTTON: {
      return {
        ...state,
        isButtonEnabled: action.payload,
      };
    }
    default:
      return state;
  }
};

export default disableButtonReducer;
