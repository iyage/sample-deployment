import React, { useEffect } from "react";
import successImg from "assets/images/externalPages/waitlist-success.svg";

import { useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import millify from "millify";
import { getCurrencyFromCurrencyCode } from "helpers/getCurrency";
import Navbar from "components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { paymentActions } from "actions";
import Loader from "components/common/Loader";
import { formatMoney } from "helpers/formatMoney";
import InvalidPaymentLink from "./common/InvalidPaymentLink";
import ReceiptDoc from "./common/DownloadablePdfs/ReceiptDoc";

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const { paymentId } = useParams();
    const dispatch = useDispatch();
    const { fetchingPaymentData, paymentData } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(paymentActions.fetchPaymentData(paymentId));
    }, [paymentId, dispatch]);

    if (fetchingPaymentData || !paymentData) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <Navbar />
            {paymentData?.data?.paymentStatus === "paid" ||
            paymentData?.data?.paymentStatus === "payout-completed" ? (
                <InvalidPaymentLink />
            ) : (
                <>
                    <div className="relative">
                        <div className="flex justify-center">
                            <div className="w-[32%] max-sm:w-[90%] max-xl:w-[60%] border shadow-[4px_4px_0px_#ECECEC] mt-[59px] ">
                                <div className="p-8 bg-[#FAFBFC] ">
                                    <img src={successImg} alt="success" className="mb-6 m-auto" />
                                    <div className="text-center text-mvx-black">
                                        <p className="text-2xl font-rocGroteskBold mb-2">
                                            Payment Successful!
                                        </p>
                                        <p className="text-sm font-rocGroteskMedium ">
                                            Woohoo! Your payment was successful.
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pt-6 pb-8">
                                    <div className="text-center text-mvx-black mb-6 font-rocGroteskBold">
                                        <p className="text-sm mb-1">Amount</p>
                                        <p className="text-4xl">
                                            <span>
                                                {getCurrencyFromCurrencyCode(
                                                    paymentData?.data?.amount?.currency
                                                )}
                                                {String(paymentData?.data?.amount?.value)?.length >
                                                6
                                                    ? millify(
                                                          paymentData?.data?.amount?.value?.toFixed(
                                                              2
                                                          ),
                                                          {
                                                              precision: 3,
                                                              lowercase: true,
                                                          }
                                                      )
                                                    : formatMoney().format(
                                                          paymentData?.data?.amount?.value?.toFixed(
                                                              2
                                                          )
                                                      )}
                                            </span>{" "}
                                            <span className="text-xl">
                                                {paymentData?.data?.amount?.currency}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="font-rocGroteskMedium text-mvx-neutral text-sm mb-8">
                                        <div className="flex justify-between pb-3 border-b">
                                            <p>Invoice number</p>
                                            <p>{paymentData?.data?.mvxid}</p>
                                        </div>
                                        <div className="flex justify-between pt-3">
                                            <p>Payment date</p>
                                            <p>{moment().format("MMM DD, YYYY")}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <button
                                            type="button"
                                            className={`w-full text-white text-sm font-rocGroteskMedium flex items-center justify-center bg-pacific-cyan py-3 px-6`}
                                            onClick={() => navigate(`/receipt/${paymentId}`)}
                                        >
                                            View receipt details
                                        </button>
                                        <PDFDownloadLink
                                            document={
                                                <ReceiptDoc
                                                    receiptNo={paymentData?.data?.mvxid}
                                                    dateOfIssue={moment().format("MMM DD, YYYY")}
                                                    email={
                                                        paymentData?.data?.freightForwarder?.profile
                                                            ?.email
                                                    }
                                                    creatorName={
                                                        paymentData?.data?.freightForwarder?.profile
                                                            ?.businessName
                                                    }
                                                    recipientName={
                                                        paymentData?.data?.shipment?.shipperDetails
                                                            ?.fullName
                                                    }
                                                    pickupAddress={
                                                        paymentData?.data?.shipment?.origin?.address
                                                    }
                                                    destinationAddress={
                                                        paymentData?.data?.shipment?.destination
                                                            ?.address
                                                    }
                                                    amount={formatMoney().format(
                                                        paymentData?.data?.amount?.value?.toFixed(2)
                                                    )}
                                                    currency={paymentData?.data?.amount?.currency}
                                                    shipmentId={
                                                        "TA" + paymentData?.data?.shipment?.mvxid
                                                    }
                                                    logo={
                                                        paymentData?.data?.freightForwarder?.profile
                                                            ?.logo
                                                    }
                                                />
                                            }
                                            fileName="receipt.pdf"
                                        >
                                            {({ loading }) => {
                                                return (
                                                    <button
                                                        type="button"
                                                        className={`w-full text-mvx-black text-sm font-rocGroteskMedium border flex items-center justify-center bg-white py-3 px-6`}
                                                    >
                                                        {loading
                                                            ? "Loading..."
                                                            : "Download Invoice"}
                                                    </button>
                                                );
                                            }}
                                        </PDFDownloadLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentSuccess;
