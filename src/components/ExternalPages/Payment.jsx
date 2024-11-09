import Loader from "components/common/Loader";
import config from "config/config";
import { formatMoney, formatMoneyDisplay } from "helpers/formatMoney";
import { getCurrencyFromCurrencyCode } from "helpers/getCurrency";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import InvalidPaymentLink from "./common/InvalidPaymentLink";
import ModalContainer from "components/common/ModalContainer";
import _ from "lodash";
import { usePaystackPayment } from "react-paystack";
import { useMutation, useQuery } from "@tanstack/react-query";
import { paymnentService } from "services";
import { paymentConstants } from "constants";
import { IoIosLock } from "react-icons/io";
import Button from "components/common/Button";

const Payment = () => {
    const [paymentConfig, setPaymentConfig] = useState({});
    const { paymentId } = useParams();
    const [openPaymentTimeline, setOpenPaymentTimeline] = useState(false);
    const [openPaymentMethodModal, setOpenPaymentMethodModal] = useState(false);
    const { data, isPending, isError } = useQuery({
        queryKey: [paymentId, paymentConstants.FETCH_PAYMENT_DATA],
        queryFn: () => paymnentService.fetchPaymentData(paymentId),
    });
    const { mutate, isPending: configLoading } = useMutation({
        mutationFn: (data) => paymnentService.getPaystackConfig(data),
    });
    const paymentData = data?.data?.data ?? {};
    const currency = paymentData?.amount?.currency;
    const transactionFee = Number(paymentData?.transactionFee?.value || 0);
    const amount = Number(paymentData?.amount?.value || 0);
    const totalFee = amount + transactionFee;
    const initializePaystack = usePaystackPayment(paymentConfig);
    const navigate = useNavigate();
    const ref = useRef(null);

    useEffect(() => {
        if (paymentConfig?.reference) {
            initializePaystack(
                () => {
                    setPaymentConfig({});
                    navigate(`/payment-success/${paymentId}`);
                },
                () => {
                    setPaymentConfig({});
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentConfig]);

    const handlePayNow = () => {
        if (currency === "NGN") {
            mutate(
                { paymentType: "invoice", invoiceId: paymentId },
                {
                    onSuccess: (data) => {
                        setPaymentConfig({
                            ...data?.data,
                            publicKey: config.PUBLIC_PAYSTACK_API_KEY,
                        });
                    },
                }
            );
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target) && openPaymentTimeline) {
                setOpenPaymentTimeline(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, openPaymentTimeline]);

    if (isPending) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="h-screen">
            {paymentData?.paymentStatus === "paid" ||
            paymentData?.paymentStatus === "payout-completed" ? (
                <InvalidPaymentLink />
            ) : paymentData === "undefined" || isError ? (
                <InvalidPaymentLink error={true} />
            ) : (
                <div
                    className={`relative w-screen h-screen overflow-hidden max-sm:h-full max-sm:overflow-y-auto ${
                        openPaymentTimeline && "!h-screen !overflow-hidden"
                    }`}
                >
                    <div className="w-full h-full flex max-sm:flex-col">
                        <div className="w-1/2 flex-shrink-0 bg-[#FAFBFC] max-sm:w-full max-sm:mb-6 max-sm:pt-8 flex items-center justify-center">
                            <div className="w-[60%] max-lg:w-[85%] ">
                                <div className="max-sm:flex max-sm:flex-col items-center">
                                    <img
                                        src={paymentData?.freightForwarder?.profile?.logo}
                                        className="w-[60px] h-[60px] rounded border mb-4"
                                        alt="logo"
                                    />
                                    <p className="font-rocGroteskMedium max-sm:text-center text-[20px] capitalize">
                                        {paymentData?.freightForwarder?.profile?.businessName}
                                    </p>
                                    <p
                                        onClick={() => setOpenPaymentTimeline(true)}
                                        className="flex items-center cursor-pointer max-sm:text-center text-base  font-rocGroteskMedium"
                                    >
                                        <span className="underline text-mvx-neutral">
                                            View payment timeline
                                        </span>
                                        <span className="material-icons text-base text-mvx-neutral">
                                            navigate_next
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 my-7 max-sm:mt-8">
                                    <div className="flex justify-between text-sm">
                                        <p className="w-1/2 text-mvx-neutral">Origin</p>
                                        <p className="font-rocGroteskMedium text-right text-gun-metal">
                                            {paymentData?.shipment?.origin?.address}
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="w-1/2 text-mvx-neutral">Destination</p>
                                        <p className="w-1/2 text-right font-rocGroteskMedium text-gun-metal">
                                            {paymentData?.shipment?.destination?.address}
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="w-1/2 text-mvx-neutral">Package type</p>
                                        <p className="capitalize w-1/2 text-right font-rocGroteskMedium text-gun-metal">
                                            {paymentData?.shipment?.packageType}
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="w-1/2 text-mvx-neutral">Shipment ID</p>
                                        <p className="w-1/2 text-right font-rocGroteskMedium underline text-gun-metal">
                                            TA{paymentData?.shipment?.mvxid}
                                        </p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <p className="w-1/2 text-mvx-neutral">Status</p>
                                        <div className="flex items-center w-1/2 justify-end">
                                            <span className="material-icons text-[8px] mr-2 text-[#00DB8F]">
                                                fiber_manual_record
                                            </span>
                                            <p className="capitalize font-rocGroteskMedium text-gun-metal">
                                                {paymentData?.shipment?.currentStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-16">
                                    <p className="font-rocGroteskRegular text-mvx-neutral text-sm">
                                        {_.truncate(paymentData?.note, {
                                            length: 650,
                                        })}
                                    </p>
                                </div>
                                <div className="flex justify-between gap-6 max-sm:hidden">
                                    <Link
                                        to={"mailto:hello@fleetplus.io"}
                                        className="text-sm font-rocGroteskMedium underline text-gun-metal"
                                    >
                                        Contact Support
                                    </Link>
                                    <Link
                                        to={`/request-quote/${paymentData?.freightForwarderId}`}
                                        className="text-sm font-rocGroteskMedium underline text-mvx-neutral"
                                    >
                                        Request a Quote
                                    </Link>
                                    <Link
                                        to={`/search-tracking-number/${paymentData?.freightForwarderId}`}
                                        className="text-sm font-rocGroteskMedium underline text-mvx-neutral"
                                    >
                                        Track a shipment
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 h-full bg-white flex-shrink-0 flex items-center flex-col justify-center px-10">
                            <div className="max-w-[460px] w-full p-6 bg-white shadow-paymentCardShadow rounded-lg">
                                <h1 className="font-rocGroteskBold text-midnight-black text-[32px]">
                                    <span className="text-xl font-rocGroteskBold text-midnight-black">
                                        {getCurrencyFromCurrencyCode(currency)}
                                    </span>
                                    {`${formatMoneyDisplay(Number(totalFee))}`}
                                </h1>
                                <div className="my-7">
                                    <div className="flex justify-between items-center">
                                        <h1 className="font-rocGroteskMedium text-sm text-midnight-black">
                                            Total amount in {currency}
                                        </h1>
                                        <h2 className="font-rocGroteskMedium text-sm text-midnight-black">
                                            {formatMoneyDisplay(amount)}
                                        </h2>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <h1 className="font-rocGroteskMedium text-sm text-midnight-black">
                                            Fleet+ platform fee
                                        </h1>
                                        <h2 className="font-rocGroteskMedium text-sm text-midnight-black">
                                            {`${getCurrencyFromCurrencyCode(
                                                currency
                                            )}${formatMoneyDisplay(transactionFee)}`}
                                        </h2>
                                    </div>
                                </div>
                                <Button
                                    onClick={handlePayNow}
                                    isLoading={configLoading}
                                    title="Pay now"
                                    className="h-[50px] !bg-pacific-cyan font-rocGroteskMedium !text-sm !text-white"
                                />
                            </div>
                            <div className="flex items-center justify-center mt-8">
                                <IoIosLock fill="" className="w-3.5 h-3.5 mb-1 mr-1.5" />
                                <p className="text-sm text-midnight-black font-rocGroteskMedium">
                                    Powered by
                                </p>
                                <img src="/logo.svg" alt="Fleet+" className="w-5 h-5 ml-2" />
                                <p className="text-base text-midnight-black font-rocGroteskMedium ml-1">
                                    Fleet +
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={ref}
                        className={`absolute bg-white right-0 top-0 ${
                            openPaymentTimeline ? "w-[26%] max-xl:w-[40%] max-sm:w-full" : "w-[0%]"
                        } transition-all border-l h-full`}
                    >
                        <div className="px-6 py-4 flex justify-between border-b">
                            <p className="font-rocGroteskBold text-base">Payment Timeline</p>
                            <span
                                className="material-icons text-xl cursor-pointer"
                                onClick={() => setOpenPaymentTimeline(false)}
                            >
                                close
                            </span>
                        </div>
                        <div className="p-6">
                            <div
                                className={`${
                                    paymentData?.stats && paymentData?.stats?.length > 0 && "mb-8"
                                }`}
                            >
                                {paymentData?.stats?.map((amount) => {
                                    return (
                                        <div key={amount?._id} className="mb-6">
                                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                <span className="text-base text-inherit">
                                                    {getCurrencyFromCurrencyCode(amount?._id)}
                                                </span>
                                                <span className="text-[24px] text-inherit">
                                                    {String(amount?.total)?.split(".")?.[0]}
                                                </span>
                                                <span className="text-base text-inherit">
                                                    .
                                                    {String(amount?.total)?.split(".")?.[1]
                                                        ? String(amount?.total)?.split(".")?.[1]
                                                        : "00"}
                                                </span>
                                            </p>
                                            <p className="text-sm font-rocGroteskMedium text-gun-metal">
                                                Total amount paid in {amount?._id}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <>
                                {paymentData?.tx?.map((item, idx) => (
                                    <div key={item?._id}>
                                        <div className="flex gap-4">
                                            <span className="material-icons text-base text-[#C1C7D0]">
                                                check_circle
                                            </span>
                                            <div className="text-xs">
                                                <p className="font-rocGroteskMedium text-mvx-black">
                                                    Payment{" "}
                                                    {item?.paymentStatus === "pending"
                                                        ? "pending"
                                                        : "successful"}{" "}
                                                    {getCurrencyFromCurrencyCode(
                                                        item?.amount?.currency
                                                    )}
                                                    {formatMoney().format(item?.amount?.value)}
                                                </p>
                                                <p className="font-rocGroteskMedium text-mvx-neutral">
                                                    {moment(item?.createdAt).format(
                                                        "MMMM DD, YYYY hh:mm A"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        {paymentData?.tx?.length !== idx + 1 && (
                                            <div className="border-l h-[42px] w-fit mt-[-9px] ml-2"></div>
                                        )}
                                    </div>
                                ))}
                            </>
                        </div>
                    </div>
                </div>
            )}

            {openPaymentMethodModal && (
                <ModalContainer
                    showCloseIcon={false}
                    tailwindClassName="w-[30%] max-lg:w-1/2 max-sm:w-full max-sm:absolute max-sm:bottom-0"
                    closeModal={() => {
                        setOpenPaymentMethodModal(false);
                    }}
                >
                    <div className="bg-white rounded-lg shadow-modalShadow">
                        <div className="px-6 py-6">
                            <p className="text-[18px] text-center mb-2 font-rocGroteskBold text-gun-metal">
                                Select a Payment Method
                            </p>
                            <p className="text-sm text-center font-rocGroteskRegular text-gun-metal px-6 mb-6">
                                You can make payment for your shipment with any of the displayed
                                currency.
                            </p>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currency?.toLowerCase() === "ngn") {
                                            handlePayNow();
                                        } else {
                                            console.log("open usd payment gate");
                                        }
                                        setOpenPaymentMethodModal(false);
                                    }}
                                    className={`w-full mb-2 text-white text-sm font-rocGroteskMedium flex items-center justify-center bg-pacific-cyan rounded py-3 px-6`}
                                >
                                    Pay with
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (paymentData?.amount?.currency === "ngn") {
                                            handlePayNow();
                                        } else {
                                            console.log("open usd payment gate");
                                        }
                                        setOpenPaymentMethodModal(false);
                                    }}
                                    className={`w-full mb-2 text-gun-metal text-sm font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue rounded py-3 px-6`}
                                >
                                    Pay with {paymentData?.amount?.currency}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}
        </div>
    );
};

export default Payment;
