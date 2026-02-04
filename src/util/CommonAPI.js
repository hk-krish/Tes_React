import { message } from "antd";
import CommonAPIService from "../service/BankService";
import { fetchBankAccount } from "../appRedux/actions/BankAccount";

export const bankAccountAPI =
  (type, requestType, entity) => async (dispatch) => {
    let entityId = entity === undefined ? null : entity;
    let reqType =
      requestType === undefined || requestType === "all" ? null : requestType;
    await CommonAPIService.getBankAccount({
      type,
      reqType,
      entityId,
    })
      .then((response) => {
        // Sort alphabetically by `name` (case-insensitive) 
        const sortedData = [...(response?.data || [])].sort((a, b) =>
          a.name?.toLowerCase().localeCompare(b.name?.toLowerCase()),
        );
        dispatch(fetchBankAccount(sortedData));
      })
      .catch((err) => {
        console.log(err);
        message.error(err.message);
      });
  };
