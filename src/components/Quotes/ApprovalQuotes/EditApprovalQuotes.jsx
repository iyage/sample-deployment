/* eslint-disable no-unused-vars */
import { useQuery } from "@tanstack/react-query";
import Loader from "components/common/Loader";
import { quoteConstants } from "constants";
import React from "react";
import { useParams } from "react-router-dom";
import { quoteService } from "services";
import EditApprovalQuoteNav from "./components/EditApprovalQuoteNav";
import FeedbackBar from "./components/FeedbackBar";
import useRouteQuery from "hooks/useRouteQuery";
import VersionHistoryBar from "./components/VersionHistoryBar";
import QuoteForm from "../components/QuoteForm";

const EditApprovalQuotes = () => {
    const { quoteId } = useParams();
    const { searchParams } = useRouteQuery();
    // const tab = searchParams.get("tab") ?? "";
    const { isLoading, data } = useQuery({
        queryFn: () => quoteService.fetchSingleApprovalQuote(quoteId),
        enabled: !!quoteId,
        queryKey: [quoteId, quoteConstants.FETCH_SINGLE_APPROVAL_QUOTE],
    });
    const quote = data?.data?.data || {};

    const { data: logsData } = useQuery({
        queryFn: () => quoteService.fetchSingleApprovalQuoteLogs(quoteId),
        enabled: !!quoteId,
        queryKey: [quoteId, quoteConstants.FETCH_SINGLE_APPROVAL_QUOTE_LOG],
        retry: false,
    });

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen relative bg-neutral-n-10">
            <EditApprovalQuoteNav quote={quote} />
            <FeedbackBar feedback={logsData?.data?.feedback} />
            <div className="px-[300px] py-[100px]">
                <QuoteForm handleSubmit={() => {}} quote={quote} />
            </div>
            <VersionHistoryBar logs={logsData?.data?.logs} />
        </div>
    );
};

export default EditApprovalQuotes;
