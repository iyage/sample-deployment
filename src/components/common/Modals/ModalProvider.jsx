import React, { createContext, useContext, useState } from "react";
import { useMemo } from "react";
import { useToggle } from "usehooks-ts";
import ApproveOrRejectQuote from "./ApproveOrRejectQuote";
import RejectQuoteModal from "./RejectQuote";
import UploadShipmentDocument from "./UploadShipmentDocument";
import CancelPaymentLink from "./CancelPaymentLink";
import CreateQuote from "../CreateQuote";
import GeneratePaymentLink from "./GeneratePaymentLink";

const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState(null);
    const [data, setData] = useState({});
    const [isOpen, toggleOpen, setOpen] = useToggle(false);

    const openModal = (modalName, dataDetails) => {
        setModal(modalName);
        setData(dataDetails);
        setOpen(true);
    };

    const closeModal = () => {
        setModal(null);
        setData({});
        setOpen(false);
    };

    const getActiveModal = () => {
        switch (modal) {
            case "approve-quote":
                return (
                    <ApproveOrRejectQuote
                        isOpen={isOpen}
                        onClose={closeModal}
                        quoteId={data?.quoteId}
                        quote={data?.quote}
                        type={data?.type}
                    />
                );
            case "reject-quote":
                return (
                    <RejectQuoteModal
                        isOpen={isOpen}
                        onClose={closeModal}
                        quoteId={data?.quoteId}
                        quote={data?.quote}
                    />
                );
            case "upload-shipment-document":
                return (
                    <UploadShipmentDocument
                        isOpen={isOpen}
                        onClose={closeModal}
                        shipmentId={data?.shipmentId}
                    />
                );
            case "cancel_invoice":
                return (
                    <CancelPaymentLink
                        isOpen={isOpen}
                        onClose={closeModal}
                        invoiceId={data?.invoiceId}
                        invoiceNo={data?.invoiceNo}
                    />
                );
            case "create_quote":
                return (
                    <CreateQuote
                        isOpen={isOpen}
                        onClose={closeModal}
                        directStepNo={data?.directStepNo}
                        forCustomer={data?.forCustomer}
                        instantQuoteId={data?.instantQuoteId}
                    />
                );
            case "generate_payment_link":
                return (
                    <GeneratePaymentLink
                        isOpen={isOpen}
                        onClose={closeModal}
                        invoiceType={data?.invoiceType}
                        quoteId={data?.quoteId}
                        shipmentId={data?.shipmentId}
                    />
                );

            default:
                break;
        }
    };

    const value = useMemo(
        () => ({
            data,
            modal,
            isOpen,
            openModal,
            closeModal,
            getActiveModal,
            toggleOpen,
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data, modal, isOpen]
    );

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

const useModal = () => useContext(ModalContext);

export default useModal;
