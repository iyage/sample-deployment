/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import onboardBG from "assets/images/onboardBG.jpg";
import { authActions } from "actions";
import { useNavigate, useSearchParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { toast } from "react-hot-toast";
import CustomToast from "components/common/CustomToast";
import { saveToStorage } from "helpers";

const OnboardGFF = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [passwordValue, setPasswordValue] = useState("");
    const [password2Value, setPassword2Value] = useState("");
    const {
        resetPasswordLoggedInLoading,
        resetPasswordLoggedInSuccess,
        loginLoading,
        user,
        ffProfile,
        ffProfileLoading,
    } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token");
    const shipmentId = searchParams.get("shipmentId");
    const quoteRequestId = searchParams.get("quoteRequestId");

    const loadFFProfile = () => {
        try {
            const gFF = jwtDecode(token);
            if (gFF?._id) {
                return gFF;
            }
        } catch (err) {
            return null;
        }
    };

    const updateUserStore = (data) => {
        saveToStorage("tradeAlly-user", { ...data, shipmentId, quoteRequestId });
    };

    const onboardGlobalFF = (evt) => {
        evt.preventDefault();
        dispatch(authActions.updateToken({ ...loadFFProfile(), token }));
        dispatch(authActions.resetPasswordLoggedUser(passwordValue, false));
    };

    useEffect(() => {
        if (!token || !shipmentId || !quoteRequestId) {
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    message={"Invalid Link URL, Please check your email for the valid link!"}
                    type="error"
                />
            ));
            navigate("/");
        }
    }, [token]);

    useEffect(() => {
        dispatch(authActions.fetchFreightForwarderProfile(loadFFProfile()?._id));
    }, [token]);

    useEffect(() => {
        if (!ffProfileLoading && ffProfile?.result?.active) {
            dispatch(authActions.forceLogin({ ...ffProfile, token, shipmentId, quoteRequestId }));
            updateUserStore({ ...ffProfile, token });
            navigate("/quote-request");
        }
    }, [ffProfile, ffProfileLoading]);

    useEffect(() => {
        if (resetPasswordLoggedInSuccess) {
            dispatch(
                authActions.loginUser(
                    { email: ffProfile?.result?.email, password: passwordValue },
                    false
                )
            );
        }
    }, [resetPasswordLoggedInSuccess]);

    const requestLoading = resetPasswordLoggedInLoading || loginLoading;
    const showResetPage = !ffProfile?.result?.active;

    useEffect(() => {
        if (user) {
            if (resetPasswordLoggedInSuccess) {
                toast.custom((t) => <CustomToast t={t} message={"Password reset successful!"} />);
                dispatch(authActions.forceLogin({ ...user, shipmentId, quoteRequestId }));
                updateUserStore(user);
            }
            navigate("/quote-request");
            dispatch(authActions.defaultResetState());
        }
    }, [user, resetPasswordLoggedInSuccess]);

    if (ffProfileLoading || !ffProfile) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <>
            {showResetPage && (
                <>
                    <NavOne />
                    <div className="flex h-[calc(100vh-65px)]">
                        {/* INTRO */}
                        <div
                            className="basis-1/2 grid place-items-center max-900:hidden"
                            style={{
                                background: `linear-gradient(0deg, #142837 0%, rgba(20, 40, 55, 0.746486) 33.38%, rgba(20, 40, 55, 0) 100%), url(${onboardBG}) no-repeat center`,
                            }}
                        >
                            <div className="w-[430px] mt-auto mb-[70px]">
                                <h2 className="font-rocGroteskBold text-[52px] text-white leading-[53px]">
                                    Welcome to Fleet+
                                </h2>
                                <p className="font-rocGroteskMedium mt-4 mb-3 text-white leading-[22px]">
                                    Fleet+ makes it simple for freight forwarders to utilize freight
                                    management tools and connect with global freight partners to
                                    scale their business operations.
                                </p>

                                <div className="flex items-center mb-[9px]">
                                    <span className="material-icons text-pacific-cyan text-lg">
                                        star
                                    </span>
                                    <span className="material-icons text-pacific-cyan text-lg ml-[2px]">
                                        star
                                    </span>
                                    <span className="material-icons text-pacific-cyan text-lg ml-[2px]">
                                        star
                                    </span>
                                    <span className="material-icons text-pacific-cyan text-lg ml-[2px]">
                                        star
                                    </span>
                                    <span className="material-icons text-pacific-cyan text-lg ml-[2px]">
                                        star
                                    </span>
                                </div>

                                <div className="h-[5px] bg-pacific-cyan w-[85%]"></div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="basis-full 900:basis-1/2 grid place-items-center max-475:px-5">
                            <form className="w-full 475:w-[400px] mb-32" onSubmit={onboardGlobalFF}>
                                <p className="text-mvx-black font-rocGroteskBold text-xl mb-7">
                                    Change password
                                    <span className="font-rocGroteskMedium block mt-3 mb-4 text-sm">
                                        Please enter a new password for your Fleet+ account to get
                                        access to your personalized dashboard.
                                    </span>
                                </p>

                                <p className="text-sm mt-3 mb-2 relative text-mvx-black font-rocGroteskMedium after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-[3px]">
                                    Enter new password
                                </p>

                                <div className="flex justify-between items-center border border-gray-200">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                        placeholder="Password (min. of 8 characters)"
                                        minLength={8}
                                        required
                                        onInput={(evt) => setPasswordValue(evt.target.value)}
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                        title="Password must contains at least one lowercase letter, one uppercase letter, and one special character."
                                    />
                                    <span
                                        className="underline text-[13px] font-rocGroteskMedium cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </span>
                                </div>

                                <p className="text-sm mt-5 mb-2 relative text-mvx-black font-rocGroteskMedium after:content-['*'] after:top-[2px] after:absolute after:text-[13px] after:ml-[3px]">
                                    Re-enter new password
                                </p>

                                <div className="flex justify-between items-center border border-gray-200">
                                    <input
                                        type={showPassword2 ? "text" : "password"}
                                        className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                        placeholder="Password (min. of 8 characters)"
                                        minLength={8}
                                        required
                                        onInput={(evt) => setPassword2Value(evt.target.value)}
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$"
                                        title="Password must contains at least one lowercase letter, one uppercase letter, and one special character."
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
                                        password2Value !== passwordValue ? "visible" : "invisible"
                                    }`}
                                >
                                    Passwords do not match!
                                </p>
                                <button
                                    className="bg-pacific-cyan text-mvx-black w-full py-4 mt-8 text-sm font-rocGroteskMedium disabled:bg-pacific-cyan/80"
                                    disabled={requestLoading}
                                    type="submit"
                                >
                                    {requestLoading ? <Loader color="white" /> : "Change Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default OnboardGFF;
