import React, { useEffect, useRef, useState } from "react";
import star from "assets/images/Star.svg";
import { PaystackConsumer } from "react-paystack";
import countries from "variables/countries";
import SelectInput from "components/common/SelectInput";
import Dropdown from "components/common/Dropdown";
import ModalContainer from "components/common/ModalContainer";
import verified from "assets/images/dashboard/verified_mark.svg";
import { useDispatch, useSelector } from "react-redux";
import { subscriptionActions } from "actions";
import Loader from "components/common/Loader";
import { getCurrencyFromCurrencyCode } from "helpers";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import LocationSearchInput from "components/common/AutocompleteInput";
import moment from "moment";
import config from "config/config";
import { formatMoney } from "helpers/formatMoney";

const BillingAndSubscription = ({ setActiveMobileSection }) => {
    const [isMonthly, setIsMonthly] = useState(true);
    const [endSubscriptionModal, setEndSubscriptionModal] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [initialScreen, setInitialScreen] = useState(true);
    const [buyPlan, setBuyPlan] = useState(false);
    const [reviewDetails, setReviewDetails] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [address, setAddress] = useState({});
    const [billingInfo, setBillingInfo] = useState({
        fullName: "",
        email: "",
        country: "",
        city: "",
        zipCode: "",
        state: "",
    });
    const [plans, setPlans] = useState({
        monthly: [],
        yearly: [],
    });
    const [allPlans, setAllPlans] = useState([]);
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const dispatch = useDispatch();
    const {
        getPlansSuccess,
        getPlansLoading,
        getPlanBenefitsSuccess,
        getPlanBenefitsLoading,
        getSubscriptionSuccess,
        endSubscriptionLoading,
        endSubscriptionSuccess,
        getSubscriptionLoading,
    } = useSelector((state) => state.subscription);
    const { ffProfile } = useSelector((state) => state.auth);

    const proMonthly = plans.monthly?.find((item) => item?.name === "pro");
    const standardMonthly = plans.monthly?.find((item) => item?.name === "standard");
    const proYearly = plans.yearly?.find((item) => item?.name === "pro");
    const standardYearly = plans.yearly?.find((item) => item?.name === "standard");
    const proPlans = allPlans?.filter(
        (item) => item?.planAvailability?.find((value) => value?.name === "pro")?.available
    );
    const standardPlans = allPlans?.filter(
        (item) => item?.planAvailability?.find((value) => value?.name === "standard")?.available
    );

    const today = moment().format("Do MMMM, YYYY");
    const timePeriod = isMonthly ? moment().add(1, "months") : moment().add(1, "years");
    const nextRenewal = moment(timePeriod).format("Do MMMM, YYYY");

    const paystackConfig = {
        reference: new Date().getTime().toString(),
        email: ffProfile?.result?.email,
        publicKey: config.PUBLIC_PAYSTACK_API_KEY,
        currency: (isMonthly ? proMonthly : proYearly)?.price?.amount?.currency,
        plan: (isMonthly ? proMonthly : proYearly)?.planCode,
        metadata: {
            plan_code: (isMonthly ? proMonthly : proYearly)?.planCode,
            custom_fields: [
                {
                    display_name: billingInfo.fullName,
                },
            ],
        },
    };

    const handleSuccess = (reference) => {
        setSuccessModal(true);
        console.log("reference", reference);
    };

    const handleClose = () => {
        // implementation for  whatever you want to do when the Paystack dialog closed.
        console.log("closed");
    };

    const componentProps = {
        ...paystackConfig,
        text: "Paystack Button Implementation",
        onSuccess: (reference) => handleSuccess(reference),
        onClose: handleClose,
    };

    const handleInputChange = (name, value) => {
        setBillingInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const scroll = (element, change, duration) => {
        let start = element.scrollLeft,
            currentTime = 0,
            increment = 20;

        let animateScroll = function () {
            currentTime += increment;
            let val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollLeft = val;
            if (currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    };

    //t = current time, b = start value, c = change in value, d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    };

    useEffect(() => {
        if (Boolean(getSubscriptionSuccess)) {
            setSubscription(getSubscriptionSuccess?.subscription);
            setSubscribed(true);
        }
    }, [getSubscriptionSuccess]);

    useEffect(() => {
        if (Boolean(endSubscriptionSuccess)) {
            setSubscribed(false);
            setEndSubscriptionModal(false);
            setInitialScreen(true);
            setBuyPlan(false);
            setReviewDetails(false);
            setBillingInfo({
                fullName: "",
                email: "",
                country: "",
                city: "",
                zipCode: "",
                state: "",
            });
            setAddress({});
        }
    }, [endSubscriptionSuccess]);

    useEffect(() => {
        dispatch(subscriptionActions.fetchPlansListing());
        dispatch(subscriptionActions.fetchPlanBenefits());
    }, [dispatch]);

    useEffect(() => {
        dispatch(subscriptionActions.fetchSubscription());
    }, [dispatch]);

    useEffect(() => {
        const monthly = getPlansSuccess?.plans?.filter((plan) => plan.interval === "monthly");
        const yearly = getPlansSuccess?.plans?.filter((plan) => plan.interval === "yearly");

        setPlans({
            monthly,
            yearly,
        });
    }, [getPlansSuccess?.plans]);

    useEffect(() => {
        const planBenefits = _.cloneDeep(getPlanBenefitsSuccess);
        const benefits = planBenefits?.data?.map((item) => {
            const plan = planBenefits?.benefitsAvailability?.find(
                (value) => value?.shortCode?.toLowerCase() === item?.shortCode?.toLowerCase()
            );

            return {
                ...item,
                planAvailability: plan?.plans,
            };
        });
        const plans = benefits?.filter((plan) => Boolean(plan?.planAvailability));

        setAllPlans(plans);
    }, [getPlanBenefitsSuccess]);

    if (
        (getPlansLoading || getPlanBenefitsLoading || getSubscriptionLoading) &&
        !endSubscriptionLoading
    ) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div>
            {!subscribed ? (
                <div>
                    {initialScreen && (
                        <div className="flex flex-col items-center mb-12 max-sm:px-5">
                            <div className="max-sm:block hidden max-sm:float-left max-sm:w-full">
                                <span
                                    onClick={() => setActiveMobileSection(false)}
                                    className="material-icons-outlined max-sm:block hidden text-lg font-semibold "
                                >
                                    arrow_back
                                </span>
                            </div>
                            <p className="text-[36px] max-sm:text-[24px] text-center font-rocGroteskBold mb-6">
                                Simple & scalable plans <br /> for your business needs.
                            </p>
                            <div className="mb-9">
                                <div className="flex bg-[#F4F5F7] my-4 text-[13px] w-[380px] h-10 text-[#6B778C] items-center">
                                    <button
                                        type="button"
                                        className={`
                                 ml-1 h-9 w-1/2 flex justify-center items-center text-gun-metal text-base rounded-[2px] transition-all duration-[400ms] ${
                                     isMonthly && "bg-white shadow-md rounded text-gun-metal"
                                 }`}
                                        onClick={() => setIsMonthly(true)}
                                    >
                                        Monthly
                                    </button>

                                    <button
                                        type="button"
                                        className={`flex gap-2 w-1/2 justify-center items-center mr-1 h-9 rounded-[2px] text-gun-metal text-base transition-all duration-[400ms] ${
                                            !isMonthly && "bg-white rounded shadow-md"
                                        }`}
                                        onClick={() => setIsMonthly(false)}
                                    >
                                        <span className="text-base">Yearly</span>
                                        <span className="text-xs px-1.5 bg-mvx-orange rounded-[2px] text-white">
                                            Save 20%
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="w-[65%] max-lg:w-[90%] max-sm:w-full max-sm:flex-col max-sm:gap-y-4 flex">
                                <div className="w-1/2 max-sm:w-full">
                                    <div className="flex gap-2 justify-center items-center py-1 bg-mvx-orange rounded-t">
                                        <img src={star} alt="star" />
                                        <span className="font-rocGroteskBold text-white text-sm">
                                            Most popular
                                        </span>
                                    </div>
                                    <div className="px-6 pt-6 pb-4 border-4 border-mvx-orange">
                                        <p className="text-lg font-rocGroteskBold mb-3">Pro</p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {(isMonthly ? proMonthly : proYearly)?.description}
                                        </p>
                                        <p className="text-sm font-rocGroteskBold leading-[35px]">
                                            <span className="text-base">
                                                {getCurrencyFromCurrencyCode(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.currency
                                                )}
                                            </span>
                                            <span className="text-[24px]">
                                                {formatMoney().format(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.amount
                                                )}
                                            </span>
                                            <span className="text-base">
                                                /per{" "}
                                                {(isMonthly ? proMonthly : proYearly)?.interval ===
                                                "monthly"
                                                    ? "month"
                                                    : "year"}
                                            </span>
                                        </p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {(isMonthly ? proMonthly : proYearly)?.shortDescription}
                                        </p>
                                        <button
                                            className="flex items-center justify-center bg-mvx-orange text-white font-rocGroteskBold w-full py-2 text-sm rounded mb-6"
                                            type={"button"}
                                            onClick={() => {
                                                setInitialScreen(false);
                                                setBuyPlan(true);
                                            }}
                                        >
                                            <span className="text-inherit">Buy Pro</span>
                                        </button>
                                        <div className="mb-12">
                                            <p className="font-rocGroteskBold mb-3 text-sm">
                                                All Standard features, plus
                                            </p>
                                            <div>
                                                {proPlans?.slice(0, 4)?.map((item) => {
                                                    return (
                                                        <p
                                                            className="flex gap-3 items-center mb-3"
                                                            key={item?._id}
                                                        >
                                                            <i className="ri-check-line text-lg"></i>
                                                            <span className="text-sm">
                                                                {item?.description}
                                                            </span>
                                                        </p>
                                                    );
                                                })}
                                                {/* <p className="flex justify-center gap-1 items-center">
                                                    <span className="text-sm font-rocGroteskMedium">
                                                        See all features
                                                    </span>
                                                    <i className="ri-arrow-drop-down-line text-2xl"></i>
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 max-sm:w-full">
                                    <div className="p-6 mt-8 shadow-[0px_0px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                        <p className="text-lg font-rocGroteskBold mb-3">Standard</p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {
                                                (isMonthly ? standardMonthly : standardYearly)
                                                    ?.description
                                            }
                                        </p>
                                        <p className="text-sm font-rocGroteskBold leading-[35px]">
                                            <span className="text-base">
                                                {getCurrencyFromCurrencyCode(
                                                    (isMonthly ? standardMonthly : standardYearly)
                                                        ?.price?.currency
                                                )}
                                            </span>
                                            <span className="text-[24px]">
                                                {formatMoney().format(
                                                    (isMonthly ? standardMonthly : standardYearly)
                                                        ?.price?.amount
                                                )}
                                            </span>
                                            <span className="text-base">
                                                /per{" "}
                                                {(isMonthly ? standardMonthly : standardYearly)
                                                    ?.interval === "monthly"
                                                    ? "month"
                                                    : "year"}
                                            </span>
                                        </p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {
                                                (isMonthly ? standardMonthly : standardYearly)
                                                    ?.shortDescription
                                            }
                                        </p>
                                        <button
                                            className="flex items-center justify-center bg-pacific-cyan text-white font-rocGroteskBold w-full py-2 text-sm rounded mb-6"
                                            type={"button"}
                                            onClick={() => {
                                                navigate("/dashboard/shipments");
                                            }}
                                        >
                                            <span className="text-inherit">Goto Dashboard</span>
                                        </button>
                                        <div className="mb-12">
                                            <p className="font-rocGroteskBold mb-3 text-sm">
                                                What's included
                                            </p>
                                            <div>
                                                {standardPlans?.slice(0, 4)?.map((item) => {
                                                    return (
                                                        <p
                                                            className="flex gap-3 items-center mb-3"
                                                            key={item?._id}
                                                        >
                                                            <i className="ri-check-line text-lg"></i>
                                                            <span className="text-sm">
                                                                {item?.description}
                                                            </span>
                                                        </p>
                                                    );
                                                })}
                                                {/* <p className="flex justify-center gap-1 items-center">
                                                    <span className="text-sm font-rocGroteskMedium">
                                                        See all features
                                                    </span>
                                                    <i className="ri-arrow-drop-down-line text-2xl"></i>
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[90px] w-full max-lg:hidden">
                                <div className="mb-[80px]">
                                    <p className="text-center font-rocGroteskBold text-[32px]">
                                        Compare plans
                                    </p>
                                </div>
                                <div className="border flex">
                                    <div className="w-[58%]">
                                        <div className="py-4 border-b pl-4">
                                            <p className="font-rocGroteskBold text-sm">
                                                Key features
                                            </p>
                                        </div>
                                        <div className="pl-4">
                                            {allPlans?.map((item) => (
                                                <p
                                                    key={item?.description}
                                                    className="font-rocGroteskRegular text-sm py-3"
                                                >
                                                    {item?.description}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-[21%] mt-[-30px] max-sm:mt-[-50px]">
                                        <div className="flex gap-2 justify-center items-center py-1 bg-mvx-orange rounded-t">
                                            <img className="max-sm:hidden" src={star} alt="star" />
                                            <span className="font-rocGroteskBold max-sm:text-center text-white text-sm">
                                                Most popular
                                            </span>
                                        </div>
                                        <div className="border-2 border-mvx-orange pb-1 max-sm:pb-3">
                                            <div className="py-4 border-b">
                                                <p className="font-rocGroteskBold text-sm text-center">
                                                    Pro
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-[15px] max-sm:gap-[35.5px]">
                                                {allPlans?.map((item, idx) => (
                                                    <p
                                                        key={item?.description + "<->" + idx}
                                                        className="font-rocGroteskRegular text-sm text-center"
                                                    >
                                                        {item?.planAvailability?.find(
                                                            (value) => value?.name === "pro"
                                                        )?.available ? (
                                                            <span className="material-icons-outlined text-mvx-orange text-lg">
                                                                done
                                                            </span>
                                                        ) : (
                                                            <span className="material-icons-outlined text-mvx-neutral text-lg">
                                                                close
                                                            </span>
                                                        )}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[21%]">
                                        <div className="">
                                            <div className="py-4 border-b">
                                                <p className="font-rocGroteskBold text-sm text-center">
                                                    Standard
                                                </p>
                                            </div>
                                            <div className="flex flex-col gap-[15px] max-sm:gap-[35.5px]">
                                                {allPlans?.map((item, idx) => {
                                                    return (
                                                        <p
                                                            key={item?.description + "-" + idx}
                                                            className="font-rocGroteskRegular text-sm text-center"
                                                        >
                                                            {item?.planAvailability?.find(
                                                                (value) =>
                                                                    value?.name === "standard"
                                                            )?.available ? (
                                                                <span className="material-icons-outlined text-mvx-orange text-lg">
                                                                    done
                                                                </span>
                                                            ) : (
                                                                <span className="material-icons-outlined text-mvx-neutral text-lg">
                                                                    close
                                                                </span>
                                                            )}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-[45px] w-full hidden max-lg:block">
                                <div className="mb-[40px]">
                                    <p className="text-center font-rocGroteskBold text-[32px]">
                                        Compare plans
                                    </p>
                                </div>
                                <div className="flex w-full">
                                    <div className="flex gap-2 items-center justify-center bg-mvx-orange w-1/2 py-2">
                                        <img className="max-sm:hidden" src={star} alt="star" />
                                        <span className="font-rocGroteskBold max-sm:text-center text-white text-sm">
                                            Pro
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center bg-gun-metal w-1/2 py-2">
                                        <span className="font-rocGroteskBold max-sm:text-center text-white text-sm">
                                            Standard
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {allPlans?.map((item, idx) => (
                                        <div
                                            className="py-4 even:bg-mvx-light-blue"
                                            key={item?.description + "<->" + idx}
                                        >
                                            <p className="text-center mb-3">{item?.description}</p>
                                            <div className="w-full flex">
                                                <div className="flex w-1/2 justify-center">
                                                    {item?.planAvailability?.find(
                                                        (value) => value?.name === "pro"
                                                    )?.available ? (
                                                        <span className="material-icons-outlined text-mvx-orange text-lg">
                                                            done
                                                        </span>
                                                    ) : (
                                                        <span className="material-icons-outlined text-mvx-neutral text-lg">
                                                            close
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex w-1/2 justify-center">
                                                    {item?.planAvailability?.find(
                                                        (value) => value?.name === "standard"
                                                    )?.available ? (
                                                        <span className="material-icons-outlined text-mvx-orange text-lg">
                                                            done
                                                        </span>
                                                    ) : (
                                                        <span className="material-icons-outlined text-mvx-neutral text-lg">
                                                            close
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {buyPlan && (
                        <div className="max-sm:px-5">
                            <p
                                onClick={() => {
                                    setInitialScreen(true);
                                    setBuyPlan(false);
                                    setAddress({});
                                    setBillingInfo({
                                        fullName: "",
                                        email: "",
                                        country: "",
                                        city: "",
                                        zipCode: "",
                                        state: "",
                                    });
                                }}
                                className="flex items-center w-fit gap-1 mb-6 cursor-pointer"
                            >
                                <span className="material-icons-outlined text-lg font-semibold ">
                                    arrow_back
                                </span>
                                <span className="text-sm font-rocGroteskMedium underline">
                                    Go back
                                </span>
                            </p>
                            <div className="w-[100%] flex max-lg:flex-col-reverse max-lg:gap-[70px] max-lg:mb-10 gap-[140px]">
                                <div className="w-1/2 max-lg:w-full">
                                    <div className="mb-8">
                                        <p className="text-[20px] font-rocGroteskBold text-gun-metal">
                                            Billing information
                                        </p>
                                        <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                            Add billing information before making payment
                                        </p>
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            setInitialScreen(false);
                                            setBuyPlan(false);
                                            setReviewDetails(true);
                                        }}
                                    >
                                        <div className="mb-6">
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                Full name
                                            </p>
                                            <input
                                                type="text"
                                                value={billingInfo.fullName}
                                                placeholder="Full name"
                                                className="border rounded border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                name="fullName"
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        event.target.name,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-sm mb-1 font-rocGroteskMedium">
                                                Billing address
                                            </p>
                                            <LocationSearchInput
                                                setData={setAddress}
                                                savedAddress={
                                                    address?.billingAddress
                                                        ? address?.billingAddress?.address
                                                        : ""
                                                }
                                                placeholder="Address"
                                                classNames={"rounded-t rounded-b-none"}
                                                name={"billingAddress"}
                                            />
                                            <SelectInput
                                                value={billingInfo.country}
                                                name="country"
                                                placeholder={"Country"}
                                                handleChange={handleInputChange}
                                                isRequired={true}
                                                dropdownOptions={countries
                                                    .filter((data) => Boolean(data?.name))
                                                    .map((item) => ({
                                                        label: item.name,
                                                        value: item.name,
                                                    }))}
                                            />
                                            <div className="flex">
                                                <div className="w-1/2">
                                                    <input
                                                        type="text"
                                                        value={billingInfo.city}
                                                        placeholder="City"
                                                        className="border border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                        required
                                                        name="city"
                                                        onChange={(event) =>
                                                            handleInputChange(
                                                                event.target.name,
                                                                event.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="w-1/2">
                                                    <input
                                                        type="text"
                                                        value={billingInfo.zipCode}
                                                        placeholder="Zipcode"
                                                        className="border border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                        required
                                                        name="zipCode"
                                                        pattern={"^[0-9]+$"}
                                                        onChange={(event) =>
                                                            handleInputChange(
                                                                event.target.name,
                                                                event.target.value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                value={billingInfo.state}
                                                placeholder="State"
                                                className="border rounded-b border-gray-200 py-3 px-4 outline-0 w-full h-[50px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                name="state"
                                                onChange={(event) =>
                                                    handleInputChange(
                                                        event.target.name,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <p className="text-sm font-rocGroteskMedium text-gun-metal mb-8">
                                            By clicking the button below, I agree to the Fleet+ Term
                                            and Condition and Refund Policy. and I agree to pay the
                                            total amount.
                                        </p>
                                        <button
                                            className="flex items-center justify-center bg-pacific-cyan text-white font-rocGroteskMedium py-3 px-6 mb-3 w-fit max-lg:w-full text-sm rounded"
                                            type={"submit"}
                                        >
                                            Next: Review
                                        </button>
                                        <p className="text-sm font-rocGroteskMedium max-lg:text-center text-mvx-neutral">
                                            You won't be charged yet
                                        </p>
                                    </form>
                                </div>
                                <div className="w-1/2 max-lg:w-full">
                                    <div className="w-[80%] max-lg:w-full p-6 rounded shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                        <p className="text-base font-rocGroteskBold ">Fleet+ Pro</p>
                                        <Dropdown
                                            value={isMonthly ? "monthly" : "yearly"}
                                            dropdown={
                                                <p className="flex items-center justify-center gap-2 font-rocGroteskMedium text-sm">
                                                    <span className="text-inherit">
                                                        Billed {isMonthly ? "monthly" : "yearly"}
                                                    </span>
                                                    <span className="material-icons text-xl">
                                                        expand_more
                                                    </span>
                                                </p>
                                            }
                                            dropdownContainerClasses={
                                                "left-[-5px] shadow-dropdownShadow w-[150px] rounded"
                                            }
                                            name={"period"}
                                            dropdownOptions={[
                                                {
                                                    label: "Monthly",
                                                    value: "monthly",
                                                    action: () => setIsMonthly(true),
                                                },
                                                {
                                                    label: "Yearly",
                                                    value: "yearly",
                                                    action: () => setIsMonthly(false),
                                                },
                                            ]}
                                        />
                                        <hr className="my-6" />
                                        <p className="text-sm font-rocGroteskMedium">
                                            Starts today {today} for{" "}
                                            {getCurrencyFromCurrencyCode(
                                                (isMonthly ? proMonthly : proYearly)?.price
                                                    ?.currency
                                            )}
                                            {""}
                                            {formatMoney().format(
                                                (isMonthly ? proMonthly : proYearly)?.price?.amount
                                            )}
                                            . You can cancel anytime without fees or penalty.
                                        </p>
                                        <hr className="my-6" />
                                        <div className="flex justify-between">
                                            <p className="text-sm font-rocGroteskMedium">
                                                {getCurrencyFromCurrencyCode(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.currency
                                                )}
                                                {""}
                                                {formatMoney().format(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.amount
                                                )}
                                            </p>
                                            {/* <p className="text-sm font-rocGroteskMedium">$75</p> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[65%] max-lg:hidden max-sm:w-full max-sm:flex-col max-sm:gap-y-4 mt-16 mb-8 flex">
                                <div className="w-1/2 max-sm:w-full">
                                    <div className="flex gap-2 justify-center items-center py-1 bg-mvx-orange rounded-t">
                                        <img src={star} alt="star" />
                                        <span className="font-rocGroteskBold text-white text-sm">
                                            Most popular
                                        </span>
                                    </div>
                                    <div className="px-6 pt-6 pb-4 border-4 border-mvx-orange">
                                        <p className="text-lg font-rocGroteskBold mb-3">Pro</p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {(isMonthly ? proMonthly : proYearly)?.description}
                                        </p>
                                        <p className="text-sm font-rocGroteskBold leading-[35px]">
                                            <span className="text-base">
                                                {getCurrencyFromCurrencyCode(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.currency
                                                )}
                                            </span>
                                            <span className="text-[24px]">
                                                {formatMoney().format(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.amount
                                                )}
                                            </span>
                                            <span className="text-base">
                                                /per{" "}
                                                {(isMonthly ? proMonthly : proYearly)?.interval ===
                                                "monthly"
                                                    ? "month"
                                                    : "year"}
                                            </span>
                                        </p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {(isMonthly ? proMonthly : proYearly)?.shortDescription}
                                        </p>
                                        <button
                                            className="flex items-center justify-center bg-mvx-orange text-white font-rocGroteskBold w-full py-2 text-sm rounded mb-6"
                                            type={"button"}
                                            onClick={() => {
                                                setInitialScreen(false);
                                                setBuyPlan(true);
                                            }}
                                        >
                                            <span className="text-inherit">Buy Pro</span>
                                        </button>
                                        <div className="mb-12">
                                            <p className="font-rocGroteskBold mb-3 text-sm">
                                                All Standard features, plus
                                            </p>
                                            <div>
                                                {proPlans?.slice(0, 4)?.map((item) => {
                                                    return (
                                                        <p
                                                            className="flex gap-3 items-center mb-3"
                                                            key={item?._id}
                                                        >
                                                            <i className="ri-check-line text-lg"></i>
                                                            <span className="text-sm">
                                                                {item?.description}
                                                            </span>
                                                        </p>
                                                    );
                                                })}
                                                {/* <p className="flex justify-center gap-1 items-center">
                                                    <span className="text-sm font-rocGroteskMedium">
                                                        See all features
                                                    </span>
                                                    <i className="ri-arrow-drop-down-line text-2xl"></i>
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 max-sm:w-full">
                                    <div className="p-6 mt-8 shadow-[0px_0px_24px_-4px_rgba(16,24,40,0.1),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                        <p className="text-lg font-rocGroteskBold mb-3">Standard</p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {
                                                (isMonthly ? standardMonthly : standardYearly)
                                                    ?.description
                                            }
                                        </p>
                                        <p className="text-sm font-rocGroteskBold leading-[35px]">
                                            <span className="text-base">
                                                {getCurrencyFromCurrencyCode(
                                                    (isMonthly ? standardMonthly : standardYearly)
                                                        ?.price?.currency
                                                )}
                                            </span>
                                            <span className="text-[24px]">
                                                {formatMoney().format(
                                                    (isMonthly ? standardMonthly : standardYearly)
                                                        ?.price?.amount
                                                )}
                                            </span>
                                            <span className="text-base">
                                                /per{" "}
                                                {(isMonthly ? standardMonthly : standardYearly)
                                                    ?.interval === "monthly"
                                                    ? "month"
                                                    : "year"}
                                            </span>
                                        </p>
                                        <p className="text-sm font-rocGroteskRegular mb-3">
                                            {
                                                (isMonthly ? standardMonthly : standardYearly)
                                                    ?.shortDescription
                                            }
                                        </p>
                                        <button
                                            className="flex items-center justify-center bg-pacific-cyan text-white font-rocGroteskBold w-full py-2 text-sm rounded mb-6"
                                            type={"button"}
                                            onClick={() => {
                                                navigate("/dashboard/shipments");
                                            }}
                                        >
                                            <span className="text-inherit">Goto Dashboard</span>
                                        </button>
                                        <div className="mb-12">
                                            <p className="font-rocGroteskBold mb-3 text-sm">
                                                What's included
                                            </p>
                                            <div>
                                                {standardPlans?.slice(0, 4)?.map((item) => {
                                                    return (
                                                        <p
                                                            className="flex gap-3 items-center mb-3"
                                                            key={item?._id}
                                                        >
                                                            <i className="ri-check-line text-lg"></i>
                                                            <span className="text-sm">
                                                                {item?.description}
                                                            </span>
                                                        </p>
                                                    );
                                                })}
                                                {/* <p className="flex justify-center gap-1 items-center">
                                                    <span className="text-sm font-rocGroteskMedium">
                                                        See all features
                                                    </span>
                                                    <i className="ri-arrow-drop-down-line text-2xl"></i>
                                                </p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {reviewDetails && (
                        <div className="max-sm:px-5">
                            <p
                                onClick={() => {
                                    setInitialScreen(false);
                                    setBuyPlan(true);
                                    setReviewDetails(false);
                                }}
                                className="flex items-center w-fit gap-1 mb-6 cursor-pointer"
                            >
                                <span className="material-icons-outlined text-lg font-semibold ">
                                    arrow_back
                                </span>
                                <span className="text-sm font-rocGroteskMedium underline">
                                    Go back
                                </span>
                            </p>
                            <div className="w-[100%] flex max-lg:flex-col max-lg:gap-5 gap-[140px]">
                                <div className="w-1/2 max-lg:w-full">
                                    <div className="mb-8">
                                        <div className="mb-4">
                                            <p className="text-[20px] font-rocGroteskBold text-gun-metal">
                                                Biilling information
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium text-mvx-neutral">
                                                Add billing information before making payment
                                            </p>
                                        </div>
                                        <div className="mb-6">
                                            <p className="text-sm font-rocGroteskBold text-gun-metal">
                                                Renews monthly
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                Next renewal: {nextRenewal}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-4/5">
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    Plan
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    Pro plan
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-4/5">
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    Full name
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    {billingInfo.fullName}
                                                </p>
                                            </div>
                                            <div className="w-1/5 text-right">
                                                <p
                                                    onClick={() => {
                                                        setInitialScreen(false);
                                                        setBuyPlan(true);
                                                        setReviewDetails(false);
                                                    }}
                                                    className="underline cursor-pointer text-sm font-rocGroteskMedium text-gun-metal"
                                                >
                                                    Edit
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-4/5">
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    Email address
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    {ffProfile?.result?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="w-4/5">
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    Billing address
                                                </p>
                                                <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                    {address?.billingAddress?.address}
                                                </p>
                                            </div>
                                            <div className="w-1/5 text-right">
                                                <p
                                                    onClick={() => {
                                                        setInitialScreen(false);
                                                        setBuyPlan(true);
                                                        setReviewDetails(false);
                                                    }}
                                                    className="underline cursor-pointer text-sm font-rocGroteskMedium text-gun-metal"
                                                >
                                                    Edit
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="mb-6" />
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-1/2 ">
                                            <p className="underline text-base font-rocGroteskBold text-gun-metal">
                                                Total (
                                                {
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.currency
                                                }
                                                )
                                            </p>
                                        </div>
                                        <div className="w-1/2 text-right">
                                            <p className="text-base font-rocGroteskBold text-gun-metal">
                                                {getCurrencyFromCurrencyCode(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.currency
                                                )}
                                                {""}
                                                {formatMoney().format(
                                                    (isMonthly ? proMonthly : proYearly)?.price
                                                        ?.amount
                                                )}
                                            </p>
                                            {/* <p className="text-base font-rocGroteskMedium text-mvx-neutral">
                                                $75
                                            </p> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2 max-lg:w-full">
                                    <div className="w-[80%] max-lg:w-full max-lg:mb-6 p-6 rounded shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                        <div className="flex justify-between items-start">
                                            <div className="w-1/2 ">
                                                <p className="text-lg font-rocGroteskBold text-gun-metal">
                                                    {getCurrencyFromCurrencyCode(
                                                        (isMonthly ? proMonthly : proYearly)?.price
                                                            ?.currency
                                                    )}
                                                    {""}
                                                    {formatMoney().format(
                                                        (isMonthly ? proMonthly : proYearly)?.price
                                                            ?.amount
                                                    )}
                                                </p>
                                            </div>
                                            {/* <div className="w-1/2 text-right">
                                                <p className="text-base font-rocGroteskMedium text-mvx-neutral">
                                                    $75
                                                </p>
                                            </div> */}
                                        </div>
                                        <Dropdown
                                            value={isMonthly ? "monthly" : "yearly"}
                                            dropdown={
                                                <p className="flex items-center justify-center gap-1 font-rocGroteskMedium text-sm">
                                                    <span className="text-inherit">
                                                        Pro (billed{" "}
                                                        {isMonthly ? "monthly" : "yearly"})
                                                    </span>
                                                    <span className="material-icons text-lg">
                                                        expand_more
                                                    </span>
                                                </p>
                                            }
                                            dropdownContainerClasses={
                                                "left-[-5px] shadow-dropdownShadow w-[150px] rounded"
                                            }
                                            name={"period"}
                                            dropdownOptions={[
                                                {
                                                    label: "Monthly",
                                                    value: "monthly",
                                                    action: () => setIsMonthly(true),
                                                },
                                                {
                                                    label: "Yearly",
                                                    value: "yearly",
                                                    action: () => setIsMonthly(false),
                                                },
                                            ]}
                                        />
                                        <hr className="my-6" />
                                        <p className="text-sm font-rocGroteskMedium">
                                            Starts today {today} for{" "}
                                            {getCurrencyFromCurrencyCode(
                                                (isMonthly ? proMonthly : proYearly)?.price
                                                    ?.currency
                                            )}
                                            {""}
                                            {formatMoney().format(
                                                (isMonthly ? proMonthly : proYearly)?.price?.amount
                                            )}
                                            . You can cancel anytime without fees or penalty.
                                        </p>
                                        <hr className="my-6" />
                                        <PaystackConsumer {...componentProps}>
                                            {({ initializePayment }) => (
                                                <button
                                                    className="flex items-center justify-center bg-pacific-cyan text-white font-rocGroteskMedium py-3 px-6 mb-3 w-full text-sm rounded"
                                                    type={"button"}
                                                    onClick={() =>
                                                        initializePayment(
                                                            handleSuccess,
                                                            handleClose
                                                        )
                                                    }
                                                    // onClick={() => setSuccessModal(true)}
                                                >
                                                    Buy Pro
                                                </button>
                                            )}
                                        </PaystackConsumer>

                                        <div className="flex justify-center items-center gap-1">
                                            <i className="ri-lock-fill text-sm "></i>
                                            <p className="text-sm font-rocGroteskMedium mt-[2px]">
                                                Secured and encrypted payment
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {successModal && (
                        <ModalContainer
                            showCloseIcon={false}
                            tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                            closeModal={() => {
                                setSuccessModal(false);
                                setSubscribed(true);
                                dispatch(subscriptionActions.fetchSubscription());
                            }}
                        >
                            <div className="bg-white rounded-lg shadow-modalShadow">
                                <div className="pt-8 pb-6">
                                    <div className="px-6 mb-[51px]">
                                        <div className="flex justify-center mb-6">
                                            <img src={verified} alt="success" />
                                        </div>
                                        <p className="text-sm text-center font-rocGroteskBold text-gun-metal">
                                            PRO
                                        </p>
                                        <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                            You've upgraded!
                                        </p>
                                        <p className="text-sm text-center font-rocGroteskRegular text-gun-metal px-6">
                                            You're now on Pro Plan with access to some amazing
                                            features. A receipt has been your payment will be sent
                                            to your email shortly
                                        </p>
                                    </div>

                                    <div className="mb-[79px] flex items-center relative">
                                        <i
                                            onClick={() => scroll(scrollRef.current, -200, 500)}
                                            className="ri-arrow-left-s-line text-3xl absolute cursor-pointer z-10"
                                        ></i>
                                        <div
                                            ref={scrollRef}
                                            className="grid grid-cols-[1fr_1fr_1fr] gap-2 relative overflow-hidden px-2 duration-500"
                                        >
                                            <div className="bg-[#FAFBFC] rounded w-[270px] p-6 ">
                                                <i className="ri-money-dollar-circle-fill mb-4 text-4xl"></i>
                                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                                    Access Freight Working Capital
                                                </p>
                                                <p className="font-rocGroteskRegular text-sm text-gun-metal">
                                                    Up to $20,000 freight working capital (Coming
                                                    Soon)
                                                </p>
                                            </div>
                                            <div className="bg-[#FAFBFC] rounded w-[270px] p-6 ">
                                                <i className="ri-money-dollar-circle-fill mb-4 text-4xl"></i>
                                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                                    Access Freight Working Capital
                                                </p>
                                                <p className="font-rocGroteskRegular text-sm text-gun-metal">
                                                    Up to $20,000 freight working capital (Coming
                                                    Soon)
                                                </p>
                                            </div>
                                            <div className="bg-[#FAFBFC] rounded w-[270px] p-6 ">
                                                <i className="ri-money-dollar-circle-fill mb-4 text-4xl"></i>
                                                <p className="font-rocGroteskMedium text-sm text-gun-metal">
                                                    Access Freight Working Capital
                                                </p>
                                                <p className="font-rocGroteskRegular text-sm text-gun-metal">
                                                    Up to $20,000 freight working capital (Coming
                                                    Soon)
                                                </p>
                                            </div>
                                        </div>
                                        <i
                                            onClick={() => scroll(scrollRef.current, 200, 500)}
                                            className="ri-arrow-right-s-line text-3xl absolute right-0 cursor-pointer z-10"
                                        ></i>
                                    </div>

                                    <div className="px-6">
                                        <button
                                            className="flex items-center justify-center bg-pacific-cyan text-white font-rocGroteskMedium w-full py-3 text-sm rounded"
                                            type={"button"}
                                            onClick={() => {
                                                setSuccessModal(false);
                                                setSubscribed(true);
                                                dispatch(subscriptionActions.fetchSubscription());
                                            }}
                                        >
                                            Explore all features
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </ModalContainer>
                    )}
                </div>
            ) : (
                <>
                    <div className="w-[65%] max-sm:w-full max-sm:px-5 max-sm:ml-0 ml-[10px]">
                        <div className="mb-6">
                            {/* <p className="text-[20px] font-rocGroteskBold text-gun-metal">
                                Billing and Subscription
                            </p> */}
                            <div className="max-sm:flex max-sm:gap-4">
                                <span
                                    onClick={() => setActiveMobileSection(false)}
                                    className="material-icons-outlined max-sm:block hidden text-lg font-semibold "
                                >
                                    arrow_back
                                </span>
                                <p className="text-[22px] font-rocGroteskBold text-gun-metal">
                                    Billing and Subscription
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="mb-14">
                                <div className="flex items-center gap-3 rounded-t bg-gun-metal p-4">
                                    <svg
                                        width="34"
                                        height="34"
                                        viewBox="0 0 64 64"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M39.5514 8.75932L31.9994 1.45459L24.4474 8.75932L14.0445 7.28732L12.2292 17.6379L2.94922 22.56L7.56304 32L2.94922 41.44L12.2292 46.3622L14.0445 56.7128L24.4474 55.2408L31.9994 62.5455L39.5514 55.2408L49.9543 56.7128L51.7696 46.3622L61.0496 41.44L56.4358 32L61.0496 22.56L51.7696 17.6379L49.9543 7.28732L39.5514 8.75932ZM17.4539 33.1346L28.3339 44.0146L46.3703 24.32L42.0939 20.3637L28.1303 35.5782L21.5558 29.0037L17.4539 33.1346Z"
                                            fill="#FFFFFF"
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M38.829 10.9732L31.9985 4.36377L25.165 10.9732L15.7541 9.64086L14.1105 19.0052L5.71484 23.459L9.88939 32.0001L5.71484 40.5412L14.1105 44.995L15.7541 54.3594L25.165 53.027L31.9985 59.6365L38.829 53.027L48.2428 54.3594L49.8836 44.995L58.2821 40.5412L54.1076 32.0001L58.2821 23.459L49.8836 19.0052L48.2428 9.64086L38.829 10.9732ZM17.453 33.1347L28.333 44.0147L46.3694 24.3201L42.093 20.3638L28.1294 35.5783L21.5548 29.0038L17.453 33.1347Z"
                                            fill="#FFFFFF"
                                        />
                                    </svg>
                                    <div>
                                        <p className="text-white capitalize font-rocGroteskBold text-base">
                                            {subscription?.plan?.name} Plan
                                        </p>
                                        <p className="text-white font-rocGroteskRegular text-sm">
                                            Active from{" "}
                                            {moment(subscription?.createdAt).format(
                                                "Do MMMM, YYYY"
                                            )}{" "}
                                            -{" "}
                                            {moment(subscription?.expiryDate).format(
                                                "Do MMMM, YYYY"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="rounded-b shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
                                    <div className="pt-6 pb-3 px-4">
                                        <div>
                                            {proPlans?.slice(0, 4)?.map((item) => {
                                                return (
                                                    <p
                                                        className="flex gap-3 items-center mb-3"
                                                        key={item?._id + item?.description}
                                                    >
                                                        <i className="ri-check-line text-lg"></i>
                                                        <span className="text-sm">
                                                            {item?.description}
                                                        </span>
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="py-6 flex justify-between px-4 items-center">
                                        <p className="font-rocGroteskBold text-base">
                                            {getCurrencyFromCurrencyCode(
                                                subscription?.plan?.price?.currency
                                            )}
                                            {""}
                                            {formatMoney().format(
                                                subscription?.plan?.price?.amount
                                            )}
                                            /
                                            {subscription?.plan?.interval === "monthly"
                                                ? "month"
                                                : "year"}
                                        </p>
                                        {/* <button
                                        className="flex items-center justify-center bg-pacific-cyan text-white font-rocGroteskMedium w-fit py-2 px-4 text-sm rounded"
                                        type={"button"}
                                        onClick={() => {
                                            console.log("====");
                                        }}
                                    >
                                        View all benefits
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                            {/* <div className="mb-6">
                            <p className="text-sm text-gun-metal font-rocGroteskBold mb-2">
                                Billing Plan
                            </p>
                            <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-4 w-[85%]">
                                By deleting your account on Fleet+, kindly note that you will be
                                losing all the information about your shipments, quotes, earnings,
                                and team members.
                            </p>
                            <button
                                className="flex items-center justify-center bg-mvx-light-blue text-gun-metal font-rocGroteskMedium w-fit py-2 px-4 text-sm rounded"
                                type={"button"}
                                onClick={() => {
                                    console.log("====");
                                }}
                            >
                                Change plan
                            </button>
                        </div> */}
                            <div className="mb-6">
                                <p className="text-sm text-gun-metal font-rocGroteskBold mb-2">
                                    Manage Subscription
                                </p>
                                <p className="text-sm text-mvx-neutral font-rocGroteskMedium mb-4 w-[85%]">
                                    The password must be a minimum of 7 characters long containing
                                    at least one number and have a mixture of uppercase and
                                    lowercase letters
                                </p>
                                <button
                                    className="flex items-center justify-center bg-mvx-light-blue text-gun-metal font-rocGroteskMedium w-fit py-2 px-4 text-sm rounded"
                                    type={"button"}
                                    onClick={() => {
                                        setEndSubscriptionModal(true);
                                    }}
                                >
                                    End subscription
                                </button>
                            </div>
                            {/* <hr className="mb-14" />
                        <p className="text-base font-rocGroteskMedium mb-4">Invoices</p>
                        <div className="border mb-20">
                            <div className="w-full grid grid-cols-[1fr_1fr_1fr_0.5fr] py-3 px-4 bg-mvx-light-blue ">
                                <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                    Date
                                </div>
                                <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                    DESCRIPTION
                                </div>
                                <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral">
                                    STATUS
                                </div>

                                <div className="uppercase flex justify-start text-xs font-rocGroteskMedium text-mvx-neutral"></div>
                            </div>
                            <div>
                                <div>
                                    <hr />
                                    <div className="w-full grid grid-cols-[1fr_1fr_1fr_0.5fr] my-3 px-4">
                                        <div className=" flex items-center justify-start text-xs font-rocGroteskMedium text-gun-metal">
                                            Jan 2, 2023
                                        </div>
                                        <div className=" flex items-center justify-start text-xs font-rocGroteskMedium text-gun-metal">
                                            Pro plan (monthly)
                                        </div>

                                        <div className="capitalize flex gap-2 items-center justify-start text-xs font-rocGroteskMedium text-gun-metal">
                                            <span
                                                className={`material-icons text-[8px] text-[#00DB8F]`}
                                            >
                                                fiber_manual_record
                                            </span>
                                            <span className="text-inherit">Paid</span>
                                        </div>

                                        <div className=" flex items-center justify-center text-xs font-rocGroteskMedium text-gun-metal">
                                            <Dropdown
                                                value={""}
                                                dropdown={
                                                    <span className="material-icons text-base">
                                                        more_vert
                                                    </span>
                                                }
                                                dropdownContainerClasses={
                                                    "left-[-70px] shadow-dropdownShadow rounded"
                                                }
                                                name={""}
                                                dropdownOptions={[
                                                    {
                                                        label: "Monthly",
                                                        value: "monthly",
                                                    },
                                                    {
                                                        label: "Yearly",
                                                        value: "yearly",
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="w-full grid grid-cols-[1fr_1fr_1fr_0.5fr] my-3 px-4">
                                        <div className=" flex items-center justify-start text-xs font-rocGroteskMedium text-gun-metal">
                                            Jan 2, 2023
                                        </div>
                                        <div className=" flex items-center justify-start text-xs font-rocGroteskMedium text-gun-metal">
                                            Standard plan (yearly)
                                        </div>

                                        <div className="capitalize flex gap-2 items-center justify-start text-xs font-rocGroteskMedium text-gun-metal">
                                            <span
                                                className={`material-icons text-[8px] text-[#00DB8F]`}
                                            >
                                                fiber_manual_record
                                            </span>
                                            <span className="text-inherit">Paid</span>
                                        </div>

                                        <div className=" flex items-center justify-center text-xs font-rocGroteskMedium text-gun-metal">
                                            <Dropdown
                                                value={""}
                                                dropdown={
                                                    <span className="material-icons text-base">
                                                        more_vert
                                                    </span>
                                                }
                                                dropdownContainerClasses={
                                                    "left-[-70px] shadow-dropdownShadow rounded"
                                                }
                                                name={""}
                                                dropdownOptions={[
                                                    {
                                                        label: "Monthly",
                                                        value: "monthly",
                                                    },
                                                    {
                                                        label: "Yearly",
                                                        value: "yearly",
                                                    },
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        </div>
                    </div>
                    {endSubscriptionModal && (
                        <ModalContainer
                            showCloseIcon={false}
                            tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                            closeModal={() => {
                                setEndSubscriptionModal(false);
                            }}
                        >
                            <div className="bg-white rounded-lg shadow-modalShadow">
                                <div className="px-4 pt-8">
                                    <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                        End subscription?
                                    </p>
                                    <p className="text-sm text-center font-rocGroteskRegular text-gun-metal">
                                        Are you sure you want to end your current subscription?
                                        <br />
                                        This action will end your subscription and remove access to
                                        features associated with it.
                                    </p>
                                </div>
                                <div className="flex pt-[42px]">
                                    <button
                                        type="button"
                                        className={`uppercase rounded-t-none rounded-br-none w-full text-mvx-neutral text-sm font-rocGroteskMedium flex items-center justify-center bg-white py-6 border px-3`}
                                        onClick={() => {
                                            setEndSubscriptionModal(false);
                                        }}
                                    >
                                        cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            dispatch(subscriptionActions.endSubscription());
                                        }}
                                        className={`uppercase rounded-t-none rounded-bl-none w-full text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-6 border-y px-3`}
                                    >
                                        {endSubscriptionLoading ? (
                                            <Loader color="gun-metal" />
                                        ) : (
                                            <p className="text-inherit">Yes, end</p>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </ModalContainer>
                    )}
                </>
            )}
        </div>
    );
};

export default BillingAndSubscription;
