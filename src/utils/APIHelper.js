import DataStore from "./DataStore";

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const API_BASE_URL = SERVER_HOST + import.meta.env.VITE_API_PREFIX;

export const BUDGET_API_URL = `/users/:userId/budget`;
export const BUDGET_ADD_API_URL = "/users/:userId/budget/add-transaction";
export const BUDGET_UPDATE_API_URL = "/users/:userId/budget/update-transaction";
export const BUDGET_UPLOAD_API_URL = "/users/:userId/budget/upload-transaction";
export const BUDGET_EXPENSE_API_URL = "/users/:userId/expenses/:type";
export const BUDGET_FE_URL = "/budget";
export const BUDGET_ADD_FE_URL = "/budget/add";
export const BUDGET_UPLOAD_FE_URL = "/upload";
export const BUDGET_EXPENSES_EXP_FE_URL = "/expenses/expense";
export const BUDGET_EXPENSES_INC_FE_URL = "/expenses/income";
export const BUDGET_EXPENSES_FE_URL = "/expenses/{type}";

const CONTENT_TYPE = "Content-Type";
const APPLICATION_JSON = "application/json";
const defaultHeader = { [CONTENT_TYPE]: APPLICATION_JSON };

const { getItem } = DataStore();

const createHeaders = (tokenData, sendEmptyHeader = false) => {
  let headers = {};

  if (!sendEmptyHeader) {
    headers = { ...{ [CONTENT_TYPE]: APPLICATION_JSON } };
  }

  if (tokenData) {
    headers[
      "Authorization"
    ] = `${tokenData.body.token_type} ${tokenData.body.token}`;
  }
  console.log("APIHelper || createHeaders::", headers);
  return headers;
};

function resolveUrlPath(pathTemplate, params = {}) {
  console.log("resolveUrlPath || params", params);
  return pathTemplate.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (params[key] === undefined) {
      throw new Error(`Missing value for URL parameter: "${key}"`);
    }
    return encodeURIComponent(params[key]);
  });
}

// export async function get(url, params = {}, header = {}, tokenData) {
//   try {
//     let apiHeader = {
//       method: "GET",
//     };
//     if (tokenData && tokenData.body) {
//       apiHeader.headers = createHeaders(tokenData);
//     }
//     const urlWithParams = `${url}?${params.toString()}`;
//     console.log("APIHelper || GET API::", urlWithParams, apiHeader);
//     const response = await fetch(API_BASE_URL + urlWithParams, apiHeader);
//     if (!response.ok) {
//       console.log(
//         "APIHelper || response error",
//         response,
//         response.status,
//         response.statusText
//       );
//       throw new Error("Failed to fetch");
//     }
//     return response.json();
//   } catch (response) {
//     console.log("APIHelper || response error", response);
//     console.log(response.status, response.statusText);
//   }
// }

