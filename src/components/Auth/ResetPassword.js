import { authActions } from "actions";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import OTPDataInput from "components/common/OTPDataInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ResetPassword = () => {
    const [step, setStep] = useState(0);
    const [OTP, setOTP] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [passwordValue, setPasswordValue] = useState("");
    const [password2Value, setPassword2Value] = useState("");
    const { forgotPasswordLoading, forgotPasswordSuccess, resetPasswordLoading } = useSelector(
        (state) => state.auth
    );
    const dispatch = useDispatch();

    const forgetPassword = () => {
        dispatch(authActions.forgotPassword({ email: document.getElementById("email").value }));
    };

    const verifyOTP = () => {
        if (OTP.length === 6) {
            setStep(2);
        }
    };

    const resetPassword = () => {
        dispatch(authActions.resetPassword({ code: OTP, password: passwordValue }));
    };

    const handleRequest = (evt) => {
        evt.preventDefault();

        switch (step) {
            case 0:
                forgetPassword();
                break;
            case 1:
                verifyOTP();
                break;

            default:
                resetPassword();
                break;
        }
    };

    useEffect(() => {
        forgotPasswordSuccess && step === 0 && setStep(1);
    }, [forgotPasswordSuccess, step]);

    return (
        <>
            <NavOne />
            <div className="h-[calc(100vh-80px)] mt-20 flex justify-center 475:items-center max-475:px-6">
                <form
                    className="lg:shadow-md rounded-md 475:w-[460px] pt-9 pb-12 475:p-12"
                    onSubmit={handleRequest}
                >
                    <p className="text-gun-metal font-rocGroteskBold text-lg mb-7">
                        {step
                            ? step === 1
                                ? "Create new password"
                                : "Create new password"
                            : "Reset password?"}
                        <span className="text-sm font-rocGroteskMedium block mt-[10px] text-[#6B778C]">
                            {step
                                ? step === 1
                                    ? "We have sent an email containing an OTP to your email. check your inbox or spam folder"
                                    : "Set a new secure password that you can remember"
                                : `Don't worry – enter your email below and we'll send you instructions for
                            getting a new password.`}
                        </span>
                    </p>

                    {step ? (
                        <>
                            {step === 1 ? (
                                <OTPDataInput otp={OTP} setOTP={setOTP} />
                            ) : (
                                <>
                                    <p className="text-sm mt-3 mb-2 relative text-mvx-black font-rocGroteskMedium after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-1 after:text-mvx-black">
                                        Enter new password
                                    </p>

                                    <div className="flex justify-between rounded overflow-hidden items-center border border-gray-200">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                            placeholder="Password (min. of 8 characters)"
                                            minLength={8}
                                            required
                                            onInput={(evt) => setPasswordValue(evt.target.value)}
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                            title="Password must contain at least one lowercase letter, one uppercase letter, and one special character."
                                        />
                                        <span
                                            className="underline text-[13px] font-rocGroteskMedium cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </span>
                                    </div>

                                    <p className="text-sm mt-3 mb-2 relative text-mvx-black font-rocGroteskMedium after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-1 after:text-mvx-black">
                                        Re-enter new password
                                    </p>

                                    <div className="flex justify-between rounded overflow-hidden items-center border border-gray-200">
                                        <input
                                            type={showPassword2 ? "text" : "password"}
                                            className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                            placeholder="Password (min. of 8 characters)"
                                            minLength={8}
                                            required
                                            onInput={(evt) => setPassword2Value(evt.target.value)}
                                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                            title="Password must contain at least one lowercase letter, one uppercase letter, and one special character."
                                        />
                                        <span
                                            className="underline text-[13px] font-rocGroteskMedium cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                            onClick={() => setShowPassword2(!showPassword2)}
                                        >
                                            {showPassword2 ? "Hide" : "Show"}
                                        </span>
                                    </div>

                                    <p
                                        className={`text-red-600 text-[13px] font-rocGroteskMedium text-left translate-y-2 ${
                                            password2Value !== passwordValue &&
                                            password2Value &&
                                            passwordValue
                                                ? "visible"
                                                : "invisible"
                                        }`}
                                    >
                                        Passwords do not match!
                                    </p>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-[13px] mt-3 mb-2 text-mvx-black font-rocGroteskMedium">
                                Email Address
                            </p>
                            <input
                                type="email"
                                className="border rounded border-gray-200 p-3 outline-0 w-full h-[50px] font-rocGroteskMedium text-sm placeholder:font-rocGroteskMedium"
                                placeholder="Enter your email address"
                                id="email"
                                required
                            />
                        </>
                    )}

                    {step ? (
                        <button
                            className="bg-pacific-cyan rounded text-white font-rocGroteskMedium w-full py-4 mt-10 text-sm disabled:bg-pacific-cyan/80"
                            disabled={resetPasswordLoading}
                            type={"submit"}
                        >
                            {" "}
                            {resetPasswordLoading ? <Loader /> : "Reset password"}
                        </button>
                    ) : (
                        <button
                            className="bg-pacific-cyan rounded text-white font-rocGroteskMedium w-full py-4 mt-10 text-sm disabled:bg-pacific-cyan/80"
                            disabled={forgotPasswordLoading}
                            type={"submit"}
                        >
                            {forgotPasswordLoading ? <Loader /> : "Send reset link"}
                        </button>
                    )}

                    {!step && (
                        <Link
                            to={"/login"}
                            className="text-mvx-neutral font-rocGroteskMedium text-sm mt-5 block text-center w-max mx-auto"
                        >
                            Return to Log in
                        </Link>
                    )}
                    {step === 2 && (
                        <span
                            className={`text-mvx-neutral font-rocGroteskMedium text-sm mt-5 block text-center cursor-pointer ${
                                resetPasswordLoading && "pointer-events-none"
                            }`}
                            onClick={() => setStep(1)}
                        >
                            Return to code page
                        </span>
                    )}
                </form>
            </div>
        </>
    );
};

export default ResetPassword;
