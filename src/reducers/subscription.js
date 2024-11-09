import { subscriptionConstants } from "constants";

const initialState = {
    getPlansLoading: false,
    getPlansSuccess: null,
    getPlansError: "",
    getPlanBenefitsLoading: false,
    getPlanBenefitsSuccess: null,
    getPlanBenefitsError: "",
    getSubscriptionLoading: false,
    getSubscriptionSuccess: null,
    getSubscriptionError: "",
    endSubscriptionLoading: false,
    endSubscriptionSuccess: null,
    endSubscriptionError: "",
};

export function subscription(state = initialState, action) {
    switch (action.type) {
        case subscriptionConstants.FETCH_PLAN_LISTING_REQUEST:
            return {
                ...state,
                getPlansLoading: true,
                getPlansSuccess: null,
                getPlansError: "",
            };
        case subscriptionConstants.FETCH_PLAN_LISTING_SUCCESS:
            return {
                ...state,
                getPlansSuccess: action.payload,
                getPlansLoading: false,
                getPlansError: "",
            };
        case subscriptionConstants.FETCH_PLAN_LISTING_FAILURE:
            return {
                ...state,
                getPlansLoading: false,
                getPlansError: action.payload,
                getPlansSuccess: null,
            };

        case subscriptionConstants.FETCH_PLAN_BENEFITS_REQUEST:
            return {
                ...state,
                getPlanBenefitsLoading: true,
                getPlanBenefitsSuccess: null,
                getPlanBenefitsError: "",
            };
        case subscriptionConstants.FETCH_PLAN_BENEFITS_SUCCESS:
            return {
                ...state,
                getPlanBenefitsSuccess: action.payload,
                getPlanBenefitsLoading: false,
                getPlanBenefitsError: "",
            };
        case subscriptionConstants.FETCH_PLAN_BENEFITS_FAILURE:
            return {
                ...state,
                getPlanBenefitsLoading: false,
                getPlanBenefitsError: action.payload,
                getPlanBenefitsSuccess: null,
            };

        case subscriptionConstants.FETCH_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                getSubscriptionLoading: true,
                getSubscriptionError: "",
            };
        case subscriptionConstants.FETCH_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                getSubscriptionSuccess: action.payload,
                getSubscriptionLoading: false,
                getSubscriptionError: "",
            };
        case subscriptionConstants.FETCH_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                getSubscriptionLoading: false,
                getSubscriptionError: action.payload,
                getSubscriptionSuccess: null,
            };

        case subscriptionConstants.END_SUBSCRIPTION_REQUEST:
            return {
                ...state,
                endSubscriptionLoading: true,
                endSubscriptionSuccess: null,
                endSubscriptionError: "",
            };
        case subscriptionConstants.END_SUBSCRIPTION_SUCCESS:
            return {
                ...state,
                endSubscriptionSuccess: action.payload,
                endSubscriptionLoading: false,
                endSubscriptionError: "",
            };
        case subscriptionConstants.END_SUBSCRIPTION_FAILURE:
            return {
                ...state,
                endSubscriptionLoading: false,
                endSubscriptionError: action.payload,
                endSubscriptionSuccess: null,
            };

        default:
            return state;
    }
}
