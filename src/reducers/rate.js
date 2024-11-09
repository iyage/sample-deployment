import { rateConstants } from "constants";

const initialState = {
    getHotDealsLoading: false,
    getHotDealsSuccess: null,
    getHotDealsError: "",
    getPortsLoading: false,
    getPortsSuccess: null,
    getPortsError: "",
    getRatesLoading: false,
    getRatesSuccess: null,
    getRatesError: "",
    getSingleRateLoading: false,
    getSingleRateSuccess: null,
    getSingleRateError: "",
    FFCreateRateLoading: false,
    FFCreateRateSuccess: null,
    FFCreateRateError: "",
    getProductsLoading: false,
    getProductsSuccess: null,
    getProductsError: "",
    getFFRatesLoading: false,
    getFFRatesSuccess: null,
    getFFRatesError: "",
    FFAddMultipleRatesLoading: false,
    FFAddMultipleRatesSuccess: null,
    FFAddMultipleRatesError: "",
    FFToggleRateActivenessLoading: false,
    FFToggleRateActivenessSuccess: null,
    FFToggleRateActivenessError: "",
    FFUpdateRateLoading: false,
    FFUpdateRateSuccess: null,
    FFUpdateRateError: "",
    getPortsForRateTemplateLoading: false,
    getPortsForRateTemplateSuccess: null,
    getPortsForRateTemplateError: "",
    getProductsForRateTemplateLoading: false,
    getProductsForRateTemplateSuccess: null,
    getProductsForRateTemplateError: "",
};

