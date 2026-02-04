import ServerURL from "./ServerURL";
import AuthLogic from "../util/AuthLogic";

// Function to handle user logout
function logoutUser() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user");
  localStorage.removeItem("id");
  localStorage.removeItem("user_token");
  localStorage.removeItem("sortBy");
  window.location.href = "/signin";
}
class ApiHelper {
  static headers() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  static getAnonymous(route, abortController) {
    return this.xhr(route, null, null, "GET", abortController);
  }

  static putAnonymous(route, params, abortController) {
    return this.xhr(route, params, null, "PUT", abortController);
  }

  static postAuthenticated(route, params, abortController) {
    return this.xhr(
      route,
      params,
      AuthLogic.GetToken(),
      "POST",
      abortController,
    );
  }

  static postAnonymous(route, params, abortController) {
    return this.xhr(route, params, null, "POST", abortController);
  }

  static deleteAnonymous(route, params, abortController) {
    return this.xhr(route, params, null, "DELETE", abortController);
  }

  static xhr(route, params, token = "", verb, abortController) {
    const host = ServerURL.getAPIUrl();
    const url = `${host}${route}`;
    let options = Object.assign(
      { method: verb },
      params ? { body: JSON.stringify(params) } : null,
    );
    if (abortController && abortController.signal) {
      options.signal = abortController.signal;
    }
    var myHeaders = new Headers();
    // myHeaders.append("X-Amz-Date", "20220411T064100Z");
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `"AWS4-HMAC-SHA256 Credential=${process.env.REACT_APP_ACCESS_KEY}/20220411/${process.env.REACT_APP_REGION}/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=808262d9d04cf7ef32b1cd75ad07c7489abe58782079cf7bac8aeb829b45d8cf"`);
    myHeaders.append("Authorization", localStorage.getItem("user_token"));
    options.headers = myHeaders;
    if (token) {
      options.headers = {
        ...options.headers,
      };
    }
    return fetch(url, options)
      .then((resp) => {
        if (resp.status === 401) {
          return { error: "Unauthorize!!!" };
        } else if (resp.status === 422) {
          logoutUser();
          return { error: "Token has been expired!" };
        }
        let json = resp.json();
        if (resp.ok) {
          return json;
        }
        return json.then((err) => {
          throw err;
        });
      })
      .catch((resp) => {
        return resp;
      });
  }
}

export default ApiHelper;
