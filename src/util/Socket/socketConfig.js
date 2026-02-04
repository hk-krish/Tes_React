const currentHostname = window.location.hostname;
const url_array = {
  localhost: process.env.REACT_APP_LOCALHOST_URL,
  "tes_admin_dev.cloudd.site": process.env.REACT_APP_TES_ADMIN_DEV_URL,
  "tes_admin_uat.cloudd.site": process.env.REACT_APP_TES_ADMIN_UAT_URL,
  "admin.paycorrect.fun": process.env.REACT_APP_ADMIN_PAYCORRECT_URL,
};

const socketServerURL = `${url_array[currentHostname]}`;
const socketPath = `/socket.io`;

export { socketServerURL, socketPath };
