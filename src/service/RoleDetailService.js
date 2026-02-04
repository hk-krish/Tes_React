import ApiHelper from "./ApiHelper";

class RoleDetailService {
    static async getRoleDetailById(data) {
        return ApiHelper.postAnonymous(`/admin/role/details`, data);
    }
    static async EditRoleDetail(data) {
        return ApiHelper.postAnonymous("/admin/roledetails/edit", data);
    }
}

export default RoleDetailService;