export const getRequest = async (
  path,
  params = {},
  requireToken = false,
  sendEmptyHeader = false,
  urlValues = {},
  init
) => {
  let tokenData = null;
  if (requireToken) {
    tokenData = getItem("token");
    urlValues = { ...urlValues, userId: tokenData?.user };
  }
  path = resolveUrlPath(path, urlValues);

  console.log(
    "APIHelper || postRequest",
    path,
    params,
    tokenData,
    sendEmptyHeader,
    urlValues
  );

  return fetch(API_BASE_URL + path + `?${params.toString()}`, {
    method: "GET",
    headers: {
      ...createHeaders(tokenData, sendEmptyHeader),
      ...init?.headers,
    },
  })
    .then(async (response) => {
      if (!response.ok || response.status >= 400) {
        const errorMsg = await response.json();
        console.log(
          "APIHelper || response error",
          response,
          response.status,
          errorMsg
        );
        throw new Error(`Error ${response.status}: ${errorMsg.message}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Fetch failed:", error.message);
      alert(error.message);
    });
};

export const postRequest = async (
  path,
  bodyData,
  requireToken = false,
  sendEmptyHeader = false,
  urlValues = {},
  init = {}
) => {
  let tokenData = null;
  if (requireToken) {
    tokenData = getItem("token");
    urlValues = { ...urlValues, userId: tokenData?.user };
  }
  path = resolveUrlPath(path, urlValues);

  console.log(
    "APIHelper || postRequest",
    path,
    bodyData,
    tokenData,
    sendEmptyHeader,
    urlValues
  );

  return fetch(API_BASE_URL + path, {
    method: "POST",
    ...(bodyData && {
      body: sendEmptyHeader ? bodyData : JSON.stringify(bodyData),
    }),
    headers: {
      ...createHeaders(tokenData, sendEmptyHeader),
      ...init?.headers,
    },
  })
    .then(async (response) => {
      if (!response.ok || response.status >= 400) {
        const errorMsg = await response.json();
        console.log(
          "APIHelper || response error",
          response,
          response.status,
          errorMsg
        );
        throw new Error(`Error ${response.status}: ${errorMsg.message}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Fetch failed:", error.message);
      alert(error.message);
    });
};

// export async function post(url, data = {}, header = {}, tokenData) {
//   let apiHeader = {
//     method: "POST",
//     body: data,
//   };
//   if (header && header[CONTENT_TYPE] === APPLICATION_JSON) {
//     apiHeader.body = JSON.stringify(data);
//     apiHeader.headers = createHeaders(tokenData);
//   }
//   if (tokenData && tokenData.body) {
//     apiHeader.headers = createHeaders(tokenData);
//   }
//   console.log("APIHelper || POST API::", url, apiHeader, data, apiHeader.body);
//   try {
//     const response = await fetch(API_BASE_URL + url, apiHeader);
//     if (!response.ok) {
//       console.log(
//         "APIHelper || response error",
//         response,
//         response.status,
//         response.statusText
//       );
//       throw new Error("Failed to fetch");
//     }
//     return response.json();
//   } catch (response) {
//     console.log("APIHelper || response error", response);
//     console.log("APIHelper || ", response.status, response.statusText);
//   }
// }

export async function auth_get_token(data = {}) {
  const AUTH_API_URL = "/auth";
  //   console.log("APIHelper || auth_get_token", data, defaultHeader);
  // return await post(AUTH_API_URL, data, defaultHeader)
  return postRequest(AUTH_API_URL, data);
}

export async function register_user(data = {}) {
  const AUTH_API_URL = "/auth/register";
  // return await post(AUTH_API_URL, data, defaultHeader)
  return postRequest(AUTH_API_URL, data);
}

export async function get_all_budget(params = {}, tokenData) {
  //   const api_url = BUDGET_API_URL.replace("{userId}", tokenData?.user);
  // return await get(api_url, params, defaultHeader, tokenData)
  return getRequest(BUDGET_API_URL, params, true, null);
}

export async function get_add_budget(data = {}) {
  //   return await post(BUDGET_ADD_API_URL, data, defaultHeader);
  return postRequest(BUDGET_ADD_API_URL, data, true, null);
}

export async function get_update_budget(data = {}) {
  //   return await post(BUDGET_UPDATE_API_URL, data, defaultHeader);
  return postRequest(BUDGET_UPDATE_API_URL, data, true, null);
}

export async function upload_budget(data = {}) {
  //   return await post(BUDGET_UPLOAD_API_URL, data);
  //   const api_url = BUDGET_API_URL.replace("{userId}", "tokenData?.user");
  return postRequest(BUDGET_UPLOAD_API_URL, data, true, true);
}

export async function get_expenses(params = {}, tokenData, expenseType) {
  //   const api_url = BUDGET_EXPENSE_API_URL.replace(
  //     "{userId}",
  //     tokenData?.user
  //   ).replace("{type}", expenseType);
  //   return await get(api_url, params, defaultHeader, tokenData);
  //   return getRequest(api_url, params, tokenData);
  return getRequest(BUDGET_EXPENSE_API_URL, params, true, null, {
    type: expenseType,
  });
}

export default {
  get_all_budget,
  BUDGET_API_URL,
  BUDGET_ADD_API_URL,
  BUDGET_UPDATE_API_URL,
  BUDGET_FE_URL,
};
