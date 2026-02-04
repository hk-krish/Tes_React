import ApiHelper from "./ApiHelper";

class DepositeService {
  static async getDepositeRequestByFilter(data) {
    return ApiHelper.postAnonymous("/admin/deposit/get/all", data);
  }
  static async editDepositReportStatus(data) {
    return ApiHelper.postAnonymous("/admin/deposit/edit", data);
  }
}
export default DepositeService;
