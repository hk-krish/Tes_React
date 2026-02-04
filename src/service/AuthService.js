import ApiHelper from "./ApiHelper";

class AuthService {
  static async SignIn(body) {
    return ApiHelper.postAnonymous("/admin/login", body);
  }
  static async editAdmin(data) {
    return ApiHelper.postAnonymous("/admin/edit", data);
  }
}
export default AuthService;
