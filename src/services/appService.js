import config from "config/config";
import { authService } from "./authService";

export const appService = {
    createWishlist,
    updateBusinessProfile,
    updatePersonalProfile,
    reverseLocate,
    getReferralWallet,
    getReferrals,
};

async function createWishlist(data) {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/customer/freight-forwarder/waiting-list`,
        requestOptions
    );
    return res;
}

async function updateBusinessProfile(data) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/business-profile`,
        requestOptions
    );
    return res;
}

async function updatePersonalProfile(data) {
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(data),
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/profile`,
        requestOptions
    );
    return res;
}

async function reverseLocate(lat, lng, key) {
    const requestOptions = {
        method: "GET",
    };

    const rawRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address&key=${key}`,
        requestOptions
    );
    const res = await rawRes.json();
    return res;
}

async function getReferralWallet() {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/referral/referral-wallet`,
        requestOptions
    );
    return res;
}

async function getReferrals(status, page) {
    const requestOptions = {
        method: "GET",
    };

    const res = await authService.apiGate(
        `${config.API_URL}/api/v1/freight-forwarder/referral?page=${page}&status=${status}`,
        requestOptions
    );
    return res;
}
