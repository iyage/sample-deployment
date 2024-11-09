import { authConstants } from "constants";

const initialState = {
    ffProfileLoading: false,
    ffProfile: null,
    ffProfileError: "",
    registerLoading: false,
    registered: null,
    registerError: false,
    verifyByMailLoading: false,
    verifyByMailSuccess: null,
    verifyByMailError: false,
    verifyByPhoneLoading: false,
    verifyByPhoneSuccess: null,
    verifyByPhoneError: false,
    resendVerifyCodeLoading: false,
    resendVerifyCodeSuccess: null,
    resendVerifyCodeError: false,
    loginLoading: false,
    loginError: false,
    user: null,
    forgotPasswordLoading: false,
    forgotPasswordSuccess: null,
    forgotPasswordError: false,
    resetPasswordLoading: false,
    resetPasswordSuccess: null,
    resetPasswordError: false,
    resetPasswordLoggedInLoading: false,
    resetPasswordLoggedInSuccess: null,
    resetPasswordLoggedInError: false,
    teamMembers: null,
    teamMembersLoading: false,
    teamMembersError: "",
    deleteAccountLoading: false,
    deleteAccountSuccess: false,
    deleteAccountError: false,
    addMemberLoading: false,
    addMemberSuccess: null,
    addMemberError: false,
    removeMemberSuccess: null,
    removeMemberLoading: false,
    removeMemberError: "",
};

export function auth(state = initialState, action) {
    switch (action.type) {
        case authConstants.FETCH_FF_PROFILE_REQUEST:
            return {
                ...state,
                ffProfileLoading: true,
            };
        case authConstants.FETCH_FF_PROFILE_SUCCESS:
            return {
                ...state,
                ffProfile: action.payload,
                ffProfileLoading: false,
            };
        case authConstants.FETCH_FF_PROFILE_FAILURE:
            return {
                ...state,
                ffProfileLoading: false,
                ffProfileError: action.payload,
            };
        case authConstants.REGISTER_FF_REQUEST:
            return {
                ...state,
                registerLoading: true,
                registerError: false,
                registered: null,
            };
        case authConstants.REGISTER_FF_SUCCESS:
            return {
                ...state,
                registered: action.payload,
                registerLoading: false,
            };
        case authConstants.REGISTER_FF_FAILURE:
            return {
                ...state,
                registerLoading: false,
                registerError: action.payload,
            };
        case authConstants.VERIFY_BY_EMAIL_REQUEST:
            return {
                ...state,
                verifyByMailLoading: true,
                verifyByMailError: false,
                verifyByMailSuccess: null,
            };
        case authConstants.VERIFY_BY_EMAIL_SUCCESS:
            return {
                ...state,
                verifyByMailSuccess: action.payload,
                verifyByMailLoading: false,
            };
        case authConstants.VERIFY_BY_EMAIL_FAILURE:
            return {
                ...state,
                verifyByMailLoading: false,
                verifyByMailError: action.payload,
            };
        case authConstants.RESEND_VERIFY_CODE_REQUEST:
            return {
                ...state,
                resendVerifyCodeLoading: true,
                resendVerifyCodeError: false,
                resendVerifyCodeSuccess: null,
            };
        case authConstants.RESEND_VERIFY_CODE_SUCCESS:
            return {
                ...state,
                resendVerifyCodeSuccess: action.payload,
                resendVerifyCodeLoading: false,
            };
        case authConstants.RESEND_VERIFY_CODE_FAILURE:
            return {
                ...state,
                resendVerifyCodeLoading: false,
                resendVerifyCodeError: action.payload,
            };
        case authConstants.LOGIN_REQUEST:
            return {
                ...state,
                loginLoading: true,
                loginError: false,
                user: null,
            };
        case authConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loginLoading: false,
            };
        case authConstants.LOGIN_FAILURE:
            return {
                ...state,
                loginLoading: false,
                loginError: action.payload,
            };
        case authConstants.LOG_OUT:
            return {
                ...state,
                user: null,
            };
        case authConstants.FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                forgotPasswordLoading: true,
                forgotPasswordError: false,
                forgotPasswordSuccess: false,
            };
        case authConstants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPasswordSuccess: action.payload,
                forgotPasswordLoading: false,
            };
        case authConstants.FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                forgotPasswordLoading: false,
                forgotPasswordError: action.payload,
            };
        case authConstants.RESET_PASSWORD_REQUEST:
            return {
                ...state,
                resetPasswordLoading: true,
                resetPasswordError: false,
                resetPasswordSuccess: null,
            };
        case authConstants.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPasswordSuccess: action.payload,
                resetPasswordLoading: false,
            };
        case authConstants.RESET_PASSWORD_FAILURE:
            return {
                ...state,
                resetPasswordLoading: false,
                resetPasswordError: action.payload,
            };
        case authConstants.RESET_PASSWORD_LOGGED_USER_REQUEST:
            return {
                ...state,
                resetPasswordLoggedInLoading: true,
                resetPasswordLoggedInError: false,
                resetPasswordLoggedInSuccess: null,
            };
        case authConstants.RESET_PASSWORD_LOGGED_USER_SUCCESS:
            return {
                ...state,
                resetPasswordLoggedInSuccess: action.payload,
                resetPasswordLoggedInLoading: false,
            };
        case authConstants.RESET_PASSWORD_LOGGED_USER_FAILURE:
            return {
                ...state,
                resetPasswordLoggedInLoading: false,
                resetPasswordLoggedInError: action.payload,
            };
        case authConstants.FETCH_TEAM_MEMBERS_REQUEST:
            return {
                ...state,
                teamMembersLoading: true,
                teamMembersError: false,
            };
        case authConstants.FETCH_TEAM_MEMBERS_SUCCESS:
            return {
                ...state,
                teamMembers: action.payload,
                teamMembersLoading: false,
            };
        case authConstants.FETCH_TEAM_MEMBERS_FAILURE:
            return {
                ...state,
                teamMembersLoading: false,
                teamMembersError: action.payload,
            };
        case authConstants.DELETE_ACCOUNT_REQUEST:
            return {
                ...state,
                deleteAccountLoading: true,
                deleteAccountError: false,
            };
        case authConstants.DELETE_ACCOUNT_SUCCESS:
            return {
                ...state,
                deleteAccountLoading: false,
                deleteAccountSuccess: action.payload,
            };
        case authConstants.DELETE_ACCOUNT_FAILURE:
            return {
                ...state,
                deleteAccountLoading: false,
                deleteAccountError: action.payload,
            };
        case authConstants.ADD_MEMBER_REQUEST:
            return {
                ...state,
                addMemberLoading: true,
                addMemberError: false,
            };
        case authConstants.ADD_MEMBER_SUCCESS:
            return {
                ...state,
                addMemberLoading: false,
                addMemberSuccess: action.payload,
            };
        case authConstants.ADD_MEMBER_FAILURE:
            return {
                ...state,
                addMemberLoading: false,
                addMemberError: action.payload,
            };
        case authConstants.REMOVE_MEMBER_REQUEST:
            return {
                ...state,
                removeMemberLoading: true,
                removeMemberError: "",
            };
        case authConstants.REMOVE_MEMBER_SUCCESS:
            return {
                ...state,
                removeMemberLoading: false,
                removeMemberSuccess: action.payload,
            };
        case authConstants.REMOVE_MEMBER_FAILURE:
            return {
                ...state,
                removeMemberLoading: false,
                removeMemberError: action.payload,
            };
        default:
            return state;
    }
}
