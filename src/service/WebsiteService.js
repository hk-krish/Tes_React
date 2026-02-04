import ApiHelper from "./ApiHelper";

class WebsiteService {
  static async addWebsite(data) {
    return ApiHelper.postAnonymous("/admin/website/add", data);
  }

  static async editWebsite(data) {
    return ApiHelper.postAnonymous("/admin/website/edit", data);
  }

  static async getAllWebsite(data) {
    return ApiHelper.postAnonymous("/admin/website/get/all", data);
  }

  static async getWebsiteById(id) {
    return ApiHelper.getAnonymous(`/admin/website/${id}`);
  }

  static async getWebsiteReport(data) {
    return ApiHelper.postAnonymous(`/admin/website/report`, data);
  }

  static async deleteWebsite(id) {
    return ApiHelper.deleteAnonymous(`/admin/website/${id}`);
  }

  static async deleteWebsiteById(id) {
    return ApiHelper.deleteAnonymous(`/admin/website/account/${id}`);
  }

  static async addWebsiteAccount(data) {
    return ApiHelper.postAnonymous("/admin/website/account/add", data);
  }

  static async editWebsiteAccountById(data) {
    return ApiHelper.postAnonymous("/admin/website/account/edit", data);
  }

  static async withdraw(data) {
    return ApiHelper.postAnonymous("/user/withdraw", data);
  }
  static async deposit(data) {
    return ApiHelper.postAnonymous("/user/deposit", data);
  }

  static async getAccountByWebsiteId(data) {
    return ApiHelper.postAnonymous("/admin/website/account", data);
  }

  // static async getAccountByWebsiteId(id, searchData) {
  //     if (searchData) {
  //         return ApiHelper.getAnonymous(`/admin/website/account/${id}?search=${searchData}`);
  //     } else {
  //         return ApiHelper.getAnonymous(`/admin/website/account/${id}`);
  //     }
  // }
}
export default WebsiteService;
