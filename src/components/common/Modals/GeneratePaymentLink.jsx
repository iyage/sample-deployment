import React, { useState } from "react";
import ModalContainer from "../ModalContainer";
import SelectInput from "../SelectInput";
import usFlag from "assets/images/dashboard/round_us_flag.svg";
import ukFlag from "assets/images/dashboard/round_uk_flag.svg";
import ngFlag from "assets/images/dashboard/round_ng_flag.svg";
import eurFlag from "assets/images/dashboard/round_eur_flag.svg";
import Button from "../Button";
import formatCurrency from "helpers/formatCurrency";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { number, object, string } from "yup";
import { getCurrencyFromCurrencyCode } from "helpers";
import { formatMoneyDisplay } from "helpers/formatMoney";
import { getTransactionFee } from "helpers/utils";
import { paymnentService } from "services";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import CustomToast from "../CustomToast";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const GeneratePaymentLink = ({
    isOpen,
    onClose,
    invoiceType = "shipment",
    quoteId = undefined,
    shipmentId = undefined,
}) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const { isValid, getFieldProps, setFieldValue, values } = useFormik({
        initialValues: {
            amount: "",
            currency: "",
            note: "",
        },
        validateOnMount: true,
        validationSchema: object({
            currency: string().required("Currency is required"),
            amount: number().required("Amount is required"),
            note: string().optional(),
        }),
        onSubmit: () => {},
    });

    const { isPending, mutate, isSuccess, data } = useMutation({
        mutationFn: (data) => paymnentService.createPaymentLink(data),
    });
    const transactionFee = getTransactionFee(values?.amount, values?.currency);

    console.log(data);
    return (
        <ModalContainer
            isOpen={isOpen}
            closeModal={onClose}
            showCloseIcon={false}
            tailwindClassName="w-full"
        >
            {!isSuccess && (
                <>
                    {step === 1 && (
                        <div className="bg-white rounded-lg shadow-modalShadow w-[420px] mx-auto">
                            <div className="px-6 pt-8">
                                <p className="text-lg mb-4 font-rocGroteskBold text-gun-metal">
                                    Generate Payment Link new
                                </p>
                                <div>
                                    <div className="mb-6">
                                        <p className="text-sm mb-1 font-rocGroteskMedium">Amount</p>
                                        <div className=" w-full">
                                            <div className="w-full">
                                                <SelectInput
                                                    value={values.currency}
                                                    name="currency"
                                                    placeholder={"USD"}
                                                    handleChange={(_, value) =>
                                                        setFieldValue("currency", value, true)
                                                    }
                                                    className={"rounded-b-none !h-[48px]"}
                                                    isRequired={true}
                                                    dropdownOptions={[
                                                        {
                                                            label: "GBP",
                                                            value: "GBP",
                                                            icon: (
                                                                <img
                                                                    src={ukFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400 flex-shrink-0"
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: "USD",
                                                            value: "USD",
                                                            icon: (
                                                                <img
                                                                    src={usFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400 flex-shrink-0"
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: "EUR",
                                                            value: "EUR",
                                                            icon: (
                                                                <img
                                                                    src={eurFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400 flex-shrink-0"
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            label: "NGN",
                                                            value: "NGN",
                                                            icon: (
                                                                <img
                                                                    src={ngFlag}
                                                                    alt="us flag"
                                                                    className="w-5 h-5 rounded-full bg-gray-400 flex-shrink-0"
                                                                />
                                                            ),
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="$0.00"
                                                className="border border-t-0 rounded-b border-gray-200 py-3 px-4 outline-0 w-full h-[48px] text-sm font-rocGroteskMedium placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                                required
                                                value={formatCurrency(values.amount)}
                                                name="amount"
                                                onChange={(event) =>
                                                    setFieldValue(
                                                        "amount",
                                                        event.target.value.replace(/,/g, ""),
                                                        true
                                                    )
                                                }
                                                pattern={"^[.,0-9]+$"}
                                                title="must be digits"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm mb-1 font-rocGroteskMedium">Notes</p>
                                        <textarea
                                            placeholder="Describe your goods"
                                            rows="4"
                                            className="border rounded border-gray-200 resize-none py-3 px-4 outline-0 w-full text-sm font-rocGroteskMedium placeholder:text-sm placeholder:font-rocGroteskMedium placeholder:text-mvx-neutral"
                                            required
                                            name="note"
                                            {...getFieldProps("note")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 pt-8">
                                <button
                                    type="button"
                                    className={`rounded-none uppercase rounded-bl-lg w-full text-mvx-neutral text-xs font-rocGroteskMedium flex items-center justify-center bg-white py-5 border px-3`}
                                    onClick={onClose}
                                >
                                    cancel
                                </button>
                                <Button
                                    disabled={!isValid}
                                    onClick={() => setStep(2)}
                                    title="preview payment link"
                                    className="rounded-none rounded-br-lg text-xs bg-mvx-light-blue text-gun-metal font-rocGroteskMedium uppercase"
                                />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="mx-auto shadow-modalShadow w-[420px] rounded bg-white">
                            <div className="px-6 py-8">
                                <h1 className="font-rocGroteskBold text-lg text-midnight-black mb-6">
                                    Preview Payment Details
                                </h1>
                                <div className="my-6 border-b border-[#DBE2ED]">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-neutral-n-300 font-rocGroteskMedium text-sm">
                                            Payment amount
                                        </p>

                                        <p className="text-midnight-black font-rocGroteskMedium text-sm">
                                            {`${getCurrencyFromCurrencyCode(
                                                values?.currency
                                            )}${formatMoneyDisplay(values?.amount)}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mb-6">
                                        <p className="text-neutral-n-300 font-rocGroteskMedium text-sm">
                                            Transaction Fee
                                        </p>

                                        <p className="text-midnight-black font-rocGroteskMedium text-sm">
                                            {`${getCurrencyFromCurrencyCode(
                                                values?.currency
                                            )}${formatMoneyDisplay(transactionFee?.value)}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-neutral-n-300 font-rocGroteskMedium text-sm">
                                        Total amount
                                    </p>

                                    <p className="font-rocGroteskBold text-2xl text-midnight-black">
                                        <span className="text-base font-rocGroteskBold text-midnight-black">
                                            {getCurrencyFromCurrencyCode(values?.currency)}
                                        </span>
                                        {`${formatMoneyDisplay(
                                            Number(transactionFee?.value) + Number(values?.amount)
                                        )}`}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 border-t border-neutral-n2-30">
                                <div
                                    className="h-[50px] flex items-center justify-center text-midnight-black font-rocGroteskMedium text-xs border-r border-neutral-n2-30"
                                    onClick={() => setStep(1)}
                                >
                                    CANCEL
                                </div>
                                <Button
                                    isLoading={isPending}
                                    onClick={() =>
                                        mutate({
                                            invoiceType,
                                            quoteId,
                                            shipmentId,
                                            amount: {
                                                currency: values?.currency,
                                                value: values?.amount,
                                            },
                                        })
                                    }
                                    title="Create payment link"
                                    className="uppercase bg-neutral-n2-20 text-midnight-black font-rocGroteskMedium text-xs"
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
            {isSuccess && (
                <div className="mx-auto bg-white w-[420px] shadow-modalShadow">
                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <img src={successImg} alt="success" className="mb-6 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                Payment link generated!
                            </p>
                            <p className="text-sm text-center text-gun-metal px-6">
                                Share your payment link with your customer and start receiving local
                                and international payments.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                className={` rounded w-full text-sm text-white font-rocGroteskMedium flex items-center justify-center bg-pacific-cyan py-3 px-3`}
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        `https:${
                                            process.env.REACT_APP_STAGE === "production"
                                                ? "fleetplus.io"
                                                : "dev.mcb.mvxchange.com"
                                        }/payment/${data?.data?.data?._id}`
                                    );
                                    toast.custom((t) => (
                                        <CustomToast
                                            t={t}
                                            message={"Payment Link Copied"}
                                            type="success"
                                        />
                                    ));
                                }}
                            >
                                Share link with customer
                            </button>
                            <button
                                type="button"
                                className={` rounded w-full text-sm text-gun-metal font-rocGroteskMedium flex items-center justify-center bg-mvx-light-blue py-3 px-3`}
                                onClick={() => {
                                    navigate(`/payment/${data?.data?.data?._id}`);
                                    onClose?.();
                                }}
                            >
                                Preview link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContainer>
    );
};

export default GeneratePaymentLink;
