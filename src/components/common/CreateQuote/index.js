/* eslint-disable no-unused-vars */
import { quoteActions, shipmentActions } from "actions";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CustomToast from "components/common/CustomToast";
import Loader from "../Loader";
import ModalContainer from "components/common/ModalContainer";
import CreateToCustomer from "./CreateToCustomer";
import CreateToPartner from "./CreateToPartner";
import { useNavigate } from "react-router-dom";

const CreateQuote = ({ directStepNo, forCustomer, instantQuoteId, isOpen, onClose }) => {
    const [quoteForCustomer, setQuoteForCustomer] = useState(forCustomer ?? true);
    const [searched, setSearched] = useState(false);
    const [step, setStep] = useState(directStepNo ? directStepNo : 0);
    const [selectedId, setSelectedId] = useState("");
    const { pendingShipments, isPendingShipmentsLoading } = useSelector((state) => state.shipment);
    const dispatch = useDispatch();
    const {
        createQuoteToCustomer,
        createQuoteToCustomerLoading,
        sendQuoteReqFFLoading,
        sendQuoteReqFF,
    } = useSelector((state) => state.quote);
    const navigate = useNavigate();
    const shipments = useMemo(() => {
        const shipmentsCut = pendingShipments?.data ? [...pendingShipments.data] : [];
        if (shipmentsCut.length > 4) shipmentsCut.length = 4;
        return shipmentsCut;
    }, [pendingShipments]);

    const mvxId = shipments?.find((ship) => ship._id === selectedId)?.mvxid;

    const searchShipment = (id) => {
        const regex = /\d+/g;
        if (id) {
            if (Boolean(id.match(regex))) {
                setSearched(true);
                dispatch(
                    shipmentActions.fetchPendingShipments("pending", 1, id.match(regex).join(""))
                );
            } else {
                toast.custom((t) => (
                    <CustomToast t={t} message="Invalid shipment id" type="error" />
                ));
            }
        }
    };

    const createQuote = () => {
        if (!selectedId)
            return toast.custom((t) => (
                <CustomToast t={t} message="Please select a shipment" type="error" />
            ));

        navigate(
            Boolean(instantQuoteId)
                ? "/dashboard/create-quote/customer/" +
                      selectedId +
                      "?instantQuoteId=" +
                      instantQuoteId
                : "/dashboard/create-quote/customer/" + selectedId
        );
        onClose?.();
    };

    const completeRequest = () => {
        dispatch(quoteActions.resetSendQuoteToFF());
        onClose?.();
    };

    const globalPartnerSection = step && !quoteForCustomer;

    return (
        <>
            <ModalContainer
                isOpen={isOpen}
                closeModal={() => {
                    onClose?.();
                }}
                tailwindClassName="w-full  sm:w-[420px] max-sm:w-full max-sm:absolute max-sm:bottom-0 shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
            >
                <div className="bg-white rounded-lg overflow-hidden [&*]:font-rocGrotesk">
                    {createQuoteToCustomer || sendQuoteReqFF ? (
                        <SuccessModals completeRequest={completeRequest} mvxId={mvxId} />
                    ) : (
                        <>
                            <p
                                className={`text-[20px] font-bold text-gun-metal px-6 my-6 text-center ${
                                    globalPartnerSection && "!text-left !px-5"
                                }`}
                            >
                                {!step
                                    ? "Create a Quote"
                                    : quoteForCustomer
                                    ? "Select a shipment"
                                    : "Enter Load Details"}
                            </p>
                            {step ? (
                                <p
                                    className={`text-sm text-center -translate-y-5 ${
                                        globalPartnerSection && "!text-left mx-5"
                                    }`}
                                >
                                    {quoteForCustomer
                                        ? "Select a shipment to add your quotation"
                                        : "This is to help you get the best rates"}
                                </p>
                            ) : null}

                            {!step ? (
                                <>
                                    <p
                                        className={`flex items-center w-full text-sm cursor-pointer transition-colors duration-300 px-6 border-y-[2.3px] border-transparent py-3 hover:bg-mvx-blue/[0.03] hover:border-mvx-blue/[0.03] ${
                                            quoteForCustomer &&
                                            "bg-mvx-blue/[0.03] border-mvx-blue/[0.03]"
                                        }`}
                                        onClick={() => setQuoteForCustomer(true)}
                                    >
                                        <span className="material-icons mr-3 text-2xl">
                                            {quoteForCustomer
                                                ? "radio_button_checked"
                                                : "radio_button_unchecked"}
                                        </span>

                                        <span className="text-[#6B778C]">
                                            <span className="block font-medium mb-1 text-gun-metal">
                                                Create a quote for a customer
                                            </span>
                                            Create and send quote to customers directly
                                        </span>
                                    </p>
                                    <p
                                        className={`flex items-center w-full text-sm cursor-pointer transition-colors duration-300 px-6 border-y-[2.3px] border-transparent py-3 hover:bg-mvx-blue/[0.03] hover:border-mvx-blue/[0.03] ${
                                            !quoteForCustomer &&
                                            "bg-mvx-blue/[0.03] border-mvx-blue/[0.03]"
                                        }`}
                                        onClick={() => setQuoteForCustomer(false)}
                                    >
                                        <span className="material-icons mr-3 text-2xl">
                                            {!quoteForCustomer
                                                ? "radio_button_checked"
                                                : "radio_button_unchecked"}
                                        </span>

                                        <span className="text-[#6B778C]">
                                            <span className="block font-medium mb-1 text-gun-metal">
                                                Request a quote from a global partner to another
                                                freight forwarder
                                            </span>
                                            Check rates for your customers requirements
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <>
                                    {quoteForCustomer ? (
                                        <CreateToCustomer
                                            {...{
                                                isPendingShipmentsLoading,
                                                searchShipment,
                                                searched,
                                                selectedId,
                                                setSearched,
                                                setSelectedId,
                                                shipments,
                                            }}
                                        />
                                    ) : (
                                        <CreateToPartner searchShipment={searchShipment} />
                                    )}
                                </>
                            )}
                            <div
                                className={`flex pt-[42px] ${
                                    (isPendingShipmentsLoading ||
                                        sendQuoteReqFFLoading ||
                                        createQuoteToCustomerLoading) &&
                                    "pointer-events-none"
                                }`}
                            >
                                <button
                                    type="button"
                                    className={`w-full rounded-none border-t-2 text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 border-r px-3`}
                                    onClick={() => {
                                        directStepNo
                                            ? onClose?.()
                                            : !step && !directStepNo
                                            ? onClose?.()
                                            : setStep(0);
                                    }}
                                >
                                    {step && !directStepNo ? "GO BACK" : "CANCEL"}
                                </button>
                                <button
                                    onClick={() => {
                                        !step
                                            ? setStep(1)
                                            : quoteForCustomer
                                            ? createQuote()
                                            : document.getElementById("partner-btn").click();
                                    }}
                                    className={`border-t-2 w-full rounded-none text-gun-metal text-xs font-medium flex items-center justify-center bg-mvx-blue/[.03] py-5 border-l px-3`}
                                >
                                    {createQuoteToCustomerLoading || sendQuoteReqFFLoading ? (
                                        <Loader color="gun-metal" size={4} />
                                    ) : (
                                        <p className="text-inherit">
                                            {!step
                                                ? "CONTINUE"
                                                : globalPartnerSection
                                                ? "REQUEST QUOTE"
                                                : "CONTINUE"}
                                        </p>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </ModalContainer>
        </>
    );
};

const SuccessModals = ({ completeRequest, mvxId }) => {
    const { sendQuoteReqFF } = useSelector((state) => state.quote);
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");

    const inviteFF = false;
    const inviteFFLoading = false;

    const inviteFFReq = (evt) => {
        evt.preventDefault();
        alert("the request");
        setStep(3);
    };

    useEffect(() => {
        if (sendQuoteReqFF) {
            setStep(1);
        }
    }, [sendQuoteReqFF]);

    return (
        <>
            {sendQuoteReqFF && (
                <>
                    {step !== 2 ? (
                        <>
                            {/* <SuccessIcon className="mb-6 m-auto mt-8" /> */}
                            <img
                                src={
                                    "https://res.cloudinary.com/dvxi7qcmd/image/upload/q_80/v1687187488/Web%20App/external_pages/success_q1oaal.svg"
                                }
                                alt="success"
                                className="mb-6 m-auto mt-8"
                            />
                            <p className="text-[20px] text-center mb-3 font-semibold px-6">
                                {!step
                                    ? "Request Quote from Partners?"
                                    : step !== 3
                                    ? "Quote Requested!"
                                    : "Quote Request Sent"}
                            </p>
                            <p className="text-sm text-center px-6 mb-8 leading-[20px]">
                                {!step
                                    ? "Do you want to request a quote from a freight forwarder that already has an account on Fleet+?"
                                    : "Your quote for Shipment no. TA023 has been requested successfully. You will get an update as soon as a partner accepts your shipment request"}
                            </p>
                            <button
                                className="bg-mvx-blue/[.03] text-gun-metal border-y border-mvx-blue/[.03] text-xs w-full font-medium py-5"
                                onClick={() =>
                                    !step
                                        ? setStep(2)
                                        : step !== 3
                                        ? completeRequest()
                                        : navigate("/dashboard")
                                }
                            >
                                {!step
                                    ? "YES. I WANT TO"
                                    : step !== 3
                                    ? "CLOSE"
                                    : "BACK TO DASHBOARD"}
                            </button>

                            {!step && (
                                <div className={`flex`}>
                                    <button
                                        type="button"
                                        className={`w-full text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors hover:bg-mvx-blue/[.02]`}
                                        onClick={() => {
                                            setStep(1);
                                        }}
                                    >
                                        NOT SURE
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        className={`w-full text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors hover:bg-mvx-blue/[.02]`}
                                    >
                                        I HAVE A FORWARDER.
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <form onSubmit={inviteFFReq}>
                            <p className="text-[20px] text-center mb-3 font-semibold px-6">
                                Invite Freight Forwarder
                            </p>
                            <p className="text-sm text-center px-6 mb-8 leading-[20px]">
                                By inviting a freight forwarder to join Fleet+, you can access a
                                wider range of shipping options
                            </p>

                            <p className="text-sm mb-1 font-rocGrotesk font-medium">
                                Business Name
                            </p>
                            <input
                                className="placeholder:text-[13px] text-sm py-2 px-3 w-full font-rocGroteskMedium placeholder:font-rocGroteskMedium"
                                placeholder="Enter freight forwarder’s business name"
                                onChange={setBusinessName}
                            />
                            <div className={`flex ${inviteFFLoading && "pointer-events-none"}`}>
                                <button
                                    type="button"
                                    className={`w-full text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors hover:bg-mvx-blue/[.02]`}
                                    onClick={() => {
                                        setStep(0);
                                    }}
                                >
                                    GO BACK
                                </button>
                                <button
                                    // onClick={() => setStep(2)}
                                    className={`w-full text-mvx-neutral text-xs font-medium flex items-center justify-center bg-white py-5 px-3 transition-colors hover:bg-mvx-blue/[.02]`}
                                >
                                    {inviteFFLoading ? (
                                        <Loader color="gun-metal" size={4} />
                                    ) : (
                                        "SEND REQUEST"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </>
            )}
        </>
    );
};

export default CreateQuote;
