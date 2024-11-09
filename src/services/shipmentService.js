import config from "config/config";
import { authService } from "./authService";

export const shipmentService = {
    fetchFFSingleShipmentForCustomer,
    fetchCustomerMovements,
    sendRating,
    createShipment,
    createPendingShipment,
    fetchFFSingleShipment,
    fetchPendingShipment,
    fetchShipments,
    fetchCustomerAndEarningsAnalytics,
    takeShipmentLive,
    endLiveShipment,
    cancelLiveShipment,
    sendShipmentStatusUpdate,
    fetchMovementPartners,
    createMovement,
    assignShipmentToMember,
    fetchFFMovements,
    fetchShipmentAnalytics,
    uploadShipmentDocument,
};

async function fetchFFSingleShipmentForCustomer(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/shipment?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}

async function fetchCustomerMovements(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/movement?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}

async function sendRating(data) {
    const requestOptions = {
        method: "POST",
        body: data,
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/feedback/`,
        requestOptions
    );
    return res;
}

async function createShipment(data, shipmentId) {
    const requestOptions = {
        method: shipmentId ? "PUT" : "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment${
            Boolean(shipmentId) ? "?shipmentId=" + shipmentId : ""
        }`,
        requestOptions
    );
    return res;
}

async function createPendingShipment(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/pendingShipment`,
        requestOptions
    );
    return res;
}

async function fetchFFSingleShipment(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}

async function fetchPendingShipment(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/pendingShipment`,
        requestOptions
    );

    return res;
}

async function fetchMovementPartners(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/movement/partners-to-assign?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}

async function fetchShipments(status, pageNo, search, startDate, endDate) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/filter?page=${pageNo}${
            Boolean(status) ? "&status=" + status : ""
        }${Boolean(search) ? "&search=" + search : ""}${
            Boolean(startDate) ? "&startDate=" + startDate : ""
        }${Boolean(endDate) ? "&endDate=" + endDate : ""}`,
        requestOptions
    );

    return res;
}

async function fetchCustomerAndEarningsAnalytics(date) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/customer/analytics${
            Boolean(date) ? "?custom=" + date : ""
        }`,
        requestOptions
    );

    return res;
}

async function takeShipmentLive(id) {
    const requestOptions = {
        method: "POST",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/live?shipment_id=${id}`,
        requestOptions
    );
    return res;
}

async function endLiveShipment(id) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify({
            shipmentId: id,
        }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/end`,
        requestOptions
    );
    return res;
}

async function cancelLiveShipment(id, reason) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify({
            shipmentId: id,
            reason,
        }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/cancel`,
        requestOptions
    );
    return res;
}

async function createMovement(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/movement`,
        requestOptions
    );
    return res;
}

async function sendShipmentStatusUpdate(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/status`,
        requestOptions
    );

    return res;
}

async function assignShipmentToMember(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/assign/partner`,
        requestOptions
    );

    return res;
}

async function fetchFFMovements(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/movement/?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}

async function fetchShipmentAnalytics(date) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/analytics${
            Boolean(date) ? "?custom=" + date : ""
        }`,
        requestOptions
    );
    return res;
}

async function uploadShipmentDocument(shipmentId, data) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/document?shipmentId=${shipmentId}`,
        requestOptions
    );

    return res;
}
