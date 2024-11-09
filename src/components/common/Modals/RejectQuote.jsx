import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import React, { useState } from "react";
import { object, string } from "yup";
import ModalWrapper from "./ModalWrapper";
import Button from "../Button";
import { quoteService } from "services";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import { quoteConstants } from "constants";

const RejectQuoteModal = ({ isOpen, onClose, quoteId, quote }) => {
    const [step, setStep] = useState(1);
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: (data) => quoteService.updateInternalQuoteStatus(quoteId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [quoteConstants.FETCHING_APPROVAL_QUOTES_REQUEST],
            });
            setStep(2);
        },
    });

    const { isValid, getFieldProps, handleSubmit } = useFormik({
        initialValues: {
            message: "",
        },
        validateOnMount: true,
        validationSchema: object({
            message: string().required("Message is required"),
        }),
        onSubmit: (values) => {
            mutate({ ...values, status: "rejected" });
        },
    });

    return (
        <ModalWrapper closeModal={onClose} isOpen={isOpen}>
            <>
                {step === 1 && (
                    <div className="bg-white rounded-lg shadow-modalShadow w-[430px]">
                        <div className="p-6">
                            <p className="font-rocGroteskBold text-[18px] text-gun-metal">
                                Reason for Rejection
                            </p>
                            <p className="text-mvx-neutral font-rocGroteskMedium text-sm">
                                Kindly state why you are rejecting this quote.
                            </p>
                        </div>
                        <div className="mx-6 mb-6">
                            <textarea
                                className="w-full p-3 rounded border-neutral-n-40 bg-white border font-rocGroteskMedium h-[100px] resize-none"
                                placeholder="Leave your feedback"
                                {...getFieldProps("message")}
                            />
                        </div>
                        <div className="grid grid-cols-2 border-t uppercase items-stretch h-[56px]">
                            <button
                                className="bg-white w-full text-[13px] font-rocGroteskMedium text-gun-metal"
                                onClick={onClose}
                            >
                                NO, CANCEL
                            </button>

                            <Button
                                disabled={!isValid}
                                isLoading={isPending}
                                className="bg-mvx-light-blue text-[13px] font-rocGroteskMedium text-gun-metal"
                                title="YES, REJECT"
                                onClick={handleSubmit}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="w-[430px] bg-white rounded-lg shadow-modalShadow">
                            <div className="pt-8 pb-6 px-7">
                                <img src={successImg} alt="success" className="mb-4 m-auto" />
                                <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                    Quote Rejected!
                                </p>
                                <p className="text-sm text-center font-rocGrotesk text-gun-metal">
                                    {`You have rejected the quote for
                                    Shipment No. ${quote?.shipment?.mvxid}`}
                                </p>
                            </div>
                            <button
                                className="w-full bg-mvx-light-blue text-sm py-4 font-rocGroteskMedium text-gun-metal"
                                onClick={onClose}
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </>
        </ModalWrapper>
    );
};

export default RejectQuoteModal;
