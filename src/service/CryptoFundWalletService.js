import ApiHelper from "./ApiHelper";

class CryptoFundWalletService {
    static async getAllCryptoFundWallet(data) {
        return ApiHelper.postAnonymous(`/admin/crypto-fund-wallet/all`, data);
    }
    static async getCryptoFundWalletById(id) {
        return ApiHelper.getAnonymous(`/admin/crypto-fund-wallet/${id}`);
    }
    static async addNewCryptoFundWallet(data) {
        return ApiHelper.postAnonymous(`/admin/crypto-fund-wallet/add`, data);
    }
    static async editCryptoFundWallet(data) {
        return ApiHelper.postAnonymous(`/admin/crypto-fund-wallet/edit`, data);
    }
}

export default CryptoFundWalletService;