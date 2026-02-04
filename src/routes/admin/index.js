import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";
import asyncComponent from "../../util/asyncComponent";
const SubAdmins = lazy(() => import("./SubAdmins/index.js"));
const AddSubAdmins = lazy(() => import("./SubAdmins/AddSubAdmin/index.js"));
const EditSubAdmins = lazy(() => import("./SubAdmins/AddSubAdmin/index.js"));

const AddAgent = lazy(() => import("./usersList/EditAgent/index.js"));
const EditAgent = lazy(() => import("./usersList/EditAgent/index.js"));
const TabMaster = lazy(() => import("./TabMaster/index.js"));
const AddTabMaster = lazy(() => import("./TabMaster/AddTabMaster/index.js"));
const EditTabMaster = lazy(() => import("./TabMaster/AddTabMaster/index.js"));
const Role = lazy(() => import("./Roles/index.js"));
const AddRole = lazy(() => import("./Roles/AddRole/index.js"));
const EditRole = lazy(() => import("./Roles/AddRole/index.js"));
const AddWebsite = lazy(() => import("./websiteList/EditWebsite/index.js"));
const EditWebsite = lazy(() => import("./websiteList/EditWebsite/index.js"));
const AddVendor = lazy(() => import("./Vendor/AddVendor/index.js"));
const EditVendor = lazy(() => import("./Vendor/AddVendor/index.js"));
const Bank = lazy(() => import("./bank/index.js"));
const AddBank = lazy(() => import("./AddBankList/index.js"));
const EditBank = lazy(() => import("./AddBankList/index.js"));
const UserReport = lazy(() => import("./User/TransactionReport/index.js"));
const AddOperator = lazy(() => import("./Operator/AddOperator/index.js"));
const EditOperator = lazy(() => import("./Operator/AddOperator/index.js"));
const AddPaymentGetway = lazy(
  () => import("./PaymentGetway/AddPaymentGetway/index.js"),
);
const EditPaymentGetway = lazy(
  () => import("./PaymentGetway/AddPaymentGetway/index.js"),
);
const ErrorPage = lazy(() => import("./NoFound/index.js"));

