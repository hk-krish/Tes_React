import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";
import EntityPayment from "./EntityPayment";
import PaymentGateway from "./PaymentGateway";
import Website from "./Website";
import DisableButton from "./DisableButton";
import BankAccount from "./BankAccount";
import CryptoNetwork from "./CryptoNetwork";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    settings: Settings,
    auth: Auth,
    common: Common,
    button: DisableButton,
    entityPayment: EntityPayment,
    paymentGateway: PaymentGateway,
    website: Website,
    bankAccount: BankAccount,
    cryptoNetworkDetails:CryptoNetwork
  });

export default createRootReducer;
