export const convertMillisToMinutes = (milliseconds) => {
  return Math.floor(milliseconds / (1000 * 60)); // Returns whole number minutes
};

export const convertMinutesToMillis = (minute) => {
  return Math.floor(minute * 60 * 1000); // Returns whole number minutes
};
