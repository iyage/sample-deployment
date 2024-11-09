import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";
import { quoteService } from "services";
import newTag from "assets/images/new_tag.svg";

const NewIncomingQuote = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["fetchIncomingQuoteRequest"],
        queryFn: () => quoteService.fetchIncomingQuoteRequests(1),
    });
    const navigate = useNavigate();

    const incomingQuoteRequest = data?.data?.data?.at(0);

    if (isLoading || !data?.data?.data?.length) return null;
    return (
        <div className="py-1.5 flex justify-center gap-2 items-center bg-tradeally-light-green">
            <img src={newTag} alt="new tag" />
            <p className="text-xs flex items-center gap-1 max-sm:hidden">
                <span className="font-rocGroteskBold">New Quote Response:</span> Quote sent from{" "}
                {incomingQuoteRequest?.sender?.profile?.businessName} for shipment No. TA{" "}
                {incomingQuoteRequest?.shipment?.mvxid}{" "}
                <span
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => navigate("/dashboard/quote-requests")}
                >
                    <span className="font-rocGroteskMedium ml-2 underline">View</span>{" "}
                    <span className="material-icons-outlined text-sm">east</span>
                </span>
            </p>
            <p className="text-xs hidden items-center gap-1 max-sm:flex">
                New Quote Response
                <span
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => navigate("/dashboard/quote-requests")}
                >
                    <span className="font-rocGroteskMedium ml-2 underline">View</span>{" "}
                    <span className="material-icons-outlined text-sm">east</span>
                </span>
            </p>
        </div>
    );
};

export default NewIncomingQuote;
