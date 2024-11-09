import CustomToast from "components/common/CustomToast";
import { quoteConstants } from "constants";
import toast from "react-hot-toast";
import { quoteService } from "services";

export const quoteActions = {
    requestQuote,
    fetchSingleQuote,
    acceptQuote,
    rejectQuote,
    negotiateQuote,
    fetchSingleQuoteRequest,
    createQuoteForQuoteReq,
    resetCreateQuoteForReqSuccess,
    fetchQuotes,
    fetchExternalQuotes,
    fetchQuotesAnalytics,
    fetchOutgoingQuoteRequests,
    fetchIncomingQuoteRequests,
    FFAcceptQuote,
    FFRejectQuote,
    resetQuotetSuccessData,
    createQuoteToCustomer,
    resetCreateQuoteToCustomer,
    sendQuoteReqFF,
    resetSendQuoteToFF,
    resetFFAcceptRejectSuccessData,
    acceptQuoteRequest,
    rejectQuoteRequest,
    resetAcceptRejectQuoteRequestSuccessData,
    fetchShipmentQuotes,
    resetFetchSingleQuoteSuccessData,
};

function requestQuote(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.REQUEST_QUOTE));
        quoteService.requestQoute(data).then(
            (res) => {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        message={"Quote has been requested successfully"}
                        type="success"
                    />
                ));
                dispatch(success(quoteConstants.REQUESTED_QUOTE_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.REQUESTED_QUOTE_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchSingleQuote(id) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCHING_SINGLE_QUOTE));
        quoteService.fetchSingleQuote(id).then(
            (res) => {
                dispatch(success(quoteConstants.FETCHING_SINGLE_QUOTE_SUCCESS, res.data.quote));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => (
                        <CustomToast t={t} message={"Error fetching quote"} type="error" />
                    ));
                    dispatch(failure(quoteConstants.FETCHING_SINGLE_QUOTE_FAILURE, error.message));
                }
            }
        );
    };
}

function acceptQuote(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.ACCEPTING_SINGLE_QUOTE));
        quoteService.acceptQuote(data).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} type="success" />);
                dispatch(success(quoteConstants.ACCEPTING_SINGLE_QUOTE_SUCCESS, res));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.ACCEPTING_SINGLE_QUOTE_FAILURE, error.message));
                }
            }
        );
    };
}

function rejectQuote(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.REJECTIING_SINGLE_QUOTE));
        quoteService.rejectQuote(data).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} type="success" />);
                dispatch(success(quoteConstants.REJECTIING_SINGLE_QUOTE_SUCCESS, res));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(quoteConstants.REJECTIING_SINGLE_QUOTE_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function negotiateQuote(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.NEGOTIATING_SINGLE_QUOTE));
        quoteService.negotiateQuote(data).then(
            (res) => {
                dispatch(success(quoteConstants.NEGOTIATING_SINGLE_QUOTE_SUCCESS, res));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(quoteConstants.NEGOTIATING_SINGLE_QUOTE_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchSingleQuoteRequest(id, token) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCH_SINGLE_QUOTE_REQUEST));
        quoteService.fetchSingleQuoteRequest(id, token).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_SINGLE_QUOTE_SUCCESS, res.data.quote));
            },
            (error) => {
                if (error.message) {
                    if (!Boolean(token)) {
                        toast.custom((t) => (
                            <CustomToast
                                t={t}
                                message={"Error fetching quote request"}
                                type="error"
                            />
                        ));
                    }
                    dispatch(failure(quoteConstants.FETCH_SINGLE_QUOTE_FAILURE, error.message));
                }
            }
        );
    };
}

