import { SOUND_ON_OFF } from "../../constants/ActionTypes";

const INIT_STATE = {
  handleSound: true,
};

const SoundReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SOUND_ON_OFF: {
      return {
        ...state,
        handleSound: action.payload,
      };
    }

    default:
      return state;
  }
};

export default SoundReducer;
