import ApiHelper from "./ApiHelper";

class SubAdminService {
  static async getAllSubAdmins(data) {
    return ApiHelper.postAnonymous(`/admin/sub-admin/get/all`, data);
  }

  static async getSubAdminById(id) {
    return ApiHelper.getAnonymous(`/admin/sub-admin/${id}`);
  }

  static async addSubAdmin(data) {
    return ApiHelper.postAnonymous("/admin/sub-admin/add", data);
  }

  static async editSubAdmin(data) {
    return ApiHelper.postAnonymous("/admin/sub-admin/edit", data);
  }
}
export default SubAdminService;