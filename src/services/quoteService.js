import config from "config/config";
import { authService } from "./authService";

export const quoteService = {
    requestQoute,
    fetchSingleQuote,
    acceptQuote,
    rejectQuote,
    negotiateQuote,
    fetchSingleQuoteRequest,
    createQuoteForQuoteReq,
    fetchQuotes,
    fetchQuotesAnalytics,
    fetchExternalQuotes,
    fetchInternalQuotes,
    fetchOutgoingQuoteRequests,
    fetchIncomingQuoteRequests,
    FFAcceptQuote,
    FFRejectQuote,
    createQuoteToCustomer,
    sendQuoteReqFF,
    acceptQuoteRequest,
    rejectQuoteRequest,
    fetchShipmentQuotes,
    updateInternalQuoteStatus,
    fetchSingleApprovalQuote,
    fetchSingleApprovalQuoteLogs,
};

async function requestQoute(data) {
    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/shipment/`,
        requestOptions
    );
    return res;
}

async function fetchSingleQuote(id) {
    const requestOptions = {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/shipment/quote?quoteId=${id}`,
        requestOptions
    );
    return res;
}

async function acceptQuote(data) {
    const requestOptions = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/shipment/quote/accept`,
        requestOptions
    );
    return res;
}

async function rejectQuote(data) {
    const requestOptions = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/shipment/quote/reject`,
        requestOptions
    );
    return res;
}

async function negotiateQuote(data) {
    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/chat/send`,
        requestOptions
    );
    return res;
}

async function fetchSingleQuoteRequest(quoteId, token) {
    const requestOptions = Boolean(token)
        ? {
              method: "GET",
              Authorization: `Bearer ${token}`,
          }
        : {
              method: "GET",
          };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote-request?quoteId=${quoteId}`,
        requestOptions
    );
    return res;
}

async function createQuoteForQuoteReq(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/create-ff`,
        requestOptions
    );
    return res;
}

async function fetchQuotes(pageNo, status, startDate, endDate) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quotes?page=${pageNo}${
            Boolean(status) ? "&status=" + status : ""
        }${Boolean(startDate) ? "&startDate=" + startDate : ""}${
            Boolean(endDate) ? "&endDate=" + endDate : ""
        }`,
        requestOptions
    );
    return res;
}

async function fetchQuotesAnalytics(date) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/analytics${
            Boolean(date) ? "?custom=" + date : ""
        }`,
        requestOptions
    );
    return res;
}

async function fetchExternalQuotes(pageNo) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/external?page=${pageNo}`,
        requestOptions
    );
    return res;
}

async function fetchInternalQuotes(pageNo) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/internal?page=${pageNo}`,
        requestOptions
    );
    return res;
}

async function updateInternalQuoteStatus(id, data) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/internal/status/${id}`,
        requestOptions
    );
    return res;
}

async function fetchOutgoingQuoteRequests(pageNo) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/request/outgoing?page=${pageNo}`,
        requestOptions
    );
    return res;
}

async function fetchIncomingQuoteRequests(pageNo) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/request/incoming${
            Boolean(pageNo) ? "?page=" + pageNo : ""
        }`,
        requestOptions
    );
    return res;
}

async function FFAcceptQuote(id) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify({
            quoteId: id,
            status: "accepted",
        }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/acceptance`,
        requestOptions
    );
    return res;
}

async function FFRejectQuote(id) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify({
            quoteId: id,
            status: "rejected",
        }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/acceptance`,
        requestOptions
    );
    return res;
}

async function acceptQuoteRequest(id) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify({
            status: "accepted",
        }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/status/${id}`,
        requestOptions
    );
    return res;
}

async function rejectQuoteRequest(id) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify({
            status: "rejected",
        }),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/status/${id}`,
        requestOptions
    );
    return res;
}

async function createQuoteToCustomer(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/create`,
        requestOptions
    );
    return res;
}

async function sendQuoteReqFF(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/request`,
        requestOptions
    );
    return res;
}

async function fetchShipmentQuotes(shipmentId) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/all-shipment-quotes?shipmentId=${shipmentId}`,
        requestOptions
    );
    return res;
}

async function fetchSingleApprovalQuote(quoteId) {
    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/internal/${quoteId}`,
        {
            method: "GET",
        }
    );
    return res;
}

async function fetchSingleApprovalQuoteLogs(quoteId) {
    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/shipment/quote/internal/logs/${quoteId}`,
        {
            method: "GET",
        }
    );
    return res;
}
