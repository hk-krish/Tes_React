import { SOUND_ON_OFF } from "../../constants/ActionTypes";

export const fetchSoundOnOff = (action) => {
  return {
    type: SOUND_ON_OFF,
    payload: action,
  };
};
