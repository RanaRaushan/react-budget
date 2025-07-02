import DataStore from './DataStore';

const SERVER_HOST = import.meta.env.VITE_BE_SERVER_HOST;
const API_BASE_URL = SERVER_HOST + import.meta.env.VITE_BE_API_PREFIX;
const OCR_API_BASE_URL = import.meta.env.VITE_OCR_SERVER_HOST;

const AUTH_API_URL = '/auth';
const AUTH_REGISTER_API_URL = '/auth/register';
const AUTH_REFRESH_TOKEN_API_URL = '/auth/refresh-token';
export const BUDGET_API_URL = `/users/:userId/budget`;
export const BUDGET_SUGGESTIONS_API_URL = `/users/:userId/budget/suggestions`;
export const BUDGET_ADD_API_URL = '/users/:userId/budget/add-budgetItem';
export const BUDGET_ENTRY_ADD_API_URL =
  '/users/:userId/budget/transaction-detail/add-transactionEntry';
export const BUDGET_BULK_ENTRY_ADD_API_URL =
  '/users/:userId/budget/transaction-detail/add-all-transactionEntry';
export const BUDGET_ENTRY_UPDATE_API_URL =
  '/users/:userId/budget/transaction-detail/update-transactionEntry';
export const BUDGET_UPDATE_API_URL = '/users/:userId/budget/update-budgetItem';
export const BUDGET_UPLOAD_API_URL = '/users/:userId/report/upload/:type';
export const BUDGET_DOWNLOAD_API_URL = `/users/:userId/budget/download-budgetItem`;
export const BUDGET_EXPENSE_API_URL = '/users/:userId/expenses/:type';
export const BUDGET_EXPESE_DOWNLOAD_API_URL = `/users/:userId/expenses/:type/download-expenses`;
export const BUDGET_BANK_API_URL = '/users/:userId/bank';
export const BUDGET_INVESTMENT_API_URL = '/users/:userId/investments';
export const BUDGET_ADD_INVESTMENT_API_URL = '/users/:userId/investments/add';
export const BUDGET_UPDATE_INVESTMENT_API_URL =
  '/users/:userId/investments/update';
export const BUDGET_REMOVE_INVESTMENT_API_URL =
  '/users/:userId/investments/remove/:id';
export const BUDGET_INVESTMENT_DOWNLOAD_API_URL = `/users/:userId/investments/download-investment`;

export const ALL_BUDGET_DATA_DOWNLOAD_API_URL = `/users/:userId/report/download-all-budgetData`;
export const ALL_BUDGET_REPORT_ANALYSIS_API_URL = `/users/:userId/report/analysis`;

export const BUDGET_HOME_FE_URL = '/';
export const BUDGET_FE_URL = '/budget';
export const BUDGET_ADD_FE_URL = '/budget/add';
export const BUDGET_TRANSACTION_ENTRY_ADD_FE_URL =
  '/budget/entry/add/{entryId}';
export const BUDGET_UPLOAD_FE_URL = '/upload';
export const BUDGET_EXPENSES_EXP_FE_URL = '/expenses/expense';
export const BUDGET_EXPENSES_INC_FE_URL = '/expenses/income';
export const BUDGET_EXPENSES_FE_URL = '/expenses/{type}';
export const BUDGET_BANK_FE_URL = '/bank';
export const BUDGET_INVESTMENT_FE_URL = '/investment';
export const BUDGET_ADD_INVESTMENT_FE_URL = '/investment/add';

export const PYTHON_OCR_API_URL = `/ocr`;

const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

const { getItem, setItem, removeItem } = DataStore();

const createHeaders = (tokenData, sendEmptyHeader = false) => {
  let headers = {};

  if (!sendEmptyHeader) {
    headers = { ...{ [CONTENT_TYPE]: APPLICATION_JSON } };
  }

  if (tokenData) {
    headers[
      'Authorization'
    ] = `${tokenData.body.token_type} ${tokenData.body.token}`;
  }
  return headers;
};

function resolveUrlPath(pathTemplate, params = {}) {
  // console.log('APIHelper || resolveUrlPath || params', params);
  return pathTemplate.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    return params[key] === undefined
      ? undefined
      : encodeURIComponent(params[key]);
  });
}

