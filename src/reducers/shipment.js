import { shipmentConstants } from "constants";

const initialState = {
    ffCustomerShipmentLoading: false,
    ffCustomerShipment: null,
    ffCustomerShipmentError: "",
    CSmovements: null,
    CSmovementsLoading: false,
    CSmovementsError: false,
    isSendingRating: false,
    isRatingCoomplete: false,
    isCreatingPendingShipment: false,
    isCreatingPendingShipmentComplete: null,
    isCreatingPendingShipmentFailure: "",
    isCreatingShipment: false,
    isCreatingShipmentComplete: null,
    isCreatingShipmentFailure: "",
    ffShipmentLoading: false,
    ffShipment: null,
    ffShipmentError: "",
    pendingShipmentLoading: false,
    pendingShipment: null,
    pendingShipmentError: "",
    isActiveShipmentsLoading: false,
    activeShipments: null,
    isActiveShipmentsError: "",
    isPendingShipmentsLoading: false,
    pendingShipments: null,
    isPendingShipmentsError: "",
    isCompletedShipmentsLoading: false,
    completedShipments: null,
    isCompletedShipmentsError: "",
    isCancelledShipmentsLoading: false,
    cancelledShipments: null,
    isCancelledShipmentsError: "",
    isShipmentCountLoading: false,
    shipmentCount: null,
    isShipmentCountError: "",
    isCustomerAndEarningsAnalyticsLoading: false,
    customerAndEarningsAnalytics: null,
    customerAndEarningsAnalyticsError: "",
    takeShipmentLiveLoading: false,
    takeShipmentLiveSuccess: null,
    takeShipmentLiveError: "",
    endLiveShipmentLoading: false,
    endLiveShipmentSuccess: null,
    endLiveShipmentError: "",
    cancelPendingShipmentLoading: false,
    cancelPendingShipmentSuccess: null,
    cancelPendingShipmentError: "",
    sendShipmentStatusLoading: false,
    sendShipmentStatusSuccess: null,
    sendShipmentStatusError: "",
    mvmPartners: null,
    mvmPartnersLoading: false,
    mvmPartnersError: "",
    createMovement: false,
    createMovementLoading: false,
    createMovementError: "",
    assignShipmentSuccess: null,
    assignShipmentLoading: false,
    assignShipmentError: "",
    FFmovements: null,
    FFmovementsLoading: false,
    FFmovementsError: false,
    isShipmentAnalyticsLoading: false,
    shipmentAnalytics: null,
    shipmentAnalyticsError: "",
};

