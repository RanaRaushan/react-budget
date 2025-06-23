import DataStore from "./DataStore";

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const API_BASE_URL = SERVER_HOST + import.meta.env.VITE_API_PREFIX;


const AUTH_API_URL = "/auth";
const AUTH_REGISTER_API_URL = "/auth/register";
const AUTH_REFRESH_TOKEN_API_URL = "/auth/refresh-token";
export const BUDGET_API_URL = `/users/:userId/budget`;
export const BUDGET_ADD_API_URL = "/users/:userId/budget/add-budgetItem";
export const BUDGET_ENTRY_ADD_API_URL = "/users/:userId/budget/transaction-detail/add-transactionEntry";
export const BUDGET_BULK_ENTRY_ADD_API_URL = "/users/:userId/budget/transaction-detail/add-all-transactionEntry";
export const BUDGET_ENTRY_UPDATE_API_URL = "/users/:userId/budget/transaction-detail/update-transactionEntry";
export const BUDGET_UPDATE_API_URL = "/users/:userId/budget/update-budgetItem";
export const BUDGET_UPLOAD_API_URL = "/users/:userId/admin/upload-budgetItem";
export const BUDGET_DOWNLOAD_API_URL = `/users/:userId/budget/download-budgetItem`;
export const BUDGET_EXPENSE_API_URL = "/users/:userId/expenses/:type";
export const BUDGET_EXPESE_DOWNLOAD_API_URL = `/users/:userId/expenses/:type/download-expenses`;
export const BUDGET_BANK_API_URL = "/users/:userId/bank";
export const BUDGET_INVESTMENT_API_URL = "/users/:userId/investments";
export const BUDGET_ADD_INVESTMENT_API_URL = "/users/:userId/investments/add";
export const BUDGET_UPDATE_INVESTMENT_API_URL = "/users/:userId/investments/update";
export const BUDGET_REMOVE_INVESTMENT_API_URL = "/users/:userId/investments/remove/:id";
export const BUDGET_INVESTMENT_DOWNLOAD_API_URL = `/users/:userId/investments/download-investment`;


export const BUDGET_HOME_FE_URL = "/";
export const BUDGET_FE_URL = "/budget";
export const BUDGET_ADD_FE_URL = "/budget/add";
export const BUDGET_TRANSACTION_ENTRY_ADD_FE_URL = "/budget/entry/add/{entryId}";
export const BUDGET_UPLOAD_FE_URL = "/upload";
export const BUDGET_EXPENSES_EXP_FE_URL = "/expenses/expense";
export const BUDGET_EXPENSES_INC_FE_URL = "/expenses/income";
export const BUDGET_EXPENSES_FE_URL = "/expenses/{type}";
export const BUDGET_BANK_FE_URL = "/bank";
export const BUDGET_INVESTMENT_FE_URL = "/investment";
export const BUDGET_ADD_INVESTMENT_FE_URL = "/investment/add";

const CONTENT_TYPE = "Content-Type";
const APPLICATION_JSON = "application/json";

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
  console.log("APIHelper || resolveUrlPath || params", params);
  return pathTemplate.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    return params[key] === undefined ? undefined : encodeURIComponent(params[key]);
    // if (params[key] === undefined) {
    //   throw new Error(`Missing value for URL parameter: "${key}"`);
    // }
    // return encodeURIComponent(params[key]);
  });
}

export const getRequest = async (
  path,
  params = {},
  requireToken = false,
  sendEmptyHeader = false,
  urlValues = {},
  isRefreshToken,
  init
) => {
  let tokenData = null;
  if (requireToken) {
    tokenData = getItem("token");
    urlValues = { ...urlValues, userId: tokenData?.user };
    console.log("APIHelper || insdie requried token", tokenData, urlValues)
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

  return (!requireToken || tokenData?.body) && fetch(API_BASE_URL + path + `?${params.toString()}`, {
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
        return errorMsg;
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Fetch failed:", error.message);
      // alert(error.message);
    });
};

export const postRequest = async (
  path,
  bodyData,
  requireToken = false,
  sendEmptyHeader = false,
  urlValues = {},
  init = {},
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

  return (!requireToken || tokenData?.body) && fetch(API_BASE_URL + path, {
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
        return errorMsg;
      }
      return response.json();
    })
    .catch((error) => {
      console.log("Fetch failed:", error.message);
      // alert(error.message);
    });
};


export async function auth_get_token(data = {}) {
  return postRequest(AUTH_API_URL, data);
}

export async function register_user(data = {}) {
  return postRequest(AUTH_REGISTER_API_URL, data, null, null, null, true);
}

export async function refresh_token(data = {}) {
  return postRequest(AUTH_REFRESH_TOKEN_API_URL, data);
}

export async function get_all_budget(params = {}) {
  return getRequest(BUDGET_API_URL, params, true, null);
}

export async function get_add_budget(data = {}) {
  return postRequest(BUDGET_ADD_API_URL, data, true, null);
}

export async function get_add_budget_detail_entry(data = {}) {
  return postRequest(BUDGET_ENTRY_ADD_API_URL, data, true, null);
}

export async function get_add_bulk_budget_detail_entry(data = {}) {
  return postRequest(BUDGET_BULK_ENTRY_ADD_API_URL, data, true, null);
}

export async function get_update_budget_detail_entry(data = {}) {
  return postRequest(BUDGET_ENTRY_UPDATE_API_URL, data, true, null);
}

export async function get_update_budget(data = {}) {
  return postRequest(BUDGET_UPDATE_API_URL, data, true, null);
}

export async function upload_budget(data = {}) {
  return postRequest(BUDGET_UPLOAD_API_URL, data, true, true);
}

export async function download_budget(data = {}) {
  return postRequest(BUDGET_DOWNLOAD_API_URL, data, true, null);
}

export async function download_all_investment(data = {}) {
  return postRequest(BUDGET_INVESTMENT_DOWNLOAD_API_URL, data, true, null);
}

export async function download_all_expenses(data = {}, expenseType) {
  return postRequest(BUDGET_EXPESE_DOWNLOAD_API_URL, data, true, null, {
    type: expenseType,
  });
}

export async function get_expenses(params = {}, expenseType) {
  return getRequest(BUDGET_EXPENSE_API_URL, params, true, null, {
    type: expenseType,
  });
}

export async function get_bank_expenses(params = {}, expenseType) {
  return getRequest(BUDGET_BANK_API_URL, params, true, null, {
    type: expenseType,
  });
}

export async function get_investments(params = {}) {
  return getRequest(BUDGET_INVESTMENT_API_URL, params, true, null);
}

export async function add_investments(data = {}, investmentId) {
  return postRequest(BUDGET_ADD_INVESTMENT_API_URL, data, true, null, {
    id: investmentId,
  });
}

export async function update_investments(data = {}) {
  return postRequest(BUDGET_UPDATE_INVESTMENT_API_URL, data, true, null);
}

export async function remove_investments(data = {}, investmentId) {
  return postRequest(BUDGET_REMOVE_INVESTMENT_API_URL, data, true, null, {
    id: investmentId,
  });
}

export default {
  get_all_budget,
  BUDGET_API_URL,
  BUDGET_ADD_API_URL,
  BUDGET_UPDATE_API_URL,
  BUDGET_FE_URL,
};
