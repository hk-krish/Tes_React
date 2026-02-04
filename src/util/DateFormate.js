import moment from "moment-timezone";

export const onDateFormate = (date, dateType) => {
  return moment(date).tz(localStorage.getItem("timezone")).format(dateType);
};
