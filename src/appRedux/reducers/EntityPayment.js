import {
  ACTIVE_TAB,
  ALL_WEBSITE_DATA,
  ENTITY_ACTION_TYPE,
  FETCH_ENTITY_DATA,
  FETCH_WEBSITE_DATA,
} from "../../constants/ActionTypes";

const INIT_STATE = {
  allWebsite: null,
  websiteData: null,
  entityData: null,
  activeTab: "1",
  actionType: null,
};

const WebsiteReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_ENTITY_DATA: {
      return {
        ...state,
        entityData: action.payload,
      };
    }
    case FETCH_WEBSITE_DATA: {
      return {
        ...state,
        websiteData: action.payload,
      };
    }
    case ALL_WEBSITE_DATA: {
      return {
        ...state,
        allWebsite: action.payload,
      };
    }
    case ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.payload,
      };
    }
    case ENTITY_ACTION_TYPE: {
      return {
        ...state,
        actionType: action.payload,
      };
    }
    default:
      return state;
  }
};

export default WebsiteReducer;
