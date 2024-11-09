import React from "react";
import ModalWrapper from "./ModalWrapper";
import Button from "../Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymnentService } from "services";
import { shipmentConstants } from "constants";

const CancelPaymentLink = ({ isOpen, onClose, invoiceId, invoiceNo }) => {
    const queryClient = useQueryClient();
    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: (data) => paymnentService.cancelPaymentLink(data),
        onSuccess: () => {
            queryClient.invalidateQueries([shipmentConstants.FETCH_SHIPMENT_INVOICES]);
        },
    });

    return (
        <ModalWrapper closeModal={onClose} isOpen={isOpen} tailwindClassName="w-full">
            {!isSuccess && (
                <div className="bg-white w-[420px] mx-auto rounded-lg shadow-modalShadow">
                    <div className="py-6">
                        <h1 className="text-center mb-2 font-rocGroteskBold text-xl text-midnight-black">
                            Cancel this payment link?
                        </h1>
                        <p className="text-midnight-black font-rocGroteskMedium text-sm mx-auto w-[272px] text-center">
                            Are you sure you want to cancel this payment link?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 border-t border-[#EBF0F8]">
                        <button
                            className="bg-white w-full text-xs font-rocGroteskMedium text-mvx-black text-center py-[18px] border-r border-[#EBF0F8] rounded-none"
                            onClick={onClose}
                        >
                            NO, DON'T CANCEL
                        </button>
                        <Button
                            isLoading={isPending}
                            onClick={() => {
                                mutate({
                                    invoiceId,
                                    status: "cancelled",
                                });
                            }}
                            title="YES, CANCEL LINK"
                            className="text-xs bg-[#F6F7FB] text-midnight-black font-rocGroteskMedium rounded-none"
                        />
                    </div>
                </div>
            )}
            {isSuccess && (
                <div className="w-[420px] mx-auto rounded-lg shadow-modalShadow bg-white">
                    <div className="pt-8 pb-6 px-7">
                        <img src="/img/success.svg" alt="success" className="mb-4 m-auto" />
                        <p className="text-[22px] text-center mb-3 font-rocGroteskBold text-gun-metal">
                            Invoice Cancelled!
                        </p>
                        <p className="text-sm text-center font-rocGrotesk text-gun-metal">
                            {`You have cancelled the invoice no. ${invoiceNo}`}
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
        </ModalWrapper>
    );
};

export default CancelPaymentLink;
