import CustomToast from "components/common/CustomToast";
import { notificationConstants } from "constants";
import toast from "react-hot-toast";
import { notificationService } from "services";

export const notificationActions = {
    filterNotifications,
    markAsRead,
    markAllAsRead,
};

function filterNotifications(status, page) {
    return (dispatch) => {
        dispatch(success(notificationConstants.FILTER_NOTIFICATIONS_REQUEST, { page }));
        notificationService.filterNotifications(status === "all" ? undefined : status, page).then(
            (res) => {
                dispatch(
                    success(notificationConstants.FILTER_NOTIFICATIONS_SUCCESS, {
                        ...res.data,
                        status,
                    })
                );
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(notificationConstants.FILTER_NOTIFICATIONS_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function markAsRead(id) {
    return (dispatch) => {
        dispatch(request(notificationConstants.MARK_READ_REQUEST));
        notificationService.markAsRead(id).then(
            (res) => {
                dispatch(success(notificationConstants.MARK_READ_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(notificationConstants.MARK_READ_FAILURE, error.message));
                }
            }
        );
    };
}

function markAllAsRead() {
    return (dispatch) => {
        dispatch(request(notificationConstants.MARK_ALL_READ_REQUEST));
        notificationService.markAllAsRead().then(
            (res) => {
                dispatch(success(notificationConstants.MARK_ALL_READ_SUCCESS, res.data.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(notificationConstants.MARK_ALL_READ_FAILURE, error.message));
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
