const SET_CREDENTIALS = "SET_CREDENTIALS";
const CLEAR_CREDENTIALS = "CLEAR_CREDENTIALS";

export const setCredentials = (email, password) => {
  return {
    type: SET_CREDENTIALS,
    email,
    password,
  };
};

export const clearCredentials = () => {
  return {
    type: CLEAR_CREDENTIALS,
  };
};

const initialState = {
  email: null,
  password: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CREDENTIALS:
      return {
        ...state,
        email: action.email,
        password: action.password,
      };
    case CLEAR_CREDENTIALS:
      return {
        ...state,
        email: null,
        password: null,
      };
    default: {
      return state;
    }
  }
};

export default reducer;
