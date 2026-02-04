import { notification } from "antd";

const notify = {
  openNotificationWithIcon(type, title, description, downloadMSG) {
    notification[type]({
      message: title,
      description: description,
    });
  },
  openNotification(description) {
    notification.open({
      description: description,
    });
  },
  infoNotification(description, downloadMSG) {
    notification.info({
      message: downloadMSG,
      description: description,
    });
  },
  successNotification(description, downloadMSG) {
    notification.success({
      message: downloadMSG,
      description: description,
    });
  },
};

export default notify;
