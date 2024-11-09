import CustomToast from "components/common/CustomToast";
import { subscriptionConstants } from "constants";
import toast from "react-hot-toast";
import { subscriptionService } from "services";

export const subscriptionActions = {
    fetchPlansListing,
    fetchPlanBenefits,
    fetchSubscription,
    endSubscription,
};

function fetchPlansListing() {
    return (dispatch) => {
        dispatch(request(subscriptionConstants.FETCH_PLAN_LISTING_REQUEST));
        subscriptionService.getPlanListing().then(
            (res) => {
                dispatch(success(subscriptionConstants.FETCH_PLAN_LISTING_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(subscriptionConstants.FETCH_PLAN_LISTING_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchPlanBenefits() {
    return (dispatch) => {
        dispatch(request(subscriptionConstants.FETCH_PLAN_BENEFITS_REQUEST));
        subscriptionService.getPlanBenefits().then(
            (res) => {
                dispatch(success(subscriptionConstants.FETCH_PLAN_BENEFITS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(subscriptionConstants.FETCH_PLAN_BENEFITS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchSubscription() {
    return (dispatch) => {
        dispatch(request(subscriptionConstants.FETCH_SUBSCRIPTION_REQUEST));
        subscriptionService.getSubscription().then(
            (res) => {
                dispatch(success(subscriptionConstants.FETCH_SUBSCRIPTION_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(subscriptionConstants.FETCH_SUBSCRIPTION_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function endSubscription() {
    return (dispatch) => {
        dispatch(request(subscriptionConstants.END_SUBSCRIPTION_REQUEST));
        subscriptionService.endSubscription().then(
            (res) => {
                dispatch(success(subscriptionConstants.END_SUBSCRIPTION_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(subscriptionConstants.END_SUBSCRIPTION_FAILURE, error.message)
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
