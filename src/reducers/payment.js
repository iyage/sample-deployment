import { paymentConstants } from "constants";

const initialState = {
    fetchingPaymentData: false,
    paymentData: null,
    paymentDataError: null,
    convertngCurrency: false,
    convertedCurrencyData: null,
    convertedCurrencyError: null,
    addBankAcctLoading: false,
    addBankAcctSuccess: null,
    addBankAcctError: "",
    resolveBankDetailsLoading: false,
    resolveBankDetailsSuccess: null,
    resolveBankDetailsError: "",
    fetchingBanks: false,
    fetchingBanksSuccess: null,
    fetchingBanksError: "",
    deletingBankAcct: false,
    deletingBankAcctSuccess: null,
    deletingBankAcctError: "",
    getPlansLoading: false,
    getPlansSuccess: null,
    getPlansError: "",
    FFPaymentLinksLoading: false,
    FFPaymentLinksSuccess: null,
    FFPaymentLinksError: "",
    createPaymentLinkLoading: false,
    createPaymentLinkSuccess: null,
    createPaymentLinkError: "",
};

export function payment(state = initialState, action) {
    switch (action.type) {
        case paymentConstants.FETCHING_PAYMENT_DATA:
            return {
                ...state,
                fetchingPaymentData: true,
            };
        case paymentConstants.FETCHING_PAYMENT_DATA_SUCCESS:
            return {
                ...state,
                fetchingPaymentData: false,
                paymentData: action.payload,
            };
        case paymentConstants.FETCHING_PAYMENT_DATA_FAILURE:
            return {
                ...state,
                fetchingPaymentData: false,
                paymentData: null,
                paymentDataError: action.payload,
            };

        case paymentConstants.CONVERT_CURRENCY_REQUEST:
            return {
                ...state,
                convertngCurrency: true,
            };
        case paymentConstants.CONVERT_CURRENCY_SUCCESS:
            return {
                ...state,
                convertngCurrency: false,
                convertedCurrencyData: action.payload,
                convertedCurrencyError: null,
            };
        case paymentConstants.CONVERT_CURRENCY_FAILURE:
            return {
                ...state,
                convertngCurrency: false,
                convertedCurrencyData: null,
                convertedCurrencyError: action.payload,
            };

        case paymentConstants.RESOLVE_BANK_DETAILS_REQUEST:
            return {
                ...state,
                resolveBankDetailsLoading: true,
                resolveBankDetailsSuccess: null,
                resolveBankDetailsError: "",
            };
        case paymentConstants.RESOLVE_BANK_DETAILS_SUCCESS:
            return {
                ...state,
                resolveBankDetailsSuccess: action.payload,
                resolveBankDetailsLoading: false,
                resolveBankDetailsError: "",
            };
        case paymentConstants.RESOLVE_BANK_DETAILS_FAILURE:
            return {
                ...state,
                resolveBankDetailsLoading: false,
                resolveBankDetailsError: action.payload,
                resolveBankDetailsSuccess: null,
            };

        case paymentConstants.ADD_BANK_ACCOUNT_REQUEST:
            return {
                ...state,
                addBankAcctLoading: true,
                addBankAcctSuccess: null,
                addBankAcctError: "",
            };
        case paymentConstants.ADD_BANK_ACCOUNT_SUCCESS:
            return {
                ...state,
                addBankAcctSuccess: action.payload,
                addBankAcctLoading: false,
                addBankAcctError: "",
            };
        case paymentConstants.ADD_BANK_ACCOUNT_FAILURE:
            return {
                ...state,
                addBankAcctLoading: false,
                addBankAcctError: action.payload,
                addBankAcctSuccess: null,
            };

        case paymentConstants.FETCH_BANKS_REQUEST:
            return {
                ...state,
                fetchingBanks: true,
                fetchingBanksSuccess: null,
                fetchingBanksError: "",
            };
        case paymentConstants.FETCH_BANKS_SUCCESS:
            return {
                ...state,
                fetchingBanksSuccess: action.payload,
                fetchingBanks: false,
                fetchingBanksError: "",
            };
        case paymentConstants.FETCH_BANKS_FAILURE:
            return {
                ...state,
                fetchingBanks: false,
                fetchingBanksError: action.payload,
                fetchingBanksSuccess: null,
            };

        case paymentConstants.DELETE_BANK_ACCOUNT_REQUEST:
            return {
                ...state,
                deletingBankAcct: true,
                deletingBankAcctSuccess: null,
                deletingBankAcctError: "",
            };
        case paymentConstants.DELETE_BANK_ACCOUNT_SUCCESS:
            return {
                ...state,
                deletingBankAcctSuccess: action.payload,
                deletingBankAcct: false,
                deletingBankAcctError: "",
            };
        case paymentConstants.DELETE_BANK_ACCOUNT_FAILURE:
            return {
                ...state,
                deletingBankAcct: false,
                deletingBankAcctError: action.payload,
                deletingBankAcctSuccess: null,
            };

        case paymentConstants.FETCH_PLAN_LISTING_REQUEST:
            return {
                ...state,
                getPlansLoading: true,
                getPlansSuccess: null,
                getPlansError: "",
            };
        case paymentConstants.FETCH_PLAN_LISTING_SUCCESS:
            return {
                ...state,
                getPlansSuccess: action.payload,
                getPlansLoading: false,
                getPlansError: "",
            };
        case paymentConstants.FETCH_PLAN_LISTING_FAILURE:
            return {
                ...state,
                getPlansLoading: false,
                getPlansError: action.payload,
                getPlansSuccess: null,
            };

        case paymentConstants.FETCH_FF_PAYMENT_LINKS_REQUEST:
            return {
                ...state,
                FFPaymentLinksLoading: true,
                FFPaymentLinksSuccess: null,
                FFPaymentLinksError: "",
            };
        case paymentConstants.FETCH_FF_PAYMENT_LINKS_SUCCESS:
            return {
                ...state,
                FFPaymentLinksSuccess: action.payload,
                FFPaymentLinksLoading: false,
                FFPaymentLinksError: "",
            };
        case paymentConstants.FETCH_FF_PAYMENT_LINKS_FAILURE:
            return {
                ...state,
                FFPaymentLinksLoading: false,
                FFPaymentLinksError: action.payload,
                FFPaymentLinksSuccess: null,
            };

        case paymentConstants.CREATE_PAYMENT_LINK_REQUEST:
            return {
                ...state,
                createPaymentLinkLoading: true,
                createPaymentLinkSuccess: null,
                createPaymentLinkError: "",
            };
        case paymentConstants.CREATE_PAYMENT_LINK_SUCCESS:
            return {
                ...state,
                createPaymentLinkSuccess: action.payload,
                createPaymentLinkLoading: false,
                createPaymentLinkError: "",
            };
        case paymentConstants.CREATE_PAYMENT_LINK_FAILURE:
            return {
                ...state,
                createPaymentLinkLoading: false,
                createPaymentLinkError: action.payload,
                createPaymentLinkSuccess: null,
            };

        case paymentConstants.RESET_CREATE_PAYMENT_LINK_SUCCESS:
            return {
                ...state,
                createPaymentLinkLoading: false,
                createPaymentLinkSuccess: null,
                createPaymentLinkError: "",
            };

        default:
            return state;
    }
}
