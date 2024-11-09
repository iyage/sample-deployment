import { useMutation } from "@tanstack/react-query";
import AmountInputWithCurrencySelect from "components/common/AmountInputWithCurrencySelect";
import Button from "components/common/Button";
import FormWrapper from "components/common/FormWrapper";
import Modal from "components/common/Modals/Modal";
import config from "config/config";
import { ErrorMessage, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useSelector } from "react-redux";
import { settingsService } from "services/settingsService";
import { number, object, string } from "yup";

const FundWalletModal = ({ show, onClose, walletId }) => {
    const { ffProfile } = useSelector((state) => state.auth);
    const [paymentConfig, setPaymentConfig] = useState({});
    const { isPending, mutate } = useMutation({
        mutationFn: (data) => settingsService.fundWallet(data),
    });
    const [paymentState, setPaymentState] = useState("initial");
    const initializePaystack = usePaystackPayment(paymentConfig);

    const form = useFormik({
        initialValues: {
            currency: "NGN",
            amount: "",
            walletId,
        },
        validateOnBlur: true,
        validateOnMount: true,
        enableReinitialize: true,
        validationSchema: object({
            amount: number()
                .positive("Please enter a valid amount")
                .min(1)
                .required("Please enter a valid amount")
                .typeError("Please enter a valid amount"),
            walletId: string().required("Please enter a valid wallet id"),
        }),
        onSubmit: (values) => {
            mutate(
                {
                    walletId: values?.walletId,
                    amount: values?.amount,
                },
                {
                    onSuccess: (data) => {
                        setPaymentState("pending");
                        setPaymentConfig({
                            email: ffProfile?.result?.email || "",
                            amount: (parseFloat(values?.amount) * 100).toFixed(2),
                            reference: data?.data?.transaction?.reference ?? "",
                            publicKey: config.PUBLIC_PAYSTACK_API_KEY,
                            metadata: {
                                paymentType: "deposit",
                                paymentFor: "wallet",
                                walletId: data?.data?.transaction?.walletId,
                                transactionId: data?.data?.transaction?.transactionId,
                            },
                        });
                    },
                }
            );
        },
    });

    useEffect(() => {
        if (paymentConfig?.reference) {
            initializePaystack(
                () => {
                    setPaymentState("success");
                    setPaymentConfig({});
                },
                () => {
                    setPaymentState("failed");
                    setPaymentConfig({});
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentConfig]);

    return (
        <Modal show={show && !!walletId} onClose={() => onClose?.()}>
            <div className="w-[420px] mx-auto bg-white shadow-modalShadow rounded">
                {paymentState === "initial" && (
                    <>
                        <div className="p-6">
                            <h1 className="text-midnight-black font-rocGroteskBold text-lg">
                                Fund Wallet
                            </h1>
                            <h2 className="text-sm text-mvx-neutral font-rocGroteskMedium mb-6">
                                Fund your Fleet+ account
                            </h2>
                            <FormWrapper form={form}>
                                <>
                                    <AmountInputWithCurrencySelect
                                        label="Amount"
                                        amountValue={form?.values?.amount}
                                        amountOnChange={(amt) => {
                                            form?.setFieldValue("amount", amt, true);
                                            form.setFieldTouched("amount", true, true);
                                        }}
                                        currencyOnChange={(cur) =>
                                            form.setFieldValue("currency", cur, true)
                                        }
                                        currencyValue={form.values?.currency}
                                        allowedCurrencies={[{ value: "NGN", label: "NGN" }]}
                                    />
                                    <ErrorMessage name="amount">
                                        {(msg) => (
                                            <span className="text-red-600 text-[12px] font-rocGroteskRegular">
                                                {msg}
                                            </span>
                                        )}
                                    </ErrorMessage>
                                </>
                            </FormWrapper>
                        </div>
                        <div className="w-full grid grid-cols-2 border-t uppercase h-[56px]">
                            <button
                                className="bg-white w-full text-[13px] font-rocGroteskMedium text-gun-metal"
                                onClick={onClose}
                            >
                                CLOSE
                            </button>

                            <Button
                                disabled={!form.isValid}
                                isLoading={isPending || paymentState === "pending"}
                                className="bg-mvx-light-blue text-[13px] font-rocGroteskMedium text-gun-metal"
                                title="FUND"
                                onClick={form.handleSubmit}
                            />
                        </div>
                    </>
                )}
                {paymentState === "success" && (
                    <>
                        <div className="w-full flex flex-col items-center justify-center pt-8 px-6">
                            <img src="/img/success.svg" alt="/success" />
                            <h1 className="mt-4 mb-3 text-center text-gun-metal text-xl font-rocGroteskBold">
                                Transaction Successful!
                            </h1>
                            <p className="text-center mb-4 text-mvx-gray font-rocGrotesk text-sm">
                                Your deposit is currently being processed and your wallet is
                                expected to be credited within 5 minutes, subject to notification by
                                the bank
                            </p>
                        </div>
                        <div
                            className="w-full bg-neutral-n-20 text- border-t border-neutral-n2-30 py-4 rounded-b text-center font-rocGroteskMedium text-xs text-midnight-black cursor-pointer"
                            onClick={() => onClose?.()}
                        >
                            CLOSE
                        </div>
                    </>
                )}
                {paymentState === "failed" && (
                    <>
                        <div className="w-full flex flex-col items-center justify-center pt-8 px-8">
                            <img src="/img/failed.svg" alt="/failed" />
                            <h1 className="mt-4 mb-3 text-center text-gun-metal text-xl font-rocGroteskBold">
                                Transaction Failed!
                            </h1>
                            <p className="text-center mb-4 text-mvx-gray font-rocGrotesk text-sm">
                                Your deposit couldn't be processed, please reach out to support if
                                the problem persists.
                            </p>
                        </div>
                        <div
                            className="w-full bg-neutral-n-20 text- border-t border-neutral-n2-30 py-4 rounded-b text-center font-rocGroteskMedium text-xs text-midnight-black cursor-pointer"
                            onClick={() => onClose?.()}
                        >
                            CLOSE
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default FundWalletModal;
