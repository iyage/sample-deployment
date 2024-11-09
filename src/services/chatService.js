import config from "config/config";
import { authService } from "./authService";

export const chatService = {
    fetchFFShipmentChat,
    sendFFChat,
    fetchCustomerShipmentChat,
    sendCustomerChat,
};

async function fetchFFShipmentChat(id, page) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/chat/shipment?shipmentId=${id}&page=${page}`,
        requestOptions
    );
    return res;
}

async function sendFFChat(chatObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(chatObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/chat/send`,
        requestOptions
    );

    return res;
}

async function fetchCustomerShipmentChat(id, page) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/chat/shipment?shipmentId=${id}&page=${page}`,
        requestOptions
    );
    return res;
}

async function sendCustomerChat(chatObj) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(chatObj),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/chat/send`,
        requestOptions
    );

    return res;
}
