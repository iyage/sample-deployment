import config from "config/config";
import { authService } from "./authService";

export const trackingService = {
    requestShipmentMovements,
    requestTrackingMovement,
    requestTrackingShipments,
    requestTrackingShipment,
    fetchBolDataShipment,
    requestTrackingMovements,
    searchTrackingShipmentByBol,
    requestActiveTrackingShipments,
    deleteUploadedBOL,
};

function objectToQueryParams(obj) {
    return (
        "?" +
        Object.keys(obj)
            .filter((key) => obj[key] !== "" && obj[key] !== null)
            .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))
            .join("&")
    );
}

async function requestShipmentMovements(params) {
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/freight-forwarder/movement/?shipmentId=${params}`;

    const res = await authService.apiGate(url, requestOptions);
    return res;
}
async function requestTrackingMovement(params) {
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/movement/bill-of-laden/single?${params}`;

    const res = await authService.apiGate(url, requestOptions);
    return res;
}

async function searchTrackingShipmentByBol(params) {
    const requestOptions = {
        method: "GET",
    };
    const url = `${config.API_URL}/api/v1/freight-forwarder/shipment/bol?filter=active&search=${params}`;

    const res = await authService.apiGate(url, requestOptions);

    return res;
}

async function requestActiveTrackingShipments() {
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/freight-forwarder/shipment/filter?status=active`;

    const res = await authService.apiGate(url, requestOptions);

    return res;
}

async function requestTrackingShipments(search, status, filters, page) {
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/freight-forwarder/shipment/filter${objectToQueryParams({
        ...filters,
        page,
        search,
        status: status || "active",
    })}`;

    const res = await authService.apiGate(url, requestOptions);

    return res;
}
async function requestTrackingMovements(params) {
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/freight-forwarder/shipment/bol?search=${params}`;

    const res = await authService.apiGate(url, requestOptions);

    return res;
}
async function requestTrackingShipment(params) {
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/freight-forwarder/shipment?shipmentId=${params}`;

    const res = await authService.apiGate(url, requestOptions);
    return res;
}
async function fetchBolDataShipment(params) {
    const searchParams = new URLSearchParams(params);
    const requestOptions = {
        method: "GET",
    };

    const url = `${config.API_URL}/api/v1/freight-forwarder/movement/extract-bol?url=${params.url}`;

    const res = await authService.apiGate(url, requestOptions);

    return res;
}

async function deleteUploadedBOL(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/website/utils/cloudinary/delete`,
        requestOptions
    );
    return res;
}