function createQuoteForQuoteReq(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_REQUEST));
        quoteService.createQuoteForQuoteReq(data).then(
            (res) => {
                dispatch(success(quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_SUCCESS, res.success));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);

                    dispatch(
                        failure(quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchQuotes(pageNo, status, startDate, endDate) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCH_QUOTES_REQUEST));
        quoteService.fetchQuotes(pageNo, status, startDate, endDate).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_QUOTES_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.FETCH_QUOTES_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchExternalQuotes(page) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCH_EXTERNAL_QUOTES_REQUEST));
        quoteService.fetchExternalQuotes(page).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_EXTERNAL_QUOTES_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.FETCH_EXTERNAL_QUOTES_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchQuotesAnalytics(selectedQuoteDate) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCH_QUOTES_ANALYTICS_REQUEST));
        quoteService.fetchQuotesAnalytics(selectedQuoteDate).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_QUOTES_ANALYTICS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.FETCH_QUOTES_ANALYTICS_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchOutgoingQuoteRequests(page) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCHING_OUTGOING_QUOTE_REQUEST));
        quoteService.fetchOutgoingQuoteRequests(page).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_OUTGOING_QUOTE_REQUEST_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(quoteConstants.FETCH_OUTGOING_QUOTE_REQUEST_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchIncomingQuoteRequests(page) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCHING_INCOMING_QUOTE_REQUEST));
        quoteService.fetchIncomingQuoteRequests(page).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_INCOMING_QUOTE_REQUEST_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(quoteConstants.FETCH_INCOMING_QUOTE_REQUEST_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function FFAcceptQuote(id) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FF_ACCEPTING_QUOTE_REQUEST));
        quoteService.FFAcceptQuote(id).then(
            (res) => {
                dispatch(success(quoteConstants.FF_ACCEPTING_QUOTE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.FF_ACCEPTING_QUOTE_FAILURE, error.message));
                }
            }
        );
    };
}

function FFRejectQuote(id) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FF_REJECTING_QUOTE_REQUEST));
        quoteService.FFRejectQuote(id).then(
            (res) => {
                dispatch(success(quoteConstants.FF_REJECTING_QUOTE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.FF_REJECTING_QUOTE_FAILURE, error.message));
                }
            }
        );
    };
}

function acceptQuoteRequest(id) {
    return (dispatch) => {
        dispatch(request(quoteConstants.QUOTE_REQUEST_ACCEPTANCE_REQUEST));
        quoteService.acceptQuoteRequest(id).then(
            (res) => {
                dispatch(success(quoteConstants.QUOTE_REQUEST_ACCEPTANCE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(quoteConstants.QUOTE_REQUEST_ACCEPTANCE_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function rejectQuoteRequest(id) {
    return (dispatch) => {
        dispatch(request(quoteConstants.QUOTE_REQUEST_REJECT_REQUEST));
        quoteService.rejectQuoteRequest(id).then(
            (res) => {
                dispatch(success(quoteConstants.QUOTE_REQUEST_REJECT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.QUOTE_REQUEST_REJECT_FAILURE, error.message));
                }
            }
        );
    };
}

function createQuoteToCustomer(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.CREATE_QUOTE_TO_CUSTOMER_REQUEST));
        quoteService.createQuoteToCustomer(data).then(
            (res) => {
                dispatch(
                    success(quoteConstants.CREATE_QUOTE_TO_CUSTOMER_SUCCESS, res.data.data.mvxid)
                );
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(quoteConstants.CREATE_QUOTE_TO_CUSTOMER_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function sendQuoteReqFF(data) {
    return (dispatch) => {
        dispatch(request(quoteConstants.SEND_QUOTE_REQ_FF_REQUEST));
        quoteService.sendQuoteReqFF(data).then(
            (res) => {
                dispatch(success(quoteConstants.SEND_QUOTE_REQ_FF_SUCCESS, res.success));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.SEND_QUOTE_REQ_FF_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchShipmentQuotes(shipmentId) {
    return (dispatch) => {
        dispatch(request(quoteConstants.FETCH_SHIPMENT_QUOTES_REQUEST));
        quoteService.fetchShipmentQuotes(shipmentId).then(
            (res) => {
                dispatch(success(quoteConstants.FETCH_SHIPMENT_QUOTES_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(quoteConstants.FETCH_SHIPMENT_QUOTES_FAILURE, error.message));
                }
            }
        );
    };
}
function resetFetchSingleQuoteSuccessData() {
    return { type: quoteConstants.RESET_FETCH_SINGLE_QUOTE_SUCCESS };
}

function resetAcceptRejectQuoteRequestSuccessData() {
    return { type: quoteConstants.RESET_ACCEPTING_REJECT_QUOTE_REQUEST_SUCCESS };
}

function resetFFAcceptRejectSuccessData() {
    return { type: quoteConstants.RESET_FF_ACCEPTING_REJECT_QUOTE_SUCCESS };
}

function resetQuotetSuccessData() {
    return { type: quoteConstants.RESET_QUOTE_SUCCESS_DATA };
}

function resetCreateQuoteForReqSuccess() {
    return failure(quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_SUCCESS, false);
}

function resetCreateQuoteToCustomer() {
    return success(quoteConstants.CREATE_QUOTE_TO_CUSTOMER_SUCCESS, null);
}

function resetSendQuoteToFF() {
    return success(quoteConstants.SEND_QUOTE_REQ_FF_SUCCESS, null);
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
