import config from "config/config";
import { authService } from "./authService";

export const subscriptionService = {
    getPlanListing,
    getPlanBenefits,
    getSubscription,
    endSubscription,
};

async function getPlanListing() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/plans`,
        requestOptions
    );
    return res;
}

async function getPlanBenefits() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/plans/plan-benefit`,
        requestOptions
    );
    return res;
}

async function getSubscription() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/subscription/subscription-details`,
        requestOptions
    );
    return res;
}

async function endSubscription() {
    const requestOptions = {
        method: "PUT",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/subscription/cancel`,
        requestOptions
    );
    return res;
}
