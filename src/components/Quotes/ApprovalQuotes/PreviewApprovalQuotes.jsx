import { useQuery } from "@tanstack/react-query";
import Loader from "components/common/Loader";
import { quoteConstants } from "constants";
import React from "react";
import { useParams } from "react-router-dom";
import { quoteService } from "services";
import PreviewApprovalNav from "./components/PreviewApprovalNav";
import PreviewQuoteComponent from "../components/PreviewQuoteComponent";

const PreviewApprovalQuotes = () => {
    const { quoteId } = useParams();
    const { isLoading, data } = useQuery({
        queryFn: () => quoteService.fetchSingleApprovalQuote(quoteId),
        enabled: !!quoteId,
        queryKey: [quoteId, quoteConstants.FETCH_SINGLE_APPROVAL_QUOTE],
    });

    const quote = data?.data?.data || {};

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-neutral-n-20 relative">
            <PreviewApprovalNav quote={quote} />
            <div className="w-full px-[144px] pt-[130px] bg-neutral-n-20 overflow-y-scroll">
                <PreviewQuoteComponent
                    shipment={quote?.shipment}
                    quote={quote}
                    creator={quote?.creator}
                />
            </div>
            <div className="pt-[100px]"></div>
        </div>
    );
};

export default PreviewApprovalQuotes;
