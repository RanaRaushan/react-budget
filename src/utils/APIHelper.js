const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const API_BASE_URL = SERVER_HOST + import.meta.env.VITE_API_PREFIX;

export const BUDGET_API_URL = `/users/{userId}/budget`;
export const BUDGET_ADD_API_URL = "/users/{userId}/budget/add-transaction";
export const BUDGET_UPDATE_API_URL = "/users/{userId}/budget/update-transaction";
export const BUDGET_ULOAD_API_URL = "/users/{userId}/budget/upload-transaction";
export const BUDGET_FE_URL = "/budget";
export const BUDGET_ADD_FE_URL = "/budget/add";

const CONTENT_TYPE = "Content-Type";
const APPLICATION_JSON = 'application/json';
const defaultHeader = {[CONTENT_TYPE]: APPLICATION_JSON};

export async function get(url, params = {}, header = {}, tokenData) {
    try {
        let apiHeader = {
            method: 'GET',
        }
        if (tokenData && tokenData.body) {
            header.Authorization = `${tokenData.body.token_type} ${tokenData.body.token}`
            apiHeader.headers = header
        }
        apiHeader[CONTENT_TYPE] = APPLICATION_JSON
        const urlWithParams = `${url}?${params.toString()}`
        console.log("GET API::", urlWithParams, apiHeader)
        const response = await fetch(API_BASE_URL + urlWithParams, apiHeader);
        if (!response.ok) {
            console.log("response error", response, response.status, response.statusText);
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (response) {
        console.log("response error", response);
        console.log(response.status, response.statusText);
    }
}

export async function post(url, data = {}, header = {}, requireAuth=false) {
    let apiHeader = {
        method: 'POST',
        body: data
    }
    if (header && header[CONTENT_TYPE] === APPLICATION_JSON) {
        apiHeader.body = JSON.stringify(data)
        apiHeader.headers = header
    }
    console.log("POST API::", url, apiHeader, data, apiHeader.body)
    try {
        const response = await fetch(API_BASE_URL + url, apiHeader)
        if (!response.ok) {
            console.log("response error", response, response.status, response.statusText);
            throw new Error("Failed to fetch");
        }
        return response.json();
    } catch (response) {
        console.log("response error", response)
        console.log(response.status, response.statusText);
    }
}

export async function put(url, data = {}, header = {}) {
    const response = await fetch(API_BASE_URL + url, {
        method: 'PUT',
        headers: header || defaultHeader,
        body: JSON.stringify(data),
    });
    return response.json();
}

export async function delete_call(url, params = {}) {
    const response = await fetch(API_BASE_URL + url, {
        method: 'DELETE',
        params,
    });
    return response.json();
}

export async function auth_get_token(data = {}) {
    const AUTH_API_URL = "/auth";
    return await post(AUTH_API_URL, data, defaultHeader)
    }

export async function register_user(data = {}) {
    const AUTH_API_URL = "/auth/register";
    return await post(AUTH_API_URL, data, defaultHeader)
}

export async function get_all_budget(params = {}, tokenData, userId="rana@gmail.com") {
    const api_url = BUDGET_API_URL.replace('{userId}', userId)
    return await get(api_url, params, defaultHeader, tokenData)
    }

export async function get_add_budget(data = {}) {
    return await post(BUDGET_ADD_API_URL, data, defaultHeader)
    }

export async function get_update_budget(data = {}) {
    return await post(BUDGET_UPDATE_API_URL, data, defaultHeader)
    }

export async function upload_budget(data = {}) {
    return await post(BUDGET_ULOAD_API_URL, data)
    }

export default {
    get,
    post,
    put,
    delete_call,
    get_all_budget,
    BUDGET_API_URL,
    BUDGET_ADD_API_URL,
    BUDGET_UPDATE_API_URL,
    BUDGET_FE_URL,
};