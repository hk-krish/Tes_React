import ApiHelper from "./ApiHelper";

class TransactionReportServices {
  static async addTransactionReport(data) {
    return ApiHelper.postAnonymous("/admin/agent/add", data);
  }

  static async editTransactionReport(data) {
    return ApiHelper.postAnonymous("/admin/agent/edit", data);
  }

  static async editTransactionReportStatus(data) {
    return ApiHelper.postAnonymous("/admin/transaction/edit", data);
  }

  static async getAllTransactionReport(data) {
    return ApiHelper.postAnonymous("/admin/transaction/report", data);
  }

  static async getAgentById(id) {
    return ApiHelper.getAnonymous(`/admin/agent/${id}`);
  }

  static async deleteAgentById(id) {
    return ApiHelper.deleteAnonymous(`/admin/agent/${id}`);
  }

  static async addAccount(data) {
    return ApiHelper.postAnonymous("/admin/agent/account/add", data);
  }

  static async editAccountById(data) {
    return ApiHelper.postAnonymous("/admin/agent/account/edit", data);
  }

  static async getAccountByAgentId(id) {
    return ApiHelper.getAnonymous(`/admin/agent/account/${id}`);
  }

  static async getDailyTransactionById(data) {
    return ApiHelper.postAnonymous(`/admin/account/daily/trasaction`, data);
  }
}
export default TransactionReportServices;
