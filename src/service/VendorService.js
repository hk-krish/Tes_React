import ApiHelper from "./ApiHelper";

class VendorService {
  static async addVendor(data) {
    return ApiHelper.postAnonymous("/admin/vendor/add", data);
  }

  static async editVendor(data) {
    return ApiHelper.postAnonymous("/admin/vendor/edit", data);
  }

  static async getAllVendor(data) {
    return ApiHelper.postAnonymous("/admin/vendor/get/all", data);
  }

  static async getVendorById(id) {
    return ApiHelper.getAnonymous(`/admin/vendor/${id}`);
  }

  static async deleteVendor(id) {
    return ApiHelper.deleteAnonymous(`/admin/vendor/${id}`);
  }

  static async deleteVendorById(id) {
    return ApiHelper.deleteAnonymous(`/admin/vendor/account/${id}`);
  }

  static async addVendorBankAccountorUpi(data) {
    return ApiHelper.postAnonymous("/admin/vendor/account/add", data);
  }

  static async editVendorBankAccountById(data) {
    return ApiHelper.postAnonymous("/admin/vendor/account/edit", data);
  }

  static async getAccountByVendorId(data) {
    return ApiHelper.postAnonymous("/admin/vendor/account", data);
  }

  // static async getAccountByVendorId(id, searchData) {
  //   if (searchData) {
  //     return ApiHelper.getAnonymous(`/admin/vendor/account/${id}?search=${searchData}`);
  //   } else {
  //     return ApiHelper.getAnonymous(`/admin/vendor/account/${id}`);
  //   }
  // }

  static async getVendorReport(data) {
    return ApiHelper.postAnonymous(`/admin/vendor/report`, data);
  }
}
export default VendorService;
