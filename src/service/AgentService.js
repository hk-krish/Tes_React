import ApiHelper from "./ApiHelper";

class AgentService {
  static async addAgent(data) {
    return ApiHelper.postAnonymous("/admin/agent/add", data);
  }

  static async editAgent(data) {
    return ApiHelper.postAnonymous("/admin/agent/edit", data);
  }

  static async getAllAgent(data) {
    return ApiHelper.postAnonymous("/admin/agent/get/all", data);
  }

  static async getAgentById(id) {
    return ApiHelper.getAnonymous(`/admin/agent/${id}`);
  }

  static async deleteAgent(id) {
    return ApiHelper.deleteAnonymous(`/admin/agent/${id}`);
  }

  static async deleteAgentById(id) {
    return ApiHelper.deleteAnonymous(`/admin/agent/account/${id}`);
  }

  static async addAccount(data) {
    return ApiHelper.postAnonymous("/admin/agent/account/add", data);
  }

  static async editAccountById(data) {
    return ApiHelper.postAnonymous("/admin/agent/account/edit", data);
  }

  static async getAccountByAgentId(data) {
    return ApiHelper.postAnonymous("/admin/agent/account", data);
  }

  // static async getAccountByAgentId(id, searchData) {
  //     if (searchData) {
  //         return ApiHelper.getAnonymous(`/admin/agent/account/${id}?search=${searchData}`);
  //     } else {
  //         return ApiHelper.getAnonymous(`/admin/agent/account/${id}`);
  //     }
  // }

  static async getWebsiteById(data) {
    return ApiHelper.postAnonymous("/admin/agent/website", data);
  }
}
export default AgentService;
