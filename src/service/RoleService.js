import ApiHelper from "./ApiHelper";

class RoleService {
  static async getAllRole(data) {
    return ApiHelper.postAnonymous(`/admin/role/get/all`, data);
  }

  static async getRoleById(id) {
    return ApiHelper.getAnonymous(`/admin/role/${id}`);
  }

  static async addRole(data) {
    return ApiHelper.postAnonymous("/admin/role/add", data);
  }

  static async editRole(data) {
    return ApiHelper.postAnonymous("/admin/role/edit", data);
  }
}
export default RoleService;