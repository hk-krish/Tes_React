export const useCalculatedTimeDifference = () => {
  return (createdAt, updatedAt) => {
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);

    const timeDifference = updatedDate - createdDate;
    const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3,600,000 milliseconds
    const remainingMilliseconds = timeDifference % 3600000;
    const minutes = Math.floor(remainingMilliseconds / 60000); // 1 minute = 60,000 milliseconds
    const seconds = Math.floor((remainingMilliseconds % 60000) / 1000); // 1 second = 1,000 milliseconds

    if (hours === 0) {
      return `${minutes.toString().padStart(2, "0")}m : ${seconds
        .toString()
        .padStart(2, "0")}s`;
    } else {
      return `${hours}h : ${minutes.toString().padStart(2, "0")}m : ${seconds
        .toString()
        .padStart(2, "0")}s`;
    }
  };
};
