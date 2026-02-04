import ApiHelper from "./ApiHelper";

class UserService {
  static async GetAllUsers(body, abortController) {
    return ApiHelper.getAnonymous("user", body, abortController);
  }
  static async GetAllUserData(body, abortController) {
    return ApiHelper.postAnonymous(
      "/admin/user/get/all",
      body,
      abortController,
    );
  }
  static async GetAllTransactionReportsData(body, abortController) {
    return ApiHelper.postAnonymous(
      "/admin/transaction/user/report",
      body,
      abortController,
    );
  }

  static async GetAllBankAccountDetails(id) {
    return ApiHelper.getAnonymous(`/admin/user/accounts/${id}`);
  }

  static async DeleteUser(id) {
    return ApiHelper.deleteAnonymous(`user/${id}`);
  }

  static async UpdateUser(body) {
    return ApiHelper.putAnonymous(`user/update`, body);
  }
  static async GetUserById(id) {
    return ApiHelper.getAnonymous(`/admin/user/${id}`);
  }

  static async editUser(body) {
    return ApiHelper.postAnonymous(`/admin/user/edit`, body);
  }

  static async getAllExchangeTransactions(body) {
    return ApiHelper.postAnonymous(`/admin/withdraw/user/get/all`, body);
  }

  static async editExchangeTransaction(body) {
    return ApiHelper.postAnonymous(`/admin/withdraw/user/edit`, body);
  }

  static async getExchangeTransactionCount(body) {
    return ApiHelper.getAnonymous(`/admin/amount/wise/transaction/count`, body);
  }
}

export default UserService;
