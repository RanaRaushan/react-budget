const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const PREFIX = SERVER_HOST + import.meta.env.VITE_API_PREFIX;

export async function get(url, params = {}, requireAuth=false) {
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
    const API_URL = "/budget";
    return await get(API_URL, params)
    }


export default {
    get,
    post,
    put,
    delete_call,
    get_all_budget
};