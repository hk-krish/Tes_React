export const MillisecondsToTime = (ms) => {
  // Convert milliseconds to seconds
  var seconds = Math.floor((ms / 1000) % 60);
  // Convert seconds to minutes
  var minutes = Math.floor((ms / (1000 * 60)) % 60);
  // Convert minutes to hours
  var hours = Math.floor(ms / (1000 * 60 * 60));

  // Add leading zeros if necessary
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
};
