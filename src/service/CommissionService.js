import ApiHelper from "./ApiHelper";

class CommossionService {
  static async getCommission(data) {
    return ApiHelper.postAnonymous("/admin/commission/get/all", data);
  }

  static async getAssignVendorById(websiteId, vendorId, transactionType) {
    return ApiHelper.getAnonymous(
      `/admin/website/vendor/${websiteId}/${vendorId}/${transactionType}`,
    );
  }

  static async getAssignVendor(data) {
    return ApiHelper.postAnonymous("/admin/website/vendor/get/all", data);
  }

  static async addCommission(data) {
    return ApiHelper.postAnonymous("/admin/website/vendor/add", data);
  }

  static async editCommission(data) {
    return ApiHelper.postAnonymous("/admin/website/vendor/edit", data);
  }

  static async editAdminCommission(data) {
    return ApiHelper.postAnonymous("/admin/commission/edit", data);
  }

  static async getDailyCommissionReport(data) {
    return ApiHelper.postAnonymous("/admin/commission/daily/get/all", data);
  }

  static async getCommissionTransactionReport(data) {
    return ApiHelper.postAnonymous(
      "/admin/commission/settlement/daily/get/all",
      data,
    );
  }
}
export default CommossionService;
