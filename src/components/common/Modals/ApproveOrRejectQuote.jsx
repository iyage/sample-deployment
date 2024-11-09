import React, { useState } from "react";
import ModalWrapper from "./ModalWrapper";
import successImg from "assets/images/externalPages/waitlist-success.svg";
import { quoteService } from "services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../Loader";
import { quoteConstants } from "constants";

const ApproveOrRejectQuote = ({ isOpen, onClose, quoteId, type, quote }) => {
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

    const accept = () => {
        mutate({ status: "accepted" });
    };

    const reject = () => {
        mutate({ status: "rejected" });
    };

    return (
        <ModalWrapper closeModal={onClose} isOpen={isOpen}>
            <>
                {step === 1 && (
                    <div className="bg-white rounded-lg shadow-modalShadow w-[430px]">
                        <div className="px-7 py-8">
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                {type === "accept"
                                    ? " Accept Approval Request?"
                                    : "Reject Approval Request?"}
                            </p>
                            <p className="text-sm text-center font-rocGrotesk text-gun-metal">
                                {type === "accept"
                                    ? "Are you sure you want to accept this approval request? You won’t be able to undo this action"
                                    : "Are you sure you want to reject this approval request? You won’t be able to undo this action"}
                            </p>
                        </div>
                        <div className="border-t flex items-stretch uppercase text-[13px] font-rocGroteskMedium text-gun-metal h-[56px]">
                            <button
                                className="bg-white w-full text-[13px] font-rocGroteskMedium text-gun-metal"
                                onClick={onClose}
                            >
                                NO, CANCEL
                            </button>
                            {isPending ? (
                                <div className="w-full bg-mvx-light-blue flex items-center justify-center cursor-not-allowed">
                                    <Loader />
                                </div>
                            ) : (
                                <button
                                    className="w-full bg-mvx-light-blue text-[13px] font-rocGroteskMedium text-gun-metal"
                                    onClick={type === "accept" ? accept : reject}
                                >
                                    {type === "accept" ? "  YES, APPROVE" : "YES, REJECT"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-[430px] bg-white rounded-lg shadow-modalShadow">
                        <div className="pt-8 pb-6 px-7">
                            <img src={successImg} alt="success" className="mb-4 m-auto" />
                            <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                                {type === "accept" ? " Quote Approved!" : "Quote Rejected!"}
                            </p>
                            <p className="text-sm text-center font-rocGrotesk text-gun-metal">
                                {type === "accept"
                                    ? `You have accepted the quote for Shipment ${quote?.shipment?.mvxid}`
                                    : `You have rejected the quote for Shipment ${quote?.shipment?.mvxid}`}
                            </p>
                        </div>
                        <button
                            className="w-full bg-mvx-light-blue text-sm py-4 font-rocGroteskMedium text-gun-metal"
                            onClick={onClose}
                        >
                            CLOSE
                        </button>
                    </div>
                )}
            </>
        </ModalWrapper>
    );
};

export default ApproveOrRejectQuote;
