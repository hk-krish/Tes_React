import ApiHelper from "./ApiHelper";

class EntityGetway {
  static async addEntityGetway(data) {
    return ApiHelper.postAnonymous("/admin/entity/payment/gateway/add", data);
  }

  static async editEntityGetway(data) {
    return ApiHelper.postAnonymous("/admin/entity/payment/gateway/edit", data);
  }

  static async getAllEntityGetway(data) {
    return ApiHelper.postAnonymous(
      "/admin/entity/payment/gateway/get/all",
      data,
    );
  }

  static async getEntityGetwayById(id) {
    return ApiHelper.getAnonymous(`/admin/entity/payment/gateway/${id}`);
  }
}
export default EntityGetway;
