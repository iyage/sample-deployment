import jwtDecode from "jwt-decode";
import CustomToast from "components/common/CustomToast";
import { authConstants } from "constants";
import { toast } from "react-hot-toast";
import { authService } from "services";

export const authActions = {
    fetchFreightForwarderProfile,
    registerFF,
    verifyByMail,
    resendVerifyCode,
    loginUser,
    logOut,
    forgotPassword,
    resetPassword,
    resetPasswordLoggedUser,
    updateToken,
    forceLogin,
    defaultResetState,
    fetchTeamMembers,
    resetVerifyCode,
    resetVerifyByMail,
    deleteAccount,
    addTeamMember,
    resetAddMemberSuccess,
    removeTeamMember,
    resetRemoveMemberSuccess,
    resetFetchMembersSuccess,
};

function fetchFreightForwarderProfile(id) {
    return (dispatch) => {
        dispatch(request(authConstants.FETCH_FF_PROFILE_REQUEST));
        authService.fetchFreightForwarderProfile(id).then(
            (res) => {
                dispatch(success(authConstants.FETCH_FF_PROFILE_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    // error alert also here
                    dispatch(failure(authConstants.FETCH_FF_PROFILE_FAILURE, error.message));
                }
            }
        );
    };
}

function registerFF(reqObj) {
    return (dispatch) => {
        dispatch(request(authConstants.REGISTER_FF_REQUEST));
        authService.registerFF(reqObj).then(
            (res) => {
                authService.saveAccount({
                    ...res.data.user.ff,
                    code: res.data.user.code,
                    token: res.data.user.token,
                });
                dispatch(success(authConstants.REGISTER_FF_SUCCESS, res.success));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.REGISTER_FF_FAILURE, error.message));
                }
            }
        );
    };
}

function verifyByMail(code) {
    return (dispatch) => {
        dispatch(request(authConstants.VERIFY_BY_EMAIL_REQUEST));
        authService.verifyByMail({ code }).then(
            (res) => {
                const user = {
                    ...res.data.user,
                    token: res.data.token,
                };
                dispatch(success(authConstants.VERIFY_BY_EMAIL_SUCCESS, user));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.VERIFY_BY_EMAIL_FAILURE, error.message));
                }
            }
        );
    };
}

function resendVerifyCode(showMessage = true) {
    return (dispatch) => {
        dispatch(request(authConstants.RESEND_VERIFY_CODE_REQUEST));
        authService.resendVerifyCode().then(
            (res) => {
                showMessage &&
                    toast.custom((t) => (
                        <CustomToast t={t} message={"Verify code resent to your mail."} />
                    ));
                dispatch(success(authConstants.RESEND_VERIFY_CODE_SUCCESS, true));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.RESEND_VERIFY_CODE_FAILURE, error.message));
                }
            }
        );
    };
}

function loginUser(loginObj, successToast = true) {
    return (dispatch) => {
        dispatch(request(authConstants.LOGIN_REQUEST));
        authService.loginUser(loginObj).then(
            (res) => {
                const user = {
                    ...jwtDecode(res.data.data.token),
                    token: res.data.data.token,
                };
                // hasOnboarded should be added here on the login check
                // if (user.active && successToast) {
                //     toast.custom((t) => <CustomToast t={t} message={"Login successful!"} />);
                // }
                authService.saveAccount(user);
                dispatch(success(authConstants.LOGIN_SUCCESS, user));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.LOGIN_FAILURE, error.message));
                }
            }
        );
    };
}

function forgotPassword(reqObj) {
    return (dispatch) => {
        dispatch(request(authConstants.FORGOT_PASSWORD_REQUEST));
        authService.forgetPassword(reqObj).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} />);
                dispatch(success(authConstants.FORGOT_PASSWORD_SUCCESS, res.success));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.FORGOT_PASSWORD_FAILURE, error.message));
                }
            }
        );
    };
}

