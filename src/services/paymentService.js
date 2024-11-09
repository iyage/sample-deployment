import config from "config/config";
import { authService } from "./authService";

export const paymnentService = {
    fetchPaymentData,
    convertCurrency,
    addBankAcct,
    resolveBankDetails,
    getBanks,
    deleteBankAcct,
    fetchFFPaymentLinks,
    createPaymentLink,
    fetchInvoices,
    cancelPaymentLink,
    getPaystackConfig,
};

async function fetchPaymentData(id) {
    const requestOptions = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/payment/link?paymentId=${id}`,
        requestOptions
    );
    return res;
}

async function convertCurrency(data) {
    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/payment/convert-currency`,
        requestOptions
    );
    return res;
}

async function getBanks() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/payment/banks`,
        requestOptions
    );
    return res;
}

async function addBankAcct(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/payment/add-bank`,
        requestOptions
    );
    return res;
}

async function deleteBankAcct(bankId) {
    const requestOptions = {
        method: "DELETE",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/payment/bank?bankId=${bankId}`,
        requestOptions
    );
    return res;
}

async function resolveBankDetails(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/payment/resolve-bank-details`,
        requestOptions
    );
    return res;
}

async function fetchFFPaymentLinks(page) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/payment/payment-links?page=${page}`,
        requestOptions
    );
    return res;
}

async function createPaymentLink(data) {
    return authService.apiClient().post(`/api/v1/freight-forwarder/payment/link`, data);
}

async function fetchInvoices({ invoiceType, shipmentId, quoteId }) {
    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/invoice?invoiceType=${invoiceType}&shipmentId=${shipmentId}&quoteId=${quoteId}`,
        { method: "GET" }
    );
    return res;
}

async function cancelPaymentLink(data) {
    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/invoice/cancel`,
        { method: "POST", body: JSON.stringify(data) }
    );

    return res;
}

async function getPaystackConfig(data) {
    return await authService
        .apiClient()
        .post(`/api/v1/freight-forwarder/payment/paystack/initiate`, data);
}
