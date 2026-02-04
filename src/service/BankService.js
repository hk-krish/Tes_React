import ApiHelper from "./ApiHelper";

class CommonAPIService {
  static async getBankAccount(data) {
    return ApiHelper.postAnonymous("/admin/account/get", data);
  }
}
export default CommonAPIService;
