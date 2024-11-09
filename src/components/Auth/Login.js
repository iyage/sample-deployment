/* eslint-disable react-hooks/exhaustive-deps */
import { authActions } from "actions";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import VerifyUser from "./VerifyUser";

const Login = () => {
    const [signWithEmail] = useState(true);
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const { loginLoading, user, ffProfile, ffProfileLoading } = useSelector((state) => state.auth);
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const isOnBoarded =
        Boolean(ffProfile?.result?.profile?.businessName) &&
        Boolean(ffProfile?.result?.profile?.businessNumber) &&
        Boolean(ffProfile?.result?.profile?.businessType) &&
        ffProfile?.result?.profile?.mode?.length > 0;

    const loginRequest = (evt) => {
        evt.preventDefault();

        const reqData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        };
        dispatch(authActions.loginUser(reqData));
    };

    useEffect(() => {
        user && dispatch(authActions.fetchFreightForwarderProfile(user._id));
    }, [user]);

    useEffect(() => {
        if (!loginLoading && !!user && !user?.active) {
            dispatch(authActions.resendVerifyCode());
            setStep(1);
        }
    }, [user, loginLoading]);

    useEffect(() => {
        if (ffProfile && !isOnBoarded) {
            navigate("/onboarding");
        }
    }, [ffProfile, isOnBoarded]);

    return (
        <>
            <NavOne />
            <div className="mt-20">
                {!step ? (
                    <div className="h-[calc(100vh-80px)] flex justify-center 400:items-center">
                        <form
                            className="lg:shadow-md rounded-md w-[400px] px-7 py-5 pb-12 pt-9 400:py-12 400:px-[30px]"
                            onSubmit={loginRequest}
                        >
                            <p className="text-mvx-black font-rocGroteskBold text-lg mb-7">
                                Welcome back!
                                <span className="text-sm font-rocGroteskMedium block mt-[2px] text-[#6B778C]">
                                    Great to have you. Happy Shipping!
                                </span>
                            </p>

                            {signWithEmail ? (
                                <>
                                    {" "}
                                    <p className="text-[13px] mt-5 mb-2 relative text-mvx-black font-rocGroteskMedium after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-[3px] after:text-mvx-black">
                                        Email Address
                                    </p>
                                    <input
                                        type="email"
                                        className="border w-full 350:w-[336px] border-gray-200 p-3 rounded outline-0 h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                        placeholder="Enter your email address"
                                        id="email"
                                        required
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="text-[13px] mt-5 mb-2 relative text-[#3E3E3E] after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-1 after:text-red-500">
                                        Phone number
                                    </p>
                                    <select
                                        className=" border border-gray-200 p-3 outline-0 w-full h-[50px] text-sm appearance-none"
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
                            )}
                            <p className="text-[13px] mt-5 mb-2 relative text-mvx-black font-rocGroteskMedium after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-[3px] after:text-mvx-black">
                                Password
                            </p>
                            <div className="flex justify-between rounded items-center border border-gray-200 w-full 350:w-[336px] h-[48px]">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="p-3 w-full outline-0 h-full text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                    placeholder="Password (min. of 8 characters)"
                                    minLength={8}
                                    required
                                    // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                    title="Password must contain at least one lowercase letter, one uppercase letter, and one special character."
                                />
                                <span
                                    className="underline text-[13px] font-rocGroteskMedium cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </span>
                            </div>
                            <button
                                className="bg-pacific-cyan rounded w-full 350:w-[336px] h-[48px] text-white text-sm font-rocGroteskMedium py-4 mt-8 disabled:bg-pacific-cyan/80"
                                disabled={loginLoading || ffProfileLoading}
                                type={"submit"}
                            >
                                {loginLoading || ffProfileLoading ? (
                                    <Loader color="white" className={"my-[2px]"} />
                                ) : (
                                    "Log in"
                                )}
                            </button>

                            {/* <p className="text-xs text-center font-rocGroteskMedium mt-8 mb-1 text-[#6B778C]">
                            Don't have an account? Click{" "}
                            <Link to={"/register"} className="text-mvx-black underline">
                                here
                            </Link>
                        </p> */}

                            <p className="text-xs text-center font-rocGroteskMedium mt-5 mb-1 text-[#6B778C]">
                                Don't have an account?{" "}
                                <Link to={"/register"} className="text-mvx-black underline">
                                    Register
                                </Link>
                            </p>

                            <Link
                                to={"/reset-password"}
                                className="text-xs text-center font-rocGroteskMedium mt-3 mb-1 text-[#6B778C] inline-block w-full"
                            >
                                Forget your password?{" "}
                            </Link>
                        </form>
                    </div>
                ) : (
                    <VerifyUser step={step} setStep={setStep} />
                )}
            </div>
        </>
    );
};

export default Login;
