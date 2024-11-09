import config from "config/config";
import { authService } from "./authService";

export const notificationService = {
    filterNotifications,
    markAsRead,
    markAllAsRead,
};

async function filterNotifications(status, page) {
    const requestOptions = {
        method: "GET",
    };

    const url = status
        ? `/api/v1/freight-forwarder/notification/filter?status=${status}${
              Number(page) ? "&page=" + page : ""
          }`
        : `/api/v1/freight-forwarder/notification/filter${Number(page) ? "?page=" + page : ""}`;

    const res = await authService.apiGate(`${config.API_URL}${url}`, requestOptions);
    return res;
}

async function markAsRead(id) {
    const requestOptions = {
        method: "PUT",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/notification/read-one?notificationId=${id}`,
        requestOptions
    );
    return res;
}

async function markAllAsRead() {
    const requestOptions = {
        method: "PUT",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/notification/read-all`,
        requestOptions
    );
    return res;
}
