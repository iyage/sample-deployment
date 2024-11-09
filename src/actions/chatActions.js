import { chatConstants } from "constants";
import { chatService } from "services/chatService";

export const chatActions = {
    fetchCustomerShipmentChat,
    sendCustomerChat,
    AddNewChat,
    fetchFFShipmentChat,
    sendFFChat,
    AddNewFFChat,
    clearFFChat,
};

function fetchCustomerShipmentChat(shipmentId, page = "") {
    return (dispatch) => {
        dispatch(request(chatConstants.CUSTOMER_SHIPMENT_CHAT_REQUEST));
        chatService.fetchCustomerShipmentChat(shipmentId, page).then(
            (res) => {
                dispatch(success(chatConstants.CUSTOMER_SHIPMENT_CHAT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(chatConstants.CUSTOMER_SHIPMENT_CHAT_FAILURE, error.message));
                }
            }
        );
    };
}

function sendCustomerChat(chatObj) {
    return (dispatch) => {
        dispatch(request(chatConstants.SEND_CUSTOMER_SHIPMENT_CHAT_REQUEST));
        chatService.sendCustomerChat(chatObj).then(
            (res) => {
                dispatch(success(chatConstants.SEND_CUSTOMER_SHIPMENT_CHAT_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(
                        failure(chatConstants.SEND_CUSTOMER_SHIPMENT_CHAT_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchFFShipmentChat(shipmentId, page) {
    return (dispatch) => {
        dispatch(request(chatConstants.FF_SHIPMENT_CHAT_REQUEST));
        chatService.fetchFFShipmentChat(shipmentId, page).then(
            (res) => {
                dispatch(success(chatConstants.FF_SHIPMENT_CHAT_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(chatConstants.FF_SHIPMENT_CHAT_FAILURE, error.message));
                }
            }
        );
    };
}

function sendFFChat(chatObj) {
    return (dispatch) => {
        dispatch(request(chatConstants.SEND_FF_SHIPMENT_CHAT_REQUEST));
        chatService.sendFFChat(chatObj).then(
            (res) => {
                dispatch(success(chatConstants.SEND_FF_SHIPMENT_CHAT_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    dispatch(failure(chatConstants.SEND_FF_SHIPMENT_CHAT_FAILURE, error.message));
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

function AddNewChat(data) {
    return { type: chatConstants.NEW_FF_CHAT, payload: [data] };
}

function AddNewFFChat(data) {
    return { type: chatConstants.NEW_CUSTOMER_CHAT, payload: [data] };
}

function clearFFChat() {
    return { type: chatConstants.CLEAR_FF_CHAT };
}