function resetPassword(reqObj) {
    return (dispatch) => {
        dispatch(request(authConstants.RESET_PASSWORD_REQUEST));
        authService.resetPassword(reqObj).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} />);
                dispatch(success(authConstants.RESET_PASSWORD_SUCCESS, res.success));
                window.location.href = "/login";
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.RESET_PASSWORD_FAILURE, error.message));
                }
            }
        );
    };
}

function resetPasswordLoggedUser(password, successToast = true) {
    return (dispatch) => {
        dispatch(request(authConstants.RESET_PASSWORD_LOGGED_USER_REQUEST));
        authService.resetPasswordLoggedUser(password).then(
            (res) => {
                successToast && toast.custom((t) => <CustomToast t={t} message={res.message} />);
                dispatch(success(authConstants.RESET_PASSWORD_LOGGED_USER_SUCCESS, res.success));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(
                        failure(authConstants.RESET_PASSWORD_LOGGED_USER_FAILURE, error.message)
                    );
                }
            }
        );
    };
}

function fetchTeamMembers(page) {
    return (dispatch) => {
        dispatch(request(authConstants.FETCH_TEAM_MEMBERS_REQUEST));
        authService.fetchTeamMembers(page).then(
            (res) => {
                dispatch(success(authConstants.FETCH_TEAM_MEMBERS_SUCCESS, res.data));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.FETCH_TEAM_MEMBERS_FAILURE, error.message));
                }
            }
        );
    };
}

function deleteAccount() {
    return (dispatch) => {
        dispatch(request(authConstants.DELETE_ACCOUNT_REQUEST));
        authService.deleteAccount().then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} />);
                dispatch(success(authConstants.DELETE_ACCOUNT_SUCCESS, res.message));
                logOut();
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.DELETE_ACCOUNT_FAILURE, error.message));
                }
            }
        );
    };
}

function addTeamMember(data) {
    return (dispatch) => {
        dispatch(request(authConstants.ADD_MEMBER_REQUEST));
        authService.addTeamMember(data).then(
            (res) => {
                dispatch(success(authConstants.ADD_MEMBER_SUCCESS, res.data.team_member));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.ADD_MEMBER_FAILURE, error.message));
                }
            }
        );
    };
}

function removeTeamMember(id) {
    return (dispatch) => {
        dispatch(request(authConstants.REMOVE_MEMBER_REQUEST));
        authService.removeTeamMember(id).then(
            (res) => {
                toast.custom((t) => <CustomToast t={t} message={res.message} />);
                dispatch(success(authConstants.REMOVE_MEMBER_SUCCESS, res.success));
            },
            (error) => {
                if (error.message) {
                    toast.custom((t) => <CustomToast t={t} message={error.message} type="error" />);
                    dispatch(failure(authConstants.REMOVE_MEMBER_FAILURE, error.message));
                }
            }
        );
    };
}

function forceLogin(user) {
    return success(authConstants.LOGIN_SUCCESS, user);
}

function updateToken(gFF) {
    authService.saveAccount(gFF);
    return request(authConstants.LOG_OUT);
}

function logOut() {
    authService.logout();
    return request(authConstants.LOG_OUT);
}

function defaultResetState() {
    return success(authConstants.RESET_PASSWORD_LOGGED_USER_SUCCESS, false);
}

function resetVerifyCode() {
    return { type: authConstants.RESEND_VERIFY_CODE_SUCCESS, payload: false };
}

function resetVerifyByMail() {
    return { type: authConstants.VERIFY_BY_EMAIL_SUCCESS, payload: false };
}

function resetFetchMembersSuccess() {
    return { type: authConstants.FETCH_TEAM_MEMBERS_SUCCESS, payload: false };
}

function resetAddMemberSuccess() {
    return { type: authConstants.ADD_MEMBER_SUCCESS, payload: false };
}

function resetRemoveMemberSuccess() {
    return { type: authConstants.REMOVE_MEMBER_SUCCESS, payload: false };
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
