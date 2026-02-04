import ApiHelper from "./ApiHelper";

class WithdrawService {
  static async getWithdrawRequestByFilter(data) {
    return ApiHelper.postAnonymous("/admin/withdraw/get/all", data);
  }
  static async getWithdrawReportByFilter(data) {
    return ApiHelper.postAnonymous("/admin/transaction/withdraw/report", data);
  }
}
export default WithdrawService;
