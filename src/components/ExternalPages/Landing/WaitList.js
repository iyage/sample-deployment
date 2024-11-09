// import { CheckIcon } from "assets/arts";
import { useEffect, useState } from "react";
// import LandingNav from "components/ExternalPages/Landing/components/LandingNav";
// import LandingFooter from "components/ExternalPages/Landing/components/LandingFooter";
import LandingSubFooter from "components/common/LandingSubFooter";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/common/Loader";
import SelectInput from "components/common/SelectInput";
import countries from "variables/countries";
import { appActions } from "actions/appActions";
import ModalContainer from "components/common/ModalContainer";
import waitlistSuccessImg from "assets/images/externalPages/waitlist-success.svg";
import triggerTrackingPages from "helpers/triggerTrackingPages";
import ReactCountryFlag from "react-country-flag";
import LandingTempNav from "./components/LandingTempNav";
import LandingTempFooter from "./components/LandingTempFooter";

const WaitList = () => {
    const [isFF, setIsFF] = useState(true);
    const [useSoftware, setUseSoftware] = useState(true);
    const [successModal, setSuccessModal] = useState(false);
    const [phoneExt, setPhoneExt] = useState("");
    const dispatch = useDispatch();
    const { createWishlistLoading, createWishlist } = useSelector((state) => state.app);

    const sendWishlistRequest = (evt) => {
        evt.preventDefault();

        const data = {
            fullName: document.getElementById("fullName").value,
            mobile: document.getElementById("mobile").value,
            rawMobile: phoneExt + document.getElementById("mobile").value,
            email: document.getElementById("email").value,
            mobileExtension: phoneExt,
            businessName: document.getElementById("businessName").value,
            freightForwarder: isFF,
            numberOfEmployees: document.getElementById("employees").value,
            hasManagementSoftware: useSoftware,
            lastSoftwareUse: useSoftware
                ? document.getElementById("lastUsedSoftware").value
                : undefined,
        };

        dispatch(appActions.createWishlist(data));
    };

    useEffect(() => {
        if (createWishlist) {
            setSuccessModal(true);
            document.getElementById("form-section").reset();
            setPhoneExt("");
        }
    }, [createWishlist]);

    useEffect(() => {
        // 👇️ scroll to top on page load
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

        triggerTrackingPages();
    }, []);

    return (
        <>
            <LandingTempNav />

            <section
                className="pt-8 sm:pt-14 pb-[105px] px-3 400:px-4 sm:px-16 1100:px-[70px] xl:px-[176px] flex max-1100:flex-col-reverse max-1000:items-center justify-center 1100:justify-between [&_*]:text-gun-metal"
                id="wishlist-form"
            >
                <div className="max-sm:w-[90%] max-sm:mr-auto max-1100:w-full 1100:basis-[420px]">
                    <h2 className="text-4xl sm:text-[2.7rem] font-rocGroteskBold leading-[48px] sm:leading-[53px]">
                        Meet your ally for global trade, today.
                    </h2>
                    <p className="leading-[25px] font-rocGroteskMedium mt-[14px] mb-9">
                        Be first in line to use a software that’s created specifically for freight
                        forwarders and makes it simple for you to scale your business operations.
                    </p>

                    <p className="flex font-rocGroteskMedium text-[15px] mt-5">
                        {/* <CheckIcon className="mr-[13px] w-6 h-6 1100:!w-[29px] 1100:!h-[29px] !-translate-y-[5px]" /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687260355/Web%20App/mark_x2s6pv.svg"
                            }
                            alt="Check Icon"
                            className="mr-[13px] w-6 h-6 1100:!w-[29px] 1100:!h-[29px] !-translate-y-[5px]"
                        />
                        Access to port & freight operations support and assistance in 190+
                        countries.
                    </p>

                    <p className="flex font-rocGroteskMedium text-[15px] mt-5">
                        {/* <CheckIcon className="mr-[13px] w-6 h-6  1100:!w-[32px] 1100:!h-[32px] !-translate-y-[5px]" /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687260355/Web%20App/mark_x2s6pv.svg"
                            }
                            alt="Check Icon"
                            className="mr-[13px] w-6 h-6  1100:!w-[32px] 1100:!h-[32px] !-translate-y-[5px]"
                        />
                        Goods-in-transit insurance coverage across Nigeria. Coming soon to other
                        countries.
                    </p>

                    <p className="flex font-rocGroteskMedium text-[15px] mt-5">
                        {/* <CheckIcon className="mr-[13px] w-6 h-6  1100:!w-[25px] 1100:!h-[25px] !-translate-y-[5px]" /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687260355/Web%20App/mark_x2s6pv.svg"
                            }
                            alt="Check Icon"
                            className="mr-[13px] w-6 h-6  1100:!w-[25px] 1100:!h-[25px] !-translate-y-[5px]"
                        />
                        Create, manage and track your customers’ shipments with ease.
                    </p>

                    <p className="flex font-rocGroteskMedium text-[15px] mt-5">
                        {/* <CheckIcon className="mr-[13px] w-6 h-6  1100:w-[30px] 1100:h-[30px] -translate-y-[5px]" /> */}
                        <img
                            src={
                                "https://res.cloudinary.com/dvxi7qcmd/image/upload/v1687260355/Web%20App/mark_x2s6pv.svg"
                            }
                            alt="Check Icon"
                            className="mr-[13px] w-6 h-6  1100:w-[30px] 1100:h-[30px] -translate-y-[5px]"
                        />
                        Make money by automating invoicing and enabling fast online naira payment.
                    </p>
                </div>

                <form
                    className={`${
                        createWishlistLoading && "pointer-events-none"
                    } px-4 400:px-7 py-3 400:py-5 pb-4 400:pb-7 max-1100:w-full max-1100:mb-10 1100:basis-[450px] [&_*]:text-gun-metal shadow-[0px_0px_5px_rgba(0,0,0,0.05),0px_25px_35px_rgba(0,0,0,0.03)]`}
                    onSubmit={sendWishlistRequest}
                    id="form-section"
                >
                    <h3 className="font-rocGroteskBold text-lg">Sign up to the waitlist</h3>

                    <label
                        className="block text-[13px] font-rocGroteskMedium mt-6 mb-[6px]"
                        htmlFor="fullName"
                    >
                        Full name*
                    </label>
                    <input
                        id="fullName"
                        required
                        placeholder="Your full name"
                        className="rounded-sm border px-[14px] py-3 block placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium w-full"
                    />
                    <label
                        className="block text-[13px] font-rocGroteskMedium mt-6 mb-[6px]"
                        htmlFor="businessName"
                    >
                        Business name*
                    </label>
                    <input
                        id="businessName"
                        required
                        placeholder="Enter your business name"
                        className="rounded-sm border px-[14px] py-3 block placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium w-full"
                    />
                    <label
                        className="block text-[13px] font-rocGroteskMedium mt-6 mb-[6px]"
                        htmlFor="email"
                    >
                        Email*
                    </label>
                    <input
                        id="email"
                        type={"email"}
                        required
                        placeholder="Enter your email address"
                        className="rounded-sm border px-[14px] py-3 block placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium w-full"
                    />
                    <label className="block text-[13px] font-rocGroteskMedium mt-6 mb-[6px]">
                        Phone number*
                    </label>
                    <div className="grid grid-cols-[115px_calc(100%-115px)] 475:grid-cols-[110px_calc(100%-110px)]">
                        <SelectInput
                            value={phoneExt}
                            isRequired
                            name="phoneExt"
                            className="bg-mvx-light-blue rounded-tr-none rounded-br-none"
                            handleChange={(_, value) => setPhoneExt(value)}
                            dropdownOptions={countries
                                .filter((data) => Boolean(data?.codes[0]))
                                .map((item) => ({
                                    label: item?.codes[0]?.replace(" ", ""),
                                    value: item?.codes[0]?.replace(" ", ""),
                                    icon: <ReactCountryFlag countryCode={item?.abbreviation} />,
                                }))}
                            placeholder={"+000"}
                        />

                        <input
                            id="mobile"
                            placeholder="(000) 000-0000"
                            className="border-y border-r rounded-sm border px-[14px] py-3 placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium"
                            required
                            minLength={10}
                            pattern={"^[0-9]+$"}
                            title="must be a valid phone number"
                        />
                    </div>
                    <label className="block text-[13px] font-rocGroteskMedium mt-6 mb-[6px]">
                        Are you a freight forwarder?
                    </label>

                    <div className="flex items-center mt-2">
                        <div
                            className="mr-5 cursor-pointer flex items-center"
                            onClick={() => setIsFF(true)}
                        >
                            <span className="material-icons text-xl">
                                {isFF ? "radio_button_checked" : "radio_button_unchecked"}
                            </span>
                            <span className="text-xs font-rocGroteskMedium ml-[5px]">Yes</span>
                        </div>

                        <div
                            className="cursor-pointer flex items-center"
                            onClick={() => setIsFF(false)}
                        >
                            <span className="material-icons text-xl">
                                {!isFF ? "radio_button_checked" : "radio_button_unchecked"}
                            </span>
                            <span className="text-xs font-rocGroteskMedium ml-[5px] translate-y-[1px]">
                                No
                            </span>
                        </div>
                    </div>
                    <label
                        className="block text-[13px] font-rocGroteskMedium mt-5 mb-[6px]"
                        htmlFor="employees"
                    >
                        Number of employees*
                    </label>
                    <input
                        id="employees"
                        required
                        placeholder="Enter the number of your employees"
                        className="rounded-sm border px-[14px] py-3 block placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium w-full"
                        pattern={"^[0-9]+$"}
                    />
                    <label className="block text-[13px] font-rocGroteskMedium mt-6 mb-[6px]">
                        Do you use any software to manage your freight operations (ERP or Excel
                        Sheet)?
                    </label>

                    <div className="flex items-center mt-2">
                        <div
                            className="mr-5 cursor-pointer flex items-center"
                            onClick={() => setUseSoftware(true)}
                        >
                            <span className="material-icons text-xl">
                                {useSoftware ? "radio_button_checked" : "radio_button_unchecked"}
                            </span>
                            <span className="text-xs font-rocGroteskMedium ml-[5px]">Yes</span>
                        </div>

                        <div
                            className="cursor-pointer flex items-center"
                            onClick={() => setUseSoftware(false)}
                        >
                            <span className="material-icons text-xl">
                                {!useSoftware ? "radio_button_checked" : "radio_button_unchecked"}
                            </span>
                            <span className="text-xs font-rocGroteskMedium ml-[5px] translate-y-[1px]">
                                No
                            </span>
                        </div>
                    </div>

                    <label
                        className="block text-[13px] font-rocGroteskMedium mt-5 mb-[6px]"
                        htmlFor="yesToSoftware"
                    >
                        If “yes”, when did you last use this software?{useSoftware && "*"}
                    </label>
                    <input
                        id="lastUsedSoftware"
                        placeholder="Within the last 6 months"
                        className="rounded-sm border px-[14px] py-3 block placeholder:!text-[13px] placeholder:!font-rocGroteskMedium text-sm font-rocGroteskMedium w-full"
                        required={useSoftware}
                    />

                    <button
                        type={"submit"}
                        className="bg-[#16C6A4] text-[13px] font-rocGroteskMedium w-full mt-7 rounded py-[10px]"
                    >
                        {createWishlistLoading ? (
                            <Loader className={"mx-auto"} />
                        ) : (
                            <>Join the Fleet+ waitlist</>
                        )}
                    </button>
                </form>
            </section>

            <LandingSubFooter />

            <LandingTempFooter />
            {successModal && (
                <ModalContainer closeModal={() => setSuccessModal(false)}>
                    <div className="fixed max-520:left-0 max-520:bottom-0 520:relative bg-white px-8 pt-10 pb-16  w-screen 520:w-[460px] text-center rounded 520:mb-24">
                        <span
                            className="material-icons absolute top-3 right-4 p-[1px] cursor-pointer"
                            onClick={() => setSuccessModal(false)}
                        >
                            close
                        </span>
                        <img src={waitlistSuccessImg} alt="Success" className="mx-auto" />
                        <h3 className="font-rocGroteskBold text-2xl mt-6 mb-3 ">
                            Submission successful!{" "}
                        </h3>
                        <p className="font-rocGroteskMedium ">
                            You're now on the Fleet+ waitlist. Look out for an email from the team
                            with next steps.
                        </p>
                    </div>
                </ModalContainer>
            )}
        </>
    );
};

export default WaitList;
