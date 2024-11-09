/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { authActions } from "actions";
import Loader from "components/common/Loader";
import ModalContainer from "components/common/ModalContainer";
import OTPDataInput from "components/common/OTPDataInput";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoginAndSecurity = ({ userEmail, setActiveMobileSection }) => {
    const [initialScreen, setInitialScreen] = useState(true);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [email, setEmail] = useState(() => userEmail ?? "");
    const [OTP, setOTP] = useState("");
    const [deleteAccountModal, setDeleteAccountModal] = useState({
        open: false,
        stepOne: false,
        stepTwo: false,
        stepThree: false,
    });
    const {
        resetPasswordLoggedInLoading,
        resetPasswordLoggedInSuccess,
        verifyByMailLoading,
        verifyByMailSuccess,
        resendVerifyCodeSuccess,
        resendVerifyCodeLoading,
        deleteAccountLoading,
    } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const updatePasswordFunc = (evt) => {
        evt.preventDefault();
        const password = document.getElementById("new-pass").value;
        dispatch(authActions.resetPasswordLoggedUser(password));
    };

    const deletePasswordFunc = () => {
        dispatch(authActions.deleteAccount());
    };

    useEffect(() => {
        if (resetPasswordLoggedInSuccess) {
            setInitialScreen(true);
            setUpdatePassword(false);
            setShowPassword(false);
            setShowPassword2(false);
            dispatch(authActions.defaultResetState());
        }
    }, [resetPasswordLoggedInSuccess]);

    // useEffect(() => {
    //     resendVerifyCodeSuccess &&
    //         setDeleteAccountModal({
    //             open: true,
    //             stepOne: false,
    //             stepTwo: true,
    //             stepThree: false,
    //         });

    //     verifyByMailSuccess &&
    //         setDeleteAccountModal({
    //             open: true,
    //             stepOne: false,
    //             stepTwo: false,
    //             stepThree: true,
    //         });
    // }, [resendVerifyCodeSuccess, verifyByMailSuccess]);

    return (
        <>
            <div className="max-sm:px-5 520:w-[55%] pb-12">
                {initialScreen && (
                    <div>
                        <div className="mb-8">
                            <p className="text-[20px] font-rocGroteskBold mb-1 max-sm:flex">
                                <span
                                    onClick={() => setActiveMobileSection(false)}
                                    className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                                >
                                    arrow_back
                                </span>
                                Login & Security
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gun-metal font-rocGroteskBold mb-2">
                                Change your password
                            </p>
                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-4">
                                The password must be a minimum of 7 characters long containing at
                                least one number and have a mixture of uppercase and lowercase
                                letters
                            </p>
                            <button
                                className="flex items-center justify-center border bg-white text-gun-metal font-rocGroteskMedium w-fit py-2 px-4 text-sm rounded"
                                type={"button"}
                                onClick={() => {
                                    setInitialScreen(false);
                                    setUpdatePassword(true);
                                }}
                            >
                                Update password
                            </button>
                        </div>
                        <hr className="my-6" />
                        <div>
                            <p className="text-sm text-gun-metal font-rocGroteskBold mb-2">
                                Delete your account
                            </p>
                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-4">
                                By deleting your account on Fleet+, kindly note that you will be
                                losing all the information about your shipments, quotes, earnings,
                                and team members.
                            </p>
                            <button
                                className="flex items-center gap-[10px] justify-center border bg-white text-gun-metal font-rocGroteskMedium w-fit py-2 px-4 text-sm rounded"
                                type={"button"}
                                onClick={() =>
                                    setDeleteAccountModal({
                                        open: true,
                                        stepOne: true,
                                        stepTwo: false,
                                        stepThree: false,
                                    })
                                }
                            >
                                <i className="ri-delete-bin-fill mt-[-3px]"></i>
                                <span>Delete account</span>
                            </button>
                        </div>
                    </div>
                )}
                {updatePassword && (
                    <div
                        className={`sm:w-[87%] ${
                            resetPasswordLoggedInLoading && "pointer-events-none"
                        }`}
                    >
                        <p
                            onClick={() => {
                                setInitialScreen(true);
                                setUpdatePassword(false);
                            }}
                            className="flex items-center w-fit gap-1 mb-3 cursor-pointer max-sm:hidden"
                        >
                            <span className="material-icons-outlined text-lg font-semibold ">
                                arrow_back
                            </span>
                            <span className="text-sm font-rocGroteskMedium underline">Go back</span>
                        </p>

                        <div className="mb-8">
                            <p className="text-[20px] text-gun-metal font-rocGroteskBold mb-3 max-sm:flex">
                                <span
                                    onClick={() => {
                                        setInitialScreen(true);
                                        setUpdatePassword(false);
                                    }}
                                    className="material-icons-outlined max-sm:block hidden text-lg font-semibold mr-2 sm:hidden"
                                >
                                    arrow_back
                                </span>
                                Change your password
                            </p>
                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium">
                                The password must be a minimum of 7 characters long containing at
                                least 1 number and have a mixture of uppercase and lowercase letters
                            </p>
                        </div>
                        <form onSubmit={updatePasswordFunc}>
                            <div className="mb-6">
                                <p className="text-sm mb-1 font-rocGroteskMedium">Old password</p>
                                <div className="flex justify-between items-center border border-gray-200 rounded">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="old-pass"
                                        className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium rounded"
                                        placeholder="Password (min. of 8 characters)"
                                        required
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                        title="Password must contain at least one lowercase letter, one uppercase letter, and one special character."
                                    />
                                    <span
                                        className="underline text-[13px] font-rocGroteskMedium cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? "hide" : "show"}
                                    </span>
                                </div>
                            </div>
                            <div className="mb-8">
                                <p className="text-sm mb-1 font-rocGroteskMedium">New password</p>
                                <div className="flex justify-between items-center border border-gray-200 rounded">
                                    <input
                                        id="new-pass"
                                        type={showPassword2 ? "text" : "password"}
                                        className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium rounded"
                                        placeholder="Password (min. of 8 characters)"
                                        required
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                        title="Password must contain at least one lowercase letter, one uppercase letter, and one special character."
                                    />
                                    <span
                                        className="underline text-[13px] font-rocGroteskMedium cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                        onClick={() => setShowPassword2((prev) => !prev)}
                                    >
                                        {showPassword2 ? "hide" : "show"}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="flex items-center justify-center bg-pacific-cyan 520:bg-pacific-cyan text-white font-rocGroteskMedium max-520:fixed left-[3vh] 350:left-[3.5vh] 375:left-[4vh] 475:left-[4.7vh] bottom-[3vh] w-[90vw] 520:w-fit py-2 px-4 text-sm rounded disabled:bg-gun-metal/80"
                                disabled={resetPasswordLoggedInLoading}
                            >
                                {resetPasswordLoggedInLoading ? (
                                    <Loader color={"white"} className={"mx-[50px]"} />
                                ) : (
                                    "Update password"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
            {deleteAccountModal.open && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[451px] max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setDeleteAccountModal({
                            open: false,
                            stepOne: false,
                            stepTwo: false,
                            stepThree: false,
                        });
                    }}
                >
                    {deleteAccountModal.stepOne && (
                        <form
                            className={`bg-white rounded-lg shadow-modalShadow ${
                                resendVerifyCodeLoading && "pointer-events-none"
                            }`}
                            onSubmit={(evt) => {
                                evt.preventDefault();
                                setDeleteAccountModal({
                                    open: true,
                                    stepOne: false,
                                    stepTwo: false,
                                    stepThree: true,
                                });
                            }}
                        >
                            <div className="px-8 pt-7 mb-7">
                                <p className="text-[20px] mb-2 font-rocGroteskBold text-gun-metal">
                                    Delete Account
                                </p>
                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                    Are you sure you want to delete your Fleet+ account? By deleting
                                    your account on Fleet+, kindly note that you will be losing all
                                    the information about your shipments, quotes, earnings, and team
                                    members.
                                </p>
                            </div>
                            <div className="px-6">
                                <div className="">
                                    <p className="text-sm mb-1 font-rocGroteskMedium">
                                        Email address
                                    </p>
                                    <input
                                        required
                                        value={email}
                                        type="email"
                                        placeholder="Enter email address"
                                        className="border border-gray-200 py-3 px-4 mb-2 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                        id="deleteEmail"
                                        onChange={({ target: { value } }) => setEmail(value)}
                                    />
                                    <p className="underline text-xs text-gun-metal font-rocGroteskMedium cursor-pointer">
                                        What happens after I delete my account
                                    </p>
                                </div>
                            </div>
                            <div className="flex mt-8 border-t">
                                <button
                                    type="button"
                                    className={`uppercase w-full rounded-none text-mvx-neutral text-xs 375:text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border-r px-3`}
                                    onClick={() => {
                                        setDeleteAccountModal({
                                            open: false,
                                            stepOne: false,
                                            stepTwo: false,
                                            stepThree: false,
                                        });
                                    }}
                                >
                                    NO, Cancel
                                </button>
                                <button
                                    className={`uppercase w-full rounded-none text-gun-metal text-xs 375:text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 px-3`}
                                >
                                    {resendVerifyCodeLoading ? <Loader /> : " DELETE MY ACCOUNT"}
                                </button>
                            </div>
                        </form>
                    )}
                    {deleteAccountModal.stepTwo && (
                        <div
                            className={`bg-white rounded-lg shadow-modalShadow ${
                                verifyByMailLoading && "pointer-events-none"
                            }`}
                        >
                            <div className="px-8 pt-7 mb-7">
                                <p className="mb-3">
                                    <span
                                        onClick={() => {
                                            dispatch(authActions.resetVerifyCode());
                                            setDeleteAccountModal({
                                                open: true,
                                                stepOne: true,
                                                stepTwo: false,
                                                stepThree: false,
                                            });
                                        }}
                                        className="material-icons-outlined text-lg font-semibold cursor-pointer"
                                    >
                                        arrow_back
                                    </span>
                                </p>
                                <p className="text-[20px] mb-2 font-rocGroteskBold text-gun-metal">
                                    Enter OTP
                                </p>
                                <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                    Please enter the OTP that was sent to your email. This is to
                                    verify that you want to delete your account
                                </p>
                            </div>
                            <div className="px-6">
                                <div className="">
                                    <div className="">
                                        <OTPDataInput otp={OTP} setOTP={setOTP} />
                                    </div>

                                    {/* <p className="text-xs text-gun-metal text-center font-rocGroteskRegular">
                                        <span>Resend code in</span>{" "}
                                        <span className="font-rocGroteskMedium">2:00</span>
                                    </p> */}
                                </div>
                            </div>
                            <div className="flex mt-8 border-t">
                                <button
                                    type="button"
                                    className={`uppercase rounded-none w-full text-mvx-neutral text-xs 375:text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border-r px-3`}
                                    onClick={() => {
                                        dispatch(authActions.resetVerifyCode());
                                        setDeleteAccountModal({
                                            open: false,
                                            stepOne: false,
                                            stepTwo: false,
                                            stepThree: false,
                                        });
                                    }}
                                >
                                    NO, Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        OTP?.length === 6 &&
                                            dispatch(authActions.verifyByMail(OTP));
                                    }}
                                    className={`uppercase rounded-none w-full text-gun-metal text-xs 375:text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 px-3`}
                                >
                                    {verifyByMailLoading ? <Loader /> : "Verify"}
                                </button>
                            </div>
                        </div>
                    )}
                    {deleteAccountModal.stepThree && (
                        <div
                            className={`bg-white rounded-lg shadow-modalShadow ${
                                deleteAccountLoading && "pointer-events-none"
                            }`}
                        >
                            <div className="px-8 pt-7 mb-7">
                                <div className="flex justify-center item-center mb-6">
                                    <div className="flex justify-center items-center w-16 h-16 bg-mvx-light-blue rounded-full">
                                        <i className="ri-emotion-sad-fill text-4xl before:text-mvx-neutral before:content-['\ec93']"></i>
                                    </div>
                                </div>
                                <p className="text-[20px] text-center mb-2 font-rocGroteskBold text-gun-metal">
                                    Delete my account
                                </p>
                                <p className="text-sm text-center font-rocGroteskMedium px-6 text-mvx-neutral">
                                    Sad to see you go. But we understand why you've decided to
                                    leave.
                                </p>
                            </div>

                            <div className="flex mt-8 border-t">
                                <button
                                    type="button"
                                    className={`uppercase w-full text-mvx-neutral !rounded-none text-xs 375:text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border-r px-3`}
                                    onClick={() => {
                                        setDeleteAccountModal({
                                            open: false,
                                            stepOne: false,
                                            stepTwo: false,
                                            stepThree: false,
                                        });
                                    }}
                                >
                                    NO, Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={deletePasswordFunc}
                                    className={`uppercase w-full text-gun-metal !rounded-none text-xs 375:text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 px-3`}
                                >
                                    {deleteAccountLoading ? <Loader /> : " Delete account"}
                                </button>
                            </div>
                        </div>
                    )}
                </ModalContainer>
            )}
        </>
    );
};

export default LoginAndSecurity;
