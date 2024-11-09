import { quoteConstants } from "constants";

const initialState = {
    isSubmittedSuccessfully: false,
    isSubmitting: false,
    isFetchingSingleQuote: false,
    singleQuoteData: null,
    acceptingQuote: false,
    quoteAccepted: false,
    rejectingQuote: false,
    quoteRejected: false,
    negotiatingQuote: false,
    quoteNegotiated: false,
    singleQuoteReq: null,
    singleQuoteReqLoading: false,
    singleQuoteReqError: false,
    createQuoteForReq: null,
    createQuoteForReqLoading: false,
    createQuoteForReqError: false,
    isFetchingQuotes: false,
    quotes: null,
    quotesError: false,
    isFetchingExternalQuotes: false,
    externalQuotes: null,
    externalQuotesError: false,
    isFetchingQuotesAnalytics: false,
    quotesAnalytics: null,
    quotesAnalyticsError: false,
    isFetchingOutgingQuoteRequests: false,
    outgoingQuoteRequests: null,
    outgoingQuoteRequestsError: false,
    isFetchingIncomingQuoteRequests: false,
    incomingQuoteRequests: null,
    incomingQuoteRequestsError: false,
    isFFAcceptingQuote: false,
    FFAcceptedQuoteSuccess: null,
    FFAcceptedQuoteError: false,
    isFFRejectingQuote: false,
    FFRejectedQuoteSuccess: null,
    FFRejectedQuoteError: false,
    createQuoteToCustomer: null,
    createQuoteToCustomerLoading: false,
    createQuoteToCustomerError: false,
    sendQuoteReqFF: null,
    sendQuoteReqFFLoading: false,
    sendQuoteReqFFError: false,
    isAcceptingQuoteRequest: false,
    acceptedQuoteRequestSuccess: null,
    acceptedQuoteRequestError: false,
    fetchingShipmentQuotes: false,
    fetchedShipmentQuotesSuccess: [],
    fetchedShipmentQuotesError: "",
    isRejectingQuoteRequest: false,
    rejectedQuoteRequestSuccess: null,
    rejectedQuoteRequestError: false,
};