const Admin = ({ match }) => (
  <div className="gx-main-content-wrapper">
    {/* <h1>Content Title in ./admin</h1> */}
    <Switch>
      <Route
        path={`${match.url}dashboard`}
        exact
        component={asyncComponent(() => import("./Dashboard/index.js"))}
      />
      <Route path={`${match.url}sub-admins`} exact component={SubAdmins} />
      <Route
        path={`${match.url}sub-admins/addSubAdmin`}
        exact
        component={AddSubAdmins}
      />
      <Route
        path={`${match.url}sub-admins/editSubAdmin`}
        exact
        component={EditSubAdmins}
      />
      <Route
        path={`${match.url}agents`}
        exact
        component={asyncComponent(() => import("./usersList/index.js"))}
      />
      <Route
        path={`${match.url}agents/editagent`}
        exact
        component={EditAgent}
      />
      <Route path={`${match.url}agents/addagent`} exact component={AddAgent} />
      <Route path={`${match.url}tabmaster`} exact component={TabMaster} />
      <Route
        path={`${match.url}tabmaster/addtabmaster`}
        exact
        component={AddTabMaster}
      />
      <Route
        path={`${match.url}tabmaster/edittabmaster`}
        exact
        component={EditTabMaster}
      />
      <Route path={`${match.url}role`} exact component={Role} />
      <Route path={`${match.url}role/addrole`} exact component={AddRole} />
      <Route path={`${match.url}role/editrole`} exact component={EditRole} />
      <Route
        path={`${match.url}website`}
        exact
        component={asyncComponent(() => import("./websiteList/index.js"))}
      />
      <Route
        path={`${match.url}websites/editwebsite`}
        exact
        component={EditWebsite}
      />
      <Route
        path={`${match.url}websites/addwebsite`}
        exact
        component={AddWebsite}
      />
      <Route path={`${match.url}bank`} exact component={Bank} />
      <Route path={`${match.url}bank/editbank`} exact component={EditBank} />
      <Route path={`${match.url}bank/addbank`} exact component={AddBank} />
      <Route
        path={`${match.url}operator`}
        exact
        component={asyncComponent(() => import("./Operator/index"))}
      />
      <Route
        path={`${match.url}operator/editoperator`}
        exact
        component={EditOperator}
      />
      <Route
        path={`${match.url}operator/addoperator`}
        exact
        component={AddOperator}
      />
      <Route
        path={`${match.url}commonpage`}
        exact
        component={asyncComponent(() => import("./CommonPage/index.js"))}
      />
      <Route
        path={`${match.url}commission-summary`}
        exact
        component={asyncComponent(() => import("./Commission/index.js"))}
      />
      <Route
        path={`${match.url}deposit/queue`}
        exact
        component={asyncComponent(() => import("./Deposit/index.js"))}
      />
      <Route
        path={`${match.url}deposit-auto-queue`}
        exact
        component={asyncComponent(() => import("./Deposit/index.js"))}
      />
      <Route
        path={`${match.url}withdraw/queue`}
        exact
        component={asyncComponent(() => import("./Withdraw/index.js"))}
      />
      <Route
        path={`${match.url}withdraw-pending-report`}
        exact
        component={asyncComponent(() => import("./Withdraw/index.js"))}
      />
      <Route
        path={`${match.url}vendor`}
        exact
        component={asyncComponent(() => import("./Vendor/index.js"))}
      />
      <Route
        path={`${match.url}vendor/addvendor`}
        exact
        component={AddVendor}
      />
      <Route
        path={`${match.url}vendor/editvendor`}
        exact
        component={EditVendor}
      />
      <Route
        path={`${match.url}setting`}
        exact
        component={asyncComponent(() => import("./Settings/index.js"))}
      />
      <Route
        path={`${match.url}deposit/report`}
        exact
        component={asyncComponent(() => import("./TransactionReport/index.js"))}
      />
      <Route
        path={`${match.url}vendor/report`}
        exact
        component={asyncComponent(() => import("./VendorReport/index"))}
      />
      <Route
        path={`${match.url}user`}
        exact
        component={asyncComponent(() => import("./User/index.js"))}
      />
      <Route
        path={`${match.url}user/edituser`}
        exact
        component={asyncComponent(() => import("./User/EditUser/index.js"))}
      />
      <Route
        path={`${match.url}user/transactionReport`}
        exact
        component={UserReport}
      />
      <Route
        path={`${match.url}withdraw/report`}
        exact
        component={asyncComponent(() => import("./WithdrawReport/index"))}
      />
      <Route
        path={`${match.url}website-report`}
        exact
        component={asyncComponent(() => import("./WebsiteReport/index"))}
      />
      <Route
        path={`${match.url}payment-gateway`}
        exact
        component={asyncComponent(() => import("./PaymentGetway/index.js"))}
      />
      <Route
        path={`${match.url}payment-gateway/addpaymentgetway`}
        exact
        component={AddPaymentGetway}
      />
      <Route
        path={`${match.url}payment-gateway/editpaymentgetway`}
        exact
        component={EditPaymentGetway}
      />
      <Route
        path={`${match.url}payment-gateway-report`}
        exact
        component={asyncComponent(
          () => import("./PaymentGatewayReport/index.js"),
        )}
      />
      <Route
        path={`${match.url}transaction-list`}
        exact
        component={asyncComponent(() => import("./TransactionList/index.js"))}
      />
      <Route
        path={`${match.url}coins`}
        exact
        component={asyncComponent(() => import("./Coins/index.js"))}
      />
      <Route
        path={`${match.url}auto-coin-config`}
        exact
        component={asyncComponent(
          () => import("./Coins/AutoCoinConfig/index.js"),
        )}
      />
      <Route
        path={`${match.url}coins/add-coin-details`}
        exact
        component={asyncComponent(
          () => import("./Coins/AddCoinDetails/index.js"),
        )}
      />
      <Route
        path={`${match.url}coins/edit-coin-details`}
        exact
        component={asyncComponent(
          () => import("./Coins/AddCoinDetails/index.js"),
        )}
      />
      <Route
        path={`${match.url}history`}
        exact
        component={asyncComponent(() => import("./History/index.js"))}
      />
      <Route
        path={`${match.url}coins/networks`}
        exact
        component={asyncComponent(() => import("./CoinNetworks/index.js"))}
      />
      <Route
        path={`${match.url}deposit-verification-queue`}
        exact
        component={asyncComponent(() => import("./Deposit/index.js"))}
      />
      <Route
        path={`${match.url}exchange-transactions`}
        exact
        component={asyncComponent(
          () => import("./ExchangeTransactions/index.js"),
        )}
      />
      <Route
        path={`${match.url}transactions`}
        exact
        component={asyncComponent(
          () => import("./ExchangeTransactions/transactionCount.js"),
        )}
      />
      <Route path={`${match.url}*`} exact component={ErrorPage} />
    </Switch>
  </div>
);

export default Admin;
