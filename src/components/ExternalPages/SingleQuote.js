import { quoteActions } from "actions";
import Loader from "components/common/Loader";
import Quote from "components/common/Quote";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";

const SingleQuote = () => {
    const { quoteId } = useParams();
    const dispatch = useDispatch();
    const [queryParams] = useSearchParams();
    const quoteRequestId = queryParams.get("quoteRequestId");
    const token = queryParams.get("token");
    const { singleQuoteData, isFetchingSingleQuote, singleQuoteReqLoading, singleQuoteReq } =
        useSelector((state) => state.quote);

    useEffect(() => {
        if (Boolean(quoteRequestId) && Boolean(token)) {
            dispatch(quoteActions.fetchSingleQuoteRequest(quoteRequestId, token));
        }
        dispatch(quoteActions.fetchSingleQuote(quoteId));
    }, [quoteId, dispatch, quoteRequestId, token]);

    if (isFetchingSingleQuote || !singleQuoteData || singleQuoteReqLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader color="mvx-black" size={10} />
            </div>
        );
    }

    return (
        <div className="bg-mvx-light-blue flex flex-col items-center justify-center">
            <div className="w-full">
                <Quote
                    singleQuoteData={singleQuoteData}
                    portOfLoading={singleQuoteReq?.portOfLoading}
                    destinationPort={singleQuoteReq?.portOfDestination}
                    isResponsive={false}
                />
            </div>
            <p className="font-rocGroteskMedium text-base text-mvx-neutral mb-4">
                Powered by <span className="font-rocGroteskBold text-mvx-neutral">Fleet+</span>
            </p>
        </div>
    );
};

export default SingleQuote;
