import {
  ACTIVE_TAB,
  ALL_WEBSITE_DATA,
  ENTITY_ACTION_TYPE,
  FETCH_ENTITY_DATA,
  FETCH_WEBSITE_DATA,
} from "../../constants/ActionTypes";

export const fetchEntityData = (data) => {
  return {
    type: FETCH_ENTITY_DATA,
    payload: data,
  };
};

export const fetchWebsiteData = (data) => {
  return {
    type: FETCH_WEBSITE_DATA,
    payload: data,
  };
};

export const fetthAllWebsiteList = (data) => {
  return {
    type: ALL_WEBSITE_DATA,
    payload: data,
  };
};

export const fetchActiveTab = (data) => {
  return {
    type: ACTIVE_TAB,
    payload: data,
  };
};

export const entityActionType = (data) => {
  return {
    type: ENTITY_ACTION_TYPE,
    payload: data,
  };
};
