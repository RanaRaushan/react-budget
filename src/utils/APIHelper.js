const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const PREFIX = SERVER_HOST + import.meta.env.VITE_API_PREFIX;

export const BUDGET_API_URL = "/budget";
export const BUDGET_ADD_API_URL = "/budget/add-transaction";
export const BUDGET_UPDATE_API_URL = "/budget/update-transaction";
export const BUDGET_ULOAD_API_URL = "/budget/upload-transaction";
export const BUDGET_FE_URL = "/budget";
export const BUDGET_ADD_FE_URL = "/budget/add";

const CONTENT_TYPE = "Content-Type";
const APPLICATEION_JSON = 'application/json';
const defaultHeader = {CONTENT_TYPE: APPLICATEION_JSON};

export async function get(url, params = {}, header = {}, requireAuth=false) {
    try {
        let apiHeader = {
            method: 'GET',
            
        }
        apiHeader[CONTENT_TYPE] = APPLICATEION_JSON
        const urlWithParams = `${url}?${params.toString()}`
        console.log("GET API::", urlWithParams, apiHeader)
        const response = await fetch(PREFIX + urlWithParams, apiHeader);
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
    if (header && header[CONTENT_TYPE] === APPLICATEION_JSON) {
        apiHeader.body = JSON.stringify(data)
        apiHeader[CONTENT_TYPE] = APPLICATEION_JSON
    }
    console.log("POST API::", url, apiHeader, data, JSON.stringify(data))
    try {
        const response = await fetch(PREFIX + url, apiHeader)
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
    const response = await fetch(PREFIX + url, {
        method: 'PUT',
        headers: header || defaultHeader,
        body: JSON.stringify(data),
    });
    return response.json();
}

export async function delete_call(url, params = {}) {
    const response = await fetch(PREFIX + url, {
        method: 'DELETE',
        params,
    });
    return response.json();
}

export async function get_all_budget(params = {}) {
    return await get(BUDGET_API_URL, params, defaultHeader)
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