export function quote(state = initialState, action) {
    switch (action.type) {
        case quoteConstants.REQUEST_QUOTE:
            return {
                ...state,
                isSubmitting: true,
            };
        case quoteConstants.REQUESTED_QUOTE_SUCCESS:
            return {
                ...state,
                isSubmittedSuccessfully: true,
                isSubmitting: false,
            };
        case quoteConstants.REQUESTED_QUOTE_FAILURE:
            return {
                ...state,
                isSubmittedSuccessfully: false,
                isSubmitting: false,
            };
        case quoteConstants.FETCHING_SINGLE_QUOTE:
            return {
                ...state,
                isFetchingSingleQuote: true,
            };
        case quoteConstants.FETCHING_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                isFetchingSingleQuote: false,
                singleQuoteData: action.payload,
            };
        case quoteConstants.FETCHING_SINGLE_QUOTE_FAILURE:
            return {
                ...state,
                isFetchingSingleQuote: false,
                singleQuoteData: null,
            };
        case quoteConstants.ACCEPTING_SINGLE_QUOTE:
            return {
                ...state,
                acceptingQuote: true,
            };
        case quoteConstants.ACCEPTING_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                acceptingQuote: false,
                quoteAccepted: true,
            };
        case quoteConstants.ACCEPTING_SINGLE_QUOTE_FAILURE:
            return {
                ...state,
                acceptingQuote: false,
                quoteAccepted: false,
            };
        case quoteConstants.REJECTIING_SINGLE_QUOTE:
            return {
                ...state,
                rejectingQuote: true,
            };
        case quoteConstants.REJECTIING_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                rejectingQuote: false,
                quoteRejected: true,
            };
        case quoteConstants.REJECTIING_SINGLE_QUOTE_FAILURE:
            return {
                ...state,
                rejectingQuote: false,
                quoteRejected: false,
            };
        case quoteConstants.NEGOTIATING_SINGLE_QUOTE:
            return {
                ...state,
                negotiatingQuote: true,
            };
        case quoteConstants.NEGOTIATING_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                negotiatingQuote: false,
                quoteNegotiated: true,
            };
        case quoteConstants.NEGOTIATING_SINGLE_QUOTE_FAILURE:
            return {
                ...state,
                negotiatingQuote: false,
                quoteNegotiated: false,
            };
        case quoteConstants.FETCH_SINGLE_QUOTE_REQUEST:
            return {
                ...state,
                singleQuoteReqLoading: true,
                singleQuoteReqError: false,
            };
        case quoteConstants.FETCH_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                singleQuoteReq: action.payload,
                singleQuoteReqLoading: false,
            };
        case quoteConstants.FETCH_SINGLE_QUOTE_FAILURE:
            return {
                ...state,
                singleQuoteReqLoading: false,
                singleQuoteReqError: action.payload,
            };
        case quoteConstants.FETCH_SHIPMENT_QUOTES_REQUEST:
            return {
                ...state,
                fetchingShipmentQuotes: true,
                fetchedShipmentQuotesSuccess: null,
                fetchedShipmentQuotesError: "",
            };
        case quoteConstants.FETCH_SHIPMENT_QUOTES_SUCCESS:
            return {
                ...state,
                fetchingShipmentQuotes: false,
                fetchedShipmentQuotesSuccess: action.payload,
                fetchedShipmentQuotesError: "",
            };
        case quoteConstants.FETCH_SHIPMENT_QUOTES_FAILURE:
            return {
                ...state,
                fetchingShipmentQuotes: false,
                fetchedShipmentQuotesSuccess: [],
                fetchedShipmentQuotesError: action.payload,
            };
        case quoteConstants.RESET_FETCH_SINGLE_QUOTE_SUCCESS:
            return {
                ...state,
                singleQuoteReqLoading: false,
                singleQuoteReq: null,
                singleQuoteReqError: false,
            };
        case quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_REQUEST:
            return {
                ...state,
                createQuoteForReqLoading: true,
                createQuoteForReqError: false,
            };
        case quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_SUCCESS:
            return {
                ...state,
                createQuoteForReqLoading: false,
                createQuoteForReq: action.payload,
            };
        case quoteConstants.CREATE_QUOTE_FOR_QUOTE_REQ_FAILURE:
            return {
                ...state,
                createQuoteForReqLoading: false,
                singleQuoteReqError: action.payload,
            };
        case quoteConstants.FETCH_QUOTES_REQUEST:
            return {
                ...state,
                isFetchingQuotes: true,
                quotesError: false,
            };
        case quoteConstants.FETCH_QUOTES_SUCCESS:
            return {
                ...state,
                quotes: action.payload,
                isFetchingQuotes: false,
                quotesError: false,
            };
        case quoteConstants.FETCH_QUOTES_FAILURE:
            return {
                ...state,
                isFetchingQuotes: false,
                quotesError: action.payload,
            };
        case quoteConstants.FETCH_QUOTES_ANALYTICS_REQUEST:
            return {
                ...state,
                isFetchingQuotesAnalytics: true,
                quotesAnalyticsError: false,
            };
        case quoteConstants.FETCH_QUOTES_ANALYTICS_SUCCESS:
            return {
                ...state,
                quotesAnalytics: action.payload,
                isFetchingQuotesAnalytics: false,
                quotesAnalyticsError: false,
            };
        case quoteConstants.FETCH_QUOTES_ANALYTICS_FAILURE:
            return {
                ...state,
                isFetchingQuotesAnalytics: false,
                quotesAnalyticsError: action.payload,
            };
        case quoteConstants.FETCH_EXTERNAL_QUOTES_REQUEST:
            return {
                ...state,
                isFetchingExternalQuotes: true,
                externalQuotesError: false,
            };
        case quoteConstants.FETCH_EXTERNAL_QUOTES_SUCCESS:
            return {
                ...state,
                externalQuotes: action.payload,
                isFetchingExternalQuotes: false,
                externalQuotesError: false,
            };
        case quoteConstants.FETCH_EXTERNAL_QUOTES_FAILURE:
            return {
                ...state,
                isFetchingExternalQuotes: false,
                externalQuotesError: action.payload,
            };
        case quoteConstants.FETCHING_OUTGOING_QUOTE_REQUEST:
            return {
                ...state,
                isFetchingOutgingQuoteRequests: true,
                outgoingQuoteRequestsError: false,
            };
        case quoteConstants.FETCH_OUTGOING_QUOTE_REQUEST_SUCCESS:
            return {
                ...state,
                outgoingQuoteRequests: action.payload,
                isFetchingOutgingQuoteRequests: false,
                outgoingQuoteRequestsError: false,
            };
        case quoteConstants.FETCH_OUTGOING_QUOTE_REQUEST_FAILURE:
            return {
                ...state,
                isFetchingOutgingQuoteRequests: false,
                outgoingQuoteRequestsError: action.payload,
            };

        case quoteConstants.FETCHING_INCOMING_QUOTE_REQUEST:
            return {
                ...state,
                isFetchingIncomingQuoteRequests: true,
                incomingQuoteRequestsError: false,
            };
        case quoteConstants.FETCH_INCOMING_QUOTE_REQUEST_SUCCESS:
            return {
                ...state,
                incomingQuoteRequests: action.payload,
                isFetchingIncomingQuoteRequests: false,
                incomingQuoteRequestsError: false,
            };
        case quoteConstants.FETCH_INCOMING_QUOTE_REQUEST_FAILURE:
            return {
                ...state,
                isFetchingIncomingQuoteRequests: false,
                incomingQuoteRequestsError: action.payload,
            };

        case quoteConstants.FF_ACCEPTING_QUOTE_REQUEST:
            return {
                ...state,
                isFFAcceptingQuote: true,
                FFAcceptedQuoteError: false,
            };
        case quoteConstants.FF_ACCEPTING_QUOTE_SUCCESS:
            return {
                ...state,
                FFAcceptedQuoteSuccess: action.payload,
                isFFAcceptingQuote: false,
                FFAcceptedQuoteError: false,
            };
        case quoteConstants.FF_ACCEPTING_QUOTE_FAILURE:
            return {
                ...state,
                isFFAcceptingQuote: false,
                FFAcceptedQuoteError: action.payload,
            };
        case quoteConstants.FF_REJECTING_QUOTE_REQUEST:
            return {
                ...state,
                isFFRejectingQuote: true,
                FFRejectedQuoteError: false,
            };
        case quoteConstants.FF_REJECTING_QUOTE_SUCCESS:
            return {
                ...state,
                FFRejectedQuoteSuccess: action.payload,
                isFFRejectingQuote: false,
                FFRejectedQuoteError: false,
            };
        case quoteConstants.FF_REJECTING_QUOTE_FAILURE:
            return {
                ...state,
                isFFRejectingQuote: false,
                FFRejectedQuoteError: action.payload,
            };

        case quoteConstants.RESET_QUOTE_SUCCESS_DATA:
            return {
                ...state,
                FFAcceptedQuoteSuccess: null,
                FFRejectedQuoteSuccess: null,
            };
        case quoteConstants.CREATE_QUOTE_TO_CUSTOMER_REQUEST:
            return {
                ...state,
                createQuoteToCustomerLoading: true,
                createQuoteToCustomerError: false,
            };
        case quoteConstants.CREATE_QUOTE_TO_CUSTOMER_SUCCESS:
            return {
                ...state,
                createQuoteToCustomerLoading: false,
                createQuoteToCustomer: action.payload,
            };
        case quoteConstants.CREATE_QUOTE_TO_CUSTOMER_FAILURE:
            return {
                ...state,
                createQuoteToCustomerLoading: false,
                createQuoteToCustomerError: action.payload,
            };
        case quoteConstants.SEND_QUOTE_REQ_FF_REQUEST:
            return {
                ...state,
                sendQuoteReqFFLoading: true,
                sendQuoteReqFFError: false,
            };
        case quoteConstants.SEND_QUOTE_REQ_FF_SUCCESS:
            return {
                ...state,
                sendQuoteReqFFLoading: false,
                sendQuoteReqFF: action.payload,
            };
        case quoteConstants.SEND_QUOTE_REQ_FF_FAILURE:
            return {
                ...state,
                sendQuoteReqFFLoading: false,
                sendQuoteReqFFError: action.payload,
            };

        case quoteConstants.QUOTE_REQUEST_ACCEPTANCE_REQUEST:
            return {
                ...state,
                isAcceptingQuoteRequest: true,
                acceptedQuoteRequestError: false,
            };
        case quoteConstants.QUOTE_REQUEST_ACCEPTANCE_SUCCESS:
            return {
                ...state,
                isAcceptingQuoteRequest: false,
                acceptedQuoteRequestSuccess: action.payload,
            };
        case quoteConstants.QUOTE_REQUEST_ACCEPTANCE_FAILURE:
            return {
                ...state,
                isAcceptingQuoteRequest: false,
                acceptedQuoteRequestError: action.payload,
            };

        case quoteConstants.QUOTE_REQUEST_REJECT_REQUEST:
            return {
                ...state,
                isRejectingQuoteRequest: true,
                rejectedQuoteRequestError: false,
            };
        case quoteConstants.QUOTE_REQUEST_REJECT_SUCCESS:
            return {
                ...state,
                isRejectingQuoteRequest: false,
                rejectedQuoteRequestSuccess: action.payload,
            };
        case quoteConstants.QUOTE_REQUEST_REJECT_FAILURE:
            return {
                ...state,
                isRejectingQuoteRequest: false,
                rejectedQuoteRequestError: action.payload,
            };

        case quoteConstants.RESET_FF_ACCEPTING_REJECT_QUOTE_SUCCESS:
            return {
                ...state,
                isFFAcceptingQuote: false,
                FFAcceptedQuoteSuccess: null,
                FFAcceptedQuoteError: false,
                isFFRejectingQuote: false,
                FFRejectedQuoteSuccess: null,
                FFRejectedQuoteError: false,
            };

        case quoteConstants.RESET_ACCEPTING_REJECT_QUOTE_REQUEST_SUCCESS:
            return {
                ...state,
                isAcceptingQuoteRequest: false,
                acceptedQuoteRequestSuccess: null,
                acceptedQuoteRequestError: false,
                isRejectingQuoteRequest: false,
                rejectedQuoteRequestSuccess: null,
                rejectedQuoteRequestError: false,
            };
        default:
            return state;
    }
}
