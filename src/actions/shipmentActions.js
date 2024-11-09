import CustomToast from "components/common/CustomToast";
import { shipmentConstants } from "constants";
import toast from "react-hot-toast";
import { shipmentService } from "services";

export const shipmentActions = {
    fetchFFSingleShipmentForCustomer,
    fetchCustomerMovements,
    sendRating,
    createShipment,
    createPendingShipment,
    fetchFFSingleShipment,
    fetchPendingShipment,
    fetchActiveShipments,
    fetchPendingShipments,
    fetchCompletedShipments,
    fetchCustomerAndEarningsAnalytics,
    takeShipmentLive,
    endLiveShipment,
    cancelLiveShipment,
    fetchCancelledShipments,
    sendShipmentStatusUpdate,
    fetchMovementPartners,
    createMovement,
    assignShipmentToMember,
    fetchShipmentCount,
    resetShipmentSuccessData,
    fetchFFMovements,
    setFFProfile,
    addNewPendingShipments,
    fetchShipmentAnalytics,
    clearMovementCreationSuccess,
    clearAssignShipmentToMember,
};

function fetchFFSingleShipmentForCustomer(id) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FOR_CUSTOMER_REQUEST));
        shipmentService.fetchFFSingleShipmentForCustomer(id).then(
            (res) => {
                dispatch(
                    success(
                        shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FOR_CUSTOMER_SUCCESS,
                        res.data.data
                    )
                );
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    dispatch(
                        failure(
                            shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FOR_CUSTOMER_FAILURE,
                            error.message
                        )
                    );
                }
            }
        );
    };
}

function fetchCustomerMovements(shipmentId) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_CUSTOMER_MOVEMENTS_REQUEST));
        shipmentService.fetchCustomerMovements(shipmentId).then(
            (res) => {
                dispatch(
                    success(shipmentConstants.FETCH_CUSTOMER_MOVEMENTS_SUCCESS, res.data.movements)
                );
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    dispatch(
                        failure(shipmentConstants.FETCH_CUSTOMER_MOVEMENTS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function sendRating(data) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.SENDING_RATING));
        shipmentService.sendRating(data).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} type="success" />);
                dispatch(success(shipmentConstants.SENDING_RATING_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(shipmentConstants.SENDING_RATING_FAILURE, error.message));
                }
            }
        );
    };
}

function createShipment(data, shipmentId) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.CREATE_SHIPMENT_REQUEST));
        shipmentService.createShipment(data, shipmentId).then(
            (res) => {
                dispatch(success(shipmentConstants.CREATE_SHIPMENT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(shipmentConstants.CREATE_SHIPMENT_FAILURE, error.message));
                }
            }
        );
    };
}

function createPendingShipment(data) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.CREATE_PENDING_SHIPMENT_REQUEST));
        shipmentService.createPendingShipment(data).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} type="success" />);
                dispatch(success(shipmentConstants.CREATE_PENDING_SHIPMENT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.CREATE_PENDING_SHIPMENT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchFFSingleShipment(id) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_REQUEST));
        shipmentService.fetchFFSingleShipment(id).then(
            (res) => {
                dispatch(
                    success(shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_SUCCESS, res.data.data)
                );
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);

                    dispatch(
                        failure(shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchPendingShipment(id) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_PENDING_SHIPMENT_REQUEST));
        shipmentService.fetchPendingShipment(id).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_PENDING_SHIPMENT_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_PENDING_SHIPMENT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchActiveShipments(status, pageNo, search, startDate, endDate) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_ACTIVE_SHIPMENTS_REQUEST));
        shipmentService.fetchShipments(status, pageNo, search, startDate, endDate).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_ACTIVE_SHIPMENTS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_ACTIVE_SHIPMENTS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchPendingShipments(status, pageNo, search, startDate, endDate) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_PENDING_SHIPMENTS_REQUEST));
        shipmentService.fetchShipments(status, pageNo, search, startDate, endDate).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_PENDING_SHIPMENTS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_PENDING_SHIPMENTS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchCompletedShipments(status, pageNo, search, startDate, endDate) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_COMPLETED_SHIPMENTS_REQUEST));
        shipmentService.fetchShipments(status, pageNo, search, startDate, endDate).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_COMPLETED_SHIPMENTS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_COMPLETED_SHIPMENTS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchCancelledShipments(status, pageNo, search, startDate, endDate) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_CANCELLED_SHIPMENTS_REQUEST));
        shipmentService.fetchShipments(status, pageNo, search, startDate, endDate).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_CANCELLED_SHIPMENTS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_CANCELLED_SHIPMENTS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchShipmentCount(pageNo) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_SHIPMENT_COUNT_REQUEST));
        shipmentService.fetchShipments(pageNo).then(
            (res) => {
                dispatch(
                    success(
                        shipmentConstants.FETCH_SHIPMENT_COUNT_SUCCESS,
                        res.data?.totalNumberOfShipments
                    )
                );
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_SHIPMENT_COUNT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchCustomerAndEarningsAnalytics(date) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_CUSTOMER_AND_EARNINGS_ANALYTICS_REQUEST));
        shipmentService.fetchCustomerAndEarningsAnalytics(date).then(
            (res) => {
                dispatch(
                    success(
                        shipmentConstants.FETCH_CUSTOMER_AND_EARNINGS_ANALYTICS_SUCCESS,
                        res.data.data
                    )
                );
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(
                            shipmentConstants.FETCH_CUSTOMER_AND_EARNINGS_ANALYTICS_FAILURE,
                            error.message
                        )
                    );
                }
            }
        );
    };
}

