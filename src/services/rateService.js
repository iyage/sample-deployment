import config from "config/config";
import { authService } from "./authService";

export const rateService = {
    getHotDeals,
    searchPorts,
    getRates,
    getSingleRate,
    FFCreateRate,
    searchProducts,
    getFFRates,
    addMultipleRates,
    toggleRateActiveness,
    updateRate,
    getProductsForRateTemplate,
    getPortsForRateTemplate,
};

async function getHotDeals() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/deals`,
        requestOptions
    );
    return res;
}

async function searchPorts(searchParam) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/search?search=${searchParam}`,
        requestOptions
    );
    return res;
}

async function getRates(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/get-rates`,
        requestOptions
    );

    return res;
}

async function getSingleRate(rateId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/one?rateId=${rateId}`,
        requestOptions
    );

    return res;
}

async function FFCreateRate(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate`,
        requestOptions
    );

    return res;
}

async function searchProducts(searchParam) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/search/products?search=${searchParam}`,
        requestOptions
    );

    return res;
}

async function getFFRates(search, page) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/ff_rates?page=${page}${
            Boolean(search) ? "&search=" + search : ""
        }`,
        requestOptions
    );

    return res;
}

async function addMultipleRates(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/multiple-rates`,
        requestOptions
    );

    return res;
}

async function toggleRateActiveness(rateId) {
    const requestOptions = {
        method: "POST",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/active?rateId=${rateId}`,
        requestOptions
    );

    return res;
}

async function updateRate(data, rateId) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate?rateId=${rateId}`,
        requestOptions
    );

    return res;
}

async function getProductsForRateTemplate(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/rate-template/products`,
        requestOptions
    );

    return res;
}

async function getPortsForRateTemplate(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/rate/rate-template/ports`,
        requestOptions
    );

    return res;
}
