import { appConstants } from "constants";

const initialState = {
    createWishlistLoading: false,
    createWishlist: null,
    createWishlistError: "",
    updateBusinessProfileLoading: false,
    updateBusinessProfile: null,
    updateBusinessProfileError: "",
    reverseLocateLoading: false,
    reverseLocateSuccess: null,
    reverseLocateError: "",
    updatePersonalProfileLoading: false,
    updatePersonalProfile: null,
    updatePersonalProfileError: "",
    referralWalletLoading: false,
    referralWallet: null,
    referralWalletError: "",
    pendingReferralsLoading: false,
    pendingReferrals: null,
    pendingReferralsError: "",
    confirmedReferralsLoading: false,
    confirmedReferrals: null,
    confirmedReferralsError: "",
    isQuoteRequestOpened: false,
};

export function app(state = initialState, action) {
    switch (action.type) {
        case appConstants.CREATE_WISHLIST_REQUEST:
            return {
                ...state,
                createWishlist: null,
                createWishlistError: "",
                createWishlistLoading: true,
            };
        case appConstants.CREATE_WISHLIST_SUCCESS:
            return {
                ...state,
                createWishlist: action.payload,
                createWishlistLoading: false,
            };
        case appConstants.CREATE_WISHLIST_FAILURE:
            return {
                ...state,
                createWishlistLoading: false,
                createWishlistError: action.payload,
            };
        case appConstants.UPDATE_BUSINESS_PROFILE_REQUEST:
            return {
                ...state,
                updateBusinessProfileLoading: true,
                updateBusinessProfile: null,
                updateBusinessProfileError: "",
            };
        case appConstants.UPDATE_BUSINESS_PROFILE_SUCCESS:
            return {
                ...state,
                updateBusinessProfile: action.payload,
                updateBusinessProfileLoading: false,
                updateBusinessProfileError: "",
            };
        case appConstants.UPDATE_BUSINESS_PROFILE_FAILURE:
            return {
                ...state,
                updateBusinessProfileLoading: false,
                updateBusinessProfileError: action.payload,
            };
        case appConstants.REVERSE_LOCATE_REQUEST:
            return {
                ...state,
                reverseLocateLoading: true,
                reverseLocateSuccess: null,
                reverseLocateError: "",
            };
        case appConstants.REVERSE_LOCATE_SUCCESS:
            return {
                ...state,
                reverseLocateSuccess: action.payload,
                reverseLocateLoading: false,
                reverseLocateError: "",
            };
        case appConstants.REVERSE_LOCATE_FAILURE:
            return {
                ...state,
                reverseLocateLoading: false,
                reverseLocateError: action.payload,
            };
        case appConstants.UPDATE_PERSONAL_PROFILE_REQUEST:
            return {
                ...state,
                updatePersonalProfileLoading: true,
                updatePersonalProfile: null,
                updatePersonalProfileError: "",
            };
        case appConstants.UPDATE_PERSONAL_PROFILE_SUCCESS:
            return {
                ...state,
                updatePersonalProfile: action.payload,
                updatePersonalProfileLoading: false,
                updatePersonalProfileError: "",
            };
        case appConstants.UPDATE_PERSONAL_PROFILE_FAILURE:
            return {
                ...state,
                updatePersonalProfileLoading: false,
                updatePersonalProfileError: action.payload,
                updatePersonalProfile: null,
            };

        case appConstants.FETCH_REFERRAL_WALLET_REQUEST:
            return {
                ...state,
                referralWalletLoading: true,
                referralWallet: null,
                referralWalletError: "",
            };
        case appConstants.FETCH_REFERRAL_WALLET_SUCCESS:
            return {
                ...state,
                referralWallet: action.payload,
                referralWalletLoading: false,
                referralWalletError: "",
            };
        case appConstants.FETCH_REFERRAL_WALLET_FAILURE:
            return {
                ...state,
                referralWalletLoading: false,
                referralWalletError: action.payload,
                referralWallet: null,
            };

        case appConstants.FETCH_PENDING_REFERRALS_REQUEST:
            return {
                ...state,
                pendingReferralsLoading: true,
                pendingReferrals: null,
                pendingReferralsError: "",
            };
        case appConstants.FETCH_PENDING_REFERRALS_SUCCESS:
            return {
                ...state,
                pendingReferrals: action.payload,
                pendingReferralsLoading: false,
                pendingReferralsError: "",
            };
        case appConstants.FETCH_PENDING_REFERRALS_FAILURE:
            return {
                ...state,
                pendingReferralsLoading: false,
                pendingReferralsError: action.payload,
                pendingReferrals: null,
            };

        case appConstants.FETCH_CONFIRMED_REFERRALS_REQUEST:
            return {
                ...state,
                confirmedReferralsLoading: true,
                confirmedReferrals: null,
                confirmedReferralsError: "",
            };
        case appConstants.FETCH_CONFIRMED_REFERRALS_SUCCESS:
            return {
                ...state,
                confirmedReferrals: action.payload,
                confirmedReferralsLoading: false,
                confirmedReferralsError: "",
            };
        case appConstants.FETCH_CONFIRMED_REFERRALS_FAILURE:
            return {
                ...state,
                confirmedReferralsLoading: false,
                confirmedReferralsError: action.payload,
                confirmedReferrals: null,
            };
        case appConstants.QUOTE_REQUEST_MODAL_OPENED:
            return {
                ...state,
                isQuoteRequestOpened: true,
            };
        default:
            return state;
    }
}
