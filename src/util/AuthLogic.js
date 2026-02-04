import jwt from "jsonwebtoken";

class AuthLogic {
  static IsLoggedIn() {
    var token = localStorage.getItem("token");
    return token != null;
  }

  static GetToken() {
    return localStorage.getItem("user_token");
  }

  static SetLoggedIn(token) {
    localStorage.setItem("token", token);
  }

  static async GetUser() {
    let token = localStorage.getItem("user_token");
    let decodedToken = jwt.decode(token);
    return decodedToken;
  }
}

export default AuthLogic;
