import config from "config/config";
import { authService } from "./authService";

export const folderService = {
    fetchFolderContent,
    fetchRootFolder,
    createFolder,
    createFile,
    updateFolder,
    deleteFolder,
    copyFolder,
    deleteFile,
    updateFile,
    duplicateFile,
    downloadFolder,
    searchFolders,
    fetchFolderAndFilesByShipmentId,
};

async function fetchFolderContent(folderId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder/files?folderId=${folderId}`,
        requestOptions
    );
    return res;
}

async function fetchRootFolder(pageNo, startDate, endDate, countPerPage) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${
            config.API_URL
        }/api/v1/freight-forwarder/shipment-folder/folder/filter?page=${pageNo}&limit=${countPerPage}${
            Boolean(startDate) ? "&startDate=" + startDate : ""
        }${Boolean(endDate) ? "&endDate=" + endDate : ""}`,
        requestOptions
    );
    return res;
}

async function createFolder(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder`,
        requestOptions
    );
    return res;
}

async function createFile(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/file`,
        requestOptions
    );
    return res;
}

async function updateFolder(data, folderId) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder?folderId=${folderId}`,
        requestOptions
    );
    return res;
}

async function deleteFolder(folderId) {
    const requestOptions = {
        method: "DELETE",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder?folderId=${folderId}`,
        requestOptions
    );
    return res;
}

async function copyFolder(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder/copy`,
        requestOptions
    );
    return res;
}

async function deleteFile(fileId) {
    const requestOptions = {
        method: "DELETE",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/file?fileId=${fileId}`,
        requestOptions
    );
    return res;
}

async function updateFile(data, fileId) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/file?fileId=${fileId}`,
        requestOptions
    );
    return res;
}

async function duplicateFile(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/file/copy`,
        requestOptions
    );
    return res;
}

async function downloadFolder(folderId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder/download?folderId=${folderId}`,
        requestOptions
    );
    return res;
}

async function searchFolders(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder/search`,
        requestOptions
    );
    return res;
}

async function fetchFolderAndFilesByShipmentId(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment-folder/folder/files/shipment?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}