export function shipment(state = initialState, action) {
    switch (action.type) {
        case shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FOR_CUSTOMER_REQUEST:
            return {
                ...state,
                ffCustomerShipmentError: null,
                ffCustomerShipmentLoading: true,
            };
        case shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FOR_CUSTOMER_SUCCESS:
            return {
                ...state,
                ffCustomerShipment: action.payload,
                ffCustomerShipmentLoading: false,
            };
        case shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FOR_CUSTOMER_FAILURE:
            return {
                ...state,
                ffCustomerShipmentLoading: false,
                ffCustomerShipmentError: action.payload,
            };
        case shipmentConstants.FETCH_CUSTOMER_MOVEMENTS_REQUEST:
            return {
                ...state,
                CSmovementsError: null,
                CSmovementsLoading: true,
            };
        case shipmentConstants.FETCH_CUSTOMER_MOVEMENTS_SUCCESS:
            return {
                ...state,
                CSmovements: action.payload,
                CSmovementsLoading: false,
            };
        case shipmentConstants.FETCH_CUSTOMER_MOVEMENTS_FAILURE:
            return {
                ...state,
                CSmovementsLoading: false,
                CSmovementsError: action.payload,
            };
        case shipmentConstants.SENDING_RATING:
            return {
                ...state,
                isSendingRating: true,
            };
        case shipmentConstants.SENDING_RATING_SUCCESS:
            return {
                ...state,
                isSendingRating: false,
                isRatingCoomplete: true,
            };
        case shipmentConstants.SENDING_RATING_FAILURE:
            return {
                ...state,
                isSendingRating: false,
                isRatingCoomplete: false,
            };
        case shipmentConstants.CREATE_SHIPMENT_REQUEST:
            return {
                ...state,
                isCreatingShipment: true,
                isCreatingShipmentComplete: null,
                isCreatingShipmentFailure: "",
            };
        case shipmentConstants.CREATE_SHIPMENT_SUCCESS:
            return {
                ...state,
                isCreatingShipment: false,
                isCreatingShipmentComplete: action.payload,
                isCreatingShipmentFailure: "",
            };
        case shipmentConstants.CREATE_SHIPMENT_FAILURE:
            return {
                ...state,
                isCreatingShipment: false,
                isCreatingShipmentComplete: null,
                isCreatingShipmentFailure: action.payload,
            };
        case shipmentConstants.CREATE_PENDING_SHIPMENT_REQUEST:
            return {
                ...state,
                isCreatingPendingShipment: true,
                isCreatingPendingShipmentComplete: null,
                isCreatingPendingShipmentFailure: "",
            };
        case shipmentConstants.CREATE_PENDING_SHIPMENT_SUCCESS:
            return {
                ...state,
                isCreatingPendingShipment: false,
                isCreatingPendingShipmentComplete: action.payload,
                isCreatingPendingShipmentFailure: "",
            };
        case shipmentConstants.CREATE_PENDING_SHIPMENT_FAILURE:
            return {
                ...state,
                isCreatingPendingShipment: false,
                isCreatingPendingShipmentComplete: null,
                isCreatingPendingShipmentFailure: action.payload,
            };
        case shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_REQUEST:
            return {
                ...state,
                ffShipmentError: null,
                ffShipmentLoading: true,
            };
        case shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_SUCCESS:
            return {
                ...state,
                ffShipment: action.payload,
                ffShipmentLoading: false,
            };
        case shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FAILURE:
            return {
                ...state,
                ffShipmentLoading: false,
                ffShipmentError: action.payload,
            };
        case shipmentConstants.FETCH_PENDING_SHIPMENT_REQUEST:
            return {
                ...state,
                pendingShipmentLoading: true,
                pendingShipment: null,
                pendingShipmentError: "",
            };
        case shipmentConstants.FETCH_PENDING_SHIPMENT_SUCCESS:
            return {
                ...state,
                pendingShipmentLoading: false,
                pendingShipment: action.payload,
                pendingShipmentError: "",
            };

        case shipmentConstants.FETCH_PENDING_SHIPMENT_FAILURE:
            return {
                ...state,
                pendingShipmentLoading: false,
                pendingShipment: null,
                pendingShipmentError: action.payload,
            };
        case shipmentConstants.ADD_PENDING_SHIPMENT:
            return {
                ...state,
                pendingShipment: action.payload,
            };
        case shipmentConstants.FETCH_ACTIVE_SHIPMENTS_REQUEST:
            return {
                ...state,
                isActiveShipmentsLoading: true,
                activeShipments: null,
                isActiveShipmentsError: "",
            };
        case shipmentConstants.FETCH_ACTIVE_SHIPMENTS_SUCCESS:
            return {
                ...state,
                isActiveShipmentsLoading: false,
                activeShipments: action.payload,
                isActiveShipmentsError: "",
            };
        case shipmentConstants.FETCH_ACTIVE_SHIPMENTS_FAILURE:
            return {
                ...state,
                isActiveShipmentsLoading: false,
                activeShipments: null,
                isActiveShipmentsError: action.payload,
            };
        case shipmentConstants.FETCH_CUSTOMER_AND_EARNINGS_ANALYTICS_REQUEST:
            return {
                ...state,
                isCustomerAndEarningsAnalyticsLoading: true,
                customerAndEarningsAnalytics: null,
                customerAndEarningsAnalyticsError: "",
            };
        case shipmentConstants.FETCH_CUSTOMER_AND_EARNINGS_ANALYTICS_SUCCESS:
            return {
                ...state,
                isCustomerAndEarningsAnalyticsLoading: false,
                customerAndEarningsAnalytics: action.payload,
                customerAndEarningsAnalyticsError: "",
            };
        case shipmentConstants.FETCH_CUSTOMER_AND_EARNINGS_ANALYTICS_FAILURE:
            return {
                ...state,
                isCustomerAndEarningsAnalyticsLoading: false,
                customerAndEarningsAnalytics: null,
                customerAndEarningsAnalyticsError: action.payload,
            };

        case shipmentConstants.TAKE_SHIPMENT_LIVE_REQUEST:
            return {
                ...state,
                takeShipmentLiveLoading: true,
                takeShipmentLiveSuccess: null,
                takeShipmentLiveError: "",
            };
        case shipmentConstants.TAKE_SHIPMENT_LIVE_SUCCESS:
            return {
                ...state,
                takeShipmentLiveLoading: false,
                takeShipmentLiveSuccess: action.payload,
                takeShipmentLiveError: "",
            };
        case shipmentConstants.TAKE_SHIPMENT_LIVE_FAILURE:
            return {
                ...state,
                takeShipmentLiveLoading: false,
                takeShipmentLiveSuccess: null,
                takeShipmentLiveError: action.payload,
            };

        case shipmentConstants.FETCH_PENDING_SHIPMENTS_REQUEST:
            return {
                ...state,
                isPendingShipmentsLoading: true,
                pendingShipments: null,
                isPendingShipmentsError: "",
            };
        case shipmentConstants.FETCH_PENDING_SHIPMENTS_SUCCESS:
            return {
                ...state,
                isPendingShipmentsLoading: false,
                pendingShipments: action.payload,
                isPendingShipmentsError: "",
            };
        case shipmentConstants.FETCH_PENDING_SHIPMENTS_FAILURE:
            return {
                ...state,
                isPendingShipmentsLoading: false,
                pendingShipments: null,
                isPendingShipmentsError: action.payload,
            };

        case shipmentConstants.FETCH_COMPLETED_SHIPMENTS_REQUEST:
            return {
                ...state,
                isCompletedShipmentsLoading: true,
                completedShipments: null,
                isCompletedShipmentsError: "",
            };
        case shipmentConstants.FETCH_COMPLETED_SHIPMENTS_SUCCESS:
            return {
                ...state,
                isCompletedShipmentsLoading: false,
                completedShipments: action.payload,
                isCompletedShipmentsError: "",
            };
        case shipmentConstants.FETCH_COMPLETED_SHIPMENTS_FAILURE:
            return {
                ...state,
                isCompletedShipmentsLoading: false,
                completedShipments: null,
                isCompletedShipmentsError: action.payload,
            };

        case shipmentConstants.FETCH_CANCELLED_SHIPMENTS_REQUEST:
            return {
                ...state,
                isCancelledShipmentsLoading: true,
                cancelledShipments: null,
                isCancelledShipmentsError: "",
            };
        case shipmentConstants.FETCH_CANCELLED_SHIPMENTS_SUCCESS:
            return {
                ...state,
                isCancelledShipmentsLoading: false,
                cancelledShipments: action.payload,
                isCancelledShipmentsError: "",
            };
        case shipmentConstants.FETCH_CANCELLED_SHIPMENTS_FAILURE:
            return {
                ...state,
                isCancelledShipmentsLoading: false,
                cancelledShipments: null,
                isCancelledShipmentsError: action.payload,
            };

        case shipmentConstants.FETCH_SHIPMENT_COUNT_REQUEST:
            return {
                ...state,
                isShipmentCountLoading: true,
                shipmentCount: null,
                isShipmentCountError: "",
            };
        case shipmentConstants.FETCH_SHIPMENT_COUNT_SUCCESS:
            return {
                ...state,
                isShipmentCountLoading: false,
                shipmentCount: action.payload,
                isShipmentCountError: "",
            };
        case shipmentConstants.FETCH_SHIPMENT_COUNT_FAILURE:
            return {
                ...state,
                isShipmentCountLoading: false,
                shipmentCount: null,
                isShipmentCountError: action.payload,
            };

        case shipmentConstants.END_LIVE_SHIPMENT_REQUEST:
            return {
                ...state,
                endLiveShipmentLoading: true,
                endLiveShipmentSuccess: null,
                endLiveShipmentError: "",
            };
        case shipmentConstants.END_LIVE_SHIPMENT_SUCCESS:
            return {
                ...state,
                endLiveShipmentLoading: false,
                endLiveShipmentSuccess: action.payload,
                endLiveShipmentError: "",
            };
        case shipmentConstants.END_LIVE_SHIPMENT_FAILURE:
            return {
                ...state,
                endLiveShipmentLoading: false,
                endLiveShipmentSuccess: null,
                endLiveShipmentError: action.payload,
            };

        case shipmentConstants.CANCEL_PENDING_SHIPMENT_REQUEST:
            return {
                ...state,
                cancelPendingShipmentLoading: true,
                cancelPendingShipmentSuccess: null,
                cancelPendingShipmentError: "",
            };
        case shipmentConstants.CANCEL_PENDING_SHIPMENT_SUCCESS:
            return {
                ...state,
                cancelPendingShipmentLoading: false,
                cancelPendingShipmentSuccess: action.payload,
                cancelPendingShipmentError: "",
            };
        case shipmentConstants.CANCEL_PENDING_SHIPMENT_FAILURE:
            return {
                ...state,
                cancelPendingShipmentLoading: false,
                cancelPendingShipmentSuccess: null,
                cancelPendingShipmentError: action.payload,
            };

        case shipmentConstants.SEND_SHIPMENT_STATUS_UPDATE_REQUEST:
            return {
                ...state,
                sendShipmentStatusLoading: true,
                sendShipmentStatusSuccess: null,
                sendShipmentStatusError: "",
            };
        case shipmentConstants.SEND_SHIPMENT_STATUS_UPDATE_SUCCESS:
            return {
                ...state,
                sendShipmentStatusLoading: false,
                sendShipmentStatusSuccess: action.payload,
                sendShipmentStatusError: "",
            };
        case shipmentConstants.SEND_SHIPMENT_STATUS_UPDATE_FAILURE:
            return {
                ...state,
                sendShipmentStatusLoading: false,
                sendShipmentStatusSuccess: null,
                sendShipmentStatusError: action.payload,
            };

        case shipmentConstants.FETCH_MVM_PARTNERS_REQUEST:
            return {
                ...state,
                mvmPartnersError: "",
                mvmPartnersLoading: true,
            };
        case shipmentConstants.FETCH_MVM_PARTNERS_SUCCESS:
            return {
                ...state,
                mvmPartners: action.payload,
                mvmPartnersLoading: false,
            };
        case shipmentConstants.FETCH_MVM_PARTNERS_FAILURE:
            return {
                ...state,
                mvmPartnersLoading: false,
                mvmPartnersError: action.payload,
            };
        case shipmentConstants.CREATE_MVM_REQUEST:
            return {
                ...state,
                createMovement: false,
                createMovementError: null,
                createMovementLoading: true,
            };
        case shipmentConstants.CREATE_MVM_SUCCESS:
            return {
                ...state,
                FFmovements: [action.payload, state.FFmovements].flat().filter((mvm) => mvm && mvm),
                createMovement: true,
                createMovementLoading: false,
            };
        case shipmentConstants.CREATE_MVM_FAILURE:
            return {
                ...state,
                createMovementLoading: false,
                createMovementError: action.payload,
            };
        case shipmentConstants.ASSIGN_SHIPMENT_TO_MEMBER_REQUEST:
            return {
                ...state,
                assignShipmentSuccess: false,
                assignShipmentError: "",
                assignShipmentLoading: true,
            };
        case shipmentConstants.ASSIGN_SHIPMENT_TO_MEMBER_SUCCESS:
            return {
                ...state,
                // ffShipment: state.ffShipment ? {...state.ffShipment} : null,
                assignShipmentSuccess: true,
                assignShipmentLoading: false,
            };
        case shipmentConstants.RESET_SHIPMENT_SUCCESS_DATA:
            return {
                ...state,
                takeShipmentLiveSuccess: null,
                endLiveShipmentSuccess: null,
                cancelPendingShipmentSuccess: null,
                sendShipmentStatusSuccess: null,
                isCreatingPendingShipmentComplete: null,
                isCreatingShipmentComplete: null,
                ffShipment: null,
            };
        case shipmentConstants.FETCH_FF_MOVEMENTS_REQUEST:
            return {
                ...state,
                FFmovementsError: null,
                FFmovementsLoading: true,
            };
        case shipmentConstants.FETCH_FF_MOVEMENTS_SUCCESS:
            return {
                ...state,
                FFmovements: action.payload,
                FFmovementsLoading: false,
            };
        case shipmentConstants.FETCH_FF_MOVEMENTS_FAILURE:
            return {
                ...state,
                FFmovementsLoading: false,
                FFmovementsError: action.payload,
            };

        case shipmentConstants.FETCH_SHIPMENT_ANALYTICS_REQUEST:
            return {
                ...state,
                shipmentAnalyticsError: null,
                isShipmentAnalyticsLoading: true,
            };
        case shipmentConstants.FETCH_SHIPMENT_ANALYTICS_SUCCESS:
            return {
                ...state,
                shipmentAnalytics: action.payload,
                isShipmentAnalyticsLoading: false,
                shipmentAnalyticsError: null,
            };
        case shipmentConstants.FETCH_SHIPMENT_ANALYTICS_FAILURE:
            return {
                ...state,
                isShipmentAnalyticsLoading: false,
                shipmentAnalyticsError: action.payload,
            };

        case shipmentConstants.RESET_CREATE_MVM_SUCCESS:
            return {
                ...state,
                createMovement: false,
                createMovementError: null,
                createMovementLoading: false,
            };
        default:
            return state;
    }
}
