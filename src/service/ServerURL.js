const url_array = {
  localhost: process.env.REACT_APP_LOCALHOST_URL,
  "tes_admin_dev.cloudd.site": process.env.REACT_APP_TES_ADMIN_DEV_URL,
  "tes_admin_uat.cloudd.site": process.env.REACT_APP_TES_ADMIN_UAT_URL,
  "admin.paycorrect.fun": process.env.REACT_APP_ADMIN_PAYCORRECT_URL,
};
class ServerURL {
  static getAPIUrl() {
    //  var apiURL = 'http://localhost:4000';
    //  var apiURL = 'https://tes_api_dev.cloudd.live';
    var apiURL = url_array[window.location.hostname];
    return apiURL;
  }
}
export default ServerURL;
