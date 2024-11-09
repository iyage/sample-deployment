import CustomToast from "components/common/CustomToast";
import { paymentConstants } from "constants";
import toast from "react-hot-toast";
import { paymnentService } from "services";

export const paymentActions = {
    fetchPaymentData,
    convertCurrency,
    addBankAcct,
    resolveBankDetails,
    deleteBankAcct,
    getBanks,
    fetchPlansListing,
    fetchFFPaymentLinks,
    createPaymentLink,
    resetCreatePaymentLinkData,
};

function fetchPaymentData(id) {
    return (dispatch) => {
        dispatch(request(paymentConstants.FETCHING_PAYMENT_DATA));
        paymnentService.fetchPaymentData(id).then(
            (res) => {
                dispatch(success(paymentConstants.FETCHING_PAYMENT_DATA_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(paymentConstants.FETCHING_PAYMENT_DATA_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function convertCurrency(data) {
    return (dispatch) => {
        dispatch(request(paymentConstants.CONVERT_CURRENCY_REQUEST));
        paymnentService.convertCurrency(data).then(
            (res) => {
                dispatch(success(paymentConstants.CONVERT_CURRENCY_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.CONVERT_CURRENCY_FAILURE, error.message));
                }
            }
        );
    };
}

function getBanks() {
    return (dispatch) => {
        dispatch(request(paymentConstants.FETCH_BANKS_REQUEST));
        paymnentService.getBanks().then(
            (res) => {
                dispatch(success(paymentConstants.FETCH_BANKS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.FETCH_BANKS_FAILURE, error.message));
                }
            }
        );
    };
}

function addBankAcct(data) {
    return (dispatch) => {
        dispatch(request(paymentConstants.ADD_BANK_ACCOUNT_REQUEST));
        paymnentService.addBankAcct(data).then(
            (res) => {
                dispatch(success(paymentConstants.ADD_BANK_ACCOUNT_SUCCESS, res.data));
                toast.custom((t) => (
                    <CustomToast t={t} message={"Account added successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.ADD_BANK_ACCOUNT_FAILURE, error.message));
                }
            }
        );
    };
}

function deleteBankAcct(bankId) {
    return (dispatch) => {
        dispatch(request(paymentConstants.DELETE_BANK_ACCOUNT_REQUEST));
        paymnentService.deleteBankAcct(bankId).then(
            (res) => {
                dispatch(success(paymentConstants.DELETE_BANK_ACCOUNT_SUCCESS, res.success));
                toast.custom((t) => (
                    <CustomToast t={t} message={"Account deleted successfully"} type="success" />
                ));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.DELETE_BANK_ACCOUNT_FAILURE, error.message));
                }
            }
        );
    };
}

function resolveBankDetails(data) {
    return (dispatch) => {
        dispatch(request(paymentConstants.RESOLVE_BANK_DETAILS_REQUEST));
        paymnentService.resolveBankDetails(data).then(
            (res) => {
                dispatch(success(paymentConstants.RESOLVE_BANK_DETAILS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.RESOLVE_BANK_DETAILS_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchPlansListing() {
    return (dispatch) => {
        dispatch(request(paymentConstants.FETCH_PLAN_LISTING_REQUEST));
        paymnentService.getPlanListing().then(
            (res) => {
                dispatch(success(paymentConstants.FETCH_PLAN_LISTING_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.FETCH_PLAN_LISTING_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchFFPaymentLinks(page) {
    return (dispatch) => {
        dispatch(request(paymentConstants.FETCH_FF_PAYMENT_LINKS_REQUEST));
        paymnentService.fetchFFPaymentLinks(page).then(
            (res) => {
                dispatch(success(paymentConstants.FETCH_FF_PAYMENT_LINKS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(paymentConstants.FETCH_FF_PAYMENT_LINKS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function createPaymentLink(data) {
    return (dispatch) => {
        dispatch(request(paymentConstants.CREATE_PAYMENT_LINK_REQUEST));
        paymnentService.createPaymentLink(data).then(
            (res) => {
                dispatch(success(paymentConstants.CREATE_PAYMENT_LINK_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(paymentConstants.CREATE_PAYMENT_LINK_FAILURE, error.message));
                }
            }
        );
    };
}

function resetCreatePaymentLinkData() {
    return { type: paymentConstants.RESET_CREATE_PAYMENT_LINK_SUCCESS };
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
