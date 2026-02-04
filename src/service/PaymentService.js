import ApiHelper from "./ApiHelper";

class PaymentGetway {
  static async addPaymentGetway(data) {
    return ApiHelper.postAnonymous("/admin/payment/gateway/add", data);
  }

  static async editPaymentGetway(data) {
    return ApiHelper.postAnonymous("/admin/payment/gateway/edit", data);
  }

  static async getAllPaymentGetway(data) {
    return ApiHelper.postAnonymous("/admin/payment/gateway/get/all", data);
  }

  static async getPaymentGetwayById(id) {
    return ApiHelper.getAnonymous(`/admin/payment/gateway/${id}`);
  }

  static async deletePaymentGetway(id) {
    return ApiHelper.deleteAnonymous(`/admin/payment/gateway/delete/${id}`);
  }

  static async getAllPaymentGatewayReport(data) {
    return ApiHelper.postAnonymous(
      `/admin/transaction/payment/gateway/report`,
      data,
    );
  }
}
export default PaymentGetway;