export const getRequest = async ({
  path,
  params = {},
  requireToken = false,
  sendEmptyHeader = false,
  urlValues = {},
  isRefreshToken = false,
  init = {},
  retry = false, //not working marking false for now
  apiBaseUrl = API_BASE_URL,
}) => {
  let tokenData = null;
  if (requireToken) {
    tokenData = getItem('token');
    urlValues = { ...urlValues, userId: tokenData?.user };
  }
  path = resolveUrlPath(path, urlValues);

  console.log(
    'APIHelper || getRequest',
    path,
    params,
    tokenData,
    sendEmptyHeader,
    urlValues,
  );

  return (
    (!requireToken || tokenData?.body) &&
    fetch(apiBaseUrl + path + `?${params.toString()}`, {
      method: 'GET',
      headers: {
        ...createHeaders(tokenData, sendEmptyHeader),
        ...init?.headers,
      },
    })
      .then(async (response) => {
        if (!response.ok || response.status >= 400) {
          const errorMsg = await response.json();
          console.log(
            'APIHelper || response error',
            response,
            response.status,
            errorMsg,
          );
          if (
            retry &&
            errorMsg &&
            errorMsg.error === 'Unauthorized' &&
            errorMsg.message === 'Token is Expired! Please login again'
          ) {
            console.log('APIHelper || calling retry getRequest');
            try {
              const res = await refresh_token({
                refreshToken: tokenData?.body?.refreshToken,
              });
              const expireAt = new Date().getTime() + Number(res?.expires_in);
              const newTokenData = res && {
                body: res,
                expireAt: expireAt,
                user: tokenData?.user,
              };
              setItem('token', newTokenData);
              // Retry original request once
              return await getRequest(
                path,
                params,
                requireToken,
                sendEmptyHeader,
                urlValues,
                isRefreshToken,
                init,
                false,
              );
            } catch (err) {
              throw new Error(err);
            }
          }
          return errorMsg;
        }
        return response.json();
      })
      .catch((error) => {
        console.log('Fetch failed:', error.message);
        // alert(error.message);
      })
  );
};

export const postRequest = async ({
  path,
  bodyData,
  requireToken = false,
  sendEmptyHeader = false,
  urlValues = {},
  init = {},
  retry = false, //not working marking false for now
  apiBaseUrl = API_BASE_URL,
  params = undefined,
}) => {
  let tokenData = null;
  if (requireToken) {
    tokenData = getItem('token');
    urlValues = { ...urlValues, userId: tokenData?.user };
  }
  path = resolveUrlPath(path, urlValues);

  console.log(
    'APIHelper || postRequest',
    path,
    bodyData,
    tokenData,
    sendEmptyHeader,
    urlValues,
    params,
    params?.toString(),
  );

  return (
    (!requireToken || tokenData?.body) &&
    fetch(apiBaseUrl + path + `?${params ?? ''}`, {
      method: 'POST',
      ...(bodyData && {
        body: sendEmptyHeader ? bodyData : JSON.stringify(bodyData),
      }),
      headers: {
        Accept: 'application/json',
        ...createHeaders(tokenData, sendEmptyHeader),
        ...init?.headers,
      },
    })
      .then(async (response) => {
        if (!response.ok || response.status >= 400) {
          const errorMsg = await response.json();
          console.log(
            'APIHelper || response error',
            response,
            response.status,
            errorMsg,
          );
          if (
            retry &&
            errorMsg &&
            errorMsg.error === 'Unauthorized' &&
            errorMsg.message === 'Token is Expired! Please login again'
          ) {
            console.log('APIHelper || calling retry postRequest');
            try {
              const res = await refresh_token({
                refreshToken: tokenData?.body?.refreshToken,
              });
              const expireAt = new Date().getTime() + Number(res?.expires_in);
              const newTokenData = res && {
                body: res,
                expireAt: expireAt,
                user: tokenData?.user,
              };
              setItem('tokenData', newTokenData);
              // Retry original request once
              return await postRequest(
                path,
                body,
                requireToken,
                sendEmptyHeader,
                urlValues,
                init,
                false,
              );
            } catch (err) {
              throw new Error('Token refresh failed', err);
            }
          }
          return errorMsg;
        }
        return response.json();
      })
      .catch((error) => {
        console.log('Fetch failed:', error.message);
        // alert(error.message);
      })
  );
};