export function rate(state = initialState, action) {
    switch (action.type) {
        case rateConstants.FETCH_HOT_DEALS_REQUEST:
            return {
                ...state,
                getHotDealsLoading: true,
                getHotDealsSuccess: null,
                getHotDealsError: "",
            };
        case rateConstants.FETCH_HOT_DEALS_SUCCESS:
            return {
                ...state,
                getHotDealsLoading: false,
                getHotDealsSuccess: action.payload,
                getHotDealsError: "",
            };
        case rateConstants.FETCH_HOT_DEALS_FAILURE:
            return {
                ...state,
                getHotDealsLoading: false,
                getHotDealsSuccess: null,
                getHotDealsError: action.payload,
            };

        case rateConstants.FETCH_PORTS_REQUEST:
            return {
                ...state,
                getPortsLoading: true,
                getPortsSuccess: null,
                getPortsError: "",
            };
        case rateConstants.FETCH_PORTS_SUCCESS:
            return {
                ...state,
                getPortsLoading: false,
                getPortsSuccess: action.payload,
                getPortsError: "",
            };
        case rateConstants.FETCH_PORTS_FAILURE:
            return {
                ...state,
                getPortsLoading: false,
                getPortsSuccess: null,
                getPortsError: action.payload,
            };

        case rateConstants.FETCH_RATES_REQUEST:
            return {
                ...state,
                getRatesLoading: true,
                getRatesSuccess: null,
                getRatesError: "",
            };
        case rateConstants.FETCH_RATES_SUCCESS:
            return {
                ...state,
                getRatesLoading: false,
                getRatesSuccess: action.payload,
                getRatesError: "",
            };
        case rateConstants.FETCH_RATES_FAILURE:
            return {
                ...state,
                getRatesLoading: false,
                getRatesSuccess: null,
                getRatesError: action.payload,
            };

        case rateConstants.FETCH_SINGLE_RATE_REQUEST:
            return {
                ...state,
                getSingleRateLoading: true,
                getSingleRateSuccess: null,
                getSingleRateError: "",
            };
        case rateConstants.FETCH_SINGLE_RATE_SUCCESS:
            return {
                ...state,
                getSingleRateLoading: false,
                getSingleRateSuccess: action.payload,
                getSingleRateError: "",
            };
        case rateConstants.FETCH_SINGLE_RATE_FAILURE:
            return {
                ...state,
                getSingleRateLoading: false,
                getSingleRateSuccess: null,
                getSingleRateError: action.payload,
            };

        case rateConstants.FF_CREATE_RATE_REQUEST:
            return {
                ...state,
                FFCreateRateLoading: true,
                FFCreateRateSuccess: null,
                FFCreateRateError: "",
            };
        case rateConstants.FF_CREATE_RATE_SUCCESS:
            return {
                ...state,
                FFCreateRateLoading: false,
                FFCreateRateSuccess: action.payload,
                FFCreateRateError: "",
            };
        case rateConstants.FF_CREATE_RATE_FAILURE:
            return {
                ...state,
                FFCreateRateLoading: false,
                FFCreateRateSuccess: null,
                FFCreateRateError: action.payload,
            };

        case rateConstants.FETCH_PRODUCTS_REQUEST:
            return {
                ...state,
                getProductsLoading: true,
                getProductsSuccess: null,
                getProductsError: "",
            };
        case rateConstants.FETCH_PRODUCTS_SUCCESS:
            return {
                ...state,
                getProductsLoading: false,
                getProductsSuccess: action.payload,
                getProductsError: "",
            };
        case rateConstants.FETCH_PRODUCTS_FAILURE:
            return {
                ...state,
                getProductsLoading: false,
                getProductsSuccess: null,
                getProductsError: action.payload,
            };

        case rateConstants.FETCH_FF_RATES_REQUEST:
            return {
                ...state,
                getFFRatesLoading: true,
                getFFRatesSuccess: null,
                getFFRatesError: "",
            };
        case rateConstants.FETCH_FF_RATES_SUCCESS:
            return {
                ...state,
                getFFRatesLoading: false,
                getFFRatesSuccess: action.payload,
                getFFRatesError: "",
            };
        case rateConstants.FETCH_FF_RATES_FAILURE:
            return {
                ...state,
                getFFRatesLoading: false,
                getFFRatesSuccess: null,
                getFFRatesError: action.payload,
            };

        case rateConstants.FF_ADD_MULTIPLE_RATES_REQUEST:
            return {
                ...state,
                FFAddMultipleRatesLoading: true,
                FFAddMultipleRatesSuccess: null,
                FFAddMultipleRatesError: "",
            };
        case rateConstants.FF_ADD_MULTIPLE_RATES_SUCCESS:
            return {
                ...state,
                FFAddMultipleRatesLoading: false,
                FFAddMultipleRatesSuccess: action.payload,
                FFAddMultipleRatesError: "",
            };
        case rateConstants.FF_ADD_MULTIPLE_RATES_FAILURE:
            return {
                ...state,
                FFAddMultipleRatesLoading: false,
                FFAddMultipleRatesSuccess: null,
                FFAddMultipleRatesError: action.payload,
            };

        case rateConstants.FF_TOGGLE_RATE_ACTIVENESS_REQUEST:
            return {
                ...state,
                FFToggleRateActivenessLoading: true,
                FFToggleRateActivenessSuccess: null,
                FFToggleRateActivenessError: "",
            };
        case rateConstants.FF_TOGGLE_RATE_ACTIVENESS_SUCCESS:
            return {
                ...state,
                FFToggleRateActivenessLoading: false,
                FFToggleRateActivenessSuccess: action.payload,
                FFToggleRateActivenessError: "",
            };
        case rateConstants.FF_TOGGLE_RATE_ACTIVENESS_FAILURE:
            return {
                ...state,
                FFToggleRateActivenessLoading: false,
                FFToggleRateActivenessSuccess: null,
                FFToggleRateActivenessError: action.payload,
            };

        case rateConstants.FF_UPDATE_RATE_REQUEST:
            return {
                ...state,
                FFUpdateRateLoading: true,
                FFUpdateRateSuccess: null,
                FFUpdateRateError: "",
            };
        case rateConstants.FF_UPDATE_RATE_SUCCESS:
            return {
                ...state,
                FFUpdateRateLoading: false,
                FFUpdateRateSuccess: action.payload,
                FFUpdateRateError: "",
            };
        case rateConstants.FF_UPDATE_RATE_FAILURE:
            return {
                ...state,
                FFUpdateRateLoading: false,
                FFUpdateRateSuccess: null,
                FFUpdateRateError: action.payload,
            };

        case rateConstants.FETCH_PORTS_FOR_RATES_TEMPLATE_REQUEST:
            return {
                ...state,
                getPortsForRateTemplateLoading: true,
                getPortsForRateTemplateSuccess: null,
                getPortsForRateTemplateError: "",
            };
        case rateConstants.FETCH_PORTS_FOR_RATES_TEMPLATE_SUCCESS:
            return {
                ...state,
                getPortsForRateTemplateLoading: false,
                getPortsForRateTemplateSuccess: action.payload,
                getPortsForRateTemplateError: "",
            };
        case rateConstants.FETCH_PORTS_FOR_RATES_TEMPLATE_FAILURE:
            return {
                ...state,
                getPortsForRateTemplateLoading: false,
                getPortsForRateTemplateSuccess: null,
                getPortsForRateTemplateError: action.payload,
            };

        case rateConstants.FETCH_PRODUCTS_FOR_RATES_TEMPLATE_REQUEST:
            return {
                ...state,
                getProductsForRateTemplateLoading: true,
                getProductsForRateTemplateSuccess: null,
                getProductsForRateTemplateError: "",
            };
        case rateConstants.FETCH_PRODUCTS_FOR_RATES_TEMPLATE_SUCCESS:
            return {
                ...state,
                getProductsForRateTemplateLoading: false,
                getProductsForRateTemplateSuccess: action.payload,
                getProductsForRateTemplateError: "",
            };
        case rateConstants.FETCH_PRODUCTS_FOR_RATES_TEMPLATE_FAILURE:
            return {
                ...state,
                getProductsForRateTemplateLoading: false,
                getProductsForRateTemplateSuccess: null,
                getProductsForRateTemplateError: action.payload,
            };

        case rateConstants.RESET_FF_CREATE_RATE_SUCCESS:
            return {
                ...state,
                FFCreateRateLoading: false,
                FFCreateRateSuccess: null,
                FFCreateRateError: "",
            };

        case rateConstants.RESET_FF_ADD_MULTIPLE_RATES_SUCCESS:
            return {
                ...state,
                FFAddMultipleRatesLoading: false,
                FFAddMultipleRatesSuccess: null,
                FFAddMultipleRatesError: "",
            };

        case rateConstants.RESET_FF_TOGGLE_RATE_ACTIVENESS_SUCCESS:
            return {
                ...state,
                FFToggleRateActivenessLoading: false,
                FFToggleRateActivenessSuccess: null,
                FFToggleRateActivenessError: "",
            };

        case rateConstants.RESET_FF_UPDATE_RATE_SUCCESS:
            return {
                ...state,
                FFUpdateRateLoading: false,
                FFUpdateRateSuccess: null,
                FFUpdateRateError: "",
            };

        case rateConstants.RESET_FETCH_FF_RATES_SUCCESS:
            return {
                ...state,
                getFFRatesLoading: false,
                getFFRatesSuccess: null,
                getFFRatesError: "",
            };

        case rateConstants.RESET_FETCH_PRODUCTS_FOR_RATES_TEMPLATE_SUCCESS:
            return {
                ...state,
                getPortsForRateTemplateLoading: false,
                getPortsForRateTemplateSuccess: null,
                getPortsForRateTemplateError: "",
            };

        case rateConstants.RESET_FETCH_PORTS_FOR_RATES_TEMPLATE_FAILURE:
            return {
                ...state,
                getProductsForRateTemplateLoading: false,
                getProductsForRateTemplateSuccess: null,
                getProductsForRateTemplateError: "",
            };

        default:
            return state;
    }
}
