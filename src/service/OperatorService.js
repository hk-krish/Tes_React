import ApiHelper from "./ApiHelper";

class OperatorService {
  static async addOperator(data) {
    return ApiHelper.postAnonymous("/admin/operator/add", data);
  }

  static async editOperator(data) {
    return ApiHelper.postAnonymous("/admin/operator/edit", data);
  }

  static async getAllOperator(data) {
    return ApiHelper.postAnonymous("/admin/operator/get/all", data);
  }

  static async getOperatorById(id) {
    return ApiHelper.getAnonymous(`/admin/operator/${id}`);
  }

  static async deleteOperatorById(id) {
    return ApiHelper.deleteAnonymous(`/admin/operator/${id}`);
  }

  static async addOperatorBankAccountorUpi(data) {
    return ApiHelper.postAnonymous("/admin/operator/account/add", data);
  }

  static async editOperatorBankAccountById(data) {
    return ApiHelper.postAnonymous("/admin/operator/account/edit", data);
  }

  static async getAccountByOperatorId(data) {
    return ApiHelper.postAnonymous("/admin/operator/account", data);
  }
}
export default OperatorService;
