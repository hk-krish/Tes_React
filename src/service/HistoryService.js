import ApiHelper from "./ApiHelper";

class HistoryService {
  static async getHistory(data) {
    return ApiHelper.postAnonymous("/admin/history/get/all", data);
  }
}
export default HistoryService;
