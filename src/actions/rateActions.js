import { rateConstants } from "constants";
import { rateService } from "services";

export const rateActions = {
    fetchHotDeals,
    fetchPorts,
    fetchRates,
    fetchSingleRate,
    FFCreateRate,
    fetchProducts,
    fetchFFRates,
    resetFFCreateRateSuccess,
    FFAddMultipleRates,
    resetFFAddMultipleRatesSuccess,
    resetFFToggleRateActivenessSuccess,
    FFToggleRateActiveness,
    FFUpdateRate,
    resetFFUpdateRateSuccess,
    resetFetchFFRatesSuccess,
    getProductsForRateTemplate,
    getPortsForRateTemplate,
    resetGetProductsForRateTemplateSuccess,
    resetGetPortsForRateTemplateSuccess,
};

function fetchHotDeals() {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_HOT_DEALS_REQUEST));
        rateService.getHotDeals().then(
            (res) => {
                dispatch(success(rateConstants.FETCH_HOT_DEALS_SUCCESS, res.data?.deals));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FETCH_HOT_DEALS_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchPorts(searchParam) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_PORTS_REQUEST));
        rateService.searchPorts(searchParam).then(
            (res) => {
                dispatch(success(rateConstants.FETCH_PORTS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FETCH_PORTS_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchRates(data) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_RATES_REQUEST));
        rateService.getRates(data).then(
            (res) => {
                dispatch(success(rateConstants.FETCH_RATES_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FETCH_RATES_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchSingleRate(rateId) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_SINGLE_RATE_REQUEST));
        rateService.getSingleRate(rateId).then(
            (res) => {
                dispatch(success(rateConstants.FETCH_SINGLE_RATE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FETCH_SINGLE_RATE_FAILURE, error.message));
                }
            }
        );
    };
}

function FFCreateRate(data) {
    return (dispatch) => {
        dispatch(request(rateConstants.FF_CREATE_RATE_REQUEST));
        rateService.FFCreateRate(data).then(
            (res) => {
                dispatch(success(rateConstants.FF_CREATE_RATE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FF_CREATE_RATE_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchProducts(searchParam) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_PRODUCTS_REQUEST));
        rateService.searchProducts(searchParam).then(
            (res) => {
                dispatch(success(rateConstants.FETCH_PRODUCTS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FETCH_PRODUCTS_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchFFRates(search, page) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_FF_RATES_REQUEST));
        rateService.getFFRates(search, page).then(
            (res) => {
                dispatch(success(rateConstants.FETCH_FF_RATES_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FETCH_FF_RATES_FAILURE, error.message));
                }
            }
        );
    };
}

function FFAddMultipleRates(data) {
    return (dispatch) => {
        dispatch(request(rateConstants.FF_ADD_MULTIPLE_RATES_REQUEST));
        rateService.addMultipleRates(data).then(
            (res) => {
                dispatch(success(rateConstants.FF_ADD_MULTIPLE_RATES_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FF_ADD_MULTIPLE_RATES_FAILURE, error.message));
                }
            }
        );
    };
}

function FFToggleRateActiveness(rateId) {
    return (dispatch) => {
        dispatch(request(rateConstants.FF_TOGGLE_RATE_ACTIVENESS_REQUEST));
        rateService.toggleRateActiveness(rateId).then(
            (res) => {
                dispatch(success(rateConstants.FF_TOGGLE_RATE_ACTIVENESS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(
                        failure(rateConstants.FF_TOGGLE_RATE_ACTIVENESS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function FFUpdateRate(data, rateId) {
    return (dispatch) => {
        dispatch(request(rateConstants.FF_UPDATE_RATE_REQUEST));
        rateService.updateRate(data, rateId).then(
            (res) => {
                dispatch(success(rateConstants.FF_UPDATE_RATE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(rateConstants.FF_UPDATE_RATE_FAILURE, error.message));
                }
            }
        );
    };
}

function getProductsForRateTemplate(data) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_PRODUCTS_FOR_RATES_TEMPLATE_REQUEST));
        rateService.getProductsForRateTemplate(data).then(
            (res) => {
                dispatch(
                    success(rateConstants.FETCH_PRODUCTS_FOR_RATES_TEMPLATE_SUCCESS, res.data)
                );
            },
            (error) => {
                if (error.message) {
                    dispatch(
                        failure(
                            rateConstants.FETCH_PRODUCTS_FOR_RATES_TEMPLATE_FAILURE,
                            error.message
                        )
                    );
                }
            }
        );
    };
}

function getPortsForRateTemplate(data) {
    return (dispatch) => {
        dispatch(request(rateConstants.FETCH_PORTS_FOR_RATES_TEMPLATE_REQUEST));
        rateService.getPortsForRateTemplate(data).then(
            (res) => {
                dispatch(success(rateConstants.FETCH_PORTS_FOR_RATES_TEMPLATE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(
                        failure(rateConstants.FETCH_PORTS_FOR_RATES_TEMPLATE_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function resetFFCreateRateSuccess() {
    return { type: rateConstants.RESET_FF_CREATE_RATE_SUCCESS };
}

function resetFFAddMultipleRatesSuccess() {
    return { type: rateConstants.RESET_FF_ADD_MULTIPLE_RATES_SUCCESS };
}

function resetFFToggleRateActivenessSuccess() {
    return { type: rateConstants.RESET_FF_TOGGLE_RATE_ACTIVENESS_SUCCESS };
}

function resetFFUpdateRateSuccess() {
    return { type: rateConstants.RESET_FF_UPDATE_RATE_SUCCESS };
}

function resetFetchFFRatesSuccess() {
    return { type: rateConstants.RESET_FETCH_FF_RATES_SUCCESS };
}

function resetGetProductsForRateTemplateSuccess() {
    return { type: rateConstants.RESET_FETCH_PRODUCTS_FOR_RATES_TEMPLATE_SUCCESS };
}

function resetGetPortsForRateTemplateSuccess() {
    return { type: rateConstants.RESET_FETCH_PORTS_FOR_RATES_TEMPLATE_FAILURE };
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
