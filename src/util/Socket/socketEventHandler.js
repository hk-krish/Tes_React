import notify from "../../Notification";
import { socket, depositSound } from "./socketClient";
import moment from "moment-timezone";

const handleSocketEvent = (
  event,
  showNotification = true,
  callback,
  handleSoundUpdate,
) => {
  socket.on(event, ({ data }) => {
    const newData = data[0];
    const currentTimezone = localStorage.getItem("timezone");
    if(newData && moment(newData?.createdAt).tz(currentTimezone, true).isAfter(moment.tz(currentTimezone))) {
      return;
    }
    if (newData && showNotification) {
      notify.openNotification(callback(newData));
    }
    return callback(newData);
  });
};

const handleSocketEvent2 = (event, callback) => {
  socket.on(event, (data) => {
    const newData = data;
    return callback(newData);
  });
};

const handleSocketEvent3 = (event, callback) => {
  socket.on(event, (data) => {
    return callback(data?.data);
  });
};

export { handleSocketEvent, handleSocketEvent2, handleSocketEvent3 };
