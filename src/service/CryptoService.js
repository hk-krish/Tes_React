import ApiHelper from "./ApiHelper";

class CryptoService {
  static async getAllCoins(data) {
    return ApiHelper.postAnonymous(`/admin/coin/all`,data); //Gets All Details of Coins
  }
  static async getSingleCoin(id) {
    return ApiHelper.getAnonymous(`/admin/coin/${id}`); //Gets Single Details of Coin
  }
  static async addNewCoin(data) {
    return ApiHelper.postAnonymous(`/admin/coin/add`, data); //Adds a new Coin
  }
  static async editCoin(data) {
    return ApiHelper.postAnonymous(`/admin/coin/edit`, data); //Edits Existing Coin
  }
  static async editAllCoin(data) {
    return ApiHelper.postAnonymous(`/admin/coin/edit/all`, data); //Edits Existing Coin
  }
  static async addCoinNetwork(data) {
    return ApiHelper.postAnonymous(`/admin/coin/network/add`, data); //Edits Existing Coin
  }
  static async editCoinNetwork(data) {
    return ApiHelper.postAnonymous(`/admin/coin/network/edit`, data); //Edits Existing Coin
  }
  static async getAllCoinNetworks(data) {
    return ApiHelper.postAnonymous(`/admin/coin/network/all`, data); //Gets All Coin Networks
  }
  static async getCoinNetworksById(id) {
    return ApiHelper.getAnonymous(`/admin/coin/network/${id}`); //Edits Existing Coin
  }
  static async deleteCoinNetwork(id) {
    return ApiHelper.getAnonymous(`/admin/coin/network/${id}`); //Edits Existing Coin
  }
  static async getSingleNetworkDetails(id) {
    return ApiHelper.getAnonymous(`/admin/coin/network/getsingleNetwork/${id}`); //Edits Existing Coin
  }
}

export default CryptoService;
