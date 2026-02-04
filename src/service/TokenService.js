import jwt from "jsonwebtoken";

export function GetCurrentLoggedUserDetails() {
  const userAccessToken = localStorage.getItem("user_token");
  if (userAccessToken) {
    return jwt.decode(userAccessToken.replace("Bearer ", ""));
  }
  return null;
}
