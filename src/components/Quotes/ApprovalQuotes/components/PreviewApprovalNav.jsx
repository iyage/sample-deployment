import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import Button from "components/common/Button";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import useModal from "components/common/Modals/ModalProvider";

const PreviewApprovalNav = ({ quote }) => {
    const navigate = useNavigate();
    const { openModal } = useModal();
    return (
        <nav className="fixed top-0 z-40 left-0 right-0 py-4 bg-white pl-9 pr-[144px] shadow-[0px_8px_8px_-4px_rgba(16,24,40,0.03)]">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="w-9 h-9 rounded-full bg-neutral-n-20 flex items-center justify-center"
                        onClick={() => navigate(-1)}
                    >
                        <RiArrowLeftLine size="18px" />
                    </div>

                    <img
                        src="/img/quoteicon.svg"
                        alt="Quote Icon"
                        className="w-[40px] h-[40px] object-contain"
                    />

                    <div className="">
                        <h1 className="font-rocGroteskBold text-[18px]">Preview Quote</h1>
                        <p className="font-rocGroteskMedium text-neutral-n-200">
                            Status:{" "}
                            <span className="capitalize text-neutral-n-200">{quote?.status}</span>
                        </p>
                    </div>
                </div>

                {quote?.status === "pending" && (
                    <div className="flex items-center gap-3">
                        <Button
                            className="py-2.5 px-5 bg-white border border-gun-metal rounded"
                            onClick={() =>
                                openModal("approve-quote", {
                                    quoteId: quote?._id,
                                    type: "accept",
                                    quote,
                                })
                            }
                        >
                            <div className="flex items-center gap-2">
                                <FaCheck className="text-gun-metal" size="15px" />
                                <h2 className="text-sm text-gun-metal font-rocGroteskMedium">
                                    Accept
                                </h2>
                            </div>
                        </Button>
                        <Button
                            className="py-2.5 px-5 bg-white border border-gun-metal rounded"
                            onClick={() =>
                                openModal("reject-quote", {
                                    quoteId: quote?._id,
                                    quote,
                                })
                            }
                        >
                            <div className="flex items-center gap-2">
                                <IoClose className="text-gun-metal" size="20px" />
                                <h2 className="text-sm text-gun-metal font-rocGroteskMedium">
                                    Reject
                                </h2>
                            </div>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default PreviewApprovalNav;
