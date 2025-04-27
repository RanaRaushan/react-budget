import {dummyData} from "../dummy"
const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const PREFIX = SERVER_HOST + import.meta.env.VITE_API_PREFIX;

export const BUDGET_API_URL = "/budget";
export const BUDGET_ADD_API_URL = "/budget/add-transaction";
export const BUDGET_UPDATE_API_URL = "/budget/update-transaction";
export const BUDGET_FE_URL = "/budget";
export const BUDGET_ADD_FE_URL = "/budget/add";

export async function get(url, params = {}, isDummy=false, requireAuth=false) {
    // console.log("isdummy,", isDummy, dummyData())
    if (isDummy) return dummyData();
    console.log("is getting past?", isDummy)
    try {
        
  const urlWithParams = `${url}?${params.toString()}`
        const response = await fetch(PREFIX + urlWithParams, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                },
        });
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

export async function post(url, data = {}, requireAuth=false) {
    console.log("data", url, data, JSON.stringify(data))
    try {
        const response = await fetch(PREFIX + url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
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

export async function put(url, data = {}) {
    const response = await fetch(PREFIX + url, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
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
    return await get(BUDGET_API_URL, params, true)
    }

export async function get_add_budget(params = {}) {
    return await get(BUDGET_ADD_API_URL, params, true)
    }

export async function get_update_budget(params = {}) {
    return await get(BUDGET_UPDATE_API_URL, params, true)
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