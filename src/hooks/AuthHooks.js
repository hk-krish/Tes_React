// import { useQuery, useLazyQuery } from "@apollo/client";
// import jwt from "jsonwebtoken";
// import { signIn, verifyOtp } from "../graphql/Queries/AuthQueries";

// export function useLoginUsers() {
//   const [signinUser] = signIn;
//   return {
//     signinUser,
//   };
// }

// export function OTPverification() {
//   const [signinUserOtp] = useLazyQuery(verifyOtp);
//   return {
//     signinUserOtp,
//   };
// }

// export function GetCurrentLoggedUserDetails() {
//   const userAccessToken = localStorage.getItem("user_token");
//   if (userAccessToken) {
//     return jwt.decode(userAccessToken.replace("Bearer ", ""));
//   }
//   return null;
// }
