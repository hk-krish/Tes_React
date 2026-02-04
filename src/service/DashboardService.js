import ApiHelper from "./ApiHelper";

class DashboardService {
  static async getDashboard(data) {
    return ApiHelper.postAnonymous("/admin/dashboard", data);
  }
}
export default DashboardService;