export async function auth_get_token(data = {}) {
  return postRequest({ path: AUTH_API_URL, bodyData: data });
}

export async function register_user(data = {}) {
  return postRequest({ path: AUTH_REGISTER_API_URL, bodyData: data });
}

export async function refresh_token(data = {}) {
  return postRequest({ path: AUTH_REFRESH_TOKEN_API_URL, bodyData: data });
}

export async function get_all_budget(params = {}) {
  return getRequest({
    path: BUDGET_API_URL,
    params: params,
    requireToken: true,
  });
}

export async function get_budget_suggestions(params = {}) {
  return postRequest({
    path: BUDGET_SUGGESTIONS_API_URL,
    bodyData: params,
    requireToken: true,
  });
}

export async function get_add_budget(data = {}) {
  removeItem('suggestions');
  return postRequest({
    path: BUDGET_ADD_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function get_add_budget_detail_entry(data = {}) {
  removeItem('suggestions');
  return postRequest({
    path: BUDGET_ENTRY_ADD_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function get_add_bulk_budget_detail_entry(data = {}) {
  removeItem('suggestions');
  return postRequest({
    path: BUDGET_BULK_ENTRY_ADD_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function get_update_budget_detail_entry(data = {}) {
  removeItem('suggestions');
  return postRequest({
    path: BUDGET_ENTRY_UPDATE_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function get_update_budget(data = {}) {
  removeItem('suggestions');
  return postRequest({
    path: BUDGET_UPDATE_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function upload_budget(data = {}, uploadType) {
  removeItem('suggestions');
  return postRequest({
    path: BUDGET_UPLOAD_API_URL,
    bodyData: data,
    requireToken: true,
    sendEmptyHeader: true,
    urlValues: {
      type: uploadType,
    },
  });
}

export async function download_all_budget_data(data = {}) {
  return postRequest({
    path: ALL_BUDGET_DATA_DOWNLOAD_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function download_budget(data = {}) {
  return postRequest({
    path: BUDGET_DOWNLOAD_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function download_all_investment(data = {}) {
  return postRequest({
    path: BUDGET_INVESTMENT_DOWNLOAD_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function download_all_expenses(data = {}, expenseType) {
  return postRequest({
    path: BUDGET_EXPESE_DOWNLOAD_API_URL,
    bodyData: data,
    requireToken: true,
    urlValues: {
      type: expenseType,
    },
  });
}

export async function get_expenses(params = {}, expenseType) {
  return getRequest({
    path: BUDGET_EXPENSE_API_URL,
    params: params,
    requireToken: true,
    urlValues: {
      type: expenseType,
    },
  });
}

export async function get_bank_expenses(params = {}, expenseType) {
  return getRequest({
    path: BUDGET_BANK_API_URL,
    params: params,
    requireToken: true,
    urlValues: {
      type: expenseType,
    },
  });
}

export async function get_investments(params = {}) {
  return getRequest({
    path: BUDGET_INVESTMENT_API_URL,
    params: params,
    requireToken: true,
  });
}

export async function add_investments(data = {}, investmentId) {
  return postRequest({
    path: BUDGET_ADD_INVESTMENT_API_URL,
    bodyData: data,
    requireToken: true,
    urlValues: {
      id: investmentId,
    },
  });
}

export async function update_investments(data = {}) {
  return postRequest({
    path: BUDGET_UPDATE_INVESTMENT_API_URL,
    bodyData: data,
    requireToken: true,
  });
}

export async function remove_investments(data = {}, investmentId) {
  return postRequest({
    path: BUDGET_REMOVE_INVESTMENT_API_URL,
    bodyData: data,
    requireToken: true,
    urlValues: {
      id: investmentId,
    },
  });
}

export async function get_data_by_ocr(data = {}, params = {}) {
  return postRequest({
    path: PYTHON_OCR_API_URL,
    bodyData: data,
    requireToken: true,
    sendEmptyHeader: true,
    apiBaseUrl: OCR_API_BASE_URL,
    params: params,
  });
}

export async function get_analysis_report_data(params = {}) {
  return getRequest({
    path: ALL_BUDGET_REPORT_ANALYSIS_API_URL,
    requireToken: true,
    params: params,
  });
}
