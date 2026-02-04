export const validationRules = {
  userName: [{ required: true, message: "Please enter your user name!" }],
  websiteName: [{ required: true, message: "Please enter your website name!" }],
  remarks: [{ required: true, message: "Please enter your remarks!" }],
  userPassword: [
    { required: true, message: "Please enter your password!" },
    { min: 6, message: "Password must be at least 6 characters long." },
    {
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+$/,
      message:
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.",
    },
  ],
  transactionPassword: [
    { required: true, message: "Please enter your transaction password!" },
  ],
  password: [{ required: true, message: "Please enter your password!" }],
  url: [
    {
      required: true,
      message: "Please enter your website URL!",
    },
    {
      pattern:
        /^((http|https):\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i,
      message:
        "Please enter a valid website URL (e.g., https://www.example.com/)!",
    },
  ],
  backendUrl: [
    {
      required: true,
      message: "Please enter your website Backend URL!",
    },
    {
      pattern:
        /^((http|https):\/\/)[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/i,
      message:
        "Please enter a valid website Backend URL (e.g., https://www.example.com/)!",
    },
  ],
  depositSuccessUrl: [
    {
      pattern:
        /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i,
      message:
        "Please enter your valid website Deposit Success URL (ex. - https://www.example.com/)!",
    },
  ],
  depositDeclineUrl: [
    {
      pattern:
        /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i,
      message:
        "Please enter your valid Deposit Decline URL (ex. - https://www.example.com/)!",
    },
  ],
  withdrawSuccessUrl: [
    {
      pattern:
        /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i,
      message:
        "Please enter your valid Withdraw Success URL (ex. - https://www.example.com/)!",
    },
  ],
  withdrawDeclineUrl: [
    {
      pattern:
        /^((http|https):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i,
      message:
        "Please enter your valid Withdraw Decline URL (ex. - https://www.example.com/)!",
    },
  ],
  maximumDepositTime: [
    {
      required: true,
      message: "Please enter your maximum deposit time!",
    },
    {
      pattern: /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
      message: "Please enter only numerical characters!",
    },
  ],
  maximumWithdrawTime: [
    {
      required: true,
      message: "Please enter your maximum withdraw time!",
    },
    {
      pattern: new RegExp(/^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/),
      message: "Please enter only numerical characters!",
    },
  ],
  utrId: [
    { required: true, message: "Please enter UTR Transaction ID!" },
    { pattern: /^[a-zA-Z0-9]*$/, message: "No special characters allowed!" },
  ],
  amount: [{ required: true, min: 1, message: "Please enter an amount!" }],
  depositExchCommission: [
    { required: true, message: "Please enter Deposit Exch Commission!" },
    {
      pattern: /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
      message: "Please enter only numerical characters!",
    },
  ],
  withdrawExchCommission: [
    { required: true, message: "Please enter Withdraw Exch Commission!" },
    {
      pattern: /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
      message: "Please enter only numerical characters!",
    },
  ],
  depositTESCommission: [
    { required: true, message: "Please enter Deposit TES Commission!" },
    {
      pattern: /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
      message: "Please enter only numerical characters!",
    },
  ],
  withdrawTESCommission: [
    { required: true, message: "Please enter Withdraw TES Commission!" },
    {
      pattern: /^([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
      message: "Please enter only numerical characters!",
    },
  ],
};
