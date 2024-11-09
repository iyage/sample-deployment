import CustomToast from "components/common/CustomToast";
import { appConstants } from "constants";
import toast from "react-hot-toast";
import { appService } from "services";

export const appActions = {
    createWishlist,
    updateBusinessProfile,
    updatePersonalProfile,
    reverseLocate,
    resetUpdateBizProfile,
    resetUpdateProfile,
    getReferralWallet,
    getPendingReferrals,
    getConfirmedReferrals,
    quoteRequestModalOpened,
};

function createWishlist(data) {
    return (dispatch) => {
        dispatch(request(appConstants.CREATE_WISHLIST_REQUEST));
        appService.createWishlist(data).then(
            (res) => {
                dispatch(success(appConstants.CREATE_WISHLIST_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(appConstants.CREATE_WISHLIST_FAILURE, error.message));
                }
            }
        );
    };
}

function updateBusinessProfile(data, newUser) {
    return (dispatch) => {
        dispatch(request(appConstants.UPDATE_BUSINESS_PROFILE_REQUEST));
        appService.updateBusinessProfile(data).then(
            (res) => {
                dispatch(success(appConstants.UPDATE_BUSINESS_PROFILE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(appConstants.UPDATE_BUSINESS_PROFILE_FAILURE, error.message));
                }
            }
        );
    };
}

function updatePersonalProfile(data) {
    return (dispatch) => {
        dispatch(request(appConstants.UPDATE_PERSONAL_PROFILE_REQUEST));
        appService.updatePersonalProfile(data).then(
            (res) => {
                dispatch(success(appConstants.UPDATE_PERSONAL_PROFILE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(appConstants.UPDATE_PERSONAL_PROFILE_FAILURE, error.message));
                }
            }
        );
    };
}

function reverseLocate(lat, lng, key) {
    return (dispatch) => {
        dispatch(request(appConstants.REVERSE_LOCATE_REQUEST));
        appService.reverseLocate(lat, lng, key).then(
            (res) => {
                dispatch(success(appConstants.REVERSE_LOCATE_SUCCESS, res));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(appConstants.REVERSE_LOCATE_FAILURE, error.message));
                }
            }
        );
    };
}

function getReferralWallet() {
    return (dispatch) => {
        dispatch(request(appConstants.FETCH_REFERRAL_WALLET_REQUEST));
        appService.getReferralWallet().then(
            (res) => {
                dispatch(success(appConstants.FETCH_REFERRAL_WALLET_SUCCESS, res?.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(appConstants.FETCH_REFERRAL_WALLET_FAILURE, error.message));
                }
            }
        );
    };
}

function getPendingReferrals(page) {
    return (dispatch) => {
        dispatch(request(appConstants.FETCH_PENDING_REFERRALS_REQUEST));
        appService.getReferrals("pending", page).then(
            (res) => {
                dispatch(success(appConstants.FETCH_PENDING_REFERRALS_SUCCESS, res?.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(appConstants.FETCH_PENDING_REFERRALS_FAILURE, error.message));
                }
            }
        );
    };
}

function getConfirmedReferrals(page) {
    return (dispatch) => {
        dispatch(request(appConstants.FETCH_CONFIRMED_REFERRALS_REQUEST));
        appService.getReferrals("confirmed", page).then(
            (res) => {
                dispatch(success(appConstants.FETCH_CONFIRMED_REFERRALS_SUCCESS, res?.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(appConstants.FETCH_CONFIRMED_REFERRALS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function request(type) {
    return { type: type };
}
function success(type, data) {
    return { type: type, payload: data };
}
function failure(type, error) {
    return { type: type, payload: error ?? "" };
}

function resetUpdateBizProfile() {
    return { type: appConstants.UPDATE_BUSINESS_PROFILE_SUCCESS, payload: false };
}

function quoteRequestModalOpened() {
    return { type: appConstants.QUOTE_REQUEST_MODAL_OPENED };
}

function resetUpdateProfile() {
    return { type: appConstants.UPDATE_PERSONAL_PROFILE_SUCCESS, payload: false };
}
