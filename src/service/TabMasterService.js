import ApiHelper from "./ApiHelper";

class TabMasterService {
  static async getAllTabmaster(data) {
    return ApiHelper.postAnonymous(`/admin/tabmaster/all`, data);
  }

  static async getTabmasterById(id) {
    return ApiHelper.getAnonymous(`/admin/tabmaster/${id}`);
  }

  static async addTabmaster(data) {
    return ApiHelper.postAnonymous("/admin/tabmaster/add", data);
  }

  static async editTabmaster(data) {
    return ApiHelper.postAnonymous("/admin/tabmaster/edit", data);
  }
}
export default TabMasterService;
