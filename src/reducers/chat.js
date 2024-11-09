import { chatConstants } from "constants";
import moment from "moment";
import _ from "lodash";

const initialState = {
    customerShipmentChatsLoading: false,
    customerShipmentChats: {
        pagination: null,
        data: null,
    },
    customerShipmentChatsError: "",
    sendCustomerChatLoading: false,
    sendCustomerChatSuccess: false,
    sendCustomerChatError: "",
    FFShipmentChatsLoading: false,
    FFShipmentChats: {
        pagination: null,
        data: null,
    },
    FFShipmentChatsError: "",
    sendFFChatLoading: false,
    sendFFChatSuccess: false,
    sendFFChatError: "",
};

export function chat(state = initialState, action) {
    switch (action.type) {
        case chatConstants.CUSTOMER_SHIPMENT_CHAT_REQUEST:
            return {
                ...state,
                customerShipmentChatsLoading: true,
                customerShipmentChatsError: "",
            };
        case chatConstants.CUSTOMER_SHIPMENT_CHAT_SUCCESS: {
            const mergedChats = [action.payload.data, state.customerShipmentChats.data]
                .flat()
                .filter((chat) => chat);
            const ids = mergedChats.map((chat) => chat._id);
            const uniqueChats = mergedChats.filter(
                ({ _id }, index) => !ids.includes(_id, index + 1)
            );
            return {
                ...state,
                customerShipmentChats: { pagination: action.payload.pagination, data: uniqueChats },
                customerShipmentChatsLoading: false,
            };
        }
        case chatConstants.CUSTOMER_SHIPMENT_CHAT_FAILURE:
            return {
                ...state,
                customerShipmentChatsLoading: false,
                customerShipmentChatsError: "",
            };
        case chatConstants.SEND_CUSTOMER_SHIPMENT_CHAT_REQUEST:
            return {
                ...state,
                sendCustomerChatSuccess: false,
                sendCustomerChatError: false,
                sendCustomerChatLoading: true,
            };
        case chatConstants.SEND_CUSTOMER_SHIPMENT_CHAT_SUCCESS:
            return {
                ...state,
                sendCustomerChatSuccess: true,
                customerShipmentChats: {
                    pagination: state.customerShipmentChats.pagination,
                    data: [state.customerShipmentChats.data, action.payload]
                        .flat()
                        .filter((chat) => chat),
                },
                sendCustomerChatLoading: false,
            };
        case chatConstants.SEND_CUSTOMER_SHIPMENT_CHAT_FAILURE:
            return {
                ...state,
                sendCustomerChatLoading: false,
                sendCustomerChatError: action.payload,
            };
        case chatConstants.NEW_FF_CHAT:
            return {
                ...state,
                customerShipmentChats: {
                    pagination: state.customerShipmentChats.pagination,
                    data: [state.customerShipmentChats.data, action.payload]
                        .flat()
                        .filter((chat) => chat),
                },
                sendCustomerChatLoading: false,
            };

        case chatConstants.FF_SHIPMENT_CHAT_REQUEST:
            return {
                ...state,
                FFShipmentChatsLoading: true,
                FFShipmentChatsError: "",
            };
        case chatConstants.FF_SHIPMENT_CHAT_SUCCESS: {
            const mergedChats = [action.payload.data, state.FFShipmentChats.data]
                .flat()
                .filter((chat) => chat);
            const ids = mergedChats.map((chat) => chat._id);
            const uniqueChats = mergedChats.filter(
                ({ _id }, index) => !ids.includes(_id, index + 1)
            );
            return {
                ...state,
                FFShipmentChats: { pagination: action.payload.pagination, data: uniqueChats },
                FFShipmentChatsLoading: false,
            };
        }
        case chatConstants.FF_SHIPMENT_CHAT_FAILURE:
            return {
                ...state,
                FFShipmentChatsLoading: false,
                FFShipmentChatsError: "",
            };

        case chatConstants.SEND_FF_SHIPMENT_CHAT_REQUEST:
            return {
                ...state,
                sendFFChatSuccess: false,
                sendFFChatError: false,
                sendFFChatLoading: true,
            };
        case chatConstants.SEND_FF_SHIPMENT_CHAT_SUCCESS:
            return {
                ...state,
                sendFFChatSuccess: true,
                FFShipmentChats: {
                    pagination: state.FFShipmentChats.pagination,
                    data: _.uniqWith([...state.FFShipmentChats.data, action.payload], _.isEqual),
                },
                sendFFChatLoading: false,
            };
        case chatConstants.SEND_FF_SHIPMENT_CHAT_FAILURE:
            return {
                ...state,
                sendFFChatLoading: false,
                sendFFChatError: action.payload,
            };
        case chatConstants.NEW_CUSTOMER_CHAT: {
            const mergedChats = [state.FFShipmentChats.data, action.payload]
                .flat()
                .filter((chat) => chat)
                .map((msg) => ({
                    ...msg,
                    createdAt: moment(msg.createdAt).format(),
                    updatedAt: moment(msg.updatedAt).format(),
                }));
            const ids = mergedChats.map((chat) => chat._id);
            const uniqueChats = mergedChats.filter(
                ({ _id }, index) => !ids.includes(_id, index + 1)
            );
            return {
                ...state,
                FFShipmentChats: {
                    pagination: state.FFShipmentChats.pagination,
                    data: uniqueChats,
                },
                sendFFChatLoading: false,
            };
        }

        case chatConstants.CLEAR_FF_CHAT:
            return {
                ...state,
                FFShipmentChats: {
                    pagination: null,
                    data: null,
                },
                FFShipmentChatsLoading: false,
                FFShipmentChatsError: "",
            };

        default:
            return state;
    }
}
