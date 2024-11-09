import { notificationConstants } from "constants";

const initialState = {
    notifications: null,
    notificationsLoading: false,
    notificationsError: "",
    markAsReadLoading: false,
    markAsReadError: "",
    markAllAsReadLoading: false,
    markAllAsReadError: "",
};

export function notification(state = initialState, { type, payload }) {
    switch (type) {
        case notificationConstants.FILTER_NOTIFICATIONS_REQUEST:
            return {
                ...state,
                notifications: !payload?.page
                    ? { ...state.notifications, data: null }
                    : { ...state.notifications },
                notificationsLoading: true,
                notificationsError: "",
            };
        case notificationConstants.FILTER_NOTIFICATIONS_SUCCESS:
            const uniqueNotifications = (oldNotsArr, newNotsArr) => {
                const mergedNots = [...oldNotsArr, ...newNotsArr];

                const ids = mergedNots.map((not) => not._id);
                const filteredNots = mergedNots.filter(
                    ({ _id }, index) => !ids.includes(_id, index + 1)
                );

                return filteredNots;
            };

            return {
                ...state,
                notificationsLoading: false,
                notifications:
                    payload?.status !== state.notifications?.status || !state.notifications
                        ? payload
                        : {
                              ...payload,
                              data: uniqueNotifications(
                                  state.notifications.data ?? [],
                                  payload.data
                              ),
                          },
            };
        case notificationConstants.FILTER_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                notificationsLoading: false,
                notificationsError: payload,
            };
        case notificationConstants.MARK_READ_REQUEST:
            return {
                ...state,
                markAsReadLoading: true,
                markAsReadError: "",
            };
        case notificationConstants.MARK_READ_SUCCESS:
            const newArr = [state.notifications?.data].flat().filter((not) => not);
            newArr.splice(
                newArr.indexOf(newArr.find((not) => not._id === payload._id)),
                1,
                payload
            );
            return {
                ...state,
                markAsReadLoading: false,
                notifications: {
                    ...state.notifications,
                    data: newArr,
                },
            };
        case notificationConstants.MARK_READ_FAILURE:
            return {
                ...state,
                markAsReadLoading: false,
                markAsReadError: payload,
            };

        case notificationConstants.MARK_ALL_READ_REQUEST:
            return {
                ...state,
                markAllAsReadLoading: true,
                markAllAsReadError: "",
            };
        case notificationConstants.MARK_ALL_READ_SUCCESS:
            return {
                ...state,
                markAllAsReadLoading: false,
                notifications: { pagination: state.notifications?.pagination, data: payload },
            };
        case notificationConstants.MARK_ALL_READ_FAILURE:
            return {
                ...state,
                markAllAsReadLoading: false,
                markAllAsReadError: payload,
            };
        default:
            return state;
    }
}
