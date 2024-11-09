import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import VerifyUser from "./VerifyUser";
import Loader from "components/common/Loader";
import NavOne from "components/common/NavOne";
import { ErrorMessage, useFormik } from "formik";
import { object, string } from "yup";
import PhoneInput from "components/common/PhoneInput";
import InputField from "components/common/InputField";
import FormWrapper from "components/common/FormWrapper";
import { useMutation } from "@tanstack/react-query";
import { authService } from "services";

const SignUp = () => {
    const [param] = useSearchParams();
    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

    const { isPending: registerLoading, mutate } = useMutation({
        mutationFn: (data) => authService.registerFF(data),
        onSuccess: (res) => {
            authService.saveAccount({
                ...res.data.user.ff,
                code: res.data.user.code,
                token: res.data.user.token,
            });
            setStep(1);
        },
    });

    const form = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            rawMobile: "",
            mobileExtension: "",
            referralCode: param.get("referralCode") ?? undefined,
        },
        enableReinitialize: true,
        validateOnBlur: true,
        validationSchema: object({
            email: string()
                .email("Please enter a valid email address")
                .required("Please enter a valid email"),
            fullName: string().required("Please enter a valid name"),
            password: string()
                .matches(passwordRegex, {
                    message:
                        "Password must contain at least one lowercase letter, one uppercase letter and one special character.",
                })
                .required("Please enter your password"),
            rawMobile: string()
                .when("mobileExtension", {
                    is: "+234",
                    then: (schema) =>
                        schema.matches(/^[789][01]\d{8}$/, "Please enter a valid phone number"),
                })
                .required("Phone number required"),
            referralCode: string().optional(),
            mobileExtension: string().required("Please select a valid mobile extension"),
        }),
        onSubmit: (values) => {
            mutate({ ...values, mobile: values.mobileExtension + values.rawMobile });
        },
    });

    return (
        <div className="w-full h-full">
            <NavOne />
            <div className="mt-20">
                {!step ? (
                    <>
                        <div className=" w-full page items-center  border-l border-l-mvx-light-blue pt-8 pb-12 px-6 400:p-8 475:p-8 800:py-8 800:px-6 900:p-8 text-mvx-black h-full">
                            <FormWrapper
                                className="lg:shadow-md px-4 475:p-12 800:pt-7 mb-10 800:pb-7 w-[38%] max-lg:w-[65%] max-sm:w-full max-sm:px-0"
                                form={form}
                            >
                                <p className="text-mvx-black text-center font-rocGroteskBold text-lg mb-7">
                                    Go global with Fleet+!
                                    <span className="text-xs font-rocGroteskMedium block mt-1 text-[13px]">
                                        Create an account and expand your business
                                    </span>
                                </p>

                                <p className="text-[13px] mb-2 relative font-rocGroteskMedium ">
                                    Full name
                                </p>
                                <InputField
                                    placeholder="Your full name"
                                    title="fullName"
                                    ctx
                                    {...form.getFieldProps("fullName")}
                                    className="!mt-0"
                                />

                                <p className="text-xs mt-5 mb-2 relative font-rocGroteskMedium ">
                                    Email Address
                                </p>
                                <InputField
                                    placeholder="Your email address"
                                    title="email"
                                    ctx
                                    {...form.getFieldProps("email")}
                                    className="!mt-0"
                                />

                                <p className="text-xs mt-5 mb-2 relative font-rocGroteskMedium ">
                                    Phone number
                                </p>
                                <PhoneInput
                                    phoneExt={form.values.mobileExtension}
                                    setPhoneExt={(ext) =>
                                        form.setFieldValue("mobileExtension", ext, true)
                                    }
                                    {...form.getFieldProps("rawMobile")}
                                    className="!mt-0"
                                    ctx
                                />

                                <p className="text-xs mt-5 mb-2 font-rocGroteskMedium relative ">
                                    Password
                                </p>

                                <div>
                                    <div className="flex justify-between rounded items-center border border-gray-200">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            className="p-3 outline-0 w-full h-[45px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                            placeholder="Password (min. of 8 characters)"
                                            minLength={8}
                                            {...form.getFieldProps("password")}
                                        />
                                        <span
                                            className="underline text-[13px] font-gilroySemibold cursor-pointer self-stretch grid place-content-center basis-[70px] pl-[2px]"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </span>
                                    </div>
                                    <ErrorMessage name="password">
                                        {(msg) => (
                                            <span className="text-red-600 text-[12px] font-rocGroteskRegular">
                                                {msg}
                                            </span>
                                        )}
                                    </ErrorMessage>
                                </div>

                                <p className="text-xs mt-5 mb-2 relative font-rocGroteskMedium">
                                    Referral Code
                                </p>
                                <input
                                    type="text"
                                    className="border border-gray-200 p-3 rounded outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                    placeholder="Referral code"
                                    id="referralCode"
                                    {...form.getFieldProps("referralCode")}
                                />

                                <p className="text-xs text-[#6B778C] font-satoshiMedium mt-4 text-center leading-normal">
                                    By signing up on Fleet+ you agree to our <br />
                                    <Link to={"#"} className="text-mvx-black underline">
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link to={"#"} className="text-mvx-black underline">
                                        Privacy Policy.
                                    </Link>
                                </p>

                                <button
                                    className="bg-pacific-cyan rounded text-white w-full py-4 mt-5 text-sm font-rocGroteskMedium disabled:bg-pacific-cyan/80"
                                    disabled={registerLoading}
                                    type="submit"
                                >
                                    {registerLoading ? (
                                        <Loader color="white" className={"my-[2px]"} />
                                    ) : (
                                        "Create an account"
                                    )}
                                </button>

                                <p className="text-xs text-center mt-5 text-[#6B778C] font-rocGroteskMedium">
                                    Already have an account?{" "}
                                    <Link to={"/login"} className="text-mvx-black underline">
                                        Log in
                                    </Link>
                                </p>
                            </FormWrapper>
                        </div>
                    </>
                ) : (
                    <VerifyUser step={step} setStep={setStep} />
                )}
            </div>
        </div>
    );
};

export default SignUp;