function fetchShipmentAnalytics(date) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_SHIPMENT_ANALYTICS_REQUEST));
        shipmentService.fetchShipmentAnalytics(date).then(
            (res) => {
                dispatch(
                    success(shipmentConstants.FETCH_SHIPMENT_ANALYTICS_SUCCESS, res.data.data)
                );
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.FETCH_SHIPMENT_ANALYTICS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function takeShipmentLive(id) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.TAKE_SHIPMENT_LIVE_REQUEST));
        shipmentService.takeShipmentLive(id).then(
            (res) => {
                dispatch(success(shipmentConstants.TAKE_SHIPMENT_LIVE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(shipmentConstants.TAKE_SHIPMENT_LIVE_FAILURE, error.message));
                }
            }
        );
    };
}

function fetchMovementPartners(shipmentId) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_MVM_PARTNERS_REQUEST));
        shipmentService.fetchMovementPartners(shipmentId).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_MVM_PARTNERS_SUCCESS, res.data.partners));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);

                    dispatch(failure(shipmentConstants.FETCH_MVM_PARTNERS_FAILURE, error.message));
                }
            }
        );
    };
}

function endLiveShipment(id) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.END_LIVE_SHIPMENT_REQUEST));
        shipmentService.endLiveShipment(id).then(
            (res) => {
                dispatch(success(shipmentConstants.END_LIVE_SHIPMENT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(shipmentConstants.END_LIVE_SHIPMENT_FAILURE, error.message));
                }
            }
        );
    };
}

function cancelLiveShipment(id) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.CANCEL_PENDING_SHIPMENT_REQUEST));
        shipmentService.cancelLiveShipment(id).then(
            (res) => {
                dispatch(success(shipmentConstants.CANCEL_PENDING_SHIPMENT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.CANCEL_PENDING_SHIPMENT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function createMovement(reqData) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.CREATE_MVM_REQUEST));
        shipmentService.createMovement(reqData).then(
            (res) => {
                dispatch(success(shipmentConstants.CREATE_MVM_SUCCESS, res.data.data));
                toast.custom((t) => <CustomToast t={t} message={res.message + "!"} />);
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);

                    dispatch(failure(shipmentConstants.CREATE_MVM_FAILURE, error.message));
                }
            }
        );
    };
}

function sendShipmentStatusUpdate(data) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.SEND_SHIPMENT_STATUS_UPDATE_REQUEST));
        shipmentService.sendShipmentStatusUpdate(data).then(
            (res) => {
                dispatch(success(shipmentConstants.SEND_SHIPMENT_STATUS_UPDATE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(
                            shipmentConstants.SEND_SHIPMENT_STATUS_UPDATE_FAILURE,
                            error.message
                        )
                    );
                }
            }
        );
    };
}

function assignShipmentToMember(reqData) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.ASSIGN_SHIPMENT_TO_MEMBER_REQUEST));
        shipmentService.assignShipmentToMember(reqData).then(
            (res) => {
                dispatch(success(shipmentConstants.ASSIGN_SHIPMENT_TO_MEMBER_SUCCESS, res.data));
                toast.custom((t) => <CustomToast t={t} message={"Member assigned!"} />);
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(shipmentConstants.ASSIGN_SHIPMENT_TO_MEMBER_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchFFMovements(shipmentId) {
    return (dispatch) => {
        dispatch(request(shipmentConstants.FETCH_FF_MOVEMENTS_REQUEST));
        shipmentService.fetchFFMovements(shipmentId).then(
            (res) => {
                dispatch(success(shipmentConstants.FETCH_FF_MOVEMENTS_SUCCESS, res.data.movements));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    dispatch(failure(shipmentConstants.FETCH_FF_MOVEMENTS_FAILURE, error.message));
                }
            }
        );
    };
}

function resetShipmentSuccessData() {
    return { type: shipmentConstants.RESET_SHIPMENT_SUCCESS_DATA };
}

function clearMovementCreationSuccess() {
    return { type: shipmentConstants.RESET_CREATE_MVM_SUCCESS };
}

function addNewPendingShipments(data) {
    return { type: shipmentConstants.ADD_PENDING_SHIPMENT, payload: data };
}

function setFFProfile(ffProfile) {
    return success(shipmentConstants.FETCH_FF_SINGLE_SHIPMENT_SUCCESS, ffProfile);
}

function clearAssignShipmentToMember() {
    return success(shipmentConstants.ASSIGN_SHIPMENT_TO_MEMBER_SUCCESS, false);
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
