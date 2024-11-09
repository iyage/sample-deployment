/* eslint-disable react-hooks/exhaustive-deps */
import { authActions } from "actions";
import Loader from "components/common/Loader";
import OTPDataInput from "components/common/OTPDataInput";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const VerifyUser = ({ step, setStep }) => {
    const [OTP, setOTP] = useState("");
    const [verifyByMail, setVerifyByMail] = useState(true);
    const dispatch = useDispatch();
    const defaultCountdown = {
        minutes: 2,
        seconds: 0,
    };
    const [timeLeft, setTimeLeft] = useState(defaultCountdown);
    const {
        verifyByMailLoading,
        verifyByMailSuccess,
        resendVerifyCodeSuccess,
        resendVerifyCodeLoading,
    } = useSelector((state) => state.auth);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const minutes = timeLeft.minutes;
            const seconds = timeLeft.seconds;
            if (seconds !== 0) {
                setTimeLeft({ minutes, seconds: seconds - 1 });
            } else if (minutes !== 0) {
                setTimeLeft({ minutes: minutes - 1, seconds: 59 });
            } else {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const resendOTP = () => {
        dispatch(authActions.resendVerifyCode());
    };

    const verifyCodeByMail = () => {
        dispatch(authActions.verifyByMail(OTP));
    };

    useEffect(() => {
        verifyByMailSuccess && setStep(2);
    }, [verifyByMailSuccess]);

    useEffect(() => {
        resendVerifyCodeSuccess && setTimeLeft(defaultCountdown);
    }, [resendVerifyCodeSuccess]);

    const countdownElapsed = timeLeft.minutes <= 0 && timeLeft.seconds <= 0;
    const verifyProcessLoading = verifyByMailLoading || resendVerifyCodeLoading;

    return (
        <>
            {/* VERIFY BY MAIL */}
            {verifyByMail ? (
                <>
                    {step === 1 ? (
                        <div className="h-[calc(100vh-65px)] flex justify-center sm:items-center">
                            <div className="lg:shadow-md rounded-md w-[500px] pt-8 p-12">
                                <p className="text-mvx-black font-rocGroteskBold text-lg mb-7">
                                    Check your email
                                    <span className="text-xs font-rocGroteskMedium block text-mvx-black mt-1">
                                        We have sent an email containing an OTP to your email. check
                                        your inbox or spam folder
                                    </span>
                                </p>

                                <OTPDataInput
                                    otp={OTP}
                                    setOTP={setOTP}
                                    className={"w-full justify-center mb-3 text-sm"}
                                />

                                <p className="text-xs text-center text-mvx-blue font-rocGroteskMedium mt-8 -mb-2">
                                    Code expires in {timeLeft.minutes}:
                                    {timeLeft.seconds < 10 && "0"}
                                    {timeLeft.seconds}{" "}
                                    <span
                                        className={`cursor-pointer font-rocGroteskMedium ${
                                            countdownElapsed
                                                ? "underline"
                                                : "text-mvx-gray pointer-events-none"
                                        }`}
                                        onClick={resendOTP}
                                    >
                                        Resend OTP{" "}
                                        {resendVerifyCodeLoading && (
                                            <Loader size={3} className={"mx-0 ml-1 inline-block"} />
                                        )}
                                    </span>
                                </p>

                                <button
                                    className={`disabled:text-[#6B778C] text-white rounded font-rocGroteskMedium text-sm w-full py-4 mt-8 bg-gun-metal disabled:bg-mvx-light-blue ${
                                        OTP.length !== 6 || verifyByMailLoading
                                            ? "pointer-events-none"
                                            : ""
                                    }`}
                                    disabled={OTP.length !== 6 || verifyByMailLoading}
                                    onClick={verifyCodeByMail}
                                >
                                    {verifyByMailLoading ? (
                                        <Loader className={"my-[2px]"} />
                                    ) : (
                                        "Continue"
                                    )}
                                </button>

                                <a
                                    className={`block py-4 mt-5 font-rocGroteskMedium rounded text-sm text-center text-mvx-black border ${
                                        verifyProcessLoading && "pointer-events-none"
                                    }`}
                                    href="mailto:abc@abc.com"
                                >
                                    Open Email
                                </a>

                                <p
                                    className={`hidden text-xs text-center w-max mt-6 font-rocGroteskMedium mx-auto text-[#6B778C] cursor-pointer underline ${
                                        verifyProcessLoading && "pointer-events-none"
                                    }`}
                                    onClick={() => setVerifyByMail(false)}
                                >
                                    Verify using phone number
                                </p>

                                <span
                                    className="cursor-pointer flex items-center justify-center text-xs text-center font-rocGroteskMedium mt-5 text-mvx-black group"
                                    onClick={() => {
                                        setStep((prev) => prev - 1);
                                    }}
                                >
                                    <span className="material-icons-outlined text-sm font-semibold mr-1 group-hover:-translate-x-1 transition-transform">
                                        arrow_back
                                    </span>
                                    <span className="group-hover:underline">Go back</span>
                                </span>
                            </div>
                        </div>
                    ) : (
                        <SuccessBox />
                    )}
                </>
            ) : (
                <>
                    {/* VERIFY BY PHONE */}
                    {step !== 3 ? (
                        <div className="h-[calc(100vh-65px)] flex justify-center items-center">
                            <div className="lg:shadow-md rounded-md w-[500px] pt-12 p-12">
                                {step === 1 ? (
                                    <p className="text-mvx-black font-bold text-lg mb-7">
                                        Verify phone number
                                        <span className="text-xs font-light block text-mvx-black mt-1">
                                            We will send an SMS with the 6 digit code to your phone
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-mvx-black font-bold text-lg mb-7 w-[90%]">
                                        Verify phone number
                                        <span className="text-xs font-medium block text-mvx-blue mt-1">
                                            We have sent a SMS with the 6 digit code to your phone
                                            number +234-09054467523
                                        </span>
                                    </p>
                                )}

                                {step === 1 ? (
                                    <>
                                        <p className="text-xs mt-6 mb-2 relative text-[#3E3E3E] after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-1 after:text-red-500">
                                            Phone number
                                        </p>
                                        <select
                                            className="border border-gray-200 p-3 outline-0 w-full h-[50px] text-sm appearance-none"
                                            required
                                        >
                                            <option value={""}>Country/Region</option>
                                        </select>
                                        <select
                                            className="border border-t-0 border-gray-200 p-3 outline-0 w-full h-[50px] text-sm appearance-none"
                                            required
                                        >
                                            <option value={""}>+234</option>
                                        </select>
                                    </>
                                ) : (
                                    <OTPDataInput
                                        otp={OTP}
                                        setOTP={setOTP}
                                        className={"w-full justify-center mt-8 -mb-5 text-sm"}
                                    />
                                )}

                                <button className="text-[#6B778C] font-medium w-full py-4 mt-9 mb-3 bg-[#F4F5F7]">
                                    Continue
                                </button>

                                {step === 2 && (
                                    <p className="text-xs text-center mt-7 mb-1 text-mvx-blue">
                                        Code expires in 2:00{" "}
                                        <span className="cursor-pointer underline font-medium">
                                            Resend OTP
                                        </span>
                                    </p>
                                )}

                                {step === 1 && (
                                    <p
                                        className="text-xs text-center mt-6 text-[#6B778C] cursor-pointer underline w-max mx-auto"
                                        onClick={() => setVerifyByMail(true)}
                                    >
                                        Verify using email address
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <SuccessBox />
                    )}
                </>
            )}
        </>
    );
};

const SuccessBox = () => {
    const [screenSize, setScreenSize] = useState();

    const handleResize = () => {
        setScreenSize(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="h-[calc(100vh-65px)] flex justify-center items-center">
            <div className="w-[430px] max-400:px-6 pt-7 p-12 -mt-20">
                {screenSize < 800 ? (
                    // <SuccessIconBlack className="mx-auto" />
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_80/v1687187488/Web%20App/external_pages/success_q1oaal.svg"
                        }
                        alt="success"
                        className="mx-auto"
                    />
                ) : (
                    // <SuccessIcon className="mx-auto" />
                    <img
                        src={
                            "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_80/v1687187488/Web%20App/external_pages/success_q1oaal.svg"
                        }
                        alt="success"
                        className="m-auto"
                    />
                )}
                <p className="text-mvx-black font-rocGroteskMedium text-[19px] mb-7 text-center mt-7">
                    You’re all set! Your Fleet+
                    <br /> account has been created.
                    <span className="text-sm font-rocGroteskMedium block text-[#6B778C] mt-2">
                        Congratulations, you have successfully set up your account. it’s time to
                        make it yours and ship globally.
                    </span>
                </p>
                <Link
                    to={"/onboarding"}
                    // onClick={() => removeFromStorage("Fleet+-user")}
                    className="bg-pacific-cyan text-white text-sm rounded font-rocGroteskMedium w-full py-4 mt-2 block text-center max-800:fixed max-800:bottom-[2.5vh] max-800:left-[5vw] max-800:w-[90vw]"
                >
                    Get started
                </Link>
            </div>
        </div>
    );
};

export default VerifyUser;
