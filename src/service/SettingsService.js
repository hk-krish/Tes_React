import ApiHelper from "./ApiHelper";

class SettingsService {
  static async getSettings() {
    return ApiHelper.postAnonymous(`/admin/setting/get`);
  }
  static async editSettings(data) {
    return ApiHelper.postAnonymous(`/admin/setting/edit`, data);
  }
}
export default SettingsService;
