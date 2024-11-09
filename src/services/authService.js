import axios from "axios";
import config from "config/config";
import { getFromStorage, removeFromStorage, saveToStorage } from "helpers";
import jwtDecode from "jwt-decode";

export const authService = {
    apiGate,
    apiClient,
    fetchFreightForwarderProfile,
    saveAccount,
    logout,
    getProfile,
    registerFF,
    verifyByMail,
    resendVerifyCode,
    loginUser,
    forgetPassword,
    resetPassword,
    resetPasswordLoggedUser,
    fetchTeamMembers,
    loggedIn,
    deleteAccount,
    addTeamMember,
    removeTeamMember,
};

function saveAccount(user) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    saveToStorage("tradeAlly-user", user);
    window.dispatchEvent(new Event("storage"));
}

function logout() {
    // remove user from local storage to log user out
    removeFromStorage("tradeAlly-user");
    window.dispatchEvent(new Event("storage"));
}

function getProfile() {
    // Using jwt-decode npm package to decode the token
    const token = getToken();

    if (!token) return false;

    return jwtDecode(getToken());
}

function apiGate(url, options, noKey) {
    // performs api calls sending the required authentication headers
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (!noKey) {
        headers["x-access-key"] = `Bearer ${config.API_KEY}`;
    }

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (loggedIn()) {
        headers.Authorization = "Bearer " + getToken();
    }

    return fetch(url, {
        headers,
        ...options,
    })
        .then((res) => handleResponse(res))
        .then((response) => {
            return response;
        });
}

function apiClient(noKey) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    if (!noKey) {
        headers["x-access-key"] = `Bearer ${config.API_KEY}`;
    }

    if (loggedIn()) {
        headers.Authorization = "Bearer " + getToken();
    }

    const client = axios.create({
        baseURL: config.API_URL,
        headers,
    });

    client.interceptors.response.use(
        (response) => {
            return response?.data;
        },
        (error) => {
            console.log(error?.response?.data);
            return Promise.reject(error?.response?.data);
        }
    );
    return client;
}

function getToken() {
    // Retrieves the user token from localStorage
    const user = getFromStorage("tradeAlly-user");
    return user?.token;
}

function isTokenExpired(token) {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
            // Checking if token is expired. N
            return true;
        } else return false;
    } catch (err) {
        return false;
    }
}

function loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = getToken(); // Getting token from store

    return !!token && !isTokenExpired(token);
}

function handleResponse(response) {
    return response.text().then((text) => {
        let data = text && JSON.parse(text);

        if (!response.ok) {
            if (response.status === 401) {
                //    Error alert goes here
                console.log('"Permission denied!"');
            }

            data.status = response.status;
            const error = (data && data) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

async function fetchFreightForwarderProfile(id) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/freight-forwarder?ffId=${id}`,
        requestOptions
    );
    return res;
}

async function registerFF(registerObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(registerObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/signup`,
        requestOptions
    );

    return res;
}

async function verifyByMail(codeObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(codeObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/code/verify`,
        requestOptions
    );

    return res;
}

async function resendVerifyCode() {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify({}),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/code/resend`,
        requestOptions
    );

    return res;
}

async function loginUser(loginObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(loginObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/login`,
        requestOptions
    );

    return res;
}

async function forgetPassword(reqObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(reqObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/password/forget`,
        requestOptions
    );

    return res;
}

async function resetPassword(reqObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(reqObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/password/reset`,
        requestOptions
    );

    return res;
}

async function resetPasswordLoggedUser(password) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify({ password }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth/password/reset-login`,
        requestOptions
    );

    return res;
}

async function fetchTeamMembers(page) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/team?page=${page}`,
        requestOptions
    );
    return res;
}

async function deleteAccount() {
    const requestOptions = {
        method: "DELETE",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/auth`,
        requestOptions
    );

    return res;
}

async function addTeamMember(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/team`,
        requestOptions
    );

    return res;
}

async function removeTeamMember(id) {
    const requestOptions = {
        method: "DELETE",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/team/${id}`,
        requestOptions
    );

    return res;
}
